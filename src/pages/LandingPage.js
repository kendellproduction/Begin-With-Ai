/* ===== NEW LANDING PAGE LOADED SUCCESSFULLY - TEST 12345 ===== */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { sanitizeText, checkRateLimit } from '../utils/sanitization';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  console.log('🚀 NEW LANDING PAGE IS LOADING!!!');
  
  const navigate = useNavigate();
  
  const { user, signInWithEmail, signInWithGoogle, signUpWithEmail } = useAuth();
  
  console.log('👤 User state:', user);
  console.log('📍 Current URL:', window.location.href);
  
  // Add early return for debugging
  if (window.location.pathname === '/') {
    console.log('✅ On root path - should show landing page');
  } else {
    console.log('❌ Not on root path:', window.location.pathname);
  }
  
  // State management
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentProject, setCurrentProject] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // Auth modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  // Data collections
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Manager",
      company: "TechStart",
      image: "https://images.unsplash.com/photo-1494790108755-2616b2e7a56b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      quote: "BeginningWithAI transformed my career. I went from AI-curious to confidently using AI tools daily in just 2 weeks!",
      achievement: "Increased productivity by 300%",
      videoUrl: "placeholder-for-testimonial-video.mp4"
    },
    {
      name: "Marcus Johnson",
      role: "Small Business Owner",
      company: "Local Cafe Chain",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      quote: "I thought AI was only for tech giants. Now I use it for everything from social media to inventory management.",
      achievement: "Saved 20 hours per week",
      videoUrl: "placeholder-for-testimonial-video-2.mp4"
    },
    {
      name: "Emily Rodriguez",
      role: "Freelance Designer",
      company: "Creative Studio",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      quote: "The hands-on approach made learning AI feel like playing a game. I'm now the AI expert in my client network!",
      achievement: "Doubled freelance rates",
      videoUrl: "placeholder-for-testimonial-video-3.mp4"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Students Transformed", icon: "👥", description: "Active learners building AI skills" },
    { number: "95%", label: "Career Advancement", icon: "📈", description: "Reported skill improvement" },
    { number: "300%", label: "Productivity Increase", icon: "⚡", description: "Average efficiency gain" },
    { number: "4.9/5", label: "Student Rating", icon: "⭐", description: "Based on 10,000+ reviews" }
  ];

  const projects = [
    {
      title: "AI-Powered Pac-Man",
      description: "Build a complete game with intelligent ghost AI, collision detection, and scoring system",
      image: "placeholder-for-pacman-demo.png",
      difficulty: "Beginner",
      duration: "2 hours",
      technologies: ["JavaScript", "HTML5 Canvas", "AI Algorithms"],
      completionRate: "94%"
    },
    {
      title: "Data Analysis Dashboard",
      description: "Create interactive visualizations and insights from real datasets using Python and AI",
      image: "placeholder-for-data-dashboard.png",
      difficulty: "Intermediate",
      duration: "4 hours",
      technologies: ["Python", "Pandas", "Plotly", "AI Analytics"],
      completionRate: "87%"
    },
    {
      title: "Chatbot Assistant",
      description: "Build an intelligent chatbot that can understand context and provide helpful responses",
      image: "placeholder-for-chatbot-demo.png",
      difficulty: "Advanced",
      duration: "6 hours",
      technologies: ["NLP", "Machine Learning", "API Integration"],
      completionRate: "82%"
    }
  ];

  const learningPaths = [
    {
      title: "Complete Beginner",
      description: "Start from zero and build your first AI project",
      duration: "4-6 weeks",
      projects: 8,
      students: "25,000+",
      icon: "🌱",
      color: "from-green-400 to-emerald-500",
      skills: ["AI Basics", "First Projects", "Tool Mastery"],
      popular: false
    },
    {
      title: "Career Switcher", 
      description: "Transition to an AI-focused role in your industry",
      duration: "8-12 weeks",
      projects: 15,
      students: "18,000+", 
      icon: "🚀",
      color: "from-blue-400 to-indigo-500",
      skills: ["Advanced Projects", "Portfolio Building", "Industry Applications"],
      popular: true
    },
    {
      title: "Skill Enhancement",
      description: "Level up your existing AI knowledge and expertise", 
      duration: "6-8 weeks",
      projects: 12,
      students: "15,000+",
      icon: "⚡",
      color: "from-purple-400 to-pink-500", 
      skills: ["Advanced AI", "Cutting-edge Tools", "Expert Techniques"],
      popular: false
    }
  ];

  const features = [
    {
      icon: "🚀",
      title: "Learn by Doing",
      description: "Build real AI projects like Pac-Man games, data analyzers, and chatbots with live code preview",
      benefit: "No boring theory - just hands-on building",
      image: "placeholder-for-coding-screenshot.png",
      stats: "95% retention rate"
    },
    {
      icon: "🎯",
      title: "Personalized Learning Path",
      description: "AI-powered recommendations based on your goals, experience, and industry",
      benefit: "Learn exactly what you need, when you need it",
      image: "placeholder-for-personalized-path.png",
      stats: "3x faster progress"
    },
    {
      icon: "⚡",
      title: "Instant AI Feedback",
      description: "Get real-time code reviews and suggestions from advanced AI mentors",
      benefit: "Learn faster with intelligent guidance",
      image: "placeholder-for-ai-feedback.png",
      stats: "Real-time help"
    },
    {
      icon: "🌟",
      title: "Gamified Progress",
      description: "Earn XP, unlock achievements, and compete on leaderboards while learning",
      benefit: "Stay motivated with game mechanics",
      image: "placeholder-for-gamification.png",
      stats: "85% completion rate"
    },
    {
      icon: "🔥",
      title: "Industry-Ready Skills",
      description: "Master ChatGPT, Claude, Gemini, and the latest AI tools companies actually use",
      benefit: "Become immediately valuable to employers",
      image: "placeholder-for-industry-tools.png",
      stats: "500+ tools covered"
    },
    {
      icon: "🏆",
      title: "Career Transformation",
      description: "Join thousands who've advanced their careers and increased their income",
      benefit: "See real results in weeks, not years",
      image: "placeholder-for-career-growth.png",
      stats: "68% got promotions"
    }
  ];

  const faqs = [
    {
      question: "Do I need any prior coding experience?",
      answer: "Not at all! Our courses are designed for complete beginners. We start with the basics and gradually build your skills through hands-on projects."
    },
    {
      question: "How is this different from other AI courses?",
      answer: "We focus on practical, hands-on learning with real AI tools. Instead of just theory, you'll build actual projects and get instant feedback from AI mentors."
    },
    {
      question: "What if I get stuck on a project?",
      answer: "You'll have access to our AI-powered help system, community forums, and live support sessions. Plus, our smart hints system guides you when you're stuck."
    },
    {
      question: "How much time do I need to dedicate?",
      answer: "You can progress at your own pace! Most students spend 10-30 minutes daily and see significant progress within weeks."
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "Yes! We offer a 30-day money-back guarantee. If you're not completely satisfied, we'll refund your full payment."
    },
    {
      question: "Can I use these skills at my current job?",
      answer: "Absolutely! Our curriculum is designed around real-world applications. You'll learn tools and techniques you can implement immediately at work."
    },
    {
      question: "Do you provide certificates?",
      answer: "Yes, you'll earn certificates for completing courses and projects. These are recognized by many employers and showcase your practical AI skills."
    },
    {
      question: "What devices can I use?",
      answer: "Our platform works on any device with a web browser - computer, tablet, or smartphone. All coding happens in our cloud-based environment."
    }
  ];

  // Auth form handlers
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Rate limiting check
    if (!checkRateLimit(`auth_${authMode}`, 5, 300000).allowed) {
      setError('Too many attempts. Please wait before trying again.');
      setIsLoading(false);
      return;
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeText(email);
    const sanitizedPassword = sanitizeText(password);

    // Validation
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
      navigate('/home');
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthSuccess(false);
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signInWithGoogle();
      setAuthSuccess(true);
      navigate('/home');
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthSuccess(false);
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAuthSuccess(false);
  };

  // Auto-rotate testimonials and projects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      setCurrentProject((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, projects.length]);

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
      
      {/* Section 1: Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-pink-900/30"></div>
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <div className={`w-1 h-1 bg-white/30 rounded-full ${i % 10 === 0 ? 'w-2 h-2' : ''}`}></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            {/* Left Column - Text Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-6">
                <span className="text-sm font-medium text-purple-300">🎉 Join 50,000+ AI learners worldwide</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Master AI
                </span>
                <span className="block text-white mt-4">
                  Build. Learn.
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Succeed.</span>
              </span>
            </h1>

              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                Transform your career with hands-on AI projects. Build real applications, get instant feedback, and become job-ready in weeks, not years.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center">
                <button
                  onClick={() => openAuthModal('signup')}
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[280px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
                <span className="relative flex items-center justify-center gap-2">
                    🚀 Start Building Today - FREE
                </span>
                </button>
                <button className="px-8 py-4 border border-white/20 rounded-full text-white font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                  📹 Watch Demo (2 min)
                </button>
              </div>

              <div className="flex items-center gap-8 text-sm text-gray-400 lg:justify-start justify-center flex-wrap">
                <span className="flex items-center gap-2">✅ No credit card required</span>
                <span className="flex items-center gap-2">⚡ Instant access</span>
                <span className="flex items-center gap-2">🎯 7-day free trial</span>
              </div>

              {/* Social Proof */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full border-2 border-white"></div>
                    ))}
                  </div>
                  <div className="text-sm text-green-300 font-semibold">50,000+ students already enrolled</div>
                </div>
                <div className="text-xs text-gray-400">Join professionals from Google, Microsoft, Tesla, and Netflix</div>
              </div>
            </div>

            {/* Right Column - Visual Demo */}
            <div className="relative">
              {/* Product demo placeholder */}
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl p-8 border border-white/10 backdrop-blur-xl">
                <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎮</div>
                    <p className="text-gray-400 text-lg font-semibold">Interactive Pac-Man Demo</p>
                    <p className="text-sm text-gray-500 mt-2 mb-4">[Placeholder for live coding demo video]</p>
                    <button className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-black rounded-full font-semibold hover:scale-105 transition-transform">
                      ▶ Try Live Demo
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Live coding environment</span>
                  </div>
                  <div className="text-sm text-gray-400">Real-time feedback ⚡</div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl p-4 shadow-xl animate-bounce">
                <div className="text-2xl">✨</div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 shadow-xl animate-pulse">
                <div className="text-2xl">🏆</div>
              </div>
              <div className="absolute top-1/2 -left-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl p-3 shadow-xl">
                <div className="text-lg">🚀</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Enhanced Stats Section */}
      <section className="py-32 bg-black/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by learners <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">worldwide</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">Real numbers from real students achieving real results with BeginningWithAI</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                id={`stat-${index}`}
                data-animate
                className={`text-center group hover:scale-105 transition-all duration-500 transform ${
                  isVisible[`stat-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 backdrop-blur-sm border border-white/10 group-hover:border-indigo-500/50 transition-all duration-300 h-full">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{stat.number}</div>
                  <div className="text-xl font-semibold text-gray-300 mb-3">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="text-lg font-semibold text-white mb-2">Award Winning</h3>
              <p className="text-gray-400 text-sm">Best AI Learning Platform 2024</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-400 text-sm">GDPR compliant, SOC2 certified</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-2">Instant Results</h3>
              <p className="text-gray-400 text-sm">See progress from day one</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Product Demo Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              See It in <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Action</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Watch how easy it is to build real AI projects with our interactive platform. No boring tutorials - just hands-on creation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center mb-20">
            <div className="space-y-8">
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center text-2xl font-bold text-black">1</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-3">Write Code in Real-Time</h3>
                    <p className="text-gray-400 text-lg">Start with guided templates and see your code come to life instantly. Our smart editor helps you learn as you type.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center text-2xl font-bold text-black">2</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-3">Get AI Feedback</h3>
                    <p className="text-gray-400 text-lg">Our AI mentors analyze your code and provide personalized suggestions to improve your skills and fix issues.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-2xl font-bold text-black">3</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-3">See Results</h3>
                    <p className="text-gray-400 text-lg">Watch your projects come to life with immediate visual feedback. Build portfolio-worthy applications from day one.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive code editor mockup */}
            <div className="relative">
              <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="ml-4 text-gray-400 text-sm">ai-pacman-game.js</span>
                </div>
                <div className="p-6 font-mono text-sm">
                  <div className="text-gray-500">// Building an AI-powered Pac-Man game</div>
                  <div className="text-blue-400">function <span className="text-yellow-400">createGhost</span>(<span className="text-orange-400">x, y</span>) {'{'}</div>
                  <div className="ml-4 text-gray-300">const ghost = new <span className="text-green-400">AIGhost</span>(x, y);</div>
                  <div className="ml-4 text-gray-300">ghost.<span className="text-purple-400">setTarget</span>(pacman.position);</div>
                  <div className="ml-4 text-gray-300">return ghost;</div>
                  <div className="text-blue-400">{'}'}</div>
                  <div className="mt-4 text-green-400">✓ AI suggestion: Add difficulty scaling</div>
                </div>
              </div>
              
              {/* Floating code snippets */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                Real-time feedback
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Live preview
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Projects Showcase Section */}
      <section className="py-32 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Build <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Real Projects</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From games to data analysis, create portfolio-worthy applications that showcase your AI skills to employers.
            </p>
          </div>

          {/* Featured project carousel */}
          <div className="mb-20">
            <div className="relative">
              <div className="overflow-hidden">
                <div className="transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentProject * 100}%)` }}>
                  {projects.map((project, index) => (
                    <div key={index} className="w-full flex-shrink-0" style={{ display: index === currentProject ? 'block' : 'none' }}>
                      <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                          <div className="flex gap-4 text-sm">
                            <span className={`px-3 py-1 rounded-full font-semibold ${
                              project.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                              project.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {project.difficulty}
                            </span>
                            <span className="text-gray-400">⏱️ {project.duration}</span>
                            <span className="text-gray-400">✅ {project.completionRate} completion</span>
                          </div>
                          
                          <h3 className="text-4xl font-bold text-white">{project.title}</h3>
                          <p className="text-xl text-gray-300 leading-relaxed">{project.description}</p>
                          
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">Technologies you'll learn:</h4>
                            <div className="flex flex-wrap gap-3">
                              {project.technologies.map((tech, i) => (
                                <span key={i} className="px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full text-indigo-300 border border-indigo-500/30 text-sm font-medium">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <button onClick={() => openAuthModal('signup')} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-semibold hover:scale-105 transition-transform">
                              Start Building
                            </button>
                            <button className="px-6 py-3 border border-white/20 rounded-full text-white hover:bg-white/10 transition-colors">
                              Preview Project
                            </button>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="aspect-square bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-8xl mb-4">
                                {index === 0 ? '🎮' : index === 1 ? '📊' : '🤖'}
                              </div>
                              <p className="text-gray-400">[Placeholder for {project.title} demo]</p>
                              <button className="mt-4 px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-black rounded-full font-semibold hover:scale-105 transition-transform">
                                ▶ See Live Demo
                              </button>
                            </div>
                          </div>
                          
                          {/* Project stats overlay */}
                          <div className="absolute top-4 right-4 bg-black/70 rounded-xl p-3 backdrop-blur-sm">
                            <div className="text-green-400 font-semibold text-sm">{project.completionRate} success rate</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project navigation */}
              <div className="flex justify-center mt-8 gap-3">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProject(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentProject
                        ? 'bg-indigo-500 w-12'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Project categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "AI Games", count: "12+", icon: "🎮", color: "from-green-400 to-emerald-400" },
              { title: "Data Science", count: "15+", icon: "📊", color: "from-blue-400 to-indigo-400" },
              { title: "Chatbots", count: "8+", icon: "🤖", color: "from-purple-400 to-pink-400" },
              { title: "Computer Vision", count: "10+", icon: "👁️", color: "from-yellow-400 to-orange-400" }
            ].map((category, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-white/10 text-center hover:scale-105 transition-transform duration-300 group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                <p className={`text-2xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent mb-3`}>{category.count} Projects</p>
                <p className="text-gray-400 text-sm">From beginner to advanced</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Learning Paths Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Choose Your <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Learning Path</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Every journey is unique. Whether you're starting from scratch or looking to level up, we have the perfect path designed just for you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {learningPaths.map((path, index) => (
              <div key={index} className={`relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl p-8 border border-white/10 hover:scale-105 transition-all duration-300 ${path.popular ? 'ring-2 ring-yellow-400' : ''}`}>
                {path.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${path.color} text-4xl mb-6`}>
                    {path.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{path.title}</h3>
                  <p className="text-gray-300 mb-6">{path.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white font-semibold">{path.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Projects:</span>
                    <span className="text-white font-semibold">{path.projects} hands-on builds</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Students:</span>
                    <span className="text-green-400 font-semibold">{path.students} enrolled</span>
                  </div>
                </div>

                <button onClick={() => openAuthModal('signup')} className={`block w-full py-4 text-center font-semibold rounded-xl transition-all duration-300 ${
                  path.popular 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:scale-105' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105'
                }`}>
                  Start This Path
                </button>
              </div>
            ))}
          </div>

          {/* Path comparison */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Not sure which path to choose?</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-4">❓</div>
                <h4 className="text-lg font-semibold text-white mb-2">Take Our Quiz</h4>
                <p className="text-gray-400 mb-4">Get a personalized recommendation based on your goals and experience</p>
                <button className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-black rounded-full font-semibold hover:scale-105 transition-transform">
                  Start Quiz
                </button>
              </div>
              <div>
                <div className="text-4xl mb-4">💬</div>
                <h4 className="text-lg font-semibold text-white mb-2">Talk to Advisor</h4>
                <p className="text-gray-400 mb-4">Schedule a free consultation with our learning advisors</p>
                <button className="px-6 py-2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-full font-semibold hover:scale-105 transition-transform">
                  Book Call
                </button>
              </div>
              <div>
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-lg font-semibold text-white mb-2">Try All Paths</h4>
                <p className="text-gray-400 mb-4">Start with our free trial and explore different learning styles</p>
                <button onClick={() => openAuthModal('signup')} className="px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-semibold hover:scale-105 transition-transform">
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Enhanced Features Section */}
      <section className="py-32 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">BeginningWithAI</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We've revolutionized AI education with features that make learning engaging, effective, and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border border-white/10 hover:scale-105 transition-all duration-300 group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{feature.description}</p>
                <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-4 mb-4">
                  <p className="text-indigo-300 font-semibold">{feature.benefit}</p>
                </div>
                <div className="text-sm text-gray-400 font-semibold">{feature.stats}</div>
              </div>
            ))}
          </div>

          {/* Feature comparison */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Beginner vs Advanced Features</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-green-400 mb-6">🌱 Perfect for Beginners</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Guided step-by-step tutorials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Visual drag-and-drop interfaces</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Pre-built templates and examples</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Instant help and hints system</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-purple-400 mb-6">🚀 Advanced Capabilities</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Custom AI model training</span>
                    </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">API integrations and webhooks</span>
                    </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Production deployment tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Team collaboration features</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Enhanced Testimonials Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Success <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Stories</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real people, real transformations. See how our students have advanced their careers and changed their lives.
            </p>
          </div>

          {/* Testimonial carousel */}
          <div className="relative mb-16">
            <div className="overflow-hidden">
              <div className="transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0" style={{ display: index === currentTestimonial ? 'block' : 'none' }}>
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl p-12 border border-white/10 max-w-4xl mx-auto">
                      <div className="grid md:grid-cols-3 gap-8 items-center">
                        <div className="text-center md:text-left">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-24 h-24 rounded-full mx-auto md:mx-0 mb-4 object-cover"
                          />
                          <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                          <p className="text-indigo-400 font-semibold">{testimonial.role}</p>
                          <p className="text-gray-400">{testimonial.company}</p>
                          <div className="mt-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3">
                            <p className="text-green-400 font-semibold text-sm">{testimonial.achievement}</p>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="text-6xl text-indigo-400 mb-4">"</div>
                          <blockquote className="text-xl text-gray-300 leading-relaxed mb-6">
                            {testimonial.quote}
                          </blockquote>
                          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <p className="text-gray-400 text-sm mb-2">📹 Video testimonial available</p>
                            <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform">
                              ▶ Watch Full Story
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial navigation */}
            <div className="flex justify-center mt-8 gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-indigo-500 w-12'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Additional social proof */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">💼</div>
              <h4 className="text-xl font-semibold text-white mb-2">Career Transformations</h4>
              <p className="text-3xl font-bold text-green-400 mb-2">68%</p>
              <p className="text-gray-400">of students got promotions or new jobs within 6 months</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-semibold text-white mb-2">Salary Increases</h4>
              <p className="text-3xl font-bold text-yellow-400 mb-2">$15,000</p>
              <p className="text-gray-400">average salary increase after completing our programs</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h4 className="text-xl font-semibold text-white mb-2">Student Satisfaction</h4>
              <p className="text-3xl font-bold text-purple-400 mb-2">4.9/5</p>
              <p className="text-gray-400">rating from over 10,000+ student reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: FAQ Section */}
      <section className="py-32 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about BeginningWithAI
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  <div className={`text-2xl transition-transform duration-200 ${expandedFaq === index ? 'rotate-45' : ''}`}>
                    +
                  </div>
                </button>
                {expandedFaq === index && (
                  <div className="px-8 pb-6">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-6">Still have questions?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-semibold hover:scale-105 transition-transform">
                💬 Chat with Support
              </button>
              <button className="px-6 py-3 border border-white/20 rounded-full text-white hover:bg-white/10 transition-colors">
                📚 Visit Help Center
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Final CTA Section */}
      <section className="py-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-6xl md:text-7xl font-bold leading-tight">
              Your AI Journey
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mt-4">
                Starts Today
              </span>
            </h2>
            
            <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed">
              Join the AI revolution before it's too late. 
              <span className="text-yellow-400 font-bold block mt-2">Every day you wait is a day your competitors get ahead.</span>
            </p>

            <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-12 border border-white/10 max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold mb-6 text-white">🎁 Limited Time Offer</h3>
              <p className="text-xl text-gray-300 mb-8">
                Get our <span className="text-green-400 font-bold">complete AI mastery program</span> for FREE during your 7-day trial
              </p>
              <div className="text-5xl font-bold text-white mb-4">
                <span className="line-through text-gray-500 text-3xl">$297</span> 
                <span className="text-green-400 ml-6">FREE</span>
              </div>
              <p className="text-gray-400 mb-8">No credit card required • Cancel anytime</p>
              
              <div className="space-y-4">
                <button
                  onClick={() => openAuthModal('signup')}
                  className="inline-block group relative px-12 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-black font-bold text-2xl shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
              <span className="relative flex items-center gap-3">
                🚀 Claim Your FREE Trial Now
              </span>
                </button>

                <p className="text-sm text-gray-400">
              ⚡ Instant access • 🛡️ 30-day money-back guarantee • 🏆 Join 50,000+ successful students
            </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-white mb-2">Start in 60 Seconds</h3>
                <p className="text-gray-400">Sign up with Google and start building immediately</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-white mb-2">Build Real Projects</h3>
                <p className="text-gray-400">Create portfolio-worthy AI applications from day one</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-white mb-2">Transform Your Career</h3>
                <p className="text-gray-400">Join thousands who've already made the leap</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {authSuccess ? (
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to BeginningWithAI!</h2>
                <p className="text-gray-300">You're all set! Your AI learning journey starts now.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {authMode === 'signup' ? 'Start Your AI Journey' : 'Welcome Back'}
                  </h2>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {authMode === 'signup' && (
                    <div>
                      <input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200"
                  >
                    {isLoading ? 'Please wait...' : authMode === 'signup' ? 'Create Account' : 'Sign In'}
                  </button>
                </form>

                <div className="my-6 flex items-center">
                  <div className="flex-1 h-px bg-gray-600"></div>
                  <span className="px-4 text-gray-400 text-sm">or</span>
                  <div className="flex-1 h-px bg-gray-600"></div>
                </div>

                <button
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>

                {authMode === 'signup' && (
                  <div className="mt-4 text-center">
                    <p className="text-gray-500 text-xs">
                      By signing up, you agree to our Terms of Service and Privacy Policy
                    </p>
          </div>
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