import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import SandboxAPIService from '../../services/sandboxAPIService';

const SandboxSlide = ({ slide, onComplete, onNext, isActive }) => {
  const { user } = useAuth();
  const { title, instruction, scenario, suggestedPrompt, successCriteria } = slide.content;
  const [showInstructions, setShowInstructions] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [promptCount, setPromptCount] = useState(0);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionId] = useState(() => SandboxAPIService.generateSessionId());

  const MAX_PROMPTS_PER_LESSON = 3;
  const MAX_DAILY_PROMPTS = 15;

  // Load daily usage on component mount
  useEffect(() => {
    if (user) {
      loadDailyUsage();
    }
  }, [user]);

  const loadDailyUsage = async () => {
    try {
      // Get today's usage count from localStorage (fallback) or could be from Firestore
      const today = new Date().toDateString();
      const stored = localStorage.getItem(`daily_prompts_${today}`);
      const usage = stored ? parseInt(stored) : 0;
      setDailyUsage(usage);
    } catch (error) {
      console.error('Error loading daily usage:', error);
    }
  };

  const updateDailyUsage = () => {
    const today = new Date().toDateString();
    const newUsage = dailyUsage + 1;
    setDailyUsage(newUsage);
    localStorage.setItem(`daily_prompts_${today}`, newUsage.toString());
  };

  const handleStartPractice = () => {
    setShowInstructions(false);
    if (suggestedPrompt) {
      setUserInput(suggestedPrompt);
    }
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setError('Please enter your prompt');
      return;
    }

    if (!user) {
      setError('Please log in to use the AI sandbox');
      return;
    }

    // Check daily limit
    if (dailyUsage >= MAX_DAILY_PROMPTS) {
      setShowLimitModal(true);
      return;
    }

    // Check lesson limit
    if (promptCount >= MAX_PROMPTS_PER_LESSON) {
      setError(`You've reached the maximum of ${MAX_PROMPTS_PER_LESSON} prompts for this lesson`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Add user message to conversation
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: userInput.trim(),
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, userMessage]);
      setUserInput('');

      // Send to AI
      const context = {
        lessonId: slide.id,
        sandboxType: 'ai_game_generator', // or get from slide config
        userLevel: 'intermediate'
      };

      const result = await SandboxAPIService.processSandboxPrompt(
        user.uid,
        sessionId,
        userMessage.content,
        context
      );

      if (result.success) {
        // Add AI response to conversation
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: result.response,
          timestamp: new Date(),
          provider: result.provider
        };
        
        setConversation(prev => [...prev, aiMessage]);
        setPromptCount(prev => prev + 1);
        updateDailyUsage();
      } else {
        setError(result.error || 'Failed to get AI response');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndLesson = () => {
    setIsComplete(true);
    onComplete(slide.id, {
      conversation: conversation,
      promptsUsed: promptCount,
      completed: true
    });
  };

  // Daily limit modal
  const DailyLimitModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-4 text-center"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="text-6xl mb-6">⏰</div>
        <h3 className="text-2xl font-bold text-white mb-4">Daily Limit Reached</h3>
        <p className="text-slate-300 mb-6 leading-relaxed">
          You've used your {MAX_DAILY_PROMPTS} AI prompts for today. Come back tomorrow for more creative adventures!
        </p>
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-4 mb-6">
          <p className="text-cyan-200 font-semibold">
            {dailyUsage} / {MAX_DAILY_PROMPTS} prompts used today
          </p>
        </div>
        <button
          onClick={() => setShowLimitModal(false)}
          className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/30 transform hover:scale-105"
        >
          Understood ✨
        </button>
      </motion.div>
    </div>
  );

  if (showInstructions) {
    return (
      <>
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-8xl mb-8">🎮</div>
            <h2 className="text-5xl font-bold text-white mb-6">{title}</h2>
            <p className="text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto">{instruction}</p>
          </motion.div>

          {/* Goal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-8"
            style={{
              boxShadow: '0 8px 32px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-3xl font-bold text-white">Your Mission</h3>
            </div>
            <p className="text-cyan-100 text-xl leading-relaxed">
              {scenario || "Create a prompt that generates a complete, playable browser game. Your prompt should describe the game mechanics, visual style, and player interactions clearly enough for AI to build it perfectly."}
            </p>
          </motion.div>

          {/* Stats & Instructions - Stacked */}
          <div className="space-y-8">
            {/* Usage Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-3xl p-6"
              style={{
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <span className="text-white text-lg">📊</span>
                </div>
                <h3 className="text-xl font-bold text-white">Your Progress</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/20 rounded-xl p-3">
                  <div className="text-center">
                    <span className="text-emerald-200 text-sm font-medium block mb-1">This Lesson</span>
                    <span className="text-white font-bold text-lg">{promptCount} / {MAX_PROMPTS_PER_LESSON}</span>
                  </div>
                </div>
                <div className="bg-emerald-500/20 rounded-xl p-3">
                  <div className="text-center">
                    <span className="text-emerald-200 text-sm font-medium block mb-1">Daily Usage</span>
                    <span className="text-white font-bold text-lg">{dailyUsage} / {MAX_DAILY_PROMPTS}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* How to Use Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-6"
              style={{
                boxShadow: '0 8px 32px rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="text-white text-lg">📝</span>
                </div>
                <h3 className="text-xl font-bold text-white">How to Use This AI Tool</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-500/20 rounded-xl p-4">
                  <h4 className="font-bold text-white mb-2 text-sm">Step 1: Create Your Prompt</h4>
                  <p className="text-purple-100 text-sm leading-relaxed">Write a detailed description. Be specific about controls, visuals, and game mechanics.</p>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-4">
                  <h4 className="font-bold text-white mb-2 text-sm">Step 2: Wait for AI Response</h4>
                  <p className="text-purple-100 text-sm leading-relaxed">ChatGPT will generate your code. This takes 10-30 seconds depending on complexity.</p>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-4">
                  <h4 className="font-bold text-white mb-2 text-sm">Step 3: Refine if Needed</h4>
                  <p className="text-purple-100 text-sm leading-relaxed">Not perfect? Create another prompt to modify or improve specific aspects.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center pt-4"
          >
            <button
              onClick={handleStartPractice}
              className="px-16 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-3xl font-bold text-2xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/30 transform hover:scale-105"
            >
              Start Creating 🚀
            </button>
          </motion.div>
        </div>
        
        {showLimitModal && <DailyLimitModal />}
      </>
    );
  }

  if (isComplete) {
    return (
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">Excellent Work!</h2>
          <p className="text-gray-300 mb-4">You've completed the AI sandbox practice!</p>
          
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-600/50">
            <div className="text-sm text-slate-300 space-y-1">
              <div>💬 Prompts used: <span className="text-white font-medium">{promptCount}</span></div>
              <div>🤖 AI responses: <span className="text-white font-medium">{conversation.filter(m => m.type === 'ai').length}</span></div>
            </div>
          </div>
          
          <motion.button
            onClick={onNext}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold shadow-lg transition-all duration-300"
          >
            Continue to Next Section →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Main sandbox interface
  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Goal Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6"
          style={{
            boxShadow: '0 8px 32px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <span className="text-white text-lg">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Your Mission</h3>
          </div>
          <p className="text-cyan-100 text-lg leading-relaxed">
            {scenario || "Create a prompt that generates a complete, playable browser game. Your prompt should describe the game mechanics, visual style, and player interactions clearly enough for AI to build it perfectly."}
          </p>
          
          {/* Usage Stats */}
          <div className="mt-4 flex items-center justify-between bg-black/20 rounded-lg px-4 py-2">
            <div className="text-cyan-200 text-sm">
              <span className="opacity-70">Prompts Used:</span> <span className="font-semibold">{promptCount} / {MAX_PROMPTS_PER_LESSON}</span>
            </div>
            <div className="text-cyan-200 text-sm">
              <span className="opacity-70">Daily:</span> <span className="font-semibold">{dailyUsage} / {MAX_DAILY_PROMPTS}</span>
            </div>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6"
          style={{
            boxShadow: '0 8px 32px rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white text-lg">💡</span>
            </div>
            <h3 className="text-xl font-bold text-white">Pro Tips</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-purple-100 text-sm">Be specific about player controls (arrow keys, mouse clicks)</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-purple-100 text-sm">Describe the visual style (colors, shapes, themes)</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-purple-100 text-sm">Include win/lose conditions and scoring</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-purple-100 text-sm">Ask for a complete HTML file with embedded code</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl overflow-hidden"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Header for output area */}
          <div className="bg-slate-700/50 px-6 py-3 border-b border-slate-600/50">
            <h3 className="text-white font-semibold flex items-center space-x-2">
              <span className="text-lg">💬</span>
              <span>AI Conversation & Output</span>
            </h3>
            <p className="text-slate-300 text-sm mt-1">Your prompts and ChatGPT's responses will appear below</p>
          </div>
          
          {/* Chat Messages Area */}
          <div className="h-80 overflow-y-auto p-6 space-y-4">
            {conversation.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤖</div>
                <p className="text-slate-300 text-lg mb-6">Ready to create something amazing?</p>
                {suggestedPrompt && (
                  <button
                    onClick={() => setUserInput(suggestedPrompt)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
                  >
                    ✨ Use Auto Prompt
                  </button>
                )}
              </div>
            )}
            
            <AnimatePresence>
              {conversation.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-6 py-4 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30' 
                      : 'bg-slate-700/60 text-slate-100 backdrop-blur-sm'
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-3 opacity-70 ${
                      message.type === 'user' ? 'text-cyan-100' : 'text-slate-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {message.type === 'ai' && message.provider && (
                        <span className="ml-2">• {message.provider}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-slate-700/60 backdrop-blur-sm rounded-2xl px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-slate-300 text-sm">AI is creating your game...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Enhanced Input Area */}
          <div className="bg-slate-800/60 backdrop-blur-sm p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 backdrop-blur-sm rounded-xl">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Large prompt input */}
              <div className="relative">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSubmit();
                    }
                  }}
                  placeholder={promptCount >= MAX_PROMPTS_PER_LESSON ? "You've reached the prompt limit for this lesson" : "Describe your game idea in detail - be specific about controls, visuals, and gameplay! (Press Enter to send, Shift+Enter for new line)"}
                  disabled={promptCount >= MAX_PROMPTS_PER_LESSON || isLoading}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  className="w-full h-32 bg-slate-700/50 backdrop-blur-sm rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed text-lg leading-relaxed"
                  style={{
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                  {userInput.length > 0 && (
                    <span className="text-cyan-400">
                      {userInput.length} characters
                    </span>
                  )}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  {suggestedPrompt && (
                    <button
                      onClick={() => setUserInput(suggestedPrompt)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-purple-500/30"
                    >
                      🎯 Auto Prompt
                    </button>
                  )}
                  <button
                    onClick={() => setUserInput('')}
                    className="px-4 py-2 bg-slate-600/50 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-all duration-300"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  {promptCount > 0 && (
                    <button
                      onClick={handleEndLesson}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-green-600 transition-all duration-300 shadow-lg shadow-green-500/30"
                    >
                      Complete Lesson ✓
                    </button>
                  )}
                  
                  <button
                    onClick={handleSubmit}
                    disabled={!userInput.trim() || promptCount >= MAX_PROMPTS_PER_LESSON || isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/30 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <span className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </span>
                    ) : (
                      'Send to AI 🚀'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showLimitModal && <DailyLimitModal />}
    </>
  );
};

export default SandboxSlide; 