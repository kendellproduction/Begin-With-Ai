import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Sample learning paths data
 */
const sampleLearningPaths = [
  {
    id: 'ai-fundamentals',
    title: 'AI Fundamentals',
    description: 'Understand the basics of Artificial Intelligence, LLMs, and prompt engineering.',
    iconUrl: '/icons/ai-fundamentals.svg',
    estimatedDuration: '2 hours',
    targetAudience: ['beginner'],
    published: true,
    isPremium: false,
    version: 1,
    order: 1
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering Mastery',
    description: 'Learn advanced techniques for crafting effective prompts for AI models.',
    iconUrl: '/icons/prompt-engineering.svg',
    estimatedDuration: '3 hours',
    targetAudience: ['intermediate'],
    published: true,
    isPremium: false,
    version: 1,
    order: 2
  },
  {
    id: 'ai-tools',
    title: 'AI Tools & Applications',
    description: 'Explore practical AI tools and their real-world applications.',
    iconUrl: '/icons/ai-tools.svg',
    estimatedDuration: '4 hours',
    targetAudience: ['beginner', 'intermediate'],
    published: true,
    isPremium: true,
    version: 1,
    order: 3
  }
];

/**
 * Sample modules for each learning path
 */
const sampleModules = {
  'ai-fundamentals': [
    {
      id: 'intro-to-ai',
      title: 'Introduction to AI',
      description: 'What is AI and how does it work?',
      order: 1
    },
    {
      id: 'understanding-llms',
      title: 'Understanding Large Language Models',
      description: 'Learn about LLMs like GPT, Claude, and others.',
      order: 2
    },
    {
      id: 'ai-ethics',
      title: 'AI Ethics & Safety',
      description: 'Important considerations when working with AI.',
      order: 3
    }
  ],
  'prompt-engineering': [
    {
      id: 'prompt-basics',
      title: 'Prompt Engineering Basics',
      description: 'Fundamentals of writing effective prompts.',
      order: 1
    },
    {
      id: 'advanced-techniques',
      title: 'Advanced Prompt Techniques',
      description: 'Chain-of-thought, few-shot learning, and more.',
      order: 2
    },
    {
      id: 'prompt-optimization',
      title: 'Prompt Optimization',
      description: 'Testing and refining your prompts for better results.',
      order: 3
    }
  ],
  'ai-tools': [
    {
      id: 'content-creation',
      title: 'AI for Content Creation',
      description: 'Using AI tools for writing, design, and media.',
      order: 1
    },
    {
      id: 'productivity-tools',
      title: 'AI Productivity Tools',
      description: 'Streamline your workflow with AI assistants.',
      order: 2
    },
    {
      id: 'business-applications',
      title: 'AI in Business',
      description: 'How businesses are leveraging AI for growth.',
      order: 3
    }
  ]
};

/**
 * Sample lessons for each module
 */
const sampleLessons = {
  'intro-to-ai': [
    {
      id: 'what-is-ai',
      title: 'What is Artificial Intelligence?',
      lessonType: 'concept_explanation',
      content: [
        {
          type: 'text',
          value: 'Artificial Intelligence (AI) is the simulation of human intelligence in machines...'
        },
        {
          type: 'image',
          url: '/images/ai-concept.png',
          altText: 'AI concept illustration'
        }
      ],
      xpAward: 10,
      estimatedTimeMinutes: 5,
      order: 1
    },
    {
      id: 'types-of-ai',
      title: 'Types of AI Systems',
      lessonType: 'concept_explanation',
      content: [
        {
          type: 'text',
          value: 'There are different types of AI systems: Narrow AI, General AI, and Super AI...'
        }
      ],
      xpAward: 15,
      estimatedTimeMinutes: 7,
      order: 2
    }
  ],
  'understanding-llms': [
    {
      id: 'what-are-llms',
      title: 'What are Large Language Models?',
      lessonType: 'concept_explanation',
      content: [
        {
          type: 'text',
          value: 'Large Language Models (LLMs) are AI systems trained on vast amounts of text...'
        }
      ],
      xpAward: 15,
      estimatedTimeMinutes: 8,
      order: 1
    },
    {
      id: 'popular-llms',
      title: 'Popular LLMs: GPT, Claude, and More',
      lessonType: 'concept_explanation',
      content: [
        {
          type: 'text',
          value: 'Let\'s explore the most popular LLMs available today...'
        }
      ],
      xpAward: 20,
      estimatedTimeMinutes: 10,
      order: 2
    }
  ],
  'prompt-basics': [
    {
      id: 'first-prompt',
      title: 'Writing Your First Prompt',
      lessonType: 'prompt_input_challenge',
      content: [
        {
          type: 'text',
          value: 'A prompt is an instruction you give to an AI model...'
        }
      ],
      interactiveElement: {
        promptPlaceholder: 'Write a creative story about a robot learning to code',
        targetAIModel: 'text_generation_creative',
        evaluationCriteria: 'User submits a prompt. Focus on creativity and clarity.'
      },
      xpAward: 25,
      estimatedTimeMinutes: 15,
      order: 1
    }
  ]
};

/**
 * Seeds the database with sample data
 */
export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Seed learning paths
    for (const path of sampleLearningPaths) {
      const pathRef = doc(db, 'learningPaths', path.id);
      await setDoc(pathRef, {
        ...path,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Seeded learning path: ${path.title}`);

      // Seed modules for this path
      const modules = sampleModules[path.id] || [];
      for (const module of modules) {
        const moduleRef = doc(db, 'learningPaths', path.id, 'modules', module.id);
        await setDoc(moduleRef, {
          ...module,
          learningPathId: path.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log(`  Seeded module: ${module.title}`);

        // Seed lessons for this module
        const lessons = sampleLessons[module.id] || [];
        for (const lesson of lessons) {
          const lessonRef = doc(db, 'learningPaths', path.id, 'modules', module.id, 'lessons', lesson.id);
          await setDoc(lessonRef, {
            ...lesson,
            lessonModuleId: module.id,
            learningPathId: path.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          console.log(`    Seeded lesson: ${lesson.title}`);
        }
      }
    }

    console.log('Database seeding completed successfully!');
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

/**
 * Creates a test user progress entry
 */
export const createTestUserProgress = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    // Create some sample progress entries
    const progressEntries = [
      {
        lessonId: 'what-is-ai',
        lessonModuleId: 'intro-to-ai',
        learningPathId: 'ai-fundamentals',
        status: 'completed',
        score: 100,
        completedAt: serverTimestamp()
      },
      {
        lessonId: 'types-of-ai',
        lessonModuleId: 'intro-to-ai',
        learningPathId: 'ai-fundamentals',
        status: 'in_progress',
        score: null
      }
    ];

    for (const progress of progressEntries) {
      const progressRef = doc(db, 'userProgress', `${userId}_${progress.lessonId}`);
      await setDoc(progressRef, {
        userId,
        ...progress,
        updatedAt: serverTimestamp()
      });
    }

    console.log(`Created test progress for user: ${userId}`);
    return { success: true };
  } catch (error) {
    console.error('Error creating test user progress:', error);
    throw error;
  }
};

/**
 * Utility to check if database has been seeded
 */
export const isDatabaseSeeded = async () => {
  try {
    const pathRef = doc(db, 'learningPaths', 'ai-fundamentals');
    const pathDoc = await getDoc(pathRef);
    return pathDoc.exists();
  } catch (error) {
    console.error('Error checking if database is seeded:', error);
    return false;
  }
};

export default {
  seedDatabase,
  createTestUserProgress,
  isDatabaseSeeded,
  sampleLearningPaths,
  sampleModules,
  sampleLessons
}; 