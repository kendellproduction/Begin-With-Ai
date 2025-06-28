import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CubeTransparentIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  SparklesIcon,
  VideoCameraIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

// Lazy load admin components to improve performance
const DashboardOverview = React.lazy(() => import('./panels/DashboardOverview'));
const ContentCreation = React.lazy(() => import('./panels/ContentCreation'));
const ContentManagement = React.lazy(() => import('./panels/ContentManagement'));
const AIFeatures = React.lazy(() => import('./panels/AIFeatures'));
const Analytics = React.lazy(() => import('./panels/Analytics'));
const UserManagement = React.lazy(() => import('./panels/UserManagement'));
const SystemSettings = React.lazy(() => import('./panels/SystemSettings'));

const UnifiedAdminPanel = () => {
  const { currentUser } = useAuth();
  const [activePanel, setActivePanel] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Admin panel configuration
  const adminSections = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: HomeIcon,
      description: 'Overview and quick actions',
      component: DashboardOverview,
      searchTerms: ['overview', 'stats', 'summary', 'home']
    },
    {
      id: 'content-creation',
      name: 'Create Content',
      icon: DocumentTextIcon,
      description: 'Build lessons, modules, and courses',
      component: ContentCreation,
      searchTerms: ['lesson', 'module', 'course', 'create', 'build', 'edit', 'enterprise builder', 'lesson builder'],
      subItems: [
        { id: 'enterprise-builder', name: 'Visual Builder', description: 'iPhone Photos-style lesson builder' },
        { id: 'quick-lesson', name: 'Quick Lesson', description: 'Simple lesson creation' },
        { id: 'bulk-import', name: 'Bulk Import', description: 'Import from YouTube, docs, etc.' }
      ]
    },
    {
      id: 'content-management',
      name: 'Manage Content',
      icon: AcademicCapIcon,
      description: 'Organize and edit existing content',
      component: ContentManagement,
      searchTerms: ['manage', 'organize', 'edit', 'delete', 'modules', 'lessons', 'drafts'],
      subItems: [
        { id: 'modules', name: 'Modules & Lessons', description: 'Organize learning paths' },
        { id: 'drafts', name: 'Drafts', description: 'Work in progress content' },
        { id: 'templates', name: 'Templates', description: 'Reusable content templates' }
      ]
    },
    {
      id: 'ai-features',
      name: 'AI Tools',
      icon: SparklesIcon,
      description: 'AI-powered content and features',
      component: AIFeatures,
      searchTerms: ['ai', 'artificial intelligence', 'generate', 'openai', 'youtube processor', 'auto'],
      subItems: [
        { id: 'content-generation', name: 'Content Generation', description: 'AI-generated lessons' },
        { id: 'youtube-processor', name: 'YouTube Processor', description: 'Convert videos to lessons' },
        { id: 'ai-feedback', name: 'AI Feedback', description: 'Intelligent student feedback' }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: ChartBarIcon,
      description: 'Usage stats and performance metrics',
      component: Analytics,
      searchTerms: ['analytics', 'stats', 'metrics', 'performance', 'usage', 'reports'],
      subItems: [
        { id: 'student-progress', name: 'Student Progress', description: 'Learning analytics' },
        { id: 'content-performance', name: 'Content Performance', description: 'Lesson effectiveness' },
        { id: 'system-health', name: 'System Health', description: 'Technical metrics' }
      ]
    },
    {
      id: 'users',
      name: 'Users',
      icon: UsersIcon,
      description: 'User accounts and permissions',
      component: UserManagement,
      searchTerms: ['users', 'students', 'accounts', 'permissions', 'roles'],
      subItems: [
        { id: 'student-accounts', name: 'Student Accounts', description: 'Manage student profiles' },
        { id: 'admin-roles', name: 'Admin Roles', description: 'Admin permissions' },
        { id: 'account-switching', name: 'Account Switching', description: 'Switch between accounts' }
      ]
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Cog6ToothIcon,
      description: 'System configuration and preferences',
      component: SystemSettings,
      searchTerms: ['settings', 'config', 'preferences', 'api', 'system'],
      subItems: [
        { id: 'api-settings', name: 'API Settings', description: 'External service configuration' },
        { id: 'system-config', name: 'System Config', description: 'Platform settings' },
        { id: 'backup-restore', name: 'Backup & Restore', description: 'Data management' }
      ]
    }
  ];

  // Filter sections based on search
  const filteredSections = adminSections.filter(section => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      section.name.toLowerCase().includes(query) ||
      section.description.toLowerCase().includes(query) ||
      section.searchTerms.some(term => term.includes(query)) ||
      section.subItems?.some(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      )
    );
  });

  const currentSection = adminSections.find(section => section.id === activePanel);
  const CurrentComponent = currentSection?.component;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className={`bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-gray-400">Unified Management</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search admin features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          <nav className="space-y-1">
            {filteredSections.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => setActivePanel(section.id)}
                  className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                    activePanel === section.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <section.icon className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{section.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{section.description}</div>
                    </div>
                  )}
                </button>

                {/* Sub-items */}
                {!sidebarCollapsed && activePanel === section.id && section.subItems && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-8 mt-2 space-y-1 border-l border-gray-600 pl-4"
                  >
                    {section.subItems.map((item) => (
                      <div key={item.id} className="text-sm">
                        <div className="font-medium text-gray-300">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Quick Help */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-700">
            <div className="bg-blue-900 bg-opacity-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <QuestionMarkCircleIcon className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-400">Need Help?</span>
              </div>
              <p className="text-xs text-gray-300">
                Search above to find specific features quickly, or browse sections to explore all admin tools.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{currentSection?.name}</h2>
              <p className="text-gray-400">{currentSection?.description}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <BellIcon className="w-5 h-5 text-gray-400" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-sm font-medium text-white">
                    {currentUser?.displayName || currentUser?.email}
                  </div>
                  <div className="text-xs text-gray-400">Administrator</div>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {(currentUser?.displayName || currentUser?.email || 'A')[0].toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-900">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }>
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {CurrentComponent && <CurrentComponent />}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAdminPanel; 