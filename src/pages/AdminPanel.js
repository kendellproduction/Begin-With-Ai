import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiMove, 
  FiSave, 
  FiX, 
  FiChevronDown, 
  FiChevronRight,
  FiYoutube,
  FiUpload,
  FiCheck,
  FiAlertCircle,
  FiArrowUp,
  FiArrowDown,
  FiLayers
} from 'react-icons/fi';
import { 
  getAllLearningPaths, 
  createLearningPath, 
  updateLearningPath, 
  deleteLearningPath,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderModules,
  reorderLessons,
  reorderPages,
  moveLesson,
  getAllModulesFlat,
  updateLessonPages,
  getLessonWithPages,
  cleanupFakeData
} from '../services/adminService';
import { generateLessonsFromYouTube } from '../services/youtubeTranscriptService';
import { getUserProfile } from '../services/firestoreService';
import LessonEditor from '../components/admin/LessonEditor';
import ModuleEditor from '../components/admin/ModuleEditor';
import ModuleManager from '../components/admin/ModuleManager';
import ContentProcessor from '../components/admin/YouTubeProcessor';
import APIStatusIndicator from '../components/admin/APIStatusIndicator';
import LoggedInNavbar from '../components/LoggedInNavbar';
import DraftManager from '../components/admin/DraftManager';

