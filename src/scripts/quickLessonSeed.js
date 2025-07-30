import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';

/**
 * Quick Lesson Seeding Script
 * Creates basic lessons to fix the "loading lesson content" issue
 */

const quickLessons = [
  {
    id: 'welcome-ai-revolution',
    title: 'AI History: How We Got Here & Where We\'re Going',
    description: 'Understanding how AI evolved from 1950s research to today\'s tools like ChatGPT, and where we\'re headed next.',
    pathId: 'ai-fundamentals',
    moduleId: 'intro-to-ai'
  },
  {
    id: 'how-ai-thinks',
    title: 'How AI "Thinks" — From Data to Decisions',
    description: 'Learn how AI processes information and makes decisions, from training data to final outputs.',
    pathId: 'ai-fundamentals', 
    moduleId: 'intro-to-ai'
  },
  {
    id: 'ai-vocabulary-bootcamp',
    title: 'AI Vocabulary Bootcamp: Master 25 Essential Terms',
    description: 'Build your AI vocabulary with the most important terms every AI user should know.',
    pathId: 'ai-fundamentals',
    moduleId: 'intro-to-ai'
  }
];

const createLearningPath = async () => {
  // Create AI Fundamentals learning path
  await setDoc(doc(db, 'learningPaths', 'ai-fundamentals'), {
    title: 'AI Fundamentals',
    description: 'Complete introduction to artificial intelligence concepts and applications',
    category: 'Fundamentals',
    difficulty: 'beginner',
    estimatedHours: 20,
    isActive: true,
    order: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Create intro module
  await setDoc(doc(db, 'learningPaths', 'ai-fundamentals', 'modules', 'intro-to-ai'), {
    title: 'Introduction to AI',
    description: 'Getting started with artificial intelligence basics',
    order: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

const createLessons = async () => {
  for (let i = 0; i < quickLessons.length; i++) {
    const lesson = quickLessons[i];
    
    const lessonData = {
      title: lesson.title,
      description: lesson.description,
      lessonType: 'concept_explanation',
      estimatedTimeMinutes: 15,
      xpAward: 100,
      category: 'AI Fundamentals',
      tags: ['ai', 'fundamentals', 'beginner'],
      status: 'published',
      order: i + 1,
      
      // Content in the new format expected by lesson viewers
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
                    text: lesson.description + '\n\nThis lesson is ready for you to edit and expand in the admin panel!'
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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: 'quick-seed-script',
      version: 1
    };
    
    // Save to Firestore
    await setDoc(
      doc(db, 'learningPaths', lesson.pathId, 'modules', lesson.moduleId, 'lessons', lesson.id),
      lessonData
    );
    
    console.log(`Created lesson: ${lesson.title}`);
  }
};

export const runQuickSeed = async () => {
  try {
    console.log('🚀 Starting quick lesson seeding...');
    
    // Step 1: Create learning path and module
    console.log('📚 Creating learning path and module...');
    await createLearningPath();
    
    // Step 2: Create lessons
    console.log('📝 Creating lessons...');
    await createLessons();
    
    console.log('✅ Quick seeding completed successfully!');
    console.log(`Created ${quickLessons.length} lessons in the AI Fundamentals path.`);
    console.log('🎉 You can now view these lessons in your app!');
    
    return { success: true, count: quickLessons.length };
    
  } catch (error) {
    console.error('❌ Quick seeding failed:', error);
    throw error;
  }
};

// For direct script execution
if (process.env.NODE_ENV !== 'production') {
  window.runQuickSeed = runQuickSeed;
} 