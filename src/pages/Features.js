import React from 'react';
import { motion } from 'framer-motion';
import LoggedInNavbar from '../components/LoggedInNavbar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const Features = () => {
  const { user } = useAuth();

  return (
    <div 
      className="relative min-h-screen text-white overflow-hidden"
      style={{ backgroundColor: '#2061a6' }}
    >
      {user ? <LoggedInNavbar /> : <Navbar />}

      {/* Star Animation Container for Features */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ height: '100vh', width: '100vw' }}>
        {[...Array(200)].map((_, i) => {
          const screenH = window.innerHeight;
          const screenW = window.innerWidth;
          const initialY = Math.random() * screenH;
          const targetY = Math.random() * screenH;
          const initialX = Math.random() * screenW;
          const targetX = Math.random() * screenW;
          const starDuration = 30 + Math.random() * 25;
          const starSize = Math.random() * 3 + 1;

          return (
            <motion.div
              key={`features-star-${i}`}
              className="absolute rounded-full bg-white/80"
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
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Features That <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Transform Lives</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                AI has changed our lives, and now we're here to help it change yours. Every feature is designed with one goal: helping you achieve new heights through AI.
              </p>
            </motion.div>

            {/* Mission Statement */}
            <motion.section 
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-indigo-400/30 text-center">
                <div className="text-6xl mb-6">🌟</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  We Believe AI Can Transform Anyone's Life
                </h2>
                <p className="text-lg text-gray-200 leading-relaxed max-w-4xl mx-auto">
                  Just like AI transformed ours, we're passionate about helping you discover how artificial intelligence 
                  can elevate your career, boost your productivity, and open doors you never knew existed. You can trust us 
                  to be your guide on this incredible journey.
                </p>
              </div>
            </motion.section>

            {/* Core Features */}
            <motion.section 
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  🚀 How We Help You Succeed
                </h2>
                <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                  Every feature is carefully crafted to ensure your success. We've been where you are, and we know exactly what you need.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: "🎯",
                    title: "Adaptive Learning Paths",
                    description: "Your journey is unique, and so should your learning path. Our AI creates a personalized curriculum that adapts to your pace, interests, and career goals.",
                    benefit: "Learn 3x faster with content tailored just for you",
                    color: "from-blue-500/20 to-cyan-500/20",
                    border: "border-blue-400/30"
                  },
                  {
                    icon: "💻",
                    title: "Interactive Code Sandbox",
                    description: "Write, test, and experiment with AI code directly in your browser. No downloads, no setup - just pure learning and creation.",
                    benefit: "Build real AI projects from day one",
                    color: "from-green-500/20 to-emerald-500/20",
                    border: "border-green-400/30",
                    comingSoon: true
                  },
                  {
                    icon: "🤖",
                    title: "AI-Powered Mentor",
                    description: "Get instant, personalized feedback on your code and progress. It's like having a patient AI expert by your side 24/7.",
                    benefit: "Never get stuck - always have guidance",
                    color: "from-purple-500/20 to-indigo-500/20",
                    border: "border-purple-400/30",
                    comingSoon: true
                  },
                  {
                    icon: "🎓",
                    title: "Focused Learning Exercises",
                    description: "Master AI concepts through targeted lessons and interactive examples. We limit prompts per day to ensure quality learning over quantity.",
                    benefit: "Deep understanding through focused practice",
                    color: "from-orange-500/20 to-red-500/20",
                    border: "border-orange-400/30"
                  },
                  {
                    icon: "📊",
                    title: "Progress Tracking",
                    description: "Watch your skills grow with detailed analytics. See exactly how far you've come and what's next on your journey.",
                    benefit: "Stay motivated with visible progress",
                    color: "from-cyan-500/20 to-blue-500/20",
                    border: "border-cyan-400/30"
                  },
                  {
                    icon: "🎉",
                    title: "Gamified Learning",
                    description: "Earn XP, unlock badges, and level up as you learn. We make AI education as engaging as your favorite game.",
                    benefit: "Learn more by having fun",
                    color: "from-yellow-500/20 to-amber-500/20",
                    border: "border-yellow-400/30"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`bg-gradient-to-br ${feature.color} backdrop-blur-xl rounded-2xl p-6 border ${feature.border} relative`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {feature.comingSoon && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12">
                        Coming Soon
                      </div>
                    )}
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-200 leading-relaxed mb-4">{feature.description}</p>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold text-sm">✨ {feature.benefit}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Learning Experience */}
            <motion.section 
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-green-400/30">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    🎓 A Learning Experience You Can Trust
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
                          <h4 className="text-lg font-semibold text-white mb-2">Beginner-Friendly</h4>
                          <p className="text-gray-200">No technical background required. We start where you are and guide you every step of the way.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-500 rounded-full p-2 mt-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Hands-On Learning</h4>
                          <p className="text-gray-200">Learn by doing, not just watching. Build real projects that you can be proud of.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-500 rounded-full p-2 mt-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Always Supported</h4>
                          <p className="text-gray-200">Our AI mentor and community are always here to help. You're never alone on your journey.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-white/20 to-white/10 rounded-2xl p-8 border border-white/20">
                      <div className="text-6xl mb-4">❤️</div>
                      <h3 className="text-2xl font-bold text-white mb-4">Built with Love</h3>
                      <p className="text-gray-200 mb-6">
                        Every feature is crafted with genuine care because we truly believe in your potential.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-green-500/20 rounded-lg p-3">
                          <div className="text-green-300 font-bold">95%</div>
                          <div className="text-gray-200">Success Rate</div>
                        </div>
                        <div className="bg-blue-500/20 rounded-lg p-3">
                          <div className="text-blue-300 font-bold">24/7</div>
                          <div className="text-gray-200">AI Support</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Success Stories Preview */}
            <motion.section 
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  💫 Real People, Real Transformations
                </h2>
                <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                  These aren't just statistics - they're real people whose lives have been transformed by AI, just like yours can be.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Sarah",
                    role: "Marketing Manager",
                    quote: "AI helped me automate 60% of my work. I finally have time for strategy and creativity!",
                    result: "300% productivity boost",
                    icon: "📈"
                  },
                  {
                    name: "Marcus",
                    role: "Small Business Owner",
                    quote: "I thought AI was only for tech giants. Now I use it for everything in my business.",
                    result: "20 hours saved per week",
                    icon: "⏰"
                  },
                  {
                    name: "Emily",
                    role: "Freelance Designer",
                    quote: "Learning AI felt like playing a game. Now I'm the AI expert my clients rely on.",
                    result: "Doubled freelance rates",
                    icon: "💰"
                  }
                ].map((story, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-4xl mb-4">{story.icon}</div>
                    <p className="text-gray-200 leading-relaxed mb-4 italic">"{story.quote}"</p>
                    <div className="text-center">
                      <h4 className="text-white font-semibold">{story.name}</h4>
                      <p className="text-gray-400 text-sm mb-3">{story.role}</p>
                      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg p-2">
                        <p className="text-cyan-300 font-semibold text-sm">{story.result}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-purple-400/30">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Transform Your Life with AI?
                </h2>
                <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                  Join thousands who've already taken the leap. We're here to guide you every step of the way.
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
                        🚀 Start Your Journey Free
                      </motion.button>
                      <motion.button
                        className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full text-black font-bold text-lg shadow-xl border-2 border-yellow-400"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/contact'}
                      >
                        💬 Talk to Us First
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
                      📚 Continue Your Journey
                    </motion.button>
                  )}
                </div>
                
                <div className="mt-8 text-gray-300">
                  <p className="text-sm">
                    💝 Start free forever • ⚡ Instant access • 🛡️ Your trusted learning partner
                  </p>
                </div>
              </div>
            </motion.section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 