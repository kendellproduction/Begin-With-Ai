import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { useProgressTracking } from '../../hooks/useProgressTracking';

const FillBlankBlock = ({ 
  content,
  config = {},
  onComplete = () => {},
  className = ""
}) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const blockRef = useRef(null);
  const { awardXP } = useProgressTracking();

  const defaultConfig = {
    caseSensitive: false,
    showHints: true,
    instantFeedback: true,
    allowRetry: true,
    showCorrectAnswers: true
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Parse content to find blanks
  const parseBlanks = (text) => {
    const blankRegex = /\{\{([^}]+)\}\}/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let blankIndex = 0;

    while ((match = blankRegex.exec(text)) !== null) {
      // Add text before blank
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }

      // Add blank
      const blankContent = match[1];
      const [answer, hint] = blankContent.split('|');
      
      parts.push({
        type: 'blank',
        index: blankIndex,
        answer: answer.trim(),
        hint: hint ? hint.trim() : null,
        placeholder: `Blank ${blankIndex + 1}`
      });

      lastIndex = match.index + match[0].length;
      blankIndex++;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    return parts;
  };

  const parts = parseBlanks(content.text || content.question || '');
  const blanks = parts.filter(part => part.type === 'blank');

  const handleAnswerChange = (blankIndex, value) => {
    const newAnswers = { ...userAnswers, [blankIndex]: value };
    setUserAnswers(newAnswers);

    if (finalConfig.instantFeedback) {
      checkAnswers(newAnswers);
    }
  };

  const checkAnswers = (answers = userAnswers) => {
    const correct = {};
    let allCorrect = true;

    blanks.forEach(blank => {
      const userAnswer = answers[blank.index] || '';
      const correctAnswer = blank.answer;
      
      const isCorrect = finalConfig.caseSensitive 
        ? userAnswer === correctAnswer
        : userAnswer.toLowerCase() === correctAnswer.toLowerCase();
      
      correct[blank.index] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });

    setShowFeedback(true);
    
    if (allCorrect && !isCompleted) {
      setIsCompleted(true);
      onComplete({ 
        type: 'fill_blank', 
        completed: true, 
        answers: answers,
        timestamp: Date.now() 
      });
    }

    return { correct, allCorrect };
  };

  const handleSubmit = () => {
    const { correct } = checkAnswers();
    if (correct && !isCompleted) {
      awardXP(10, 'fill_blank');
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowFeedback(false);
    setIsCompleted(false);
  };

  const renderBlankInput = (blank) => {
    const userAnswer = userAnswers[blank.index] || '';
    const isCorrect = showFeedback && finalConfig.caseSensitive 
      ? userAnswer === blank.answer
      : userAnswer.toLowerCase() === blank.answer.toLowerCase();
    const hasAnswer = userAnswer.length > 0;

    return (
      <span key={blank.index} className="inline-block mx-1">
        <motion.input
          type="text"
          value={userAnswer}
          onChange={(e) => handleAnswerChange(blank.index, e.target.value)}
          placeholder={blank.placeholder}
          className={`
            px-2 py-1 rounded border-b-2 bg-transparent text-white text-center
            min-w-[80px] max-w-[200px] focus:outline-none transition-colors
            ${showFeedback 
              ? (isCorrect ? 'border-green-400 text-green-300' : 'border-red-400 text-red-300')
              : 'border-gray-400 focus:border-blue-400'
            }
          `}
          style={{ width: `${Math.max(80, (userAnswer.length + 2) * 8)}px` }}
          disabled={isCompleted && !finalConfig.allowRetry}
        />
        
        {/* Hint tooltip */}
        {finalConfig.showHints && blank.hint && (
          <div className="relative inline-block ml-1">
            <button className="text-xs text-blue-400 hover:text-blue-300">💡</button>
            <div className="absolute bottom-full left-0 mb-1 opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-black/80 text-white text-xs p-2 rounded whitespace-nowrap">
                {blank.hint}
              </div>
            </div>
          </div>
        )}
      </span>
    );
  };

  return (
    <motion.div
      ref={blockRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fill-blank-block ${className}`}
    >
      {/* Instructions */}
      {content.instructions && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-200 text-sm">{content.instructions}</p>
        </div>
      )}

      {/* Main content with blanks */}
      <div className="text-lg leading-relaxed mb-6">
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <span 
                key={index}
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(part.content) 
                }}
              />
            );
          } else {
            return renderBlankInput(part);
          }
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-3">
        {!finalConfig.instantFeedback && (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(userAnswers).length === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                     text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Check Answers
          </button>
        )}
        
        {finalConfig.allowRetry && showFeedback && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          {isCompleted ? (
            <div className="flex items-center space-x-2 text-green-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Perfect! All answers are correct.</span>
            </div>
          ) : (
            <div className="text-orange-300 text-sm">
              Keep trying! Some answers need correction.
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default FillBlankBlock; 