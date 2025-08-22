/**
 * Script to seed the Vibe Code Video Game lesson
 * Run this script to add the lesson to your Firebase database
 * 
 * Usage:
 * 1. Make sure Firebase is configured
 * 2. Run: node src/scripts/seedVibeCodeLesson.js
 * or import and call runVibeCodeLessonSeeding() from your app
 */

import { db, doc, setDoc, getDoc, writeBatch, serverTimestamp } from '../../scripts/firestoreAdminCompat.js';
import { vibeCodeVideoGameLesson, vibeCodeVideoGameLessonSeed } from '../lessons/vibeCodeVideoGameLesson.js';

async function main() {
  try {
    console.log('🎮 Starting Vibe Code Video Game lesson seeding...\n');

    const batch = writeBatch(db);
    const { pathId, moduleId } = vibeCodeVideoGameLessonSeed;

    // Ensure learning path exists
    const pathRef = doc(db, 'learningPaths', pathId);
    const pathSnap = await getDoc(pathRef);
    if (!pathSnap.exists()) {
      batch.set(pathRef, {
        id: pathId,
        title: 'Vibe Coding',
        description: 'Learn creative coding by describing what you want and letting AI build it for you',
        category: 'Creative Skills',
        difficulty: 'Beginner to Intermediate',
        estimatedHours: 3,
        totalLessons: 4,
        icon: '🎮',
        color: 'from-purple-500 to-pink-600',
        isRecommended: true,
        isFlagship: false,
        published: true,
        isPremium: true,
        order: 3,
        created: serverTimestamp(),
        updated: serverTimestamp()
      });
    }

    // Ensure module exists
    const moduleRef = doc(db, 'learningPaths', pathId, 'modules', moduleId);
    const moduleSnap = await getDoc(moduleRef);
    if (!moduleSnap.exists()) {
      batch.set(moduleRef, {
        id: moduleId,
        title: 'Interactive Coding',
        description: 'Learn to create interactive content through AI-assisted coding',
        order: 1,
        created: serverTimestamp(),
        updated: serverTimestamp()
      });
    }

    // Upsert lesson
    const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', vibeCodeVideoGameLesson.id);
    batch.set(lessonRef, {
      ...vibeCodeVideoGameLesson,
      pathId,
      moduleId,
      created: serverTimestamp(),
      updated: serverTimestamp()
    });

    await batch.commit();

    console.log('\n✅ Success!');
    console.log(`📝 Lesson ID: ${vibeCodeVideoGameLesson.id}`);
    console.log(`📚 Path ID: ${pathId}`);
    console.log(`📖 Module ID: ${moduleId}`);
    console.log('🎯 Vibe Code Video Game lesson seeded successfully');
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