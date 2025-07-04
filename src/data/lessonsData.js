// Fallback lesson data for when Firebase is unavailable or quota is exceeded
export const localLessonsData = {
  'vibe-code-video-game': {
    id: 'vibe-code-video-game',
    title: 'Create a Video Game with AI',
    description: 'Learn to use AI to help you build an interactive video game from scratch with real-time code preview',
    coreConcept: 'Learn to use AI to help you build an interactive video game step by step',
    difficulty: 'Beginner',
    duration: '30 min',
    category: 'Game Development',
    company: 'BeginningWithAI',
    icon: '🎮',
    tags: ['javascript', 'game-dev', 'ai-assisted', 'interactive'],
    learningObjectives: [
      'Use AI to brainstorm creative game concepts and mechanics',
      'Get AI assistance for writing game code in JavaScript',
      'Learn to debug and improve your game with AI feedback',
      'Understand how to iterate and enhance your game design'
    ],
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
    description: 'Understanding how AI evolved from 1950s research to today\'s tools like ChatGPT, and where we\'re headed next',
    coreConcept: 'Understanding how AI evolved from 1950s research to today\'s tools like ChatGPT, and where we\'re headed next',
    difficulty: 'Beginner',
    duration: '25 min',
    category: 'AI Fundamentals',
    company: 'BeginningWithAI',
    icon: '🤖',
    tags: ['history', 'fundamentals', 'overview', 'chatgpt'],
    learningObjectives: [
      'Understand AI\'s evolution from 1950s research to modern tools',
      'Learn about key breakthroughs that shaped AI development',
      'Discover how ChatGPT changed everything in 2022',
      'Explore where AI is heading in the next decade'
    ],
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
  },
  'prompt-engineering-mastery': {
    id: 'prompt-engineering-mastery',
    title: 'Master the Art of Prompt Engineering',
    description: 'Learn how to craft effective prompts that get exactly what you want from AI assistants like ChatGPT and Claude',
    coreConcept: 'Master the techniques of prompt engineering to get better results from AI assistants',
    difficulty: 'Intermediate',
    duration: '40 min',
    category: 'Prompt Engineering',
    company: 'BeginningWithAI',
    icon: '✍️',
    tags: ['prompts', 'chatgpt', 'claude', 'techniques', 'advanced'],
    learningObjectives: [
      'Learn the fundamentals of effective prompt structure',
      'Master advanced techniques like chain-of-thought prompting',
      'Understand how to get consistent results from AI',
      'Practice with real-world prompt examples'
    ]
  },
  'ai-image-generation': {
    id: 'ai-image-generation',
    title: 'Create Stunning Images with AI',
    description: 'Master tools like DALL-E, Midjourney, and Stable Diffusion to generate professional-quality images from text',
    coreConcept: 'Learn to create professional images using AI image generation tools',
    difficulty: 'Intermediate',
    duration: '35 min',
    category: 'Creative AI',
    company: 'BeginningWithAI',
    icon: '🎨',
    tags: ['dall-e', 'midjourney', 'stable-diffusion', 'creative', 'images'],
    learningObjectives: [
      'Master different AI image generation platforms',
      'Learn to write effective image prompts',
      'Understand style guides and artistic techniques',
      'Create consistent brand imagery with AI'
    ]
  },
  'ai-data-analysis': {
    id: 'ai-data-analysis',
    title: 'Analyze Data Like a Pro with AI',
    description: 'Transform raw data into actionable insights using AI-powered analytics tools and techniques',
    coreConcept: 'Use AI to analyze data, create visualizations, and extract meaningful insights',
    difficulty: 'Advanced',
    duration: '50 min',
    category: 'Data Analysis',
    company: 'BeginningWithAI',
    icon: '📊',
    tags: ['data', 'analytics', 'python', 'visualization', 'insights'],
    learningObjectives: [
      'Use AI to clean and prepare datasets',
      'Generate data visualizations with AI assistance',
      'Extract insights from complex data patterns',
      'Create automated data analysis workflows'
    ]
  },
  'ai-coding-assistant': {
    id: 'ai-coding-assistant',
    title: 'Code Faster with AI Assistants',
    description: 'Learn to use GitHub Copilot, Cursor AI, and other coding assistants to write better code faster',
    coreConcept: 'Master AI-powered coding tools to accelerate your development workflow',
    difficulty: 'Intermediate',
    duration: '45 min',
    category: 'Programming',
    company: 'BeginningWithAI',
    icon: '💻',
    tags: ['github-copilot', 'cursor', 'coding', 'productivity', 'development'],
    learningObjectives: [
      'Set up and configure AI coding assistants',
      'Learn best practices for AI-assisted coding',
      'Debug and optimize code with AI help',
      'Build full applications with AI assistance'
    ]
  },
  'ai-business-automation': {
    id: 'ai-business-automation',
    title: 'Automate Your Business with AI',
    description: 'Discover how to use AI to automate workflows, improve efficiency, and scale your business operations',
    coreConcept: 'Learn to implement AI automation solutions for business processes',
    difficulty: 'Advanced',
    duration: '55 min',
    category: 'Business AI',
    company: 'BeginningWithAI',
    icon: '🚀',
    tags: ['automation', 'business', 'workflows', 'efficiency', 'scaling'],
    learningObjectives: [
      'Identify automation opportunities in your business',
      'Set up AI-powered workflow automation',
      'Integrate AI with existing business tools',
      'Measure and optimize AI automation ROI'
    ]
  },
  'ai-content-creation': {
    id: 'ai-content-creation',
    title: 'Create Compelling Content with AI',
    description: 'Master AI tools for writing, video creation, and content marketing that engages your audience',
    coreConcept: 'Use AI to create high-quality content across multiple formats and platforms',
    difficulty: 'Beginner',
    duration: '30 min',
    category: 'Content Creation',
    company: 'BeginningWithAI',
    icon: '📝',
    tags: ['content', 'writing', 'video', 'marketing', 'creativity'],
    learningObjectives: [
      'Write engaging copy with AI assistance',
      'Create video content using AI tools',
      'Develop content strategies with AI insights',
      'Scale content production efficiently'
    ]
  }
};

export const getLessonById = (lessonId) => {
  return localLessonsData[lessonId] || null;
};

export default localLessonsData; 