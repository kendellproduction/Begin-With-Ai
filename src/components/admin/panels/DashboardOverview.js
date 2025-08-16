import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusIcon,
  DocumentTextIcon,
  SparklesIcon,
  BookOpenIcon,
  FolderIcon,
  ClockIcon,
  EyeIcon,
  PencilSquareIcon,
  PlayIcon,
  StarIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';
import draftService from '../../../services/draftService';
import { getLearningPaths } from '../../../services/firestoreService';
import { getRealTimeDashboardAnalytics, subscribeToUserCount } from '../../../services/adminService';
// Note: Static local lesson data removed - using database only
// Note: Static adaptive lesson imports removed - using database only
import { LessonFormatMigrator } from '../../../utils/lessonFormatMigration';
import logger from '../../../utils/logger';
import LessonMigrationTool from '../LessonMigrationTool';

const DashboardOverview = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publishedLessons, setPublishedLessons] = useState([]);
  const [recentDrafts, setRecentDrafts] = useState([]);
  const [realTimeStats, setRealTimeStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    activeLessons: 0,
    completionRate: 0,
    lastUpdated: null
  });
  const [notification, setNotification] = useState(null);
  const [showMigrationTool, setShowMigrationTool] = useState(false);
  const [needsMigration, setNeedsMigration] = useState(false);

  // Function to show notifications
  const showNotification = (message, type = 'info') => {
    // You can integrate with your notification system here
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadRealTimeAnalytics(),
          loadPublishedLessons(),
          loadRecentDrafts()
        ]);
      } catch (error) {
        logger.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  const loadRealTimeAnalytics = async () => {
    try {
      const analytics = await getRealTimeDashboardAnalytics();
      setRealTimeStats({
        totalUsers: analytics.users.totalUsers,
        activeUsers: analytics.users.activeUsers,
        activeLessons: analytics.lessons.activeLessons,
        completionRate: analytics.completions.completionRate,
        lastUpdated: analytics.lastUpdated
      });
    } catch (error) {
      console.error('Error loading real-time analytics:', error);
      // Set safe defaults if loading fails
      setRealTimeStats({
        totalUsers: 0,
        activeUsers: 0,
        activeLessons: 0,
        completionRate: 0,
        lastUpdated: new Date()
      });
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Initialize lessons array
      const lessons = [];
      
      // Check if migration was manually marked as completed
      const migrationCompleted = localStorage.getItem('lessonMigrationCompleted');
      const migrationCompletedAt = localStorage.getItem('lessonMigrationCompletedAt');
      
      // If manually marked as complete within last 24 hours, don't show migration
      if (migrationCompleted && migrationCompletedAt) {
        const completedTime = new Date(migrationCompletedAt);
        const timeDiff = Date.now() - completedTime.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setNeedsMigration(false);
          console.log('Migration manually marked as completed recently, skipping migration check');
        }
      }
      
      // Check if Firestore lessons exist (more thorough check)
      let hasFirestoreLessons = false;
      let firestoreLessonCount = 0;
      
      try {
        const firestoreLessons = await getLearningPaths();
        
        // Count total lessons across all paths and modules
        firestoreLessons.forEach(path => {
          if (path.modules && Array.isArray(path.modules)) {
            path.modules.forEach(module => {
              if (module.lessons && Array.isArray(module.lessons)) {
                firestoreLessonCount += module.lessons.length;
                module.lessons.forEach(lesson => {
                  lessons.push({
                    id: lesson.id,
                    title: lesson.title || 'Firestore Lesson',
                    description: lesson.description || 'Lesson from Firestore',
                    difficulty: lesson.difficulty || 'Beginner',
                    duration: `${lesson.estimatedTimeMinutes || 15} min`,
                    category: lesson.category || path.title,
                    icon: '📚',
                    tags: lesson.tags || [],
                    type: 'published',
                    source: 'firestore',
                    pathId: path.id,
                    moduleId: module.id,
                    needsMigration: false
                  });
                });
              }
            });
          }
        });
        
        // Consider migration complete if we have at least 3 lessons in Firestore
        hasFirestoreLessons = firestoreLessonCount >= 3;
        
        console.log(`Found ${firestoreLessonCount} lessons in Firestore`);
        
        if (hasFirestoreLessons) {
          // Mark migration as completed if we found lessons
          localStorage.setItem('lessonMigrationCompleted', 'true');
          localStorage.setItem('lessonMigrationCompletedAt', new Date().toISOString());
        }
        
      } catch (firestoreError) {
        console.warn('Error checking Firestore lessons:', firestoreError);
        hasFirestoreLessons = false;
      }
      
      // Only show migration if no Firestore lessons AND not manually marked complete
      const shouldShowMigration = !hasFirestoreLessons && !migrationCompleted;
      setNeedsMigration(shouldShowMigration);
      
      console.log('Migration status:', {
        hasFirestoreLessons,
        firestoreLessonCount,
        migrationCompleted,
        shouldShowMigration
      });

      // Note: Static lesson data removed - admin panel should only show database lessons

      // Note: Static adaptive lessons removed - admin panel should only show database lessons

      setPublishedLessons(lessons);
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
      // Set empty arrays as fallback
      setPublishedLessons([]);
    }
  };

  // Load recent drafts
  const loadRecentDrafts = async () => {
    try {
      if (!currentUser?.uid) {
        setRecentDrafts([]);
        return;
      }

      console.log('Loading drafts for user:', currentUser.uid);
      const drafts = await draftService.loadDrafts(currentUser.uid);
      console.log('Loaded drafts:', drafts);
      
      // Sort by lastModified and take the 5 most recent
      const sortedDrafts = drafts
        .filter(draft => draft.status === 'draft') // Only show actual drafts
        .sort((a, b) => {
          const dateA = new Date(b.lastModified || b.createdAt || 0);
          const dateB = new Date(a.lastModified || a.createdAt || 0);
          return dateA - dateB;
        })
        .slice(0, 5);

      setRecentDrafts(sortedDrafts);
      console.log('Set recent drafts:', sortedDrafts);
      
    } catch (error) {
      logger.error('Error loading recent drafts:', error);
      setRecentDrafts([]);
    }
  };

  const loadPublishedLessons = async () => {
    try {
      // Get all learning paths which contain published lessons
      const firestoreLessons = await getLearningPaths();
      
      const allLessons = [];
      
      // Extract lessons from all paths and modules
      firestoreLessons.forEach(path => {
        if (path.modules && Array.isArray(path.modules)) {
          path.modules.forEach(module => {
            if (module.lessons && Array.isArray(module.lessons)) {
              // FIXED: Only show published lessons in admin dashboard
              const publishedLessons = module.lessons
                .filter(lesson => {
                  return lesson.status === 'published' || lesson.published === true || lesson.isPublished === true;
                })
                .map(lesson => ({
                  ...lesson,
                  moduleTitle: module.title,
                  pathTitle: path.title,
                  pathId: path.id,
                  moduleId: module.id,
                  category: path.category || lesson.category || 'General'
                }));
              
              allLessons.push(...publishedLessons);
            }
          });
        }
      });

      // Remove duplicates based on ID
      const uniqueLessons = allLessons.filter((lesson, index, self) => 
        index === self.findIndex(l => l.id === lesson.id)
      );

      setPublishedLessons(uniqueLessons);
      console.log('Loaded published lessons:', uniqueLessons.length);
      
    } catch (error) {
      logger.error('Error loading published lessons:', error);
      setPublishedLessons([]);
    }
  };

  const handleEditLesson = (lesson) => {
    logger.log('Editing lesson:', lesson);
    
    // All lessons have been migrated, so always migrate before editing
    logger.log('Migrating lesson before editing:', lesson.format);
    
    // Migrate the lesson to the new format
    const migratedLesson = LessonFormatMigrator.migrateLesson(lesson.originalLesson, lesson.format);
    
    // For lessons from admin dashboard, we need to set default path and module info
    // since static lessons don't have this information
    const editingLessonData = {
      ...migratedLesson,
      // Ensure we have path and module info for saving
      pathId: migratedLesson.pathId || 'ai-fundamentals', // Default learning path
      moduleId: migratedLesson.moduleId || 'intro-to-ai', // Default module
      isDraft: false,
      isPublished: true,
      wasMigrated: true,
      originalFormat: lesson.format,
      // Add additional metadata for debugging
      source: lesson.source,
      originalLesson: lesson.originalLesson
    };
    
    console.log('=== Dashboard Edit Lesson Debug ===');
    console.log('Original lesson:', lesson);
    console.log('Migrated lesson:', migratedLesson);
    console.log('Final editing data:', editingLessonData);
    console.log('Has required fields:', {
      pathId: !!editingLessonData.pathId,
      moduleId: !!editingLessonData.moduleId,
      id: !!editingLessonData.id
    });
    console.log('===================================');
    
    // Navigate to the lesson builder with migrated data
    navigate('/unified-lesson-builder', { 
      state: { 
        editingLesson: editingLessonData,
        fromAdmin: true
      } 
    });
  };

  const handlePreviewLesson = (lesson) => {
    logger.log('Previewing lesson:', lesson);
    
    // FIXED: Proper preview functionality that passes lesson data
    if (lesson.id && lesson.pathId && lesson.moduleId) {
      // For lessons from database (published lessons), open with full context
      const previewUrl = `/lessons/${lesson.id}?preview=true`;
      const previewWindow = window.open(previewUrl, '_blank');
      
      // Pass lesson data through localStorage for immediate access
      localStorage.setItem(`lesson_preview_${lesson.id}`, JSON.stringify({
        ...lesson,
        isPreview: true,
        previewedAt: new Date().toISOString()
      }));
      
      // Clean up preview data after 5 minutes
      setTimeout(() => {
        localStorage.removeItem(`lesson_preview_${lesson.id}`);
      }, 5 * 60 * 1000);
      
    } else if (lesson.source === 'local' || lesson.format) {
      // For migrated lessons or local lessons, pass through lesson builder preview
      const lessonData = lesson.originalLesson || lesson;
      
      // Open lesson builder in preview mode
      window.open('/unified-lesson-builder', '_blank');
      
      // Pass lesson data for preview
      setTimeout(() => {
        const previewWindow = window.open('/unified-lesson-builder', '_blank');
        if (previewWindow) {
          previewWindow.postMessage({
            type: 'PREVIEW_LESSON',
            lesson: lessonData,
            isPreview: true
          }, window.location.origin);
        }
      }, 1000);
      
    } else {
      // Fallback: Try to open with ModernLessonViewer
      const previewUrl = `/lesson-viewer/${lesson.id}?preview=true`;
      window.open(previewUrl, '_blank');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const QuickStatsCard = ({ title, value, icon: Icon, subtitle }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <Icon className="w-8 h-8 text-blue-400" />
      </div>
    </div>
  );

  const LessonCard = ({ lesson }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-gray-600 hover:shadow-lg transition-all duration-300 group overflow-hidden relative"
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-800/20 group-hover:to-gray-700/30 transition-all duration-300" />
      
      {/* Lesson Header */}
      <div className="relative p-6">
        {/* Header with icon and status badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="text-3xl filter drop-shadow-lg">{lesson.icon}</div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-200 transition-colors leading-tight">
                {lesson.title}
              </h3>
              {lesson.needsMigration && (
                <div className="flex items-center space-x-1 text-xs text-amber-400 mt-1">
                  <ExclamationTriangleIcon className="w-3 h-3" />
                  <span>Needs migration from {lesson.format}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Status Badge - always visible */}
          <div className="flex-shrink-0 ml-3 flex flex-col space-y-1">
            <span className="inline-flex items-center px-2 py-1 bg-green-600 text-green-100 text-xs font-bold rounded-full shadow-lg whitespace-nowrap">
              ✓ Pub
            </span>
            {lesson.needsMigration && (
              <span className="inline-flex items-center px-2 py-1 bg-amber-600 text-amber-100 text-xs font-bold rounded-full shadow-lg whitespace-nowrap">
                <WrenchScrewdriverIcon className="w-3 h-3 mr-1" />
                Migrate
              </span>
            )}
          </div>
        </div>

        {/* Lesson metadata */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
          <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium">
            {lesson.difficulty}
          </span>
          <span className="text-gray-500">•</span>
          <span className="font-medium">{lesson.duration}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-300 truncate">{lesson.category}</span>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
          {lesson.description}
        </p>

        {/* Tags */}
        {lesson.tags && lesson.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {lesson.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50 hover:bg-gray-600/50 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {lesson.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-700/30 text-gray-400 text-xs rounded-full">
                +{lesson.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handlePreviewLesson(lesson)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
          >
            <PlayIcon className="w-4 h-4" />
            <span>Preview</span>
          </button>
          
          <button
            onClick={() => handleEditLesson(lesson)}
            className={`flex items-center space-x-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg ${
              lesson.needsMigration 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {lesson.needsMigration ? (
              <>
                <WrenchScrewdriverIcon className="w-4 h-4" />
                <span>Migrate & Edit</span>
              </>
            ) : (
              <>
                <PencilSquareIcon className="w-4 h-4" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="text-center">
          <div className="bg-red-900 bg-opacity-50 rounded-lg p-6">
            <p className="text-red-400 mb-2">Error loading dashboard</p>
            <p className="text-gray-400 text-sm">{error}</p>
            <button 
              onClick={loadDashboardData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Lesson Management Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          Manage your {publishedLessons.length} published lessons and create new content
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStatsCard 
          title="Total Users" 
          value={realTimeStats.totalUsers?.toLocaleString() || '0'} 
          icon={UsersIcon} 
          subtitle={realTimeStats.lastUpdated ? `Updated: ${realTimeStats.lastUpdated.toLocaleTimeString()}` : 'Loading...'} 
        />
        <QuickStatsCard 
          title="Published Lessons" 
          value={publishedLessons.length} 
          icon={BookOpenIcon} 
          subtitle="Ready for students"
        />
        <QuickStatsCard 
          title="Draft Lessons" 
          value={recentDrafts.length} 
          icon={DocumentTextIcon} 
          subtitle="Work in progress"
        />
        <QuickStatsCard 
          title="Active Users" 
          value={realTimeStats.activeUsers?.toLocaleString() || '0'} 
          icon={StarIcon} 
          subtitle="Active in past week"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/unified-lesson-builder"
            className="flex items-center space-x-3 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <PlusIcon className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-semibold text-white">Create New Lesson</h3>
              <p className="text-blue-100 text-sm">Build with visual editor</p>
            </div>
          </Link>
          
          <button className="flex items-center space-x-3 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
            <SparklesIcon className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-semibold text-white">AI Generate Lesson</h3>
              <p className="text-purple-100 text-sm">Let AI help you create</p>
            </div>
          </button>
          
          <Link
            to="/admin-unified?panel=content-management"
            className="flex items-center space-x-3 p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <FolderIcon className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-semibold text-white">Manage Content</h3>
              <p className="text-green-100 text-sm">Organize lessons & paths</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Migration Tool Alert - Only show when migration is needed */}
      {needsMigration && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-500/20 p-3 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Lesson System Setup Required
                  </h3>
                  <p className="text-yellow-200 text-sm">
                    No lessons found in Firestore. Run migration to create editable lessons from static content.
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowMigrationTool(!showMigrationTool)}
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {showMigrationTool ? 'Hide Migration Tool' : 'Setup Lessons'}
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('lessonMigrationCompleted', 'true');
                    localStorage.setItem('lessonMigrationCompletedAt', new Date().toISOString());
                    setNeedsMigration(false);
                    showNotification('Migration tool hidden. You can manually manage lessons in the admin panel.', 'info');
                  }}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-sm"
                  title="Skip migration and hide this tool"
                >
                  Skip & Hide
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Migration Tool Section */}
      {needsMigration && showMigrationTool && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6"
        >
          <LessonMigrationTool onShowNotification={showNotification} />
        </motion.div>
      )}

      {/* Published Lessons */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Published Lessons</h2>
            <p className="text-gray-400 mt-1">Manage and preview your live content</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 bg-gray-800 px-3 py-1 rounded-full text-sm">
              {publishedLessons.length} lessons
            </span>
            <Link
              to="/unified-lesson-builder"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Lesson</span>
            </Link>
          </div>
        </div>
        
        {publishedLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {publishedLessons.map((lesson, index) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
            <div className="relative z-10">
              <BookOpenIcon className="w-20 h-20 mx-auto text-gray-600 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Ready to Create Something Amazing?</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Start building interactive lessons that will help students learn AI concepts through hands-on projects
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Link
                  to="/unified-lesson-builder"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Create Your First Lesson</span>
                </Link>
                <button className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                  <SparklesIcon className="w-5 h-5" />
                  <span>Use AI Generator</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Drafts */}
      {recentDrafts.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Recent Drafts
            </h3>
            <Link 
              to="/admin-unified?panel=content-management" 
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentDrafts.map((draft) => (
              <div key={draft.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{draft.title || 'Untitled Lesson'}</h4>
                    <p className="text-sm text-gray-400">Last modified {formatDate(draft.lastModified)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate('/unified-lesson-builder', { state: { draft } })}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug User Status - Show for admin testing */}
      {currentUser && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Debug: User Status</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <p>User ID: {currentUser.uid}</p>
            <p>Subscription Tier: {currentUser.subscriptionTier || 'free'}</p>
            <p>Is Premium: {currentUser.isPremium ? 'Yes' : 'No'}</p>
            <p>Should See Premium Content: {(currentUser.subscriptionTier === 'premium' || currentUser.isPremium) ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview; 