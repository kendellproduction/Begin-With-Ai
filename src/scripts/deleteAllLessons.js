import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc, writeBatch } from 'firebase/firestore';

// Firebase config (update with your actual config)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteAllLessons() {
  console.log('🗑️  Starting to delete all lessons from Firebase...');
  
  try {
    // Get all learning paths
    const learningPathsRef = collection(db, 'learningPaths');
    const learningPathsSnapshot = await getDocs(learningPathsRef);
    
    let totalLessonsDeleted = 0;
    let totalModulesDeleted = 0;
    let totalPathsDeleted = 0;
    
    for (const pathDoc of learningPathsSnapshot.docs) {
      const pathId = pathDoc.id;
      const pathData = pathDoc.data();
      
      console.log(`\n📁 Processing learning path: ${pathData.title || pathId}`);
      
      // Get all modules in this path
      const modulesRef = collection(db, 'learningPaths', pathId, 'modules');
      const modulesSnapshot = await getDocs(modulesRef);
      
      for (const moduleDoc of modulesSnapshot.docs) {
        const moduleId = moduleDoc.id;
        const moduleData = moduleDoc.data();
        
        console.log(`  📂 Processing module: ${moduleData.title || moduleId}`);
        
        // Get all lessons in this module
        const lessonsRef = collection(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons');
        const lessonsSnapshot = await getDocs(lessonsRef);
        
        // Delete all lessons in batches
        const batch = writeBatch(db);
        let batchCount = 0;
        
        for (const lessonDoc of lessonsSnapshot.docs) {
          const lessonData = lessonDoc.data();
          console.log(`    🗑️  Deleting lesson: ${lessonData.title || lessonDoc.id}`);
          
          batch.delete(lessonDoc.ref);
          batchCount++;
          totalLessonsDeleted++;
          
          // Commit batch every 500 operations (Firestore limit)
          if (batchCount >= 500) {
            await batch.commit();
            batchCount = 0;
          }
        }
        
        // Commit any remaining operations
        if (batchCount > 0) {
          await batch.commit();
        }
        
        // Delete the module document itself
        console.log(`  🗑️  Deleting module: ${moduleData.title || moduleId}`);
        await deleteDoc(doc(db, 'learningPaths', pathId, 'modules', moduleId));
        totalModulesDeleted++;
      }
      
      // Delete the learning path document itself
      console.log(`🗑️  Deleting learning path: ${pathData.title || pathId}`);
      await deleteDoc(doc(db, 'learningPaths', pathId));
      totalPathsDeleted++;
    }
    
    console.log('\n✅ Database cleanup completed!');
    console.log(`📊 Summary:`);
    console.log(`   • ${totalLessonsDeleted} lessons deleted`);
    console.log(`   • ${totalModulesDeleted} modules deleted`);
    console.log(`   • ${totalPathsDeleted} learning paths deleted`);
    console.log('\n🎉 Database is now clean! You can start creating lessons from scratch.');
    
  } catch (error) {
    console.error('❌ Error deleting lessons:', error);
  }
}

// Run the deletion
deleteAllLessons(); 