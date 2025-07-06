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
import { useAuth } from '../../../contexts/AuthContext';
import draftService from '../../../services/draftService';
import { getLearningPaths } from '../../../services/firestoreService';

const DashboardOverview = () => {
  const { currentUser } = useAuth();
  const [quickStats, setQuickStats] = useState({
    totalLessons: 0,
    drafts: 0,
    modules: 0
  });
  const [recentDrafts, setRecentDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 DashboardOverview: useEffect triggered, currentUser:', currentUser);
    
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('⏰ DashboardOverview: Loading timeout reached, setting loading to false');
      setLoading(false);
      setError('Loading timeout - please refresh the page');
    }, 10000); // 10 second timeout

    loadDashboardData().finally(() => {
      clearTimeout(timeout);
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [currentUser]);

  const loadDashboardData = async () => {
    console.log('🔍 DashboardOverview: Starting to load data...');
    console.log('🔍 DashboardOverview: currentUser:', currentUser);
    
    setLoading(true);
    
    // If no user, show empty dashboard
    if (!currentUser?.uid) {
      console.log('⚠️ DashboardOverview: No currentUser.uid found, showing empty dashboard');
      setQuickStats({
        totalLessons: 0,
        drafts: 0,
        modules: 0
      });
      setRecentDrafts([]);
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔍 DashboardOverview: Loading data for user:', currentUser.uid);
      console.log('🔍 DashboardOverview: User role:', currentUser?.role);
      
      // Skip admin check in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 DashboardOverview: Development mode - bypassing admin check');
      } else {
        // Check if user has admin permissions (production only)
        const isAdmin = currentUser?.role === 'admin';
        
        if (!isAdmin) {
          console.log('⚠️ DashboardOverview: User is not admin, showing limited access');
          setQuickStats({
            totalLessons: 0,
            drafts: 0,
            modules: 0
          });
          setRecentDrafts([]);
          setError('Admin access required');
          setLoading(false);
          return;
        }
      }
      
      let drafts = [];
      let learningPaths = [];
      
      // Only try to load drafts if user is admin
      if (isAdmin) {
        console.log('🔍 DashboardOverview: User is admin, loading drafts...');
        const draftsPromise = Promise.race([
          draftService.loadDrafts(currentUser.uid),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Drafts loading timeout')), 5000))
        ]);
        
        drafts = await draftsPromise.catch((error) => {
          console.error('❌ DashboardOverview: Error loading drafts:', error);
          return [];
        });
        console.log('✅ DashboardOverview: Loaded drafts:', drafts);
      } else {
        console.log('⚠️ DashboardOverview: User is not admin, skipping drafts loading');
      }

      // Load learning paths (all authenticated users can read these)
      console.log('🔍 DashboardOverview: Calling getLearningPaths...');
      const pathsPromise = Promise.race([
        getLearningPaths(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Learning paths loading timeout')), 5000))
      ]);
      
      learningPaths = await pathsPromise.catch((error) => {
        console.error('❌ DashboardOverview: Error loading learning paths:', error);
        return [];
      });
      console.log('✅ DashboardOverview: Loaded learning paths:', learningPaths);

      // Calculate real statistics
      const totalLessons = learningPaths.reduce((acc, path) => 
        acc + (path.modules?.reduce((modAcc, mod) => modAcc + (mod.lessons?.length || 0), 0) || 0), 0
      );
      
      const totalModules = learningPaths.reduce((acc, path) => acc + (path.modules?.length || 0), 0);

      console.log('📊 DashboardOverview: Calculated stats:', { 
        totalLessons, 
        totalModules, 
        draftsCount: drafts.length,
        isAdmin
      });

      setQuickStats({
        totalLessons,
        drafts: drafts.length,
        modules: totalModules
      });

      // Show recent drafts (last 3)
      setRecentDrafts(drafts.slice(0, 3));
      
      console.log('✅ DashboardOverview: Data loading completed successfully');
      
    } catch (err) {
      console.error('❌ DashboardOverview: Error loading dashboard data:', err);
      setError('Failed to load dashboard data: ' + err.message);
      
      // Show empty dashboard even on error
      setQuickStats({
        totalLessons: 0,
        drafts: 0,
        modules: 0
      });
      setRecentDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatLastModified = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const countContentBlocks = (contentVersions) => {
    if (!contentVersions) return 0;
    
    const freeContent = contentVersions.free || [];
    const premiumContent = contentVersions.premium || [];
    
    return freeContent.length + premiumContent.length;
  };

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
          <h4 className="font-medium text-white mb-1">{draft.title || 'Untitled Lesson'}</h4>
          <p className="text-sm text-gray-400">{countContentBlocks(draft.contentVersions)} content blocks</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{formatLastModified(draft.lastModified)}</p>
          <div className="flex items-center space-x-1 mt-1">
            <span className={`px-2 py-1 text-xs rounded-full ${
              draft.status === 'published' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
            }`}>
              {draft.status || 'draft'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="text-center">
          <div className="bg-red-900 bg-opacity-50 rounded-lg p-6">
            <p className="text-red-400 mb-2">Error loading dashboard</p>
            <p className="text-gray-400 text-sm">{error}</p>
            <button 
              onClick={loadDashboardData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Quick Stats - Now with Real Data */}
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

      {/* Recent Drafts - Now with Real Data */}
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

      {/* Show message if no drafts */}
      {recentDrafts.length === 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="text-center py-8">
            <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            {currentUser?.role === 'admin' ? (
              <>
                <h3 className="text-lg font-medium text-gray-400 mb-2">No Drafts Yet</h3>
                <p className="text-gray-500 mb-4">Start creating lessons to see your recent drafts here.</p>
                <Link
                  to="/unified-lesson-builder"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Create Your First Lesson</span>
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-yellow-400 mb-2">Admin Access Required</h3>
                <p className="text-gray-500 mb-4">You need admin permissions to create and manage lesson drafts.</p>
                <div className="bg-yellow-900 bg-opacity-50 rounded-lg p-4 text-left">
                  <h4 className="text-yellow-400 font-medium mb-2">To get admin access:</h4>
                  <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                    <li>Open your browser's Developer Console (F12)</li>
                    <li>Run: <code className="bg-gray-700 px-2 py-1 rounded text-yellow-300">setAdminRole('{currentUser?.uid}')</code></li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              </>
            )}
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