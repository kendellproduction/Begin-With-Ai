// Simple script to clear all lessons from database
import { db } from '../firebase.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

async function clearAllLessons() {
  console.log('🗑️  Clearing all lessons from database...');
  
  try {
    // Get all learning paths
    const pathsSnapshot = await getDocs(collection(db, 'learningPaths'));
    
    let deleted = 0;
    
    for (const pathDoc of pathsSnapshot.docs) {
      console.log(`Deleting learning path: ${pathDoc.id}`);
      await deleteDoc(doc(db, 'learningPaths', pathDoc.id));
      deleted++;
    }
    
    console.log(`✅ Deleted ${deleted} learning paths`);
    console.log('🎉 Database cleared! Refresh your lessons page to see the empty state.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

clearAllLessons(); 