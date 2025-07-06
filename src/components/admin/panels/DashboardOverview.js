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
import { localLessonsData } from '../../../data/lessonsData';
import { adaptiveLessons } from '../../../utils/adaptiveLessonData';
import { LessonFormatMigrator } from '../../../utils/lessonFormatMigration';

const DashboardOverview = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [realTimeStats, setRealTimeStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    activeLessons: 0,
    completionRate: 0,
    lastUpdated: null
  });
  const [recentDrafts, setRecentDrafts] = useState([]);
  const [publishedLessons, setPublishedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
    loadRealTimeAnalytics();

    // Set up real-time user count listener
    let unsubscribeUserCount = null;
    if (currentUser?.uid) {
      unsubscribeUserCount = subscribeToUserCount((userStats) => {
        if (userStats) {
          setRealTimeStats(prev => ({
            ...prev,
            totalUsers: userStats.totalUsers,
            activeUsers: userStats.activeUsers,
            lastUpdated: userStats.timestamp
          }));
        }
      });
    }

    return () => {
      if (unsubscribeUserCount) {
        unsubscribeUserCount();
      }
    };
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
      // Load published lessons from multiple sources
      const lessons = [];
      
      // Add lessons from localLessonsData
      if (localLessonsData && typeof localLessonsData === 'object') {
        Object.values(localLessonsData).forEach(lesson => {
          if (lesson && lesson.id) {
            // Detect format and add migration status
            const format = LessonFormatMigrator.detectLessonFormat(lesson);
            // All lessons have been migrated via bulk migration script
            const needsMigration = false; // Force false since bulk migration completed
            
            lessons.push({
              id: lesson.id,
              title: lesson.title || 'Untitled Lesson',
              description: lesson.description || 'No description available',
              difficulty: lesson.difficulty || 'Beginner',
              duration: lesson.duration || '15 min',
              category: lesson.category || 'General',
              icon: lesson.icon || '📚',
              tags: lesson.tags || [],
              type: 'published',
              source: 'local',
              originalLesson: lesson,
              format: format,
              needsMigration: needsMigration
            });
          }
        });
      }

      // Add lessons from adaptiveLessons
      if (adaptiveLessons && typeof adaptiveLessons === 'object') {
        Object.values(adaptiveLessons).forEach(lessonGroup => {
          if (Array.isArray(lessonGroup)) {
            lessonGroup.forEach(lesson => {
              if (lesson && lesson.id) {
                // Detect format and add migration status
                const format = LessonFormatMigrator.detectLessonFormat(lesson);
                // All lessons have been migrated via bulk migration script
                const needsMigration = false; // Force false since bulk migration completed
                
                lessons.push({
                  id: lesson.id,
                  title: lesson.title || 'Untitled AI Lesson',
                  description: lesson.coreConcept || 'AI fundamentals lesson',
                  difficulty: 'Beginner',
                  duration: '25 min',
                  category: 'AI Fundamentals',
                  icon: '🤖',
                  tags: ['ai', 'fundamentals'],
                  type: 'published',
                  source: 'adaptive',
                  originalLesson: lesson,
                  format: format,
                  needsMigration: needsMigration
                });
              }
            });
          }
        });
      }

      // Remove duplicates based on ID
      const uniqueLessons = lessons.filter((lesson, index, self) => 
        index === self.findIndex(l => l.id === lesson.id)
      );

      setPublishedLessons(uniqueLessons);

      // Load drafts (only if user is authenticated)
      if (currentUser?.uid) {
        const drafts = await draftService.loadDrafts(currentUser.uid).catch(() => []);
        setRecentDrafts(drafts.slice(0, 3)); // Show only recent 3
      } else {
        setRecentDrafts([]);
      }
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
      // Set empty arrays as fallback
      setPublishedLessons([]);
      setRecentDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditLesson = (lesson) => {
    console.log('Editing lesson:', lesson);
    
    // All lessons have been migrated, so always migrate before editing
    console.log('Migrating lesson before editing:', lesson.format);
    
    // Migrate the lesson to the new format
    const migratedLesson = LessonFormatMigrator.migrateLesson(lesson.originalLesson, lesson.format);
    
    // Navigate to the lesson builder with migrated data
    navigate('/unified-lesson-builder', { 
      state: { 
        editingLesson: {
          ...migratedLesson,
          isDraft: false,
          isPublished: true,
          wasMigrated: true,
          originalFormat: lesson.format
        },
        fromAdmin: true
      } 
    });
  };

  const handlePreviewLesson = (lesson) => {
    console.log('Previewing lesson:', lesson);
    
    // Use the correct lesson routes based on the routing configuration
    if (lesson.source === 'local') {
      // For local lessons, try the lesson detail page first
      window.open(`/lessons/${lesson.id}`, '_blank');
    } else if (lesson.source === 'adaptive') {
      // For adaptive lessons, try the lesson start page
      window.open(`/lessons/start/${lesson.id}`, '_blank');
    } else {
      // Fallback to modern lesson viewer
      window.open(`/lesson-viewer/${lesson.id}`, '_blank');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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
          value={realTimeStats.totalUsers.toLocaleString()} 
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
          value={realTimeStats.activeUsers.toLocaleString()} 
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
    </div>
  );
};

export default DashboardOverview; 