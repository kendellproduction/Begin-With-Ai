import React from 'react';
import { motion } from 'framer-motion';
import LoggedInNavbar from '../components/LoggedInNavbar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const About = () => {
  const { user } = useAuth();

  return (
    <div 
      className="relative min-h-screen text-white overflow-hidden"
      style={{ backgroundColor: '#2061a6' }}
    >
      {user ? <LoggedInNavbar /> : <Navbar />}

      {/* Star Animation Container for About - High Performance GPU Accelerated */}
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
              key={`about-star-${i}`}
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

      {/* Main content wrapper */}
      <div className="relative z-10">
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                About <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">BeginningWithAI</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                We're on a mission to make AI education accessible, practical, and transformative for everyone.
              </p>
            </motion.div>

            {/* Mission Section */}
            <motion.section 
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                      🎯 Our Mission
                    </h2>
                    <p className="text-lg text-gray-200 leading-relaxed mb-6">
                      AI shouldn't be intimidating or exclusive. We believe everyone deserves to understand and harness 
                      the power of artificial intelligence, regardless of their technical background.
                    </p>
                    <p className="text-lg text-gray-200 leading-relaxed">
                      That's why we created BeginningWithAI - to bridge the gap between complex AI concepts and 
                      practical, real-world applications through hands-on learning and supportive guidance.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-8xl mb-4">🌟</div>
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl p-6">
                      <div className="text-2xl font-bold text-white mb-2">1,000+</div>
                      <div className="text-blue-100">Students Learning AI</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Story Section */}
            <motion.section 
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  📖 Our Story
                </h2>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
                <div className="max-w-4xl mx-auto">
                  <p className="text-lg text-gray-200 leading-relaxed mb-6">
                    BeginningWithAI was born from a simple observation: while AI was transforming every industry, 
                    most educational resources were either too technical for beginners or too theoretical for practical application.
                  </p>
                  <p className="text-lg text-gray-200 leading-relaxed mb-6">
                    We saw talented individuals from all backgrounds - marketing professionals, small business owners, 
                    creative freelancers - struggling to find their entry point into the AI revolution. Traditional 
                    courses assumed programming knowledge, while YouTube tutorials lacked structure and depth.
                  </p>
                  <p className="text-lg text-gray-200 leading-relaxed">
                    So we built something different: a platform that starts where you are, teaches through doing, 
                    and gives you the confidence to apply AI in your real work and life.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Values Section */}
            <motion.section 
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  💎 Our Values
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "🎓",
                    title: "Learning for Everyone",
                    description: "No prerequisites, no gatekeeping. If you're curious about AI, you belong here."
                  },
                  {
                    icon: "🛠️",
                    title: "Hands-On Approach",
                    description: "Learn by doing. Build real projects, get instant feedback, see immediate results."
                  },
                  {
                    icon: "🌱",
                    title: "Growth Mindset",
                    description: "Every expert was once a beginner. We celebrate progress, not perfection."
                  },
                  {
                    icon: "🤝",
                    title: "Supportive Community",
                    description: "Learning together is better. Our community celebrates questions and shares successes."
                  },
                  {
                    icon: "⚡",
                    title: "Practical Impact",
                    description: "Theory is great, but application is everything. Our lessons focus on real-world value."
                  },
                  {
                    icon: "🔮",
                    title: "Future-Ready",
                    description: "AI is evolving rapidly. We keep you ahead of the curve with cutting-edge content."
                  }
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-200 leading-relaxed">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* What Makes Us Different */}
            <motion.section 
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-cyan-400/30">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    🚀 What Makes Us Different
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-500 rounded-full p-2 mt-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Interactive Learning Sandbox</h4>
                          <p className="text-gray-200">Write and test AI code in your browser. No downloads, no setup, no barriers.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-500 rounded-full p-2 mt-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">AI-Powered Feedback</h4>
                          <p className="text-gray-200">Get instant, personalized guidance from our AI mentor as you learn.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-500 rounded-full p-2 mt-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Adaptive Learning Path</h4>
                          <p className="text-gray-200">Your curriculum adapts to your pace, interests, and career goals.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-500 rounded-full p-2 mt-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Real-World Projects</h4>
                          <p className="text-gray-200">Build actual applications you can use in your work and showcase to employers.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-white/20 to-white/10 rounded-2xl p-8 border border-white/20">
                      <div className="text-6xl mb-4">🎯</div>
                      <h3 className="text-2xl font-bold text-white mb-4">95% Success Rate</h3>
                      <p className="text-gray-200 mb-6">
                        Students report significant skill improvement within their first month
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-cyan-500/20 rounded-lg p-3">
                          <div className="text-cyan-300 font-bold">300%</div>
                          <div className="text-gray-200">Productivity Boost</div>
                        </div>
                        <div className="bg-blue-500/20 rounded-lg p-3">
                          <div className="text-blue-300 font-bold">2 weeks</div>
                          <div className="text-gray-200">Average Learning</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Call to Action */}
            <motion.section 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-indigo-400/30">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Begin Your AI Journey?
                </h2>
                <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                  Join thousands of learners who've transformed their careers with AI. 
                  Start with our free tier and discover what's possible.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {!user && (
                    <>
                      <motion.button
                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-bold text-lg shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/signup'}
                      >
                        🚀 Start Learning Free
                      </motion.button>
                      <motion.button
                        className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full text-black font-bold text-lg shadow-xl border-2 border-yellow-400"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/pricing'}
                      >
                        👑 View Premium Plans
                      </motion.button>
                    </>
                  )}
                  
                  {user && (
                    <motion.button
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white font-bold text-lg shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.href = '/dashboard'}
                    >
                      📚 Continue Learning
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 