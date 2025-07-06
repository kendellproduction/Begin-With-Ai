import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Sets the admin role for the current user
 * Run this in the browser console: setAdminRole('your-user-id')
 */
export const setAdminRole = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: 'admin'
    });
    console.log('✅ Admin role set successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error setting admin role:', error);
    return false;
  }
};

/**
 * Check current user's role
 */
export const checkUserRole = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('Current user role:', userData.role || 'no role set');
      return userData.role;
    } else {
      console.log('User document not found');
      return null;
    }
  } catch (error) {
    console.error('Error checking user role:', error);
    return null;
  }
};

// Make functions available globally in development
if (process.env.NODE_ENV === 'development') {
  window.setAdminRole = setAdminRole;
  window.checkUserRole = checkUserRole;
} 