import { serverTimestamp } from 'firebase/firestore';

/**
 * Adaptive Welcome Lessons - Three versions based on comfort level
 * Each provides different content, tone, and approach based on user's initial comfort assessment
 */

// Base lesson structure that applies to all comfort levels
const baseWelcomeLesson = {
  id: 'adaptive-welcome',
  title: 'Welcome to Your AI Journey',
  lessonType: 'adaptive_welcome',
  order: 0,
  
  // Basic lesson metadata
  basicDetails: {
    topic: 'Welcome & AI Introduction',
    gradeLevel: 'Adaptive',
    duration: '5-10 minutes',
    technology: ['Personalized Introduction', 'Comfort-Based Content']
  },
  
  // Prerequisites
  prerequisites: {
    existingKnowledge: 'None! Adapted to your comfort level',
    previousLessons: []
  },
  
  // Progress tracking
  progressTracking: {
    completionCriteria: [
      "Complete comfort level assessment", 
      "Answer learning path questions",
      "Review personalized plan",
      "Feel ready to start learning"
    ],
    xpRewards: {
      completion: 50,
      bonus: 25 // For completing adaptive welcome
    },
    skillsUnlocked: ["Personalized AI Learning", "Adaptive Path Navigation"],
    badgeEligible: "Welcome Pathfinder"
  },
  
  // Database metadata
  metadata: {
    created: serverTimestamp(),
    version: 1,
    difficulty: 'adaptive',
    category: 'Welcome & Onboarding',
    tags: ['welcome', 'adaptive', 'personalized', 'comfort-based'],
    estimatedTime: 8,
    isPublished: true,
    isPremium: false,
    isOnboardingLesson: true,
    autoEnrollNewUsers: true
  }
};

// CONFIDENT USER VERSION - For users excited and ready to dive in
export const confidentWelcomeLesson = {
  ...baseWelcomeLesson,
  id: 'adaptive-welcome-confident',
  title: 'Ready to Master AI? Let\'s Go! 🚀',
  
  coreConcept: "You're confident and ready to explore AI! We'll challenge you with exciting concepts, real-world applications, and cutting-edge developments. Let's unlock AI's potential together!",
  
  learningObjectives: {
    primary: 'Channel your confidence into AI mastery',
    outcomes: [
      'Understand AI\'s transformative potential across industries',
      'Explore advanced AI concepts and applications',
      'Learn practical skills for immediate implementation',
      'Build on your tech confidence to tackle complex AI topics',
      'Connect with cutting-edge AI developments and trends'
    ]
  },
  
  content: {
    advanced: {
      introduction: "🚀 Welcome, AI Pioneer! Your confidence in technology is your superpower, and we're here to fuel that excitement with the most engaging AI content available.",
      
      mainContent: {
        welcomeMessage: "You're not here for basic explanations - you want to dive deep into what makes AI revolutionary. We'll explore the fascinating world of neural networks, machine learning algorithms, and AI applications that are reshaping entire industries.",
        
        whatIsAI: "AI isn't just software - it's a paradigm shift that's revolutionizing how we solve problems, create content, analyze data, and make decisions. From GPT models to computer vision, from autonomous systems to creative AI - you'll master it all.",
        
        confidenceBooster: "Your tech-savvy background gives you a huge advantage. We'll build on what you know and catapult you into AI expertise faster than you thought possible.",
        
        expectations: [
          {
            title: "Challenge Yourself",
            description: "Dive into complex concepts, advanced techniques, and real-world implementations",
            icon: "🎯"
          },
          {
            title: "Move Fast", 
            description: "Accelerated learning path with hands-on projects and practical applications",
            icon: "⚡"
          },
          {
            title: "Lead Innovation",
            description: "Position yourself at the forefront of AI development and application",
            icon: "🏆"
          },
          {
            title: "Create Impact",
            description: "Build AI solutions that solve real problems and drive innovation",
            icon: "💫"
          }
        ],
        
        appFeatures: [
          {
            feature: "Advanced Sandbox",
            description: "Experiment with cutting-edge AI models and APIs",
            benefit: "Build real AI applications"
          },
          {
            feature: "Industry Insights",
            description: "Learn from real-world case studies and expert perspectives",
            benefit: "Understand AI's business impact"
          },
          {
            feature: "Project-Based Learning",
            description: "Build impressive AI projects for your portfolio",
            benefit: "Demonstrate practical AI skills"
          },
          {
            feature: "Expert Community",
            description: "Connect with AI professionals and thought leaders",
            benefit: "Network and collaborate"
          }
        ],
        
        motivation: [
          "Your confidence is the key to AI mastery",
          "Every expert was once a beginner - but you're starting ahead",
          "AI is moving fast - your eagerness to learn keeps you current",
          "The future belongs to those who understand AI - that's you",
          "Your next breakthrough is just one lesson away"
        ]
      },
      
      interactiveElements: [
        {
          type: "ambition_check",
          question: "What's your biggest AI ambition?",
          options: [
            { text: "Build an AI startup", response: "Entrepreneurial spirit! We'll focus on AI business applications and MVP development." },
            { text: "Become an AI engineer", response: "Technical excellence! We'll dive deep into AI architecture and implementation." },
            { text: "Transform my current role with AI", response: "Strategic thinking! We'll explore AI integration and workplace transformation." },
            { text: "Stay ahead of AI trends", response: "Visionary approach! We'll cover emerging AI technologies and future predictions." }
          ]
        },
        {
          type: "learning_style",
          question: "How do you prefer to master new technology?",
          options: [
            { text: "Hands-on projects and experimentation" },
            { text: "Deep technical documentation and theory" },
            { text: "Real-world case studies and applications" },
            { text: "Cutting-edge research and emerging trends" }
          ],
          response: "Perfect! We'll tailor your learning experience to match your preferred style."
        }
      ]
    }
  },
  
  assessment: {
    advanced: [
      {
        question: "What excites you most about AI's potential?",
        options: [
          "Its ability to solve complex global challenges",
          "The opportunity to automate and optimize processes",
          "Creating new forms of art and creativity",
          "All of the above - AI is limitless"
        ],
        correct: "All of the above - AI is limitless",
        explanation: "Exactly! Your enthusiasm for AI's broad potential will drive your learning success."
      },
      {
        question: "When approaching a new AI concept, you prefer to:",
        options: [
          "Jump right in and start experimenting",
          "Research thoroughly before diving in",
          "Find practical applications immediately",
          "Connect it to bigger industry trends"
        ],
        correct: "Jump right in and start experimenting",
        explanation: "Your hands-on approach will accelerate your AI mastery!"
      }
    ]
  },
  
  completionActions: {
    message: "🎉 Outstanding! You've set the foundation for AI mastery. Your confidence and enthusiasm will drive incredible results!",
    nextSteps: [
      "Your personalized learning path emphasizes advanced concepts and practical applications",
      "You'll tackle challenging projects that showcase your growing AI expertise",
      "Ready to transform your confidence into AI mastery? Let's go!"
    ],
    redirect: '/lessons',
    markAsCompleted: true,
    awardXP: 50
  }
};

