import { db, doc, setDoc, collection, getDocs, deleteDoc } from '../../scripts/firestoreAdminCompat.js';

// Define the lessons we want to create blank versions of
const lessonsToCreate = [
  {
    id: 'welcome-ai-revolution',
    title: 'AI History: How We Got Here & Where We\'re Going', 
    description: 'Understanding how AI evolved from 1950s research to today\'s tools like ChatGPT, and where we\'re headed next.',
    category: 'AI Fundamentals',
    pathId: 'ai-fundamentals',
    moduleId: 'intro-to-ai'
  },
  {
    id: 'history-of-ai',
    title: 'The Complete History of Artificial Intelligence',
    description: 'Deep dive into AI\'s fascinating journey from Alan Turing to modern machine learning.',
    category: 'AI Fundamentals', 
    pathId: 'ai-fundamentals',
    moduleId: 'intro-to-ai'
  },
  {
    id: 'prompt-engineering-basics',
    title: 'Prompt Engineering Fundamentals',
    description: 'Learn the art and science of crafting effective prompts for AI systems.',
    category: 'Prompt Engineering',
    pathId: 'prompt-engineering-mastery',
    moduleId: 'prompt-fundamentals'
  },
  {
    id: 'ai-ethics-introduction',
    title: 'AI Ethics and Responsible Development',
    description: 'Understanding the ethical implications and responsible practices in AI development.',
    category: 'AI Ethics',
    pathId: 'ai-fundamentals', 
    moduleId: 'ai-ethics'
  },
  {
    id: 'machine-learning-basics',
    title: 'Machine Learning Fundamentals',
    description: 'Introduction to machine learning concepts, algorithms, and applications.',
    category: 'Machine Learning',
    pathId: 'ai-fundamentals',
    moduleId: 'machine-learning-intro'
  },
  {
    id: 'neural-networks-intro',
    title: 'Introduction to Neural Networks',
    description: 'Understanding how neural networks work and their role in modern AI.',
    category: 'Deep Learning',
    pathId: 'ai-fundamentals',
    moduleId: 'neural-networks'
  },
  {
    id: 'chatgpt-and-llms',
    title: 'ChatGPT and Large Language Models',
    description: 'Exploring how ChatGPT and other LLMs work and their capabilities.',
    category: 'Language Models',
    pathId: 'ai-fundamentals',
    moduleId: 'language-models'
  },
  {
    id: 'ai-tools-overview',
    title: 'Essential AI Tools for Beginners',
    description: 'Comprehensive guide to AI tools every beginner should know about.',
    category: 'AI Tools',
    pathId: 'ai-tools-mastery',
    moduleId: 'tool-fundamentals'
  }
];

