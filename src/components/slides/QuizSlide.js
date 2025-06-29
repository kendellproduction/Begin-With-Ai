import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizSlide = ({ slide, onComplete, onNext, onAnswer, isActive }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const { question, options, explanation } = slide.content;

  const handleAnswer = (option, index) => {
    if (hasAnswered) return;

    setSelectedAnswer({ option, index });
    setHasAnswered(true);
    
    // Trigger audio feedback and vibration feedback
    const isCorrect = option.correct;
    onAnswer(isCorrect, { selectedOption: option, isCorrect });
    
    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(isCorrect ? [50] : [100, 50, 100]);
    }
    
    // Show result after brief delay
    setTimeout(() => {
      setShowResult(true);
    }, 500);

    // Auto-submit after showing result (if autoSubmit is enabled)
    if (slide.content.autoSubmit) {
      setTimeout(() => {
        onComplete(slide.id, {
          selectedOption: option,
          isCorrect,
          autoSubmitted: true
        });
      }, isCorrect ? 2000 : 3000); // Shorter delay for correct answers
    }
  };

  const getOptionStyle = (option, index) => {
    if (!hasAnswered) {
      return 'bg-white/10 text-gray-300 hover:bg-white/20 border-transparent';
    }
    
    if (selectedAnswer && selectedAnswer.index === index) {
      return option.correct 
        ? 'bg-green-600 text-white border-green-400 ring-2 ring-green-400/50' 
        : 'bg-red-600 text-white border-red-400 ring-2 ring-red-400/50';
    }
    
    if (option.correct && showResult) {
      return 'bg-green-600/30 text-green-200 border-green-400';
    }
    
    return 'bg-gray-700/50 text-gray-400 border-gray-600';
  };

  return (
    <div className="text-center space-y-8">
      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-4xl mb-4">🤔</div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          Question
        </h2>
        <p className="text-xl md:text-2xl text-gray-100 leading-relaxed font-medium max-w-5xl mx-auto px-4 mb-8">
          {question}
        </p>
      </motion.div>

      {/* Options */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleAnswer(option, index)}
            disabled={hasAnswered}
            className={`
              w-full p-5 rounded-xl text-left transition-all duration-300 border text-lg font-medium
              ${getOptionStyle(option, index)}
              ${!hasAnswered ? 'transform hover:scale-[1.02] active:scale-[0.98]' : ''}
              disabled:cursor-not-allowed
            `}
            whileHover={!hasAnswered ? { scale: 1.02 } : {}}
            whileTap={!hasAnswered ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold
                ${hasAnswered && selectedAnswer?.index === index 
                  ? (option.correct ? 'border-green-400 bg-green-400 text-white' : 'border-red-400 bg-red-400 text-white')
                  : hasAnswered && option.correct && showResult
                    ? 'border-green-400 bg-green-400 text-white'
                    : 'border-gray-400'
                }
              `}>
                {hasAnswered && selectedAnswer?.index === index 
                  ? (option.correct ? '✓' : '✗')
                  : hasAnswered && option.correct && showResult
                    ? '✓'
                    : String.fromCharCode(65 + index) // A, B, C, D
                }
              </div>
              <span className="flex-1">{option.text}</span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Result Explanation */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className={`
              p-4 rounded-xl border-2
              ${selectedAnswer?.option.correct 
                ? 'bg-green-900/30 border-green-400 text-green-200' 
                : 'bg-blue-900/30 border-blue-400 text-blue-200'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">
                {selectedAnswer?.option.correct ? '🎉' : '💡'}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold mb-2">
                  {selectedAnswer?.option.correct ? 'Correct!' : 'Good try!'}
                </h3>
                <p className="text-sm leading-relaxed">
                  {explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button */}
      {showResult && (
        <motion.button
          onClick={() => onComplete(slide.id, {
            selectedOption: selectedAnswer.option,
            isCorrect: selectedAnswer.option.correct,
            timeSpent: Date.now()
          })}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-semibold text-base shadow-lg transition-all duration-300"
        >
          Continue →
        </motion.button>
      )}

      {/* Tap hint (only if not answered) */}
      {!hasAnswered && (
        <motion.p 
          className="text-gray-500 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tap an answer to continue
        </motion.p>
      )}
    </div>
  );
};

export default QuizSlide; 