import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from '../../utils/framerMotion';
import InteractiveSandbox from '../InteractiveSandbox';

const SandboxBlock = ({ 
  content,
  config = {},
  onComplete = () => {},
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [executionCount, setExecutionCount] = useState(0);
  const blockRef = useRef(null);

  const defaultConfig = {
    isolationLevel: 'strict',
    timeout: 30000,
    allowedModules: [],
    language: 'javascript',
    showInstructions: true,
    expandable: true,
    autoRun: false,
    showHints: true,
    trackAttempts: true
  };

  const finalConfig = { ...defaultConfig, ...config };

  const handleCodeExecution = (result) => {
    setExecutionResult(result);
    setHasInteracted(true);
    setExecutionCount(prev => prev + 1);
    
    // Enhanced completion tracking
    onComplete({ 
      type: 'sandbox', 
      executed: true, 
      result,
      attempts: executionCount + 1,
      code: result.code || '',
      output: result.output || '',
      success: !result.error,
      timestamp: Date.now() 
    });
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Get status based on execution result
  const getExecutionStatus = () => {
    if (!executionResult) return null;
    
    if (executionResult.error) {
      return {
        color: 'text-red-300',
        bg: 'bg-red-500/10 border-red-500/30',
        icon: '❌',
        message: 'Code execution failed - check for errors'
      };
    } else {
      return {
        color: 'text-green-300',
        bg: 'bg-green-500/10 border-green-500/30',
        icon: '✅',
        message: 'Code executed successfully'
      };
    }
  };

  const status = getExecutionStatus();

  return (
    <motion.div
      ref={blockRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`sandbox-block ${className}`}
    >
      <div className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-gray-600/30 overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl animate-pulse">⚡</div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {content.title || 'Interactive Code Sandbox'}
                </h3>
                <div className="flex items-center space-x-3 mt-1">
                  <p className="text-sm text-gray-400">
                    {finalConfig.language.toUpperCase()} • Secure Execution
                  </p>
                  {finalConfig.trackAttempts && executionCount > 0 && (
                    <span className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full">
                      {executionCount} attempt{executionCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {finalConfig.showHints && content.hints && (
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="p-2 text-gray-400 hover:text-blue-300 transition-colors rounded-lg hover:bg-blue-500/10"
                  title="Toggle hints"
                >
                  💡
                </button>
              )}
              
              {finalConfig.expandable && (
                <button
                  onClick={handleExpand}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-500/20"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? '📦' : '🔍'}
                </button>
              )}
            </div>
          </div>

          {/* Instructions */}
          {finalConfig.showInstructions && content.instructions && (
            <div className="mt-4 p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg">
              <p className="text-violet-200 text-sm leading-relaxed">
                {content.instructions}
              </p>
            </div>
          )}

          {/* Hints Panel */}
          <AnimatePresence>
            {showHints && content.hints && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-yellow-300">💡</span>
                  <span className="text-sm font-medium text-yellow-200">Hints:</span>
                </div>
                <ul className="text-sm text-yellow-200 space-y-1">
                  {Array.isArray(content.hints) ? (
                    content.hints.map((hint, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{hint}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>{content.hints}</span>
                    </li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Sandbox Container */}
        <div className="p-6">
          <div className={`sandbox-container transition-all duration-300 ${isExpanded ? 'expanded' : ''}`}>
            <InteractiveSandbox
              initialCode={content.code || content.initialCode || '// Write your code here\nconsole.log("Hello World!");'}
              language={finalConfig.language}
              onExecute={handleCodeExecution}
              height={isExpanded ? '500px' : '300px'}
              config={{
                timeout: finalConfig.timeout,
                allowedModules: finalConfig.allowedModules,
                isolationLevel: finalConfig.isolationLevel,
                autoRun: finalConfig.autoRun
              }}
            />
          </div>

          {/* Enhanced Execution Status */}
          {status && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg border ${status.bg}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{status.icon}</span>
                  <span className={`text-sm ${status.color}`}>
                    {status.message}
                  </span>
                </div>
                
                {executionResult && executionResult.executionTime && (
                  <span className="text-xs text-gray-400">
                    {executionResult.executionTime}ms
                  </span>
                )}
              </div>
              
              {executionResult && executionResult.error && (
                <div className="mt-2 p-2 bg-red-900/20 rounded text-xs text-red-200 font-mono">
                  {executionResult.error}
                </div>
              )}
            </motion.div>
          )}

          {/* Success celebration */}
          {hasInteracted && !executionResult?.error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-4 text-center"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600/20 text-green-300 rounded-full border border-green-500/30">
                <span>🎉</span>
                <span className="text-sm font-medium">Great job! Code executed successfully</span>
              </div>
            </motion.div>
          )}

          {/* Tips and best practices */}
          <div className="mt-6 pt-4 border-t border-gray-600/30">
            <div className="text-xs text-gray-400 space-y-1">
              <p>💡 <strong>Tips:</strong> Use console.log() to debug • Try different approaches • Check syntax carefully</p>
              {finalConfig.language === 'javascript' && (
                <p>🔧 <strong>Available:</strong> ES6+ features, Math, Date, JSON, Array methods, and more</p>
              )}
              <p>⚡ <strong>Performance:</strong> Code execution is sandboxed and limited to {finalConfig.timeout / 1000}s</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SandboxBlock; 