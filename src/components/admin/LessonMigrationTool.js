import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

const LessonMigrationTool = ({ onShowNotification }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [completed, setCompleted] = useState(false);
  const { user } = useAuth();

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

  const createLearningPathsAndModules = async () => {
    setStatus('Creating learning paths and modules...');
    
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
    
    setProgress(30);
  };

  const createBlankLessons = async () => {
    setStatus('Creating blank lessons...');
    
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
        createdBy: user?.uid || 'admin-migration',
        version: 1
      };
      
      // Save to Firestore
      await setDoc(
        doc(db, 'learningPaths', lesson.pathId, 'modules', lesson.moduleId, 'lessons', lesson.id),
        blankLesson
      );
      
      setProgress(30 + ((i + 1) / lessonsToCreate.length) * 70);
      setStatus(`Created: ${lesson.title}`);
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const runMigration = async () => {
    if (!user?.uid) {
      onShowNotification?.('error', 'You must be logged in to run migration');
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setCompleted(false);
    
    try {
      setStatus('Starting lesson migration...');
      
      // Step 1: Create learning paths and modules
      await createLearningPathsAndModules();
      
      // Step 2: Create blank lessons
      await createBlankLessons();
      
      setProgress(100);
      setStatus('Migration completed successfully!');
      setCompleted(true);
      
      // Mark migration as completed in localStorage
      localStorage.setItem('lessonMigrationCompleted', 'true');
      localStorage.setItem('lessonMigrationCompletedAt', new Date().toISOString());
      
      onShowNotification?.('success', 'Lesson migration completed! Static lessons replaced with editable Firestore lessons.');
      
      // Auto-refresh the page after 3 seconds to hide the migration tool
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    } catch (error) {
      console.error('Migration failed:', error);
      setStatus(`Migration failed: ${error.message}`);
      onShowNotification?.('error', `Migration failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Lesson Migration Tool</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-yellow-200 text-sm">
              <strong>Warning:</strong> This will replace all static lesson content with blank, editable lessons in Firestore. 
              This action is necessary to fix the lesson editing issues you're experiencing.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-white">What this migration will do:</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Create proper learning paths and modules in Firestore</li>
              <li>• Replace {lessonsToCreate.length} static lessons with blank, editable versions</li>
              <li>• Each lesson will have correct pathId and moduleId for admin editing</li>
              <li>• Lessons will be ready for you to build out in the editor</li>
              <li>• Lesson viewer will load from Firestore (no more static content conflicts)</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-white">Lessons to be migrated:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
              {lessonsToCreate.map(lesson => (
                <div key={lesson.id} className="bg-gray-700/50 rounded p-2">
                  <div className="font-medium">{lesson.title}</div>
                  <div className="text-xs text-gray-400">{lesson.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Migration Progress */}
      {(isRunning || completed) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {completed ? (
                <CheckCircleIcon className="w-6 h-6 text-green-400" />
              ) : (
                <ClockIcon className="w-6 h-6 text-blue-400 animate-spin" />
              )}
              <h4 className="font-medium text-white">Migration Progress</h4>
            </div>
            
            <div className="space-y-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-300">{status}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      {!isRunning && !completed && (
        <button
          onClick={runMigration}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <PlayIcon className="w-5 h-5" />
          <span>Start Migration</span>
        </button>
      )}

      {completed && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-green-200 text-sm mb-3">
            ✅ Migration completed! You can now edit lessons in the admin panel without static content conflicts.
            The lesson editor should now save properly with the correct pathId and moduleId information.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                localStorage.setItem('lessonMigrationCompleted', 'true');
                localStorage.setItem('lessonMigrationCompletedAt', new Date().toISOString());
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              Hide Migration Tool
            </button>
            <button
              onClick={() => window.location.href = '/admin/unified-panel?section=content-management'}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
            >
              Go to Lesson Editor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonMigrationTool; 