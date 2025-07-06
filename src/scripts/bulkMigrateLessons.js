// Bulk Lesson Migration Script
// Migrates all lessons from legacy formats to new admin format

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple logger for this script
const logger = {
  info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args)
};

const runBulkMigration = async () => {
  console.log('🚀 Starting bulk lesson migration...');
  
  // Import the migration classes and data
  console.log('📦 Loading migration utilities...');
  const { LessonFormatMigrator } = await import('../utils/lessonFormatMigration.js');
  const { MigrationValidator } = await import('../utils/migrationValidation.js');
  const localLessonsData = (await import('../utils/lessonsData.js')).default;
  const adaptiveLessons = (await import('../utils/adaptiveLessonData.js')).default;
  const { historyOfAiLesson } = await import('../utils/historyOfAiLesson.js');
  
  const allLessons = [];
  const migrationResults = {
    migrated: [],
    alreadyMigrated: [],
    failed: [],
    validated: []
  };

  try {
    // Collect all lessons from different sources
    console.log('📚 Collecting lessons from all sources...');

    // Add lessons from localLessonsData
    if (localLessonsData && typeof localLessonsData === 'object') {
      Object.values(localLessonsData).forEach(lesson => {
        if (lesson && lesson.id) {
          allLessons.push({
            ...lesson,
            source: 'local',
            originalLesson: lesson
          });
        }
      });
    }

    // Add lessons from adaptiveLessons
    if (adaptiveLessons && typeof adaptiveLessons === 'object') {
      Object.values(adaptiveLessons).forEach(lessonGroup => {
        if (Array.isArray(lessonGroup)) {
          lessonGroup.forEach(lesson => {
            if (lesson && lesson.id) {
              allLessons.push({
                ...lesson,
                source: 'adaptive',
                originalLesson: lesson
              });
            }
          });
        }
      });
    }

    // Add historyOfAiLesson (slides format)
    if (historyOfAiLesson && historyOfAiLesson.id) {
      allLessons.push({
        ...historyOfAiLesson,
        source: 'slides',
        originalLesson: historyOfAiLesson
      });
    }

    console.log(`📊 Found ${allLessons.length} lessons to analyze`);

    // Process each lesson
    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i];
      console.log(`\n🔄 Processing lesson ${i + 1}/${allLessons.length}: "${lesson.title || lesson.id}"`);

      try {
        // Detect format
        const format = LessonFormatMigrator.detectLessonFormat(lesson.originalLesson);
        console.log(`   📋 Format detected: ${format}`);

        if (format === 'admin_format') {
          console.log('   ✅ Already in admin format - skipping');
          migrationResults.alreadyMigrated.push(lesson);
          continue;
        }

        // Migrate lesson
        console.log('   🔧 Migrating to admin format...');
        const migratedLesson = LessonFormatMigrator.migrateLesson(lesson.originalLesson, format);
        
        // Validate migration
        console.log('   ✔️  Validating migrated lesson...');
        const validationResult = MigrationValidator.validateMigratedLesson(migratedLesson);
        
        if (validationResult.isValid) {
          console.log('   ✅ Migration successful and validated');
          migrationResults.migrated.push({
            originalLesson: lesson,
            migratedLesson: migratedLesson,
            format: format,
            validationResult: validationResult
          });
        } else {
          console.log('   ⚠️  Migration completed but has validation issues:');
          validationResult.errors.forEach(error => console.log(`      ❌ ${error}`));
          validationResult.warnings.forEach(warning => console.log(`      ⚠️  ${warning}`));
          
          migrationResults.validated.push({
            originalLesson: lesson,
            migratedLesson: migratedLesson,
            format: format,
            validationResult: validationResult
          });
        }

      } catch (error) {
        console.error(`   ❌ Failed to migrate lesson: ${error.message}`);
        migrationResults.failed.push({
          lesson: lesson,
          error: error.message,
          stack: error.stack
        });
      }
    }

    // Print final results
    console.log('\n🎉 Bulk migration completed!');
    console.log('=====================================');
    console.log(`📊 Total lessons processed: ${allLessons.length}`);
    console.log(`✅ Successfully migrated: ${migrationResults.migrated.length}`);
    console.log(`⚠️  Migrated with issues: ${migrationResults.validated.length}`);
    console.log(`🔄 Already migrated: ${migrationResults.alreadyMigrated.length}`);
    console.log(`❌ Failed: ${migrationResults.failed.length}`);

    if (migrationResults.migrated.length > 0) {
      console.log('\n✅ Successfully Migrated Lessons:');
      migrationResults.migrated.forEach((result, index) => {
        const lesson = result.migratedLesson;
        const blockCount = lesson.contentVersions?.free?.pages?.[0]?.blocks?.length || 0;
        console.log(`   ${index + 1}. "${lesson.title}" (${blockCount} content blocks)`);
      });
    }

    if (migrationResults.validated.length > 0) {
      console.log('\n⚠️  Migrated with Issues:');
      migrationResults.validated.forEach((result, index) => {
        const lesson = result.migratedLesson;
        console.log(`   ${index + 1}. "${lesson.title}"`);
        result.validationResult.errors.forEach(error => console.log(`      ❌ ${error}`));
        result.validationResult.warnings.forEach(warning => console.log(`      ⚠️  ${warning}`));
      });
    }

    if (migrationResults.failed.length > 0) {
      console.log('\n❌ Failed Migrations:');
      migrationResults.failed.forEach((result, index) => {
        console.log(`   ${index + 1}. "${result.lesson.title || result.lesson.id}": ${result.error}`);
      });
    }

    // Write results to file for reference
    const resultsFile = {
      timestamp: new Date().toISOString(),
      summary: {
        total: allLessons.length,
        migrated: migrationResults.migrated.length,
        validated: migrationResults.validated.length,
        alreadyMigrated: migrationResults.alreadyMigrated.length,
        failed: migrationResults.failed.length
      },
      results: migrationResults
    };

    console.log('\n💾 Migration results saved for reference');
    console.log('=====================================');
    
    return resultsFile;

  } catch (error) {
    console.error('💥 Bulk migration failed:', error);
    throw error;
  }
};

// Run the migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runBulkMigration()
    .then((results) => {
      console.log('\n🎊 All done! Lessons are now ready for editing in the admin panel.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export { runBulkMigration }; 