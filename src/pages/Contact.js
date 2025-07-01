import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoggedInNavbar from '../components/LoggedInNavbar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Create mailto link
      const mailtoLink = `mailto:kendellproduction@gmail.com?subject=${encodeURIComponent(`BeginningWithAI Contact: ${formData.subject}`)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`)}`;
      
      // Use window.location.href to avoid blank page issue
      window.location.href = mailtoLink;
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen text-white overflow-hidden"
      style={{ backgroundColor: '#2061a6' }}
    >
      {user ? <LoggedInNavbar /> : <Navbar />}

      {/* Star Animation Container */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ height: '100vh', width: '100vw' }}>
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
              key={`contact-star-${i}`}
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

      {/* Main content */}
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
                Let's <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Connect</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                Have questions? Need guidance? Want to share your AI journey? We're here to help and genuinely excited to hear from you.
              </p>
            </motion.div>

            {/* Promise section */}
            <motion.section 
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-green-400/30 text-center">
                <div className="text-6xl mb-6">🤝</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  We're Real People Who Genuinely Care
                </h2>
                <p className="text-lg text-gray-200 leading-relaxed max-w-4xl mx-auto">
                  AI transformed our lives, and we're passionate about helping it transform yours too. When you reach out, 
                  you're connecting with people who believe in your potential and are committed to your success.
                </p>
              </div>
            </motion.section>

            {/* Contact form and info */}
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
                  
                  {submitStatus === 'success' && (
                    <motion.div 
                      className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-green-200">
                        🎉 Thank you! Your message has been prepared and sent to BeginningWithAI. We'll get back to you soon!
                      </p>
                    </motion.div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <motion.div 
                      className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-red-200">
                        ❌ Sorry, there was an error sending your message. Please try again or email us directly at kendellproduction@gmail.com
                      </p>
                    </motion.div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        placeholder="What's this message about?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                        placeholder="Tell us how we can help you achieve new heights with AI..."
                      />
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                        isSubmitting 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500'
                      }`}
                      whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? 'Sending...' : '🚀 Send Message'}
                    </motion.button>
                  </form>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                
                {/* Quick Help */}
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl p-8 border border-blue-400/30">
                  <h3 className="text-2xl font-bold text-white mb-6">🚀 Need Quick Help?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">💡</div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Getting Started</h4>
                        <p className="text-gray-200 text-sm">New to AI? Take our adaptive quiz for a personalized learning path.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Learning Support</h4>
                        <p className="text-gray-200 text-sm">Stuck on a lesson? Let us guide you on your AI journey.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Times */}
                <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30">
                  <h3 className="text-2xl font-bold text-white mb-6">⏰ Response Times</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200">General Questions</span>
                      <span className="text-cyan-300 font-semibold">24 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200">Learning Support</span>
                      <span className="text-green-300 font-semibold">12 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200">Technical Issues</span>
                      <span className="text-yellow-300 font-semibold">6 hours</span>
                    </div>
                  </div>
                </div>

              </motion.div>

            </div>

            {/* Final message */}
            <motion.section 
              className="mt-20 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-indigo-400/30">
                <div className="text-6xl mb-6">🚀</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Your Success Is Our Success
                </h2>
                <p className="text-lg text-gray-200 leading-relaxed max-w-4xl mx-auto">
                  We're here to be your partners in transformation. Every question you ask makes our community stronger. 
                  Don't hesitate to reach out - we're genuinely excited to be part of your AI journey.
                </p>
              </div>
            </motion.section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 