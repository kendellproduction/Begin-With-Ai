import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SandboxAPIService from '../services/sandboxAPIService';

const InteractiveSandbox = ({ sandboxConfig, lessonId, onComplete }) => {
  const { user } = useAuth();
  const [sessionId] = useState(() => SandboxAPIService.generateSessionId());
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [promptHistory, setPromptHistory] = useState([]);
  const [usageCount, setUsageCount] = useState(0);
  const promptInputRef = useRef(null);

  // Clear session data when component unmounts or lesson changes
  useEffect(() => {
    return () => {
      // Clear any temporary data when leaving the sandbox
      setPromptHistory([]);
      setUsageCount(0);
    };
  }, [lessonId]);

  const handleSubmitPrompt = async () => {
    if (!prompt.trim() || isLoading) return;
    
    if (!user) {
      setError('Please log in to use the AI sandbox');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const context = {
        lessonId: lessonId,
        sandboxType: sandboxConfig?.type || 'general',
        userLevel: 'intermediate', // This could come from user profile
        provider: 'xai' // Prefer xAI Grok for educational content
      };

      const result = await SandboxAPIService.processSandboxPrompt(
        user.uid,
        sessionId,
        prompt,
        context
      );

      if (result.success) {
        setResponse(result.response);
        setPromptHistory(prev => [...prev, {
          prompt: prompt,
          response: result.response,
          timestamp: result.timestamp,
          provider: result.provider
        }]);
        setUsageCount(prev => prev + 1);
        setPrompt(''); // Clear the input
        
        // Call completion callback if provided
        if (onComplete) {
          onComplete({
            completed: true,
            promptsUsed: usageCount + 1,
            sessionId: sessionId
          });
        }
      } else {
        setError(result.error || 'Failed to get AI response');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitPrompt();
    }
  };

  const clearSandbox = () => {
    setPrompt('');
    setResponse('');
    setError('');
    setPromptHistory([]);
    setUsageCount(0);
    promptInputRef.current?.focus();
  };

  const insertExample = (examplePrompt) => {
    setPrompt(examplePrompt);
    promptInputRef.current?.focus();
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-xl font-bold text-white">AI Sandbox</h3>
          <span className="text-sm text-gray-400">
            {sandboxConfig?.type?.replace(/_/g, ' ')?.toUpperCase() || 'INTERACTIVE'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {usageCount}/10 prompts
          </span>
          <button
            onClick={clearSandbox}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Instructions */}
      {sandboxConfig?.instructions && (
        <div className="mb-4 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
          <p className="text-blue-200 text-sm leading-relaxed">
            {sandboxConfig.instructions}
          </p>
        </div>
      )}

      {/* Example prompts */}
      {sandboxConfig?.exercises?.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {sandboxConfig.exercises.slice(0, 3).map((exercise, index) => (
              <button
                key={index}
                onClick={() => insertExample(exercise.prompt || exercise.task || exercise.scenario)}
                className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs rounded-full transition-colors border border-purple-500/30"
              >
                {(exercise.prompt || exercise.task || exercise.scenario)?.substring(0, 30)}...
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="mb-4">
        <div className="relative">
          <textarea
            ref={promptInputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your prompt here... (Press Enter to send, Shift+Enter for new line)"
            className="w-full h-24 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
            maxLength={2000}
            disabled={isLoading}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {prompt.length}/2000
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-400">
            {sandboxConfig?.hints && sandboxConfig.hints.length > 0 && (
              <span>💡 Hint: {sandboxConfig.hints[0]}</span>
            )}
          </div>
          <button
            onClick={handleSubmitPrompt}
            disabled={!prompt.trim() || isLoading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Thinking...</span>
              </span>
            ) : (
              'Send to AI'
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="mb-4">
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-green-400 font-medium text-sm">AI Response</h4>
              <span className="text-xs text-gray-400">
                {promptHistory[promptHistory.length - 1]?.provider || 'AI'}
              </span>
            </div>
            <div className="text-white whitespace-pre-wrap leading-relaxed">
              {response}
            </div>
          </div>
        </div>
      )}

      {/* Prompt History */}
      {promptHistory.length > 1 && (
        <div className="mt-6">
          <details className="group">
            <summary className="text-gray-300 text-sm cursor-pointer hover:text-white transition-colors">
              View conversation history ({promptHistory.length} exchanges)
            </summary>
            <div className="mt-3 space-y-3 max-h-64 overflow-y-auto">
              {promptHistory.slice(0, -1).map((exchange, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-3 text-sm">
                  <div className="text-blue-300 mb-1">
                    <strong>You:</strong> {exchange.prompt}
                  </div>
                  <div className="text-green-300">
                    <strong>AI:</strong> {exchange.response.substring(0, 200)}
                    {exchange.response.length > 200 && '...'}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 leading-relaxed">
          🔒 Your prompts are processed securely and not stored permanently. 
          Each lesson session is isolated for your privacy.
        </p>
      </div>
    </div>
  );
};

export default InteractiveSandbox; 