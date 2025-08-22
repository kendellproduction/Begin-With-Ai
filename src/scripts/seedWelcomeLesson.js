import { db, doc, setDoc, getDoc, serverTimestamp } from '../../scripts/firestoreAdminCompat.js';
import { firstTimeUserWelcomeLesson, firstTimeUserWelcomeLessonSeed } from '../lessons/firstTimeUserLesson.js';

/**
 * Script to seed the welcome lesson to Firebase
 * Run this to add the first-time user welcome lesson to your database
 */

const seedWelcomeLesson = async () => {
  console.log('🌱 Starting welcome lesson seeding script...');

  try {
    const { lesson, pathId, moduleId, order, prerequisites } = firstTimeUserWelcomeLessonSeed;

    // Seed the lesson in top-level 'lessons' collection
    const lessonRef = doc(db, 'lessons', lesson.id);
    const existingLesson = await getDoc(lessonRef);
    if (!existingLesson.exists()) {
      await setDoc(lessonRef, {
        ...firstTimeUserWelcomeLesson,
        metadata: {
          ...(firstTimeUserWelcomeLesson.metadata || {}),
          created: serverTimestamp(),
          updated: serverTimestamp()
        }
      });
      console.log(`📝 Seeded lesson: ${lesson.id}`);
    } else {
      console.log(`ℹ️  Lesson already exists: ${lesson.id}`);
    }

    // Seed learning path document if needed
    const pathRef = doc(db, 'learningPaths', pathId);
    const pathSnap = await getDoc(pathRef);
    if (!pathSnap.exists()) {
      const pathData = {
        id: pathId,
        title: 'Welcome & Onboarding Path',
        description: 'A gentle introduction to AI for new users',
        category: 'Onboarding',
        difficulty: 'beginner',
        isActive: true,
        modules: [
          {
            id: moduleId,
            title: 'Welcome Module',
            lessons: [
              {
                lessonId: lesson.id,
                order,
                prerequisites,
                isRequired: true
              }
            ]
          }
        ],
        metadata: {
          created: serverTimestamp(),
          isOnboardingPath: true,
          autoEnrollNewUsers: true
        }
      };
      await setDoc(pathRef, pathData);
      console.log(`📚 Seeded learning path: ${pathId}`);
    } else {
      console.log(`ℹ️  Learning path exists: ${pathId}`);
    }

    // Seed welcome badge if needed
    const badgeRef = doc(db, 'badges', 'welcome-to-ai');
    const badgeSnap = await getDoc(badgeRef);
    if (!badgeSnap.exists()) {
      await setDoc(badgeRef, {
        id: 'welcome-to-ai',
        title: 'Welcome to AI',
        description: 'Completed your first AI lesson!',
        icon: '🎉',
        category: 'milestone',
        criteria: 'Complete the welcome lesson',
        xpReward: 10,
        rarity: 'common',
        isActive: true,
        metadata: {
          created: serverTimestamp(),
          isOnboardingBadge: true
        }
      });
      console.log('🏅 Seeded welcome badge');
    } else {
      console.log('ℹ️  Welcome badge exists');
    }

    console.log('✅ Welcome lesson seeding completed successfully!');
    return { success: true };
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