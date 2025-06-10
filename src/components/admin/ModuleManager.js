import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiMove, 
  FiSave, 
  FiX, 
  FiChevronDown, 
  FiChevronRight,
  FiBook,
  FiLayers,
  FiFileText,
  FiEye,
  FiArrowRight
} from 'react-icons/fi';
import { 
  getAllModulesFlat,
  updateModule,
  deleteModule,
  moveLesson,
  updateLesson,
  deleteLesson,
  getLessonWithPages,
  updateLessonPages,
  createModule
} from '../../services/adminService';
import LessonPageEditor from './LessonPageEditor';

const ModuleManager = ({ onShowNotification }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [editingModule, setEditingModule] = useState(null);
  const [viewingLesson, setViewingLesson] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [createModuleModal, setCreateModuleModal] = useState(false);
  const [newModuleData, setNewModuleData] = useState({
    title: '',
    description: '',
    pathId: 'prompt-engineering-mastery',
    order: 1
  });
  
  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      setLoading(true);
      const modulesData = await getAllModulesFlat();
      setModules(modulesData);
    } catch (error) {
      console.error('Error loading modules:', error);
      onShowNotification?.('error', 'Error loading modules');
    } finally {
      setLoading(false);
    }
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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    // Extract lesson and module info from draggableId format: "lesson-{pathId}-{moduleId}-{lessonId}"
    const [, pathId, sourceModuleId, lessonId] = draggableId.split('-');
    const destModuleId = destination.droppableId.replace('module-', '');

    try {
      await moveLesson(pathId, sourceModuleId, destModuleId, lessonId, destination.index + 1);
      await loadModules();
      onShowNotification?.('success', 'Lesson moved successfully');
    } catch (error) {
      console.error('Error moving lesson:', error);
      onShowNotification?.('error', 'Error moving lesson');
    }
  };

  const handleModuleEdit = async (moduleData) => {
    try {
      await updateModule(editingModule.pathId, editingModule.id, moduleData);
      await loadModules();
      setEditingModule(null);
      onShowNotification?.('success', 'Module updated successfully');
    } catch (error) {
      console.error('Error updating module:', error);
      onShowNotification?.('error', 'Error updating module');
    }
  };

  const handleModuleDelete = async (module) => {
    if (window.confirm(`Are you sure you want to delete "${module.title}" and all its lessons?`)) {
      try {
        await deleteModule(module.pathId, module.id);
        await loadModules();
        onShowNotification?.('success', 'Module deleted successfully');
      } catch (error) {
        console.error('Error deleting module:', error);
        onShowNotification?.('error', 'Error deleting module');
      }
    }
  };

  const handleLessonView = async (lesson) => {
    try {
      const fullLesson = await getLessonWithPages(lesson.pathId, lesson.moduleId, lesson.id);
      setViewingLesson(fullLesson);
    } catch (error) {
      console.error('Error loading lesson:', error);
      onShowNotification?.('error', 'Error loading lesson');
    }
  };

  const handleLessonEdit = async (lesson) => {
    try {
      const fullLesson = await getLessonWithPages(lesson.pathId, lesson.moduleId, lesson.id);
      setEditingLesson(fullLesson);
    } catch (error) {
      console.error('Error loading lesson for edit:', error);
      onShowNotification?.('error', 'Error loading lesson');
    }
  };

  const handleLessonPagesUpdate = async (pages) => {
    try {
      await updateLessonPages(
        editingLesson.pathId, 
        editingLesson.moduleId, 
        editingLesson.id, 
        pages
      );
      setEditingLesson(null);
      onShowNotification?.('success', 'Lesson pages updated successfully');
    } catch (error) {
      console.error('Error updating lesson pages:', error);
      onShowNotification?.('error', 'Error updating lesson pages');
    }
  };

  const handleLessonDelete = async (lesson) => {
    if (window.confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
      try {
        await deleteLesson(lesson.pathId, lesson.moduleId, lesson.id);
        await loadModules();
        onShowNotification?.('success', 'Lesson deleted successfully');
      } catch (error) {
        console.error('Error deleting lesson:', error);
        onShowNotification?.('error', 'Error deleting lesson');
      }
    }
  };

  const handleCreateModule = async () => {
    try {
      await createModule(newModuleData.pathId, newModuleData);
      await loadModules();
      setCreateModuleModal(false);
      setNewModuleData({
        title: '',
        description: '',
        pathId: 'prompt-engineering-mastery',
        order: 1
      });
      onShowNotification?.('success', 'Module created successfully');
    } catch (error) {
      console.error('Error creating module:', error);
      onShowNotification?.('error', 'Error creating module');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Module Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Module Manager</h2>
          <p className="text-gray-400">Manage modules and lessons across all learning paths</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            {modules.length} modules • {modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} lessons
          </div>
          <button
            onClick={() => setCreateModuleModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Module
          </button>
        </div>
      </div>

      {/* Compact Module Table */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-300">
              <div className="col-span-1"></div>
              <div className="col-span-5">Module</div>
              <div className="col-span-2">Learning Path</div>
              <div className="col-span-2">Lessons</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-700">
            {modules.map((module) => (
              <ModuleRow
                key={module.id}
                module={module}
                isExpanded={expandedModules.has(module.id)}
                onToggleExpansion={() => toggleModuleExpansion(module.id)}
                onEdit={() => setEditingModule(module)}
                onDelete={() => handleModuleDelete(module)}
                onLessonView={handleLessonView}
                onLessonEdit={handleLessonEdit}
                onLessonDelete={handleLessonDelete}
              />
            ))}
          </div>
        </div>
      </DragDropContext>

      {/* Module Edit Modal */}
      <AnimatePresence>
        {editingModule && (
          <ModuleEditModal
            module={editingModule}
            onSave={handleModuleEdit}
            onCancel={() => setEditingModule(null)}
          />
        )}
      </AnimatePresence>

      {/* Lesson View Modal */}
      <AnimatePresence>
        {viewingLesson && (
          <LessonViewModal
            lesson={viewingLesson}
            onClose={() => setViewingLesson(null)}
            onEdit={() => {
              setEditingLesson(viewingLesson);
              setViewingLesson(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Lesson Edit Modal */}
      <AnimatePresence>
        {editingLesson && (
          <LessonEditModal
            lesson={editingLesson}
            onSave={handleLessonPagesUpdate}
            onCancel={() => setEditingLesson(null)}
          />
        )}
      </AnimatePresence>

      {/* Lesson Page Editor Modal */}
      {editingLesson && (
        <LessonPageEditor
          lesson={editingLesson}
          onSave={handleLessonPagesUpdate}
          onClose={() => setEditingLesson(null)}
        />
      )}

      {/* Create Module Modal */}
      <AnimatePresence>
        {createModuleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Create New Module</h3>
                <button
                  onClick={() => setCreateModuleModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Learning Path
                  </label>
                  <select
                    value={newModuleData.pathId}
                    onChange={(e) => setNewModuleData(prev => ({ ...prev, pathId: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="prompt-engineering-mastery">Prompt Engineering Mastery</option>
                    <option value="vibe-coding">Vibe Coding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Module Title
                  </label>
                  <input
                    type="text"
                    value={newModuleData.title}
                    onChange={(e) => setNewModuleData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter module title..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newModuleData.description}
                    onChange={(e) => setNewModuleData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this module covers..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newModuleData.order}
                    onChange={(e) => setNewModuleData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setCreateModuleModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateModule}
                  disabled={!newModuleData.title.trim()}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  Create Module
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ModuleRow = ({ 
  module, 
  isExpanded, 
  onToggleExpansion, 
  onEdit, 
  onDelete, 
  onLessonView, 
  onLessonEdit, 
  onLessonDelete 
}) => {
  return (
    <>
      {/* Module Row */}
      <div className="px-6 py-4 hover:bg-gray-700 transition-colors">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-1">
            <button
              onClick={onToggleExpansion}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? <FiChevronDown className="h-4 w-4" /> : <FiChevronRight className="h-4 w-4" />}
            </button>
          </div>
          
          <div className="col-span-5">
            <div className="flex items-center">
              <FiLayers className="mr-3 text-indigo-400 h-4 w-4" />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-base mb-1">{module.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed break-words pr-2">
                  {module.description}
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-span-2">
            <span className="text-gray-300">{module.pathTitle}</span>
          </div>
          
          <div className="col-span-2">
            <div className="flex items-center">
              <span className="text-gray-300">{module.lessons?.length || 0}</span>
              <span className="text-gray-500 ml-1">lessons</span>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="text-blue-400 hover:text-blue-300 p-1"
                title="Edit Module"
              >
                <FiEdit className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="text-red-400 hover:text-red-300 p-1"
                title="Delete Module"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Lessons */}
      {isExpanded && (
        <Droppable droppableId={`module-${module.id}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`bg-gray-750 ${snapshot.isDraggingOver ? 'bg-gray-600' : ''}`}
            >
              {module.lessons?.length > 0 ? (
                module.lessons.map((lesson, index) => (
                  <Draggable
                    key={lesson.id}
                    draggableId={`lesson-${lesson.pathId}-${lesson.moduleId}-${lesson.id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`px-6 py-3 border-l-4 border-gray-600 ml-6 ${
                          snapshot.isDragging ? 'bg-gray-600 shadow-xl' : 'hover:bg-gray-700'
                        }`}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-1">
                            <div
                              {...provided.dragHandleProps}
                              className="text-gray-400 hover:text-white cursor-grab"
                            >
                              <FiMove className="h-4 w-4" />
                            </div>
                          </div>
                          
                          <div className="col-span-4">
                            <div className="flex items-center">
                              <FiBook className="mr-2 text-green-400 h-4 w-4" />
                              <div>
                                <h4 className="text-white font-medium">{lesson.title}</h4>
                                <div className="flex items-center space-x-2 text-xs text-gray-400">
                                  <span>{lesson.lessonType}</span>
                                  <span>•</span>
                                  <span>{lesson.estimatedTimeMinutes || 15} min</span>
                                  <span>•</span>
                                  <span>{lesson.content?.length || 0} pages</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-span-2">
                            <span className="text-sm text-gray-400">{lesson.xpAward || 0} XP</span>
                          </div>
                          
                          <div className="col-span-2">
                            <span className="text-sm text-gray-400">Order: {lesson.order || index + 1}</span>
                          </div>
                          
                          <div className="col-span-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => onLessonView(lesson)}
                                className="text-purple-400 hover:text-purple-300 p-1"
                                title="View Lesson"
                              >
                                <FiEye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => onLessonEdit(lesson)}
                                className="text-blue-400 hover:text-blue-300 p-1"
                                title="Edit Lesson Pages"
                              >
                                <FiEdit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => onLessonDelete(lesson)}
                                className="text-red-400 hover:text-red-300 p-1"
                                title="Delete Lesson"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500 border-l-4 border-gray-600 ml-6">
                  No lessons in this module yet
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </>
  );
};

const ModuleEditModal = ({ module, onSave, onCancel }) => {
  const [editedModule, setEditedModule] = useState({
    title: module.title || '',
    description: module.description || ''
  });

  const handleSave = () => {
    onSave(editedModule);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Edit Module</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={editedModule.title}
              onChange={(e) => setEditedModule({ ...editedModule, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={editedModule.description}
              onChange={(e) => setEditedModule({ ...editedModule, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LessonViewModal = ({ lesson, onClose, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">{lesson.title}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <FiEdit className="mr-1 h-4 w-4" />
              Edit Pages
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Type:</span>
              <span className="text-white ml-2">{lesson.lessonType}</span>
            </div>
            <div>
              <span className="text-gray-400">Duration:</span>
              <span className="text-white ml-2">{lesson.estimatedTimeMinutes} min</span>
            </div>
            <div>
              <span className="text-gray-400">XP Award:</span>
              <span className="text-white ml-2">{lesson.xpAward}</span>
            </div>
            <div>
              <span className="text-gray-400">Pages:</span>
              <span className="text-white ml-2">{lesson.content?.length || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[50vh] space-y-4">
          {lesson.content?.map((page, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Page {index + 1}: {page.type}</h4>
              </div>
              <div className="text-gray-300 text-sm">
                {page.type === 'text' && (
                  <p>{page.value?.substring(0, 200)}{page.value?.length > 200 ? '...' : ''}</p>
                )}
                {page.type === 'quiz' && (
                  <p>Quiz: {page.question}</p>
                )}
                {page.type === 'code_challenge' && (
                  <p>Code Challenge: {page.value}</p>
                )}
                {page.type === 'video' && (
                  <p>Video: {page.title}</p>
                )}
                {page.type === 'image' && (
                  <p>Image: {page.altText}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const LessonEditModal = ({ lesson, onSave, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-gray-800 rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Edit Lesson Pages: {lesson.title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white p-2"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        <div className="h-full overflow-hidden">
          <LessonPageEditor
            pages={lesson.content || []}
            onSave={onSave}
            onCancel={onCancel}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModuleManager; 