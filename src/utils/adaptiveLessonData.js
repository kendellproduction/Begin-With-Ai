import { serverTimestamp } from 'firebase/firestore';

/**
 * Complete Adaptive Lesson System for Prompt Engineering Mastery
 * Transforms content based on user skill level (beginner/intermediate/advanced)
 */

export const promptEngineeringMasteryPath = {
  id: 'prompt-engineering-mastery',
  title: 'Prompt Engineering Mastery',
  description: 'Master the art of communicating with AI - from complete beginner to expert',
  category: 'Core Skills',
  difficulty: 'Adaptive',
  estimatedHours: 8,
  totalLessons: 10,
  icon: '🎯',
  color: 'from-blue-500 to-purple-600',
  isRecommended: true,
  isFlagship: true,
  prerequisites: [],
  nextPaths: ['ai-for-business', 'ai-for-content-creation', 'ai-workflow-automation'],
  targetAudience: ['complete-beginner', 'some-exposure', 'regular-user', 'power-user'],
  published: true,
  isPremium: false,
  version: 1,
  order: 1
};

export const vibeCodePath = {
  id: 'vibe-coding',
  title: 'Vibe Coding',
  description: 'Learn creative coding by describing what you want and letting AI build it for you',
  category: 'Creative Skills',
  difficulty: 'Beginner to Intermediate', 
  estimatedHours: 3,
  totalLessons: 4,
  icon: '🎮',
  color: 'from-purple-500 to-pink-600',
  isRecommended: true,
  isFlagship: false,
  prerequisites: ['prompt-engineering-mastery'],
  nextPaths: ['ai-for-content-creation'],
  targetAudience: ['creative-beginners', 'game-enthusiasts', 'educators'],
  published: true,
  isPremium: true, // Premium learning path
  version: 1,
  order: 3
};

export const adaptiveModules = {
  'prompt-engineering-mastery': [
    {
      id: 'ai-foundations',
      title: 'AI Foundations',
      description: 'Understanding what AI is and how it works',
      order: 1
    },
    {
      id: 'prompting-skills',
      title: 'Core Prompting Skills',
      description: 'Learn to write effective prompts',
      order: 2
    },
    {
      id: 'creative-applications',
      title: 'Creative AI Applications',
      description: 'Use AI for images, video, and voice',
      order: 3
    },
    {
      id: 'practical-applications',
      title: 'Real-World Applications',
      description: 'Apply AI to daily life and work',
      order: 4
    }
  ],
  'vibe-coding': [
    {
      id: 'interactive-coding',
      title: 'Interactive Coding',
      description: 'Learn to create interactive content through AI-assisted coding',
      order: 1
    }
  ]
};

