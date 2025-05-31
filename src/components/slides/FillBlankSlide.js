import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FillBlankSlide = ({ slide, onComplete, onNext, onAnswer, isActive }) => {
  const { sentence, answer, options, hint, explanation } = slide.content;
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Split sentence at the blank (represented by ______)
  const parts = sentence.split('______');

  const handleAnswer = (selectedOption) => {
    if (hasAnswered) return;

    setSelectedAnswer(selectedOption);
    setHasAnswered(true);
    
    const isCorrect = selectedOption.toLowerCase().trim() === answer.toLowerCase().trim();
    
    // Trigger audio feedback
    onAnswer(isCorrect, { selectedAnswer: selectedOption, isCorrect });
    
    // Show result after brief delay
    setTimeout(() => {
      setShowResult(true);
    }, 500);

    // Auto-advance after showing explanation
    setTimeout(() => {
      onComplete(slide.id, {
        selectedAnswer: selectedOption,
        correctAnswer: answer,
        isCorrect
      });
    }, 3000);
  };

  const getOptionStyle = (option) => {
    if (!hasAnswered) {
      return 'bg-white/10 text-gray-300 hover:bg-white/20 border-white/20';
    }
    
    const isCorrect = option.toLowerCase().trim() === answer.toLowerCase().trim();
    const isSelected = option === selectedAnswer;
    
    if (isSelected) {
      return isCorrect 
        ? 'bg-green-600 text-white border-green-400 ring-2 ring-green-400/50' 
        : 'bg-red-600 text-white border-red-400 ring-2 ring-red-400/50';
    }
    
    if (isCorrect && showResult) {
      return 'bg-green-600/30 text-green-200 border-green-400';
    }
    
    return 'bg-gray-700/50 text-gray-400 border-gray-600';
  };

  return (
    <div className="text-center space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-4xl mb-4">🧩</div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          Fill in the Blank
        </h2>
        {hint && (
          <p className="text-sm text-blue-200 italic">
            💡 Hint: {hint}
          </p>
        )}
      </motion.div>

      {/* Sentence with Blank */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/5 rounded-2xl p-6 border border-white/10"
      >
        <p className="text-lg text-white leading-relaxed">
          {parts[0]}
          <span className={`
            inline-block min-w-[120px] mx-2 px-3 py-1 rounded-lg border-2 border-dashed font-semibold
            ${hasAnswered 
              ? (selectedAnswer.toLowerCase().trim() === answer.toLowerCase().trim() 
                ? 'bg-green-600 text-white border-green-400' 
                : 'bg-red-600 text-white border-red-400')
              : 'bg-blue-900/50 text-blue-200 border-blue-400'
            }
          `}>
            {hasAnswered ? selectedAnswer : '______'}
          </span>
          {parts[1]}
        </p>
      </motion.div>

      {/* Options */}
      {!hasAnswered && (
        <motion.div 
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`
                p-3 rounded-xl text-center transition-all duration-300 border
                ${getOptionStyle(option)}
                transform hover:scale-[1.02] active:scale-[0.98]
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
            >
              {option}
            </motion.button>
          ))}
        </motion.div>
      )}

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
              ${selectedAnswer.toLowerCase().trim() === answer.toLowerCase().trim()
                ? 'bg-green-900/30 border-green-400 text-green-200' 
                : 'bg-blue-900/30 border-blue-400 text-blue-200'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">
                {selectedAnswer.toLowerCase().trim() === answer.toLowerCase().trim() ? '🎉' : '💡'}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold mb-2">
                  {selectedAnswer.toLowerCase().trim() === answer.toLowerCase().trim() 
                    ? 'Perfect!' 
                    : `Close! The answer is "${answer}"`}
                </h3>
                <p className="text-sm leading-relaxed">
                  {explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      {hasAnswered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 text-sm"
        >
          Moving to next slide...
        </motion.div>
      )}

      {/* Tap hint */}
      {!hasAnswered && (
        <motion.p 
          className="text-gray-500 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tap the correct answer
        </motion.p>
      )}
    </div>
  );
};

export default FillBlankSlide; 