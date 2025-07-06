import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Sets the admin role for the current user
 * Run this in the browser console: setAdminRole('your-user-id')
 */
export const setAdminRole = async (userId) => {
  try {
    // Validate input
    if (!userId || typeof userId !== 'string') {
      console.error('❌ Invalid userId. Please provide a valid user ID string.');
      return false;
    }

    console.log('🔍 Setting admin role for user:', userId);
    
    const userRef = doc(db, 'users', userId);
    
    // Check if user document exists
    console.log('🔍 Checking if user document exists...');
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      console.log('🔍 User document exists, updating with admin role...');
      // Document exists, update it
      await updateDoc(userRef, {
        role: 'admin',
        updatedAt: new Date()
      });
    } else {
      console.log('🔍 User document doesn\'t exist, creating new document with admin role...');
      // Document doesn't exist, create it
      await setDoc(userRef, {
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        uid: userId
      });
    }
    
    console.log('✅ Admin role set successfully!');
    console.log('🔄 Please refresh the page to see the changes.');
    return true;
  } catch (error) {
    console.error('❌ Error setting admin role:', error.message);
    console.error('🔍 Full error details:', error);
    
    // Provide specific error guidance
    if (error.code === 'permission-denied') {
      console.error('💡 Permission denied. Make sure you are logged in and the user ID matches your current user.');
    } else if (error.code === 'invalid-argument') {
      console.error('💡 Invalid argument. Please check that the user ID is correct.');
    }
    
    return false;
  }
};

/**
 * Check current user's role
 */
export const checkUserRole = async (userId) => {
  try {
    if (!userId || typeof userId !== 'string') {
      console.error('❌ Invalid userId. Please provide a valid user ID string.');
      return null;
    }

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('✅ Current user role:', userData.role || 'no role set');
      return userData.role;
    } else {
      console.log('⚠️ User document not found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error checking user role:', error.message);
    return null;
  }
};

/**
 * Quick setup function - gets current user ID and sets admin role
 */
export const quickSetAdmin = async () => {
  try {
    // Get current user from Firebase Auth
    const currentUser = window.auth?.currentUser || window.firebaseAuth?.currentUser;
    
    if (!currentUser) {
      console.error('❌ No authenticated user found. Please log in first.');
      return false;
    }
    
    console.log('🔍 Found current user:', currentUser.uid);
    return await setAdminRole(currentUser.uid);
  } catch (error) {
    console.error('❌ Error in quickSetAdmin:', error.message);
    return false;
  }
};

/**
 * Diagnostic function to check authentication state and user info
 */
export const diagnoseAuth = async () => {
  try {
    console.log('🔍 === AUTHENTICATION DIAGNOSTIC ===');
    
    // Check different auth sources
    const windowAuth = window.auth;
    const windowFirebaseAuth = window.firebaseAuth;
    const authCurrentUser = windowAuth?.currentUser;
    const firebaseAuthCurrentUser = windowFirebaseAuth?.currentUser;
    
    console.log('🔍 window.auth:', windowAuth ? 'Available' : 'Not available');
    console.log('🔍 window.firebaseAuth:', windowFirebaseAuth ? 'Available' : 'Not available');
    console.log('🔍 window.auth.currentUser:', authCurrentUser ? authCurrentUser.uid : 'Not found');
    console.log('🔍 window.firebaseAuth.currentUser:', firebaseAuthCurrentUser ? firebaseAuthCurrentUser.uid : 'Not found');
    
    // Try to get current user from React context
    const reactAuth = window.React && window.React.useContext;
    console.log('🔍 React context available:', reactAuth ? 'Yes' : 'No');
    
    // Get the most reliable user ID
    const currentUser = authCurrentUser || firebaseAuthCurrentUser;
    if (currentUser) {
      console.log('✅ Found authenticated user:', currentUser.uid);
      console.log('✅ User email:', currentUser.email);
      console.log('✅ User display name:', currentUser.displayName);
      
      // Check if user document exists
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('✅ User document exists with data:', userData);
      } else {
        console.log('⚠️ User document does not exist in Firestore');
      }
      
      return currentUser.uid;
    } else {
      console.log('❌ No authenticated user found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error in diagnoseAuth:', error.message);
    return null;
  }
};

/**
 * Force admin role using the correct authenticated user
 */
export const forceSetAdmin = async () => {
  try {
    console.log('🔍 === FORCE SET ADMIN ===');
    
    // First diagnose auth state
    const userId = await diagnoseAuth();
    
    if (!userId) {
      console.error('❌ Cannot proceed - no authenticated user found');
      return false;
    }
    
    console.log('🔍 Attempting to set admin role for authenticated user:', userId);
    
    // Try to set admin role
    const result = await setAdminRole(userId);
    
    if (result) {
      console.log('✅ SUCCESS! Admin role set. Please refresh the page.');
      return true;
    } else {
      console.log('❌ Failed to set admin role');
      return false;
    }
  } catch (error) {
    console.error('❌ Error in forceSetAdmin:', error.message);
    return false;
  }
};

// Make functions available globally in development
if (process.env.NODE_ENV === 'development') {
  window.setAdminRole = setAdminRole;
  window.checkUserRole = checkUserRole;
  window.quickSetAdmin = quickSetAdmin;
  window.diagnoseAuth = diagnoseAuth;
  window.forceSetAdmin = forceSetAdmin;
  
  // Add helpful instructions
  console.log('🛠️  Admin utilities available:');
  console.log('   forceSetAdmin() - 🚀 BEST OPTION - Forces admin role for current user');
  console.log('   diagnoseAuth() - 🔍 Debug authentication state');
  console.log('   setAdminRole("user-id") - Set admin role for specific user');
  console.log('   checkUserRole("user-id") - Check role for specific user');
  console.log('   quickSetAdmin() - Set admin role for current logged-in user');
} 