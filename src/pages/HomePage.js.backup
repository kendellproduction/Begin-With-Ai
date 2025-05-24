import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import LoggedInNavbar from '../components/LoggedInNavbar';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userStats, completeLesson, updateStreak } = useGamification();
  
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentFact, setCurrentFact] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [weeklyGoalProgress, setWeeklyGoalProgress] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [todaysChallenge, setTodaysChallenge] = useState(null);

  // Inspirational quotes based on time of day
  const quotes = {
    morning: [
      "Good morning, AI pioneer! Today is your chance to learn something that will change your career forever.",
      "Rise and shine! The future belongs to those who start their AI journey today.",
      "Every expert was once a beginner. Your AI mastery journey starts with this moment.",
      "The best time to plant a tree was 20 years ago. The second best time is now. Start learning AI today!"
    ],
    afternoon: [
      "Keep pushing forward! Each lesson brings you closer to AI mastery.",
      "Progress, not perfection. Every small step in AI learning compounds into expertise.",
      "You're building the skills that will define the next decade of your career.",
      "The future of work is AI-powered. You're preparing for that future right now."
    ],
    evening: [
      "End your day with growth. A few minutes of AI learning today = a transformed tomorrow.",
      "While others are watching TV, you're building skills that will change your life.",
      "Consistency beats intensity. Your evening AI session is an investment in your future.",
      "The person you'll be in 6 months starts with what you learn tonight."
    ]
  };

  // AI facts and insights
  const aiFacts = [
    "🤖 AI can help you write code, even if you've never programmed before",
    "💡 ChatGPT was trained on data up to 2021, but newer models know even more",
    "🚀 Companies using AI are 5x more likely to be top performers in their industry",
    "📈 AI-skilled professionals earn 20-30% more than their peers",
    "🎯 Prompt engineering is now a $300,000+ per year career",
    "⚡ AI can reduce repetitive tasks by up to 80% in most jobs",
    "🌟 You don't need a computer science degree to master AI tools",
    "🔥 The next 5 years will see more AI advancement than the last 50 years combined"
  ];

  // Daily challenges
  const dailyChallenges = [
    {
      title: "Prompt Master",
      description: "Create a prompt that generates a professional email",
      xp: 50,
      icon: "✍️",
      difficulty: "Easy"
    },
    {
      title: "AI Assistant",
      description: "Use AI to solve a real problem from your work",
      xp: 100,
      icon: "🤝",
      difficulty: "Medium"
    },
    {
      title: "Creative Genius",
      description: "Generate 5 creative ideas for your next project using AI",
      xp: 75,
      icon: "🎨",
      difficulty: "Easy"
    },
    {
      title: "Data Detective",
      description: "Ask AI to analyze a dataset or spreadsheet",
      xp: 120,
      icon: "🔍",
      difficulty: "Medium"
    }
  ];

  // Upcoming learning recommendations
  const recommendations = [
    {
      title: "Master Claude 3.5 Sonnet",
      description: "Learn the most advanced AI assistant",
      time: "15 min",
      icon: "🧠",
      category: "Advanced AI",
      popularity: "Trending"
    },
    {
      title: "AI-Powered Excel",
      description: "Automate spreadsheets with AI",
      time: "12 min",
      icon: "📊",
      category: "Productivity",
      popularity: "Popular"
    },
    {
      title: "Create Your First AI App",
      description: "Build a real app with no coding",
      time: "25 min",
      icon: "⚡",
      category: "Building",
      popularity: "New"
    }
  ];

  useEffect(() => {
    // Determine time of day
    const hour = new Date().getHours();
    let timeCategory = 'morning';
    if (hour >= 12 && hour < 17) timeCategory = 'afternoon';
    else if (hour >= 17) timeCategory = 'evening';
    
    setTimeOfDay(timeCategory);
    setCurrentQuote(quotes[timeCategory][Math.floor(Math.random() * quotes[timeCategory].length)]);
    setCurrentFact(aiFacts[Math.floor(Math.random() * aiFacts.length)]);
    setTodaysChallenge(dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)]);

    // Simulate weekly goal progress
    setWeeklyGoalProgress(Math.min((userStats.lessonsCompleted || 0) * 20, 100));

    // Check for achievements
    if (userStats.streak >= 3 && !localStorage.getItem('streak_achievement_shown')) {
      setShowAchievement(true);
      localStorage.setItem('streak_achievement_shown', 'true');
    }
  }, [userStats]);

  const getUserGreeting = () => {
    const name = user?.displayName || user?.email?.split('@')[0] || 'AI Learner';
    const greetings = {
      morning: `Good morning, ${name}!`,
      afternoon: `Good afternoon, ${name}!`,
      evening: `Good evening, ${name}!`
    };
    return greetings[timeOfDay];
  };

  const handleStartLearning = () => {
    navigate('/lessons');
  };

  const handleCompleteChallenge = () => {
    // Simulate completing today's challenge
    if (todaysChallenge) {
      completeLesson(`challenge-${Date.now()}`, todaysChallenge.xp);
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <LoggedInNavbar />
      
      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl p-8 text-center max-w-md animate-bounce">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
            <p className="text-white/90 mb-6">You're on fire! Keep up the amazing progress!</p>
            <button
              onClick={() => setShowAchievement(false)}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all"
            >
              Awesome! 🎉
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {getUserGreeting()}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
                {currentQuote}
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-3xl font-bold text-indigo-400">{userStats.streak || 0}</div>
                  <div className="text-sm text-gray-400">Day Streak 🔥</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-3xl font-bold text-green-400">{userStats.lessonsCompleted || 0}</div>
                  <div className="text-sm text-gray-400">Lessons Done ✅</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-3xl font-bold text-yellow-400">{userStats.xp || 0}</div>
                  <div className="text-sm text-gray-400">Total XP ⭐</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-3xl font-bold text-purple-400">Lv.{userStats.level || 1}</div>
                  <div className="text-sm text-gray-400">Current Level 🏆</div>
                </div>
              </div>

              {/* Main CTA */}
              <button
                onClick={handleStartLearning}
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
                <span className="relative flex items-center gap-2">
                  🚀 Continue Your AI Journey
                </span>
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Goal Progress */}
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                🎯 Weekly Learning Goal
              </h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress this week</span>
                  <span>{weeklyGoalProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${weeklyGoalProgress}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-gray-300">
                {weeklyGoalProgress >= 100 
                  ? "🎉 Amazing! You've crushed this week's goal!" 
                  : `Just ${Math.ceil((100 - weeklyGoalProgress) / 20)} more lessons to hit your weekly goal!`
                }
              </p>
            </div>

            {/* Today's Challenge */}
            {todaysChallenge && (
              <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-xl rounded-3xl p-6 border border-orange-500/30">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  ⚡ Today's Challenge
                </h2>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{todaysChallenge.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{todaysChallenge.title}</h3>
                    <p className="text-gray-300 mb-4">{todaysChallenge.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                        +{todaysChallenge.xp} XP
                      </span>
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                        {todaysChallenge.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCompleteChallenge}
                  className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                >
                  Accept Challenge 🎯
                </button>
              </div>
            )}

            {/* AI Fact of the Day */}
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/30">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                💡 AI Insight of the Day
              </h2>
              <p className="text-xl text-blue-200 leading-relaxed">
                {currentFact}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">⚡ Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/lessons/explore')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-left"
                >
                  🔍 Explore All Lessons
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-left"
                >
                  📊 View Progress
                </button>
                <button
                  onClick={() => navigate('/ai-news')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 text-left"
                >
                  📰 AI News
                </button>
              </div>
            </div>

            {/* Recommended for You */}
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">🎯 Recommended for You</h2>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 hover:bg-black/40 transition-all cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl group-hover:scale-110 transition-transform">
                        {rec.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                          {rec.title}
                        </h3>
                        <p className="text-xs text-gray-400 mb-2">{rec.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded text-xs">
                            {rec.time}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            rec.popularity === 'Trending' ? 'bg-red-500/20 text-red-400' :
                            rec.popularity === 'Popular' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {rec.popularity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivation Quote */}
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30 text-center">
              <div className="text-4xl mb-4">🌟</div>
              <p className="text-lg text-purple-200 leading-relaxed">
                "The future belongs to those who learn, adapt, and grow. You're already ahead of 99% of people."
              </p>
              <p className="text-sm text-purple-400 mt-4">— Your AI Learning Journey</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
