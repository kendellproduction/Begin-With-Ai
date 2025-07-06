import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ClockIcon,
  UserIcon,
  BookOpenIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

// Import admin services
import { 
  getAllLearningPaths, 
  getAllModulesFlat,
  deleteLesson,
  deleteLearningPath,
  deleteModule,
  updateLesson,
  updateModule,
  updateLearningPath
} from '../../../services/adminService';

import { useAuth } from '../../../contexts/AuthContext';
import draftService from '../../../services/draftService';

const ContentManagement = () => {
  const { user } = useAuth();
  const [learningPaths, setLearningPaths] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [expandedPaths, setExpandedPaths] = useState(new Set());
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sortBy, setSortBy] = useState('updated');
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'list'
  const [showDrafts, setShowDrafts] = useState(true);
  const [draftsLoading, setDraftsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadLearningPaths(),
      loadDrafts()
    ]);
    setLoading(false);
  };

  const loadLearningPaths = async () => {
    try {
      const paths = await getAllLearningPaths();
      setLearningPaths(paths);
    } catch (error) {
      console.error('Error loading learning paths:', error);
    }
  };

  const loadDrafts = async () => {
    if (!user?.uid) return;
    
    try {
      setDraftsLoading(true);
      const userDrafts = await draftService.loadDrafts(user.uid);
      setDrafts(userDrafts);
    } catch (error) {
      console.error('Error loading drafts:', error);
    } finally {
      setDraftsLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const togglePathExpansion = (pathId) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(pathId)) {
      newExpanded.delete(pathId);
    } else {
      newExpanded.add(pathId);
    }
    setExpandedPaths(newExpanded);
  };

  const toggleModuleExpansion = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleEdit = (item, type) => {
    setSelectedItem({ ...item, type });
    showNotification('info', `Opening ${type} editor...`);
  };

  const handleDelete = async (item, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      switch (type) {
        case 'lesson':
          await deleteLesson(item.pathId, item.moduleId, item.id);
          break;
        case 'module':
          await deleteModule(item.pathId, item.id);
          break;
        case 'path':
          await deleteLearningPath(item.id);
          break;
      }
      
      showNotification('success', `${type} deleted successfully`);
      await loadLearningPaths();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      showNotification('error', `Error deleting ${type}`);
    }
  };

  const handleDeleteDraft = async (draftId) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    
    try {
      await draftService.deleteDraft(user.uid, draftId);
      await loadDrafts();
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  };

  const handleEditDraft = (draft) => {
    window.open(`/unified-lesson-builder?draftId=${draft.id}`, '_blank');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredPaths = learningPaths.filter(path => {
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    
    // Search in path name and description
    if (path.title?.toLowerCase().includes(query) || 
        path.description?.toLowerCase().includes(query)) {
      return true;
    }
    
    // Search in modules and lessons
    return path.modules?.some(module => 
      module.title?.toLowerCase().includes(query) ||
      module.description?.toLowerCase().includes(query) ||
      module.lessons?.some(lesson => 
        lesson.title?.toLowerCase().includes(query) ||
        lesson.description?.toLowerCase().includes(query)
      )
    );
  });

  const sortedDrafts = [...drafts].sort((a, b) => {
    if (sortBy === 'updated') {
      return new Date(b.lastModified) - new Date(a.lastModified);
    } else if (sortBy === 'created') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const PathTreeItem = ({ path }) => {
    const isExpanded = expandedPaths.has(path.id);
    
    return (
      <div className="border border-gray-700 rounded-lg mb-4 overflow-hidden">
        {/* Path Header */}
        <div className="bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <button
                onClick={() => togglePathExpansion(path.id)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              <BookOpenIcon className="w-5 h-5 text-blue-400" />
              
              <div className="flex-1">
                <h3 className="font-semibold text-white">{path.title}</h3>
                <p className="text-sm text-gray-400">{path.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>{path.modules?.length || 0} modules</span>
                  <span>{path.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0} lessons</span>
                  <span>Updated {new Date(path.updatedAt || path.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEdit(path, 'path')}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
              >
                <PencilSquareIcon className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => handleDelete(path, 'path')}
                className="p-2 hover:bg-red-800 rounded transition-colors"
              >
                <TrashIcon className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Modules */}
        {isExpanded && path.modules && (
          <div className="bg-gray-850 border-t border-gray-700">
            {path.modules.map((module) => (
              <ModuleTreeItem 
                key={module.id} 
                module={module} 
                pathId={path.id}
              />
            ))}
            
            {/* Add Module Button */}
            <div className="p-4 border-t border-gray-700">
              <button className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <PlusIcon className="w-4 h-4" />
                <span>Add Module</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ModuleTreeItem = ({ module, pathId }) => {
    const isExpanded = expandedModules.has(module.id);
    
    return (
      <div className="border-l-2 border-gray-600 ml-8">
        {/* Module Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <button
                onClick={() => toggleModuleExpansion(module.id)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              <FolderIcon className="w-5 h-5 text-yellow-400" />
              
              <div className="flex-1">
                <h4 className="font-medium text-white">{module.title}</h4>
                <p className="text-sm text-gray-400">{module.description}</p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <span>{module.lessons?.length || 0} lessons</span>
                  <span>Order: {module.order}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEdit({ ...module, pathId }, 'module')}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
              >
                <PencilSquareIcon className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => handleDelete({ ...module, pathId }, 'module')}
                className="p-2 hover:bg-red-800 rounded transition-colors"
              >
                <TrashIcon className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Lessons */}
        {isExpanded && module.lessons && (
          <div className="ml-4">
            {module.lessons.map((lesson) => (
              <LessonTreeItem 
                key={lesson.id} 
                lesson={lesson} 
                pathId={pathId}
                moduleId={module.id}
              />
            ))}
            
            {/* Add Lesson Button */}
            <div className="p-3 border-b border-gray-700">
              <button className="flex items-center space-x-2 text-sm text-green-400 hover:text-green-300 transition-colors">
                <PlusIcon className="w-4 h-4" />
                <span>Add Lesson</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const LessonTreeItem = ({ lesson, pathId, moduleId }) => (
    <div className="p-3 border-b border-gray-700 hover:bg-gray-750 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <DocumentTextIcon className="w-4 h-4 text-green-400" />
          
          <div className="flex-1">
            <h5 className="text-white">{lesson.title}</h5>
            <p className="text-sm text-gray-400">{lesson.description}</p>
            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
              <span>Order: {lesson.order}</span>
              <span>{lesson.pages?.length || 0} pages</span>
              <span>Difficulty: {lesson.difficulty || 'Not set'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.open(`/lesson-viewer/${lesson.id}`, '_blank')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <EyeIcon className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => handleEdit({ ...lesson, pathId, moduleId }, 'lesson')}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <PencilSquareIcon className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => handleDelete({ ...lesson, pathId, moduleId }, 'lesson')}
            className="p-2 hover:bg-red-800 rounded transition-colors"
          >
            <TrashIcon className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            notification.type === 'error' 
              ? 'bg-red-900 border-red-600 text-red-100' 
              : notification.type === 'success'
              ? 'bg-green-900 border-green-600 text-green-100'
              : 'bg-blue-900 border-blue-600 text-blue-100'
          }`}
        >
          {notification.message}
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Content Management</h2>
          <p className="text-gray-400">Organize and manage your learning content</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={loadData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search learning paths, modules, and lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select 
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="tree">Tree View</option>
            <option value="list">List View</option>
          </select>
        </div>
      </div>

      {/* Drafts Section - Now Prominent */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDrafts(!showDrafts)}
                className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300"
              >
                {showDrafts ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                <BookmarkIcon className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Your Drafts</h3>
              </button>
              <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded-full text-xs">
                {drafts.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
                             <button
                 onClick={loadDrafts}
                 className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                 title="Refresh drafts"
               >
                 <ArrowPathIcon className="w-4 h-4" />
               </button>
              <button
                onClick={() => window.open('/unified-lesson-builder', '_blank')}
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span>New Lesson</span>
              </button>
            </div>
          </div>
        </div>

        {showDrafts && (
          <div className="p-4">
            {draftsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading drafts...</p>
              </div>
            ) : sortedDrafts.length === 0 ? (
              <div className="text-center py-8">
                <BookmarkIcon className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No Drafts Yet</h3>
                <p className="text-gray-500 mb-4">Start creating lessons to see your drafts here.</p>
                <button
                  onClick={() => window.open('/unified-lesson-builder', '_blank')}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Create Your First Lesson</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedDrafts.map((draft) => (
                  <motion.div
                    key={draft.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-yellow-500 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate group-hover:text-yellow-300 transition-colors">
                          {draft.title}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {draft.description || 'No description'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={() => handleEditDraft(draft)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-gray-600 rounded transition-colors"
                          title="Edit draft"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded transition-colors"
                          title="Delete draft"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-3 h-3" />
                        <span>{formatDate(draft.lastModified)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-gray-600 px-2 py-1 rounded text-xs">
                          {draft.contentVersions?.free?.pages?.length || 0} pages
                        </span>
                        <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs">
                          Draft
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Learning Paths</h3>
              <p className="text-2xl font-bold text-blue-400">{learningPaths.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <FolderIcon className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Modules</h3>
              <p className="text-2xl font-bold text-yellow-400">
                {learningPaths.reduce((acc, path) => acc + (path.modules?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Lessons</h3>
              <p className="text-2xl font-bold text-green-400">
                {learningPaths.reduce((acc, path) => 
                  acc + (path.modules?.reduce((modAcc, mod) => modAcc + (mod.lessons?.length || 0), 0) || 0), 0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Paths Tree */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Learning Paths</h3>
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading content...</p>
            </div>
          ) : filteredPaths.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No Learning Paths Found</h3>
              <p className="text-gray-500">Try adjusting your search or create a new learning path.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPaths.map((path) => (
                <div key={path.id} className="border border-gray-700 rounded-lg">
                  <div className="p-4 bg-gray-750 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                                                 <button
                           onClick={() => toggleExpanded(path.id)}
                           className="text-gray-400 hover:text-white"
                         >
                           {expandedItems.has(path.id) ? (
                             <ChevronDownIcon className="w-5 h-5" />
                           ) : (
                             <ChevronRightIcon className="w-5 h-5" />
                           )}
                         </button>
                        
                        <BookOpenIcon className="w-5 h-5 text-indigo-400" />
                        
                        <div>
                          <h3 className="text-lg font-semibold text-white">{path.title}</h3>
                          <p className="text-sm text-gray-400">{path.description}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span>{path.modules?.length || 0} modules</span>
                            <span>
                              {path.modules?.reduce((sum, module) => sum + (module.lessons?.length || 0), 0) || 0} lessons
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(path, 'path')}
                          className="p-2 hover:bg-gray-700 rounded transition-colors"
                        >
                          <PencilSquareIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                                     {expandedItems.has(path.id) && path.modules && (
                     <div className="p-4 space-y-2">
                       {path.modules.map(module => (
                         <ModuleTreeItem 
                           key={module.id} 
                           module={module} 
                           pathId={path.id} 
                         />
                       ))}
                     </div>
                   )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManagement; 