const AdminPanel = () => {
  const { user } = useAuth();
  const { gamification } = useGamification();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState(null);

  // Check user permissions
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) return;
      
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        
        if (!profile || (profile.role !== 'admin' && profile.role !== 'developer')) {
          // Redirect non-admin users
          window.location.href = '/dashboard';
          return;
        }
        
        await loadLearningPaths();
      } catch (error) {
        console.error('Error checking admin access:', error);
        setNotification({ type: 'error', message: 'Error loading admin panel' });
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [user]);

  const loadLearningPaths = async () => {
    try {
      const paths = await getAllLearningPaths();
      setLearningPaths(paths);
    } catch (error) {
      console.error('Error loading learning paths:', error);
      setNotification({ type: 'error', message: 'Error loading learning paths' });
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCreatePath = async (pathData) => {
    try {
      await createLearningPath(pathData);
      await loadLearningPaths();
      showNotification('success', 'Learning path created successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error creating path:', error);
      showNotification('error', 'Error creating learning path');
    }
  };

  const handleCreateModule = async (pathId, moduleData) => {
    try {
      await createModule(pathId, moduleData);
      await loadLearningPaths();
      showNotification('success', 'Module created successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error creating module:', error);
      showNotification('error', 'Error creating module');
    }
  };

  const handleCreateLesson = async (pathId, moduleId, lessonData) => {
    try {
      await createLesson(pathId, moduleId, lessonData);
      await loadLearningPaths();
      showNotification('success', 'Lesson created successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error creating lesson:', error);
      showNotification('error', 'Error creating lesson');
    }
  };

  const handleContentProcess = async (type, data) => {
    try {
      setLoading(true);
      let result;
      
      if (type === 'youtube') {
        result = await generateLessonsFromYouTube(data.url, data.options);
      } else {
        // For text and file content, you'd integrate with your AI service here
        // For now, mock the response
        result = {
          lessons: [
            {
              title: `AI Generated Lesson from ${type}`,
              description: 'This lesson was generated using AI processing',
              content: [
                {
                  type: 'text',
                  content: 'Generated lesson content...'
                }
              ]
            }
          ]
        };
      }
      
      return result;
    } catch (error) {
      console.error('Error processing content:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSave = async (lessonData) => {
    try {
      // Determine which path/module to save to
      const defaultPathId = 'prompt-engineering-mastery';
      const defaultModuleId = 'ai-foundations';
      
      // Create the lesson with publication status
      await createLesson(defaultPathId, defaultModuleId, {
        ...lessonData,
        createdAt: new Date().toISOString(),
        createdBy: user.uid
      });
      
      await loadLearningPaths();
      
      const status = lessonData.isPublished ? 'published live' : 'saved as draft';
      showNotification('success', `Lesson ${status} successfully`);
    } catch (error) {
      console.error('Error saving lesson:', error);
      showNotification('error', 'Error saving lesson');
    }
  };

  const renderPathTree = () => {
    return (
      <div className="space-y-4">
        {learningPaths.map((path) => (
          <PathTreeItem 
            key={path.id} 
            path={path}
            selectedPath={selectedPath}
            selectedModule={selectedModule}
            selectedLesson={selectedLesson}
            onSelectPath={setSelectedPath}
            onSelectModule={setSelectedModule}
            onSelectLesson={setSelectedLesson}
            onEdit={(type, item) => {
              setEditingItem({ type, item });
              setIsEditing(true);
            }}
            onDelete={async (type, id, parentId) => {
              if (window.confirm('Are you sure you want to delete this item?')) {
                try {
                  if (type === 'path') await deleteLearningPath(id);
                  else if (type === 'module') await deleteModule(parentId, id);
                  else if (type === 'lesson') await deleteLesson(parentId.pathId, parentId.moduleId, id);
                  
                  await loadLearningPaths();
                  showNotification('success', `${type} deleted successfully`);
                } catch (error) {
                  showNotification('error', `Error deleting ${type}`);
                }
              }
            }}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'developer')) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <LoggedInNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Floating Particles Background */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              animate={{
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                <p className="text-gray-400">Manage lessons, modules, and learning content</p>
              </div>
              <div className="flex items-center space-x-4">
                <APIStatusIndicator />
                <span className="text-sm text-gray-400">
                  Welcome, {user.displayName || user.email}
                </span>
                <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                  {userProfile?.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              } text-white`}
            >
              <div className="flex items-center">
                {notification.type === 'success' ? <FiCheck className="mr-2" /> : <FiAlertCircle className="mr-2" />}
                {notification.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="border-b border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: FiEdit },
                { id: 'modules', label: 'Module Manager', icon: FiLayers },
                { id: 'drafts', label: 'Lesson Drafts', icon: FiSave },
                { id: 'content', label: 'Content Management', icon: FiEdit },
                { id: 'youtube', label: 'Content Processor', icon: FiYoutube }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="mr-2 h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Quick Stats with Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Learning Paths</h3>
                      <button
                        onClick={() => {
                          setEditingItem({ type: 'path', item: null });
                          setIsEditing(true);
                        }}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <FiPlus className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-3xl font-bold text-indigo-400 mb-2">{learningPaths.length}</p>
                    <p className="text-xs text-gray-500 mb-2">Predefined course sequences</p>
                    <div className="space-y-2">
                      {learningPaths.slice(0, 3).map(path => (
                        <div key={path.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300 truncate">{path.title}</span>
                          <button
                            onClick={() => {
                              setEditingItem({ type: 'path', item: path });
                              setIsEditing(true);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <FiEdit className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Modules</h3>
                      <button
                        onClick={() => setActiveTab('modules')}
                        className="text-green-400 hover:text-green-300"
                      >
                        <FiLayers className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-3xl font-bold text-green-400 mb-2">
                      {learningPaths.reduce((total, path) => total + (path.modules?.length || 0), 0)}
                    </p>
                    <div className="space-y-2">
                      {learningPaths.flatMap(path => 
                        (path.modules || []).map(module => ({...module, pathTitle: path.title}))
                      ).slice(0, 3).map(module => (
                        <div key={module.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300 truncate">{module.title}</span>
                          <span className="text-gray-500 text-xs">{module.lessons?.length || 0} lessons</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Lessons</h3>
                      <button
                        onClick={() => setActiveTab('content')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-3xl font-bold text-blue-400 mb-2">
                      {learningPaths.reduce((total, path) => 
                        total + (path.modules?.reduce((moduleTotal, module) => 
                          moduleTotal + (module.lessons?.length || 0), 0) || 0), 0)}
                    </p>
                    <div className="space-y-2">
                      {learningPaths.flatMap(path => 
                        (path.modules || []).flatMap(module => 
                          (module.lessons || []).map(lesson => ({...lesson, moduleName: module.title}))
                        )
                      ).slice(0, 3).map(lesson => (
                        <div key={lesson.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300 truncate">{lesson.title}</span>
                          <span className="text-gray-500 text-xs">{lesson.content?.length || 0} pages</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('youtube')}
                        className="w-full flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        <FiYoutube className="mr-2 h-4 w-4" />
                        Import from YouTube
                      </button>
                      <button
                        onClick={() => setActiveTab('modules')}
                        className="w-full flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                      >
                        <FiLayers className="mr-2 h-4 w-4" />
                        Manage Modules
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm('This will remove all fake/test data and keep only real modules (AI Foundations, Vibe Coding). Continue?')) {
                            try {
                              const result = await cleanupFakeData();
                              showNotification('success', result.message);
                              await loadLearningPaths();
                            } catch (error) {
                              showNotification('error', 'Error cleaning up data');
                            }
                          }
                        }}
                        className="w-full flex items-center px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                      >
                        <FiTrash2 className="mr-2 h-4 w-4" />
                        Clean Fake Data
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Content Overview</h3>
                  <div className="space-y-4">
                    {learningPaths.map(path => (
                      <div key={path.id} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-white">{path.title}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">
                              {path.modules?.length || 0} modules • {path.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0} lessons
                            </span>
                            <button
                              onClick={() => {
                                setEditingItem({ type: 'path', item: path });
                                setIsEditing(true);
                              }}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <FiEdit className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {(path.modules || []).map(module => (
                            <div key={module.id} className="bg-gray-700 rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-200 text-sm">{module.title}</h5>
                                <span className="text-xs text-gray-400">{module.lessons?.length || 0} lessons</span>
                              </div>
                              <div className="space-y-1">
                                {(module.lessons || []).slice(0, 2).map(lesson => (
                                  <div key={lesson.id} className="text-xs text-gray-400 truncate">
                                    • {lesson.title}
                                  </div>
                                ))}
                                {(module.lessons?.length || 0) > 2 && (
                                  <div className="text-xs text-gray-500">
                                    + {(module.lessons?.length || 0) - 2} more lessons
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'modules' && (
              <ModuleManager onShowNotification={showNotification} />
            )}

            {activeTab === 'drafts' && (
              <DraftManager 
                onEditDraft={(editingItem) => {
                  setEditingItem(editingItem);
                  setIsEditing(true);
                }}
                onShowNotification={showNotification}
              />
            )}

            {activeTab === 'content' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Content Tree */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">Content Structure</h3>
                    <button
                      onClick={() => {
                        setEditingItem({ type: 'path', item: null });
                        setIsEditing(true);
                      }}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      <FiPlus className="mr-2" />
                      New Path
                    </button>
                  </div>
                  {renderPathTree()}
                </div>

                {/* Editor Panel */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">
                    {selectedLesson ? 'Lesson Editor' : 
                     selectedModule ? 'Module Editor' : 
                     selectedPath ? 'Path Editor' : 'Select an item to edit'}
                  </h3>
                  
                  {selectedLesson && (
                    <LessonEditor
                      lesson={selectedLesson}
                      pathId={selectedPath.id}
                      moduleId={selectedModule.id}
                      onSave={async (lessonData) => {
                        await updateLesson(selectedPath.id, selectedModule.id, selectedLesson.id, lessonData);
                        await loadLearningPaths();
                        showNotification('success', 'Lesson updated successfully');
                      }}
                    />
                  )}
                  
                  {selectedModule && !selectedLesson && (
                    <ModuleEditor
                      module={selectedModule}
                      pathId={selectedPath.id}
                      onSave={async (moduleData) => {
                        await updateModule(selectedPath.id, selectedModule.id, moduleData);
                        await loadLearningPaths();
                        showNotification('success', 'Module updated successfully');
                      }}
                    />
                  )}
                  
                  {selectedPath && !selectedModule && (
                    <PathEditor
                      path={selectedPath}
                      onSave={async (pathData) => {
                        await updateLearningPath(selectedPath.id, pathData);
                        await loadLearningPaths();
                        showNotification('success', 'Path updated successfully');
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'youtube' && (
              <ContentProcessor 
                onProcess={handleContentProcess}
                onSave={handleLessonSave}
              />
            )}
          </div>
        </div>

        {/* Editing Modals */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    {editingItem?.type === 'path' ? 'Learning Path' :
                     editingItem?.type === 'module' ? 'Module' :
                     editingItem?.type === 'lesson' ? 'Lesson' :
                     editingItem?.type === 'youtube-preview' ? 'YouTube Content Preview' : 'Edit'} 
                    {editingItem?.item ? ' Editor' : ' Creator'}
                  </h3>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Render appropriate editor based on type */}
                {editingItem?.type === 'path' && (
                  <PathEditor
                    path={editingItem.item}
                    onSave={editingItem.item ? 
                      async (data) => {
                        await updateLearningPath(editingItem.item.id, data);
                        await loadLearningPaths();
                        setIsEditing(false);
                        showNotification('success', 'Path updated successfully');
                      } : 
                      handleCreatePath
                    }
                    onCancel={() => setIsEditing(false)}
                  />
                )}

                {editingItem?.type === 'lesson' && (
                  <LessonEditor
                    lesson={editingItem.item}
                    pathId={editingItem.pathId}
                    moduleId={editingItem.moduleId}
                    isDraft={!editingItem.item}
                    draftId={editingItem.draftId}
                    onSave={async (lessonData, draftId, isDelete = false) => {
                      if (isDelete) {
                        // Handle draft deletion
                        setIsEditing(false);
                        showNotification('success', 'Draft deleted successfully');
                        return;
                      }
                      
                      if (editingItem.item) {
                        // Update existing lesson
                        await updateLesson(editingItem.pathId, editingItem.moduleId, editingItem.item.id, lessonData);
                        showNotification('success', 'Lesson updated successfully');
                      } else {
                        // Create new lesson from draft
                        await handleCreateLesson(editingItem.pathId, editingItem.moduleId, lessonData);
                        // Delete the draft after successful creation
                        if (draftId) {
                          const { deleteLessonDraft } = await import('../utils/localStorage');
                          deleteLessonDraft(draftId);
                        }
                        showNotification('success', 'Lesson created successfully');
                      }
                      
                      await loadLearningPaths();
                      setIsEditing(false);
                    }}
                  />
                )}
                
                {editingItem?.type === 'youtube-preview' && (
                  <YouTubePreview
                    data={editingItem.data}
                    onApprove={async (approvedData) => {
                      // Create the learning path and modules from approved data
                      await handleCreatePath(approvedData);
                      setIsEditing(false);
                    }}
                    onCancel={() => setIsEditing(false)}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Supporting Components

const PathTreeItem = ({ path, selectedPath, selectedModule, selectedLesson, onSelectPath, onSelectModule, onSelectLesson, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border border-gray-700 rounded-lg">
      <div 
        className={`p-4 cursor-pointer hover:bg-gray-700 flex items-center justify-between ${
          selectedPath?.id === path.id ? 'bg-gray-700' : ''
        }`}
        onClick={() => {
          onSelectPath(path);
          onSelectModule(null);
          onSelectLesson(null);
          setIsExpanded(!isExpanded);
        }}
      >
        <div className="flex items-center">
          {isExpanded ? <FiChevronDown className="mr-2" /> : <FiChevronRight className="mr-2" />}
          <span className="text-white font-medium">{path.title}</span>
          <span className="ml-2 text-sm text-gray-400">({path.modules?.length || 0} modules)</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit('module', { pathId: path.id });
            }}
            className="text-green-400 hover:text-green-300"
          >
            <FiPlus className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit('path', path);
            }}
            className="text-blue-400 hover:text-blue-300"
          >
            <FiEdit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete('path', path.id);
            }}
            className="text-red-400 hover:text-red-300"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {isExpanded && path.modules && (
        <div className="border-t border-gray-700">
          {path.modules.map((module) => (
            <ModuleTreeItem
              key={module.id}
              module={module}
              pathId={path.id}
              selectedModule={selectedModule}
              selectedLesson={selectedLesson}
              onSelectModule={onSelectModule}
              onSelectLesson={onSelectLesson}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ModuleTreeItem = ({ module, pathId, selectedModule, selectedLesson, onSelectModule, onSelectLesson, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="ml-8">
      <div 
        className={`p-3 cursor-pointer hover:bg-gray-700 flex items-center justify-between ${
          selectedModule?.id === module.id ? 'bg-gray-700' : ''
        }`}
        onClick={() => {
          onSelectModule(module);
          onSelectLesson(null);
          setIsExpanded(!isExpanded);
        }}
      >
        <div className="flex items-center">
          {isExpanded ? <FiChevronDown className="mr-2" /> : <FiChevronRight className="mr-2" />}
          <span className="text-gray-300">{module.title}</span>
          <span className="ml-2 text-sm text-gray-500">({module.lessons?.length || 0} lessons)</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit('lesson', { pathId, moduleId: module.id });
            }}
            className="text-green-400 hover:text-green-300"
          >
            <FiPlus className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit('module', module);
            }}
            className="text-blue-400 hover:text-blue-300"
          >
            <FiEdit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete('module', module.id, pathId);
            }}
            className="text-red-400 hover:text-red-300"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {isExpanded && module.lessons && (
        <div className="ml-4 border-l border-gray-700">
          {module.lessons.map((lesson) => (
            <LessonTreeItem
              key={lesson.id}
              lesson={lesson}
              pathId={pathId}
              moduleId={module.id}
              selectedLesson={selectedLesson}
              onSelectLesson={onSelectLesson}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const LessonTreeItem = ({ lesson, pathId, moduleId, selectedLesson, onSelectLesson, onEdit, onDelete }) => {
  return (
    <div 
      className={`p-3 cursor-pointer hover:bg-gray-700 flex items-center justify-between ${
        selectedLesson?.id === lesson.id ? 'bg-gray-700' : ''
      }`}
      onClick={() => onSelectLesson(lesson)}
    >
      <div className="flex items-center">
        <span className="text-gray-400">{lesson.title}</span>
        <span className="ml-2 text-sm text-gray-500">({lesson.content?.length || 0} pages)</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit('lesson', lesson);
          }}
          className="text-blue-400 hover:text-blue-300"
        >
          <FiEdit className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete('lesson', lesson.id, { pathId, moduleId });
          }}
          className="text-red-400 hover:text-red-300"
        >
          <FiTrash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const PathEditor = ({ path, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: path?.title || '',
    description: path?.description || '',
    estimatedDuration: path?.estimatedDuration || '',
    targetAudience: path?.targetAudience || ['beginner'],
    isPremium: path?.isPremium || false,
    published: path?.published !== false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Duration</label>
          <input
            type="text"
            value={formData.estimatedDuration}
            onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
            placeholder="e.g., 2 hours"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
          <select
            multiple
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: Array.from(e.target.selectedOptions, option => option.value) })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isPremium}
            onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
            className="mr-2"
          />
          <span className="text-gray-300">Premium Content</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="mr-2"
          />
          <span className="text-gray-300">Published</span>
        </label>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <FiSave className="inline mr-2" />
          Save
        </button>
      </div>
    </form>
  );
};

const YouTubePreview = ({ data, onApprove, onCancel }) => {
  const [editedData, setEditedData] = useState(data);

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-2">Generated Content Preview</h4>
        <p className="text-gray-300 mb-4">Review and edit the automatically generated content before creating.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Learning Path Title</label>
            <input
              type="text"
              value={editedData.title}
              onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={editedData.description}
              onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
            />
          </div>
          
          <div>
            <h5 className="text-md font-medium text-white mb-2">Modules ({editedData.modules?.length || 0})</h5>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {editedData.modules?.map((module, index) => (
                <div key={index} className="bg-gray-600 p-3 rounded">
                  <p className="text-white font-medium">{module.title}</p>
                  <p className="text-gray-300 text-sm">{module.lessons?.length || 0} lessons</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          onClick={() => onApprove(editedData)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <FiCheck className="inline mr-2" />
          Approve & Create
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;