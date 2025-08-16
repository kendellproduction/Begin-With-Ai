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
  PlusIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import OptimizedStarField from '../components/OptimizedStarField';
import { useAuth } from '../contexts/AuthContext';
import draftService from '../services/draftService';

const DraftBrowser = () => {
  const [drafts, setDrafts] = useState([]);
  const [selectedDrafts, setSelectedDrafts] = useState(new Set());
  const [sortBy, setSortBy] = useState('updated'); // updated, created, name
  const [loading, setLoading] = useState(true);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadDrafts();
  }, [user]);

  const loadDrafts = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // First, check for and migrate any old localStorage drafts
      await migrateLocalStorageDrafts();
      
      // Load drafts from Firestore
      const firestoreDrafts = await draftService.loadDrafts(user.uid);
      setDrafts(firestoreDrafts);
      
    } catch (error) {
      console.error('Error loading drafts:', error);
      // Fallback to localStorage if Firestore fails
      loadLocalStorageDrafts();
    } finally {
      setLoading(false);
    }
  };

  const migrateLocalStorageDrafts = async () => {
    try {
      const localDrafts = JSON.parse(localStorage.getItem('lesson-drafts') || '[]');
      
      if (localDrafts.length > 0) {
        setMigrationStatus(`Migrating ${localDrafts.length} local drafts to cloud...`);
        
        for (const localDraft of localDrafts) {
          // Convert localStorage format to Firestore format
          const firestoreDraft = {
            title: localDraft.name || 'Untitled Lesson',
            contentVersions: {
              free: {
                title: localDraft.name || 'Untitled Lesson',
                description: localDraft.description || '',
                pages: localDraft.pages || []
              },
              premium: null
            },
            metadata: {
              lessonType: localDraft.metadata?.lessonType || 'concept_explanation',
              estimatedTimeMinutes: localDraft.metadata?.estimatedTimeMinutes || 15,
              xpAward: localDraft.metadata?.xpAward || 10,
              category: localDraft.metadata?.category || 'General',
              tags: localDraft.metadata?.tags || [],
              totalPages: localDraft.metadata?.totalPages || localDraft.pages?.length || 0,
              totalBlocks: localDraft.metadata?.totalBlocks || 0
            },
            createdAt: localDraft.created || new Date().toISOString(),
            version: 1
          };
          
          // Save to Firestore
          await draftService.saveDraft(user.uid, firestoreDraft);
        }
        
        // Clear localStorage after successful migration
        localStorage.removeItem('lesson-drafts');
        setMigrationStatus(`✅ Successfully migrated ${localDrafts.length} drafts to cloud!`);
        
        // Clear migration status after 3 seconds
        setTimeout(() => setMigrationStatus(null), 3000);
      }
    } catch (error) {
      console.error('Error migrating localStorage drafts:', error);
      setMigrationStatus('❌ Migration failed. Your local drafts are still safe.');
    }
  };

  const loadLocalStorageDrafts = () => {
    try {
      const savedDrafts = JSON.parse(localStorage.getItem('lesson-drafts') || '[]');
      // Convert localStorage format to match Firestore format for consistency
      const convertedDrafts = savedDrafts.map(draft => ({
        id: draft.id,
        title: draft.name,
        lastModified: draft.created,
        createdAt: draft.created,
        contentVersions: {
          free: {
            pages: draft.pages || []
          }
        },
        metadata: draft.metadata || {},
        status: 'draft',
        isLocalOnly: true // Flag to indicate this is a local draft
      }));
      setDrafts(convertedDrafts);
    } catch (error) {
      console.error('Error loading localStorage drafts:', error);
      setDrafts([]);
    }
  };

  const sortedDrafts = [...drafts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.title || '').localeCompare(b.title || '');
      case 'created':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'updated':
      default:
        return new Date(b.lastModified || 0) - new Date(a.lastModified || 0);
    }
  });

  const handleLoadDraft = (draft) => {
    // Load draft into Unified Lesson Builder
    navigate('/unified-lesson-builder', { state: { draft } });
  };

  const handleDeleteDraft = async (draftId) => {
    const draftToDelete = drafts.find(d => d.id === draftId);
    const draftName = draftToDelete ? draftToDelete.title : 'this draft';
    
    if (window.confirm(`Are you sure you want to delete "${draftName}"?`)) {
      try {
        if (draftToDelete.isLocalOnly) {
          // Delete from localStorage
          const savedDrafts = JSON.parse(localStorage.getItem('lesson-drafts') || '[]');
          const updatedDrafts = savedDrafts.filter(draft => draft.id !== draftId);
          localStorage.setItem('lesson-drafts', JSON.stringify(updatedDrafts));
        } else {
          // Delete from Firestore
          await draftService.deleteDraft(user.uid, draftId);
        }
        
        // Update local state
        setDrafts(drafts.filter(draft => draft.id !== draftId));
        setSelectedDrafts(new Set());
        
      } catch (error) {
        console.error('Error deleting draft:', error);
        alert('Failed to delete draft. Please try again.');
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedDrafts.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedDrafts.size} draft(s)?`)) {
      try {
        for (const draftId of selectedDrafts) {
          const draft = drafts.find(d => d.id === draftId);
          if (draft) {
            if (draft.isLocalOnly) {
              // Delete from localStorage
              const savedDrafts = JSON.parse(localStorage.getItem('lesson-drafts') || '[]');
              const updatedDrafts = savedDrafts.filter(d => d.id !== draftId);
              localStorage.setItem('lesson-drafts', JSON.stringify(updatedDrafts));
            } else {
              // Delete from Firestore
              await draftService.deleteDraft(user.uid, draftId);
            }
          }
        }
        
        // Update local state
        setDrafts(drafts.filter(draft => !selectedDrafts.has(draft.id)));
        setSelectedDrafts(new Set());
        
      } catch (error) {
        console.error('Error deleting selected drafts:', error);
        alert('Failed to delete some drafts. Please try again.');
      }
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
    if (!dateString) return 'Unknown';
    
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

  const getPageCount = (draft) => {
    if (draft.contentVersions?.free?.pages) {
      return draft.contentVersions.free.pages.length;
    }
    if (draft.pages) {
      return draft.pages.length;
    }
    return draft.metadata?.totalPages || 0;
  };

  const getBlockCount = (draft) => {
    if (draft.contentVersions?.free?.pages) {
      return draft.contentVersions.free.pages.reduce((total, page) => total + (page.blocks?.length || 0), 0);
    }
    if (draft.pages) {
      return draft.pages.reduce((total, page) => total + (page.blocks?.length || 0), 0);
    }
    return draft.metadata?.totalBlocks || 0;
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
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-white truncate">
                  {draft.title}
                </h3>
                {draft.isLocalOnly && (
                  <span className="px-2 py-1 bg-amber-600 text-amber-100 text-xs rounded-full" title="Local draft - not synced to cloud">
                    Local
                  </span>
                )}
                {draft.status === 'published' && (
                  <span className="px-2 py-1 bg-green-600 text-green-100 text-xs rounded-full">
                    Published
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {formatDate(draft.lastModified || draft.createdAt)}
                </div>
                <div>
                  {getPageCount(draft)} page{getPageCount(draft) !== 1 ? 's' : ''}
                </div>
                <div>
                  {getBlockCount(draft)} block{getBlockCount(draft) !== 1 ? 's' : ''}
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
          <div className="text-xs text-gray-500 mb-2">Content Preview:</div>
          <div className="flex flex-wrap gap-1">
            {draft.contentVersions?.free?.pages?.map((page, pageIndex) => {
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
            }) || (
              <div className="text-xs text-gray-500">No content preview available</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{ backgroundColor: '#3b82f6' }}>
        <OptimizedStarField starCount={220} opacity={0.8} speed={1} size={1.2} />
        <div className="text-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading your drafts...</p>
          {migrationStatus && (
            <p className="text-yellow-200 mt-2">{migrationStatus}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#3b82f6' }}>
      {/* Optimized Star Field */}
      <OptimizedStarField starCount={220} opacity={0.8} speed={1} size={1.2} />

      {/* Migration Status */}
      {migrationStatus && (
        <div className="bg-yellow-800 border-b border-yellow-700 relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center space-x-2">
              <CloudArrowUpIcon className="w-5 h-5 text-yellow-200" />
              <span className="text-yellow-100">{migrationStatus}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Admin</span>
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
                to="/unified-lesson-builder"
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
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
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
              Your drafts will appear here and sync across all your devices.
            </p>
            <Link
              to="/unified-lesson-builder"
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