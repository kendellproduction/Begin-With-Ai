/**
 * Lessons Module Index
 * Exports all lesson data and utilities
 */

// First Time User Welcome Lesson
export { 
  firstTimeUserWelcomeLesson, 
  firstTimeUserWelcomeLessonSeed 
} from './firstTimeUserLesson.js';

// Vibe Code Video Game Lesson
export { 
  vibeCodeVideoGameLesson, 
  vibeCodeVideoGameLessonSeed 
} from './vibeCodeVideoGameLesson.js';

// Re-export seeding services for convenience
export { 
  WelcomeLessonSeedService,
  runWelcomeLessonSeeding 
} from '../services/welcomeLessonSeedService.js';

export { 
  VibeCodeLessonSeedService,
  runVibeCodeLessonSeeding 
} from '../services/vibeCodeLessonSeedService.js';

// Lesson type constants
export const LESSON_TYPES = {
  CONCEPT_EXPLANATION: 'concept_explanation_with_interaction',
  INTERACTIVE_VOCABULARY: 'interactive_vocabulary',
  INTERACTIVE_CODING: 'interactive_coding_with_ai',
  PROJECT_BASED: 'project_based_learning',
  ASSESSMENT: 'assessment_quiz'
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate', 
  ADVANCED: 'advanced'
};

// Learning path categories
export const LESSON_CATEGORIES = {
  CORE_SKILLS: 'Core Skills',
  CREATIVE_SKILLS: 'Creative Skills',
  TECHNICAL_SKILLS: 'Technical Skills',
  BUSINESS_APPLICATIONS: 'Business Applications'
}; 