// CURIOUS USER VERSION - For users interested but preferring step-by-step guidance
export const curiousWelcomeLesson = {
  ...baseWelcomeLesson,
  id: 'adaptive-welcome-curious',
  title: 'Curious About AI? Perfect - Let\'s Explore Together! 🤔',
  
  coreConcept: "Your curiosity about AI is the perfect starting point! We'll guide you step-by-step through AI concepts with clear explanations, practical examples, and a comfortable pace that builds your understanding naturally.",
  
  learningObjectives: {
    primary: 'Transform curiosity into confident AI understanding',
    outcomes: [
      'Build a solid foundation in AI concepts and terminology',
      'Understand how AI works through clear, accessible explanations',
      'Explore practical AI applications in everyday life and work',
      'Gain confidence to experiment with AI tools and techniques',
      'Develop a roadmap for continued AI learning and growth'
    ]
  },
  
  content: {
    intermediate: {
      introduction: "🤔 Hello, Curious Learner! Your thoughtful approach to learning AI is exactly what leads to deep, lasting understanding. We're excited to guide you on this fascinating journey.",
      
      mainContent: {
        welcomeMessage: "Curiosity is the best teacher, and AI is one of the most rewarding subjects to explore. We'll break down complex concepts into digestible pieces, always making sure you're comfortable before moving forward.",
        
        whatIsAI: "Think of AI as a smart assistant that can learn patterns, make predictions, and help solve problems. It's like teaching a computer to think and learn, but in ways that can help us be more creative, efficient, and effective.",
        
        learningApproach: "We believe in building understanding step by step. Each concept builds on the previous one, with plenty of examples and opportunities to practice. No rushing - just steady, confident progress.",
        
        expectations: [
          {
            title: "Learn at Your Pace",
            description: "Clear explanations with examples that make sense, no pressure to rush",
            icon: "🌱"
          },
          {
            title: "Guided Discovery", 
            description: "Structured learning path with built-in support and encouragement",
            icon: "🗺️"
          },
          {
            title: "Practical Understanding",
            description: "Real-world examples that show how AI applies to your life and interests",
            icon: "💡"
          },
          {
            title: "Confidence Building",
            description: "Gradual skill development that builds your comfort with AI concepts",
            icon: "📈"
          }
        ],
        
        appFeatures: [
          {
            feature: "Guided Tutorials",
            description: "Step-by-step lessons with clear explanations and examples",
            benefit: "Learn without confusion"
          },
          {
            feature: "Practice Sandbox",
            description: "Safe environment to try AI tools with guidance",
            benefit: "Build confidence through practice"
          },
          {
            feature: "Progress Tracking",
            description: "See your learning journey and celebrate milestones",
            benefit: "Stay motivated and on track"
          },
          {
            feature: "Support Community",
            description: "Connect with fellow learners and helpful mentors",
            benefit: "Get help when you need it"
          }
        ],
        
        encouragement: [
          "Your curiosity is your greatest strength in learning AI",
          "Every question you ask leads to deeper understanding",
          "Taking time to understand concepts thoroughly pays off",
          "Small, consistent steps lead to big achievements",
          "You're exactly where you need to be in your learning journey"
        ]
      },
      
      interactiveElements: [
        {
          type: "learning_comfort",
          question: "What helps you learn best?",
          options: [
            { text: "Clear examples and step-by-step guides", response: "Perfect! We'll provide plenty of practical examples and detailed guidance." },
            { text: "Time to think and process new information", response: "Absolutely! We encourage thoughtful learning at your own pace." },
            { text: "Connecting new concepts to things I already know", response: "Great approach! We'll relate AI to familiar concepts and experiences." },
            { text: "Having support when I get stuck", response: "That's what we're here for! Our community and resources support your learning." }
          ]
        },
        {
          type: "curiosity_focus",
          question: "What aspect of AI are you most curious about?",
          options: [
            { text: "How AI actually 'thinks' and makes decisions" },
            { text: "How AI is being used in different industries" },
            { text: "How I could use AI in my daily life or work" },
            { text: "The future possibilities and implications of AI" }
          ],
          response: "Excellent! We'll make sure to address your specific areas of curiosity throughout your learning journey."
        }
      ]
    }
  },
  
  assessment: {
    intermediate: [
      {
        question: "What's the best way to approach learning something new like AI?",
        options: [
          "Jump in and figure it out as you go",
          "Take time to understand each concept before moving on",
          "Focus only on the practical applications",
          "Memorize all the technical terms first"
        ],
        correct: "Take time to understand each concept before moving on",
        explanation: "Exactly! Your thoughtful approach to learning will help you build a strong foundation in AI."
      },
      {
        question: "When you encounter something confusing in AI, you should:",
        options: [
          "Skip it and hope it makes sense later",
          "Give up - it's probably too advanced",
          "Ask questions and seek clarification",
          "Try to memorize it without understanding"
        ],
        correct: "Ask questions and seek clarification",
        explanation: "Perfect! Asking questions is how curious learners become confident experts."
      }
    ]
  },
  
  completionActions: {
    message: "🎉 Wonderful! Your curiosity and thoughtful approach are perfect for AI learning. You're ready to explore this exciting field!",
    nextSteps: [
      "Your learning path focuses on clear explanations and practical examples",
      "You'll build understanding gradually with plenty of support along the way",
      "Ready to satisfy your curiosity about AI? Let's begin!"
    ],
    redirect: '/lessons',
    markAsCompleted: true,
    awardXP: 50
  }
};

