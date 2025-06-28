import React, { useState } from 'react';
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

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const analyticsData = {
    overview: {
      totalStudents: 1,
      activeStudents: 1,
      completedLessons: 23,
      totalLessons: 47,
      avgCompletionTime: '12 minutes',
      engagementRate: 78
    },
    trends: {
      studentGrowth: 15,
      lessonCompletions: 23,
      engagement: 5,
      retention: -2
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Students"
          value={analyticsData.overview.totalStudents.toLocaleString()}
          subtitle="Enrolled learners"
          icon={UsersIcon}
          color="bg-blue-600"
          trend={analyticsData.trends.studentGrowth}
        />
        <MetricCard
          title="Active Students"
          value={analyticsData.overview.activeStudents.toLocaleString()}
          subtitle="Recent activity"
          icon={EyeIcon}
          color="bg-green-600"
          trend={analyticsData.trends.engagement}
        />
        <MetricCard
          title="Completed Lessons"
          value={analyticsData.overview.completedLessons}
          subtitle="Total completions"
          icon={CheckCircleIcon}
          color="bg-purple-600"
          trend={analyticsData.trends.lessonCompletions}
        />
        <MetricCard
          title="Avg. Completion Time"
          value={analyticsData.overview.avgCompletionTime}
          subtitle="Per lesson"
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
            <div className="bg-green-900 bg-opacity-50 rounded-lg p-4 mb-2">
              <ArrowTrendingUpIcon className="w-8 h-8 text-green-400 mx-auto" />
            </div>
            <h4 className="font-medium text-white mb-1">High Engagement</h4>
            <p className="text-sm text-gray-300">Students are highly engaged with your content</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-900 bg-opacity-50 rounded-lg p-4 mb-2">
              <AcademicCapIcon className="w-8 h-8 text-blue-400 mx-auto" />
            </div>
            <h4 className="font-medium text-white mb-1">Consistent Learning</h4>
            <p className="text-sm text-gray-300">Regular lesson completion patterns</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-900 bg-opacity-50 rounded-lg p-4 mb-2">
              <ChartBarIcon className="w-8 h-8 text-purple-400 mx-auto" />
            </div>
            <h4 className="font-medium text-white mb-1">Growing Platform</h4>
            <p className="text-sm text-gray-300">Steady growth in user engagement</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">📈 Export Reports</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Export Student Progress
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            Export Lesson Analytics
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            Export Engagement Report
          </button>
          <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
            Export Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 