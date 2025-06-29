import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FillBlankSlide = ({ slide, onComplete, onNext, onAnswer, isActive }) => {
  const { 
    sentence, 
    answer, 
    options, 
    hint, 
    explanation,
    title,
    fillInBlanks
  } = slide.content;
  
  // Check if this is an interactive check with multiple fill-in-blanks
  const isInteractiveCheck = slide.type === 'interactive_check' && fillInBlanks;
  
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionResults, setQuestionResults] = useState([]);

  // Get current question data
  const getCurrentQuestionData = () => {
    if (isInteractiveCheck) {
      return fillInBlanks[currentQuestionIndex] || {};
    }
    return { sentence, correctAnswer: answer, options };
  };

  const currentQuestion = getCurrentQuestionData();
  const parts = currentQuestion.sentence ? currentQuestion.sentence.split('______') : (sentence ? sentence.split('______') : ['']);

  const handleAnswer = (selectedOption) => {
    if (hasAnswered) return;

    setSelectedAnswer(selectedOption);
    setHasAnswered(true);
    
    const correctAnswer = currentQuestion.correctAnswer || answer;
    const isCorrect = selectedOption.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    
    // Trigger audio feedback
    onAnswer(isCorrect, { selectedAnswer: selectedOption, isCorrect });
    
    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(isCorrect ? [50] : [100, 50, 100]);
    }
    
    // Show result after brief delay
    setTimeout(() => {
      setShowResult(true);
    }, 500);

         // Handle multi-question progression
     if (isInteractiveCheck) {
       // Store result for this question
       const newResult = {
         question: currentQuestion.sentence,
         selectedAnswer: selectedOption,
         correctAnswer,
         isCorrect
       };
       setQuestionResults(prev => [...prev, newResult]);

       // Check if there are more questions
       setTimeout(() => {
         if (currentQuestionIndex < fillInBlanks.length - 1) {
           // Move to next question
           setCurrentQuestionIndex(prev => prev + 1);
           setSelectedAnswer('');
           setShowResult(false);
           setHasAnswered(false);
         } else {
                    // All questions completed
         onComplete(slide.id, {
           allResults: [...questionResults, newResult],
           totalQuestions: fillInBlanks.length,
           correctCount: [...questionResults, newResult].filter(r => r.isCorrect).length
         });
       }
     }, isCorrect ? 2000 : 4000); // Correct: 2s, Wrong: 4s
   } else {
     // Single question - auto-submit if enabled, otherwise use longer time
     const delay = slide.content.autoSubmit ? 
       (isCorrect ? 2000 : 3000) : // Auto-submit: shorter delays
       (isCorrect ? 2500 : 5000);  // Manual: longer delays
     
     setTimeout(() => {
       onComplete(slide.id, {
         selectedAnswer: selectedOption,
         correctAnswer,
         isCorrect,
         autoSubmitted: slide.content.autoSubmit
       });
     }, delay);
   }
  };

  const getOptionStyle = (option) => {
    if (!hasAnswered) {
      return 'bg-white/10 text-gray-300 hover:bg-white/20 border-white/20';
    }
    
    const correctAnswer = currentQuestion.correctAnswer || answer;
    const isCorrect = option.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
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
    <div className="text-center space-y-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-4xl mb-4">🧩</div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          {title || (isInteractiveCheck ? "Quick Knowledge Check" : "Fill in the Blank")}
        </h2>
        
        {/* Progress indicator for multiple questions */}
        {isInteractiveCheck && (
          <div className="mb-4">
            <p className="text-sm text-blue-200 mb-2">
              Question {currentQuestionIndex + 1} of {fillInBlanks.length}
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / fillInBlanks.length) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {hint && (
          <p className="text-sm text-blue-200 italic">
            💡 Hint: {hint}
          </p>
        )}
        
        {/* Explanation for interactive check */}
        {isInteractiveCheck && slide.content.explanation && (
          <p className="text-sm text-gray-300 mt-2">
            {slide.content.explanation}
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
        <p className="text-xl md:text-2xl text-white leading-relaxed font-medium max-w-5xl mx-auto">
          {parts[0]}
          <span className={`
            inline-block min-w-[120px] mx-2 px-3 py-1 rounded-lg border-2 border-dashed font-semibold
            ${hasAnswered 
              ? (selectedAnswer.toLowerCase().trim() === (currentQuestion.correctAnswer || answer).toLowerCase().trim() 
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
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {(currentQuestion.options || options || []).map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`
                p-4 rounded-xl text-center transition-all duration-300 border text-lg font-medium
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
              ${selectedAnswer.toLowerCase().trim() === (currentQuestion.correctAnswer || answer).toLowerCase().trim()
                ? 'bg-green-900/30 border-green-400 text-green-200' 
                : 'bg-blue-900/30 border-blue-400 text-blue-200'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">
                {selectedAnswer.toLowerCase().trim() === (currentQuestion.correctAnswer || answer).toLowerCase().trim() ? '🎉' : '💡'}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold mb-2">
                  {selectedAnswer.toLowerCase().trim() === (currentQuestion.correctAnswer || answer).toLowerCase().trim() 
                    ? (isInteractiveCheck 
                        ? (currentQuestionIndex < fillInBlanks.length - 1 ? 'Great! Next question...' : 'Perfect! All done!') 
                        : 'Perfect!') 
                    : `Close! The answer is "${currentQuestion.correctAnswer || answer}"`}
                </h3>
                <p className="text-sm leading-relaxed">
                  {currentQuestion.explanation || explanation || "Good job practicing!"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      {hasAnswered && showResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="text-gray-400 text-sm">
            {isInteractiveCheck && currentQuestionIndex < fillInBlanks.length - 1 
              ? "Moving to next question..." 
              : "Moving to next slide..."
            }
          </div>
          
          {/* Manual Continue Button - appears after 3 seconds */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            onClick={() => {
              if (isInteractiveCheck) {
                if (currentQuestionIndex < fillInBlanks.length - 1) {
                  // Move to next question
                  setCurrentQuestionIndex(prev => prev + 1);
                  setSelectedAnswer('');
                  setShowResult(false);
                  setHasAnswered(false);
                } else {
                  // Complete the slide
                  const allResults = [...questionResults, {
                    question: currentQuestion.sentence,
                    selectedAnswer,
                    correctAnswer: currentQuestion.correctAnswer || answer,
                    isCorrect: selectedAnswer.toLowerCase().trim() === (currentQuestion.correctAnswer || answer).toLowerCase().trim()
                  }];
                  onComplete(slide.id, {
                    allResults,
                    totalQuestions: fillInBlanks.length,
                    correctCount: allResults.filter(r => r.isCorrect).length
                  });
                }
              } else {
                onComplete(slide.id, {
                  selectedAnswer,
                  correctAnswer: currentQuestion.correctAnswer || answer,
                  isCorrect: selectedAnswer.toLowerCase().trim() === (currentQuestion.correctAnswer || answer).toLowerCase().trim()
                });
              }
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm"
          >
            Continue →
          </motion.button>
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