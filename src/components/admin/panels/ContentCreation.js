import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DocumentPlusIcon,
  CubeTransparentIcon,
  FolderPlusIcon,
  BookOpenIcon,
  VideoCameraIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlayIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

// Import admin services for lesson management
import { 
  getAllLearningPaths, 
  createLearningPath, 
  createModule,
  createLesson
} from '../../../services/adminService';

const ContentCreation = () => {
  const navigate = useNavigate();
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadLearningPaths();
  }, []);

  const loadLearningPaths = async () => {
    try {
      const paths = await getAllLearningPaths();
      setLearningPaths(paths);
    } catch (error) {
      console.error('Error loading learning paths:', error);
      showNotification('error', 'Error loading learning paths');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Quick creation actions
  const creationOptions = [
    {
      id: 'unified-lesson-builder',
      title: 'Lesson Builder',
      description: 'Powerful unified editor with inline editing, drag & drop, and live preview',
      icon: CubeTransparentIcon,
      gradient: 'from-blue-500 to-indigo-600',
      path: '/unified-lesson-builder',
      featured: true,
      badges: ['Unified', 'Visual', 'Responsive'],
      estimatedTime: '5-15 min'
    },
    {
      id: 'ai-generator',
      title: 'AI Content Generator',
      description: 'Generate lessons using AI from topics or YouTube videos',
      icon: SparklesIcon,
      gradient: 'from-purple-500 to-violet-600',
      action: 'openAIGenerator',
      badges: ['AI', 'Auto-generate'],
      estimatedTime: '3-7 min'
    },
    {
      id: 'youtube-processor',
      title: 'YouTube to Lesson',
      description: 'Convert YouTube videos into interactive lessons',
      icon: VideoCameraIcon,
      gradient: 'from-red-500 to-pink-600',
      action: 'openYouTubeProcessor',
      badges: ['YouTube', 'Import'],
      estimatedTime: '5-15 min'
    },
    {
      id: 'module-creator',
      title: 'Create Module',
      description: 'Organize lessons into learning modules',
      icon: FolderPlusIcon,
      gradient: 'from-amber-500 to-orange-600',
      action: 'createModule',
      badges: ['Organization'],
      estimatedTime: '1-3 min'
    },
    {
      id: 'learning-path',
      title: 'Learning Path',
      description: 'Create a complete learning journey',
      icon: BookOpenIcon,
      gradient: 'from-teal-500 to-cyan-600',
      action: 'createLearningPath',
      badges: ['Comprehensive'],
      estimatedTime: '10-20 min'
    }
  ];

  const handleAction = async (action) => {
    switch (action) {
      case 'openAIGenerator':
        // Open AI content generation modal
        showNotification('info', 'AI content generator coming soon!');
        break;
      case 'openYouTubeProcessor':
        // Show YouTube processing interface
        showNotification('info', 'YouTube processor feature available in main admin panel');
        break;
      case 'createModule':
        // Open module creation modal
        showNotification('info', 'Module creation modal coming soon!');
        break;
      case 'createLearningPath':
        // Open learning path creation modal
        showNotification('info', 'Learning path creation modal coming soon!');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const CreationCard = ({ option, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${option.gradient} p-6 text-white shadow-lg cursor-pointer ${
        option.featured ? 'col-span-2' : ''
      }`}
      onClick={() => option.path ? navigate(option.path, { state: { fromAdmin: true } }) : handleAction(option.action)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <option.icon className="h-8 w-8 mr-3" />
            <div>
              <h3 className="text-xl font-bold">{option.title}</h3>
              <div className="flex space-x-2 mt-1">
                {option.badges.map((badge, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <p className={`text-white text-opacity-90 mb-3 ${option.featured ? 'text-base' : 'text-sm'}`}>
            {option.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-white text-opacity-80">
              <ClockIcon className="w-4 h-4 mr-1" />
              <span>{option.estimatedTime}</span>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-white text-opacity-60" />
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white bg-opacity-10 rounded-full" />
      <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-16 h-16 bg-white bg-opacity-5 rounded-full" />
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading creation options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            notification.type === 'error' 
              ? 'bg-red-900 border-red-600 text-red-100' 
              : notification.type === 'success'
              ? 'bg-green-900 border-green-600 text-green-100'
              : 'bg-blue-900 border-blue-600 text-blue-100'
          }`}
        >
          {notification.message}
        </motion.div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Create New Content</h2>
        <p className="text-xl text-gray-400">
          Choose how you'd like to create your next lesson or learning experience
        </p>
      </div>

      {/* Creation Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {creationOptions.map((option, index) => (
          <CreationCard key={option.id} option={option} index={index} />
        ))}
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Drafts */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2" />
            Recent Drafts
          </h3>
          <div className="space-y-3">
            {/* Placeholder for recent drafts */}
            <div className="text-sm text-gray-400">
              Your recent drafts will appear here
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AcademicCapIcon className="w-5 h-5 mr-2" />
            Content Overview
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{learningPaths.length}</div>
              <div className="text-sm text-gray-400">Learning Paths</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">0</div>
              <div className="text-sm text-gray-400">Active Drafts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 border border-blue-600">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <SparklesIcon className="w-5 h-5 mr-2" />
          Pro Tips for Content Creation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-100">
          <div>
            <strong>Visual Builder:</strong> Best for interactive lessons with multiple content types
          </div>
          <div>
            <strong>Quick Lesson:</strong> Perfect for simple concepts and quick tutorials
          </div>
          <div>
            <strong>AI Generator:</strong> Great for converting ideas into structured content
          </div>
          <div>
            <strong>YouTube Import:</strong> Ideal for repurposing existing video content
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCreation; 