import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const blockRef = useRef(null);

  const defaultConfig = {
    isolationLevel: 'strict',
    timeout: 30000,
    allowedModules: [],
    language: 'javascript',
    showInstructions: true,
    expandable: true,
    autoRun: false
  };

  const finalConfig = { ...defaultConfig, ...config };

  const handleCodeExecution = (result) => {
    setExecutionResult(result);
    setHasInteracted(true);
    onComplete({ 
      type: 'sandbox', 
      executed: true, 
      result,
      timestamp: Date.now() 
    });
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      ref={blockRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`sandbox-block ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">⚡</div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {content.title || 'Code Sandbox'}
            </h3>
            <p className="text-sm text-gray-400">
              {finalConfig.language.toUpperCase()} • Interactive Coding
            </p>
          </div>
        </div>
        
        {finalConfig.expandable && (
          <button
            onClick={handleExpand}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? '🗗' : '🗖'}
          </button>
        )}
      </div>

      {/* Instructions */}
      {finalConfig.showInstructions && content.instructions && (
        <div className="mb-4 p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg">
          <p className="text-violet-200 text-sm leading-relaxed">
            {content.instructions}
          </p>
        </div>
      )}

      {/* Sandbox Container */}
      <div className={`sandbox-container ${isExpanded ? 'expanded' : ''}`}>
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

      {/* Execution Status */}
      {hasInteracted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-green-300 text-sm">Code executed successfully</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SandboxBlock; 