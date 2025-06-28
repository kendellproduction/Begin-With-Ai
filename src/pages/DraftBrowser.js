import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DocumentIcon,
  TrashIcon,
  ClockIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilSquareIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const DraftBrowser = () => {
  const [drafts, setDrafts] = useState([]);
  const [selectedDrafts, setSelectedDrafts] = useState(new Set());
  const [sortBy, setSortBy] = useState('updated'); // updated, created, name
  const navigate = useNavigate();

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = () => {
    try {
      const savedDrafts = JSON.parse(localStorage.getItem('lesson-drafts') || '[]');
      setDrafts(savedDrafts);
    } catch (error) {
      console.error('Error loading drafts:', error);
      setDrafts([]);
    }
  };

  const sortedDrafts = [...drafts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.created) - new Date(a.created);
      case 'updated':
      default:
        return new Date(b.created) - new Date(a.created);
    }
  });

  const handleLoadDraft = (draft) => {
    // Load draft into Enterprise Builder
    navigate('/enterprise-builder', { state: { draft } });
  };

  const handleDeleteDraft = (draftId) => {
    const draftToDelete = drafts.find(d => d.id === draftId);
    const draftName = draftToDelete ? draftToDelete.name : 'this draft';
    
    if (window.confirm(`Are you sure you want to delete "${draftName}"?`)) {
      const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
      localStorage.setItem('lesson-drafts', JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
      setSelectedDrafts(new Set());
    }
  };

  const handleDeleteSelected = () => {
    if (selectedDrafts.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedDrafts.size} draft(s)?`)) {
      const updatedDrafts = drafts.filter(draft => !selectedDrafts.has(draft.id));
      localStorage.setItem('lesson-drafts', JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
      setSelectedDrafts(new Set());
    }
  };

  const toggleSelectDraft = (draftId) => {
    const newSelected = new Set(selectedDrafts);
    if (newSelected.has(draftId)) {
      newSelected.delete(draftId);
    } else {
      newSelected.add(draftId);
    }
    setSelectedDrafts(newSelected);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString()}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString()}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const DraftCard = ({ draft, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-gray-800 rounded-lg border transition-all duration-200 ${
        selectedDrafts.has(draft.id) 
          ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
          : 'border-gray-700 hover:border-gray-600'
      }`}
    >
      <div className="p-4">
        {/* Draft Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0">
              <input
                type="checkbox"
                checked={selectedDrafts.has(draft.id)}
                onChange={() => toggleSelectDraft(draft.id)}
                className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-1 truncate">
                {draft.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {formatDate(draft.created)}
                </div>
                <div>
                  {draft.metadata.totalPages} page{draft.metadata.totalPages !== 1 ? 's' : ''}
                </div>
                <div>
                  {draft.metadata.totalBlocks} block{draft.metadata.totalBlocks !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleLoadDraft(draft)}
              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded-lg transition-colors"
              title="Open Draft"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => handleDeleteDraft(draft.id)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors"
              title="Delete Draft"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Draft Preview */}
        <div className="bg-gray-900 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-2">Page Structure:</div>
          <div className="flex flex-wrap gap-1">
            {draft.pages.map((page, pageIndex) => {
              const blockTypes = page.blocks?.map(block => block.type) || [];
              const pageTypeIcon = blockTypes.includes('quiz') ? '❓' : 
                                   blockTypes.includes('sandbox') ? '💻' : 
                                   blockTypes.includes('image') ? '🖼️' : 
                                   blockTypes.includes('video') ? '🎥' : '📝';
              
              return (
                <div
                  key={pageIndex}
                  className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded text-xs text-gray-400"
                >
                  <span>{pageTypeIcon}</span>
                  <span>Page {pageIndex + 1}</span>
                  <span className="text-gray-600">({page.blocks?.length || 0})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin-dashboard"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-white">My Drafts</h1>
                <p className="text-gray-400">
                  {drafts.length} saved draft{drafts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="updated">Sort by Last Updated</option>
                <option value="created">Sort by Created Date</option>
                <option value="name">Sort by Name</option>
              </select>

              {/* Bulk Actions */}
              {selectedDrafts.size > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Delete Selected ({selectedDrafts.size})</span>
                </button>
              )}

              {/* New Lesson Button */}
              <Link
                to="/enterprise-builder"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>New Lesson</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {drafts.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <DocumentIcon className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">No Drafts Yet</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start creating lessons and save them as drafts to come back to later. 
              Your drafts will appear here.
            </p>
            <Link
              to="/enterprise-builder"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Your First Lesson</span>
            </Link>
          </motion.div>
        ) : (
          /* Drafts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDrafts.map((draft, index) => (
              <DraftCard key={draft.id} draft={draft} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftBrowser; 