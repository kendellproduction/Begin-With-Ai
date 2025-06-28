import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const QuizBlock = ({ 
  content,
  config = {},
  onComplete = () => {},
  className = ""
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const blockRef = useRef(null);

  const defaultConfig = {
    showFeedback: true,
    allowRetry: true,
    shuffleOptions: false,
    showCorrectAnswer: true,
    instantFeedback: false
  };

  const finalConfig = { ...defaultConfig, ...config };

  const handleAnswerSelect = (optionIndex) => {
    if (isCompleted && !finalConfig.allowRetry) return;
    
    setSelectedAnswer(optionIndex);
    
    if (finalConfig.instantFeedback) {
      checkAnswer(optionIndex);
    }
  };

  const checkAnswer = (answerIndex = selectedAnswer) => {
    if (answerIndex === null) return;
    
    const isCorrect = answerIndex === content.correctAnswer;
    setShowFeedback(true);
    
    if (isCorrect && !isCompleted) {
      setIsCompleted(true);
      onComplete({ 
        type: 'quiz', 
        completed: true, 
        correct: true,
        selectedAnswer: answerIndex,
        timestamp: Date.now() 
      });
    }
  };

  const handleSubmit = () => {
    checkAnswer();
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCompleted(false);
  };

  const isCorrect = selectedAnswer === content.correctAnswer;
  const options = finalConfig.shuffleOptions 
    ? [...content.options].sort(() => Math.random() - 0.5)
    : content.options;

  return (
    <motion.div
      ref={blockRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`quiz-block ${className}`}
    >
      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-3">
          {content.question}
        </h3>
        {content.description && (
          <p className="text-gray-300 text-sm">
            {content.description}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const showCorrect = showFeedback && index === content.correctAnswer;
          const showIncorrect = showFeedback && isSelected && !isCorrect;

          return (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isCompleted && !finalConfig.allowRetry}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full p-4 text-left rounded-lg border-2 transition-all duration-300
                ${isSelected 
                  ? showFeedback
                    ? (isCorrect ? 'border-green-400 bg-green-500/20' : 'border-red-400 bg-red-500/20')
                    : 'border-blue-400 bg-blue-500/20'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                }
                ${showCorrect && !isSelected ? 'border-green-400 bg-green-500/10' : ''}
                disabled:cursor-not-allowed disabled:opacity-50
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold
                  ${isSelected 
                    ? showFeedback
                      ? (isCorrect ? 'border-green-400 bg-green-400 text-white' : 'border-red-400 bg-red-400 text-white')
                      : 'border-blue-400 bg-blue-400 text-white'
                    : 'border-gray-500 text-gray-400'
                  }
                  ${showCorrect && !isSelected ? 'border-green-400 text-green-400' : ''}
                `}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className={`
                  ${isSelected ? 'text-white' : 'text-gray-200'}
                  ${showCorrect && !isSelected ? 'text-green-200' : ''}
                `}>
                  {option}
                </span>
                
                {/* Feedback icons */}
                {showFeedback && (
                  <div className="ml-auto">
                    {showCorrect && (
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {showIncorrect && (
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {!finalConfig.instantFeedback && selectedAnswer !== null && !showFeedback && (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Submit Answer
          </button>
        )}
        
        {finalConfig.allowRetry && showFeedback && (
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Feedback */}
      {showFeedback && finalConfig.showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-lg"
          style={{
            backgroundColor: isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderColor: isCorrect ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
          }}
        >
          <div className="flex items-start space-x-3">
            <div className={`text-2xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✅' : '❌'}
            </div>
            <div>
              <p className={`font-medium ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                {isCorrect ? 'Correct!' : 'Not quite right.'}
              </p>
              <p className={`text-sm mt-1 ${isCorrect ? 'text-green-200' : 'text-red-200'}`}>
                {isCorrect ? content.correctFeedback : content.incorrectFeedback}
              </p>
              {!isCorrect && finalConfig.showCorrectAnswer && (
                <p className="text-gray-300 text-sm mt-2">
                  The correct answer is: <span className="font-medium text-green-300">{options[content.correctAnswer]}</span>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizBlock; 