// Create learning paths and modules first
const createLearningPathsAndModules = async () => {
  console.log('Creating learning paths and modules...');
  
  // AI Fundamentals Path
  await setDoc(doc(db, 'learningPaths', 'ai-fundamentals'), {
    title: 'AI Fundamentals',
    description: 'Complete introduction to artificial intelligence concepts and applications',
    category: 'Fundamentals',
    difficulty: 'beginner',
    estimatedHours: 20,
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Prompt Engineering Path  
  await setDoc(doc(db, 'learningPaths', 'prompt-engineering-mastery'), {
    title: 'Prompt Engineering Mastery',
    description: 'Master the art of prompt engineering for AI systems',
    category: 'Advanced',
    difficulty: 'intermediate', 
    estimatedHours: 15,
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // AI Tools Path
  await setDoc(doc(db, 'learningPaths', 'ai-tools-mastery'), {
    title: 'AI Tools Mastery',
    description: 'Comprehensive guide to AI tools and applications',
    category: 'Practical',
    difficulty: 'beginner',
    estimatedHours: 12,
    isActive: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Create modules
  const modules = [
    { pathId: 'ai-fundamentals', id: 'intro-to-ai', title: 'Introduction to AI', order: 1 },
    { pathId: 'ai-fundamentals', id: 'ai-ethics', title: 'AI Ethics', order: 2 },
    { pathId: 'ai-fundamentals', id: 'machine-learning-intro', title: 'Machine Learning Basics', order: 3 },
    { pathId: 'ai-fundamentals', id: 'neural-networks', title: 'Neural Networks', order: 4 },
    { pathId: 'ai-fundamentals', id: 'language-models', title: 'Language Models', order: 5 },
    { pathId: 'prompt-engineering-mastery', id: 'prompt-fundamentals', title: 'Prompt Fundamentals', order: 1 },
    { pathId: 'ai-tools-mastery', id: 'tool-fundamentals', title: 'Essential Tools', order: 1 }
  ];

  for (const module of modules) {
    await setDoc(doc(db, 'learningPaths', module.pathId, 'modules', module.id), {
      title: module.title,
      description: `Learn about ${module.title.toLowerCase()}`,
      order: module.order,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  console.log('Learning paths and modules created successfully!');
};

// Create blank lessons
const createBlankLessons = async () => {
  console.log('Creating blank lessons...');
  
  for (let i = 0; i < lessonsToCreate.length; i++) {
    const lesson = lessonsToCreate[i];
    
    // Create a blank lesson with proper structure
    const blankLesson = {
      title: lesson.title,
      description: lesson.description,
      category: lesson.category,
      difficulty: 'beginner',
      estimatedTimeMinutes: 15,
      xpAward: 100,
      order: i + 1,
      isActive: true,
      
      // Content structure for the new editor
      contentVersions: {
        free: {
          title: lesson.title,
          description: lesson.description,
          pages: [
            {
              id: `${lesson.id}-intro-page`,
              title: 'Introduction',
              blocks: [
                {
                  id: `${lesson.id}-title-block`,
                  type: 'heading',
                  content: {
                    text: lesson.title,
                    level: 1
                  },
                  styles: {
                    marginTop: 0,
                    marginBottom: 16
                  }
                },
                {
                  id: `${lesson.id}-description-block`, 
                  type: 'paragraph',
                  content: {
                    text: lesson.description + '\n\nThis lesson is ready for you to edit and add your content!'
                  },
                  styles: {
                    marginTop: 16,
                    marginBottom: 16
                  }
                }
              ],
              created: new Date().toISOString()
            }
          ]
        },
        premium: {
          title: lesson.title,
          description: lesson.description,
          pages: [
            {
              id: `${lesson.id}-premium-intro-page`,
              title: 'Premium Introduction',
              blocks: [
                {
                  id: `${lesson.id}-premium-title-block`,
                  type: 'heading',
                  content: {
                    text: lesson.title + ' (Premium)',
                    level: 1
                  },
                  styles: {
                    marginTop: 0,
                    marginBottom: 16
                  }
                },
                {
                  id: `${lesson.id}-premium-description-block`,
                  type: 'paragraph', 
                  content: {
                    text: lesson.description + '\n\nThis is the premium version with additional content, exercises, and detailed explanations. Ready for you to edit!'
                  },
                  styles: {
                    marginTop: 16,
                    marginBottom: 16
                  }
                }
              ],
              created: new Date().toISOString()
            }
          ]
        }
      },
      
      // Legacy content field for backward compatibility
      content: lesson.description + '\n\nThis lesson is ready for editing in the admin panel.',
      
      // Metadata
      tags: [lesson.category.toLowerCase().replace(' ', '-'), 'beginner', 'fundamentals'],
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin-migration',
      version: 1
    };
    
    // Save to Firestore
    await setDoc(
      doc(db, 'learningPaths', lesson.pathId, 'modules', lesson.moduleId, 'lessons', lesson.id),
      blankLesson
    );
    
    console.log(`Created blank lesson: ${lesson.title}`);
  }
  
  console.log('All blank lessons created successfully!');
};

// Main function to run the migration
const runMigration = async () => {
  try {
    console.log('🚀 Starting lesson migration to blank Firestore structure...');
    
    // Step 1: Create learning paths and modules
    await createLearningPathsAndModules();
    
    // Step 2: Create blank lessons
    await createBlankLessons();
    
    console.log('✅ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. The static lesson data is now replaced with blank Firestore lessons');
    console.log('2. Each lesson has the correct pathId and moduleId for admin editing');
    console.log('3. You can now edit these lessons in the admin panel');
    console.log('4. The lesson viewer will load from Firestore first');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// Export for manual running
export { runMigration, createBlankLessons, createLearningPathsAndModules };

// Run if called directly
if (typeof window === 'undefined') {
  runMigration();
} 