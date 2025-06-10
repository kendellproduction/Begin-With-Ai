import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEdit, 
  FiTrash2, 
  FiClock, 
  FiFileText,
  FiRefreshCw
} from 'react-icons/fi';
import { 
  getDraftsIndex, 
  getLessonDraft, 
  deleteLessonDraft 
} from '../../utils/localStorage';

const DraftManager = ({ onEditDraft, onShowNotification }) => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDrafts = () => {
    try {
      const draftsIndex = getDraftsIndex();
      setDrafts(draftsIndex.sort((a, b) => new Date(b.lastSaved) - new Date(a.lastSaved)));
    } catch (error) {
      console.error('Error loading drafts:', error);
      onShowNotification?.('error', 'Error loading drafts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handleEditDraft = (draft) => {
    const draftData = getLessonDraft(draft.id);
    if (draftData) {
      onEditDraft({
        type: 'lesson',
        item: null, // No existing lesson, this is a draft
        pathId: draftData.pathId,
        moduleId: draftData.moduleId,
        draftId: draft.id
      });
    }
  };

  const handleDeleteDraft = (draftId) => {
    if (window.confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      try {
        deleteLessonDraft(draftId);
        loadDrafts();
        onShowNotification?.('success', 'Draft deleted successfully');
      } catch (error) {
        console.error('Error deleting draft:', error);
        onShowNotification?.('error', 'Error deleting draft');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Lesson Drafts</h3>
        <button
          onClick={loadDrafts}
          className="flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
        >
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>

      {drafts.length === 0 ? (
        <div className="text-center py-12">
          <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No drafts found</h3>
          <p className="text-gray-400">
            Start creating a lesson to see auto-saved drafts here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drafts.map((draft) => (
            <motion.div
              key={draft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-medium text-white truncate">
                    {draft.title || 'Untitled Lesson'}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Path: {draft.pathId} • Module: {draft.moduleId}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-400 mb-4">
                <FiClock className="mr-1 h-3 w-3" />
                <span>Last saved {formatDate(draft.lastSaved)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditDraft(draft)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                >
                  <FiEdit className="mr-1 h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDraft(draft.id)}
                  className="flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  <FiTrash2 className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraftManager; 