// NERVOUS USER VERSION - For users feeling overwhelmed but motivated to learn
export const nervousWelcomeLesson = {
  ...baseWelcomeLesson,
  id: 'adaptive-welcome-nervous',
  title: 'Feeling Nervous About AI? You\'re Not Alone - We\'re Here to Help! 😅',
  
  coreConcept: "It's completely normal to feel nervous about AI - it shows you understand its importance! We're here to support you with gentle guidance, encouragement, and a learning approach that builds your confidence step by step.",
  
  learningObjectives: {
    primary: 'Transform nervousness into confidence and understanding',
    outcomes: [
      'Feel comfortable and confident about AI rather than overwhelmed',
      'Understand that AI is accessible and learnable for everyone',
      'Build a strong foundation with plenty of support and encouragement',
      'Develop practical skills at a comfortable, non-pressured pace',
      'Gain confidence to continue your AI learning journey independently'
    ]
  },
  
  content: {
    beginner: {
      introduction: "😅 Hello, Brave Learner! Taking the step to learn about AI despite feeling nervous shows incredible courage and wisdom. You're in exactly the right place, and we're honored to support your journey.",
      
      mainContent: {
        welcomeMessage: "First, let's address the nervousness - it's completely normal and actually shows you're smart enough to recognize AI's significance. Many successful AI users started exactly where you are now, feeling uncertain but motivated to learn.",
        
        whatIsAI: "AI is simply a tool that helps computers be more helpful to humans. Think of it like a really smart calculator - instead of just adding numbers, it can help with writing, answering questions, and solving problems. It's not scary or magic - it's just technology designed to make life easier.",
        
        comfortAndSupport: "We've designed everything specifically for people who feel nervous about technology. Every lesson includes extra explanation, encouragement, and reassurance. You'll never be judged for asking questions or taking extra time.",
        
        expectations: [
          {
            title: "Gentle Pace",
            description: "No rushing, no pressure - learn as slowly as you need to feel comfortable",
            icon: "🐌"
          },
          {
            title: "Extra Support", 
            description: "Detailed explanations, helpful examples, and encouragement every step",
            icon: "🤝"
          },
          {
            title: "Safe Environment",
            description: "Practice space where mistakes are learning opportunities, not failures",
            icon: "🛡️"
          },
          {
            title: "Confidence Building",
            description: "Small wins and positive reinforcement to build your AI confidence",
            icon: "🌟"
          }
        ],
        
        appFeatures: [
          {
            feature: "Beginner-Friendly Design",
            description: "Everything explained in simple, non-technical language",
            benefit: "Learn without intimidation"
          },
          {
            feature: "Patient Guidance",
            description: "Detailed instructions and multiple ways to understand concepts",
            benefit: "Never feel lost or confused"
          },
          {
            feature: "Comfort Tracking",
            description: "Check-ins to ensure you're comfortable before progressing",
            benefit: "Learn at your own comfort level"
          },
          {
            feature: "Supportive Community",
            description: "Connect with others who understand your learning journey",
            benefit: "Feel supported and encouraged"
          }
        ],
        
        reassurance: [
          "Feeling nervous about new technology is completely normal",
          "You don't need to be a 'tech person' to understand AI",
          "Every small step forward is a victory worth celebrating",
          "Your questions and concerns are valid and welcome",
          "You belong here, and we're here to help you succeed"
        ]
      },
      
      interactiveElements: [
        {
          type: "comfort_check",
          question: "What would help you feel most comfortable learning AI?",
          options: [
            { text: "Lots of encouragement and positive reinforcement", response: "You'll get plenty of both! We celebrate every step of your progress." },
            { text: "Extra time to understand each concept", response: "Absolutely! Take all the time you need - there's no rush in learning." },
            { text: "Simple explanations without technical jargon", response: "That's exactly what we provide - clear, simple language for everything." },
            { text: "Knowing I can ask questions without judgment", response: "Questions are always welcome and encouraged - they show you're learning!" }
          ]
        },
        {
          type: "motivation_source",
          question: "What motivated you to learn about AI despite feeling nervous?",
          options: [
            { text: "I know it's important for my future" },
            { text: "I want to understand what everyone's talking about" },
            { text: "I'm curious but need support to learn" },
            { text: "I want to overcome my fear of technology" }
          ],
          response: "That motivation will carry you through! With our support, you'll achieve your AI learning goals."
        }
      ]
    }
  },
  
  assessment: {
    beginner: [
      {
        question: "What's the most important thing to remember when learning something new that feels challenging?",
        options: [
          "You need to understand everything immediately",
          "It's okay to learn slowly and ask for help",
          "Smart people never feel nervous about technology",
          "You should give up if it feels too hard"
        ],
        correct: "It's okay to learn slowly and ask for help",
        explanation: "Exactly right! Learning at your own pace and asking for help are signs of wisdom, not weakness."
      },
      {
        question: "When you feel overwhelmed by new technology, what should you do?",
        options: [
          "Assume you're not smart enough to learn it",
          "Push through without asking for help",
          "Take a break and come back with support",
          "Avoid the technology altogether"
        ],
        correct: "Take a break and come back with support",
        explanation: "Perfect! Taking breaks and seeking support are healthy ways to manage learning challenges."
      }
    ]
  },
  
  completionActions: {
    message: "🎉 You did it! You've taken the first brave step in your AI journey. Your courage to learn despite feeling nervous is truly admirable!",
    nextSteps: [
      "Your learning path is designed with extra support and gentle pacing",
      "You'll build confidence gradually with lots of encouragement along the way",
      "Remember: every expert was once a beginner who felt nervous too!"
    ],
    redirect: '/lessons',
    markAsCompleted: true,
    awardXP: 50
  }
};

// Export all adaptive lessons
export const adaptiveWelcomeLessons = {
  confident: confidentWelcomeLesson,
  curious: curiousWelcomeLesson,
  nervous: nervousWelcomeLesson
};

// Seeding configuration
export const adaptiveWelcomeLessonSeeds = {
  confident: {
    lesson: confidentWelcomeLesson,
    pathId: 'adaptive-confident-path',
    moduleId: 'confident-welcome-module',
    order: 0,
    prerequisites: []
  },
  curious: {
    lesson: curiousWelcomeLesson,
    pathId: 'adaptive-curious-path',
    moduleId: 'curious-welcome-module',
    order: 0,
    prerequisites: []
  },
  nervous: {
    lesson: nervousWelcomeLesson,
    pathId: 'adaptive-nervous-path',
    moduleId: 'nervous-welcome-module',
    order: 0,
    prerequisites: []
  }
}; 