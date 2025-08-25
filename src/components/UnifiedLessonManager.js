import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  DocumentTextIcon,
  PlusIcon,
  PencilSquareIcon,
  EyeIcon,
  TrashIcon,
  ClockIcon,
  BookOpenIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import draftService from '../services/draftService';
import { getAllLearningPaths, deleteLesson } from '../services/adminService';

const UnifiedLessonManager = ({ 
  compact = false, 
  showHeader = true, 
  maxItems = null,
  showCreateButton = true 
}) => {
  const [drafts, setDrafts] = useState([]);
  const [publishedLessons, setPublishedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'drafts', 'published'
  const [sortBy, setSortBy] = useState('updated'); // 'updated', 'created', 'title'
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Initialize view mode from query param if provided
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    if (view === 'published' || view === 'drafts' || view === 'all') {
      setViewMode(view);
    }
    loadContent();
  }, [user, location.search]);

  const loadContent = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Load drafts from Firestore
      const [userDrafts, learningPaths] = await Promise.all([
        draftService.loadDrafts(user.uid),
        getAllLearningPaths()
      ]);
      
      setDrafts(userDrafts);
      
      // Extract all published lessons from learning paths
      const allLessons = [];
      learningPaths.forEach(path => {
        path.modules?.forEach(module => {
          module.lessons?.forEach(lesson => {
            // Only include published lessons
            const isPublished = lesson.status === 'published' || lesson.published === true || lesson.isPublished === true;
            if (isPublished) {
              allLessons.push({
                ...lesson,
                pathId: path.id,
                pathTitle: path.title,
                moduleId: module.id,
                moduleTitle: module.title,
                type: 'published'
              });
            }
          });
        });
      });
      
      setPublishedLessons(allLessons);
      
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine and filter content
  const allContent = [
    ...drafts.map(draft => ({ ...draft, type: 'draft' })),
    ...publishedLessons
  ];

  const filteredContent = allContent.filter(item => {
    // Filter by view mode
    if (viewMode === 'drafts' && item.type !== 'draft') return false;
    if (viewMode === 'published' && item.type !== 'published') return false;
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const title = (item.title || '').toLowerCase();
      const description = (item.description || '').toLowerCase();
      return title.includes(searchLower) || description.includes(searchLower);
    }
    
    return true;
  });

  // Sort content
  const sortedContent = [...filteredContent].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'created':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'updated':
      default:
        return new Date(b.lastModified || b.updatedAt || 0) - new Date(a.lastModified || a.updatedAt || 0);
    }
  });

  // Apply max items limit if specified
  const displayedContent = maxItems ? sortedContent.slice(0, maxItems) : sortedContent;

  const handleEditContent = (item) => {
    if (item.type === 'draft') {
      // Edit draft in lesson builder
      navigate('/unified-lesson-builder', { state: { draft: item } });
    } else {
      // Edit published lesson - navigate to lesson editor with lesson data
      navigate('/unified-lesson-builder', { 
        state: { 
          editingLesson: {
            ...item,
            isDraft: false,
            isPublished: true
          }
        } 
      });
    }
  };

  const handleViewContent = (item) => {
    if (item.type === 'draft') {
      // Preview draft
      navigate('/unified-lesson-builder', { state: { draft: item, previewMode: true } });
    } else {
      // View published lesson
      window.open(`/lesson-viewer/${item.id}`, '_blank');
    }
  };

  const handleDeleteContent = async (item) => {
    const confirmMessage = item.type === 'draft' 
      ? `Are you sure you want to delete the draft "${item.title}"?`
      : `Are you sure you want to delete the published lesson "${item.title}"? This action cannot be undone.`;
      
    if (window.confirm(confirmMessage)) {
      try {
        if (item.type === 'draft') {
          await draftService.deleteDraft(user.uid, item.id);
          setDrafts(drafts.filter(d => d.id !== item.id));
        } else {
          // Delete published lesson from Firestore
          await deleteLesson(item.pathId, item.moduleId, item.id, user.uid);
          setPublishedLessons(publishedLessons.filter(p => p.id !== item.id));
        }
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete content. Please try again.');
      }
    }
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

  const getContentStats = () => {
    const draftCount = allContent.filter(item => item.type === 'draft').length;
    const publishedCount = allContent.filter(item => item.type === 'published').length;
    return { draftCount, publishedCount, totalCount: allContent.length };
  };

  const stats = getContentStats();

  const ContentCard = ({ item, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 group"
    >
      <div className="p-4">
        {/* Content Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-white truncate">
                {item.title || 'Untitled'}
              </h3>
              
              {/* Status Badges */}
              {item.type === 'draft' ? (
                <span className="px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded-full">
                  Draft
                </span>
              ) : (
                <span className="px-2 py-1 bg-green-600 text-green-100 text-xs rounded-full">
                  Published
                </span>
              )}
              
              {item.isLocalOnly && (
                <span className="px-2 py-1 bg-amber-600 text-amber-100 text-xs rounded-full" title="Local only">
                  Local
                </span>
              )}
            </div>
            
            {/* Content Details */}
            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                {formatDate(item.lastModified || item.updatedAt || item.createdAt)}
              </div>
              
              {item.type === 'published' && (
                <div className="flex items-center space-x-2">
                  <span>📚 {item.pathTitle}</span>
                  <span>📁 {item.moduleTitle}</span>
                </div>
              )}
            </div>
            
            {/* Description */}
            {item.description && (
              <p className="text-gray-400 text-sm truncate">{item.description}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEditContent(item)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              title="Edit content"
            >
              <PencilSquareIcon className="w-4 h-4" />
              <span>Edit</span>
            </button>
            
            <button
              onClick={() => handleViewContent(item)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
              title="View content"
            >
              <EyeIcon className="w-4 h-4" />
              <span>View</span>
            </button>
          </div>
          
          <button
            onClick={() => handleDeleteContent(item)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete content"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-400">Loading your content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'space-y-4' : 'space-y-6'}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-white`}>
              My Content
            </h2>
            <p className="text-gray-400">
              {stats.totalCount} total ({stats.draftCount} drafts, {stats.publishedCount} published)
            </p>
          </div>
          
          {showCreateButton && (
            <Link
              to="/unified-lesson-builder"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Lesson</span>
            </Link>
          )}
        </div>
      )}

      {/* Filters and Search */}
      {!compact && (
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons and drafts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* View Mode Filter */}
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Content</option>
            <option value="drafts">Drafts Only</option>
            <option value="published">Published Only</option>
          </select>
          
          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="updated">Last Updated</option>
            <option value="created">Date Created</option>
            <option value="title">Title</option>
          </select>
        </div>
      )}

      {/* Content Grid */}
      {displayedContent.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700"
        >
          <DocumentTextIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {searchTerm ? 'No matching content found' : 'No content yet'}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms or filters.'
              : 'Start creating lessons to see them here.'
            }
          </p>
          {showCreateButton && !searchTerm && (
            <Link
              to="/unified-lesson-builder"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Your First Lesson</span>
            </Link>
          )}
        </motion.div>
      ) : (
        <div className={`grid gap-4 ${
          compact 
            ? 'grid-cols-1' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {displayedContent.map((item, index) => (
            <ContentCard key={`${item.type}-${item.id}`} item={item} index={index} />
          ))}
        </div>
      )}

      {/* Show more link for compact mode */}
      {compact && maxItems && sortedContent.length > maxItems && (
        <div className="text-center">
          <Link
            to="/drafts"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            View all {sortedContent.length} items →
          </Link>
        </div>
      )}
    </div>
  );
};

export default UnifiedLessonManager; 