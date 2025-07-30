import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const DatabaseCleaner = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState('');

  const clearAllLessons = async () => {
    if (!confirm('Are you sure you want to delete ALL lessons from the database? This cannot be undone!')) {
      return;
    }

    setIsDeleting(true);
    setStatus('🗑️ Starting deletion...');

    try {
      // Get all learning paths
      const pathsSnapshot = await getDocs(collection(db, 'learningPaths'));
      
      let deletedPaths = 0;
      let deletedModules = 0;
      let deletedLessons = 0;
      
      for (const pathDoc of pathsSnapshot.docs) {
        setStatus(`Deleting learning path: ${pathDoc.id}`);
        
        // Delete modules subcollection
        const modulesSnapshot = await getDocs(collection(db, 'learningPaths', pathDoc.id, 'modules'));
        for (const moduleDoc of modulesSnapshot.docs) {
          // Delete lessons subcollection
          const lessonsSnapshot = await getDocs(collection(db, 'learningPaths', pathDoc.id, 'modules', moduleDoc.id, 'lessons'));
          for (const lessonDoc of lessonsSnapshot.docs) {
            await deleteDoc(lessonDoc.ref);
            deletedLessons++;
          }
          
          await deleteDoc(moduleDoc.ref);
          deletedModules++;
        }
        
        // Delete the path document
        await deleteDoc(pathDoc.ref);
        deletedPaths++;
      }
      
      setStatus(`✅ Successfully deleted ${deletedPaths} paths, ${deletedModules} modules, and ${deletedLessons} lessons! Database is now clean.`);
      
    } catch (error) {
      console.error('Error deleting lessons:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">🗑️ Database Cleaner</h3>
      <p className="text-gray-300 mb-4">
        This will delete ALL lessons, modules, and learning paths from the database.
      </p>
      
      <button
        onClick={clearAllLessons}
        disabled={isDeleting}
        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
      >
        {isDeleting ? 'Deleting...' : 'Clear All Lessons'}
      </button>
      
      {status && (
        <div className="mt-4 p-3 bg-gray-700 rounded text-white">
          {status}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-400">
        <p><strong>What this does:</strong></p>
        <ul className="list-disc list-inside">
          <li>Deletes all learning paths</li>
          <li>Removes all modules and lessons</li>
          <li>Clears the entire lesson database</li>
        </ul>
        <p className="mt-2 text-yellow-400">⚠️ This action cannot be undone!</p>
      </div>
    </div>
  );
};

export default DatabaseCleaner; 