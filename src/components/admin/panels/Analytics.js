import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  UsersIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';
import draftService from '../../../services/draftService';
import { getLearningPaths } from '../../../services/firestoreService';

const Analytics = () => {
  const { currentUser } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalStudents: 0,
      activeStudents: 0,
      completedLessons: 0,
      totalLessons: 0,
      avgCompletionTime: 'N/A',
      engagementRate: 0
    },
    trends: {
      studentGrowth: 0,
      lessonCompletions: 0,
      engagement: 0,
      retention: 0
    }
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [currentUser, timeRange]);

  const loadAnalyticsData = async () => {
    if (!currentUser?.uid) return;
    
    setLoading(true);
    try {
      // Load real data from services
      const [drafts, learningPaths] = await Promise.all([
        draftService.loadDrafts(currentUser.uid).catch(() => []),
        getLearningPaths().catch(() => [])
      ]);

      // Calculate real statistics
      const totalLessons = learningPaths.reduce((acc, path) => 
        acc + (path.modules?.reduce((modAcc, mod) => modAcc + (mod.lessons?.length || 0), 0) || 0), 0
      );

      const totalModules = learningPaths.reduce((acc, path) => acc + (path.modules?.length || 0), 0);

      setAnalyticsData({
        overview: {
          totalStudents: 0, // This would come from user analytics when implemented
          activeStudents: 0, // This would come from user analytics when implemented
          completedLessons: 0, // This would come from completion analytics when implemented
          totalLessons,
          avgCompletionTime: 'N/A',
          engagementRate: 0
        },
        trends: {
          studentGrowth: 0,
          lessonCompletions: 0,
          engagement: 0,
          retention: 0
        }
      });

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-sm">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400'}`}>
              {trend > 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
              ) : trend < 0 ? (
                <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
              ) : null}
              <span>{trend > 0 ? '+' : ''}{trend}% vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const ChartPlaceholder = ({ title, height = "h-64" }) => (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 p-6 ${height}`}>
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ChartBarIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400">Chart visualization would go here</p>
          <p className="text-sm text-gray-500 mt-1">Integration with charting library needed</p>
        </div>
      </div>
    </div>
  );

  const StudentProgress = () => {
    const students = [
      { 
        id: 1, 
        name: 'Current User', 
        email: 'user@example.com',
        progress: 75,
        lastActivity: '2 hours ago',
        completedLessons: 23,
        totalLessons: 47
      }
    ];

    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Student Progress</h3>
        <div className="space-y-4">
          {students.map((student) => (
            <div key={student.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{student.name}</h4>
                <p className="text-sm text-gray-400">{student.email}</p>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-gray-400">{student.completedLessons}/{student.totalLessons} lessons</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Last active</p>
                <p className="text-sm text-white">{student.lastActivity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TopLessons = () => {
    const lessons = [
      { 
        id: 1, 
        title: 'JavaScript Fundamentals',
        views: 45,
        completions: 38,
        avgRating: 4.8,
        completionRate: 84
      },
      { 
        id: 2, 
        title: 'React Components',
        views: 32,
        completions: 28,
        avgRating: 4.6,
        completionRate: 88
      },
      { 
        id: 3, 
        title: 'CSS Grid Layout',
        views: 28,
        completions: 22,
        avgRating: 4.7,
        completionRate: 79
      }
    ];

    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Top Performing Lessons</h3>
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded text-white font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{lesson.title}</h4>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                  <span>{lesson.views} views</span>
                  <span>{lesson.completions} completions</span>
                  <span>★ {lesson.avgRating}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-400">{lesson.completionRate}%</p>
                <p className="text-xs text-gray-400">completion rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track performance and engagement metrics</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Students"
              value={analyticsData.overview.totalStudents.toLocaleString()}
              subtitle="Coming soon"
              icon={UsersIcon}
              color="bg-blue-600"
              trend={analyticsData.trends.studentGrowth}
            />
            <MetricCard
              title="Active Students"
              value={analyticsData.overview.activeStudents.toLocaleString()}
              subtitle="Coming soon"
              icon={EyeIcon}
              color="bg-green-600"
              trend={analyticsData.trends.engagement}
            />
            <MetricCard
              title="Total Lessons"
              value={analyticsData.overview.totalLessons}
              subtitle="Published lessons"
              icon={CheckCircleIcon}
              color="bg-purple-600"
            />
            <MetricCard
              title="Avg. Completion Time"
              value={analyticsData.overview.avgCompletionTime}
              subtitle="Coming soon"
              icon={ClockIcon}
              color="bg-amber-600"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder title="Student Engagement Over Time" />
            <ChartPlaceholder title="Lesson Completion Rates" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder title="Learning Path Progress" />
            <ChartPlaceholder title="Content Performance" />
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StudentProgress />
            <TopLessons />
          </div>

          {/* Additional Insights */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">📊 Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-900 bg-opacity-50 rounded-lg p-4 mb-2">
                  <AcademicCapIcon className="w-8 h-8 text-blue-400 mx-auto" />
                </div>
                <h4 className="font-medium text-white mb-1">Platform Setup</h4>
                <p className="text-sm text-gray-300">Your learning platform is ready for students</p>
              </div>
              <div className="text-center">
                <div className="bg-green-900 bg-opacity-50 rounded-lg p-4 mb-2">
                  <ChartBarIcon className="w-8 h-8 text-green-400 mx-auto" />
                </div>
                <h4 className="font-medium text-white mb-1">Analytics Ready</h4>
                <p className="text-sm text-gray-300">Data collection will begin with first students</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-900 bg-opacity-50 rounded-lg p-4 mb-2">
                  <UsersIcon className="w-8 h-8 text-purple-400 mx-auto" />
                </div>
                <h4 className="font-medium text-white mb-1">Ready to Launch</h4>
                <p className="text-sm text-gray-300">Create more content and invite students</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Export Options */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">📊 Export & Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-900 bg-opacity-50 rounded-lg text-left hover:bg-opacity-75 transition-colors">
            <h4 className="font-medium text-white mb-1">Student Progress Report</h4>
            <p className="text-sm text-blue-300">Coming soon</p>
          </button>
          <button className="p-4 bg-green-900 bg-opacity-50 rounded-lg text-left hover:bg-opacity-75 transition-colors">
            <h4 className="font-medium text-white mb-1">Engagement Analytics</h4>
            <p className="text-sm text-green-300">Coming soon</p>
          </button>
          <button className="p-4 bg-purple-900 bg-opacity-50 rounded-lg text-left hover:bg-opacity-75 transition-colors">
            <h4 className="font-medium text-white mb-1">Content Performance</h4>
            <p className="text-sm text-purple-300">Coming soon</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 