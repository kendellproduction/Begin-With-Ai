import { serverTimestamp } from 'firebase/firestore';

/**
 * First Time User Welcome Lesson
 * Specifically designed for new users who may be nervous about AI
 * Auto-enrolled on first login to ease users into the platform
 */

export const firstTimeUserWelcomeLesson = {
  id: 'first-time-welcome',
  title: 'Welcome! Let\'s Explore AI Together',
  lessonType: 'welcome_experience',
  order: 0, // This comes before all other lessons
  
  coreConcept: "Welcome to BeginningWithAI! This is a safe, friendly space to learn about AI at your own pace. No technical background needed - we'll start with the basics and guide you every step of the way.",
  
  // Basic lesson metadata
  basicDetails: {
    topic: 'Welcome & AI Introduction',
    gradeLevel: 'Complete Beginner',
    duration: '5-8 minutes',
    technology: ['Friendly Introduction', 'No Coding Required']
  },
  
  // Learning objectives
  learningObjectives: {
    primary: 'Feel comfortable and confident about learning AI',
    outcomes: [
      'Understand that AI learning is accessible to everyone',
      'Know what to expect from the BeginningWithAI platform',
      'Feel encouraged rather than intimidated about AI',
      'Understand that you can learn at your own pace',
      'Know how to get help when you need it'
    ]
  },
  
  // Prerequisites
  prerequisites: {
    existingKnowledge: 'None! This lesson is designed for complete beginners',
    previousLessons: []
  },
  
  content: {
    beginner: {
      introduction: "👋 Hi there! Welcome to BeginningWithAI. We're so glad you're here! If you're feeling a bit nervous about AI or technology, that's completely normal - and you're in exactly the right place.",
      
      mainContent: {
        welcomeMessage: "You don't need to be a tech expert, programmer, or 'computer person' to learn AI. We've designed this platform for people just like you - curious humans who want to understand this exciting technology.",
        
        whatIsAI: "Think of AI as a really smart assistant that can help with writing, answering questions, creating images, and solving problems. It's not scary robots - it's helpful tools that can make your life easier!",
        
        safetyPromise: "Everything you do here is safe. You can't break anything, and there's no such thing as a 'stupid question.' We're here to help you succeed.",
        
        expectations: [
          {
            title: "Start Small",
            description: "We begin with simple, everyday examples you can relate to",
            icon: "🌱"
          },
          {
            title: "Learn by Doing", 
            description: "You'll try things in a safe environment where mistakes are part of learning",
            icon: "🎯"
          },
          {
            title: "Go at Your Pace",
            description: "No rushing, no pressure - take as much time as you need",
            icon: "⏰"
          },
          {
            title: "Get Real Help",
            description: "Stuck? Our AI tutor and support team are here to help, not judge",
            icon: "🤝"
          }
        ],
        
        appFeatures: [
          {
            feature: "Safe Sandbox",
            description: "Try AI tools without any risk - nothing can go wrong!",
            benefit: "Practice with confidence"
          },
          {
            feature: "Plain English",
            description: "We avoid technical jargon and explain everything clearly",
            benefit: "Understand without confusion"
          },
          {
            feature: "Real Examples",
            description: "Learn with practical examples from daily life",
            benefit: "See immediate value"
          },
          {
            feature: "Supportive Community",
            description: "Learn alongside others who started just like you",
            benefit: "Never feel alone"
          }
        ],
        
        encouragement: [
          "Remember: Every expert was once a beginner",
          "Your curiosity is your superpower",
          "Questions mean you're learning - ask away!",
          "It's okay to feel overwhelmed - we'll break it down together",
          "You belong here, regardless of your background"
        ]
      },
      
      interactiveElements: [
        {
          type: "confidence_check",
          question: "How are you feeling about learning AI right now?",
          options: [
            { text: "Excited and ready to go!", response: "That's wonderful! Your enthusiasm will take you far. Let's dive in!" },
            { text: "Curious but a little nervous", response: "That's perfectly normal! Curiosity is the most important ingredient for learning." },
            { text: "Worried it might be too hard", response: "We understand that feeling! We've designed everything to be beginner-friendly. You've got this!" },
            { text: "Not sure what to expect", response: "No worries! By the end of this lesson, you'll know exactly what's coming and feel much more confident." }
          ]
        },
        {
          type: "expectation_setting",
          question: "What would you like to be able to do with AI?",
          options: [
            { text: "Help with writing and communication" },
            { text: "Create images and visual content" },
            { text: "Understand how AI affects my work/life" },
            { text: "Just understand the basics without getting overwhelmed" },
            { text: "All of the above!" }
          ],
          response: "Great choice! We'll help you achieve these goals step by step."
        }
      ]
    }
  },
  
  // Simple, encouraging assessment
  assessment: {
    beginner: [
      {
        question: "What's the most important thing to remember as you start learning AI?",
        options: [
          "I need to be a tech expert first",
          "It's okay to learn at my own pace",
          "I should understand everything immediately",
          "Only programmers can use AI"
        ],
        correct: "It's okay to learn at my own pace",
        explanation: "Exactly! Learning is a journey, not a race. Take your time and enjoy the process."
      },
      {
        question: "If you get stuck or confused during a lesson, what should you do?",
        options: [
          "Give up - it's too hard for me",
          "Skip ahead and hope it makes sense later", 
          "Ask for help or re-read the explanation",
          "Assume I'm not smart enough"
        ],
        correct: "Ask for help or re-read the explanation",
        explanation: "Perfect! Getting stuck is part of learning. Asking questions shows you're engaged!"
      },
      {
        question: "AI is best thought of as:",
        options: [
          "Scary robots that will take over",
          "Only for computer scientists",
          "Helpful tools that can assist with many tasks",
          "Too complicated for regular people"
        ],
        correct: "Helpful tools that can assist with many tasks",
        explanation: "Exactly right! AI is like having a smart assistant that can help with writing, creating, and problem-solving."
      }
    ]
  },
  
  // Completion actions
  completionActions: {
    message: "🎉 Congratulations! You've completed your first lesson and taken the first step in your AI journey!",
    nextSteps: [
      "You'll now be taken to your personalized learning dashboard",
      "You can explore lessons at your own pace",
      "Remember: we're here to support you every step of the way!"
    ],
    redirect: '/home',
    markAsCompleted: true,
    awardXP: 25
  },
  
  // Progress tracking
  progressTracking: {
    completionCriteria: [
      "Read through welcome content", 
      "Complete confidence check",
      "Answer assessment questions",
      "Feel ready to continue learning"
    ],
    xpRewards: {
      completion: 25,
      bonus: 10 // For completing first lesson
    },
    skillsUnlocked: ["Basic AI Understanding", "Platform Navigation"],
    badgeEligible: "Welcome to AI" // First lesson completion badge
  },
  
  // Database metadata
  metadata: {
    created: serverTimestamp(),
    version: 1,
    difficulty: 'beginner',
    category: 'Welcome & Onboarding',
    tags: ['welcome', 'beginner-friendly', 'confidence-building'],
    estimatedTime: 7,
    isPublished: true,
    isPremium: false,
    isOnboardingLesson: true,
    autoEnrollNewUsers: true
  }
};

// Seeding configuration for the welcome lesson
export const firstTimeUserWelcomeLessonSeed = {
  lesson: firstTimeUserWelcomeLesson,
  pathId: 'onboarding-path',
  moduleId: 'welcome-module',
  order: 0,
  prerequisites: []
}; 