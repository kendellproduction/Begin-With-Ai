import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CubeTransparentIcon,
  DocumentPlusIcon,
  VideoCameraIcon,
  SparklesIcon,
  DocumentDuplicateIcon,
  ArrowRightIcon,
  PlayIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const ContentCreation = () => {
  const [selectedTool, setSelectedTool] = useState(null);

  const creationTools = [
    {
      id: 'enterprise-builder',
      name: 'Visual Builder',
      description: 'iPhone Photos-style lesson builder with drag-and-drop pages',
      icon: CubeTransparentIcon,
      gradient: 'from-blue-500 to-indigo-600',
      path: '/enterprise-builder',
      featured: true,
      tags: ['Visual', 'Drag & Drop', 'Multi-page'],
      features: [
        'iPhone Photos-style page management',
        'Drag & drop content blocks',
        'Real-time preview',
        'Template system',
        'Auto-save drafts'
      ]
    },
    {
      id: 'quick-lesson',
      name: 'Quick Lesson Builder',
      description: 'Simple lesson creation with pre-built templates',
      icon: DocumentPlusIcon,
      gradient: 'from-green-500 to-emerald-600',
      path: '/lesson-builder',
      tags: ['Fast', 'Templates', 'Simple'],
      features: [
        'Pre-built templates',
        'Content block library',
        'Quick publishing',
        'Basic customization'
      ]
    },
    {
      id: 'youtube-import',
      name: 'YouTube Processor',
      description: 'Convert YouTube videos into interactive lessons',
      icon: VideoCameraIcon,
      gradient: 'from-red-500 to-orange-600',
      path: '/admin',
      action: 'youtube',
      tags: ['AI-Powered', 'Video', 'Auto-generate'],
      features: [
        'Automatic transcription',
        'AI-generated quizzes',
        'Timestamp navigation',
        'Interactive elements'
      ]
    },
    {
      id: 'ai-generator',
      name: 'AI Content Generator',
      description: 'Generate lessons using AI from topics or prompts',
      icon: SparklesIcon,
      gradient: 'from-purple-500 to-violet-600',
      path: '/admin',
      action: 'ai-generate',
      tags: ['AI-Powered', 'Auto-generate', 'Smart'],
      features: [
        'Topic-based generation',
        'Multiple content types',
        'Customizable output',
        'Quality validation'
      ]
    },
    {
      id: 'template-manager',
      name: 'Template Manager',
      description: 'Create and manage reusable lesson templates',
      icon: DocumentDuplicateIcon,
      gradient: 'from-amber-500 to-orange-600',
      path: '/admin',
      action: 'templates',
      tags: ['Templates', 'Reusable', 'Organization'],
      features: [
        'Template library',
        'Custom layouts',
        'Share templates',
        'Version control'
      ]
    }
  ];

  const recentDrafts = [
    {
      id: 1,
      title: 'JavaScript Fundamentals - Chapter 3',
      type: 'Visual Builder',
      lastEdited: '2 hours ago',
      progress: 75,
      status: 'draft'
    },
    {
      id: 2,
      title: 'React Hooks Deep Dive',
      type: 'Quick Lesson',
      lastEdited: '1 day ago',
      progress: 45,
      status: 'draft'
    },
    {
      id: 3,
      title: 'Python Data Analysis Tutorial',
      type: 'YouTube Import',
      lastEdited: '3 days ago',
      progress: 90,
      status: 'review'
    }
  ];

  const CreationToolCard = ({ tool, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${tool.gradient} p-6 text-white shadow-lg ${
        tool.featured ? 'col-span-2 lg:col-span-2' : ''
      }`}
    >
      <Link to={tool.path} className="block h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <tool.icon className="h-8 w-8 mr-3" />
              <div>
                <h3 className="text-xl font-bold">{tool.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tool.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-white text-opacity-70" />
          </div>
          
          <p className="text-white text-opacity-90 mb-4 flex-1">
            {tool.description}
          </p>
          
          {tool.features && (
            <div className="space-y-1">
              {tool.features.slice(0, tool.featured ? 5 : 3).map((feature, i) => (
                <div key={i} className="flex items-center text-sm text-white text-opacity-80">
                  <div className="w-1.5 h-1.5 bg-white bg-opacity-60 rounded-full mr-2"></div>
                  {feature}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white bg-opacity-10 rounded-full" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-16 h-16 bg-white bg-opacity-5 rounded-full" />
      </Link>
    </motion.div>
  );

  const DraftCard = ({ draft, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-white mb-1">{draft.title}</h4>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>{draft.type}</span>
            <span>•</span>
            <span>{draft.lastEdited}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            draft.status === 'draft' ? 'bg-yellow-900 text-yellow-300' :
            draft.status === 'review' ? 'bg-blue-900 text-blue-300' :
            'bg-green-900 text-green-300'
          }`}>
            {draft.status}
          </span>
          <button className="p-1 rounded hover:bg-gray-700 transition-colors">
            <PencilSquareIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${draft.progress}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-400">{draft.progress}% complete</div>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Content Creation Hub</h1>
        <p className="text-xl text-gray-400 mb-8">
          Choose your preferred tool to create engaging lessons and educational content
        </p>
      </div>

      {/* Creation Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {creationTools.map((tool, index) => (
          <CreationToolCard key={tool.id} tool={tool} index={index} />
        ))}
      </div>

      {/* Recent Drafts Section */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Recent Drafts</h2>
            <p className="text-gray-400">Continue working on your saved lessons</p>
          </div>
          <Link 
            to="/drafts"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <span className="text-white">View All Drafts</span>
            <ArrowRightIcon className="w-4 h-4 text-white" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentDrafts.map((draft, index) => (
            <DraftCard key={draft.id} draft={draft} index={index} />
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">💡 Pro Tips for Content Creation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-300">For Beginners</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Start with Quick Lesson Builder for simple content</li>
              <li>• Use templates to maintain consistency</li>
              <li>• Keep lessons focused on one main concept</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-blue-300">For Advanced Users</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Visual Builder offers maximum flexibility</li>
              <li>• Use AI tools to accelerate content creation</li>
              <li>• Create templates for your common lesson types</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCreation; 