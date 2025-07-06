import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CubeTransparentIcon,
  DocumentPlusIcon,
  DocumentIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  SparklesIcon,
  EyeIcon,
  PencilSquareIcon,
  RocketLaunchIcon,
  ClockIcon,
  BookOpenIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

import { useAuth } from '../contexts/AuthContext';
import OptimizedStarField from '../components/OptimizedStarField';
import draftService from '../services/draftService';
import { getLearningPaths } from '../services/firestoreService';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalStudents: 0,
    completionRate: 0,
    recentActivity: []
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick action cards configuration
  const quickActions = [
    {
      id: 'enterprise-builder',
      title: 'Enterprise Builder',
      description: 'Visual lesson editor with iPhone Photos-style page management',
      icon: CubeTransparentIcon,
      gradient: 'from-blue-500 to-indigo-600',
      path: '/enterprise-builder',
      featured: true,
      tags: ['New', 'Visual Editor']
    },
    {
      id: 'drafts',
      title: 'My Drafts',
      description: 'View and manage your saved lesson drafts',
      icon: DocumentIcon,
      gradient: 'from-amber-500 to-orange-600',
      path: '/drafts',
      tags: ['Quick Access']
    },
    {
      id: 'create-lesson',
      title: 'Quick Lesson',
      description: 'Create a simple lesson with templates',
      icon: DocumentPlusIcon,
      gradient: 'from-green-500 to-emerald-600',
      path: '/lesson-builder',
      tags: ['Fast']
    },
    {
      id: 'analytics',
      title: 'Content Blocks Demo',
      description: 'View content block system demonstration',
      icon: ChartBarIcon,
      gradient: 'from-purple-500 to-violet-600',
      path: '/content-blocks-demo',
      tags: ['Demo']
    },
    {
      id: 'unified-admin',
      title: 'Unified Admin Panel',
      description: 'NEW: Consolidated modern admin interface',
      icon: CubeTransparentIcon,
      gradient: 'from-purple-500 to-indigo-600',
      path: '/admin-unified',
      featured: false,
      tags: ['New', 'Unified', 'Modern']
    },
    {
      id: 'user-management',
      title: 'Admin Panel',
      description: 'Access full admin panel and management tools',
      icon: UsersIcon,
      gradient: 'from-orange-500 to-red-600',
      path: '/admin',
      tags: ['Admin', 'Legacy']
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    if (!currentUser?.uid) return;
    
    setLoading(true);
    try {
      // Load real data from services
      const [drafts, learningPaths] = await Promise.all([
        draftService.loadDrafts(currentUser.uid).catch(() => []),
        getLearningPaths().catch(() => [])
      ]);

      // Calculate real statistics
      const totalLessons = learningPaths.reduce((acc, path) => 
        acc + (path.modules?.reduce((modAcc, mod) => modAcc + (mod.lessons?.length || 0), 0) || 0), 0
      );
      
      const totalModules = learningPaths.reduce((acc, path) => acc + (path.modules?.length || 0), 0);

      setStats({
        totalLessons,
        totalStudents: 0, // This would come from user analytics when implemented
        completionRate: 0, // This would come from analytics when implemented
        recentActivity: [
          `${drafts.length} lesson drafts available`,
          `${learningPaths.length} learning paths configured`,
          `${totalModules} modules organized`
        ]
      });

      // Convert drafts to recent items format
      const recentDrafts = drafts.slice(0, 3).map(draft => ({
        type: 'lesson',
        title: draft.title || 'Untitled Lesson',
        updated: formatLastModified(draft.lastModified),
        status: draft.status || 'draft',
        students: 0 // Drafts don't have students
      }));

      setRecentItems(recentDrafts);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastModified = (timestamp) => {
    if (!timestamp) return 'Just now';
    
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

  const QuickActionCard = ({ action, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${action.gradient} p-6 text-white shadow-lg ${action.featured ? 'col-span-2' : ''}`}
    >
      <Link to={action.path} className="block">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <action.icon className="h-8 w-8 mr-3" />
              <div>
                <h3 className="text-xl font-bold">{action.title}</h3>
                {action.featured && (
                  <div className="flex space-x-2 mt-1">
                    {action.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <p className={`text-white text-opacity-90 ${action.featured ? 'text-base' : 'text-sm'}`}>
              {action.description}
            </p>
            
            {action.featured && (
              <div className="mt-4 flex items-center text-sm text-white text-opacity-80">
                <SparklesIcon className="w-4 h-4 mr-2" />
                iPhone Photos-style interface • Drag & drop pages • Visual templates
              </div>
            )}
          </div>
          
          {action.featured && (
            <div className="ml-4">
              <RocketLaunchIcon className="w-12 h-12 text-white text-opacity-60" />
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white bg-opacity-10 rounded-full" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-16 h-16 bg-white bg-opacity-5 rounded-full" />
      </Link>
    </motion.div>
  );

  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const RecentItemCard = ({ item, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-4 ${item.type === 'lesson' ? 'bg-blue-600' : 'bg-purple-600'}`}>
          {item.type === 'lesson' ? (
            <BookOpenIcon className="w-5 h-5 text-white" />
          ) : (
            <AcademicCapIcon className="w-5 h-5 text-white" />
          )}
        </div>
        <div>
          <h4 className="text-white font-medium">{item.title}</h4>
          <div className="flex items-center text-sm text-gray-400 mt-1">
            <ClockIcon className="w-4 h-4 mr-1" />
            {item.updated}
            <span className="mx-2">•</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              item.status === 'published' ? 'bg-green-600 text-white' :
              item.status === 'draft' ? 'bg-yellow-600 text-white' :
              'bg-blue-600 text-white'
            }`}>
              {item.status}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {item.students !== undefined && (
          <span className="text-gray-400 text-sm">{item.students} students</span>
        )}
        {item.uses !== undefined && (
          <span className="text-gray-400 text-sm">{item.uses} uses</span>
        )}
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <EyeIcon className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <PencilSquareIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#3b82f6' }}>
      {/* Optimized Star Field */}
      <OptimizedStarField starCount={150} opacity={0.8} speed={1} size={1.2} />

      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">
                Welcome back, {currentUser?.displayName || 'Admin'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Cog6ToothIcon className="w-5 h-5 inline mr-2" />
                Old Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                </div>
              </motion.div>
            ))
          ) : (
            <>
              <StatCard
                title="Total Lessons"
                value={stats.totalLessons}
                subtitle="Published lessons"
                icon={BookOpenIcon}
                color="bg-blue-600"
              />
              <StatCard
                title="Draft Lessons"
                value={recentItems.length}
                subtitle="Work in progress"
                icon={DocumentIcon}
                color="bg-amber-600"
              />
              <StatCard
                title="Total Students"
                value={stats.totalStudents}
                subtitle="Coming soon"
                icon={UsersIcon}
                color="bg-green-600"
              />
              <StatCard
                title="Active Now"
                value="—"
                subtitle="Analytics coming soon"
                icon={SparklesIcon}
                color="bg-purple-600"
              />
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <QuickActionCard key={action.id} action={action} index={index} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Lessons & Templates</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading recent items...</p>
              </div>
            ) : recentItems.length > 0 ? (
              <div className="space-y-4">
                {recentItems.map((item, index) => (
                  <RecentItemCard key={index} item={item} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentIcon className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No Recent Items</h3>
                <p className="text-gray-500 mb-4">Start creating lessons to see your recent work here.</p>
                <Link
                  to="/unified-lesson-builder"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <DocumentPlusIcon className="w-4 h-4" />
                  <span>Create Your First Lesson</span>
                </Link>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Activity Feed</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading activity...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <p className="text-gray-300">{activity}</p>
                    <p className="text-gray-500 text-sm mt-1">System status</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 