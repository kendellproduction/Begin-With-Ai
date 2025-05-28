import { useState, useEffect, createContext, useContext } from 'react';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword,
  sendPasswordResetEmail,
  deleteUser as firebaseDeleteUser
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { upsertUserProfile, getUserProfile, deleteUserFirestoreData } from '../services/firestoreService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, 
      async (authUser) => {
        console.log('Auth state changed:', authUser ? 'User logged in' : 'No user');
        if (authUser) {
          try {
            // First, ensure the profile is created or updated in Firestore
            await upsertUserProfile(authUser);
            console.log('User profile upserted after auth state change.');

            // Then, fetch the complete profile from Firestore
            const firestoreProfile = await getUserProfile(authUser.uid);
            console.log('Fetched Firestore profile:', firestoreProfile);

            if (firestoreProfile) {
              // Combine authUser properties (like emailVerified, providerData) with Firestore profile
              setUser({ ...authUser, ...firestoreProfile }); 
            } else {
              // This case should ideally not happen if upsertUserProfile worked,
              // but as a fallback, set user to the authUser.
              // Log a warning, as this means Firestore data is missing.
              console.warn(`Firestore profile not found for ${authUser.uid} after upsert. Setting user to authUser only.`);
              setUser(authUser); 
            }
          } catch (profileError) {
            console.error('Error during profile processing after auth state change:', profileError);
            // If profile operations fail, set user to basic authUser and potentially set an error state
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
        setError(error.message);
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up auth state listener...');
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    console.log('Attempting Google sign in...');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle user profile creation/fetching
      console.log('Google sign in successful, onAuthStateChanged will process profile.');
      return result.user; // Still return the auth user for immediate use if needed by caller
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    console.log('Attempting email sign in...');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle user profile creation/fetching
      console.log('Email sign in successful, onAuthStateChanged will process profile.');
      return result.user;
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password) => {
    console.log('Attempting email sign up...');
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle user profile creation/fetching
      console.log('Email sign up successful, onAuthStateChanged will process profile.');
      return result.user;
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Attempting logout...');
    try {
      await firebaseSignOut(auth);
      console.log('Logout successful');
    } catch (error) {
      console.error('Error signing out:', error);
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

  const updateUserPassword = async (newPassword) => {
    console.log('Attempting to update password...');
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in to update password.');
    }
    try {
      await firebaseUpdatePassword(auth.currentUser, newPassword);
      console.log('Password updated successfully in Firebase Auth.');
      // Optionally, you might want to update a 'passwordLastChangedAt' field in Firestore here
    } catch (error) {
      console.error('Error updating password:', error);
      throw error; // Propagate error
    }
  };

  const sendPasswordReset = async (email) => {
    console.log(`Attempting to send password reset email to ${email}...`);
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent successfully.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error; // Propagate error to be handled by the caller
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
      await firebaseDeleteUser(userToDelete);
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
    reauthenticateWithPassword,
    updateUserPassword,
    sendPasswordReset,
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