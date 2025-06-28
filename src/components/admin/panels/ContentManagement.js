import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

// Import existing components
import ModuleManager from '../ModuleManager';
import DraftManager from '../DraftManager';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('modules');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const tabs = [
    { id: 'modules', name: 'Modules & Lessons', icon: FolderIcon, count: 47 },
    { id: 'drafts', name: 'Drafts', icon: ClockIcon, count: 12 },
    { id: 'templates', name: 'Templates', icon: DocumentDuplicateIcon, count: 8 },
    { id: 'archived', name: 'Archived', icon: ExclamationCircleIcon, count: 3 }
  ];

  const ContentStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Published Lessons</p>
            <p className="text-2xl font-bold text-white">47</p>
          </div>
          <CheckCircleIcon className="w-8 h-8 text-green-400" />
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Draft Lessons</p>
            <p className="text-2xl font-bold text-white">12</p>
          </div>
          <ClockIcon className="w-8 h-8 text-yellow-400" />
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Active Modules</p>
            <p className="text-2xl font-bold text-white">8</p>
          </div>
          <FolderIcon className="w-8 h-8 text-blue-400" />
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Templates</p>
            <p className="text-2xl font-bold text-white">8</p>
          </div>
          <DocumentDuplicateIcon className="w-8 h-8 text-purple-400" />
        </div>
      </div>
    </div>
  );

  const SearchAndFilters = () => (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search lessons, modules, or templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <FunnelIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          {viewMode === 'grid' ? 'List' : 'Grid'}
        </button>
      </div>
    </div>
  );

  const TabNavigation = () => (
    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-gray-800 border-b-2 border-blue-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <tab.icon className="w-4 h-4" />
          <span>{tab.name}</span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );

  const EmptyState = ({ title, description, actionText, onAction }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <DocumentTextIcon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );

  const TemplatesGrid = () => {
    const templates = [
      {
        id: 1,
        name: 'Quiz Template',
        description: 'Multiple choice quiz with explanations',
        thumbnail: '🧠',
        uses: 24,
        lastUsed: '2 days ago',
        category: 'Assessment'
      },
      {
        id: 2,
        name: 'Code Challenge',
        description: 'Interactive coding exercise template',
        thumbnail: '💻',
        uses: 18,
        lastUsed: '1 week ago',
        category: 'Programming'
      },
      {
        id: 3,
        name: 'Video Lesson',
        description: 'Video content with interactive elements',
        thumbnail: '🎥',
        uses: 15,
        lastUsed: '3 days ago',
        category: 'Media'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{template.thumbnail}</div>
                <div>
                  <h3 className="font-medium text-white">{template.name}</h3>
                  <p className="text-sm text-gray-400">{template.category}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                  <EyeIcon className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                  <PencilSquareIcon className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                  <DocumentDuplicateIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 mb-4">{template.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Used {template.uses} times</span>
              <span>Last used {template.lastUsed}</span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'modules':
        return <ModuleManager onShowNotification={(type, message) => console.log(type, message)} />;
      case 'drafts':
        return <DraftManager />;
      case 'templates':
        return <TemplatesGrid />;
      case 'archived':
        return (
          <EmptyState
            title="No archived content"
            description="Archived lessons and modules will appear here. Archive content to declutter your active workspace while keeping it accessible."
            actionText="Browse Active Content"
            onAction={() => setActiveTab('modules')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Content Management</h1>
          <p className="text-gray-400">Organize and manage your educational content</p>
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <PlusIcon className="w-4 h-4" />
          <span>Create New</span>
        </button>
      </div>

      {/* Content Stats */}
      <ContentStats />

      {/* Search and Filters */}
      <SearchAndFilters />

      {/* Tab Navigation */}
      <TabNavigation />

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ContentManagement; 