import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import draftService from '../../services/draftService';
import { 
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CubeTransparentIcon,

  SparklesIcon,
  VideoCameraIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

// Lazy load admin components to improve performance
const DashboardOverview = React.lazy(() => import('./panels/DashboardOverview'));
const DatabaseCleaner = React.lazy(() => import('./DatabaseCleaner'));
const ContentCreation = React.lazy(() => import('./panels/ContentCreation'));
const ContentManagement = React.lazy(() => import('./panels/ContentManagement'));
const AIFeatures = React.lazy(() => import('./panels/AIFeatures'));
// Import LessonMigrationInterface directly to avoid hot reload issues
import LessonMigrationInterface from './LessonMigrationInterface';
// Removed unnecessary Analytics, UserManagement, and SystemSettings imports

const UnifiedAdminPanel = () => {
  const { currentUser } = useAuth();
  const { state, actions } = useAdmin();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [notifications, setNotifications] = useState([]);
  
  // Extract state from AdminContext
  const { 
    isPremiumMode, 
    isMobileView, 
    unsavedChanges, 
    sidebarCollapsed, 
    activePanel,
    currentLesson,
    contentVersions
  } = state;

  // Save prompt modal state
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Simplified admin panel focused on lesson management
  const adminSections = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: HomeIcon,
      description: 'Lesson overview and management',
      component: DashboardOverview,
      searchTerms: ['overview', 'lessons', 'summary', 'home']
    },
    {
      id: 'content-creation',
      name: 'Create Content',
      icon: DocumentTextIcon,
      description: 'Build new lessons',
      component: ContentCreation,
      searchTerms: ['lesson', 'create', 'build', 'new'],
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
          action: () => actions.setActivePanel('ai-features')
        }
      ]
    },
    {
      id: 'content-management',
      name: 'Manage Content',
      icon: AcademicCapIcon,
      description: 'Organize and edit lessons',
      component: ContentManagement,
      searchTerms: ['manage', 'organize', 'edit', 'drafts'],
      subItems: [
        { 
          id: 'published-lessons', 
          name: 'Published Lessons', 
          description: 'View and edit published content',
          action: () => actions.setActivePanel('content-management')
        },
        { 
          id: 'drafts', 
          name: 'Drafts', 
          description: 'Work in progress',
          action: () => actions.setActivePanel('content-management')
        }
      ]
    },
    {
      id: 'ai-features',
      name: 'AI Tools',
      icon: SparklesIcon,
      description: 'AI-powered lesson features',
      component: AIFeatures,
      searchTerms: ['ai', 'artificial intelligence', 'generate'],
      subItems: [
        { 
          id: 'content-generator', 
          name: 'Content Generator', 
          description: 'AI lesson creation',
          action: () => actions.setActivePanel('ai-features')
        },
        { 
          id: 'youtube-processor', 
          name: 'YouTube Processor', 
          description: 'Video to lesson converter',
          action: () => actions.setActivePanel('ai-features')
        }
      ]
    },
    {
      id: 'lesson-migration',
      name: 'Migration Center',
      icon: CubeTransparentIcon,
      description: 'Migrate lessons to new format',
      component: LessonMigrationInterface,
      searchTerms: ['migration', 'convert', 'format', 'update', 'legacy'],
      subItems: [
        { 
          id: 'analyze-lessons', 
          name: 'Analyze Lessons', 
          description: 'Check lesson formats',
          action: () => actions.setActivePanel('lesson-migration')
        },
        { 
          id: 'bulk-migrate', 
          name: 'Bulk Migration', 
          description: 'Migrate multiple lessons',
          action: () => actions.setActivePanel('lesson-migration')
        }
      ]
    },
    {
      id: 'database-cleaner',
      name: 'Database Cleaner',
      icon: CubeTransparentIcon,
      description: 'Clear all lessons from database',
      component: DatabaseCleaner,
      searchTerms: ['delete', 'clear', 'clean', 'remove', 'database'],
      subItems: []
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

  // Load drafts from Firestore when user is authenticated
  useEffect(() => {
    if (currentUser?.uid) {
      const loadDrafts = async () => {
        try {
          const drafts = await draftService.loadDrafts(currentUser.uid);
          actions.setDrafts(drafts);
        } catch (error) {
          console.error('Error loading drafts:', error);
          // Show notification
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'error',
            message: 'Failed to load drafts',
            duration: 5000
          }]);
        }
      };

      loadDrafts();

      // Subscribe to real-time draft updates
      const unsubscribe = draftService.subscribeToDrafts(currentUser.uid, (drafts, error) => {
        if (error) {
          console.error('Draft subscription error:', error);
          return;
        }
        if (drafts) {
          actions.setDrafts(drafts);
        }
      });

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [currentUser?.uid, actions]);

  // REMOVED: Auto-save on every change (too aggressive)
  // Now using manual save system with prompts only

  // Manual save function
  const handleManualSave = async () => {
    if (!currentUser?.uid || !unsavedChanges) return;

    try {
      const draftData = {
        id: currentLesson?.id,
        title: currentLesson?.title || contentVersions.free?.title || contentVersions.premium?.title || 'Untitled Draft',
        contentVersions,
        lessonType: currentLesson?.lessonType || 'concept_explanation'
      };

      await draftService.saveDraft(currentUser.uid, draftData);
      actions.setUnsavedChanges(false);
      
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        message: 'Draft saved successfully!',
        duration: 3000
      }]);
    } catch (error) {
      console.error('Error saving draft:', error);
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: 'Failed to save draft',
        duration: 5000
      }]);
    }
  };

  // Handle navigation attempts when there are unsaved changes
  const handleNavigationAttempt = (targetPanel) => {
    if (unsavedChanges) {
      setPendingAction(() => () => actions.setActivePanel(targetPanel));
      setShowSavePrompt(true);
      return false;
    }
    return true; // No unsaved changes, allow navigation
  };

  // Save prompt modal handlers
  const handleSavePromptCancel = () => {
    setShowSavePrompt(false);
    setPendingAction(null);
  };

  const handleSavePromptDontSave = () => {
    setShowSavePrompt(false);
    actions.setUnsavedChanges(false);
    if (pendingAction) {
      pendingAction();
    }
    setPendingAction(null);
  };

  const handleSavePromptSave = async () => {
    setShowSavePrompt(false);
    try {
      await handleManualSave();
      if (pendingAction) {
        pendingAction();
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
    setPendingAction(null);
  };

  // Browser navigation guard (prevent accidental browser back/close)
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (unsavedChanges) {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);

  // Auto-remove notifications after duration
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications]);

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
              onClick={() => actions.setSidebarCollapsed(!sidebarCollapsed)}
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
                    onClick={() => {
                      if (handleNavigationAttempt(section.id)) {
                        actions.setActivePanel(section.id);
                      }
                    }}
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
              {/* Free/Premium Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Free</span>
                <button
                  onClick={() => actions.setPremiumMode(!isPremiumMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isPremiumMode ? 'bg-yellow-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPremiumMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-400">Premium</span>
                {isPremiumMode && <StarIcon className="w-4 h-4 text-yellow-500" />}
              </div>

              {/* Mobile View Toggle */}
              <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => actions.setMobileView(false)}
                  className={`p-2 rounded-md transition-colors ${
                    !isMobileView ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Desktop View"
                >
                  <ComputerDesktopIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => actions.setMobileView(true)}
                  className={`p-2 rounded-md transition-colors ${
                    isMobileView ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Mobile View"
                >
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Unsaved Changes Indicator */}
              {unsavedChanges && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-orange-600/20 border border-orange-600/50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-orange-300">Unsaved</span>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleManualSave}
                disabled={!unsavedChanges}
                className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  unsavedChanges
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                title={unsavedChanges ? 'Save draft' : 'No changes to save'}
              >
                <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                {unsavedChanges ? 'Save Draft' : 'Saved'}
              </button>
              
              {/* Quick Actions */}
              <button
                onClick={() => navigate('/unified-lesson-builder', { state: { fromAdmin: true, isPremiumMode, isMobileView } })}
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
              
              {/* Exit Admin Panel Button */}
              <button
                onClick={() => navigate('/home')}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                title="Exit Admin Panel"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Exit Admin
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
            {CurrentComponent && (
              <CurrentComponent 
                isPremiumMode={isPremiumMode}
                isMobileView={isMobileView}
                unsavedChanges={unsavedChanges}
                currentLesson={currentLesson}
                contentVersions={contentVersions}
                adminActions={actions}
                currentUser={currentUser}
                draftService={draftService}
              />
            )}
          </Suspense>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg ${
              notification.type === 'error' 
                ? 'bg-red-600 text-white' 
                : notification.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-sm font-medium">{notification.message}</div>
              </div>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="ml-3 text-white/80 hover:text-white"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Save Prompt Modal */}
      {showSavePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Save Changes?</h3>
            <p className="text-gray-300 mb-6">
              You have unsaved changes. Would you like to save them before continuing?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleSavePromptCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePromptDontSave}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Don't Save
              </button>
              <button
                onClick={handleSavePromptSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedAdminPanel; 