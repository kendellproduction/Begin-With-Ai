import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const QuizEditor = ({ content = {}, onUpdate }) => {
  // Local state that doesn't trigger parent re-renders immediately
  const [localQuestion, setLocalQuestion] = useState(content.question || '');
  const [localOptions, setLocalOptions] = useState(content.options || ['', '']);
  const [localCorrectAnswer, setLocalCorrectAnswer] = useState(content.correctAnswer ?? 0);
  const [localExplanation, setLocalExplanation] = useState(content.explanation || '');
  
  // Debounce timer refs
  const questionTimerRef = useRef(null);
  const explanationTimerRef = useRef(null);
  const optionTimersRef = useRef({});
  
  // Debounced update function
  const debouncedUpdate = useCallback((field, value, delay = 500) => {
    const timerKey = `${field}-timer`;
    
    // Clear existing timer
    if (field === 'question' && questionTimerRef.current) {
      clearTimeout(questionTimerRef.current);
    } else if (field === 'explanation' && explanationTimerRef.current) {
      clearTimeout(explanationTimerRef.current);
    } else if (field.startsWith('option-') && optionTimersRef.current[field]) {
      clearTimeout(optionTimersRef.current[field]);
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      if (onUpdate) {
        const updatedContent = {
          question: field === 'question' ? value : localQuestion,
          options: field.startsWith('option-') 
            ? (() => {
                const newOptions = [...localOptions];
                const optionIndex = parseInt(field.split('-')[1]);
                newOptions[optionIndex] = value;
                return newOptions;
              })()
            : localOptions,
          correctAnswer: field === 'correctAnswer' ? value : localCorrectAnswer,
          explanation: field === 'explanation' ? value : localExplanation
        };
        onUpdate(updatedContent);
      }
    }, delay);
    
    // Store timer reference
    if (field === 'question') {
      questionTimerRef.current = timer;
    } else if (field === 'explanation') {
      explanationTimerRef.current = timer;
    } else if (field.startsWith('option-')) {
      optionTimersRef.current[field] = timer;
    }
  }, [localQuestion, localOptions, localCorrectAnswer, localExplanation, onUpdate]);
  
  // Handle question change
  const handleQuestionChange = useCallback((e) => {
    const value = e.target.value;
    setLocalQuestion(value);
    debouncedUpdate('question', value);
  }, [debouncedUpdate]);
  
  // Handle option change
  const handleOptionChange = useCallback((index, value) => {
    const newOptions = [...localOptions];
    newOptions[index] = value;
    setLocalOptions(newOptions);
    debouncedUpdate(`option-${index}`, value);
  }, [localOptions, debouncedUpdate]);
  
  // Handle explanation change
  const handleExplanationChange = useCallback((e) => {
    const value = e.target.value;
    setLocalExplanation(value);
    debouncedUpdate('explanation', value);
  }, [debouncedUpdate]);
  
  // Handle correct answer change (immediate update)
  const handleCorrectAnswerChange = useCallback((index) => {
    setLocalCorrectAnswer(index);
    if (onUpdate) {
      onUpdate({
        question: localQuestion,
        options: localOptions,
        correctAnswer: index,
        explanation: localExplanation
      });
    }
  }, [localQuestion, localOptions, localExplanation, onUpdate]);
  
  // Add new option
  const addOption = useCallback(() => {
    const newOptions = [...localOptions, ''];
    setLocalOptions(newOptions);
    if (onUpdate) {
      onUpdate({
        question: localQuestion,
        options: newOptions,
        correctAnswer: localCorrectAnswer,
        explanation: localExplanation
      });
    }
  }, [localOptions, localQuestion, localCorrectAnswer, localExplanation, onUpdate]);
  
  // Remove option
  const removeOption = useCallback((index) => {
    if (localOptions.length <= 2) return; // Keep at least 2 options
    
    const newOptions = localOptions.filter((_, i) => i !== index);
    const newCorrectAnswer = localCorrectAnswer >= newOptions.length ? 0 : 
                            localCorrectAnswer > index ? localCorrectAnswer - 1 : localCorrectAnswer;
    
    setLocalOptions(newOptions);
    setLocalCorrectAnswer(newCorrectAnswer);
    
    if (onUpdate) {
      onUpdate({
        question: localQuestion,
        options: newOptions,
        correctAnswer: newCorrectAnswer,
        explanation: localExplanation
      });
    }
  }, [localOptions, localQuestion, localCorrectAnswer, localExplanation, onUpdate]);
  
  // Sync with parent content changes
  useEffect(() => {
    if (content.question !== localQuestion) setLocalQuestion(content.question || '');
    if (JSON.stringify(content.options) !== JSON.stringify(localOptions)) {
      setLocalOptions(content.options || ['', '']);
    }
    if (content.correctAnswer !== localCorrectAnswer) setLocalCorrectAnswer(content.correctAnswer ?? 0);
    if (content.explanation !== localExplanation) setLocalExplanation(content.explanation || '');
  }, [content, localQuestion, localOptions, localCorrectAnswer, localExplanation]);
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
      if (explanationTimerRef.current) clearTimeout(explanationTimerRef.current);
      Object.values(optionTimersRef.current).forEach(timer => clearTimeout(timer));
    };
  }, []);
  
  return (
    <div className="space-y-6 p-4 bg-gray-800 rounded-lg">
      {/* Question Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Quiz Question
        </label>
        <input
          type="text"
          value={localQuestion}
          onChange={handleQuestionChange}
          placeholder="Enter your quiz question..."
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          autoComplete="off"
        />
      </div>
      
      {/* Options */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Answer Options
          <span className="text-xs text-gray-400 ml-2">
            (Click the circle to mark as correct answer)
          </span>
        </label>
        
        <div className="space-y-3">
          {localOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 group"
            >
              {/* Correct Answer Selector */}
              <button
                type="button"
                onClick={() => handleCorrectAnswerChange(index)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  localCorrectAnswer === index
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-500 hover:border-green-400'
                }`}
                title="Mark as correct answer"
              >
                {localCorrectAnswer === index && (
                  <CheckCircleIcon className="w-4 h-4" />
                )}
              </button>
              
              {/* Option Input */}
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                autoComplete="off"
              />
              
              {/* Remove Option Button */}
              {localOptions.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="flex-shrink-0 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove option"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Add Option Button */}
        {localOptions.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-3 flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Option</span>
          </button>
        )}
      </div>
      
      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Explanation (Optional)
        </label>
        <textarea
          value={localExplanation}
          onChange={handleExplanationChange}
          placeholder="Explain why this is the correct answer..."
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          rows={3}
          autoComplete="off"
        />
      </div>
      
      {/* Preview */}
      <div className="pt-4 border-t border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Preview
        </label>
        <div className="bg-gray-900 rounded-lg p-4 space-y-3">
          <h4 className="text-white font-medium">
            {localQuestion || 'Your question will appear here...'}
          </h4>
          <div className="space-y-2">
            {localOptions.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-2 rounded ${
                  localCorrectAnswer === index ? 'bg-green-900/30' : 'bg-gray-800'
                }`}
              >
                <span className="text-sm font-mono text-gray-400">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-gray-300">
                  {option || `Option ${String.fromCharCode(65 + index)}`}
                </span>
                {localCorrectAnswer === index && (
                  <CheckCircleIcon className="w-4 h-4 text-green-400 ml-auto" />
                )}
              </div>
            ))}
          </div>
          {localExplanation && (
            <div className="mt-3 p-3 bg-blue-900/20 rounded text-blue-200 text-sm">
              <strong>Explanation:</strong> {localExplanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;
