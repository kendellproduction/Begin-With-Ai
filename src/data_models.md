# Backend Data Models for BeginningWithAi

This document outlines the proposed data structures for the backend, likely to be implemented using a Backend-as-a-Service (BaaS) like Firebase/Supabase or a custom backend with a NoSQL/SQL database.

## 1. Users

Stores information about each registered user.

```json
{
  "userId": "unique_user_id_string", // (e.g., Firebase Auth UID)
  "email": "user@example.com",
  "displayName": "User Name",
  "photoURL": "url_to_user_avatar.jpg", // Optional
  "createdAt": "timestamp",
  "lastLoginAt": "timestamp",
  "xp": 0, // Experience Points
  "streaks": {
    "currentStreak": 0,
    "longestStreak": 0,
    "lastActivityDate": "date"
  },
  "badges": ["badge_id_1", "badge_id_2"], // Array of Badge IDs
  "currentLearningPathId": "path_id_string", // ID of the learning path the user is currently on
  "currentLessonModuleId": "module_id_string", // ID of the current module in the path
  "currentLessonId": "lesson_id_string", // ID of the current lesson
  "subscriptionTier": "free", // e.g., "free", "premium_monthly", "premium_yearly", "premium_manual_override"
  "subscriptionValidUntil": null, // Timestamp, for time-based subscriptions
  "stripeCustomerId": null, // String, to link with Stripe customer ID
  "role": "user", // "user", "admin", "developer"
  "preferences": {
    "theme": "dark", // 'light', 'dark', 'system'
    "notifications": true
  },
  "providerData": [ // Information from auth providers like Google, Apple
    {
      "providerId": "google.com",
      "uid": "google_specific_uid",
      "email": "user@gmail.com"
      // ... other provider-specific data
    }
  ]
}
```

## 2. LearningPaths

Defines a high-level learning track or course. This helps structure content like Mimo's paths.

```json
{
  "learningPathId": "unique_path_id_string",
  "title": "AI Fundamentals",
  "description": "Understand the basics of Artificial Intelligence, LLMs, and prompt engineering.",
  "iconUrl": "url_to_path_icon.svg",
  "estimatedDuration": "e.g., 2 hours",
  "targetAudience": ["beginner", "intermediate"], // Array of strings
  "moduleOrder": ["module_id_1", "module_id_2", "module_id_3"], // Ordered list of LessonModule IDs
  "published": true,
  "isPremium": false, // Boolean, true if this path requires a subscription
  "version": 1
}
```

## 3. LessonModules

Represents a chapter or a logical group of lessons within a LearningPath.

```json
{
  "lessonModuleId": "unique_module_id_string",
  "learningPathId": "parent_path_id_string", // Foreign key to LearningPaths
  "title": "Introduction to Large Language Models",
  "description": "Learn what LLMs are, how they work, and their capabilities.",
  "lessonOrder": ["lesson_id_A", "lesson_id_B", "lesson_id_C"], // Ordered list of Lesson IDs
  "unlockCriteria": { // Optional: e.g., complete previous module
    "previousModuleId": "some_other_module_id"
  }
}
```

## 4. Lessons

The individual, bite-sized learning units.

```json
{
  "lessonId": "unique_lesson_id_string",
  "lessonModuleId": "parent_module_id_string", // Foreign key to LessonModules
  "title": "What is a Prompt?",
  "lessonType": "concept_explanation", // "concept_explanation", "prompt_input_challenge", "code_generation_interaction", "quiz", "project_step"
  "tier": "free", // "free", "premium"
  "content": [ // Array of content blocks to build the lesson screen by screen (like Duolingo/Mimo cards)
    {
      "type": "text",
      "value": "A prompt is an instruction you give to an AI..."
    },
    {
      "type": "image",
      "url": "url_to_image_illustrating_prompt.png",
      "altText": "Illustration of a prompt"
    },
    {
      "type": "ai_professor_tip",
      "value": "Remember, clear prompts lead to better AI responses!"
    }
  ],
  "interactiveElement": { // Specific to lessonType
    // Example for "prompt_input_challenge"
    "promptPlaceholder": "e.g., Write a poem about a robot learning to code",
    "targetAIModel": "text_generation_creative", // Internal identifier for which AI to use
    "evaluationCriteria": "User submits a prompt. No strict evaluation, focus on practice."

    // Example for "quiz"
    // "question": "What is the main purpose of a prompt?",
    // "quizType": "multiple_choice", // "multiple_choice", "fill_in_the_blank"
    // "options": [
    //   {"id": "opt1", "text": "To confuse the AI"},
    //   {"id": "opt2", "text": "To give instructions to an AI"},
    //   {"id": "opt3", "text": "To display images"}
    // ],
    // "correctAnswerId": "opt2", // or array for multiple correct
    // "feedbackCorrect": "That's right!",
    // "feedbackIncorrect": "Not quite, a prompt guides the AI."

    // Example for "code_generation_interaction"
    // "initialPrompt": "Generate HTML for a red button that says 'Click Me'",
    // "allowUserPromptModification": true,
    // "displayMode": "html_preview_with_code_editor" // "html_preview", "code_editor_only", "canvas_game"
  },
  "xpAward": 10, // XP awarded for completing this lesson
  "estimatedTimeMinutes": 5, // Estimated time to complete
  "learningObjectives": [
    "Understand the definition of a prompt.",
    "Recognize examples of effective prompts."
  ]
}
```

## 5. UserProgress

Tracks a user's progress through lessons, modules, and paths.

```json
{
  "userProgressId": "unique_progress_id_string", // Or composite key (userId, lessonId)
  "userId": "user_id_string", // Foreign key to Users
  "lessonId": "lesson_id_string", // Foreign key to Lessons
  "lessonModuleId": "module_id_string", // For easier querying
  "learningPathId": "path_id_string", // For easier querying
  "status": "completed", // "not_started", "in_progress", "completed"
  "completedAt": "timestamp",
  "score": 90, // Optional: for quizzes or challenges, percentage
  "userInputs": [ // Store user's submissions for reflection or AI Professor review
    {
      "timestamp": "timestamp",
      "promptSubmitted": "User's actual prompt text for a challenge",
      "generatedOutputHash": "hash_of_ai_output_if_any" // To save space, or store reference
    }
  ],
  "notes": "User's personal notes on this lesson" // Optional
}
```

## 6. Badges (Optional - for Gamification)

Defines achievable badges.

```json
{
  "badgeId": "unique_badge_id",
  "name": "Prompt Pioneer",
  "description": "Completed your first 10 prompt challenges.",
  "iconUrl": "url_to_badge_icon.svg",
  "criteria": { // Logic to award this badge
    "type": "lesson_completions",
    "lessonType": "prompt_input_challenge",
    "count": 10
  }
}
```

This provides a starting point. We can refine these models as we further develop the application features. 