import { useState, useEffect, createContext, useContext } from 'react';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        console.log('Auth state changed:', user ? 'User logged in' : 'No user');
        setUser(user);
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
      console.log('Google sign in successful');
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    console.log('Attempting email sign in...');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Email sign in successful');
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
      console.log('Email sign up successful');
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

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout
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