// Fallback lesson data for when Firebase is unavailable or quota is exceeded
export const localLessonsData = {
  'vibe-code-video-game': {
    id: 'vibe-code-video-game',
    title: 'Create a Video Game with AI',
    coreConcept: 'Learn to use AI to help you build an interactive video game step by step',
    adaptedContent: {
      estimatedTime: 30,
      xpReward: 200,
      content: {
        introduction: 'In this lesson, you\'ll learn how to collaborate with AI to create a fun, interactive video game. You\'ll discover how AI can help you generate game ideas, write code, debug issues, and enhance gameplay.',
        keyPoints: [
          'Use AI to brainstorm creative game concepts and mechanics',
          'Get AI assistance for writing game code in JavaScript',
          'Learn to debug and improve your game with AI feedback',
          'Understand how to iterate and enhance your game design'
        ],
        examples: [
          'Asking AI: "Help me create a simple platformer game where the player collects coins"',
          'Getting AI help: "My character isn\'t jumping properly, can you fix this code?"',
          'Creative input: "Make my game more challenging with power-ups and obstacles"'
        ]
      },
      assessment: {
        questions: [
          {
            question: 'What\'s the best way to start creating a game with AI assistance?',
            options: [
              { text: 'Jump straight into complex code', correct: false },
              { text: 'Describe your game idea clearly to the AI', correct: true },
              { text: 'Copy code from the internet', correct: false },
              { text: 'Start with the hardest features first', correct: false }
            ],
            explanation: 'Starting with a clear description helps the AI understand exactly what you want to build and provide better assistance.'
          }
        ]
      },
      sandbox: {
        instructions: 'Describe your game idea in detail - be specific about controls, visuals, and gameplay! The AI will help you create it step by step.',
        exercises: [
          'Describe a simple game concept (e.g., "A space shooter where you dodge asteroids")',
          'Ask for help implementing specific features',
          'Request improvements to make your game more fun'
        ]
      }
    },
    sandbox: {
      required: true
    }
  },
  'welcome-ai-revolution': {
    id: 'welcome-ai-revolution',
    title: 'Welcome to the AI Revolution',
    coreConcept: 'Understanding the fundamentals of artificial intelligence and its impact on our world',
    adaptedContent: {
      estimatedTime: 25,
      xpReward: 150,
      content: {
        introduction: 'Artificial Intelligence is transforming every aspect of our lives. In this lesson, you\'ll learn what AI really is, how it works, and why it matters for your future.',
        keyPoints: [
          'AI is not magic - it\'s mathematics and pattern recognition',
          'AI systems learn from data to make predictions',
          'Understanding AI helps you use it more effectively',
          'AI is a tool that amplifies human capabilities'
        ],
        examples: [
          'ChatGPT uses patterns in text to generate human-like responses',
          'Image recognition AI identifies objects by learning from millions of photos',
          'Recommendation systems suggest content based on user behavior patterns'
        ]
      },
      assessment: {
        questions: [
          {
            question: 'What is the most accurate description of how AI works?',
            options: [
              { text: 'AI thinks like humans but faster', correct: false },
              { text: 'AI follows pre-written rules and instructions', correct: false },
              { text: 'AI finds patterns in data to make predictions', correct: true },
              { text: 'AI uses magic to solve problems', correct: false }
            ],
            explanation: 'AI systems analyze vast amounts of data to identify patterns, which they then use to make predictions or decisions on new, unseen data.'
          }
        ]
      }
    }
  }
};

export const getLessonById = (lessonId) => {
  return localLessonsData[lessonId] || null;
};

export default localLessonsData; 