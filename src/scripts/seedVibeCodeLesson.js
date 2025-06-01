/**
 * Script to seed the Vibe Code Video Game lesson
 * Run this script to add the lesson to your Firebase database
 * 
 * Usage:
 * 1. Make sure Firebase is configured
 * 2. Run: node src/scripts/seedVibeCodeLesson.js
 * or import and call runVibeCodeLessonSeeding() from your app
 */

import { runVibeCodeLessonSeeding } from '../services/vibeCodeLessonSeedService.js';

async function main() {
  try {
    console.log('🎮 Starting Vibe Code Video Game lesson seeding...\n');
    
    const result = await runVibeCodeLessonSeeding();
    
    console.log('\n✅ Success!');
    console.log(`📝 Lesson ID: ${result.lessonId}`);
    console.log(`📚 Path ID: ${result.pathId}`);
    console.log(`📖 Module ID: ${result.moduleId}`);
    console.log(`🎯 ${result.message}`);
    
    console.log('\n🎉 The Vibe Code Video Game lesson is now available in your database!');
    console.log('Students can now access this lesson through the Vibe Coding learning path (Premium only).');
    
  } catch (error) {
    console.error('\n❌ Error seeding lesson:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as seedVibeCodeLesson }; 