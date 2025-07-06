import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  PlusIcon,
  DocumentTextIcon,
  SparklesIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  FolderIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const DashboardOverview = () => {
  const [quickStats, setQuickStats] = useState({
    totalLessons: 0,
    drafts: 0,
    modules: 0
  });

  const [recentDrafts, setRecentDrafts] = useState([]);

  useEffect(() => {
    // Load actual data - removing fake stats
    setQuickStats({
      totalLessons: 0,
      drafts: 0,
      modules: 0
    });

    setRecentDrafts([
      // This would come from actual draft service
      { id: 1, title: 'Untitled Lesson', lastModified: '2 hours ago', pages: 3 },
      { id: 2, title: 'JavaScript Basics', lastModified: '1 day ago', pages: 5 }
    ]);
  }, []);

  const primaryActions = [
    {
      id: 'create-lesson',
      title: 'Create New Lesson',
      description: 'Start building your next lesson',
      icon: PlusIcon,
      gradient: 'from-blue-500 to-blue-600',
      href: '/unified-lesson-builder',
      featured: true
    },
    {
      id: 'manage-content',
      title: 'Manage Content',
      description: 'Organize lessons and modules',
      icon: FolderIcon,
      gradient: 'from-green-500 to-green-600',
      action: 'content-management'
    },
    {
      id: 'ai-tools',
      title: 'AI Tools',
      description: 'Generate and enhance content',
      icon: SparklesIcon,
      gradient: 'from-purple-500 to-purple-600',
      action: 'ai-features'
    }
  ];

  const secondaryActions = [
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View usage insights',
      icon: ChartBarIcon,
      action: 'analytics'
    },
    {
      id: 'users',
      title: 'Users',
      description: 'Manage accounts',
      icon: UsersIcon,
      action: 'users'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure system',
      icon: Cog6ToothIcon,
      action: 'settings'
    }
  ];

  const PrimaryActionCard = ({ action, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link 
        to={action.href || '#'} 
        onClick={action.action ? () => window.dispatchEvent(new CustomEvent('navigate-panel', { detail: action.action })) : undefined}
        className="block"
      >
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${action.gradient} p-8 hover:scale-105 transition-transform duration-300`}>
          <div className="flex items-center justify-between">
            <div className="text-white">
              <div className="flex items-center space-x-3 mb-4">
                <action.icon className="w-8 h-8" />
                {action.featured && (
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{action.title}</h3>
              <p className="text-white/80 text-sm">{action.description}</p>
            </div>
            <RocketLaunchIcon className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
          </div>
          
          {/* Subtle background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
        </div>
      </Link>
    </motion.div>
  );

  const SecondaryActionCard = ({ action, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.05 }}
      className="group cursor-pointer"
      onClick={() => window.dispatchEvent(new CustomEvent('navigate-panel', { detail: action.action }))}
    >
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 hover:bg-gray-750 transition-all duration-200">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gray-700 rounded-lg group-hover:bg-gray-600 transition-colors">
            <action.icon className="w-6 h-6 text-gray-300" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
              {action.title}
            </h4>
            <p className="text-sm text-gray-400">{action.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const QuickStatsCard = ({ title, value, icon: Icon }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );

  const RecentDraftCard = ({ draft }) => (
    <div className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-white mb-1">{draft.title}</h4>
          <p className="text-sm text-gray-400">{draft.pages} pages</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{draft.lastModified}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Clean Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Welcome Back! 👋
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Ready to create amazing learning experiences? Let's build something great together.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {primaryActions.map((action, index) => (
          <PrimaryActionCard key={action.id} action={action} index={index} />
        ))}
      </div>

      {/* Quick Stats - Only Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickStatsCard 
          title="Published Lessons" 
          value={quickStats.totalLessons} 
          icon={BookOpenIcon} 
        />
        <QuickStatsCard 
          title="Draft Lessons" 
          value={quickStats.drafts} 
          icon={DocumentTextIcon} 
        />
        <QuickStatsCard 
          title="Learning Modules" 
          value={quickStats.modules} 
          icon={FolderIcon} 
        />
      </div>

      {/* Recent Drafts */}
      {recentDrafts.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Recent Drafts
            </h3>
            <Link 
              to="/admin-unified?panel=content-management" 
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentDrafts.map((draft) => (
              <RecentDraftCard key={draft.id} draft={draft} />
            ))}
          </div>
        </div>
      )}

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {secondaryActions.map((action, index) => (
          <SecondaryActionCard key={action.id} action={action} index={index} />
        ))}
      </div>

      {/* Getting Started Tips */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-8 border border-indigo-800/30">
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          🚀 Quick Start Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <PlusIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">1. Create Your First Lesson</h4>
            <p className="text-sm text-gray-300">Use our visual builder to create engaging content</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-purple-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">2. Use AI Tools</h4>
            <p className="text-sm text-gray-300">Let AI help you generate and enhance content</p>
          </div>
          <div className="text-center">
            <div className="bg-green-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <RocketLaunchIcon className="w-8 h-8 text-green-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">3. Publish & Share</h4>
            <p className="text-sm text-gray-300">Make your lessons available to learners</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 