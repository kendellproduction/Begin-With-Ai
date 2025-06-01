import { serverTimestamp } from 'firebase/firestore';

/**
 * Vibe Coding Video Game Lesson
 * Teaches students to create browser games using natural language prompts and GPT-4o
 */

export const vibeCodeVideoGameLesson = {
  id: 'vibe-code-video-game',
  title: 'Vibe Coding a Video Game',
  lessonType: 'interactive_coding_with_ai',
  order: 1,
  
  coreConcept: "Create playable browser games using natural language prompts and AI. Learn the art of 'vibe coding' where you describe your game idea and let GPT-4o turn it into working HTML and JavaScript code.",
  
  // Basic lesson metadata
  basicDetails: {
    topic: 'Vibe Coding a Video Game',
    gradeLevel: 'Beginner',
    duration: '15–25 minutes',
    technology: ['JavaScript', 'HTML', 'GPT-4o']
  },
  
  // Learning objectives
  learningObjectives: {
    primary: 'Build a simple, playable browser game using natural language prompts and AI',
    outcomes: [
      'Learn how to use GPT-4o to generate HTML/JavaScript games',
      'Understand the basic structure of browser-based games',
      'Practice crafting prompts that yield usable, interactive code',
      'Learn to use iframe sandboxing for safely running code',
      'Develop skills in rapid game prototyping'
    ]
  },
  
  // Prerequisites
  prerequisites: {
    existingKnowledge: 'Basic familiarity with HTML and JavaScript; ability to describe ideas clearly in writing',
    previousLessons: [
      'Introduction to Prompting',
      'How AI Writes Code (recommended)'
    ]
  },
  
  content: {
    beginner: {
      introduction: "In this lesson, you'll explore 'vibe coding'—a creative approach to coding where you describe a game idea and let GPT-4o turn it into a working game using HTML and JavaScript. This technique is great for learning how code becomes interactive content, prototyping game ideas, or creating engaging learning games quickly.",
      
      mainContent: {
        concept: "Vibe coding lets you focus on creativity and game design while AI handles the technical implementation. You describe what you want, and AI creates the code.",
        
        realWorldApplication: "This technique is perfect for rapid prototyping, educational games, creative projects, and learning how interactive content works.",
        
        keySkills: [
          "Descriptive prompt writing for game mechanics",
          "Understanding basic game structure (player, controls, objectives)",
          "Iterative development through prompt refinement",
          "Safe code execution using iframe sandboxing"
        ],
        
        gameElements: [
          { element: "Player Character", description: "The main character you control", example: "A spaceship that moves with arrow keys" },
          { element: "Game Mechanics", description: "Rules and interactions", example: "Collecting coins increases your score" },
          { element: "Visual Elements", description: "What players see", example: "Colorful shapes, emoji graphics, backgrounds" },
          { element: "Win/Lose Conditions", description: "How the game ends", example: "Game over when you hit an obstacle" }
        ]
      },
      
      exercises: [
        {
          title: "Exercise 1: Describe Your Game Idea",
          instructions: "Write a simple description of a game you'd like to create. Think about what the player does, how they control it, and what makes it fun.",
          example: "A game where the player catches apples falling from the sky using arrow keys. When you catch an apple, you get points. If you miss 3 apples, the game ends.",
          expectedOutcome: "A well-formed prompt for GPT-4o to interpret and turn into code",
          starterCode: null,
          hints: [
            "Keep it simple for your first game",
            "Think about movement (arrow keys, mouse, clicking)",
            "Include a goal or scoring system",
            "Mention visual style (colors, shapes, emoji)"
          ]
        },
        {
          title: "Exercise 2: Generate the Game",
          instructions: "Submit your prompt to GPT-4o. The AI will return a complete HTML document containing your game code.",
          example: "Copy your game description and ask GPT-4o to create a complete HTML game",
          expectedOutcome: "An interactive browser game displayed in an iframe on the page",
          starterCode: null,
          hints: [
            "Be specific about what you want",
            "Ask for a complete HTML file with embedded CSS and JavaScript",
            "Mention that it should work in a browser"
          ]
        },
        {
          title: "Exercise 3: Iterate and Improve",
          instructions: "Try adjusting your prompt to add more difficulty, visual style, or new mechanics. See how small changes in your description create different games.",
          example: "Make the apples fall faster, add different colored apples worth different points, or change the character to a basket",
          expectedOutcome: "A new version of your game with updated features or style",
          starterCode: "Based on GPT-4o's previous output",
          hints: [
            "Try one change at a time",
            "Ask for specific improvements",
            "Experiment with visual themes (space, underwater, fantasy)",
            "Add sound effects or animations"
          ]
        }
      ]
    }
  },
  
  sandbox: {
    required: true,
    type: 'ai_game_generator',
    
    beginner: {
      instructions: "Use the AI Game Generator to create your own browser games. Type your game idea in natural language and watch it come to life!",
      
      interface: {
        promptInput: {
          placeholder: "Describe your game idea... (e.g., 'A game where you catch falling stars with a basket')",
          maxLength: 250, // Reduced character limit for safety and focus
          validation: {
            required: true,
            minLength: 10,
            sanitization: true,
            allowedCharacters: "^[a-zA-Z0-9\\s\\.,!?'\"()\\-\\/]+$", // Alphanumeric, spaces, basic punctuation (stored as string)
            blockedPatterns: [
              "script", "javascript", "eval", "function", "onclick", "onload", // Convert to simple strings for Firestore
              "<[^>]*>", // HTML tags pattern (stored as string)
              "javascript:", "data:", "vbscript:" // Dangerous protocols
            ]
          },
          examples: [
            "A simple platformer where you jump over obstacles",
            "A game where you shoot bubbles at falling objects", 
            "A maze game where you collect gems while avoiding enemies",
            "A rhythm game where you hit spacebar in time with notes"
          ]
        },
        
        gamePreview: {
          type: 'iframe',
          sandbox: 'allow-scripts allow-pointer-lock',
          security: {
            noNetworkAccess: true,
            limitedDOM: true,
            csp: "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline';"
          }
        },
        
        codeDisplay: {
          language: 'html',
          readOnly: true,
          showLineNumbers: true,
          theme: 'light'
        }
      },
      
      promptTemplates: [
        {
          name: "Catching Game",
          template: "Create a game where the player controls a [character] that catches [falling objects] using [arrow keys/mouse]. The player gets [points] for each catch and loses when they miss [number] objects."
        },
        {
          name: "Avoiding Game", 
          template: "Make a game where a [character] moves around the screen avoiding [obstacles]. The player controls it with [arrow keys/WASD] and the goal is to survive as long as possible."
        },
        {
          name: "Collecting Game",
          template: "Design a game where the player moves a [character] around to collect [items] while avoiding [enemies/obstacles]. Use [control method] for movement."
        }
      ],
      
      aiIntegration: {
        model: 'gpt-4o',
        systemPrompt: "You are a game development AI. Create complete, playable HTML games based on user descriptions. Include all HTML, CSS, and JavaScript in a single file. Make games simple but engaging, using canvas or DOM elements. Include basic graphics using CSS or simple shapes. Add clear instructions and scoring. IMPORTANT: Only generate safe, educational game content. Do not include any external links, network requests, or potentially harmful code.",
        
        responseFormat: {
          codeBlock: true,
          language: 'html',
          executable: true
        },
        
        inputSanitization: {
          maxLength: 250,
          stripHTML: true,
          escapeSpecialChars: true,
          blockedTerms: ['script', 'eval', 'function', 'onclick', 'onload', 'javascript:', 'data:', 'vbscript:']
        }
      }
    }
  },
  
  interactiveComponents: {
    realTimePreview: "Games are embedded directly in the page using a secure iframe and update with each new generation",
    
    sandboxEnvironment: {
      type: 'iframe',
      security: {
        sandbox: 'allow-scripts allow-pointer-lock',
        csp: "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline';",
        noNetworkAccess: true
      },
      
      codeExecution: {
        runtime: 'browser-native',
        allowedAPIs: ['canvas', 'requestAnimationFrame', 'addEventListener'],
        restrictedAPIs: ['fetch', 'XMLHttpRequest', 'localStorage', 'sessionStorage']
      }
    },
    
    aiFeedbackIntegration: {
      enabled: true,
      reviewAspects: [
        'Game functionality and playability',
        'Code structure and readability', 
        'Creative use of HTML/CSS/JavaScript',
        'User experience and game design'
      ],
      
      feedbackPrompt: "Review this student's game code and provide constructive feedback on the game mechanics, code structure, and suggestions for improvement. Focus on encouraging creativity while teaching good practices."
    }
  },
  
  assessment: {
    beginner: [
      {
        question: "What is 'vibe coding' in the context of game development?",
        options: [
          "Writing code while listening to music",
          "Describing what you want and letting AI create the code",
          "Coding very quickly without planning"
        ],
        correct: "Describing what you want and letting AI create the code",
        explanation: "Vibe coding means focusing on the creative vision while AI handles the technical implementation."
      },
      {
        question: "Why do we use an iframe to display the generated games?",
        options: [
          "To make the games load faster",
          "To keep the games safe and contained",
          "To make the games look better"
        ],
        correct: "To keep the games safe and contained", 
        explanation: "Iframes with sandbox attributes prevent the game code from accessing or affecting the main page."
      },
      {
        question: "What makes a good game prompt for AI?",
        options: [
          "Very technical programming terms",
          "A clear description of player actions and goals",
          "Only mentioning the visual design"
        ],
        correct: "A clear description of player actions and goals",
        explanation: "AI works best when you describe what the player does, how they control the game, and what the objective is."
      }
    ]
  },
  
  finalProject: {
    challenge: "Use GPT-4o to generate a custom game that includes: Player controls, A scoring system, At least one random or interactive element (e.g., falling objects, enemies)",
    
    successCriteria: [
      "Game loads and functions correctly",
      "Gameplay is interactive and includes visual or scoring feedback", 
      "Prompt was clear and intentional in guiding GPT"
    ],
    
    extensionActivities: [
      "Add sound effects or custom emoji graphics",
      "Include a difficulty scale or win/lose conditions",
      "Implement a local high score tracker",
      "Create multiple levels or game modes"
    ]
  },
  
  technicalImplementation: {
    starterCode: null, // Code is generated dynamically via GPT-4o
    assetsNeeded: ['None by default', 'Users may request emoji, text, or basic shapes'],
    
    librariesTools: [
      'GPT-4o (OpenAI API)',
      'HTML/CSS/JavaScript',
      'iframe (for game preview)',
      'Optional: Monaco Editor or Prism.js for displaying/editing code'
    ],
    
    codeGeneration: {
      aiModel: 'gpt-4o',
      outputFormat: 'complete HTML document',
      securityMeasures: ['iframe sandboxing', 'CSP headers', 'no network access'],
      
      promptGuidelines: [
        "Request complete, self-contained HTML files",
        "Specify desired game mechanics clearly",
        "Ask for embedded CSS and JavaScript",
        "Request clear user instructions within the game"
      ]
    }
  },
  
  progressTracking: {
    completionCriteria: [
      "Submit a game prompt",
      "Generate and play the game", 
      "Try at least one iteration"
    ],
    
    xpRewards: {
      firstGame: 50,
      uniqueVariation: 20, // up to 3 variations
      totalPossible: 110
    },
    
    skillsUnlocked: [
      'Creative Game Prototyping',
      'Prompt Engineering for Code',
      'Safe Web Code Execution'
    ]
  },
  
  // Metadata for database
  metadata: {
    created: serverTimestamp(),
    version: 1,
    lessonType: 'interactive_coding_with_ai',
    difficulty: 'beginner',
    category: 'Creative Coding',
    tags: ['game-development', 'ai-coding', 'javascript', 'html', 'creative'],
    estimatedTime: 20, // minutes
    isPublished: true,
    isPremium: true // Premium lesson - only accessible to paid users
  }
};

// Export for seeding database
export const vibeCodeVideoGameLessonSeed = {
  lesson: vibeCodeVideoGameLesson,
  
  // Additional seeding configuration
  pathId: 'vibe-coding', // Updated learning path
  moduleId: 'interactive-coding',
  
  // Lesson ordering within module
  order: 1,
  
  // Prerequisite lesson IDs
  prerequisites: ['introduction-to-prompting', 'how-ai-writes-code']
}; 