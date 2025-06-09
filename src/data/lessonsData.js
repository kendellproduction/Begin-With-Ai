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
    title: 'AI History: How We Got Here & Where We\'re Going',
    coreConcept: 'Understanding how AI evolved from 1950s research to today\'s tools like ChatGPT, and where we\'re headed next',
    adaptedContent: {
      estimatedTime: 25,
      xpReward: 150,
      content: {
        introduction: 'AI didn\'t appear overnight - it\'s been 70+ years in the making! Learn how we went from room-sized computers in the 1950s to ChatGPT in your pocket, and discover where AI is headed next.',
        keyPoints: [
          'AI research started in the 1950s with big dreams and basic tools',
          'The 2022 ChatGPT release was a turning point that made AI accessible to everyone',
          'We\'re still in the early stages of the AI transformation',
          'Understanding AI history helps us prepare for what\'s coming next'
        ],
        examples: [
          'Before ChatGPT: AI worked behind the scenes in search engines and recommendations',
          'The ChatGPT moment: Suddenly anyone could have conversations with AI',
          'Today: AI helps with writing, art, video, code, and solving complex problems',
          'Tomorrow: AI assistants that understand context and help with bigger challenges'
        ]
      },
      assessment: {
        questions: [
          {
            question: 'What was the biggest change when ChatGPT was released in 2022?',
            options: [
              { text: 'AI was invented for the first time', correct: false },
              { text: 'AI became available to everyone through conversation', correct: true },
              { text: 'AI became perfect and stopped making mistakes', correct: false },
              { text: 'AI was restricted to only computer experts', correct: false }
            ],
            explanation: 'ChatGPT democratized AI by making it conversational and accessible to anyone, not just technical experts. This marked a huge shift from AI working behind the scenes to being a tool everyone could directly interact with.'
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