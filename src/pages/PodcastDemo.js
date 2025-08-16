import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoggedInNavbar from '../components/LoggedInNavbar';
import PodcastPlayer from '../components/PodcastPlayer';
import OptimizedStarField from '../components/OptimizedStarField';

const PodcastDemo = () => {
  // Demo podcast data
  const podcastData = {
    audioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", // Demo audio (replace with real podcast)
    title: "Introduction to AI Prompt Engineering",
    instructor: "Dr. Sarah Chen",
    chapters: [
      { title: "Welcome & Overview", startTime: 0, endTime: 120 },
      { title: "What is Prompt Engineering?", startTime: 120, endTime: 300 },
      { title: "Best Practices", startTime: 300, endTime: 480 },
      { title: "Common Mistakes", startTime: 480, endTime: 600 },
      { title: "Hands-on Examples", startTime: 600, endTime: 900 }
    ]
  };

  // Demo lesson content blocks with enhanced 3D glass effects
  const contentBlocks = [
    {
      id: 1,
      type: 'text',
      title: 'Welcome to AI Prompt Engineering',
      icon: '🚀',
      glassColor: 'rgba(6, 182, 212, 0.01)', // ultra-transparent cyan - almost invisible
      borderColor: 'rgba(34, 211, 238, 0.3)',
      shadowColor: 'rgba(6, 182, 212, 0.2)',
      content: `Welcome to this comprehensive lesson on AI Prompt Engineering! In this session, you'll learn the fundamental skills needed to effectively communicate with AI systems and get the results you want.
      
This lesson combines audio instruction with interactive content. You can listen to the podcast and read the content at your own pace - they complement each other but don't need to be perfectly synchronized.`
    },
    {
      id: 2,
      type: 'text',
      title: 'What is Prompt Engineering?',
      icon: '🧠',
      glassColor: 'rgba(168, 85, 247, 0.01)', // ultra-transparent purple - almost invisible
      borderColor: 'rgba(196, 181, 253, 0.3)',
      shadowColor: 'rgba(168, 85, 247, 0.2)',
      content: `Prompt engineering is the practice of designing and optimizing text prompts to effectively communicate with AI language models. It's both an art and a science that involves:

• **Clarity**: Making your requests crystal clear
• **Context**: Providing the right amount of background information  
• **Structure**: Organizing your prompts for optimal results
• **Iteration**: Refining prompts based on AI responses`
    },
    {
      id: 3,
      type: 'interactive',
      title: 'Quick Check: Prompt Quality',
      icon: '💡',
      glassColor: 'rgba(245, 158, 11, 0.01)', // ultra-transparent amber - almost invisible
      borderColor: 'rgba(252, 211, 77, 0.3)',
      shadowColor: 'rgba(245, 158, 11, 0.2)',
      content: `Let's test your understanding. Which of these prompts is better structured?

**Option A:** "Write something about dogs"
**Option B:** "Write a 200-word informative paragraph about golden retriever care tips for new dog owners, focusing on exercise, grooming, and training."

The answer is B - it's specific, includes word count, target audience, and clear scope.`
    },
    {
      id: 4,
      type: 'text',
      title: 'Common Prompt Engineering Mistakes',
      icon: '⚠️',
      glassColor: 'rgba(16, 185, 129, 0.01)', // ultra-transparent emerald - almost invisible
      borderColor: 'rgba(52, 211, 153, 0.3)',
      shadowColor: 'rgba(16, 185, 129, 0.2)',
      content: `Even experienced users make these common mistakes:

🚫 **Being too vague**: "Help me with coding"
✅ **Being specific**: "Help me debug this JavaScript function that should calculate tax"

🚫 **No context**: "Translate this"
✅ **With context**: "Translate this business email from English to Spanish, maintaining professional tone"

🚫 **One-shot prompts**: Expecting perfection on the first try
✅ **Iterative approach**: Refining prompts based on results`
    },
    {
      id: 5,
      type: 'sandbox',
      title: 'Practice: Build Your First Prompt',
      icon: '⚡',
      glassColor: 'rgba(139, 92, 246, 0.01)', // ultra-transparent violet - almost invisible
      borderColor: 'rgba(196, 181, 253, 0.3)',
      shadowColor: 'rgba(139, 92, 246, 0.2)',
      content: `Now it's your turn! Use the sandbox below to practice prompt engineering. Try creating a prompt that asks AI to help you plan a birthday party.

Include:
- Who the party is for (age, interests)
- Budget constraints  
- Number of guests
- Any special requirements

Click "Test Prompt" to see how the AI responds, then refine your approach.`
    },
    {
      id: 6,
      type: 'text',
      title: 'Advanced Techniques',
      icon: '🎯',
      glassColor: 'rgba(59, 130, 246, 0.01)', // ultra-transparent blue - almost invisible
      borderColor: 'rgba(147, 197, 253, 0.3)',
      shadowColor: 'rgba(59, 130, 246, 0.2)',
      content: `Once you master the basics, try these advanced techniques:

**Chain of Thought**: Ask AI to show its reasoning
Example: "Solve this step by step, showing your work: If a store offers 20% off and then an additional 10% off the discounted price..."

**Few-Shot Learning**: Provide examples of desired output
Example: "Translate these phrases. English: Hello → Spanish: Hola. English: Thank you → Spanish: Gracias. English: Good morning → Spanish: ?"

**Role Playing**: Ask AI to take on a specific perspective
Example: "You are a financial advisor. A 25-year-old just got their first job. What investment advice would you give?"`
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black text-white overflow-hidden">
      <LoggedInNavbar />
      
      <OptimizedStarField starCount={220} opacity={1} speed={1.5} size={1} />

      {/* Floating Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              width: 150 + Math.random() * 250,
              height: 150 + Math.random() * 250,
              background: `radial-gradient(circle, ${
                ['rgba(59, 130, 246, 0.1)', 'rgba(147, 51, 234, 0.1)', 'rgba(236, 72, 153, 0.1)', 'rgba(16, 185, 129, 0.1)'][i % 4]
              } 0%, transparent 70%)`,
              filter: 'blur(30px)',
            }}
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: 25 + Math.random() * 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>
      
      {/* Header with Glass Effect */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight py-2">
              🎧 Introduction to AI Prompt Engineering
            </h1>
            <p className="text-xl text-slate-200 mb-6 leading-relaxed max-w-3xl mx-auto">
              Master the art of communicating with AI systems effectively. This comprehensive lesson combines podcast discussion with hands-on exercises to build your prompt engineering skills.
            </p>
          </div>
          
          <div 
            className="relative backdrop-blur-sm rounded-3xl p-6 border max-w-2xl mx-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.01)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              borderWidth: '0.5px',
              boxShadow: `
                0 4px 16px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div 
                className="flex items-center justify-center space-x-2 rounded-xl py-3 px-4 backdrop-blur-sm border"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.01)', 
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: '0.5px'
                }}
              >
                <span className="text-2xl">📻</span>
                <span className="text-gray-300">Listen at your pace</span>
              </div>
              <div 
                className="flex items-center justify-center space-x-2 rounded-xl py-3 px-4 backdrop-blur-sm border"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.01)', 
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: '0.5px'
                }}
              >
                <span className="text-2xl">📖</span>
                <span className="text-gray-300">Interactive content</span>
              </div>
              <div 
                className="flex items-center justify-center space-x-2 rounded-xl py-3 px-4 backdrop-blur-sm border"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.01)', 
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: '0.5px'
                }}
              >
                <span className="text-2xl">🎯</span>
                <span className="text-gray-300">Perfect synergy</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced 3D Glass Content Blocks */}
      <div className="relative z-10 container mx-auto px-4 pb-32">
        <div className="max-w-5xl mx-auto space-y-12">
          {contentBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 40, rotateX: 15, z: -100 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
              transition={{ 
                duration: 1, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 80,
                damping: 20
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.01,
                rotateX: -3,
                z: 50,
                transition: { duration: 0.4, type: "spring", stiffness: 300 }
              }}
              className="relative group perspective-1000 transform-gpu"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Ultra-Glossy 3D Glass Card */}
              <div
                className="relative backdrop-blur-sm rounded-3xl p-8 border transition-all duration-500 transform-gpu"
                style={{
                  background: block.glassColor,
                  borderColor: block.borderColor,
                  borderWidth: '0.5px',
                  boxShadow: `
                    0 12px 32px rgba(0, 0, 0, 0.12),
                    0 6px 16px rgba(0, 0, 0, 0.08),
                    inset 0 2px 0 rgba(255, 255, 255, 0.2),
                    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
                    inset 1px 0 0 rgba(255, 255, 255, 0.1),
                    inset -1px 0 0 rgba(255, 255, 255, 0.05),
                    0 0 30px ${block.shadowColor}
                  `,
                  transform: 'translateZ(30px)',
                }}
              >
                {/* Enhanced Glass Surface Highlights */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-30 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.15) 0%, 
                        rgba(255, 255, 255, 0.08) 25%, 
                        transparent 50%, 
                        rgba(255, 255, 255, 0.03) 75%, 
                        transparent 100%
                      )
                    `,
                  }}
                ></div>

                {/* Top Glass Reflection */}
                <div 
                  className="absolute top-0 left-4 right-4 h-12 rounded-t-3xl opacity-40 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%)',
                  }}
                ></div>

                {/* Side Glass Reflections */}
                <div 
                  className="absolute top-4 left-0 bottom-4 w-1 rounded-l-3xl opacity-30 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)',
                  }}
                ></div>

                {/* Intense Floating Border Glow */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 blur-md -z-10"
                  style={{
                    background: `linear-gradient(45deg, ${block.borderColor}, ${block.shadowColor}, ${block.borderColor})`,
                    transform: 'translateZ(-15px) scale(1.02)',
                  }}
                ></div>

                {/* Secondary Glow Layer */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 blur-xl -z-20"
                  style={{
                    background: `radial-gradient(ellipse at center, ${block.shadowColor} 0%, transparent 70%)`,
                    transform: 'translateZ(-25px) scale(1.05)',
                  }}
                ></div>

                {/* Content Block Header */}
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-6">
                    <div 
                      className="text-5xl transform group-hover:scale-110 transition-transform duration-300"
                      style={{ 
                        transform: 'translateZ(40px)',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
                      }}
                    >
                      {block.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                        {block.title}
                      </h2>
                      <div className="flex items-center space-x-3 text-gray-300">
                        <span 
                          className="text-sm px-3 py-1 rounded-full backdrop-blur-sm border"
                          style={{ 
                            background: 'rgba(255, 255, 255, 0.02)', 
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            borderWidth: '0.5px',
                            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          Section {index + 1}
                        </span>
                        <span className="text-xs opacity-75">
                          {block.type === 'sandbox' ? 'Interactive Practice' : 
                           block.type === 'interactive' ? 'Knowledge Check' : 'Learning Content'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="prose prose-invert prose-lg max-w-none">
                    {block.type === 'sandbox' ? (
                      <div className="space-y-6">
                        <p className="text-gray-100 leading-relaxed whitespace-pre-line text-lg">
                          {block.content}
                        </p>
                        
                        {/* Ultra-Glossy Futuristic Sandbox */}
                        <div className="relative">
                          <div 
                            className="absolute inset-0 rounded-2xl blur-xl"
                            style={{ background: 'rgba(139, 92, 246, 0.08)' }}
                          ></div>
                          <div 
                            className="relative backdrop-blur-sm rounded-2xl p-6 border"
                            style={{
                              background: 'rgba(0, 0, 0, 0.05)',
                              borderColor: 'rgba(139, 92, 246, 0.25)',
                              borderWidth: '0.5px',
                              boxShadow: `
                                inset 0 2px 0 rgba(255, 255, 255, 0.15),
                                inset 0 -1px 0 rgba(255, 255, 255, 0.08),
                                inset 1px 0 0 rgba(255, 255, 255, 0.08),
                                0 6px 20px rgba(0, 0, 0, 0.15),
                                0 0 25px rgba(139, 92, 246, 0.2)
                              `,
                            }}
                          >
                            {/* Sandbox Glass Highlights */}
                            <div 
                              className="absolute top-0 left-2 right-2 h-8 rounded-t-2xl opacity-30 pointer-events-none"
                              style={{
                                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)',
                              }}
                            ></div>

                            <div className="mb-4 relative z-10">
                              <label className="block text-sm font-medium text-violet-300 mb-3 flex items-center space-x-2">
                                <span className="text-lg">⚡</span>
                                <span>AI Prompt Sandbox</span>
                              </label>
                              <textarea
                                className="w-full p-4 text-white rounded-xl border focus:outline-none focus:ring-2 resize-none backdrop-blur-lg transition-all duration-300"
                                style={{
                                  background: 'rgba(17, 24, 39, 0.15)',
                                  borderColor: 'rgba(139, 92, 246, 0.3)',
                                  focusBorderColor: 'rgba(139, 92, 246, 0.5)',
                                  focusRingColor: 'rgba(139, 92, 246, 0.25)',
                                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)'
                                }}
                                rows="5"
                                placeholder="Type your AI prompt here... Be specific and clear!"
                              />
                            </div>
                            <div className="flex space-x-4 relative z-10">
                              <button 
                                className="flex-1 px-6 py-3 text-white rounded-xl transition-all duration-300 transform hover:scale-105 font-medium backdrop-blur-lg"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(168, 85, 247, 0.6))',
                                  boxShadow: `
                                    0 6px 20px rgba(139, 92, 246, 0.25),
                                    inset 0 1px 0 rgba(255, 255, 255, 0.2),
                                    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                                  `,
                                }}
                              >
                                ⚡ Test Prompt
                              </button>
                              <button 
                                className="px-6 py-3 text-white rounded-xl transition-all duration-300 backdrop-blur-lg"
                                style={{ 
                                  background: 'rgba(75, 85, 99, 0.25)',
                                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)'
                                }}
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : block.type === 'interactive' ? (
                      <div className="space-y-6">
                        <p className="text-gray-100 leading-relaxed whitespace-pre-line text-lg">
                          {block.content}
                        </p>
                        <div className="relative">
                          <div 
                            className="absolute inset-0 rounded-2xl blur-xl"
                            style={{ background: 'rgba(245, 158, 11, 0.08)' }}
                          ></div>
                          <div 
                            className="relative backdrop-blur-sm rounded-2xl p-6 border"
                            style={{
                              background: 'rgba(0, 0, 0, 0.05)',
                              borderColor: 'rgba(245, 158, 11, 0.25)',
                              borderWidth: '0.5px',
                              boxShadow: `
                                inset 0 2px 0 rgba(255, 255, 255, 0.15),
                                inset 0 -1px 0 rgba(255, 255, 255, 0.08),
                                inset 1px 0 0 rgba(255, 255, 255, 0.08),
                                0 6px 20px rgba(0, 0, 0, 0.15),
                                0 0 25px rgba(245, 158, 11, 0.2)
                              `,
                            }}
                          >
                            {/* Interactive Glass Highlights */}
                            <div 
                              className="absolute top-0 left-2 right-2 h-8 rounded-t-2xl opacity-30 pointer-events-none"
                              style={{
                                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)',
                              }}
                            ></div>

                            <div className="flex items-center space-x-3 text-amber-300 mb-4 relative z-10">
                              <span className="text-2xl">💡</span>
                              <span className="font-medium text-lg">Interactive Knowledge Check</span>
                            </div>
                            <button 
                              className="w-full px-6 py-3 text-white rounded-xl transition-all duration-300 transform hover:scale-105 font-medium backdrop-blur-lg relative z-10"
                              style={{
                                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.6), rgba(251, 191, 36, 0.6))',
                                boxShadow: `
                                  0 6px 20px rgba(245, 158, 11, 0.25),
                                  inset 0 1px 0 rgba(255, 255, 255, 0.2),
                                  inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                                `,
                              }}
                            >
                              Reveal Answer & Explanation
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-100 leading-relaxed whitespace-pre-line text-lg">
                        {block.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Ultra-Clear Conclusion Block */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.2, delay: contentBlocks.length * 0.15 }}
            className="relative group perspective-1000"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div 
              className="absolute inset-0 rounded-3xl blur-2xl"
              style={{ background: 'rgba(16, 185, 129, 0.08)' }}
            ></div>
            <div 
              className="relative backdrop-blur-sm rounded-3xl p-8 border"
              style={{
                background: 'rgba(16, 185, 129, 0.01)',
                borderColor: 'rgba(52, 211, 153, 0.2)',
                borderWidth: '0.5px',
                boxShadow: `
                  0 12px 30px rgba(0, 0, 0, 0.1),
                  0 6px 12px rgba(0, 0, 0, 0.08),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1),
                  inset 0 -1px 0 rgba(255, 255, 255, 0.03),
                  0 0 25px rgba(16, 185, 129, 0.15)
                `,
                transform: 'translateZ(30px)',
              }}
            >
              <div className="text-center">
                <div 
                  className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-500"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  🎉
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
                  Mission Accomplished!
                </h2>
                <p className="text-xl text-gray-100 leading-relaxed mb-6 max-w-2xl mx-auto">
                  You've mastered the fundamentals of AI prompt engineering! The podcast provides additional insights and real-world examples that perfectly complement these hands-on materials.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    className="px-8 py-4 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 font-medium text-lg backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.6), rgba(5, 150, 105, 0.6))',
                      boxShadow: '0 6px 16px rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    🚀 Next Lesson Adventure
                  </button>
                  <button 
                    className="px-8 py-4 text-white rounded-2xl transition-all duration-300 backdrop-blur-sm border font-medium text-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    🎯 Practice More
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Podcast Player */}
      <PodcastPlayer
        audioUrl={podcastData.audioUrl}
        title={podcastData.title}
        instructor={podcastData.instructor}
        chapters={podcastData.chapters}
        isSticky={true}
      />
    </div>
  );
};

export default PodcastDemo; 