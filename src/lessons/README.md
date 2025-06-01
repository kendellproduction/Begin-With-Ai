# BeginningWithAi Lessons Module

This module contains lesson data structures and seeding utilities for the BeginningWithAi platform.

## Overview

The lessons module provides:
- **Structured lesson data** following the platform's adaptive learning format
- **Seeding services** to add lessons to the Firebase database
- **Type definitions** and constants for consistency
- **Example implementations** for different lesson types

## Current Lessons

### Vibe Coding a Video Game
- **ID**: `vibe-code-video-game`
- **Type**: Interactive Coding with AI
- **Level**: Beginner  
- **Duration**: 15-25 minutes
- **Technology**: JavaScript, HTML, GPT-4o

Students learn to create browser games using natural language prompts and AI assistance.

## Creating New Lessons

### 1. Lesson Structure

Follow this structure when creating new lessons:

```javascript
export const myNewLesson = {
  id: 'unique-lesson-id',
  title: 'Lesson Title',
  lessonType: 'interactive_coding_with_ai', // see LESSON_TYPES
  order: 1,
  
  coreConcept: "Brief description of what students will learn",
  
  // Basic metadata
  basicDetails: {
    topic: 'Lesson Topic',
    gradeLevel: 'Beginner', // Beginner/Intermediate/Advanced
    duration: '20-30 minutes',
    technology: ['JavaScript', 'Python'] // Array of technologies
  },
  
  // Learning objectives
  learningObjectives: {
    primary: 'Main learning goal',
    outcomes: [
      'Specific skill 1',
      'Specific skill 2',
      'Specific skill 3'
    ]
  },
  
  // Prerequisites
  prerequisites: {
    existingKnowledge: 'What students should know beforehand',
    previousLessons: ['lesson-id-1', 'lesson-id-2']
  },
  
  // Adaptive content for different skill levels
  content: {
    beginner: {
      introduction: "Beginner-friendly introduction",
      mainContent: { /* structured content */ },
      exercises: [ /* array of exercises */ ]
    },
    // intermediate and advanced levels optional
  },
  
  // Interactive sandbox configuration
  sandbox: {
    required: true,
    type: 'coding_environment', // or 'quiz', 'simulation', etc.
    beginner: {
      instructions: "How to use the sandbox",
      interface: { /* UI configuration */ }
    }
  },
  
  // Assessment questions
  assessment: {
    beginner: [
      {
        question: "Question text?",
        options: ["Option 1", "Option 2", "Option 3"],
        correct: "Option 2",
        explanation: "Why this is correct"
      }
    ]
  },
  
  // Progress tracking
  progressTracking: {
    completionCriteria: ["Criteria 1", "Criteria 2"],
    xpRewards: {
      completion: 50,
      bonus: 20
    },
    skillsUnlocked: ["Skill 1", "Skill 2"]
  },
  
  // Database metadata
  metadata: {
    created: serverTimestamp(),
    version: 1,
    difficulty: 'beginner',
    category: 'Creative Coding',
    tags: ['game-dev', 'ai', 'javascript'],
    estimatedTime: 25,
    isPublished: true,
    isPremium: false
  }
};
```

### 2. Create Seeding Configuration

```javascript
export const myNewLessonSeed = {
  lesson: myNewLesson,
  pathId: 'learning-path-id',
  moduleId: 'module-id', 
  order: 1,
  prerequisites: ['prerequisite-lesson-ids']
};
```

### 3. Create Seeding Service

Create a seeding service in `src/services/` following the pattern in `vibeCodeLessonSeedService.js`.

### 4. Test Your Lesson

1. **Create the lesson file** in `src/lessons/`
2. **Add exports** to `src/lessons/index.js`
3. **Create seeding service** in `src/services/`
4. **Run seeding script** to add to database
5. **Test in the platform**

## Usage Examples

### Importing Lessons

```javascript
import { 
  vibeCodeVideoGameLesson,
  runVibeCodeLessonSeeding,
  LESSON_TYPES 
} from '../lessons';
```

### Seeding a Lesson

```javascript
import { runVibeCodeLessonSeeding } from '../lessons';

// Seed the lesson to database
const result = await runVibeCodeLessonSeeding();
console.log(result.message);
```

### Using Constants

```javascript
import { LESSON_TYPES, DIFFICULTY_LEVELS } from '../lessons';

const newLesson = {
  lessonType: LESSON_TYPES.INTERACTIVE_CODING,
  difficulty: DIFFICULTY_LEVELS.BEGINNER
};
```

## Lesson Types

- **CONCEPT_EXPLANATION**: Theory with interactive elements
- **INTERACTIVE_VOCABULARY**: Term learning with practice
- **INTERACTIVE_CODING**: Hands-on coding with AI assistance  
- **PROJECT_BASED**: Complete project development
- **ASSESSMENT**: Quiz and evaluation

## Security Considerations

### Sandbox Safety
- All user code runs in secure iframes
- Network access is disabled
- DOM access is limited
- CSP headers prevent XSS

### AI Integration
- Input sanitization for prompts
- Output validation for generated code
- Rate limiting for API calls
- Content filtering for inappropriate requests

## File Structure

```
src/lessons/
├── index.js                    # Module exports
├── README.md                   # This file
├── vibeCodeVideoGameLesson.js  # Vibe coding lesson
└── [future-lessons].js        # Additional lessons

src/services/
├── vibeCodeLessonSeedService.js  # Vibe coding seeding
└── [future-lesson-services].js  # Additional seeding services

src/scripts/
└── seedVibeCodeLesson.js       # Seeding script
```

## Contributing

When adding new lessons:

1. **Follow the established structure** for consistency
2. **Include all difficulty levels** when appropriate  
3. **Write comprehensive tests** for interactive elements
4. **Document security considerations** for any new sandbox types
5. **Update this README** with new lesson information

## Support

For questions about lesson development:
- Check existing lesson implementations
- Review the project's cursor rules
- Test thoroughly in the sandbox environment
- Follow security best practices 