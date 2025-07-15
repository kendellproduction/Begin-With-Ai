import { useState, useEffect, createContext, useContext } from 'react';
import { 
  onAuthStateChanged, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  sendPasswordResetEmail,
  deleteUser
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { upsertUserProfile, getUserProfile, deleteUserFirestoreData } from '../services/firestoreService';
import { analytics } from '../utils/monitoring';
import { NewUserOnboardingService } from '../services/newUserOnboardingService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Handle potential redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          analytics.userLogin('google_redirect');
        }
      })
      .catch((error) => {
        console.error('Redirect sign-in error:', error);
        analytics.apiError('google_redirect_error', error.message);
        setError(error.message);
      });

    const unsubscribe = onAuthStateChanged(auth, 
      async (authUser) => {
        if (authUser) {
          try {
            // Track email verification status
            if (authUser.emailVerified) {
              analytics.emailVerified();
            }

            // Check if this is a new user and handle onboarding
            let isNewUser = false;
            try {
              isNewUser = await NewUserOnboardingService.isNewUser(authUser.uid);
              if (isNewUser) {
                await NewUserOnboardingService.enrollNewUser(authUser.uid, authUser);
              }
            } catch (onboardingError) {
              console.warn('Onboarding check/enrollment failed:', onboardingError);
              // Continue with normal flow even if onboarding fails
            }

            // First, ensure the profile is created or updated in Firestore
            // Wrapped in a try-catch to handle potential quota errors
            try {
              await upsertUserProfile(authUser);
            } catch (upsertError) {
              if (upsertError.code === 'resource-exhausted') {
                console.warn('Firestore quota exceeded during profile upsert. User data might be stale.');
                analytics.apiError('firestore_quota_exceeded', 'Profile upsert failed due to quota limit');
                // Proceed with authUser, but Firestore profile will likely fail to load or be incomplete.
              } else {
                // Rethrow other errors
                analytics.apiError('firestore_upsert_error', upsertError.message);
                throw upsertError;
              }
            }

            // Then, fetch the complete profile from Firestore
            // Wrapped in a try-catch to handle potential quota errors
            let firestoreProfile = null;
            try {
              firestoreProfile = await getUserProfile(authUser.uid);
            } catch (fetchError) {
              if (fetchError.code === 'resource-exhausted') {
                console.warn('Firestore quota exceeded during profile fetch. Using basic auth data.');
                analytics.apiError('firestore_quota_exceeded', 'Profile fetch failed due to quota limit');
                // Fallback to authUser data only.
              } else {
                // Rethrow other errors
                analytics.apiError('firestore_fetch_error', fetchError.message);
                throw fetchError;
              }
            }

            if (firestoreProfile) {
              // Combine authUser properties (like emailVerified, providerData) with Firestore profile
              setUser({ ...authUser, ...firestoreProfile }); 
            } else {
              // This case might happen if Firestore is down, quota exceeded, or profile genuinely doesn't exist
              console.warn(`Firestore profile not found or couldn't be fetched for ${authUser.uid}. Setting user to authUser only.`);
              setUser(authUser); 
            }
          } catch (profileError) {
            console.error('Error during profile processing after auth state change (outside specific quota checks):', profileError);
            analytics.apiError('auth_profile_error', profileError.message);
            // If profile operations fail (other than quota exceeded during specific steps), 
            // set user to basic authUser and potentially set an error state
            setUser(authUser); 
            // setError(profileError.message); // Or a more specific error
          }
        } else {
          setUser(null); // No authenticated user
        }
        setLoading(false);
      }, 
      (error) => {
        console.error('Auth state error:', error);
        analytics.apiError('auth_state_error', error.message);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
      // Force account selection by clearing any hints
      login_hint: '',
      hd: '' // Clear any domain hints
    });
    
    try {
      const result = await signInWithPopup(auth, provider);
      // Track successful Google sign-in
      analytics.userLogin('google');
      // onAuthStateChanged will handle user profile creation/fetching
      return result.user; // Still return the auth user for immediate use if needed by caller
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, provider);
      } else {
        console.error('Error signing in with Google:', error);
        analytics.apiError('google_signin_error', error.message);
        throw error;
      }
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Track successful email sign-in
      analytics.userLogin('email');
      // onAuthStateChanged will handle user profile creation/fetching
      return result.user;
    } catch (error) {
      console.error('Error signing in with email:', error);
      analytics.apiError('email_signin_error', error.message);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Track successful email sign-up
      analytics.userSignUp('email');
      // onAuthStateChanged will handle user profile creation/fetching
      return result.user;
    } catch (error) {
      console.error('Error signing up with email:', error);
      analytics.apiError('email_signup_error', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      analytics.apiError('logout_error', error.message);
      throw error;
    }
  };

  const switchAccount = async () => {
    try {
      // First, sign out completely
      await signOut(auth);
      
      // Clear any cached authentication data
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any Google-specific session data by revoking access
      if (window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance) {
          await authInstance.signOut();
          await authInstance.disconnect();
        }
      }
      
      // Wait a moment for the logout to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a new Google provider with explicit account selection
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
        // Force account selection by clearing any hints
        login_hint: '',
        hd: '' // Clear any domain hints
      });
      
      // Try popup first
      try {
        const result = await signInWithPopup(auth, provider);
        analytics.userLogin('google_switch');
        return result.user;
      } catch (popupError) {
        if (popupError.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, provider);
        } else {
          throw popupError;
        }
      }
    } catch (error) {
      console.error('Error switching account:', error);
      analytics.apiError('account_switch_error', error.message);
      throw error;
    }
  };

  const reauthenticateWithPassword = async (currentPassword) => {
    console.log('Attempting re-authentication...');
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in for re-authentication.');
    }
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
      console.log('Re-authentication successful.');
    } catch (error) {
      console.error('Error re-authenticating:', error);
      throw error; // Propagate error to be handled by the caller
    }
  };

  const updatePassword = async (newPassword) => {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in.');
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  const sendPasswordResetEmail = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  const deleteUserAccount = async (currentPassword) => {
    console.log('Attempting to delete user account...');
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in to delete the account.');
    }
    const userToDelete = auth.currentUser;

    try {
      // Step 1: Re-authenticate user
      console.log('Re-authenticating user for account deletion...');
      const credential = EmailAuthProvider.credential(userToDelete.email, currentPassword);
      await reauthenticateWithCredential(userToDelete, credential);
      console.log('Re-authentication successful for account deletion.');

      // Step 2: Delete user's Firestore data
      // It's generally safer to delete Firestore data BEFORE deleting the Auth user,
      // as you need the UID to easily locate the data.
      console.log(`Attempting to delete Firestore data for UID: ${userToDelete.uid}`);
      await deleteUserFirestoreData(userToDelete.uid);
      console.log('Firestore data deleted successfully.');

      // Step 3: Delete user from Firebase Authentication
      await deleteUser(userToDelete);
      console.log('Firebase Auth user deleted successfully.');
      // setUser(null) will be handled by onAuthStateChanged

      // Step 4: (Optional) Delete Stripe customer data via a Firebase Function if applicable
      // This would typically involve calling a Firebase Function that uses the Stripe Admin SDK.
      // Example: if (userToDelete.stripeCustomerId) { /* call cloud function */ }

    } catch (error) {
      console.error('Error deleting user account:', error);
      // Re-throw the error so it can be caught by the calling component (Settings.js)
      // and displayed to the user.
      throw error; 
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
    switchAccount,
    reauthenticateWithPassword,
    updatePassword,
    sendPasswordResetEmail,
    deleteUserAccount
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 