export const adaptiveLessons = {
  'ai-foundations': [
    // LESSON 1: Welcome to the AI Revolution
    {
      id: 'welcome-ai-revolution',
      title: 'Welcome to the AI Revolution',
      lessonType: 'concept_explanation_with_interaction',
      order: 1,
      
      coreConcept: "Artificial Intelligence (AI) is transforming the world around us. It's not just about chatbots—it's about machines that can understand, generate, or act on information using patterns learned from massive data.",
      
      content: {
        beginner: {
          introduction: "Imagine having a super-smart assistant that can help you write, draw, and even talk! That's what AI can do. Let's explore this exciting world together.",
          
          mainContent: {
            aiDefinition: "AI is like a really smart computer program that learns from lots of examples, just like how you learn to ride a bike by practicing.",
            
            aiVsChatbots: "A chatbot is like a talking computer. But AI can do much more - it can draw pictures, make videos, and help with lots of different tasks!",
            
            categories: [
              { type: "Text AI", description: "Helps you write stories, emails, and homework (like ChatGPT)", icon: "📝" },
              { type: "Image AI", description: "Creates pictures from your words (like drawing robots)", icon: "🎨" },
              { type: "Voice AI", description: "Can talk and sing in different voices", icon: "🎤" },
              { type: "Video AI", description: "Makes short movies and animations", icon: "🎬" },
              { type: "AI Helpers", description: "Smart assistants that do tasks for you", icon: "🤖" }
            ],
            
            companies: [
              { name: "OpenAI", tool: "ChatGPT", description: "Great for writing and answering questions" },
              { name: "Google", tool: "Gemini", description: "Helps with research and learning" },
              { name: "Anthropic", tool: "Claude", description: "Very helpful and safe AI assistant" }
            ]
          },
          
          examples: [
            "Ask ChatGPT to help write a letter to your friend",
            "Use DALL-E to draw a purple elephant wearing a hat",
            "Have AI help make a fun story about robots"
          ],
          
          commonMisunderstandings: [
            "AI is just ChatGPT → AI includes many different tools!",
            "AI is like a robot → Most AI is software, not machines",
            "AI is always right → AI can make mistakes and needs checking"
          ]
        },
        
        intermediate: {
          introduction: "AI is transforming industries worldwide. Understanding its capabilities and applications will help you leverage these tools professionally and personally.",
          
          mainContent: {
            aiDefinition: "AI systems learn patterns from massive datasets to make predictions or generate content, unlike traditional software that follows pre-programmed rules.",
            
            aiVsChatbots: "Chatbots are conversation interfaces that can be powered by AI (like ChatGPT) or rule-based systems. AI encompasses much broader capabilities beyond conversation.",
            
            categories: [
              { type: "Large Language Models (LLMs)", description: "Content generation, analysis, and summarization for business applications", icon: "📝", tools: ["ChatGPT", "Claude", "Gemini"] },
              { type: "Image Generation", description: "Visual content creation for marketing, design, and prototyping", icon: "🎨", tools: ["Midjourney", "DALL-E", "Stable Diffusion"] },
              { type: "Voice & Audio AI", description: "Audio production for podcasts, training, and accessibility", icon: "🎤", tools: ["ElevenLabs", "Google TTS", "Play.ht"] },
              { type: "Video Generation", description: "Content creation for social media, advertising, and education", icon: "🎬", tools: ["RunwayML", "Kling AI", "Pika Labs"] },
              { type: "AI Agents & Automation", description: "Intelligent task execution and business process optimization", icon: "🤖", tools: ["AutoGPT", "n8n", "Zapier"] }
            ],
            
            companies: [
              { name: "OpenAI", tools: "ChatGPT, DALL-E", description: "Leading in general-purpose AI with strong API ecosystem" },
              { name: "Google", tools: "Gemini, Bard", description: "Integrated with productivity tools and search capabilities" },
              { name: "Anthropic", tools: "Claude", description: "Focus on safety and helpful AI for enterprise applications" }
            ]
          },
          
          examples: [
            "Marketing teams use Midjourney for social media content creation",
            "Customer service implements Claude for intelligent automated responses",
            "Video creators use RunwayML for quick explainer video production"
          ],
          
          commonMisunderstandings: [
            "ChatGPT is AI → It's one product powered by a large language model",
            "AI means robots → Most AI today is software, not physical machines",
            "AI always gets things right → AI often needs to be fact-checked"
          ]
        },
        
        advanced: {
          introduction: "Modern AI represents a paradigm shift from deterministic programming to probabilistic pattern recognition, enabling unprecedented automation and creativity across enterprise applications.",
          
          mainContent: {
            aiDefinition: "Contemporary AI leverages transformer architectures and large-scale training to achieve emergent capabilities through statistical learning from vast corpora.",
            
            aiVsChatbots: "While conversational interfaces represent one manifestation of AI capabilities, the underlying technology enables multimodal reasoning, complex task orchestration, and autonomous decision-making.",
            
            categories: [
              { type: "Transformer-based Language Models", description: "Advanced text processing with attention mechanisms for complex reasoning", icon: "📝", examples: ["GPT-4", "Claude-3", "Gemini Pro"] },
              { type: "Diffusion Models & GANs", description: "High-fidelity image synthesis with controllable generation parameters", icon: "🎨", examples: ["Stable Diffusion", "Midjourney v6", "DALL-E 3"] },
              { type: "Neural Voice Synthesis", description: "Realistic speech synthesis with emotional modulation and speaker adaptation", icon: "🎤", examples: ["WaveNet", "ElevenLabs", "Bark"] },
              { type: "Temporal Consistency Models", description: "Coherent video generation with motion control and narrative structure", icon: "🎬", examples: ["RunwayML Gen-2", "Kling AI", "Pika 1.0"] },
              { type: "Multi-modal Reasoning Systems", description: "Autonomous task execution with tool integration and decision-making", icon: "🤖", examples: ["AutoGPT", "LangChain", "CrewAI"] }
            ],
            
            companies: [
              { name: "OpenAI", focus: "General intelligence research", capabilities: "GPT series, multimodal capabilities, reasoning" },
              { name: "Google/DeepMind", focus: "Scientific discovery", capabilities: "Advanced reasoning, planning, specialized models" },
              { name: "Anthropic", focus: "AI Safety", capabilities: "Constitutional AI, alignment research, helpful behavior" }
            ]
          },
          
          examples: [
            "Enterprise implementations of Claude for complex document analysis",
            "Production pipelines using Stable Diffusion with custom fine-tuning",
            "Autonomous agent frameworks like AutoGPT for multi-step reasoning"
          ],
          
          commonMisunderstandings: [
            "Larger models are always better → Model selection depends on use case, latency, and cost constraints",
            "AI will replace all jobs → AI augments human capabilities and creates new opportunities",
            "Open source models are inferior → Many open models rival proprietary ones for specific tasks"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'ai_tool_matcher',
        
        beginner: {
          instructions: "Help someone pick the right AI tool! Read the scenario and choose which type of AI would help.",
          scenarios: [
            {
              task: "I want to make a birthday card with a drawing of a unicorn",
              options: ["Text AI", "Image AI", "Voice AI"],
              correct: "Image AI",
              explanation: "Image AI like DALL-E can create pictures from your words!"
            },
            {
              task: "I need help writing my homework about dinosaurs",
              options: ["Image AI", "Text AI", "Video AI"],
              correct: "Text AI",
              explanation: "Text AI like ChatGPT can help you write and research!"
            }
          ],
          hints: ["Think about what the person wants to create", "Pictures need Image AI, words need Text AI"]
        },
        
        intermediate: {
          instructions: "Match business scenarios with appropriate AI solutions. Consider efficiency, quality, and practical implementation.",
          scenarios: [
            {
              task: "Create consistent social media visuals for a coffee shop brand",
              options: ["ChatGPT for descriptions", "Midjourney with style prompts", "ElevenLabs for audio"],
              correct: "Midjourney with style prompts",
              explanation: "Visual content requires image generation with consistent style parameters."
            },
            {
              task: "Automate customer support for a SaaS company with 24/7 multilingual responses",
              options: ["Claude API integration", "Midjourney subscription", "ElevenLabs voice cloning"],
              correct: "Claude API integration",
              explanation: "Claude can handle complex customer queries with consistent, accurate responses across languages."
            }
          ],
          hints: ["Consider scalability and cost", "Think about integration complexity"]
        },
        
        advanced: {
          instructions: "Design AI implementation strategies for complex enterprise scenarios. Consider technical constraints, ROI, and risk factors.",
          scenarios: [
            {
              task: "Build an automated content pipeline: script → voiceover → video → social media posts",
              options: ["Single GPT-4 integration", "Multi-model pipeline (GPT-4 + ElevenLabs + RunwayML)", "Custom trained models"],
              correct: "Multi-model pipeline (GPT-4 + ElevenLabs + RunwayML)",
              explanation: "Complex workflows require specialized models for each step, connected through automation tools."
            }
          ],
          hints: ["Consider the entire pipeline", "Think about specialization vs. general purpose"]
        }
      },
      
      assessment: {
        beginner: [
          {
            question: "What makes AI different from regular computer programs?",
            options: ["AI learns from examples", "AI is always right", "AI only works on phones"],
            correct: "AI learns from examples",
            explanation: "AI learns patterns from data, unlike regular programs that follow fixed rules."
          }
        ],
        
        intermediate: [
          {
            question: "A marketing team wants to create consistent brand visuals at scale. Which approach would be most effective?",
            options: ["Hire more designers", "Use Midjourney with custom style prompts", "Use ChatGPT for image descriptions"],
            correct: "Use Midjourney with custom style prompts",
            explanation: "AI image generation can maintain consistent style while scaling production."
          }
        ],
        
        advanced: [
          {
            question: "When implementing enterprise AI solutions, what's the primary consideration for choosing between local and cloud-based models?",
            options: ["Cost only", "Data privacy, latency, and compliance requirements", "Model accuracy only"],
            correct: "Data privacy, latency, and compliance requirements",
            explanation: "Enterprise deployments must balance multiple factors including security, performance, and regulatory compliance."
          }
        ]
      },
      
      xpRewards: { beginner: 15, intermediate: 20, advanced: 25 },
      estimatedTime: { beginner: 8, intermediate: 12, advanced: 15 }
    },

    // LESSON 2: How AI "Thinks"
    {
      id: 'how-ai-thinks',
      title: 'How AI "Thinks" — From Data to Decisions',
      lessonType: 'concept_explanation_with_interaction',
      order: 2,
      
      coreConcept: "AI doesn't think like us. It doesn't feel, reason, or understand the world—it predicts. This lesson explains how large language models are trained and generate responses by identifying patterns in data.",
      
      content: {
        beginner: {
          introduction: "AI might seem super smart, but it's actually just really good at guessing! Let's learn how AI 'thinks' by predicting what comes next.",
          
          mainContent: {
            training: "AI learns by reading millions of books, websites, and conversations. It's like studying really hard by reading everything in a huge library!",
            tokens: "AI sees words as puzzle pieces called 'tokens'. The word 'happy' might be one piece, and AI tries to guess what piece comes next.",
            inference: "When you ask AI a question, it looks at all the patterns it learned and makes its best guess for the answer.",
            
            examples: [
              "You say 'The sky is...' and AI guesses 'blue' because it saw that pattern many times",
              "Ask for a story about cats, and AI combines cat patterns with story patterns",
              "AI fills in missing words like a smart autocomplete"
            ]
          },
          
          keyPoints: [
            "AI doesn't really understand - it just guesses really well",
            "AI learned from reading lots of text",
            "AI predicts the next word, then the next, to build answers"
          ]
        },
        
        intermediate: {
          introduction: "Understanding how AI generates responses helps you craft better prompts and set realistic expectations for AI capabilities.",
          
          mainContent: {
            training: "Large language models are trained on massive datasets using thousands of GPUs over weeks/months, adjusting billions of parameters to predict text patterns.",
            tokens: "Text is tokenized into chunks (words, subwords, or characters). Models predict the next token based on context, building responses iteratively.",
            inference: "During inference, the model processes your input through learned patterns to generate probabilistic predictions for the most likely response.",
            
            technicalConcepts: [
              "Temperature controls randomness - higher = more creative, lower = more focused",
              "Context window limits how much conversation history the model remembers",
              "Training data cutoff means models have knowledge limitations"
            ]
          },
          
          practicalImplications: [
            "AI responses are probabilistic, not deterministic",
            "Models don't learn from individual conversations (unless fine-tuned)",
            "Prompting techniques can guide but not guarantee specific outputs"
          ]
        },
        
        advanced: {
          introduction: "Modern language models use transformer architectures with attention mechanisms to model complex dependencies in sequential data.",
          
          mainContent: {
            training: "Training involves next-token prediction on massive corpora using gradient descent optimization, with techniques like reinforcement learning from human feedback (RLHF) for alignment.",
            tokens: "Tokenization strategies (BPE, SentencePiece) affect model performance. Attention mechanisms allow models to weight relevant context dynamically.",
            inference: "Generation uses techniques like beam search, nucleus sampling, and temperature scaling to balance coherence and diversity in outputs.",
            
            architecturalDetails: [
              "Multi-head attention enables parallel processing of different representation subspaces",
              "Layer normalization and residual connections enable stable training of deep networks",
              "Positional encodings provide sequence information in the absence of recurrence"
            ]
          },
          
          limitations: [
            "Hallucination emerges from the probabilistic nature of generation",
            "Knowledge cutoffs and training data biases affect model behavior",
            "Computational costs scale with sequence length and model size"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'prediction_exercise',
        
        beginner: {
          instructions: "Try completing these sentences like AI would. What do you think comes next?",
          exercises: [
            {
              prompt: "The sun rises in the...",
              expectedAnswers: ["east", "morning"],
              explanation: "AI learned this pattern from many examples!"
            }
          ]
        },
        
        intermediate: {
          instructions: "Explore how different prompting techniques affect AI responses. Try the same request with different approaches.",
          exercises: [
            {
              prompt: "Compare: 'Tell me about dogs' vs 'You are a veterinarian. Explain dog behavior to a new pet owner in 3 clear points.'",
              focus: "Structure and role-setting",
              explanation: "Specific prompts guide AI to more useful responses"
            }
          ]
        },
        
        advanced: {
          instructions: "Analyze how temperature and context window affect model behavior.",
          exercises: [
            {
              prompt: "Test the same prompt with different temperature settings",
              focus: "Understanding generation parameters",
              explanation: "Temperature affects the probability distribution over tokens"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 15, intermediate: 20, advanced: 25 },
      estimatedTime: { beginner: 10, intermediate: 15, advanced: 18 }
    },

    // LESSON 3: AI Vocabulary Bootcamp
    {
      id: 'ai-vocabulary-bootcamp',
      title: 'AI Vocabulary Bootcamp',
      lessonType: 'interactive_vocabulary',
      order: 3,
      
      coreConcept: "Learning AI's vocabulary gives you power. It allows you to ask better questions, explore more advanced tools, and understand what's happening behind the scenes.",
      
      content: {
        beginner: {
          introduction: "Learning AI words is like learning the rules of a game - it helps you play better! Let's learn the most important AI words.",
          
          vocabulary: [
            { term: "LLM", definition: "Large Language Model - A smart AI that works with words", example: "ChatGPT is an LLM" },
            { term: "Prompt", definition: "What you type to the AI - your question or instruction", example: "Write a story about dogs" },
            { term: "Token", definition: "Small pieces of words that AI understands", example: "The word 'wonderful' might be 2 tokens" },
            { term: "Hallucination", definition: "When AI makes up wrong information that sounds real", example: "AI saying there are 27 days in February" },
            { term: "Temperature", definition: "How creative vs focused the AI should be", example: "High = more creative, Low = more focused" }
          ]
        },
        
        intermediate: {
          introduction: "Mastering AI terminology helps you communicate effectively with AI tools and understand their capabilities and limitations.",
          
          vocabulary: [
            { term: "LLM (Large Language Model)", definition: "AI systems trained on text to understand and generate human language", applications: ["Content creation", "Analysis", "Translation"] },
            { term: "Context Window", definition: "Amount of text the AI can remember in a conversation", implications: ["Longer contexts = better understanding", "Limited by model architecture"] },
            { term: "Fine-tuning", definition: "Training a model on specific data to specialize it", examples: ["Legal documents", "Medical texts", "Company-specific content"] },
            { term: "Multimodal", definition: "AI that works with text, images, audio, and video", tools: ["GPT-4V", "Claude 3", "Gemini Pro"] },
            { term: "Inference", definition: "The process of AI generating responses to prompts", considerations: ["Speed", "Cost", "Quality"] }
          ]
        },
        
        advanced: {
          introduction: "Technical AI vocabulary enables precise communication about model capabilities, limitations, and implementation strategies.",
          
          vocabulary: [
            { term: "Transformer Architecture", definition: "Neural network design using attention mechanisms for sequence processing", significance: "Foundation of modern LLMs" },
            { term: "RLHF", definition: "Reinforcement Learning from Human Feedback - training method for alignment", purpose: "Improves model helpfulness and safety" },
            { term: "RAG", definition: "Retrieval-Augmented Generation - combining LLMs with external knowledge", benefits: ["Up-to-date information", "Reduced hallucination"] },
            { term: "Quantization", definition: "Reducing model precision to decrease memory and compute requirements", tradeoffs: ["Smaller size vs accuracy"] },
            { term: "Emergent Abilities", definition: "Capabilities that appear at larger model scales", examples: ["Chain-of-thought reasoning", "Few-shot learning"] }
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'vocabulary_practice',
        
        beginner: {
          instructions: "Match the AI word with its meaning. Don't worry if you don't know them all yet!",
          exercises: [
            { 
              type: "matching",
              items: [
                { term: "Prompt", definition: "What you type to AI" },
                { term: "Token", definition: "Small word pieces" },
                { term: "LLM", definition: "Smart word AI" }
              ]
            }
          ]
        },
        
        intermediate: {
          instructions: "Use these terms correctly in context. Choose the best term for each scenario.",
          exercises: [
            {
              scenario: "You want the AI to remember your entire conversation",
              options: ["Context Window", "Temperature", "Hallucination"],
              correct: "Context Window",
              explanation: "Context window determines how much conversation the AI remembers"
            }
          ]
        },
        
        advanced: {
          instructions: "Apply technical concepts to real-world scenarios. Demonstrate understanding of implementation considerations.",
          exercises: [
            {
              scenario: "Implementing a customer service chatbot that needs current product information",
              concepts: ["RAG", "Fine-tuning", "Context Window"],
              bestApproach: "RAG",
              reasoning: "RAG allows real-time access to updated product information without retraining"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 20, intermediate: 25, advanced: 30 },
      estimatedTime: { beginner: 12, intermediate: 18, advanced: 22 }
    }
  ],

  'prompting-skills': [
    // LESSON 4: Prompting Essentials
    {
      id: 'prompting-essentials',
      title: 'Prompting Essentials',
      lessonType: 'hands_on_practice',
      order: 4,
      
      coreConcept: "Prompts are your steering wheel. When you give clear, structured prompts, you guide the AI to deliver better, more useful, and more accurate responses.",
      
      content: {
        beginner: {
          introduction: "AI is like a helpful friend who follows instructions exactly. Let's learn how to give really clear instructions!",
          
          promptElements: [
            { element: "Be Specific", example: "Instead of 'help me write', say 'help me write a thank you note to my teacher'" },
            { element: "Give Context", example: "Tell AI who you are: 'I'm a 5th grader who needs to...' " },
            { element: "Ask for Format", example: "Say 'give me 3 bullet points' or 'write 2 paragraphs'" }
          ],
          
          examples: [
            {
              weak: "Tell me about dogs",
              strong: "I'm doing a school report. Tell me 3 cool facts about golden retrievers for 4th graders.",
              why: "The strong prompt says who you are, what you need, and how you want it"
            }
          ]
        },
        
        intermediate: {
          introduction: "Effective prompting is about clear communication. Structure your requests like you would with a professional assistant.",
          
          promptFramework: [
            { component: "Role", description: "Set the AI's perspective", example: "You are a marketing expert..." },
            { component: "Task", description: "Clearly state what you want", example: "Create a social media strategy..." },
            { component: "Context", description: "Provide relevant background", example: "For a new coffee shop in Seattle..." },
            { component: "Format", description: "Specify output structure", example: "Provide 5 bullet points with explanations..." }
          ],
          
          examples: [
            {
              weak: "Help me with my presentation",
              strong: "You are a presentation coach. Help me create an outline for a 10-minute presentation about renewable energy for my college environmental science class. Provide 5 main sections with 2-3 talking points each.",
              improvements: ["Clear role", "Specific task", "Relevant context", "Defined format"]
            }
          ]
        },
        
        advanced: {
          introduction: "Advanced prompting leverages specific techniques to guide model reasoning and optimize output quality for complex tasks.",
          
          advancedTechniques: [
            { 
              technique: "Chain-of-Thought", 
              description: "Explicit step-by-step reasoning",
              example: "Let's think step by step: 1) Analyze the problem, 2) Consider alternatives, 3) Recommend solution"
            },
            {
              technique: "Few-Shot Learning",
              description: "Provide examples to establish pattern",
              example: "Input: 'excited' → Output: 'thrilled'. Input: 'sad' → Output: 'devastated'. Input: 'happy' → Output: ?"
            },
            {
              technique: "Role and Persona",
              description: "Detailed character with expertise and perspective",
              example: "You are Dr. Sarah Chen, a behavioral economist with 15 years of experience in consumer psychology..."
            }
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'prompt_builder',
        
        beginner: {
          instructions: "Practice building better prompts! Take a weak prompt and make it stronger.",
          exercises: [
            {
              scenario: "You want help planning a birthday party",
              weakPrompt: "Help me plan a party",
              guidedImprovement: {
                step1: "Who is the party for?",
                step2: "How many people?",
                step3: "What format do you want?",
                strongPrompt: "Help me plan a 10th birthday party for my daughter with 8 kids. Give me a simple checklist of things to do."
              }
            }
          ]
        },
        
        intermediate: {
          instructions: "Build professional-quality prompts using the Role-Task-Context-Format framework.",
          exercises: [
            {
              scenario: "Create content for a fitness app",
              framework: {
                role: "You are a certified personal trainer and nutrition expert",
                task: "Create a beginner workout plan",
                context: "For busy professionals who have 30 minutes, 3 times per week",
                format: "Provide a weekly schedule with exercise descriptions and progression tips"
              }
            }
          ]
        },
        
        advanced: {
          instructions: "Implement sophisticated prompting strategies for complex reasoning tasks.",
          exercises: [
            {
              challenge: "Design a prompt for strategic business analysis",
              requirements: ["Multi-step reasoning", "Consideration of alternatives", "Risk assessment", "Actionable recommendations"],
              evaluation: "Assess completeness, logical flow, and practical applicability"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 25, intermediate: 30, advanced: 35 },
      estimatedTime: { beginner: 15, intermediate: 20, advanced: 25 }
    },

    // LESSON 5: Prompt Engineering in Action
    {
      id: 'prompt-engineering-action',
      title: 'Prompt Engineering in Action',
      lessonType: 'advanced_practice',
      order: 5,
      
      coreConcept: "Prompt engineering is a craft. By using examples, structure, and step-by-step logic, you can get the AI to think, explain, and perform more like a professional assistant.",
      
      content: {
        beginner: {
          introduction: "Now let's get really good at talking to AI! We'll learn some tricks that make AI give much better answers.",
          
          techniques: [
            {
              name: "Show Examples",
              description: "Give AI 2-3 examples of what you want, then let it follow the pattern",
              example: "Turn sad into happy: gloomy → bright, frowning → smiling, crying → laughing. Now do: worried → ?"
            },
            {
              name: "Ask for Steps",
              description: "Tell AI to think step-by-step",
              example: "What's 15 x 12? Think step-by-step and show your work."
            },
            {
              name: "Try Again Better",
              description: "If the first answer isn't great, ask AI to improve it",
              example: "That's good, but can you make it simpler for a 6-year-old?"
            }
          ]
        },
        
        intermediate: {
          introduction: "Master advanced prompting techniques to consistently achieve professional-quality results from AI systems.",
          
          techniques: [
            {
              name: "Few-Shot Prompting",
              description: "Provide 2-3 examples to establish format and style",
              structure: "Example 1: [input] → [desired output]\nExample 2: [input] → [desired output]\nNow do: [your input] → ?",
              applications: ["Data formatting", "Style consistency", "Complex transformations"]
            },
            {
              name: "Chain-of-Thought Reasoning",
              description: "Guide AI through explicit reasoning steps",
              triggers: ["Let's think step by step", "Break this down systematically", "Consider each factor"],
              benefits: ["More accurate results", "Transparent reasoning", "Better problem-solving"]
            },
            {
              name: "Iterative Refinement",
              description: "Build on previous responses to improve quality",
              process: ["Initial prompt", "Review output", "Specific feedback", "Refined result"],
              example: "Good start. Now make it more concise and add specific examples."
            }
          ]
        },
        
        advanced: {
          introduction: "Implement sophisticated prompt engineering patterns for complex reasoning and specialized applications.",
          
          techniques: [
            {
              name: "Multi-Turn Reasoning",
              description: "Decompose complex problems into manageable steps",
              pattern: "First, analyze X. Then, consider Y. Finally, synthesize recommendations.",
              applications: ["Strategic planning", "Technical analysis", "Research synthesis"]
            },
            {
              name: "Perspective Taking",
              description: "Leverage multiple viewpoints for comprehensive analysis",
              structure: "Consider this from the perspectives of: [stakeholder 1], [stakeholder 2], [stakeholder 3]",
              benefits: ["Reduced bias", "Comprehensive coverage", "Creative solutions"]
            },
            {
              name: "Meta-Prompting",
              description: "Have AI improve its own prompts",
              technique: "Before answering, critique and improve this prompt: [original prompt]",
              use_cases: ["Prompt optimization", "Quality assurance", "Self-correction"]
            }
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'technique_practice',
        
        beginner: {
          instructions: "Practice the three main techniques: examples, step-by-step thinking, and trying again.",
          exercises: [
            {
              technique: "Examples",
              task: "Create a few-shot prompt to turn animals into their sounds",
              starter: "cow → moo, cat → meow, dog → ?"
            }
          ]
        },
        
        intermediate: {
          instructions: "Apply advanced techniques to achieve professional results. Focus on consistency and quality.",
          exercises: [
            {
              challenge: "Create email templates for different business scenarios",
              requirements: ["Few-shot pattern", "Professional tone", "Scalable format"],
              evaluation: "Consistency, professionalism, adaptability"
            }
          ]
        },
        
        advanced: {
          instructions: "Design sophisticated prompt strategies for complex analytical tasks.",
          exercises: [
            {
              scenario: "Market analysis for a new product launch",
              techniques: ["Multi-perspective analysis", "Chain-of-thought reasoning", "Iterative refinement"],
              deliverable: "Comprehensive analysis with actionable insights"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 30, intermediate: 35, advanced: 40 },
      estimatedTime: { beginner: 18, intermediate: 25, advanced: 30 }
    }
  ],

  'creative-applications': [
    // LESSON 6: Creative AI — Art, Video, and Voice
    {
      id: 'creative-ai-mastery',
      title: 'Creative AI — Art, Video, and Voice',
      lessonType: 'multimodal_practice',
      order: 6,
      
      coreConcept: "AI doesn't just write—it can help you create images, videos, and even realistic voices, just by describing what you want in detail. This lesson shows how to guide creative AIs effectively.",
      
      content: {
        beginner: {
          introduction: "Imagine telling someone to draw a picture just by describing it! That's what creative AI can do. Let's learn how to make amazing art, videos, and voices with AI.",
          
          tools: [
            { type: "Image AI", tools: "DALL-E, Midjourney", description: "Creates pictures from your words", example: "A cute robot eating ice cream" },
            { type: "Video AI", tools: "RunwayML, Kling AI", description: "Makes short videos", example: "A paper airplane flying through clouds" },
            { type: "Voice AI", tools: "ElevenLabs", description: "Creates realistic voices", example: "A friendly storyteller reading a bedtime story" }
          ],
          
          promptingTips: [
            "Be descriptive: 'A happy golden retriever playing in a sunny park with colorful flowers'",
            "Mention the style: 'like a cartoon' or 'like a photograph'",
            "For voices: say if you want it happy, sad, excited, or calm"
          ]
        },
        
        intermediate: {
          introduction: "Creative AI tools are revolutionizing content creation. Master these tools to enhance your projects with professional-quality visuals and audio.",
          
          toolCategories: [
            {
              category: "Image Generation",
              tools: ["Midjourney", "DALL-E 3", "Stable Diffusion"],
              applications: ["Marketing materials", "Social media content", "Concept art", "Product mockups"],
              promptStructure: "Subject + Setting + Style + Technical specs"
            },
            {
              category: "Video Generation", 
              tools: ["RunwayML", "Pika Labs", "Kling AI"],
              applications: ["Social media clips", "Explainer videos", "Product demos", "Animated content"],
              promptStructure: "Scene description + Camera movement + Duration + Style"
            },
            {
              category: "Voice Synthesis",
              tools: ["ElevenLabs", "Murf", "Play.ht"],
              applications: ["Voiceovers", "Podcasts", "Audio books", "Accessibility"],
              promptStructure: "Text + Voice characteristics + Emotion + Speed"
            }
          ],
          
          bestPractices: [
            "Start with clear, specific descriptions",
            "Iterate on prompts to refine results",
            "Consider your target audience and use case",
            "Combine multiple tools for complex projects"
          ]
        },
        
        advanced: {
          introduction: "Advanced creative AI workflows enable sophisticated content production pipelines with consistent quality and style control.",
          
          advancedWorkflows: [
            {
              workflow: "Brand Asset Creation",
              steps: ["Style guide definition", "Consistent prompt templates", "Asset generation", "Quality control"],
              tools: ["Midjourney with custom styles", "Brand-specific prompts", "Batch processing"]
            },
            {
              workflow: "Video Production Pipeline",
              steps: ["Script generation", "Visual planning", "Scene generation", "Voice synthesis", "Post-production"],
              integration: ["ChatGPT → Midjourney → RunwayML → ElevenLabs → Editing tools"]
            },
            {
              workflow: "Interactive Content",
              steps: ["Multi-modal planning", "Asset creation", "Voice integration", "Interactive elements"],
              considerations: ["User experience", "Technical constraints", "Scalability"]
            }
          ],
          
          technicalConsiderations: [
            "Resolution and format requirements",
            "Licensing and commercial use",
            "API integration and automation",
            "Cost optimization strategies"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'creative_prompt_lab',
        
        beginner: {
          instructions: "Create prompts for different creative AI tools. Focus on being descriptive and specific!",
          exercises: [
            {
              task: "Create an image prompt for a birthday party invitation",
              elements: ["Subject", "Setting", "Style", "Mood"],
              example: "A colorful birthday party with balloons and cake, cartoon style, happy and festive"
            }
          ]
        },
        
        intermediate: {
          instructions: "Design professional creative prompts for business use cases. Consider brand consistency and target audience.",
          exercises: [
            {
              scenario: "Social media campaign for a coffee shop",
              requirements: ["Brand colors", "Consistent style", "Multiple formats"],
              deliverable: "Series of coordinated image prompts"
            }
          ]
        },
        
        advanced: {
          instructions: "Build comprehensive creative workflows combining multiple AI tools for complex projects.",
          exercises: [
            {
              project: "Product launch campaign",
              components: ["Hero images", "Explainer video", "Voice narration"],
              challenge: "Maintain brand consistency across all generated content"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 25, intermediate: 35, advanced: 45 },
      estimatedTime: { beginner: 20, intermediate: 30, advanced: 40 }
    },

    // LESSON 7: Workflow Ideas Without Agents
    {
      id: 'ai-workflow-fundamentals',
      title: 'AI Workflow Fundamentals',
      lessonType: 'system_thinking',
      order: 7,
      
      coreConcept: "Even without full AI agents, you can build workflows using sequences of prompts across different tools. This teaches you how to think in systems and combine strengths.",
      
      content: {
        beginner: {
          introduction: "You can be like a conductor of an orchestra, telling different AI tools what to do in the right order to create something amazing!",
          
          workflowConcept: "A workflow is like following a recipe - you do step 1, then step 2, then step 3, using different AI tools for each step.",
          
          simpleWorkflows: [
            {
              name: "Story Creation",
              steps: [
                "1. Ask ChatGPT to write a short story",
                "2. Ask DALL-E to draw the main character", 
                "3. Ask ElevenLabs to read the story out loud"
              ],
              result: "A complete story with picture and audio!"
            },
            {
              name: "School Project Helper",
              steps: [
                "1. Ask AI to explain a topic simply",
                "2. Ask AI to make a fun drawing about it",
                "3. Ask AI to help write a summary"
              ],
              result: "A complete project with text and visuals!"
            }
          ]
        },
        
        intermediate: {
          introduction: "Systematic AI workflows enable you to tackle complex projects by breaking them into manageable steps and leveraging specialized tools.",
          
          workflowPrinciples: [
            "Identify the end goal and work backwards",
            "Choose the right tool for each specific task",
            "Ensure outputs from one step feed effectively into the next",
            "Build in quality control and iteration points"
          ],
          
          businessWorkflows: [
            {
              name: "Content Marketing Pipeline",
              steps: [
                "Research topic (ChatGPT)",
                "Create outline (Claude)", 
                "Write content (GPT-4)",
                "Generate visuals (Midjourney)",
                "Create social posts (ChatGPT + Midjourney)"
              ],
              benefits: ["Consistent quality", "Reduced time", "Scalable process"]
            },
            {
              name: "Customer Communication",
              steps: [
                "Analyze customer inquiry (Claude)",
                "Draft response template (ChatGPT)",
                "Personalize for specific case (GPT-4)",
                "Review and send"
              ],
              benefits: ["Faster response time", "Consistent tone", "Higher quality"]
            }
          ]
        },
        
        advanced: {
          introduction: "Enterprise-grade AI workflows require sophisticated orchestration, error handling, and optimization strategies for maximum efficiency and reliability.",
          
          advancedPatterns: [
            {
              pattern: "Parallel Processing",
              description: "Execute multiple AI tasks simultaneously",
              example: "Generate product descriptions, marketing copy, and technical specs in parallel",
              benefits: ["Reduced total time", "Resource optimization"]
            },
            {
              pattern: "Conditional Logic",
              description: "Different paths based on AI output analysis",
              example: "If sentiment analysis shows negative feedback → escalation path, else → standard response",
              implementation: ["Output classification", "Decision trees", "Automated routing"]
            },
            {
              pattern: "Quality Assurance Loops",
              description: "Built-in verification and improvement cycles",
              example: "Generate → Review → Refine → Validate → Deploy",
              components: ["Automated checking", "Human review points", "Iteration limits"]
            }
          ],
          
          scalingConsiderations: [
            "API rate limits and cost management",
            "Error handling and fallback strategies", 
            "Monitoring and performance optimization",
            "Version control and workflow documentation"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'workflow_builder',
        
        beginner: {
          instructions: "Design a simple 3-step workflow using different AI tools. Think about what order makes sense!",
          exercises: [
            {
              goal: "Create a birthday card",
              tools: ["ChatGPT", "DALL-E", "Your computer"],
              challenge: "Plan the steps to make a complete birthday card with text and image"
            }
          ]
        },
        
        intermediate: {
          instructions: "Build a professional workflow for a business scenario. Consider efficiency and quality control.",
          exercises: [
            {
              scenario: "Weekly newsletter creation",
              requirements: ["Research", "Writing", "Visuals", "Formatting"],
              goal: "Design a repeatable 5-step process"
            }
          ]
        },
        
        advanced: {
          instructions: "Architect a complex workflow with conditional logic and quality assurance. Consider scalability and error handling.",
          exercises: [
            {
              challenge: "Customer service automation workflow",
              requirements: ["Classification", "Response generation", "Quality check", "Human handoff"],
              complexity: "Handle multiple customer types and issue categories"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 30, intermediate: 40, advanced: 50 },
      estimatedTime: { beginner: 22, intermediate: 35, advanced: 45 }
    }
  ],

  'practical-applications': [
    // LESSON 8: AI for School, Work, and Life
    {
      id: 'ai-daily-applications',
      title: 'AI for School, Work, and Life',
      lessonType: 'practical_application',
      order: 8,
      
      coreConcept: "AI is your daily assistant—helping with homework, writing, planning, and managing your time. This lesson shows how to make AI genuinely useful.",
      
      content: {
        beginner: {
          introduction: "AI can help you with real things you do every day! Let's learn how to use AI for school, home, and fun activities.",
          
          schoolHelp: [
            "Explain hard topics in simple words",
            "Help check your homework",
            "Make flashcards for studying",
            "Help write reports and essays"
          ],
          
          homeHelp: [
            "Plan what to cook for dinner",
            "Help organize your room",
            "Plan fun activities",
            "Help with chores and schedules"
          ],
          
          simplePrompts: [
            "Explain [topic] like I'm 10 years old",
            "Help me make a list of things to do for [activity]",
            "What are 3 fun ways to learn about [subject]?"
          ]
        },
        
        intermediate: {
          introduction: "AI can significantly boost your productivity across all areas of life. Learn to integrate AI tools into your daily routines for maximum benefit.",
          
          categories: [
            {
              area: "Academic Success",
              applications: [
                "Research assistance and source finding",
                "Essay structure and outline creation", 
                "Study schedule optimization",
                "Concept explanation and examples",
                "Practice quiz generation"
              ],
              promptTemplates: [
                "Create a study plan for [subject] with [time available]",
                "Explain [concept] with real-world examples",
                "Generate 10 practice questions for [topic]"
              ]
            },
            {
              area: "Professional Productivity",
              applications: [
                "Email drafting and tone adjustment",
                "Meeting agenda creation",
                "Report writing and data analysis",
                "Project planning and task breakdown",
                "Presentation outline development"
              ],
              promptTemplates: [
                "Draft a professional email about [topic] with [tone]",
                "Create an agenda for [meeting type] lasting [duration]",
                "Break down [project] into actionable tasks"
              ]
            },
            {
              area: "Personal Organization",
              applications: [
                "Meal planning and grocery lists",
                "Travel itinerary creation",
                "Budget planning and expense tracking",
                "Health and fitness goal setting",
                "Home organization systems"
              ],
              promptTemplates: [
                "Create a weekly meal plan for [dietary preferences] and [budget]",
                "Plan a [duration] trip to [destination] with [interests]",
                "Design a budget for [income] with [financial goals]"
              ]
            }
          ]
        },
        
        advanced: {
          introduction: "Advanced AI integration creates comprehensive productivity systems that adapt to your specific needs and optimize your effectiveness across all life domains.",
          
          systemicApproaches: [
            {
              system: "Personal Knowledge Management",
              components: [
                "Information capture and processing",
                "Knowledge synthesis and connection", 
                "Insight generation and application",
                "Continuous learning optimization"
              ],
              implementation: [
                "AI-assisted note organization",
                "Concept mapping and relationship identification",
                "Personalized learning path creation",
                "Knowledge gap analysis and filling"
              ]
            },
            {
              system: "Professional Development Acceleration",
              components: [
                "Skill gap identification",
                "Learning resource curation",
                "Practice opportunity creation",
                "Progress tracking and adjustment"
              ],
              implementation: [
                "Career path analysis with AI guidance",
                "Customized skill development plans",
                "AI-generated practice scenarios",
                "Performance feedback and improvement suggestions"
              ]
            },
            {
              system: "Life Optimization Framework",
              components: [
                "Goal setting and prioritization",
                "Resource allocation optimization",
                "Progress monitoring and adjustment",
                "Success pattern identification"
              ],
              implementation: [
                "AI-assisted life design and planning",
                "Automated progress tracking and analysis",
                "Predictive modeling for decision making",
                "Continuous optimization recommendations"
              ]
            }
          ],
          
          integrationStrategies: [
            "Cross-platform workflow automation",
            "Personalized AI assistant configuration",
            "Data-driven decision making systems",
            "Continuous improvement feedback loops"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'real_world_application',
        
        beginner: {
          instructions: "Choose a real problem from your life and solve it using AI! Make it practical and useful.",
          exercises: [
            {
              categories: ["School homework", "Planning an event", "Learning something new", "Organizing your space"],
              task: "Pick one area and create 3 prompts that would actually help you",
              evaluation: "How useful would these prompts be in real life?"
            }
          ]
        },
        
        intermediate: {
          instructions: "Create a comprehensive AI-assisted solution for a complex life challenge. Focus on practical implementation.",
          exercises: [
            {
              scenarios: [
                "Starting a new job and getting up to speed quickly",
                "Planning a major life change (moving, career switch)",
                "Developing a new skill for personal or professional growth"
              ],
              requirements: ["Multi-step approach", "Different AI tools", "Measurable outcomes"],
              deliverable: "Complete action plan with AI integration points"
            }
          ]
        },
        
        advanced: {
          instructions: "Design a comprehensive AI-powered productivity system for long-term success. Consider sustainability and scalability.",
          exercises: [
            {
              challenge: "Create a 6-month personal development system",
              components: ["Goal setting", "Daily routines", "Progress tracking", "Adaptation mechanisms"],
              innovation: "How can AI make this system more effective than traditional approaches?"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 35, intermediate: 45, advanced: 55 },
      estimatedTime: { beginner: 25, intermediate: 40, advanced: 50 }
    },

    // LESSON 9: Hosting AI Locally & Open Source Models
    {
      id: 'local-ai-mastery',
      title: 'Hosting AI Locally & Open Source Models',
      lessonType: 'technical_exploration',
      order: 9,
      
      coreConcept: "You don't have to rely on cloud tools—AI can run on your own computer. This lesson explains why and how to use open-source models locally.",
      
      content: {
        beginner: {
          introduction: "Did you know AI can work on your own computer? Let's learn about having your very own AI that works even without the internet!",
          
          whyLocal: [
            "Your conversations stay private on your computer",
            "It works even without internet",
            "You don't have to pay monthly fees",
            "You can use it as much as you want"
          ],
          
          simpleOptions: [
            { name: "ChatGPT Desktop App", description: "Easy to install, works like the website", difficulty: "Super Easy" },
            { name: "Character.AI", description: "Fun AI characters on your phone", difficulty: "Easy" },
            { name: "GPT4All", description: "Free AI that runs on your computer", difficulty: "Medium" }
          ],
          
          whatYouNeed: [
            "A computer (not too old)",
            "Some space on your hard drive", 
            "Patience to download and learn"
          ]
        },
        
        intermediate: {
          introduction: "Local AI gives you control, privacy, and cost savings. Understanding the options and requirements helps you choose the right approach for your needs.",
          
          benefits: [
            { benefit: "Privacy", description: "Your data never leaves your device", importance: "Critical for sensitive work" },
            { benefit: "Cost Control", description: "No monthly subscriptions or per-use charges", importance: "Predictable budgeting" },
            { benefit: "Customization", description: "Fine-tune models for specific use cases", importance: "Specialized applications" },
            { benefit: "Offline Access", description: "Works without internet connection", importance: "Reliability and accessibility" }
          ],
          
          popularTools: [
            {
              tool: "Ollama",
              description: "Easy-to-use local AI runner",
              models: ["Llama 2", "Mistral", "CodeLlama"],
              requirements: "8GB+ RAM, modern CPU",
              useCase: "General text generation and coding help"
            },
            {
              tool: "LM Studio", 
              description: "User-friendly interface for running models",
              models: ["Wide variety of open source models"],
              requirements: "16GB+ RAM recommended",
              useCase: "Experimentation and model comparison"
            },
            {
              tool: "Text Generation WebUI",
              description: "Advanced interface with many customization options",
              models: ["Most open source language models"],
              requirements: "GPU recommended for speed",
              useCase: "Power users and researchers"
            }
          ],
          
          considerations: [
            "Model size vs performance tradeoffs",
            "Hardware requirements and costs",
            "Setup complexity and maintenance",
            "Community support and documentation"
          ]
        },
        
        advanced: {
          introduction: "Advanced local AI deployment enables enterprise-grade solutions with full control over infrastructure, security, and performance optimization.",
          
          architecturalOptions: [
            {
              approach: "Single-Node Deployment",
              description: "Run models on individual workstations or servers",
              pros: ["Simple setup", "Direct control", "Lower complexity"],
              cons: ["Limited scalability", "Resource constraints"],
              bestFor: ["Individual users", "Small teams", "Development work"]
            },
            {
              approach: "Distributed Computing",
              description: "Spread model execution across multiple machines",
              pros: ["Higher performance", "Scalability", "Resource sharing"],
              cons: ["Complex setup", "Network dependencies"],
              bestFor: ["Large teams", "High-demand applications", "Research"]
            },
            {
              approach: "Hybrid Cloud-Local",
              description: "Combine local processing with cloud resources",
              pros: ["Flexibility", "Cost optimization", "Redundancy"],
              cons: ["Complexity", "Integration challenges"],
              bestFor: ["Enterprise deployments", "Variable workloads"]
            }
          ],
          
          optimizationStrategies: [
            {
              strategy: "Model Quantization",
              description: "Reduce model precision to decrease memory usage",
              techniques: ["4-bit", "8-bit", "16-bit quantization"],
              tradeoffs: "Smaller size and faster inference vs potential accuracy loss"
            },
            {
              strategy: "Hardware Acceleration", 
              description: "Leverage specialized hardware for performance",
              options: ["GPU acceleration", "Apple Silicon optimization", "Intel/AMD optimizations"],
              considerations: "Hardware compatibility and driver requirements"
            },
            {
              strategy: "Model Selection",
              description: "Choose optimal models for specific use cases",
              factors: ["Task specialization", "Language support", "Performance requirements"],
              approach: "Benchmark multiple models against your specific needs"
            }
          ],
          
          enterpriseConsiderations: [
            "Security and compliance requirements",
            "Model governance and version control",
            "Performance monitoring and optimization",
            "Integration with existing systems and workflows"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'local_ai_planner',
        
        beginner: {
          instructions: "Plan your first local AI setup! Think about what you want to do and what you have available.",
          exercises: [
            {
              assessment: [
                "What do you want to use AI for?",
                "What kind of computer do you have?",
                "How comfortable are you with downloading software?"
              ],
              recommendation: "Based on your answers, we'll suggest the best starting option for you",
              nextSteps: "Simple checklist to get started"
            }
          ]
        },
        
        intermediate: {
          instructions: "Design a local AI solution for a specific use case. Consider requirements, tools, and implementation steps.",
          exercises: [
            {
              scenarios: [
                "Privacy-focused writing assistant for sensitive documents",
                "Offline coding assistant for remote development work",
                "Local customer service chatbot for small business"
              ],
              planning: ["Requirements analysis", "Tool selection", "Implementation roadmap"],
              deliverable: "Complete setup plan with cost and time estimates"
            }
          ]
        },
        
        advanced: {
          instructions: "Architect an enterprise-grade local AI deployment. Consider scalability, security, and performance optimization.",
          exercises: [
            {
              challenge: "Design local AI infrastructure for a 100-person company",
              requirements: ["Security compliance", "Multi-user access", "Performance at scale"],
              complexity: "Balance cost, performance, and operational complexity"
            }
          ]
        }
      },
      
      xpRewards: { beginner: 30, intermediate: 45, advanced: 60 },
      estimatedTime: { beginner: 20, intermediate: 35, advanced: 50 }
    },

    // LESSON 10: AI Problem-Solving Lab
    {
      id: 'ai-problem-solving-capstone',
      title: 'AI Problem-Solving Lab',
      lessonType: 'capstone_project',
      order: 10,
      
      coreConcept: "You've learned the tools—now use them. This lab helps you solve realistic problems using your prompting skills and preferred tools.",
      
      content: {
        beginner: {
          introduction: "Time to put everything together! Choose a fun challenge and show what you've learned. This is your chance to be creative and solve real problems.",
          
          challengeCategories: [
            {
              category: "Creative Projects",
              challenges: [
                "Create a complete children's book (story + illustrations + narration)",
                "Design a poster for a school event with AI tools",
                "Make a fun video about your hobby or interest"
              ]
            },
            {
              category: "Helpful Solutions",
              challenges: [
                "Plan a perfect birthday party for someone you know",
                "Create a study guide for your hardest subject",
                "Design a weekly schedule that includes everything you need to do"
              ]
            },
            {
              category: "Learning Adventures",
              challenges: [
                "Explore a topic you're curious about and create a presentation",
                "Learn about a country you want to visit and plan a virtual trip",
                "Research a career you're interested in and create an action plan"
              ]
            }
          ],
          
          successTips: [
            "Start with something you actually care about",
            "Use at least 2 different AI tools",
            "Don't worry if it's not perfect - focus on learning!",
            "Ask for help if you get stuck"
          ]
        },
        
        intermediate: {
          introduction: "Apply your AI skills to solve meaningful challenges that demonstrate professional-level competency and creative problem-solving.",
          
          professionalChallenges: [
            {
              domain: "Business Solutions",
              projects: [
                "Create a complete marketing campaign for a local business",
                "Design an onboarding process for new employees", 
                "Develop a customer feedback analysis system"
              ],
              skills: ["Strategic thinking", "Multi-tool coordination", "Professional communication"]
            },
            {
              domain: "Educational Innovation",
              projects: [
                "Design an AI-enhanced learning experience for a specific skill",
                "Create adaptive study materials for different learning styles",
                "Develop a peer tutoring support system"
              ],
              skills: ["Instructional design", "Personalization", "Assessment creation"]
            },
            {
              domain: "Creative Production",
              projects: [
                "Produce a short documentary using AI tools for research, scripting, and visuals",
                "Create a multimedia art installation concept",
                "Design an interactive storytelling experience"
              ],
              skills: ["Creative direction", "Technical integration", "Audience engagement"]
            }
          ],
          
          evaluationCriteria: [
            "Problem definition and understanding",
            "Tool selection and integration",
            "Quality of outputs and refinement",
            "Innovation and creative application",
            "Practical value and implementation potential"
          ]
        },
        
        advanced: {
          introduction: "Tackle complex, multi-faceted challenges that require sophisticated AI integration, strategic thinking, and innovative solutions.",
          
          masteryChallenges: [
            {
              challenge: "AI-Powered Business Transformation",
              scope: "Design comprehensive AI integration strategy for an organization",
              complexity: [
                "Multi-departmental impact analysis",
                "Technology stack evaluation",
                "Change management planning",
                "ROI modeling and risk assessment"
              ],
              deliverables: [
                "Strategic roadmap with implementation phases",
                "Pilot project specifications",
                "Training and adoption framework",
                "Success metrics and monitoring plan"
              ]
            },
            {
              challenge: "Social Impact AI Solution",
              scope: "Create AI-powered solution for a societal challenge",
              complexity: [
                "Stakeholder analysis and engagement",
                "Ethical considerations and bias mitigation",
                "Scalability and sustainability planning",
                "Impact measurement framework"
              ],
              deliverables: [
                "Problem analysis and solution design",
                "Technical architecture and implementation plan",
                "Ethical framework and safeguards",
                "Pilot deployment strategy"
              ]
            },
            {
              challenge: "Next-Generation Learning Platform",
              scope: "Design revolutionary educational experience using cutting-edge AI",
              complexity: [
                "Personalization at scale",
                "Multi-modal content generation",
                "Adaptive assessment systems",
                "Community and collaboration features"
              ],
              deliverables: [
                "Platform architecture and user experience design",
                "AI integration specifications",
                "Content generation and curation framework",
                "Pilot implementation and validation plan"
              ]
            }
          ],
          
          masteryIndicators: [
            "Systems thinking and holistic problem approach",
            "Innovative application of multiple AI technologies",
            "Consideration of ethical, social, and economic implications",
            "Scalable and sustainable solution design",
            "Clear communication of complex technical concepts"
          ]
        }
      },
      
      sandbox: {
        required: true,
        type: 'capstone_showcase',
        
        beginner: {
          instructions: "Choose your challenge and show your work! Document your process and celebrate what you create.",
          framework: [
            "1. Pick a challenge that excites you",
            "2. Plan your approach and tools",
            "3. Create your solution step by step",
            "4. Share what you learned and what you made"
          ],
          support: [
            "Guided prompts for each challenge type",
            "Example workflows and templates",
            "Encouragement and celebration of efforts"
          ]
        },
        
        intermediate: {
          instructions: "Demonstrate professional-level AI application through a comprehensive project. Focus on quality, innovation, and practical value.",
          requirements: [
            "Clear problem definition and solution approach",
            "Integration of multiple AI tools and techniques",
            "Professional-quality deliverables",
            "Reflection on process and lessons learned"
          ],
          evaluation: [
            "Technical execution and tool mastery",
            "Creative problem-solving approach",
            "Quality and completeness of solution",
            "Professional presentation and documentation"
          ]
        },
        
        advanced: {
          instructions: "Showcase mastery through an innovative, complex solution that demonstrates deep understanding of AI capabilities and limitations.",
          standards: [
            "Original thinking and novel applications",
            "Sophisticated technical integration",
            "Comprehensive consideration of implications",
            "Scalable and implementable solutions"
          ],
          portfolio: [
            "Executive summary and strategic overview",
            "Technical specifications and architecture",
            "Implementation roadmap and resource requirements",
            "Impact assessment and success metrics"
          ]
        }
      },
      
      xpRewards: { beginner: 50, intermediate: 75, advanced: 100 },
      estimatedTime: { beginner: 45, intermediate: 90, advanced: 120 }
    }
  ],

  // Vibe Coding lessons
  'interactive-coding': [
    {
      id: 'vibe-code-video-game',
      title: 'Vibe Coding a Video Game',
      lessonType: 'interactive_coding_with_ai',
      order: 1,
      
      coreConcept: "Create playable browser games using natural language prompts and AI. Learn the art of 'vibe coding' where you describe your game idea and let GPT-4o turn it into working HTML and JavaScript code.",
      
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
          
          examples: [
            "A game where the player catches apples falling from the sky using arrow keys",
            "A simple platformer where you jump over obstacles with spacebar",
            "A maze game where you collect gems while avoiding enemies"
          ],
          
          exercises: [
            {
              title: "Exercise 1: Describe Your Game Idea",
              instructions: "Write a simple description of a game you'd like to create. Think about what the player does, how they control it, and what makes it fun.",
              example: "A game where the player catches apples falling from the sky using arrow keys. When you catch an apple, you get points. If you miss 3 apples, the game ends.",
              expectedOutcome: "A well-formed prompt for GPT-4o to interpret and turn into code",
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
              maxLength: 250,
              validation: {
                required: true,
                minLength: 10,
                sanitization: true,
                allowedCharacters: "^[a-zA-Z0-9\\s\\.,!?'\"()\\-\\/]+$",
                blockedPatterns: [
                  "script", "javascript", "eval", "function", "onclick", "onload",
                  "<[^>]*>",
                  "javascript:", "data:", "vbscript:"
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
            
            inputSanitization: {
              maxLength: 250,
              stripHTML: true,
              escapeSpecialChars: true,
              blockedTerms: ['script', 'eval', 'function', 'onclick', 'onload', 'javascript:', 'data:', 'vbscript:']
            }
          }
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
      
      xpRewards: { beginner: 50, intermediate: 60, advanced: 75 },
      estimatedTime: { beginner: 20, intermediate: 25, advanced: 30 },
      
      // Premium lesson metadata
      isPremium: true,
      category: 'Creative Coding',
      tags: ['game-development', 'ai-coding', 'javascript', 'html', 'creative'],
      difficulty: 'beginner'
    }
  ]
};

export default {
  promptEngineeringMasteryPath,
  adaptiveModules,
  adaptiveLessons
}; 