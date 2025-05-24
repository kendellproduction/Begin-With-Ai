import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const { user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  if (user) {
    return <Navigate to="/home" replace />;
  }

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

  const features = [
    {
      icon: "🚀",
      title: "Learn by Doing",
      description: "Build real AI projects like Pac-Man games, data analyzers, and chatbots with live code preview",
      benefit: "No boring theory - just hands-on building"
    },
    {
      icon: "🎯",
      title: "Personalized Learning Path",
      description: "AI-powered recommendations based on your goals, experience, and industry",
      benefit: "Learn exactly what you need, when you need it"
    },
    {
      icon: "⚡",
      title: "Instant AI Feedback",
      description: "Get real-time code reviews and suggestions from advanced AI mentors",
      benefit: "Learn faster with intelligent guidance"
    },
    {
      icon: "🌟",
      title: "Gamified Progress",
      description: "Earn XP, unlock achievements, and compete on leaderboards while learning",
      benefit: "Stay motivated with game mechanics"
    },
    {
      icon: "🔥",
      title: "Industry-Ready Skills",
      description: "Master ChatGPT, Claude, Gemini, and the latest AI tools companies actually use",
      benefit: "Become immediately valuable to employers"
    },
    {
      icon: "🏆",
      title: "Career Transformation",
      description: "Join thousands who've advanced their careers and increased their income",
      benefit: "See real results in weeks, not years"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Students Transformed", icon: "👥" },
    { number: "95%", label: "Career Advancement", icon: "📈" },
    { number: "300%", label: "Average Productivity Increase", icon: "⚡" },
    { number: "4.9/5", label: "Student Rating", icon: "⭐" }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
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
              <div className="w-1 h-1 bg-white/20 rounded-full"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Master AI in
              </span>
              <span className="block text-white mt-2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  10 Minutes a Day
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Join <span className="text-yellow-400 font-bold">50,000+ professionals</span> who transformed their careers 
              by learning to work <span className="text-purple-400 font-bold">with AI, not against it</span>
            </p>

            {/* Value Proposition */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-green-500/30">
              <p className="text-lg text-green-300">
                <span className="font-bold">⚡ No coding required</span> • 
                <span className="font-bold"> 🎯 Hands-on projects</span> • 
                <span className="font-bold"> 🚀 Instant results</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[280px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
                <span className="relative flex items-center justify-center gap-2">
                  🚀 Start Learning for FREE
                </span>
              </Link>
              
              <div className="text-gray-400 text-sm">
                ✅ 7-day free trial • ❌ No credit card required
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 opacity-70">
              <div className="text-sm text-gray-400">Trusted by teams at:</div>
              <div className="flex gap-6 text-gray-500">
                <span>🏢 Microsoft</span>
                <span>🏢 Google</span>
                <span>🏢 Tesla</span>
                <span>🏢 Netflix</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                id={`stat-${index}`}
                data-animate
                className={`text-center transform transition-all duration-1000 ${
                  isVisible[`stat-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">BeginningWithAI</span> Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We've revolutionized AI education by making it practical, engaging, and immediately applicable to your career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                id={`feature-${index}`}
                data-animate
                className={`group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-500 transform hover:scale-105 ${
                  isVisible[`feature-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="text-green-400 font-semibold text-sm">
                  ✅ {feature.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Real Results
              </span> from Real People
            </h2>
            <p className="text-xl text-gray-300">
              See how our students transformed their careers in weeks, not years
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-700/50">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-24 h-24 rounded-full border-4 border-indigo-500/50"
                />
                <div className="flex-1 text-center md:text-left">
                  <blockquote className="text-xl md:text-2xl font-medium text-white mb-6 leading-relaxed">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div className="mb-4">
                    <div className="text-lg font-bold text-indigo-400">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-400">
                      {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full inline-block text-sm font-semibold">
                    🏆 {testimonials[currentTestimonial].achievement}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-indigo-500 w-8'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Your AI Journey
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Starts Today
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Join the AI revolution before it's too late. 
              <span className="text-yellow-400 font-bold"> Every day you wait is a day your competitors get ahead.</span>
            </p>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-4 text-white">🎁 Limited Time Offer</h3>
              <p className="text-lg text-gray-300 mb-6">
                Get our <span className="text-green-400 font-bold">complete AI mastery program</span> for FREE during your 7-day trial
              </p>
              <div className="text-4xl font-bold text-white mb-2">
                <span className="line-through text-gray-500 text-2xl">$297</span> 
                <span className="text-green-400 ml-4">FREE</span>
              </div>
              <p className="text-sm text-gray-400">No credit card required • Cancel anytime</p>
            </div>

            <Link
              to="/signup"
              className="inline-block group relative px-12 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-black font-bold text-xl shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
              <span className="relative flex items-center gap-3">
                🚀 Claim Your FREE Trial Now
              </span>
            </Link>

            <p className="text-sm text-gray-400 mt-6">
              ⚡ Instant access • 🛡️ 30-day money-back guarantee • 🏆 Join 50,000+ successful students
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Product</h4>
              <div className="space-y-2 text-gray-400">
                <Link to="/features" className="block hover:text-white transition-colors">Features</Link>
                <Link to="/pricing" className="block hover:text-white transition-colors">Pricing</Link>
                <Link to="/testimonials" className="block hover:text-white transition-colors">Success Stories</Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <Link to="/about" className="block hover:text-white transition-colors">About</Link>
                <Link to="/blog" className="block hover:text-white transition-colors">Blog</Link>
                <Link to="/careers" className="block hover:text-white transition-colors">Careers</Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <Link to="/help" className="block hover:text-white transition-colors">Help Center</Link>
                <Link to="/contact" className="block hover:text-white transition-colors">Contact</Link>
                <Link to="/community" className="block hover:text-white transition-colors">Community</Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Legal</h4>
              <div className="space-y-2 text-gray-400">
                <Link to="/privacy" className="block hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="block hover:text-white transition-colors">Terms</Link>
                <Link to="/security" className="block hover:text-white transition-colors">Security</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BeginningWithAI. All rights reserved. Transform your career with AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 