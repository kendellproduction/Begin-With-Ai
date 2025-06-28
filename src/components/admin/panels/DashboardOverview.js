import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon,
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CubeTransparentIcon,
  DocumentTextIcon,
  SparklesIcon,
  Cog6ToothIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalStudents: 0,
    completionRate: 0,
    activeDrafts: 0,
    weeklyGrowth: 0,
    systemHealth: 'excellent'
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [activePanel, setActivePanel] = useState('content-creation');

  useEffect(() => {
    // Simulate loading dashboard data
    setStats({
      totalLessons: 47,
      totalStudents: 1,
      completionRate: 78,
      activeDrafts: 12,
      weeklyGrowth: 15,
      systemHealth: 'excellent'
    });

    setRecentActivity([
      { id: 1, type: 'lesson', action: 'published', title: 'JavaScript Fundamentals', time: '2 hours ago', user: 'Admin' },
      { id: 2, type: 'student', action: 'enrolled', title: 'React Basics Course', time: '4 hours ago', user: 'John Doe' },
      { id: 3, type: 'draft', action: 'saved', title: 'Python Data Science', time: '6 hours ago', user: 'Admin' },
      { id: 4, type: 'template', action: 'created', title: 'Quiz Template v2', time: '1 day ago', user: 'Admin' },
      { id: 5, type: 'analytics', action: 'generated', title: 'Monthly Report', time: '2 days ago', user: 'System' }
    ]);

    const quickActions = [
      {
        id: 'content-creation',
        title: 'Create Content',
        description: 'Visual lesson builder and content creation tools',
        icon: CubeTransparentIcon,
        gradient: 'from-blue-500 to-indigo-600',
        action: () => setActivePanel('content-creation'),
        featured: true,
        tags: ['New', 'Visual Editor']
      },
      {
        id: 'content-management',
        title: 'Manage Content',
        description: 'Organize lessons, modules, and learning paths',
        icon: DocumentIcon,
        gradient: 'from-amber-500 to-orange-600',
        action: () => setActivePanel('content-management'),
        tags: ['Organization']
      },
      {
        id: 'ai-features',
        title: 'AI Tools',
        description: 'AI-powered content generation and features',
        icon: SparklesIcon,
        gradient: 'from-purple-500 to-violet-600',
        action: () => setActivePanel('ai-features'),
        tags: ['AI', 'Auto-generate']
      },
      {
        id: 'analytics',
        title: 'Analytics',
        description: 'Usage statistics and performance metrics',
        icon: ChartBarIcon,
        gradient: 'from-green-500 to-emerald-600',
        action: () => setActivePanel('analytics'),
        tags: ['Insights']
      },
      {
        id: 'user-management',
        title: 'Users',
        description: 'Manage student accounts and admin roles',
        icon: UsersIcon,
        gradient: 'from-orange-500 to-red-600',
        action: () => setActivePanel('users'),
        tags: ['Administration']
      },
      {
        id: 'system-settings',
        title: 'Settings',
        description: 'System configuration and preferences',
        icon: Cog6ToothIcon,
        gradient: 'from-gray-500 to-slate-600',
        action: () => setActivePanel('settings'),
        tags: ['Configuration']
      }
    ];

    setQuickActions(quickActions);
  }, []);

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-sm">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              <ArrowTrendingUpIcon className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
              <span>{Math.abs(trend)}% this week</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const ActivityItem = ({ activity, index }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'lesson': return <AcademicCapIcon className="w-4 h-4" />;
        case 'student': return <UsersIcon className="w-4 h-4" />;
        case 'draft': return <DocumentTextIcon className="w-4 h-4" />;
        case 'template': return <CubeTransparentIcon className="w-4 h-4" />;
        default: return <ChartBarIcon className="w-4 h-4" />;
      }
    };

    const getActivityColor = (type) => {
      switch (type) {
        case 'lesson': return 'text-blue-400 bg-blue-900';
        case 'student': return 'text-green-400 bg-green-900';
        case 'draft': return 'text-yellow-400 bg-yellow-900';
        case 'template': return 'text-purple-400 bg-purple-900';
        default: return 'text-gray-400 bg-gray-800';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {activity.title} was {activity.action}
          </p>
          <p className="text-xs text-gray-400">
            by {activity.user} • {activity.time}
          </p>
        </div>
      </motion.div>
    );
  };

  const QuickActionCard = ({ title, description, icon: Icon, color, path, badge, action }) => (
    <div onClick={action || (() => window.location.href = path)}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all duration-200 relative cursor-pointer"
      >
        {badge && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-white">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const systemHealthStatus = {
    excellent: { color: 'text-green-400', bg: 'bg-green-900', text: 'All systems operational' },
    good: { color: 'text-yellow-400', bg: 'bg-yellow-900', text: 'Minor issues detected' },
    poor: { color: 'text-red-400', bg: 'bg-red-900', text: 'System issues require attention' }
  };

  const healthInfo = systemHealthStatus[stats.systemHealth];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to your Admin Dashboard</h1>
        <p className="text-xl text-gray-400">
          Here's an overview of your learning platform
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Lessons"
          value={stats.totalLessons}
          subtitle="Published content"
          icon={AcademicCapIcon}
          color="bg-blue-600"
          trend={stats.weeklyGrowth}
        />
        <StatCard
          title="Active Students"
          value={stats.totalStudents.toLocaleString()}
          subtitle="Enrolled learners"
          icon={UsersIcon}
          color="bg-green-600"
          trend={12}
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          subtitle="Average completion"
          icon={ChartBarIcon}
          color="bg-purple-600"
          trend={5}
        />
        <StatCard
          title="Active Drafts"
          value={stats.activeDrafts}
          subtitle="Work in progress"
          icon={ClockIcon}
          color="bg-amber-600"
        />
      </div>

      {/* System Health & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Health */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">System Health</h3>
          <div className={`flex items-center space-x-3 p-4 rounded-lg ${healthInfo.bg}`}>
            <CheckCircleIcon className={`w-6 h-6 ${healthInfo.color}`} />
            <div>
              <p className={`font-medium ${healthInfo.color}`}>System Status</p>
              <p className="text-sm text-gray-300">{healthInfo.text}</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">API Response Time</span>
              <span className="text-green-400">142ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Database Health</span>
              <span className="text-green-400">99.9%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Storage Usage</span>
              <span className="text-yellow-400">67%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.id}
                title={action.title}
                description={action.description}
                icon={action.icon}
                color={action.gradient}
                path={action.id}
                badge={action.featured ? 'Popular' : action.tags.join(', ')}
                action={action.action}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <Link to="/admin-unified?panel=analytics" className="text-blue-400 hover:text-blue-300 text-sm">
            View All →
          </Link>
        </div>
        
        <div className="space-y-1">
          {recentActivity.slice(0, 5).map((activity, index) => (
            <ActivityItem key={activity.id} activity={activity} index={index} />
          ))}
        </div>
      </div>

      {/* Tips & Help */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">💡 Getting Started Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-2">
              <CubeTransparentIcon className="w-8 h-8 text-white mx-auto" />
            </div>
            <h4 className="font-medium text-white mb-1">Create Your First Lesson</h4>
            <p className="text-sm text-gray-300">Use the Visual Builder to create engaging content</p>
          </div>
          <div className="text-center">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-2">
              <UsersIcon className="w-8 h-8 text-white mx-auto" />
            </div>
            <h4 className="font-medium text-white mb-1">Invite Students</h4>
            <p className="text-sm text-gray-300">Share your courses and track student progress</p>
          </div>
          <div className="text-center">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-2">
              <ChartBarIcon className="w-8 h-8 text-white mx-auto" />
            </div>
            <h4 className="font-medium text-white mb-1">Monitor Performance</h4>
            <p className="text-sm text-gray-300">Use analytics to improve your content</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 