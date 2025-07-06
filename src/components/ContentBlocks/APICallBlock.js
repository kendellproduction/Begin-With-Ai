import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const APICallBlock = ({ 
  content,
  config = {},
  onComplete = () => {},
  className = ""
}) => {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const inputRef = useRef(null);

  const defaultConfig = {
    enableAPI: false, // Set to false for demo mode in lesson builder
    showSystemPrompt: false,
    allowEdit: true,
    maxLength: 500,
    rateLimitMs: 2000
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Demo responses for when API is disabled (lesson preview mode)
  const getDemoResponse = (input, responseType) => {
    if (responseType === 'image') {
      // Return a placeholder image URL
      return 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=AI+Generated+Image';
    }
    
    // Simple demo text responses
    const demoResponses = [
      "This is a demo response from the AI assistant. In a real lesson, this would connect to an actual AI API.",
      "Great question! The AI would provide a helpful and educational response here.",
      "This interactive component allows students to practice asking AI questions and seeing responses.",
      "The AI assistant would analyze your input and provide a relevant, educational response."
    ];
    
    return demoResponses[Math.floor(Math.random() * demoResponses.length)];
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    setError('');
    setHasInteracted(true);
    
    try {
      if (finalConfig.enableAPI && content.apiEndpoint) {
        // Real API call (only when enabled)
        const apiResponse = await fetch(content.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_XAI_API_KEY}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: content.systemPrompt || 'You are a helpful AI assistant.'
              },
              {
                role: 'user',
                content: userInput
              }
            ],
            max_tokens: content.maxTokens || 150,
            temperature: content.temperature || 0.7
          })
        });

        if (!apiResponse.ok) {
          throw new Error(`API Error: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        
        if (content.responseType === 'image') {
          setImageUrl(data.url || data.data?.[0]?.url || '');
          setResponse('');
        } else {
          setResponse(data.choices?.[0]?.message?.content || 'No response received');
          setImageUrl('');
        }
      } else {
        // Demo mode - simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        if (content.responseType === 'image') {
          setImageUrl(getDemoResponse(userInput, 'image'));
          setResponse('');
        } else {
          setResponse(getDemoResponse(userInput, 'text'));
          setImageUrl('');
        }
      }

      // Track completion
      onComplete({
        type: 'api_call',
        input: userInput,
        hasResponse: true,
        responseType: content.responseType,
        timestamp: Date.now()
      });

    } catch (err) {
      console.error('API Call Error:', err);
      setError(finalConfig.enableAPI 
        ? 'Failed to get response from AI. Please try again.' 
        : 'Demo mode: Simulating API error for educational purposes.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearResponse = () => {
    setResponse('');
    setImageUrl('');
    setError('');
    setUserInput('');
    inputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`api-call-block bg-gray-800/50 rounded-lg p-6 border border-gray-700 ${className}`}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-2xl">🤖</div>
          <h3 className="text-lg font-semibold text-white">
            {content.title || 'AI Assistant'}
          </h3>
          {!finalConfig.enableAPI && (
            <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded">
              Demo Mode
            </span>
          )}
        </div>
        
        {content.prompt && (
          <p className="text-gray-300 text-sm">
            {content.prompt}
          </p>
        )}
      </div>

      {/* Input Area */}
      <div className="mb-4">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={content.placeholder || 'Type your question here...'}
            maxLength={finalConfig.maxLength}
            disabled={isLoading}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={!userInput.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send</span>
              </>
            )}
          </button>
        </div>
        
        {finalConfig.maxLength && (
          <div className="text-xs text-gray-400 mt-1 text-right">
            {userInput.length}/{finalConfig.maxLength}
          </div>
        )}
      </div>

      {/* Response Area */}
      <AnimatePresence>
        {(response || imageUrl || error || isLoading) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-700 pt-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-300">
                {content.responseType === 'image' ? 'Generated Image' : 'AI Response'}
              </h4>
              {(response || imageUrl) && (
                <button
                  onClick={clearResponse}
                  className="text-xs text-gray-400 hover:text-gray-300 flex items-center space-x-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="bg-gray-700/50 rounded-lg p-4 flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-300">
                  {content.responseType === 'image' ? 'Generating image...' : 'Generating response...'}
                </span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Text Response */}
            {response && !isLoading && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {response}
                </p>
              </div>
            )}

            {/* Image Response */}
            {imageUrl && !isLoading && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <img
                  src={imageUrl}
                  alt="AI Generated"
                  className="max-w-full h-auto rounded-lg mx-auto"
                  onError={() => setError('Failed to load generated image')}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* System Prompt Display (Optional) */}
      {finalConfig.showSystemPrompt && content.systemPrompt && (
        <details className="mt-4">
          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
            View System Instructions
          </summary>
          <div className="mt-2 p-3 bg-gray-800/50 rounded text-xs text-gray-300 font-mono">
            {content.systemPrompt}
          </div>
        </details>
      )}

      {/* Interaction Stats */}
      {hasInteracted && (
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>✓ Interaction completed</span>
            <span>
              {content.responseType === 'image' ? 'Image generation' : 'Text response'} • 
              {content.maxTokens} max tokens
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default APICallBlock; 