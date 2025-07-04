import React from 'react';
import { motion } from 'framer-motion';
import LoggedInNavbar from '../components/LoggedInNavbar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const Features = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="glass-hero rounded-3xl p-8 mb-8 mx-auto max-w-4xl">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Powerful <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI Features</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                  Discover the comprehensive tools and features that make BeginningWithAI the most effective platform for learning artificial intelligence
                </p>
              </div>
            </motion.div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="glass-card rounded-2xl p-6 relative"
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
                  <div className="glass-surface rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold text-sm">✨ {feature.benefit}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Learning Experience */}
            <motion.section 
              className="mt-24"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="glass-accent rounded-3xl p-8 mx-auto max-w-6xl">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-6">
                    🎯 Complete Learning Experience
                  </h2>
                  <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
                    Every feature works together to create the most comprehensive AI learning platform
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: "📚", title: "Structured Curriculum", desc: "Progressive lessons from basics to advanced" },
                    { icon: "🤖", title: "AI-Powered Feedback", desc: "Instant, personalized guidance" },
                    { icon: "💻", title: "Hands-on Practice", desc: "Real coding in browser sandbox" },
                    { icon: "🏆", title: "Achievement System", desc: "Track progress and earn rewards" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="glass-surface rounded-2xl p-6 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="text-3xl mb-3">{item.icon}</div>
                      <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-gray-300 text-sm">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Testimonials */}
            <motion.section 
              className="mt-24"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-6">
                  What Learners Say About Our <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Features</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: "Sarah Chen",
                    role: "Data Scientist",
                    text: "The AI feedback feature is incredible. It's like having a personal mentor available 24/7.",
                    rating: 5
                  },
                  {
                    name: "Marcus Johnson",
                    role: "Software Engineer", 
                    text: "The hands-on coding environment made learning AI concepts so much easier to understand.",
                    rating: 5
                  },
                  {
                    name: "Elena Rodriguez",
                    role: "Product Manager",
                    text: "From complete beginner to building my first AI project in just 6 weeks. Amazing platform!",
                    rating: 5
                  }
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className="glass-secondary rounded-2xl p-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-200 mb-4 italic">"{testimonial.text}"</p>
                    <div className="glass-surface rounded-lg p-3">
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-purple-300">{testimonial.role}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
              className="mt-24"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="glass-primary rounded-3xl p-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Experience These Features?
                </h2>
                <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
                  Join thousands of learners who are already mastering AI with our comprehensive platform
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button 
                    onClick={() => navigate('/signup')}
                    className="glass-button bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🚀 Start Learning Free
                  </motion.button>
                  <motion.button 
                    onClick={() => navigate('/lessons')}
                    className="glass-secondary border-2 border-white/20 hover:border-white/40 text-white font-semibold py-4 px-8 rounded-full text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔍 Explore Lessons
                  </motion.button>
                </div>
              </div>
            </motion.section>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Features; 