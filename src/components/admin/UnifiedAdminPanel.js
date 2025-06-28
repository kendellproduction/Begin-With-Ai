import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon
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
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [notifications, setNotifications] = useState([]);

  // Admin panel configuration with improved structure
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
      description: 'Build lessons and courses',
      component: ContentCreation,
      searchTerms: ['lesson', 'module', 'course', 'create', 'build'],
      subItems: [
        { 
          id: 'unified-lesson-builder', 
          name: 'Lesson Builder', 
          description: 'Visual lesson editor',
          action: () => navigate('/unified-lesson-builder', { state: { fromAdmin: true } })
        },
        { 
          id: 'ai-content-gen', 
          name: 'AI Generator', 
          description: 'AI-powered lessons',
          action: () => setActivePanel('ai-features')
        },
        { 
          id: 'youtube-import', 
          name: 'YouTube Import', 
          description: 'Convert videos to lessons',
          action: () => setActivePanel('ai-features')
        }
      ]
    },
    {
      id: 'content-management',
      name: 'Manage Content',
      icon: AcademicCapIcon,
      description: 'Organize existing content',
      component: ContentManagement,
      searchTerms: ['manage', 'organize', 'edit', 'delete', 'modules'],
      subItems: [
        { 
          id: 'modules-lessons', 
          name: 'Modules & Lessons', 
          description: 'View and edit content',
          action: () => setActivePanel('content-management')
        },
        { 
          id: 'drafts', 
          name: 'Drafts', 
          description: 'Work in progress',
          action: () => navigate('/drafts')
        },
        { 
          id: 'templates', 
          name: 'Templates', 
          description: 'Reusable templates',
          action: () => setActivePanel('content-management')
        }
      ]
    },
    {
      id: 'ai-features',
      name: 'AI Tools',
      icon: SparklesIcon,
      description: 'AI-powered features',
      component: AIFeatures,
      searchTerms: ['ai', 'artificial intelligence', 'generate'],
      subItems: [
        { 
          id: 'youtube-processor', 
          name: 'YouTube Processor', 
          description: 'Video to lesson converter',
          action: () => setActivePanel('ai-features')
        },
        { 
          id: 'content-generator', 
          name: 'Content Generator', 
          description: 'AI lesson creation',
          action: () => setActivePanel('ai-features')
        },
        { 
          id: 'smart-feedback', 
          name: 'Smart Feedback', 
          description: 'AI student assistance',
          action: () => setActivePanel('ai-features')
        }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: ChartBarIcon,
      description: 'Performance metrics',
      component: Analytics,
      searchTerms: ['analytics', 'stats', 'metrics', 'performance'],
      subItems: [
        { 
          id: 'student-progress', 
          name: 'Student Progress', 
          description: 'Learning analytics',
          action: () => setActivePanel('analytics')
        },
        { 
          id: 'content-metrics', 
          name: 'Content Metrics', 
          description: 'Lesson performance',
          action: () => setActivePanel('analytics')
        }
      ]
    },
    {
      id: 'users',
      name: 'Users',
      icon: UsersIcon,
      description: 'User management',
      component: UserManagement,
      searchTerms: ['users', 'students', 'accounts', 'permissions'],
      subItems: [
        { 
          id: 'student-accounts', 
          name: 'Student Accounts', 
          description: 'Manage students',
          action: () => setActivePanel('users')
        },
        { 
          id: 'admin-roles', 
          name: 'Admin Roles', 
          description: 'Permissions',
          action: () => setActivePanel('users')
        }
      ]
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Cog6ToothIcon,
      description: 'System configuration',
      component: SystemSettings,
      searchTerms: ['settings', 'config', 'preferences', 'api'],
      subItems: [
        { 
          id: 'api-config', 
          name: 'API Configuration', 
          description: 'External services',
          action: () => setActivePanel('settings')
        },
        { 
          id: 'system-prefs', 
          name: 'System Preferences', 
          description: 'Platform settings',
          action: () => setActivePanel('settings')
        }
      ]
    }
  ];

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Handle sub-item clicks
  const handleSubItemClick = (subItem) => {
    if (subItem.action) {
      subItem.action();
    }
  };

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
      {/* Enhanced Sidebar */}
      <div className={`bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-72'
      }`}>
        {/* Clean Header */}
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-gray-400">Unified Management</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              title={sidebarCollapsed ? 'Expand' : 'Collapse'}
            >
              <ArrowLeftIcon className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Compact Search */}
        {!sidebarCollapsed && (
          <div className="p-3 border-b border-gray-700/50">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
          </div>
        )}

        {/* Clean Navigation */}
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="space-y-1">
            {filteredSections.map((section) => {
              const isExpanded = expandedSections.has(section.id);
              const hasSubItems = section.subItems && section.subItems.length > 0;
              
              return (
                <div key={section.id} className="px-2">
                  {/* Main Section Button */}
                  <div className="flex items-center">
                    <button
                      onClick={() => setActivePanel(section.id)}
                      className={`flex-1 flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                        activePanel === section.id
                          ? 'bg-blue-600/90 text-white shadow-md'
                          : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                      }`}
                    >
                      <section.icon className={`${sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'} flex-shrink-0`} />
                      {!sidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{section.name}</div>
                          <div className="text-xs text-gray-400 truncate">{section.description}</div>
                        </div>
                      )}
                    </button>
                    
                    {/* Expand/Collapse Button for Sub-items */}
                    {!sidebarCollapsed && hasSubItems && (
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="p-1.5 ml-1 rounded hover:bg-gray-700/50 transition-colors"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? (
                          <ChevronDownIcon className="w-3 h-3 text-gray-400" />
                        ) : (
                          <ChevronRightIcon className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Sub-items */}
                  <AnimatePresence>
                    {!sidebarCollapsed && hasSubItems && isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-7 mt-1 space-y-1 overflow-hidden"
                      >
                        {section.subItems.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleSubItemClick(subItem)}
                            className="w-full flex items-center px-3 py-2 rounded-md text-left hover:bg-gray-700/30 transition-colors group"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-300 group-hover:text-white">{subItem.name}</div>
                              <div className="text-xs text-gray-500 truncate">{subItem.description}</div>
                            </div>
                            <ChevronRightIcon className="w-3 h-3 text-gray-500 group-hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-gray-700/50">
            <div className="text-xs text-gray-500 text-center">
              Admin: {currentUser?.email}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-white/5 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">{currentSection?.name}</h1>
              <p className="text-sm text-gray-400">{currentSection?.description}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Quick Actions */}
              <button
                onClick={() => navigate('/unified-lesson-builder', { state: { fromAdmin: true } })}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Lesson
              </button>
              
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <BellIcon className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <QuestionMarkCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-950">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading panel...</p>
              </div>
            </div>
          }>
            {CurrentComponent && <CurrentComponent />}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAdminPanel; 