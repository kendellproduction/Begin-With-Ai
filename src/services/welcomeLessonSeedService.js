import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { firstTimeUserWelcomeLesson, firstTimeUserWelcomeLessonSeed } from '../lessons/firstTimeUserLesson';

/**
 * Welcome Lesson Seeding Service
 * Seeds the first-time user welcome lesson to Firebase
 */

export class WelcomeLessonSeedService {
  static async seedWelcomeLesson() {
    try {
      const { lesson, pathId, moduleId, order, prerequisites } = firstTimeUserWelcomeLessonSeed;
      
      // Check if lesson already exists
      const lessonRef = doc(db, 'lessons', lesson.id);
      const lessonDoc = await getDoc(lessonRef);
      
      if (lessonDoc.exists()) {
        return { success: true, message: 'Welcome lesson already exists' };
      }
      
      // Seed the lesson
      await setDoc(lessonRef, lesson);
      
      // Seed learning path entry
      const pathRef = doc(db, 'learningPaths', pathId);
      const pathDoc = await getDoc(pathRef);
      
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
                order: order,
                prerequisites: prerequisites,
                isRequired: true
              }
            ]
          }
        ],
        metadata: {
          created: new Date(),
          isOnboardingPath: true,
          autoEnrollNewUsers: true
        }
      };
      
      if (!pathDoc.exists()) {
        await setDoc(pathRef, pathData);
      }
      
      return { 
        success: true, 
        message: 'Welcome lesson and onboarding path seeded successfully' 
      };
      
    } catch (error) {
      console.error('Error seeding welcome lesson:', error);
      throw error;
    }
  }
  
  static async createWelcomeBadge() {
    try {
      const badgeRef = doc(db, 'badges', 'welcome-to-ai');
      const badgeDoc = await getDoc(badgeRef);
      
      if (badgeDoc.exists()) {
        return;
      }
      
      const badgeData = {
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
          created: new Date(),
          isOnboardingBadge: true
        }
      };
      
      await setDoc(badgeRef, badgeData);
      
    } catch (error) {
      console.error('Error creating welcome badge:', error);
      throw error;
    }
  }
}

// Main seeding function
export const runWelcomeLessonSeeding = async () => {
  try {
    // Seed the welcome lesson and path
    const result = await WelcomeLessonSeedService.seedWelcomeLesson();
    
    // Create the welcome badge
    await WelcomeLessonSeedService.createWelcomeBadge();
    
    return result;
    
  } catch (error) {
    console.error('❌ Welcome lesson seeding failed:', error);
    throw error;
  }
}; 