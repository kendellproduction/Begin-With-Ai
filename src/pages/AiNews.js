import React, { useState, useEffect } from 'react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import NewsTestPanel from '../components/NewsTestPanel';
import { motion } from 'framer-motion';
import { getAINews, updateAINews, likeAINewsArticle, getAINewsLikeStatus } from '../services/newsService';
import { useAuth } from '../contexts/AuthContext';

const AiNews = () => {
  const [aiNews, setAiNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [likingArticles, setLikingArticles] = useState(new Set()); // Track which articles are being liked
  const { user } = useAuth();

  // Enhanced user use cases with colorful designs and like functionality
  const [useCaseLikes, setUseCaseLikes] = useState({});
  const [userLikedUseCases, setUserLikedUseCases] = useState(new Set());
  const [userUseCases, setUserUseCases] = useState([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    jobTitle: ''
  });

  // Fallback static news for when dynamic loading fails
  const fallbackNews = [
    {
      id: 'fallback-1',
      title: "OpenAI Releases GPT-4 Turbo",
      summary: "The latest model offers improved performance and reduced costs for developers.",
      date: new Date("2024-03-15"),
      category: "Model Release",
      icon: "🚀",
      gradient: "from-red-400/70 to-orange-400/70",
      border: "border-red-300/90 hover:border-red-200",
      source: "OpenAI"
    },
    {
      id: 'fallback-2',
      title: "Google's Gemini Pro Now Available",
      summary: "Google's multimodal AI model is now accessible to developers worldwide.",
      date: new Date("2024-03-10"),
      category: "Platform",
      icon: "🌟",
      gradient: "from-blue-400/70 to-cyan-400/70",
      border: "border-blue-300/90 hover:border-blue-200",
      source: "Google"
    },
    {
      id: 'fallback-3',
      title: "AI in Healthcare: Breakthrough",
      summary: "New AI system can predict patient outcomes with 95% accuracy.",
      date: new Date("2024-03-05"),
      category: "Research",
      icon: "🏥",
      gradient: "from-green-400/70 to-emerald-400/70",
      border: "border-green-300/90 hover:border-green-200",
      source: "Research Labs"
    },
    {
      id: 'fallback-4',
      title: "Revolutionary Machine Learning Framework",
      summary: "New open-source framework promises to democratize AI development.",
      date: new Date("2024-03-12"),
      category: "Open Source",
      icon: "⚡",
      gradient: "from-purple-400/70 to-pink-400/70",
      border: "border-purple-300/90 hover:border-purple-200",
      source: "Tech Community"
    },
    {
      id: 'fallback-5',
      title: "AI Ethics Guidelines Updated",
      summary: "Major tech companies collaborate on new responsible AI standards.",
      date: new Date("2024-03-08"),
      category: "Ethics",
      icon: "🛡️",
      gradient: "from-yellow-400/70 to-amber-400/70",
      border: "border-yellow-300/90 hover:border-yellow-200",
      source: "AI Ethics Board"
    },
    {
      id: 'fallback-6',
      title: "Quantum Computing Meets AI",
      summary: "Breakthrough in quantum-enhanced machine learning algorithms.",
      date: new Date("2024-03-06"),
      category: "Quantum AI",
      icon: "🔬",
      gradient: "from-indigo-400/70 to-violet-400/70",
      border: "border-indigo-300/90 hover:border-indigo-200",
      source: "Quantum Labs"
    }
  ];

  // Enhanced user use cases with colorful designs and like functionality
  const useCases = [
    {
      id: 1,
      username: "Sarah Chen",
      title: "Automating Customer Support",
      description: "I used GPT-4 to create an automated response system that reduced our support ticket resolution time by 60%. The implementation was surprisingly straightforward and our customers love the instant responses!",
      avatar: "SC",
      role: "Product Manager",
      company: "TechCorp",
      likes: 127,
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-600/10 to-purple-600/10",
      timestamp: "2 hours ago",
      isUserPost: false
    },
    {
      id: 2,
      username: "Michael Rodriguez",
      title: "Content Generation for Marketing",
      description: "Implemented Claude to generate SEO-optimized blog posts, increasing our organic traffic by 40%. The quality is consistent and it freed up our team to focus on strategy and engagement.",
      avatar: "MR",
      role: "Marketing Director",
      company: "GrowthLab",
      likes: 89,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-600/10 to-emerald-600/10",
      timestamp: "5 hours ago",
      isUserPost: false
    },
    {
      id: 3,
      username: "Emma Thompson",
      title: "Data Analysis Automation",
      description: "Built a custom AI solution that processes and analyzes our sales data, saving 20 hours of manual work weekly. The insights it generates have directly improved our quarterly performance.",
      avatar: "ET",
      role: "Data Scientist",
      company: "Analytics Pro",
      likes: 156,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-600/10 to-red-600/10",
      timestamp: "1 day ago",
      isUserPost: false
    },
    {
      id: 4,
      username: "David Kim",
      title: "AI-Powered Code Review",
      description: "Deployed an AI system that automatically reviews code and suggests improvements, reducing bugs by 35%. It's like having a senior developer reviewing every commit 24/7.",
      avatar: "DK",
      role: "Senior Developer",
      company: "CodeFlow",
      likes: 203,
      gradient: "from-purple-500 to-indigo-600",
      bgGradient: "from-purple-600/10 to-indigo-600/10",
      timestamp: "3 days ago",
      isUserPost: false
    }
  ];

  // Combine default and user use cases
  const allUseCases = [...useCases, ...userUseCases];

  // Initialize use case likes on component mount
  useEffect(() => {
    const initialLikes = {};
    allUseCases.forEach(useCase => {
      initialLikes[useCase.id] = useCase.likes;
    });
    setUseCaseLikes(initialLikes);
  }, [userUseCases]);

  // Load news on component mount
  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const news = await getAINews(12); // Get latest 12 articles
      
      if (news && news.length > 0) {
        setAiNews(news);
        setLastUpdated(new Date());
      } else {
        // Fallback to static news if no dynamic news available
        setAiNews(fallbackNews);
      }
    } catch (error) {
      console.error('Error loading news:', error);
      setAiNews(fallbackNews);
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = async () => {
    try {
      setRefreshing(true);
      
      // Update news from sources
      await updateAINews();
      
      // Reload news from Firestore
      await loadNews();
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing news:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatLastUpdated = (date) => {
    if (!date) return '';
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just updated';
    if (diffMinutes < 60) return `Updated ${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `Updated ${Math.floor(diffMinutes / 60)}h ago`;
    return `Updated ${Math.floor(diffMinutes / 1440)}d ago`;
  };

  // Handle article like/unlike
  const handleLikeArticle = async (event, articleId) => {
    event.stopPropagation(); // Prevent article click when clicking like button
    
    if (!user) {
      alert('Please sign in to like articles');
      return;
    }
    
    if (likingArticles.has(articleId)) {
      return; // Already processing this article
    }
    
    try {
      setLikingArticles(prev => new Set([...prev, articleId]));
      
      // Call like service
      const result = await likeAINewsArticle(articleId, user.uid);
      
      // Update local state immediately for responsive UI
      setAiNews(prevNews => 
        prevNews.map(article => {
          if (article.id === articleId) {
            const wasLiked = article.likedBy?.includes(user.uid) || false;
            const updatedLikedBy = wasLiked 
              ? (article.likedBy || []).filter(uid => uid !== user.uid)
              : [...(article.likedBy || []), user.uid];
            
            return {
              ...article,
              likedBy: updatedLikedBy,
              likes: {
                ...article.likes,
                real: result.realLikes,
                total: result.totalLikes
              }
            };
          }
          return article;
        })
      );
      
    } catch (error) {
      console.error('Error liking article:', error);
      alert('Failed to like article. Please try again.');
    } finally {
      setLikingArticles(prev => {
        const newSet = new Set(prev);
        newSet.delete(articleId);
        return newSet;
      });
    }
  };

  // Check if user has liked an article
  const hasUserLiked = (article) => {
    if (!user || !article.likedBy) return false;
    return article.likedBy.includes(user.uid);
  };

  // Handle use case like/unlike
  const handleLikeUseCase = (useCaseId) => {
    if (!user) {
      alert('Please sign in to like posts');
      return;
    }

    const isLiked = userLikedUseCases.has(useCaseId);
    
    // Update liked status
    const newLikedUseCases = new Set(userLikedUseCases);
    if (isLiked) {
      newLikedUseCases.delete(useCaseId);
    } else {
      newLikedUseCases.add(useCaseId);
    }
    setUserLikedUseCases(newLikedUseCases);

    // Update like count
    setUseCaseLikes(prev => ({
      ...prev,
      [useCaseId]: prev[useCaseId] + (isLiked ? -1 : 1)
    }));
  };

  // Handle new post submission
  const handleSubmitPost = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in to post');
      return;
    }
    
    if (!newPost.title.trim() || !newPost.description.trim()) {
      alert('Please fill in title and description');
      return;
    }

    // Generate avatar from user's name or email
    const userName = user.displayName || user.email.split('@')[0];
    const avatarInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    // Random gradient for new post
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-emerald-600', 
      'from-orange-500 to-red-600',
      'from-purple-500 to-indigo-600',
      'from-teal-500 to-cyan-600',
      'from-pink-500 to-rose-600'
    ];
    
    const bgGradients = [
      'from-blue-600/10 to-purple-600/10',
      'from-green-600/10 to-emerald-600/10',
      'from-orange-600/10 to-red-600/10', 
      'from-purple-600/10 to-indigo-600/10',
      'from-teal-600/10 to-cyan-600/10',
      'from-pink-600/10 to-rose-600/10'
    ];
    
    const randomIndex = Math.floor(Math.random() * gradients.length);
    
    const newUseCase = {
      id: Date.now(),
      username: userName,
      title: newPost.title,
      description: newPost.description,
      avatar: avatarInitials,
      role: newPost.jobTitle || 'Community Member',
      likes: 0,
      gradient: gradients[randomIndex],
      bgGradient: bgGradients[randomIndex],
      timestamp: 'Just now',
      isUserPost: true
    };
    
    setUserUseCases(prev => [newUseCase, ...prev]);
    setNewPost({ title: '', description: '', jobTitle: '' });
    setShowNewPostForm(false);
  };

  return (
    <div 
      className="relative min-h-screen text-white overflow-hidden"
      style={{ backgroundColor: '#2061a6' }}
    >
      <LoggedInNavbar />

      {/* Star Animation Container for AiNews */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(140)].map((_, i) => {
          const screenH = window.innerHeight;
          const screenW = window.innerWidth;
          const initialY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const targetY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const initialX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const targetX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const starDuration = 30 + Math.random() * 25;
          const starSize = Math.random() * 3 + 1; // 1px to 4px

          return (
            <motion.div
              key={`ainews-star-${i}`}
              className="absolute rounded-full bg-white/50"
              style={{
                width: starSize,
                height: starSize,
              }}
              initial={{
                x: initialX,
                y: initialY,
                opacity: 0,
              }}
              animate={{
                x: targetX,
                y: targetY,
                opacity: [0, 0.6, 0.6, 0],
              }}
              transition={{
                duration: starDuration,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 2,
                ease: "linear",
                opacity: {
                  duration: starDuration,
                  ease: "linear",
                  times: [0, 0.1, 0.85, 1],
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5 + 2,
                }
              }}
            />
          );
        })}
      </div>

      {/* Custom CSS for animated shadows */}
      <div className="relative z-10">
        <style jsx>{`
          @keyframes news-glow {
            0% {
              box-shadow: 0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(236, 72, 153, 0.2);
            }
            25% {
              box-shadow: 0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(236, 72, 153, 0.3), 0 0 60px rgba(59, 130, 246, 0.2);
            }
            50% {
              box-shadow: 0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(34, 197, 94, 0.2);
            }
            75% {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(34, 197, 94, 0.3), 0 0 60px rgba(99, 102, 241, 0.2);
            }
            100% {
              box-shadow: 0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(236, 72, 153, 0.2);
            }
          }

          .card-glow {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 5px 15px rgba(99, 102, 241, 0.1);
            transition: all 0.3s ease;
          }

          .card-glow:hover {
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 10px 30px rgba(99, 102, 241, 0.3);
          }

          .news-shadow {
            animation: news-glow 4s ease-in-out infinite;
          }

          .refresh-spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        {/* Main content wrapper */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              AI News & Community
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Stay updated with the latest AI developments and learn from the community
            </p>
            
            {/* Refresh Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={refreshNews}
                disabled={refreshing}
                className={`flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 transition-all duration-300 ${refreshing ? 'cursor-not-allowed' : 'hover:scale-105'}`}
              >
                <svg 
                  className={`w-5 h-5 ${refreshing ? 'refresh-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{refreshing ? 'Updating...' : 'Refresh News'}</span>
              </button>
              
              {lastUpdated && (
                <span className="text-sm text-gray-400">
                  {formatLastUpdated(lastUpdated)}
                </span>
              )}
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="card-glow bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-3xl p-6 border border-blue-500/30">
                <div className="text-3xl mb-2">📰</div>
                <div className="text-2xl font-bold text-blue-400">{aiNews.length}</div>
                <div className="text-sm text-gray-300">Latest Articles</div>
              </div>
              <div className="card-glow bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-3xl p-6 border border-purple-500/30">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-2xl font-bold text-purple-400">{useCases.length}</div>
                <div className="text-sm text-gray-300">Community Stories</div>
              </div>
              <div className="card-glow bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-3xl p-6 border border-green-500/30">
                <div className="text-3xl mb-2">💡</div>
                <div className="text-2xl font-bold text-green-400">{useCases.reduce((sum, uc) => sum + uc.likes, 0)}</div>
                <div className="text-sm text-gray-300">Community Likes</div>
              </div>
            </div>
          </div>

          {/* AI News Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Latest AI Developments
              </span>
            </h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card-glow bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-20 h-6 bg-white/20 rounded-full"></div>
                      <div className="w-8 h-8 bg-white/20 rounded"></div>
                    </div>
                    <div className="w-full h-6 bg-white/20 rounded mb-3"></div>
                    <div className="w-3/4 h-4 bg-white/10 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="w-16 h-4 bg-white/10 rounded"></div>
                      <div className="w-20 h-4 bg-white/10 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiNews.map((news, index) => (
                  <motion.div
                    key={news.id || news.firestoreId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`card-glow group bg-gradient-to-br ${news.gradient} backdrop-blur-sm rounded-3xl p-6 border ${news.border} transition-all duration-300 cursor-pointer hover:scale-105`}
                    onClick={() => news.url && window.open(news.url, '_blank')}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white">
                        {news.category}
                      </span>
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {news.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-200 transition-colors">
                      {news.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {news.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-400">
                          {news.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        {news.source && (
                          <p className="text-xs text-gray-500 mt-1">
                            {news.source}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* Like Button */}
                        <button
                          onClick={(e) => handleLikeArticle(e, news.id)}
                          disabled={likingArticles.has(news.id)}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                            hasUserLiked(news)
                              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30'
                              : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-pink-300'
                          } ${likingArticles.has(news.id) ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}`}
                        >
                          <svg 
                            className={`w-4 h-4 transition-transform duration-300 ${hasUserLiked(news) ? 'scale-110' : ''}`}
                            fill={hasUserLiked(news) ? "currentColor" : "none"} 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-sm font-medium">
                            {news.likes?.total || 0}
                          </span>
                        </button>
                        
                        {/* Read More */}
                        <div className="flex items-center space-x-2 text-sm text-blue-300 group-hover:text-blue-200 transition-colors">
                          <span>Read</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Engagement indicator for new articles */}
                    {news.likes?.simulated > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Community engagement</span>
                          <span className="flex items-center space-x-1">
                            <span>{news.likes.real} real</span>
                            <span>•</span>
                            <span>{news.likes.simulated} engagement</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* User Use Cases Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">
                  Community Stories
                </span>
              </h2>
              
              {/* Share Your Story Button */}
              <button
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Share Your Story</span>
              </button>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-glow bg-gradient-to-br from-indigo-600/10 to-purple-600/10 backdrop-blur-sm rounded-3xl p-8 border border-indigo-500/30 mb-8"
              >
                <h3 className="text-2xl font-semibold text-white mb-6">Share Your AI Success Story</h3>
                
                <form onSubmit={handleSubmitPost} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Story Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., 'Automated My Workflow with AI'"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      maxLength={100}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Job Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={newPost.jobTitle}
                      onChange={(e) => setNewPost(prev => ({ ...prev, jobTitle: e.target.value }))}
                      placeholder="e.g., 'Developer', 'Designer', 'Student'"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      maxLength={50}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Story <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={newPost.description}
                      onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Tell us about your AI implementation, what problem it solved, and the results you achieved..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-400 mt-1">{newPost.description.length}/500 characters</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowNewPostForm(false)}
                      className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={!newPost.title.trim() || !newPost.description.trim()}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      Post Story
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="space-y-6">
              {allUseCases.map((useCase) => (
                <motion.div
                  key={useCase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: useCase.id * 0.1 }}
                  className={`card-glow group bg-gradient-to-br ${useCase.bgGradient} backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer hover:scale-[1.02]`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300`}>
                        {useCase.avatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-200 transition-colors">
                          {useCase.username}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {useCase.isUserPost 
                            ? useCase.role
                            : `${useCase.role} at ${useCase.company}`
                          }
                        </p>
                        <p className="text-gray-500 text-xs mt-1">{useCase.timestamp}</p>
                      </div>
                    </div>
                    
                    {/* Like Button for Use Cases */}
                    <button
                      onClick={() => handleLikeUseCase(useCase.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        userLikedUseCases.has(useCase.id)
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30'
                          : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-pink-300'
                      } hover:scale-105`}
                    >
                      <svg 
                        className={`w-5 h-5 transition-transform duration-300 ${userLikedUseCases.has(useCase.id) ? 'scale-110' : ''}`}
                        fill={userLikedUseCases.has(useCase.id) ? "currentColor" : "none"} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-medium">
                        {useCaseLikes[useCase.id] || useCase.likes}
                      </span>
                    </button>
                  </div>
                  
                  <h4 className="text-lg font-medium text-purple-300 mb-3">
                    {useCase.title}
                  </h4>
                  
                  <p className="text-gray-300 leading-relaxed text-lg mb-6">
                    {useCase.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Success Story
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                        AI Implementation
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center mt-16">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Share Your AI Story
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Have you implemented AI in your work or projects? Share your experience with the community!
              </p>
              <button className="news-shadow bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 text-lg">
                Share Your Story
              </button>
            </div>
          </section>
        </main>

        {/* Development Testing Panel */}
        <NewsTestPanel onNewsUpdated={loadNews} />
      </div>
    </div>
  );
};

export default AiNews; 