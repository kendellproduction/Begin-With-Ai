/* ===== IMPROVED LANDING PAGE WITH BETTER UI/UX ===== */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { sanitizeText, checkRateLimit } from '../utils/sanitization';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
// Note: Static lesson data removed - should load from database
import { navigateAfterAuth } from '../utils/navigationUtils';
import OptimizedStarField from '../components/OptimizedStarField';

const LandingPage = () => {
  // Removed excessive logging to prevent console spam
  
  const navigate = useNavigate();
  const { user, signInWithEmail, signInWithGoogle, signUpWithEmail } = useAuth();
  
  // Redirect if user is already logged in, but check if they need to complete questionnaire first
  useEffect(() => {
    if (user) {
      navigateAfterAuth(navigate, true);
    }
  }, [user, navigate]);

  // Fallback featured lessons since static data was removed
  const featuredLessons = [
    {
      id: 'welcome-ai-revolution',
      title: 'AI History: How We Got Here & Where We\'re Going',
      description: 'Understanding how AI evolved from 1950s research to today\'s tools like ChatGPT, and where we\'re headed next.',
      difficulty: 'Beginner',
      duration: '20 min',
      category: 'AI Fundamentals'
    },
    {
      id: 'how-ai-thinks',
      title: 'How AI "Thinks" — From Data to Decisions',
      description: 'Learn how AI processes information and makes decisions, from training data to final outputs.',
      difficulty: 'Beginner', 
      duration: '15 min',
      category: 'AI Fundamentals'
    },
    {
      id: 'ai-vocabulary-bootcamp',
      title: 'AI Vocabulary Bootcamp: Master 25 Essential Terms',
      description: 'Build your AI vocabulary with the most important terms every AI user should know.',
      difficulty: 'Beginner',
      duration: '25 min', 
      category: 'AI Fundamentals'
    }
  ];

  // State management
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(() => {
    // Rotate lesson based on page load time for variety
    const randomIndex = Math.floor(Math.random() * featuredLessons.length);
    return randomIndex;
  });
  const [isVisible, setIsVisible] = useState({});
  
  // Auth modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);
  const [redirectToPremiumAfterAuth, setRedirectToPremiumAfterAuth] = useState(false);

  // Auto-rotate lessons every 6 seconds for better reading time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLesson((prev) => (prev + 1) % featuredLessons.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredLessons.length]);

  // Data collections
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Manager", 
      company: "TechStart",
      image: "https://images.unsplash.com/photo-1494790108755-2616b2e7a56b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      quote: "BeginningWithAI transformed my career. I went from AI-curious to confidently using AI tools daily in just 2 weeks!",
      achievement: "Increased productivity by 300%"
    },
    {
      name: "Marcus Johnson",
      role: "Small Business Owner",
      company: "Local Cafe Chain", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      quote: "I thought AI was only for tech giants. Now I use it for everything from social media to inventory management.",
      achievement: "Saved 20 hours per week"
    },
    {
      name: "Emily Rodriguez", 
      role: "Freelance Designer",
      company: "Creative Studio",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80", 
      quote: "The hands-on approach made learning AI feel like playing a game. I'm now the AI expert in my client network!",
      achievement: "Doubled freelance rates"
    }
  ];

  const stats = [
    { number: "1,000+", label: "Students Learning", icon: "👥", description: "Active learners building AI skills" },
    { number: "95%", label: "Career Advancement", icon: "📈", description: "Reported skill improvement" }, 
    { number: "300%", label: "Productivity Increase", icon: "⚡", description: "Average efficiency gain" },
    { number: "4.9/5", label: "Student Rating", icon: "⭐", description: "Based on student reviews" }
  ];

  const features = [
    {
      icon: "🚀",
      title: "Learn by Doing", 
      description: "Build real AI projects with live code preview",
      benefit: "No boring theory - just hands-on building"
    },
    {
      icon: "🎯", 
      title: "Personalized Learning",
      description: "AI-powered recommendations based on your goals",
      benefit: "Learn exactly what you need, when you need it"
    },
    {
      icon: "⚡",
      title: "Instant AI Feedback",
      description: "Get real-time code reviews from AI mentors", 
      benefit: "Learn faster with intelligent guidance"
    },
    {
      icon: "🏆",
      title: "Career Ready Skills",
      description: "Master the latest AI tools companies use",
      benefit: "Become immediately valuable to employers"
    }
  ];

  const learningAreas = [
    {
      icon: "🤖",
      title: "AI Fundamentals",
      description: "Master the core concepts of artificial intelligence, machine learning, and deep learning through interactive lessons",
      outcome: "Build your first AI model"
    },
    {
      icon: "💬",
      title: "Prompt Engineering",
      description: "Learn to craft effective prompts for ChatGPT, Claude, and other AI assistants to maximize their potential",
      outcome: "10x your AI productivity"
    },
    {
      icon: "🔧",
      title: "AI Tools Mastery",
      description: "Hands-on experience with cutting-edge AI tools for content creation, automation, and problem-solving",
      outcome: "Automate your workflows"
    },
    {
      icon: "📊",
      title: "Data Analysis",
      description: "Transform raw data into actionable insights using AI-powered analytics and visualization tools",
      outcome: "Make data-driven decisions"
    },
    {
      icon: "🎨",
      title: "Creative AI",
      description: "Explore AI-powered content creation for images, videos, music, and written content",
      outcome: "Create professional content"
    },
    {
      icon: "🚀",
      title: "AI in Business",
      description: "Apply AI solutions to real business challenges and learn to implement AI strategies effectively",
      outcome: "Lead AI transformation"
    }
  ];

  // Auth form handlers
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!checkRateLimit(`auth_${authMode}`, 5, 300000).allowed) {
      setError('Too many attempts. Please wait before trying again.');
      setIsLoading(false);
      return;
    }

    const sanitizedEmail = sanitizeText(email);
    const sanitizedPassword = sanitizeText(password);

    if (!sanitizedEmail || !sanitizedPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (authMode === 'signup' && sanitizedPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (sanitizedPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      if (authMode === 'signup') {
        await signUpWithEmail(sanitizedEmail, sanitizedPassword);
      } else {
        await signInWithEmail(sanitizedEmail, sanitizedPassword);
      }
      setAuthSuccess(true);
      
      // Check if we need to redirect to premium after auth
      if (redirectToPremiumAfterAuth) {
        navigate('/pricing');
        setRedirectToPremiumAfterAuth(false);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setIsLoading(true);

    if (!checkRateLimit('auth_google', 5, 300000).allowed) {
      setError('Too many attempts. Please wait before trying again.');
      setIsLoading(false);
      return;
    }

    try {
      await signInWithGoogle();
      setAuthSuccess(true);
      
      // Check if we need to redirect to premium after auth
      if (redirectToPremiumAfterAuth) {
        navigate('/pricing');
        setRedirectToPremiumAfterAuth(false);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during Google authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const openAuthModal = (mode, shouldRedirectToPremium = false) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setError('');
    setAuthSuccess(false);
    setRedirectToPremiumAfterAuth(shouldRedirectToPremium);
  };

  const handlePremiumCTA = () => {
    if (user) {
      navigate('/pricing');
    } else {
      // User needs to sign up first, then redirect to premium
      openAuthModal('signup', true);
    }
  };

  // Auto-rotate content
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      setCurrentLesson((prev) => (prev + 1) % featuredLessons.length);
    }, 10000); // Increased from 7000ms to 10000ms for better readability
    return () => clearInterval(interval);
  }, [testimonials.length, featuredLessons.length]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden">
      <Navbar openAuthModal={openAuthModal} />
      
      {/* Single Optimized Star Field for Entire Page */}
      <OptimizedStarField starCount={180} opacity={0.8} speed={1} size={1.2} />
      
      {/* Hero Section with Solid Blue Background & Adjusted Content */}
      <section 
        className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-8 sm:pt-12 md:pt-16 pb-12"
        style={{ backgroundColor: '#3b82f6' }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Main content */}
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="mb-8">
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Master <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI</span>
                  <br />Build. Learn.
                  <br /><span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Succeed.</span>
                </motion.h1>

                <motion.p 
                  className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Transform your career with hands-on AI projects. Build real applications, get instant feedback, and become job-ready in weeks, not years.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <motion.button
                    onClick={() => openAuthModal('signup')}
                    className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:via-blue-400 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl transform transition-all duration-300 relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center justify-center gap-2">
                      🚀 Start Building Today - FREE
                    </span>
                  </motion.button>
                  

                  <motion.button
                    onClick={handlePremiumCTA}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl transform transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ⚠️ Go Premium Now - $10/mo
                  </motion.button>
                </motion.div>

                {/* Feature bullets */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-blue-200">No credit card for free tier</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">⚡</span>
                    <span className="text-blue-200">Instant access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400">⚠️</span>
                    <span className="text-blue-200">Premium: Full AI toolkit</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right side - Lesson preview */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="bg-gray-800/90 rounded-3xl p-6 border border-gray-600/50 shadow-2xl">
                <div className="bg-gray-900/90 rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-5xl">🎯</div>
                  </div>
                  <h3 className="text-white text-xl font-bold text-center mb-3">Introduction to AI</h3>
                  <p className="text-gray-300 text-sm text-center mb-4 leading-relaxed">
                    Master the fundamentals of artificial intelligence and machine learning. 
                    Learn about neural networks, deep learning, and how AI is transformin...
                  </p>
                  <div className="flex items-center justify-between mb-4 text-xs">
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-semibold">Beginner</span>
                    <span className="text-gray-400">⏱️ 45 min</span>
                  </div>
                  <motion.button
                    onClick={() => openAuthModal('signup')}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl text-sm shadow-xl transform transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ▶ Start This Lesson
                  </motion.button>
                </div>
                
                {/* Features below lesson preview */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-lg">🌱</span>
                    <span className="text-white text-sm font-medium">Live interactive lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-lg">⚡</span>
                    <span className="text-white text-sm font-medium">Real-time feedback</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-purple-500 rounded-2xl p-3 shadow-xl text-white"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <div className="text-xl">✨</div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-orange-500 rounded-2xl p-3 shadow-xl text-white"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5 
                }}
              >
                <div className="text-xl">🚀</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What You'll <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Master</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From AI fundamentals to advanced applications, our comprehensive curriculum covers everything you need to succeed
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningAreas.map((area, index) => (
              <motion.div
                key={index}
                className="glass-card rounded-2xl p-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-5xl mb-6">{area.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{area.title}</h3>
                <p className="text-gray-300 leading-relaxed mb-6">{area.description}</p>
                <div className="glass-surface rounded-lg p-3">
                  <p className="text-cyan-300 font-semibold text-sm">✨ {area.outcome}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Thousands of <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI Learners</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="glass-card rounded-3xl p-8 h-full">
                  <motion.div 
                    className="text-6xl mb-6"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-xl font-semibold text-gray-300 mb-3">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Lessons Showcase Section - Redesigned for Maximum Visibility */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Real <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI Lessons</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Master practical AI skills through our comprehensive curriculum. From fundamentals to advanced applications.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Free vs Premium Comparison Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900/80 via-blue-900/60 to-indigo-900/70 relative overflow-hidden">

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Compact Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Free vs <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Premium</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              See why premium users get 10x more value from their AI learning journey
            </p>
          </motion.div>

          {/* Compact Comparison Cards */}
          <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
            {/* Free Tier Card */}
            <motion.div
              className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Free Tier</h3>
                <div className="text-3xl font-bold text-cyan-400 mb-2">$0<span className="text-sm text-gray-400">/forever</span></div>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Basic AI concepts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Beginner lessons only</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Overview explanations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-gray-500">AI-powered feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-gray-500">Interactive sandboxes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="text-gray-500">Advanced lessons</span>
                </li>
              </ul>

              <motion.button
                onClick={() => openAuthModal('signup')}
                className="w-full mt-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Start Free
              </motion.button>
            </motion.div>

            {/* Premium Tier Card */}
            <motion.div
              className="bg-gradient-to-br from-yellow-900/40 via-amber-900/30 to-orange-900/40 backdrop-blur-xl rounded-2xl p-6 border-2 border-yellow-400/70 relative ring-1 ring-yellow-500/30 shadow-xl shadow-yellow-500/10"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Most Popular Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  🚀 Most Popular
                </span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">Premium</h3>
                <div className="text-3xl font-bold text-white mb-2">$10<span className="text-sm text-gray-400">/month</span></div>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-200"><strong>Deep-dive explanations</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-200"><strong>All difficulty levels</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-200"><strong>Real-time AI feedback</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-200"><strong>Interactive sandboxes</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-200"><strong>Industry projects</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-200"><strong>Priority support</strong></span>
                </li>
              </ul>

              <motion.button
                onClick={handlePremiumCTA}
                className="w-full mt-6 py-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-xl text-black font-bold hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.03, boxShadow: "0 8px 25px -8px rgba(245, 158, 11, 0.4)" }}
                whileTap={{ scale: 0.97 }}
              >
                👑 Upgrade Now
              </motion.button>
            </motion.div>
          </div>

          {/* Quick CTA */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-300 mb-4">
              <span className="text-yellow-400 font-semibold">Premium members</span> get detailed content, exclusive lessons, and AI mentorship
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={() => openAuthModal('signup')}
                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full text-white font-semibold text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Free First
              </motion.button>
              <motion.button
                onClick={handlePremiumCTA}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full text-black font-bold text-sm border border-yellow-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                👑 Go Premium
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Enhanced Stats Section */}
      <section className="py-32 bg-gradient-to-br from-gray-800/60 via-blue-900/40 to-indigo-900/40 relative overflow-hidden">


        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by learners <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">worldwide</span>
            </h2>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">Real numbers from real students achieving real results</p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="glass-card rounded-3xl p-8 h-full">
                  <motion.div 
                    className="text-6xl mb-6"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-xl font-semibold text-gray-300 mb-3">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Lessons Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900/80 to-indigo-900/70 relative overflow-hidden">
      </section>

      {/* Combined Features + Testimonials Section */}
      <section className="py-32 bg-gradient-to-br from-gray-800/50 via-blue-800/30 to-cyan-800/30 relative overflow-hidden">




        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Testimonials */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Success <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Stories</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real people, real transformations. See how students have advanced their careers.
            </p>
          </motion.div>

          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className={`${index === currentTestimonial ? 'block' : 'hidden'}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl p-12 border border-white/10 max-w-4xl mx-auto backdrop-blur-sm">
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    <div className="text-center md:text-left">
                      <div className="w-24 h-24 rounded-full mx-auto md:mx-0 mb-4 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center overflow-hidden border-2 border-white/20">
                        <motion.img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl hidden">
                          {testimonial.name.charAt(0)}
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                      <p className="text-cyan-400 font-semibold">{testimonial.role}</p>
                      <p className="text-gray-400">{testimonial.company}</p>
                      <motion.div 
                        className="mt-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg p-3"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <p className="text-cyan-400 font-semibold text-sm">{testimonial.achievement}</p>
                      </motion.div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-6xl text-cyan-400 mb-4">"</div>
                      <blockquote className="text-xl text-gray-300 leading-relaxed mb-6">
                        {testimonial.quote}
                      </blockquote>
                      <div className="text-6xl text-cyan-400 text-right">"</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Testimonial navigation */}
            <div className="flex justify-center mt-8 gap-3">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-cyan-500 w-12'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA Section */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#3b82f6' }}>

        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            className="max-w-4xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-6xl md:text-7xl font-bold leading-tight"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Your AI Journey
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mt-4 bg-300% animate-gradient">
                Starts Today
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-2xl md:text-3xl text-gray-300 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Join the AI revolution before it's too late. 
              <span className="text-cyan-400 font-bold block mt-2">Every day you wait is a day your competitors get ahead.</span>
            </motion.p>

            <motion.div 
              className="bg-black/30 backdrop-blur-sm rounded-3xl p-12 border border-white/20 max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-3xl font-bold mb-6 text-white">🚀 Ready to Begin?</h3>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Start building real AI projects today with our <span className="text-cyan-400 font-bold">completely free tier</span>. 
                No hidden costs, no time limits on learning.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-semibold text-white mb-1">Free Forever</h4>
                  <p className="text-sm text-gray-400">Access core lessons and build your first AI projects</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-500/20">
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-semibold text-white mb-1">Instant Access</h4>
                  <p className="text-sm text-gray-400">Start learning in under 60 seconds</p>
                </div>
              </div>

              <motion.button
                onClick={() => openAuthModal('signup')}
                className="inline-block group relative px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-bold text-2xl shadow-2xl w-full"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.5)"
                }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  boxShadow: [
                    "0 10px 30px -12px rgba(6, 182, 212, 0.3)",
                    "0 20px 40px -12px rgba(6, 182, 212, 0.5)",
                    "0 10px 30px -12px rgba(6, 182, 212, 0.3)"
                  ]
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
                <span className="relative flex items-center justify-center gap-3">
                  🚀 Start Learning AI Today - FREE
                </span>
              </motion.button>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-green-400 text-sm font-semibold">✓ No Credit Card</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-blue-400 text-sm font-semibold">✓ Free Tier</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-purple-400 text-sm font-semibold">✓ Real Projects</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {authSuccess ? (
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="text-6xl mb-4"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1] 
                  }}
                  transition={{ 
                    duration: 1,
                    ease: "easeInOut" 
                  }}
                >
                  🎉
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to BeginningWithAI!</h2>
                <p className="text-gray-300">You're all set! Your AI learning journey starts now.</p>
              </motion.div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {authMode === 'signup' ? 'Start Your AI Journey' : 'Welcome Back'}
                  </h2>
                  <motion.button
                    onClick={() => setShowAuthModal(false)}
                    className="text-gray-400 hover:text-white text-2xl p-2 rounded-full hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </div>

                {error && (
                  <motion.div 
                    className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-red-200 text-sm">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  </motion.div>

                  {authMode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                        required
                      />
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    {isLoading ? (
                      <motion.div
                        className="flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Please wait...
                      </motion.div>
                    ) : (
                      authMode === 'signup' ? 'Create Account' : 'Sign In'
                    )}
                  </motion.button>
                </form>

                <motion.div 
                  className="my-6 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <div className="flex-1 h-px bg-gray-600"></div>
                  <span className="px-4 text-gray-400 text-sm">or</span>
                  <div className="flex-1 h-px bg-gray-600"></div>
                </motion.div>

                <motion.button
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </motion.button>

                <motion.div 
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <p className="text-gray-400 text-sm">
                    {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <motion.button
                      onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                      className="text-blue-400 hover:text-blue-300 font-semibold"
                      whileHover={{ scale: 1.05 }}
                    >
                      {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
                    </motion.button>
                  </p>
                </motion.div>

                {authMode === 'signup' && (
                  <motion.div 
                    className="mt-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    <p className="text-gray-500 text-xs">
                      By signing up, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LandingPage; 