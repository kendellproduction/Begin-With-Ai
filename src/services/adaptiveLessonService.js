import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  promptEngineeringMasteryPath,
  vibeCodePath,
  adaptiveModules, 
  adaptiveLessons 
} from '../utils/adaptiveLessonData';

/**
 * Adaptive Lesson Service - Handles dynamic lesson content and difficulty adaptation
 */
export class AdaptiveLessonService {
  
  /**
   * Seed the database with adaptive lesson data
   */
  static async seedAdaptiveLessons() {
    const batch = writeBatch(db);
    
    try {
      // Define all learning paths to seed
      const learningPaths = [promptEngineeringMasteryPath, vibeCodePath];
      
      for (const path of learningPaths) {
        // 1. Create the learning path
        const pathRef = doc(db, 'learningPaths', path.id);
        batch.set(pathRef, {
          ...path,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // 2. Create modules for the path
        const pathModules = adaptiveModules[path.id] || [];
        
        for (const module of pathModules) {
          const moduleRef = doc(db, 'learningPaths', path.id, 'modules', module.id);
          batch.set(moduleRef, {
            ...module,
            pathId: path.id,
            createdAt: serverTimestamp()
          });
        }

        // 3. Create adaptive lessons for each module in this path
        for (const module of pathModules) {
          const moduleId = module.id;
          const lessons = adaptiveLessons[moduleId] || [];
          
          for (const lesson of lessons) {
            const lessonRef = doc(db, 'learningPaths', path.id, 'modules', moduleId, 'lessons', lesson.id);
            batch.set(lessonRef, {
              ...lesson,
              pathId: path.id,
              moduleId,
              createdAt: serverTimestamp()
            });
          }
        }
      }

      await batch.commit();
      console.log('All adaptive lessons seeded successfully!');
      return { success: true, message: 'All adaptive lesson data seeded successfully, including Vibe Coding path' };
      
    } catch (error) {
      console.error('Error seeding adaptive lessons:', error);
      throw new Error(`Failed to seed adaptive lessons: ${error.message}`);
    }
  }

  /**
   * Get lesson content adapted for user's skill level
   */
  static async getAdaptedLesson(pathId, moduleId, lessonId, userSkillLevel = 'intermediate') {
    try {
      const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', lessonId);
      const lessonDoc = await getDoc(lessonRef);
      
      if (!lessonDoc.exists()) {
        throw new Error('Lesson not found');
      }

      const lessonData = lessonDoc.data();
      
      // Adapt content based on user skill level
      const adaptedContent = this.adaptContentForSkillLevel(lessonData, userSkillLevel);
      
      return {
        ...lessonData,
        adaptedContent,
        userSkillLevel,
        adaptationApplied: true
      };
      
    } catch (error) {
      console.error('Error getting adapted lesson:', error);
      throw error;
    }
  }

  /**
   * Adapt lesson content based on user skill level
   */
  static adaptContentForSkillLevel(lessonData, skillLevel) {
    // Handle case where lesson data might not have the expected structure
    if (!lessonData.content || !lessonData.sandbox || !lessonData.assessment) {
      return {
        content: {
          introduction: lessonData.coreConcept || 'Introduction content',
          mainContent: lessonData.coreConcept || 'Main content',
          examples: [],
          keyPoints: []
        },
        sandbox: {
          instructions: 'Interactive exercise instructions',
          exercises: [],
          hints: []
        },
        assessment: {
          questions: [],
          passingScore: 70
        },
        xpReward: lessonData.xpRewards?.[skillLevel] || lessonData.xpRewards?.intermediate || 50,
        estimatedTime: lessonData.estimatedTime?.[skillLevel] || lessonData.estimatedTime?.intermediate || 15,
        difficulty: skillLevel
      };
    }

    const { content, sandbox, assessment } = lessonData;
    
    // Get content for the specific skill level
    const levelContent = content?.[skillLevel] || content?.intermediate || content;
    const levelSandbox = sandbox?.[skillLevel] || sandbox?.intermediate || sandbox;
    const levelAssessment = assessment?.[skillLevel] || assessment?.intermediate || assessment;
    
    return {
      content: levelContent,
      sandbox: levelSandbox,
      assessment: levelAssessment,
      xpReward: lessonData.xpRewards?.[skillLevel] || lessonData.xpRewards?.intermediate || 50,
      estimatedTime: lessonData.estimatedTime?.[skillLevel] || lessonData.estimatedTime?.intermediate || 15,
      difficulty: skillLevel
    };
  }

  /**
   * Get learning path with user-specific adaptations
   */
  static async getAdaptedLearningPath(pathId, userProfile = {}) {
    try {
      // Get the base learning path
      const pathRef = doc(db, 'learningPaths', pathId);
      const pathDoc = await getDoc(pathRef);
      
      if (!pathDoc.exists()) {
        throw new Error(`Learning path '${pathId}' not found`);
      }

      const pathData = pathDoc.data();
      
      // Get all modules
      const modulesRef = collection(db, 'learningPaths', pathId, 'modules');
      const modulesSnapshot = await getDocs(modulesRef);
      
      const adaptedModules = [];
      
      for (const moduleDoc of modulesSnapshot.docs) {
        const moduleData = moduleDoc.data();
        
        // Get lessons for this module
        const lessonsRef = collection(db, 'learningPaths', pathId, 'modules', moduleDoc.id, 'lessons');
        const lessonsSnapshot = await getDocs(lessonsRef);
        
        const adaptedLessons = lessonsSnapshot.docs.map(lessonDoc => {
          const lessonData = lessonDoc.data();
          
          // Use default skill level if not provided
          const skillLevel = userProfile.skillLevel || 'intermediate';
          const adaptedContent = this.adaptContentForSkillLevel(lessonData, skillLevel);
          
          return {
            ...lessonData,
            adaptedContent,
            customizedForUser: true
          };
        }).sort((a, b) => (a.order || 0) - (b.order || 0));
        
        adaptedModules.push({
          ...moduleData,
          id: moduleDoc.id,
          lessons: adaptedLessons
        });
      }
      
      // Sort modules by order
      adaptedModules.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      const result = {
        ...pathData,
        modules: adaptedModules,
        adaptedForUser: userProfile,
        totalLessons: adaptedModules.reduce((total, module) => total + module.lessons.length, 0)
      };
      
      return result;
      
    } catch (error) {
      console.error('Error getting adapted learning path:', error);
      throw error;
    }
  }

  /**
   * Update user's difficulty preference based on performance
   */
  static determineNextDifficulty(currentLevel, performance) {
    const performanceThresholds = {
      excellent: 0.9,  // 90%+ accuracy
      good: 0.7,       // 70%+ accuracy
      struggling: 0.5  // Below 50% accuracy
    };

    if (performance >= performanceThresholds.excellent) {
      // User is doing very well, consider increasing difficulty
      if (currentLevel === 'beginner') return 'intermediate';
      if (currentLevel === 'intermediate') return 'advanced';
      return 'advanced';
    } else if (performance < performanceThresholds.struggling) {
      // User is struggling, consider decreasing difficulty
      if (currentLevel === 'advanced') return 'intermediate';
      if (currentLevel === 'intermediate') return 'beginner';
      return 'beginner';
    }
    
    // Performance is good, maintain current level
    return currentLevel;
  }

  /**
   * Get recommended next lessons based on user progress and preferences
   */
  static async getRecommendedLessons(userId, pathId, limit = 3) {
    try {
      // This would integrate with user progress tracking
      // For now, return a simplified recommendation
      
      const adaptedPath = await this.getAdaptedLearningPath(pathId, { skillLevel: 'intermediate' });
      
      // Find next uncompleted lessons
      const allLessons = adaptedPath.modules.flatMap(module => 
        module.lessons.map(lesson => ({
          ...lesson,
          moduleId: module.id,
          moduleName: module.title
        }))
      );
      
      // For demo purposes, return first few lessons
      return allLessons.slice(0, limit);
      
    } catch (error) {
      console.error('Error getting recommended lessons:', error);
      throw error;
    }
  }

  /**
   * Get lesson with sandbox configuration
   */
  static async getLessonWithSandbox(pathId, moduleId, lessonId, userSkillLevel) {
    const lesson = await this.getAdaptedLesson(pathId, moduleId, lessonId, userSkillLevel);
    
    // Configure sandbox based on lesson type and user level
    const sandboxConfig = this.configureSandbox(lesson);
    
    return {
      ...lesson,
      sandboxConfig
    };
  }

  /**
   * Configure sandbox based on lesson requirements
   */
  static configureSandbox(lesson) {
    const { sandbox, adaptedContent } = lesson;
    
    if (!sandbox || !adaptedContent.sandbox) {
      return null;
    }

    const sandboxType = sandbox.type;
    const sandboxContent = adaptedContent.sandbox;

    const baseConfig = {
      type: sandboxType,
      required: sandbox.required,
      instructions: sandboxContent.instructions,
      exercises: sandboxContent.exercises || [],
      hints: sandboxContent.hints || [],
      evaluation: sandboxContent.evaluation || 'completion'
    };

    // Type-specific configurations
    switch (sandboxType) {
      case 'ai_tool_matcher':
        return {
          ...baseConfig,
          scenarios: sandboxContent.scenarios || [],
          options: sandboxContent.options || [],
          allowMultipleAttempts: true
        };

      case 'prompt_builder':
        return {
          ...baseConfig,
          framework: sandboxContent.framework || {},
          templates: sandboxContent.templates || [],
          realTimeValidation: true
        };

      case 'creative_prompt_lab':
        return {
          ...baseConfig,
          tools: ['text', 'image', 'voice'],
          previewMode: true,
          shareResults: true
        };

      case 'vocabulary_practice':
        return {
          ...baseConfig,
          terms: sandboxContent.items || [],
          gameified: true,
          progressTracking: true
        };

      default:
        return baseConfig;
    }
  }

  /**
   * Track lesson completion with adaptive feedback
   */
  static async completeLessonWithAdaptation(userId, pathId, moduleId, lessonId, results) {
    try {
      // Calculate performance score
      const performance = this.calculatePerformance(results);
      
      // Determine if difficulty should be adjusted
      const currentLevel = results.difficulty || 'intermediate';
      const recommendedLevel = this.determineNextDifficulty(currentLevel, performance);
      
      // Store completion data with adaptation suggestions
      const completionData = {
        userId,
        pathId,
        moduleId, 
        lessonId,
        completedAt: serverTimestamp(),
        performance,
        currentDifficulty: currentLevel,
        recommendedDifficulty: recommendedLevel,
        adaptationSuggestion: recommendedLevel !== currentLevel,
        results
      };

      // This would integrate with the existing progress tracking system
      console.log('Lesson completion with adaptation:', completionData);
      
      return completionData;
      
    } catch (error) {
      console.error('Error completing lesson with adaptation:', error);
      throw error;
    }
  }

  /**
   * Calculate performance score from lesson results
   */
  static calculatePerformance(results) {
    if (!results) return 0.5;

    // Assessment performance
    const assessmentScore = results.assessmentScore || 0;
    
    // Sandbox completion
    const sandboxCompletion = results.sandboxCompleted ? 1 : 0;
    
    // Time efficiency (bonus for completing quickly but not too quickly)
    const timeScore = results.timeSpent && results.estimatedTime 
      ? Math.max(0, Math.min(1, results.estimatedTime / results.timeSpent))
      : 0.5;

    // Weighted average
    return (assessmentScore * 0.6) + (sandboxCompletion * 0.3) + (timeScore * 0.1);
  }
}

export default AdaptiveLessonService; 