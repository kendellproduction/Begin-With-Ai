import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// Import existing AI components
import YouTubeProcessor from '../YouTubeProcessor';
import AIFeaturesPanel from '../AIFeaturesPanel';

const AIFeatures = () => {
  const [activeFeature, setActiveFeature] = useState('overview');
  const [apiStatus, setApiStatus] = useState({
    openai: 'connected',
    youtube: 'connected',
    transcription: 'connected'
  });

  const aiFeatures = [
    {
      id: 'content-generation',
      name: 'Content Generation',
      description: 'Generate lessons, quizzes, and explanations using AI',
      icon: DocumentTextIcon,
      gradient: 'from-blue-500 to-indigo-600',
      features: [
        'Topic-based lesson generation',
        'Quiz questions from content',
        'Interactive exercises',
        'Multiple difficulty levels'
      ],
      status: 'active',
      usage: '145 generations this month'
    },
    {
      id: 'youtube-processor',
      name: 'YouTube Processor',
      description: 'Convert YouTube videos into interactive lessons',
      icon: VideoCameraIcon,
      gradient: 'from-red-500 to-orange-600',
      features: [
        'Automatic transcription',
        'Timestamp-based navigation',
        'AI-generated summaries',
        'Quiz generation from video'
      ],
      status: 'active',
      usage: '23 videos processed'
    },
    {
      id: 'smart-feedback',
      name: 'AI Feedback System',
      description: 'Intelligent feedback for student submissions',
      icon: ChatBubbleLeftRightIcon,
      gradient: 'from-green-500 to-emerald-600',
      features: [
        'Code review assistance',
        'Writing improvement suggestions',
        'Personalized hints',
        'Progress recommendations'
      ],
      status: 'active',
      usage: '1.2k feedback instances'
    },
    {
      id: 'auto-assessment',
      name: 'Auto Assessment',
      description: 'Automatically grade and evaluate student work',
      icon: CpuChipIcon,
      gradient: 'from-purple-500 to-violet-600',
      features: [
        'Code execution testing',
        'Writing quality analysis',
        'Rubric-based grading',
        'Instant feedback delivery'
      ],
      status: 'beta',
      usage: '89 assessments completed'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-900';
      case 'disconnected': return 'text-red-400 bg-red-900';
      case 'warning': return 'text-yellow-400 bg-yellow-900';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircleIcon className="w-4 h-4" />;
      case 'disconnected': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'warning': return <ClockIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const AIFeatureCard = ({ feature, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${feature.gradient} p-6 text-white shadow-lg cursor-pointer`}
      onClick={() => setActiveFeature(feature.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <feature.icon className="h-8 w-8 mr-3" />
          <div>
            <h3 className="text-xl font-bold">{feature.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium`}>
                {feature.status}
              </span>
            </div>
          </div>
        </div>
        <ArrowRightIcon className="w-5 h-5 text-white text-opacity-70" />
      </div>
      
      <p className="text-white text-opacity-90 mb-4">
        {feature.description}
      </p>
      
      <div className="space-y-1 mb-4">
        {feature.features.slice(0, 3).map((feat, i) => (
          <div key={i} className="flex items-center text-sm text-white text-opacity-80">
            <div className="w-1.5 h-1.5 bg-white bg-opacity-60 rounded-full mr-2"></div>
            {feat}
          </div>
        ))}
      </div>

      <div className="text-sm text-white text-opacity-70 font-medium">
        {feature.usage}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white bg-opacity-10 rounded-full" />
      <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-16 h-16 bg-white bg-opacity-5 rounded-full" />
    </motion.div>
  );

  const APIStatus = () => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
      <h3 className="text-lg font-bold text-white mb-4">AI Service Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getStatusColor(apiStatus.openai)}`}>
            {getStatusIcon(apiStatus.openai)}
          </div>
          <div>
            <p className="font-medium text-white">OpenAI API</p>
            <p className="text-sm text-gray-400">Content generation</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getStatusColor(apiStatus.youtube)}`}>
            {getStatusIcon(apiStatus.youtube)}
          </div>
          <div>
            <p className="font-medium text-white">YouTube API</p>
            <p className="text-sm text-gray-400">Video processing</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getStatusColor(apiStatus.transcription)}`}>
            {getStatusIcon(apiStatus.transcription)}
          </div>
          <div>
            <p className="font-medium text-white">Transcription</p>
            <p className="text-sm text-gray-400">Audio to text</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'youtube-processor':
        return <YouTubeProcessor />;
      case 'content-generation':
      case 'smart-feedback':
      case 'auto-assessment':
        return <AIFeaturesPanel />;
      default:
        return (
          <div className="space-y-8">
            {/* AI Features Grid */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Available AI Tools</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiFeatures.map((feature, index) => (
                  <AIFeatureCard key={feature.id} feature={feature} index={index} />
                ))}
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">This Month's AI Usage</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">145</p>
                  <p className="text-sm text-gray-400">Content Generations</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">23</p>
                  <p className="text-sm text-gray-400">Videos Processed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">1,234</p>
                  <p className="text-sm text-gray-400">AI Feedback Given</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">89</p>
                  <p className="text-sm text-gray-400">Auto Assessments</p>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🤖 AI Best Practices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-purple-300 mb-2">Content Generation</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Provide clear, specific prompts</li>
                    <li>• Review and edit AI-generated content</li>
                    <li>• Use AI as a starting point, not final output</li>
                    <li>• Test content with your target audience</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-purple-300 mb-2">Video Processing</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Ensure videos have clear audio</li>
                    <li>• Check transcription accuracy</li>
                    <li>• Add custom timestamps if needed</li>
                    <li>• Review generated quizzes for relevance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">AI-Powered Features</h1>
        <p className="text-xl text-gray-400">
          Leverage artificial intelligence to create, enhance, and manage your educational content
        </p>
      </div>

      {/* API Status */}
      <APIStatus />

      {/* Feature Navigation */}
      {activeFeature !== 'overview' && (
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setActiveFeature('overview')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            <span>← Back to Overview</span>
          </button>
          <h2 className="text-xl font-bold text-white">
            {aiFeatures.find(f => f.id === activeFeature)?.name}
          </h2>
        </div>
      )}

      {/* Content */}
      {renderFeatureContent()}
    </div>
  );
};

export default AIFeatures; 