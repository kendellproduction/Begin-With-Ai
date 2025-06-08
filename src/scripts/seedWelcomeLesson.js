import { runWelcomeLessonSeeding } from '../services/welcomeLessonSeedService.js';

/**
 * Script to seed the welcome lesson to Firebase
 * Run this to add the first-time user welcome lesson to your database
 */

const seedWelcomeLesson = async () => {
  console.log('🌱 Starting welcome lesson seeding script...');
  
  try {
    const result = await runWelcomeLessonSeeding();
    console.log('✅ Welcome lesson seeding completed successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Welcome lesson seeding failed:', error);
    process.exit(1);
  }
};

// Run the seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedWelcomeLesson();
}

export default seedWelcomeLesson; 