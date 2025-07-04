import React, { useState, useEffect, useRef } from 'react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import NewsTestPanel from '../components/NewsTestPanel';
import { motion } from 'framer-motion';
import { getAINews, updateAINews, likeAINewsArticle, getAINewsLikeStatus } from '../services/newsService';
import { useAuth } from '../contexts/AuthContext';
import DOMPurify from 'dompurify'; // Import DOMPurify

// Content Moderation: Forbidden Keywords
const forbiddenKeywords = [
  // Profanity (examples from previous list - USER SHOULD EXPAND SIGNIFICANTLY)
  'asshole', 'bastard', 'bitch', 'cunt', 'dick', 'fuck', 'motherfucker', 'pussy', 'shit', 'slut', 'whore',

  // Pornography & Explicit Nudity (USER TO CURATE AND EXPAND)
  'hardcore', 'erotic_video', 'full_frontal_nude', 'sex_chat', 'camsex', 'adult_film', 'explicit_images',
  // Add more terms like specific acts, site names, etc.

  // Hate Speech & Discrimination (USER TO CURATE AND EXPAND)
  // Focus on terms promoting violence, discrimination, or disparagement based on race, ethnicity, religion, gender, sexual orientation, etc.
  'white_supremacy_ideology', 'neo_nazi_sympathizer', 'kill_all_group_x', 'hate_group_manifesto', 'race_war_now',
  // Add specific slurs and derogatory terms for various groups - BE VERY CAREFUL AND ENSURE ACCURACY AND CONTEXT

  // Graphic Violence (USER TO CURATE AND EXPAND)
  'beheading_video', 'decapitation_footage', 'live_torture', 'extreme_gore', 'murder_video',
  // Add terms related to real-world graphic violence

  // Promotion of Illegal Acts & Self Harm (USER TO CURATE AND EXPAND)
  'how_to_make_bomb', 'buy_illegal_drugs_online', 'promote_self_harm', 'suicide_pact_forum', 'anorexia_thinspo',

  // Divisive/Harmful Political Conspiracies & Misinformation (USER TO CURATE AND EXPAND)
  // Focus on widely debunked, harmful conspiracy theories or misinformation campaigns, not general political discussion.
  'qanon_conspiracy_details', 'anti_vaccine_hoax_propaganda', 'election_fraud_lies', 'crisis_actor_exposed', 'pizzagate_evidence',
  // User should carefully consider terms here to avoid censoring legitimate, albeit controversial, discussion if that is not the intent.

  // Placeholder for user to add more categories and specific terms
  'user_defined_forbidden_term1',
];

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
  const newPostFormRef = useRef(null); // Ref for the new post form
  const [newPost, setNewPost] = useState({
    name: '',
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
      gradient: "from-red-700/80 to-orange-600/80",
      border: "border-red-500 hover:border-red-400",
      shadow: "shadow-red-500/50",
      source: "OpenAI"
    },
    {
      id: 'fallback-2',
      title: "Google's Gemini Pro Now Available",
      summary: "Google's multimodal AI model is now accessible to developers worldwide.",
      date: new Date("2024-03-10"),
      category: "Platform",
      icon: "🌟",
      gradient: "from-sky-600/80 to-cyan-500/80",
      border: "border-sky-400 hover:border-sky-300",
      shadow: "shadow-sky-400/50",
      source: "Google"
    },
    {
      id: 'fallback-3',
      title: "AI in Healthcare: Breakthrough",
      summary: "New AI system can predict patient outcomes with 95% accuracy.",
      date: new Date("2024-03-05"),
      category: "Research",
      icon: "🏥",
      gradient: "from-green-700/80 to-emerald-600/80",
      border: "border-green-500 hover:border-green-400",
      shadow: "shadow-green-500/50",
      source: "Research Labs"
    },
    {
      id: 'fallback-4',
      title: "Revolutionary Machine Learning Framework",
      summary: "New open-source framework promises to democratize AI development.",
      date: new Date("2024-03-12"),
      category: "Open Source",
      icon: "⚡",
      gradient: "from-purple-500/80 to-violet-500/80",
      border: "border-purple-400 hover:border-purple-300",
      shadow: "shadow-purple-400/50",
      source: "Tech Community"
    },
    {
      id: 'fallback-5',
      title: "AI Ethics Guidelines Updated",
      summary: "Major tech companies collaborate on new responsible AI standards.",
      date: new Date("2024-03-08"),
      category: "Ethics",
      icon: "🛡️",
      gradient: "from-yellow-800/80 to-amber-700/80",
      border: "border-yellow-500 hover:border-yellow-400",
      shadow: "shadow-yellow-500/50",
      source: "AI Ethics Board"
    },
    {
      id: 'fallback-6',
      title: "Quantum Computing Meets AI",
      summary: "Breakthrough in quantum-enhanced machine learning algorithms.",
      date: new Date("2024-03-06"),
      category: "Quantum AI",
      icon: "🔬",
      gradient: "from-teal-600/80 to-cyan-600/80",
      border: "border-teal-400 hover:border-teal-300",
      shadow: "shadow-teal-400/50",
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

  // Scroll to form when it opens
  useEffect(() => {
    if (showNewPostForm && newPostFormRef.current) {
      newPostFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showNewPostForm]);

  // Load news on component mount and implement fetch-on-load-if-stale
  useEffect(() => {
    const loadAndRefreshIfNeeded = async () => {
      const now = new Date();
      const lastFetchString = localStorage.getItem('lastNewsFetchTimestamp');
      let shouldRefresh = true; // Default to refresh if no timestamp

      if (lastFetchString) {
        const lastFetchTime = new Date(parseInt(lastFetchString, 10));
        const today6AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0);
        if (lastFetchTime >= today6AM) {
          shouldRefresh = false; // Already fetched after 6 AM today
        }
      }

      if (shouldRefresh) {
        setRefreshing(true); // Show refreshing indicator
        try {
          await updateAINews(); // Fetch from sources and save to Firestore
          localStorage.setItem('lastNewsFetchTimestamp', Date.now().toString());
          await loadNews(); // Then load from Firestore into state
        } catch (error) {
          console.error('Error during scheduled news refresh:', error);
          // If refresh fails, still try to load existing news
          await loadNews(); 
        } finally {
          setRefreshing(false);
        }
      } else {
        await loadNews(); // Load existing news
      }
    };

    loadAndRefreshIfNeeded();
  }, []); // Runs once on component mount

  const loadNews = async () => {
    try {
      setLoading(true);
      const news = await getAINews(12); 
      
      if (news && news.length > 0) {
        setAiNews(news);
        setLastUpdated(new Date()); // Reflects when news was loaded into view
        // If news was loaded dynamically (not fallback), assume a successful fetch occurred for staleness check next time.
        // This might slightly differ from the actual RSS fetch time if loadNews is called separately after a failed updateAINews.
        // For more precise control, updateAINews could return a success status.
        // For now, successfully loading non-fallback news implies a reasonably fresh state or successful refresh.
        if (news !== fallbackNews) { // Check if it is not fallback
             localStorage.setItem('lastNewsFetchTimestamp', Date.now().toString());
        }
      } else {
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
      await updateAINews();
      localStorage.setItem('lastNewsFetchTimestamp', Date.now().toString()); // Update timestamp on manual refresh too
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

  // Format timestamp for user use cases
  const formatUseCaseTimestamp = (date) => {
    if (!date) return 'A while ago';
    
    // Handles initial 'Just now' string for immediately added posts before they might be re-rendered with Date obj
    if (typeof date === 'string') { 
        const staticTimes = ['Just now', 'A while ago'];
        if (staticTimes.includes(date) || date.endsWith('ago')) return date;
    }

    const postDate = (date instanceof Date) ? date : new Date(date);
    if (isNaN(postDate.getTime())) return 'A while ago'; // Check for invalid date

    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    
    if (diffSeconds < 5) return 'Just now'; // More responsive 'Just now'
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return `1 day ago`;
    return `${diffDays}d ago`;
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

    // Sanitize inputs
    const sanitizedName = DOMPurify.sanitize(newPost.name.trim());
    const sanitizedTitle = DOMPurify.sanitize(newPost.title.trim());
    const sanitizedDescription = DOMPurify.sanitize(newPost.description.trim());
    const sanitizedJobTitle = DOMPurify.sanitize(newPost.jobTitle.trim());
    
    if (!sanitizedName || !sanitizedTitle || !sanitizedDescription) {
      alert('Please fill in Your Name, Story Title, and Your Story.');
      return;
    }

    // Basic content filtering
    const contentToCheck = (sanitizedTitle + ' ' + sanitizedDescription).toLowerCase();
    for (const keyword of forbiddenKeywords) {
      if (contentToCheck.includes(keyword.toLowerCase())) {
        alert('Your post contains inappropriate content. Please revise and try again.');
        return;
      }
    }

    // Generate avatar from user's name or email
    const posterName = sanitizedName || user.displayName || user.email.split('@')[0];
    const avatarInitials = posterName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
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
      id: Date.now(), // Using timestamp as ID for simplicity, ensure it's unique if many posts quickly
      username: posterName, // Use the entered name
      title: sanitizedTitle, // Use sanitized title
      description: sanitizedDescription, // Use sanitized description
      avatar: avatarInitials,
      role: sanitizedJobTitle || 'Community Member', // Use sanitized job title
      likes: 0,
      gradient: gradients[randomIndex],
      bgGradient: bgGradients[randomIndex],
      timestamp: new Date(), // Store current Date object
      isUserPost: true
    };
    
    setUserUseCases(prev => [newUseCase, ...prev]);
    setNewPost({ name: '', title: '', description: '', jobTitle: '' }); // Reset name field too
    setShowNewPostForm(false);
  };

  // Function to generate color-matched external glow shadows
  const getColorMatchedShadow = (gradient) => {
    // Map gradients to their corresponding shadow colors
    const shadowMap = {
      'from-red-700/80 to-orange-600/80': '0 0 30px rgba(239, 68, 68, 0.4), 0 0 60px rgba(251, 146, 60, 0.3), 0 0 100px rgba(239, 68, 68, 0.2), 0 0 140px rgba(251, 146, 60, 0.15)',
      'from-orange-600/80 to-amber-600/80': '0 0 30px rgba(251, 146, 60, 0.4), 0 0 60px rgba(245, 158, 11, 0.3), 0 0 100px rgba(251, 146, 60, 0.2), 0 0 140px rgba(245, 158, 11, 0.15)',
      'from-yellow-800/80 to-amber-700/80': '0 0 30px rgba(234, 179, 8, 0.4), 0 0 60px rgba(245, 158, 11, 0.3), 0 0 100px rgba(234, 179, 8, 0.2), 0 0 140px rgba(245, 158, 11, 0.15)',
      'from-lime-700/80 to-green-600/80': '0 0 30px rgba(132, 204, 22, 0.4), 0 0 60px rgba(34, 197, 94, 0.3), 0 0 100px rgba(132, 204, 22, 0.2), 0 0 140px rgba(34, 197, 94, 0.15)',
      'from-green-700/80 to-emerald-600/80': '0 0 30px rgba(34, 197, 94, 0.4), 0 0 60px rgba(16, 185, 129, 0.3), 0 0 100px rgba(34, 197, 94, 0.2), 0 0 140px rgba(16, 185, 129, 0.15)',
      'from-teal-600/80 to-cyan-600/80': '0 0 30px rgba(20, 184, 166, 0.4), 0 0 60px rgba(8, 145, 178, 0.3), 0 0 100px rgba(20, 184, 166, 0.2), 0 0 140px rgba(8, 145, 178, 0.15)',
      'from-pink-600/80 to-rose-500/80': '0 0 30px rgba(219, 39, 119, 0.4), 0 0 60px rgba(244, 63, 94, 0.3), 0 0 100px rgba(219, 39, 119, 0.2), 0 0 140px rgba(244, 63, 94, 0.15)',
      'from-fuchsia-600/80 to-pink-600/80': '0 0 30px rgba(192, 38, 211, 0.4), 0 0 60px rgba(219, 39, 119, 0.3), 0 0 100px rgba(192, 38, 211, 0.2), 0 0 140px rgba(219, 39, 119, 0.15)',
      'from-purple-500/80 to-violet-500/80': '0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(139, 92, 246, 0.3), 0 0 100px rgba(168, 85, 247, 0.2), 0 0 140px rgba(139, 92, 246, 0.15)',
      'from-sky-600/80 to-cyan-500/80': '0 0 30px rgba(2, 132, 199, 0.4), 0 0 60px rgba(6, 182, 212, 0.3), 0 0 100px rgba(2, 132, 199, 0.2), 0 0 140px rgba(6, 182, 212, 0.15)',
      'from-emerald-600/80 to-lime-700/80': '0 0 30px rgba(16, 185, 129, 0.4), 0 0 60px rgba(132, 204, 22, 0.3), 0 0 100px rgba(16, 185, 129, 0.2), 0 0 140px rgba(132, 204, 22, 0.15)',
      'from-rose-600/80 to-orange-600/80': '0 0 30px rgba(225, 29, 72, 0.4), 0 0 60px rgba(251, 146, 60, 0.3), 0 0 100px rgba(225, 29, 72, 0.2), 0 0 140px rgba(251, 146, 60, 0.15)',
      'from-cyan-500/80 to-blue-500/80': '0 0 30px rgba(6, 182, 212, 0.4), 0 0 60px rgba(59, 130, 246, 0.3), 0 0 100px rgba(6, 182, 212, 0.2), 0 0 140px rgba(59, 130, 246, 0.15)',
      // Fallback gradients from fallback news
      'from-gray-700/80 to-gray-600/80': '0 0 30px rgba(107, 114, 128, 0.4), 0 0 60px rgba(75, 85, 99, 0.3), 0 0 100px rgba(107, 114, 128, 0.2), 0 0 140px rgba(75, 85, 99, 0.15)',
      // Use case avatar gradients (without opacity)
      'from-blue-500 to-purple-600': '0 0 25px rgba(59, 130, 246, 0.3), 0 0 50px rgba(147, 51, 234, 0.2), 0 0 75px rgba(59, 130, 246, 0.15)',
      'from-green-500 to-emerald-600': '0 0 25px rgba(34, 197, 94, 0.3), 0 0 50px rgba(16, 185, 129, 0.2), 0 0 75px rgba(34, 197, 94, 0.15)',
      'from-orange-500 to-red-600': '0 0 25px rgba(249, 115, 22, 0.3), 0 0 50px rgba(220, 38, 38, 0.2), 0 0 75px rgba(249, 115, 22, 0.15)',
      'from-purple-500 to-indigo-600': '0 0 25px rgba(168, 85, 247, 0.3), 0 0 50px rgba(79, 70, 229, 0.2), 0 0 75px rgba(168, 85, 247, 0.15)',
      'from-teal-500 to-cyan-600': '0 0 25px rgba(20, 184, 166, 0.3), 0 0 50px rgba(8, 145, 178, 0.2), 0 0 75px rgba(20, 184, 166, 0.15)',
      'from-pink-500 to-rose-600': '0 0 25px rgba(236, 72, 153, 0.3), 0 0 50px rgba(225, 29, 72, 0.2), 0 0 75px rgba(236, 72, 153, 0.15)'
    };
    
    // Return the matched shadow or a default purple shadow as fallback
    return shadowMap[gradient] || '0 0 30px rgba(99, 102, 241, 0.4), 0 0 60px rgba(139, 92, 246, 0.3), 0 0 100px rgba(236, 72, 153, 0.2), 0 0 140px rgba(99, 102, 241, 0.15)';
  };

  return (
    <div 
      className="relative min-h-screen text-white overflow-hidden"
      style={{ backgroundColor: '#3b82f6' }}
    >
      <LoggedInNavbar />

      {/* Star Animation Container for AiNews - High Performance GPU Accelerated */}
      <div className="star-container fixed inset-0 z-0 pointer-events-none" style={{ height: '100vh', width: '100vw' }}>
        {[...Array(200)].map((_, i) => {
          const screenH = window.innerHeight;
          const screenW = window.innerWidth;
          const initialY = Math.random() * screenH;
          const targetY = Math.random() * screenH;
          const initialX = Math.random() * screenW;
          const targetX = Math.random() * screenW;
          const starDuration = 30 + Math.random() * 25;
          const starSize = Math.random() * 2 + 0.5; // 0.5px to 2.5px (smaller, less distracting)

          return (
            <motion.div
              key={`ainews-star-${i}`}
              className="star-element absolute rounded-full bg-white/80"
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
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: starDuration,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 2,
                ease: "linear",
                type: "tween", // More performant than spring
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
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent leading-tight py-2">
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
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-3xl p-6 border border-blue-400/30" style={{boxShadow: '0 0 25px rgba(59, 130, 246, 0.3), 0 0 50px rgba(34, 211, 238, 0.2), 0 0 75px rgba(59, 130, 246, 0.15)'}}>
                <div className="text-3xl mb-2">📰</div>
                <div className="text-2xl font-bold text-blue-400">{aiNews.length}</div>
                <div className="text-sm text-gray-300">Latest Articles</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-3xl p-6 border border-purple-400/30" style={{boxShadow: '0 0 25px rgba(139, 92, 246, 0.3), 0 0 50px rgba(99, 102, 241, 0.2), 0 0 75px rgba(139, 92, 246, 0.15)'}}>
                <div className="text-3xl mb-2">👥</div>
                <div className="text-2xl font-bold text-purple-400">{useCases.length}</div>
                <div className="text-sm text-gray-300">Community Stories</div>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-3xl p-6 border border-green-400/30" style={{boxShadow: '0 0 25px rgba(34, 197, 94, 0.3), 0 0 50px rgba(16, 185, 129, 0.2), 0 0 75px rgba(34, 197, 94, 0.15)'}}>
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
                    className={`group bg-gradient-to-br ${news.gradient || 'from-gray-700/80 to-gray-600/80'} backdrop-blur-sm rounded-3xl p-6 border border-white/20 transition-all duration-300 cursor-pointer hover:scale-105`}
                    style={{boxShadow: getColorMatchedShadow(news.gradient || 'from-gray-700/80 to-gray-600/80')}}
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
                ref={newPostFormRef}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 backdrop-blur-sm rounded-3xl p-8 border border-indigo-400/30 mb-8"
                style={{boxShadow: '0 0 25px rgba(99, 102, 241, 0.3), 0 0 50px rgba(139, 92, 246, 0.2), 0 0 75px rgba(99, 102, 241, 0.15)'}}
              >
                <h3 className="text-2xl font-semibold text-white mb-6">Share Your AI Success Story</h3>
                
                <form onSubmit={handleSubmitPost} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPost.name}
                      onChange={(e) => setNewPost(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Alex Smith"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      maxLength={50}
                    />
                  </div>
                  
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
                      disabled={!newPost.name.trim() || !newPost.title.trim() || !newPost.description.trim()}
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
                  className={`group bg-gradient-to-br ${useCase.bgGradient} backdrop-blur-sm rounded-3xl p-8 border border-white/15 transition-all duration-300 cursor-pointer hover:scale-[1.02]`}
                  style={{boxShadow: getColorMatchedShadow(useCase.gradient || 'from-blue-500 to-purple-600')}}
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
                        <p className="text-gray-500 text-xs mt-1">
                          {useCase.isUserPost ? formatUseCaseTimestamp(useCase.timestamp) : useCase.timestamp}
                        </p>
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
              <button 
                onClick={() => setShowNewPostForm(true)}
                className="news-shadow bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 text-lg"
              >
                Share Your Story
              </button>
            </div>
          </section>
        </main>

        {/* Development Testing Panel - REMOVED */}
        {/* <NewsTestPanel onNewsUpdated={loadNews} /> */}
      </div>
    </div>
  );
};

export default AiNews; 