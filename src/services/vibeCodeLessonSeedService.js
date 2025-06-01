import { 
  collection, 
  doc, 
  setDoc, 
  writeBatch,
  getDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase-node.js';
import { vibeCodeVideoGameLesson, vibeCodeVideoGameLessonSeed } from '../lessons/vibeCodeVideoGameLesson.js';

/**
 * Vibe Code Video Game Lesson Seeding Service
 * Handles adding the new lesson to the database
 */
export class VibeCodeLessonSeedService {
  
  /**
   * Seed the Vibe Code Video Game lesson to the database
   */
  static async seedVibeCodeLesson() {
    try {
      console.log('Starting Vibe Code Video Game lesson seeding...');
      
      const batch = writeBatch(db);
      
      // 1. Check if the learning path exists, create if needed
      const pathId = vibeCodeVideoGameLessonSeed.pathId;
      const pathRef = doc(db, 'learningPaths', pathId);
      const pathDoc = await getDoc(pathRef);
      
      if (!pathDoc.exists()) {
        // Create the Vibe Coding learning path
        const vibeCodePath = {
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
          prerequisites: ['prompt-engineering-mastery'],
          nextPaths: ['ai-for-content-creation'],
          targetAudience: ['creative-beginners', 'game-enthusiasts', 'educators'],
          published: true,
          isPremium: true, // Premium learning path
          version: 1,
          order: 3,
          created: serverTimestamp(),
          updated: serverTimestamp()
        };
        
        batch.set(pathRef, vibeCodePath);
        console.log('Created Vibe Coding learning path');
      }
      
      // 2. Check if the module exists, create if needed
      const moduleId = vibeCodeVideoGameLessonSeed.moduleId;
      const moduleRef = doc(db, 'learningPaths', pathId, 'modules', moduleId);
      const moduleDoc = await getDoc(moduleRef);
      
      if (!moduleDoc.exists()) {
        const interactiveCodingModule = {
          id: moduleId,
          title: 'Interactive Coding',
          description: 'Learn to create interactive content through AI-assisted coding',
          order: 1,
          created: serverTimestamp(),
          updated: serverTimestamp()
        };
        
        batch.set(moduleRef, interactiveCodingModule);
        console.log('Created Interactive Coding module');
      }
      
      // 3. Add the Vibe Code Video Game lesson
      const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', vibeCodeVideoGameLesson.id);
      
      const lessonData = {
        ...vibeCodeVideoGameLesson,
        pathId: pathId,
        moduleId: moduleId,
        created: serverTimestamp(),
        updated: serverTimestamp()
      };
      
      batch.set(lessonRef, lessonData);
      console.log('Added Vibe Code Video Game lesson');
      
      // 4. Commit all changes
      await batch.commit();
      
      console.log('Vibe Code Video Game lesson seeded successfully!');
      return { 
        success: true, 
        message: 'Vibe Code Video Game lesson seeded successfully',
        lessonId: vibeCodeVideoGameLesson.id,
        pathId: pathId,
        moduleId: moduleId
      };
      
    } catch (error) {
      console.error('Error seeding Vibe Code lesson:', error);
      throw new Error(`Failed to seed Vibe Code lesson: ${error.message}`);
    }
  }
  
  /**
   * Update an existing Vibe Code lesson
   */
  static async updateVibeCodeLesson() {
    try {
      console.log('Updating Vibe Code Video Game lesson...');
      
      const pathId = vibeCodeVideoGameLessonSeed.pathId;
      const moduleId = vibeCodeVideoGameLessonSeed.moduleId;
      const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', vibeCodeVideoGameLesson.id);
      
      const lessonData = {
        ...vibeCodeVideoGameLesson,
        updated: serverTimestamp()
      };
      
      await setDoc(lessonRef, lessonData, { merge: true });
      
      console.log('Vibe Code Video Game lesson updated successfully!');
      return { 
        success: true, 
        message: 'Vibe Code Video Game lesson updated successfully',
        lessonId: vibeCodeVideoGameLesson.id
      };
      
    } catch (error) {
      console.error('Error updating Vibe Code lesson:', error);
      throw new Error(`Failed to update Vibe Code lesson: ${error.message}`);
    }
  }
  
  /**
   * Remove the Vibe Code lesson (for development/testing)
   */
  static async removeVibeCodeLesson() {
    try {
      console.log('Removing Vibe Code Video Game lesson...');
      
      const pathId = vibeCodeVideoGameLessonSeed.pathId;
      const moduleId = vibeCodeVideoGameLessonSeed.moduleId;
      const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', vibeCodeVideoGameLesson.id);
      
      await deleteDoc(lessonRef);
      
      console.log('Vibe Code Video Game lesson removed successfully!');
      return { 
        success: true, 
        message: 'Vibe Code Video Game lesson removed successfully'
      };
      
    } catch (error) {
      console.error('Error removing Vibe Code lesson:', error);
      throw new Error(`Failed to remove Vibe Code lesson: ${error.message}`);
    }
  }
  
  /**
   * Get the Vibe Code lesson data
   */
  static async getVibeCodeLesson() {
    try {
      const pathId = vibeCodeVideoGameLessonSeed.pathId;
      const moduleId = vibeCodeVideoGameLessonSeed.moduleId;
      const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', vibeCodeVideoGameLesson.id);
      
      const lessonDoc = await getDoc(lessonRef);
      
      if (!lessonDoc.exists()) {
        throw new Error('Vibe Code lesson not found');
      }
      
      return {
        success: true,
        lesson: lessonDoc.data()
      };
      
    } catch (error) {
      console.error('Error getting Vibe Code lesson:', error);
      throw new Error(`Failed to get Vibe Code lesson: ${error.message}`);
    }
  }
  
  /**
   * Check if the Vibe Code lesson exists
   */
  static async lessonExists() {
    try {
      const pathId = vibeCodeVideoGameLessonSeed.pathId;
      const moduleId = vibeCodeVideoGameLessonSeed.moduleId;
      const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', vibeCodeVideoGameLesson.id);
      
      const lessonDoc = await getDoc(lessonRef);
      return lessonDoc.exists();
      
    } catch (error) {
      console.error('Error checking if Vibe Code lesson exists:', error);
      return false;
    }
  }
}

// Utility function to run seeding from console or scripts
export const runVibeCodeLessonSeeding = async () => {
  try {
    const exists = await VibeCodeLessonSeedService.lessonExists();
    
    if (exists) {
      console.log('Vibe Code lesson already exists. Updating...');
      return await VibeCodeLessonSeedService.updateVibeCodeLesson();
    } else {
      console.log('Vibe Code lesson does not exist. Creating...');
      return await VibeCodeLessonSeedService.seedVibeCodeLesson();
    }
  } catch (error) {
    console.error('Failed to run Vibe Code lesson seeding:', error);
    throw error;
  }
}; 