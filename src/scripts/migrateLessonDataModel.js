/**
 * Migration Script: Convert Lesson Data Model
 * From: difficulty-based system (Beginner/Intermediate/Advanced)
 * To: isPremium boolean system with dual content versions
 */

import { collection, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

// Migration configuration
const MIGRATION_CONFIG = {
  // Map old difficulty levels to new premium status
  difficultyMapping: {
    'Beginner': false,        // Beginner → Free
    'Intermediate': true,     // Intermediate → Premium
    'Advanced': true,         // Advanced → Premium
    'beginner': false,
    'intermediate': true,
    'advanced': true
  },
  
  // Batch size for Firestore operations
  batchSize: 500,
  
  // Backup collections
  backupCollections: true
};

/**
 * Migration utilities
 */
class DataMigrationUtils {
  static async backupCollection(collectionName, backupSuffix = '_backup') {
    console.log(`📦 Creating backup of ${collectionName}...`);
    
    try {
      const sourceRef = collection(db, collectionName);
      const snapshot = await getDocs(sourceRef);
      
      const batch = writeBatch(db);
      let operations = 0;
      
      snapshot.forEach((doc) => {
        const backupDocRef = doc(db, `${collectionName}${backupSuffix}`, doc.id);
        batch.set(backupDocRef, {
          ...doc.data(),
          backedUpAt: new Date().toISOString(),
          originalId: doc.id
        });
        operations++;
      });
      
      if (operations > 0) {
        await batch.commit();
        console.log(`✅ Backed up ${operations} documents to ${collectionName}${backupSuffix}`);
      }
      
      return operations;
    } catch (error) {
      console.error(`❌ Error backing up ${collectionName}:`, error);
      throw error;
    }
  }
  
  static transformLessonData(lessonData) {
    const { difficulty, ...otherData } = lessonData;
    
    // Determine isPremium based on difficulty
    const isPremium = MIGRATION_CONFIG.difficultyMapping[difficulty] || false;
    
    // Create dual content versions
    const contentVersions = {
      free: {
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content || [],
        learningObjectives: lessonData.learningObjectives || [],
        estimatedTimeMinutes: lessonData.estimatedTimeMinutes || 15,
        xpAward: lessonData.xpAward || 10
      },
      premium: {
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content || [],
        learningObjectives: lessonData.learningObjectives || [],
        estimatedTimeMinutes: (lessonData.estimatedTimeMinutes || 15) * 1.5, // Premium gets more content
        xpAward: (lessonData.xpAward || 10) * 2 // Premium gets more XP
      }
    };
    
    return {
      ...otherData,
      isPremium,
      contentVersions,
      migrationMetadata: {
        migratedAt: new Date().toISOString(),
        originalDifficulty: difficulty,
        migrationVersion: '1.0'
      }
    };
  }
}

/**
 * Main migration functions
 */
export class LessonDataMigration {
  static async migrateLearningPaths() {
    console.log('🚀 Starting Learning Paths migration...');
    
    try {
      // Backup existing data
      if (MIGRATION_CONFIG.backupCollections) {
        await DataMigrationUtils.backupCollection('learningPaths');
      }
      
      const pathsRef = collection(db, 'learningPaths');
      const pathsSnapshot = await getDocs(pathsRef);
      
      let totalMigrated = 0;
      
      for (const pathDoc of pathsSnapshot.docs) {
        const pathData = pathDoc.data();
        console.log(`📁 Processing path: ${pathData.title}`);
        
        // Migrate modules within this path
        const modulesRef = collection(db, 'learningPaths', pathDoc.id, 'modules');
        const modulesSnapshot = await getDocs(modulesRef);
        
        for (const moduleDoc of modulesSnapshot.docs) {
          const moduleData = moduleDoc.data();
          console.log(`  📂 Processing module: ${moduleData.title}`);
          
          // Migrate lessons within this module
          const lessonsRef = collection(db, 'learningPaths', pathDoc.id, 'modules', moduleDoc.id, 'lessons');
          const lessonsSnapshot = await getDocs(lessonsRef);
          
          const batch = writeBatch(db);
          let batchCount = 0;
          
          for (const lessonDoc of lessonsSnapshot.docs) {
            const lessonData = lessonDoc.data();
            
            // Skip if already migrated
            if (lessonData.migrationMetadata?.migrationVersion === '1.0') {
              console.log(`    ⏭️  Skipping already migrated lesson: ${lessonData.title}`);
              continue;
            }
            
            console.log(`    📄 Migrating lesson: ${lessonData.title} (${lessonData.difficulty})`);
            
            // Transform the lesson data
            const migratedData = DataMigrationUtils.transformLessonData(lessonData);
            
            // Add to batch
            const lessonDocRef = doc(db, 'learningPaths', pathDoc.id, 'modules', moduleDoc.id, 'lessons', lessonDoc.id);
            batch.update(lessonDocRef, migratedData);
            batchCount++;
            totalMigrated++;
            
            // Execute batch if it reaches the limit
            if (batchCount >= MIGRATION_CONFIG.batchSize) {
              await batch.commit();
              console.log(`    ✅ Committed batch of ${batchCount} lessons`);
              batchCount = 0;
            }
          }
          
          // Commit remaining batch
          if (batchCount > 0) {
            await batch.commit();
            console.log(`    ✅ Committed final batch of ${batchCount} lessons`);
          }
        }
      }
      
      console.log(`🎉 Migration complete! Migrated ${totalMigrated} lessons`);
      return { success: true, migratedCount: totalMigrated };
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
  
  static async migrateLocalLessonsData() {
    console.log('🔄 Migrating local lessons data...');
    
    try {
      // Note: localLessonsData file removed - migration should handle database content only
      console.log('Static lesson data removed - skipping local lessons migration');
             return { 
         skipped: true, 
         reason: 'Static lesson data files removed - migrations should work with database content only' 
       };
      
    } catch (error) {
      console.error('❌ Local migration failed:', error);
      throw error;
    }
  }
  
  static async validateMigration() {
    console.log('🔍 Validating migration...');
    
    try {
      const pathsRef = collection(db, 'learningPaths');
      const pathsSnapshot = await getDocs(pathsRef);
      
      let totalLessons = 0;
      let migratedLessons = 0;
      let errors = [];
      
      for (const pathDoc of pathsSnapshot.docs) {
        const modulesRef = collection(db, 'learningPaths', pathDoc.id, 'modules');
        const modulesSnapshot = await getDocs(modulesRef);
        
        for (const moduleDoc of modulesSnapshot.docs) {
          const lessonsRef = collection(db, 'learningPaths', pathDoc.id, 'modules', moduleDoc.id, 'lessons');
          const lessonsSnapshot = await getDocs(lessonsRef);
          
          lessonsSnapshot.forEach((lessonDoc) => {
            const lessonData = lessonDoc.data();
            totalLessons++;
            
            // Check if lesson has been migrated
            if (lessonData.migrationMetadata?.migrationVersion === '1.0') {
              migratedLessons++;
              
              // Validate structure
              if (!lessonData.hasOwnProperty('isPremium')) {
                errors.push(`Lesson ${lessonDoc.id} missing isPremium field`);
              }
              if (!lessonData.contentVersions || !lessonData.contentVersions.free || !lessonData.contentVersions.premium) {
                errors.push(`Lesson ${lessonDoc.id} missing contentVersions structure`);
              }
            }
          });
        }
      }
      
      console.log(`📊 Migration Validation Results:`);
      console.log(`   Total lessons: ${totalLessons}`);
      console.log(`   Migrated lessons: ${migratedLessons}`);
      console.log(`   Migration rate: ${((migratedLessons / totalLessons) * 100).toFixed(1)}%`);
      
      if (errors.length > 0) {
        console.log(`❌ Validation errors found: ${errors.length}`);
        errors.forEach(error => console.log(`   - ${error}`));
      } else {
        console.log('✅ All migrated lessons passed validation');
      }
      
      return {
        totalLessons,
        migratedLessons,
        errors,
        migrationRate: (migratedLessons / totalLessons) * 100
      };
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      throw error;
    }
  }
}

/**
 * CLI interface for running migrations
 */
export const runMigration = async (options = {}) => {
  const { validateOnly = false, includeLocal = true } = options;
  
  try {
    console.log('🎯 Starting Lesson Data Model Migration');
    console.log('=' .repeat(50));
    
    if (validateOnly) {
      // Only run validation
      const validationResult = await LessonDataMigration.validateMigration();
      return validationResult;
    }
    
    // Run full migration
    const results = {
      firestore: await LessonDataMigration.migrateLearningPaths(),
      validation: await LessonDataMigration.validateMigration()
    };
    
    if (includeLocal) {
      results.local = await LessonDataMigration.migrateLocalLessonsData();
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log('📋 Next steps:');
    console.log('   1. Update your local lessonsData.js file');
    console.log('   2. Test the new admin panel');
    console.log('   3. Verify Free/Premium content switching');
    
    return results;
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    throw error;
  }
};

// Make runMigration available globally in development
if (process.env.NODE_ENV === 'development') {
  window.runLessonMigration = runMigration;
  window.validateLessonMigration = () => runMigration({ validateOnly: true });
}

export default LessonDataMigration; 