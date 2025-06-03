import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import SandboxAPIService from '../../services/sandboxAPIService';

// Vocabulary Exercises Component
const VocabularyExercises = ({ exercises, instructions, title, onComplete, onNext }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState({}); // Stores answers for the current exercise
  const [allUserAnswers, setAllUserAnswers] = useState({}); // Stores answers for ALL exercises

  const exercise = exercises[currentExercise];

  // For Matching exercise
  const [selectedTerm, setSelectedTerm] = useState(null); // { index: number, term: string }
  const [selectedDefinition, setSelectedDefinition] = useState(null); // { index: number, definition: string }
  const [matchStatuses, setMatchStatuses] = useState({}); // { [termIndex]: 'correct' | 'incorrect' | 'unanswered' }
  const [incorrectAttempt, setIncorrectAttempt] = useState(null); // Tracks temp incorrect definition index

  useEffect(() => {
    setSelectedTerm(null);
    setSelectedDefinition(null);
    setUserAnswers(allUserAnswers[currentExercise] || {});
    // Initialize match statuses for the current matching exercise
    if (exercise && exercise.type === 'matching') {
      const initialStatuses = {};
      exercise.items.forEach((_, index) => {
        if (allUserAnswers[currentExercise] && allUserAnswers[currentExercise][index] !== undefined) {
          // Check if the stored answer was correct (term index should match definition index for correctness)
          initialStatuses[index] = allUserAnswers[currentExercise][index] === index ? 'correct' : 'unanswered'; // Or handle how past incorrects were stored
        } else {
          initialStatuses[index] = 'unanswered';
        }
      });
      setMatchStatuses(initialStatuses);
    }
  }, [currentExercise, allUserAnswers, exercise]);

  const handleAnswer = (questionIndex, answer) => {
    const newAnswers = { ...userAnswers, [questionIndex]: answer };
    setUserAnswers(newAnswers);
  };

  const handleMatchingSelect = (type, index, text) => {
    if (incorrectAttempt !== null) setIncorrectAttempt(null); // Clear previous incorrect flash

    if (type === 'term') {
      // Prevent selecting an already correctly matched term
      if (matchStatuses[index] === 'correct') return;

      if (selectedTerm && selectedTerm.index === index) {
        setSelectedTerm(null); // Deselect if clicking the same term
      } else {
        setSelectedTerm({ index, text });
        // If this term was previously marked incorrect, reset its status as user is re-attempting
        if(matchStatuses[index] === 'incorrect') {
          setMatchStatuses(prev => ({...prev, [index]: 'unanswered'}));
        }
      }
    } else if (type === 'definition') {
      // Prevent selecting a definition if its corresponding term is already correctly matched
      // This logic assumes definition index directly corresponds to term index for correct pair
      if (matchStatuses[index] === 'correct' && userAnswers[index] === index) return; 

      if (selectedDefinition && selectedDefinition.index === index) {
        setSelectedDefinition(null); // Deselect if clicking the same definition
      } else {
        setSelectedDefinition({ index, text });
      }
    }
  };

  useEffect(() => {
    if (selectedTerm !== null && selectedDefinition !== null && exercise && exercise.type === 'matching') {
      const termIdx = selectedTerm.index;
      const defIdx = selectedDefinition.index;

      if (termIdx === defIdx) { // Correct Match!
        setUserAnswers(prev => ({ ...prev, [termIdx]: defIdx }));
        setMatchStatuses(prev => ({ ...prev, [termIdx]: 'correct' }));
        setSelectedTerm(null);
        setSelectedDefinition(null);
      } else { // Incorrect Match
        setMatchStatuses(prev => ({ ...prev, [termIdx]: 'incorrect' }));
        setIncorrectAttempt(defIdx); // Set for flashing
        setSelectedDefinition(null); // Deselect definition, keep term selected for another try
        // Do not save to userAnswers
      }
    }
  }, [selectedTerm, selectedDefinition, exercise]);

  const recordCurrentAnswersAndProceed = (proceedFunction) => {
    // For matching, ensure only correct answers are saved to allUserAnswers
    let answersToSave = { ...userAnswers };
    if (exercise && exercise.type === 'matching') {
      answersToSave = {};
      Object.keys(userAnswers).forEach(termIdx => {
        if (matchStatuses[termIdx] === 'correct') {
          answersToSave[termIdx] = userAnswers[termIdx];
        }
      });
    }
    setAllUserAnswers(prev => ({ ...prev, [currentExercise]: answersToSave }));
    proceedFunction();
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      recordCurrentAnswersAndProceed(() => setCurrentExercise(curr => curr + 1));
    } else {
      recordCurrentAnswersAndProceed(() => setShowResults(true));
    }
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      recordCurrentAnswersAndProceed(() => setCurrentExercise(curr => curr - 1));
    }
  };

  const finishExercises = () => {
    let finalAnswersToSave = { ...userAnswers };
    if (exercise && exercise.type === 'matching') {
        finalAnswersToSave = {};
        Object.keys(userAnswers).forEach(termIdx => {
            if (matchStatuses[termIdx] === 'correct') {
                finalAnswersToSave[termIdx] = userAnswers[termIdx];
            }
        });
    }
    setAllUserAnswers(prev => ({ ...prev, [currentExercise]: finalAnswersToSave }));
    onComplete('vocabulary-exercises', {
      answers: { ...allUserAnswers, [currentExercise]: finalAnswersToSave }, // Ensure the very last set of answers is included
      completed: true,
      exercisesCompleted: exercises.length
    });
  };

  useEffect(() => {
    if (incorrectAttempt !== null) {
      const timer = setTimeout(() => setIncorrectAttempt(null), 700); // Flash duration
      return () => clearTimeout(timer);
    }
  }, [incorrectAttempt]);

  if (showResults) {
    return (
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-8xl mb-6"
        >
          📚
        </motion.div>
        <h2 className="text-4xl font-bold text-white mb-4">Vocabulary Practice Complete!</h2>
        <p className="text-gray-300 mb-6">Great work! You've completed all the vocabulary exercises.</p>
        <motion.button
          onClick={finishExercises}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105"
        >
          Continue to Next Lesson →
        </motion.button>
      </div>
    );
  }

  // Safety check
  if (!exercise) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-white mb-4">Exercise Not Found</h2>
        <p className="text-gray-300 mb-6">Unable to load exercise {currentExercise + 1}.</p>
        <button
          onClick={() => setCurrentExercise(0)}
          className="px-6 py-3 bg-blue-600 rounded-xl text-white font-medium"
        >
          Return to First Exercise
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
        <p className="text-xl text-gray-300 mb-6">{instructions}</p>
        <div className="text-sm text-gray-400">
          Exercise {currentExercise + 1} of {exercises.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
        />
      </div>

      {/* Exercise Content */}
      <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-600/50">
        <h3 className="text-2xl font-bold text-white mb-6">{exercise.title}</h3>
        
        {/* Matching Exercise */}
        {exercise.type === 'matching' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Terms Column */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-cyan-300 mb-2 text-center">Terms</h4>
              {exercise.items && exercise.items.map((item, termIndex) => {
                const status = matchStatuses[termIndex];
                let termClasses = 'bg-slate-700 hover:bg-slate-600 text-white';
                if (selectedTerm && selectedTerm.index === termIndex) {
                  termClasses = 'bg-blue-500 text-white ring-2 ring-blue-300 scale-105';
                } else if (status === 'correct') {
                  termClasses = 'bg-green-700 text-white cursor-not-allowed opacity-80';
                } else if (status === 'incorrect') {
                  termClasses = 'bg-red-500 text-white ring-2 ring-red-400 scale-105'; // Incorrect term attempt
                }

                return (
                  <button
                    key={`term-${termIndex}`}
                    onClick={() => handleMatchingSelect('term', termIndex, item.term)}
                    className={`w-full p-4 rounded-lg transition-all duration-200 text-left ${termClasses}`}
                    disabled={status === 'correct'}
                  >
                    {item.term}
                    {status === 'correct' && exercise.items[termIndex] && (
                      <span className="text-xs block opacity-90 mt-1">✓ Matched: {exercise.items[termIndex].definition}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Definitions Column */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-purple-300 mb-2 text-center">Definitions</h4>
              {exercise.items && exercise.items.map((item, defIndex) => {
                const isMatchedToSomeTerm = Object.entries(userAnswers).some(([termIdx, matchedDefIdx]) => matchedDefIdx === defIndex && matchStatuses[termIdx] === 'correct');
                let defClasses = 'bg-slate-700 hover:bg-slate-600 text-white';
                if (selectedDefinition && selectedDefinition.index === defIndex) {
                  defClasses = 'bg-purple-500 text-white ring-2 ring-purple-300 scale-105';
                } else if (isMatchedToSomeTerm) {
                  defClasses = 'bg-slate-600 text-slate-400 cursor-not-allowed opacity-70';
                } else if (incorrectAttempt === defIndex) {
                  defClasses = 'bg-red-600 text-white ring-2 ring-red-400 animate-pulse'; // Flashing incorrect definition
                }

                return (
                  <button
                    key={`def-${defIndex}`}
                    onClick={() => handleMatchingSelect('definition', defIndex, item.definition)}
                    className={`w-full p-4 rounded-lg transition-all duration-200 text-left ${defClasses}`}
                    disabled={isMatchedToSomeTerm}
                  >
                    {item.definition}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Fill in the Blank Exercise */}
        {exercise.type === 'fill_in_blank' && (
          <div className="space-y-6">
            {exercise.sentences && exercise.sentences.length > 0 ? (
              exercise.sentences.map((sentence, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-white text-lg">{sentence}</p>
                  <input
                    type="text"
                    placeholder="Your answer..."
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    onChange={(e) => handleAnswer(`${currentExercise}-${index}`, e.target.value)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>No sentences available for fill-in-the-blank.</p>
              </div>
            )}
          </div>
        )}

        {/* True/False Exercise */}
        {exercise.type === 'true_false' && (
          <div className="space-y-4">
            {exercise.statements && exercise.statements.length > 0 ? (
              exercise.statements.map((item, index) => (
                <div key={index} className="bg-slate-700/50 rounded-xl p-4">
                  <p className="text-white mb-4">{item.statement}</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleAnswer(index, true)}
                      className={`px-6 py-2 rounded-lg text-white font-medium transition-colors
                        ${userAnswers[index] === true ? 'bg-green-700 ring-2 ring-green-400' : 'bg-green-600 hover:bg-green-700'}
                      `}
                    >
                      True
                    </button>
                    <button
                      onClick={() => handleAnswer(index, false)}
                      className={`px-6 py-2 rounded-lg text-white font-medium transition-colors
                        ${userAnswers[index] === false ? 'bg-red-700 ring-2 ring-red-400' : 'bg-red-600 hover:bg-red-700'}
                      `}
                    >
                      False
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>No statements available for true/false.</p>
              </div>
            )}
          </div>
        )}

        {/* Category Sort Exercise */}
        {exercise.type === 'category_sort' && (
          <div className="space-y-6">
            {exercise.terms && exercise.categories ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Terms to Sort Column */}
                <div className="md:col-span-1 space-y-3">
                  <h4 className="text-lg font-semibold text-cyan-300 mb-2 text-center">Terms to Sort</h4>
                  {exercise.terms.map((term, termIndex) => {
                    // Find which category this term is currently assigned to, if any
                    const assignedCategoryName = Object.keys(userAnswers).find(catName => 
                      Array.isArray(userAnswers[catName]) && userAnswers[catName].includes(termIndex)
                    );
                    const isSelected = selectedTerm && selectedTerm.index === termIndex && selectedTerm.type === 'category_term';
                    
                    let termBg = 'bg-slate-700 hover:bg-slate-600 text-white';
                    if (isSelected) termBg = 'bg-blue-500 text-white ring-2 ring-blue-300 scale-105';
                    else if (assignedCategoryName) termBg = 'bg-green-600 text-white';

                    return (
                      <button
                        key={`cat-term-${termIndex}`}
                        onClick={() => {
                          if (assignedCategoryName) { // If term is already assigned, clicking it unassigns it
                            const categoryTerms = userAnswers[assignedCategoryName].filter(idx => idx !== termIndex);
                            const newAnswers = {
                              ...userAnswers,
                              [assignedCategoryName]: categoryTerms.length > 0 ? categoryTerms : undefined
                            };
                            setUserAnswers(newAnswers);
                            if(selectedTerm && selectedTerm.index === termIndex) setSelectedTerm(null); // Deselect if it was selected
                          } else { // Not assigned, so select it
                            handleMatchingSelect('category_term', termIndex, term);
                          }
                        }}
                        className={`w-full p-3 rounded-lg transition-all duration-200 text-left ${termBg}`}
                      >
                        {term}
                        {assignedCategoryName && (
                          <span className="text-xs block opacity-70 mt-1">→ {assignedCategoryName.replace(/_/g, ' ')}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Categories Columns */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(exercise.categories).map(([categoryKey, categoryDetails]) => {
                    // Use categoryKey for userAnswers, as it's the direct key from data
                    const assignedTermIndices = userAnswers[categoryKey] || [];
                    return (
                      <div key={categoryKey} className="space-y-3 flex flex-col bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                        <button
                          onClick={() => {
                            if (selectedTerm && selectedTerm.type === 'category_term' && selectedTerm.index !== null) {
                              const termIdxToAssign = selectedTerm.index;
                              let updatedAnswers = { ...userAnswers };

                              // Remove term from any other category it might be in
                              Object.keys(exercise.categories).forEach(catKey => {
                                if (updatedAnswers[catKey] && catKey !== categoryKey) {
                                  updatedAnswers[catKey] = (updatedAnswers[catKey] || []).filter(idx => idx !== termIdxToAssign);
                                  if (updatedAnswers[catKey].length === 0) delete updatedAnswers[catKey];
                                }
                              });

                              // Add/remove from the clicked category
                              let currentCategoryTerms = updatedAnswers[categoryKey] || [];
                              if (currentCategoryTerms.includes(termIdxToAssign)) {
                                // Already in this category, so unassign (remove it)
                                currentCategoryTerms = currentCategoryTerms.filter(idx => idx !== termIdxToAssign);
                              } else {
                                // Not in this category, so add it
                                currentCategoryTerms = [...currentCategoryTerms, termIdxToAssign];
                              }
                              
                              if (currentCategoryTerms.length > 0) {
                                updatedAnswers[categoryKey] = currentCategoryTerms;
                              } else {
                                delete updatedAnswers[categoryKey]; // Clean up if category becomes empty
                              }

                              setUserAnswers(updatedAnswers);
                              setSelectedTerm(null); // Clear selected term after action
                            }
                          }}
                          className={`w-full p-3 rounded-lg text-center transition-all duration-200 mb-2
                            ${selectedTerm && selectedTerm.type === 'category_term' 
                              ? 'bg-purple-600 hover:bg-purple-500 text-white ring-2 ring-purple-300 shadow-lg' 
                              : 'bg-slate-600/80 hover:bg-slate-500/80 text-purple-200 shadow-md'
                            }
                          `}
                          // Disable if no term is selected for categorization
                          // Or, enable to allow clicking to assign the selected term.
                        >
                          <h4 className="text-lg font-semibold">{categoryDetails.title || categoryKey.replace(/_/g, ' ')}</h4>
                          {categoryDetails.description && 
                            <p className="text-xs opacity-70 mt-1">{categoryDetails.description}</p>
                          }
                           {selectedTerm && selectedTerm.type === 'category_term' && (
                            <span className="block text-xs mt-1 text-purple-100 italic">Assign "{selectedTerm.text}" here?</span>
                          )}
                        </button>
                        <div className="bg-slate-800/70 rounded-lg p-3 min-h-[100px] space-y-2 border border-slate-600/70 flex-grow flex flex-col justify-center">
                          {assignedTermIndices.length > 0 ? (
                            assignedTermIndices.map((termIndex) => (
                              <div key={`assigned-${categoryKey}-${termIndex}`} className="bg-slate-700 p-2 rounded text-sm text-white shadow-md">
                                {exercise.terms[termIndex]}
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 text-center italic py-2">No terms assigned yet.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>Category sorting data not available.</p>
              </div>
            )}
          </div>
                 )}

         {/* Fallback for unknown exercise types */}
         {!['matching', 'fill_in_blank', 'true_false', 'category_sort'].includes(exercise.type) && (
           <div className="text-center text-gray-400 py-8">
             <p>Exercise type not supported: {exercise.type}</p>
             <p className="text-sm mt-2">Please try refreshing the page or contact support.</p>
           </div>
         )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevExercise}
          disabled={currentExercise === 0}
          className="px-6 py-3 bg-gray-600 disabled:bg-gray-700 disabled:opacity-50 rounded-xl text-white font-medium transition-all duration-300 hover:bg-gray-500 disabled:hover:bg-gray-700"
        >
          ← Previous
        </button>
        
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Progress</div>
          <div className="flex space-x-2">
            {exercises.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentExercise ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={nextExercise}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
        >
          {currentExercise === exercises.length - 1 ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

const SandboxSlide = ({ slide, onComplete, onNext, isActive }) => {
  const { user } = useAuth();
  const { title, instructions, scenario, suggestedPrompt, successCriteria, exercises } = slide.content;
  const [showInstructions, setShowInstructions] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [promptCount, setPromptCount] = useState(0);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionId] = useState(() => SandboxAPIService.generateSessionId());

  const MAX_PROMPTS_PER_LESSON = 3;
  const MAX_DAILY_PROMPTS = 15;

  // Check if this is a vocabulary exercise lesson
  const isVocabularyLesson = exercises && exercises.length > 0;



  // If this is a vocabulary lesson, render the vocabulary exercises component
  if (isVocabularyLesson) {
    return (
      <VocabularyExercises 
        exercises={exercises}
        instructions={instructions}
        title={title}
        onComplete={onComplete}
        onNext={onNext}
      />
    );
  }

  // Load daily usage on component mount
  useEffect(() => {
    if (user) {
      loadDailyUsage();
    }
  }, [user]);

  const loadDailyUsage = async () => {
    try {
      // Get today's usage count from localStorage (fallback) or could be from Firestore
      const today = new Date().toDateString();
      const stored = localStorage.getItem(`daily_prompts_${today}`);
      const usage = stored ? parseInt(stored) : 0;
      setDailyUsage(usage);
    } catch (error) {
      console.error('Error loading daily usage:', error);
    }
  };

  const updateDailyUsage = () => {
    const today = new Date().toDateString();
    const newUsage = dailyUsage + 1;
    setDailyUsage(newUsage);
    localStorage.setItem(`daily_prompts_${today}`, newUsage.toString());
  };

  const handleStartPractice = () => {
    setShowInstructions(false);
    if (suggestedPrompt) {
      setUserInput(suggestedPrompt);
    }
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setError('Please enter your prompt');
      return;
    }

    if (!user) {
      setError('Please log in to use the AI sandbox');
      return;
    }

    // Check daily limit
    if (dailyUsage >= MAX_DAILY_PROMPTS) {
      setShowLimitModal(true);
      return;
    }

    // Check lesson limit
    if (promptCount >= MAX_PROMPTS_PER_LESSON) {
      setError(`You've reached the maximum of ${MAX_PROMPTS_PER_LESSON} prompts for this lesson`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Add user message to conversation
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: userInput.trim(),
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, userMessage]);
      setUserInput('');

      // Send to AI
      const context = {
        lessonId: slide.id,
        sandboxType: 'ai_game_generator', // or get from slide config
        userLevel: 'intermediate'
      };

      const result = await SandboxAPIService.processSandboxPrompt(
        user.uid,
        sessionId,
        userMessage.content,
        context
      );

      if (result.success) {
        // Add AI response to conversation
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: result.response,
          timestamp: new Date(),
          provider: result.provider
        };
        
        setConversation(prev => [...prev, aiMessage]);
        setPromptCount(prev => prev + 1);
        updateDailyUsage();
      } else {
        setError(result.error || 'Failed to get AI response');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndLesson = () => {
    setIsComplete(true);
    onComplete(slide.id, {
      conversation: conversation,
      promptsUsed: promptCount,
      completed: true
    });
  };

  // Daily limit modal
  const DailyLimitModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-4 text-center"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="text-6xl mb-6">⏰</div>
        <h3 className="text-2xl font-bold text-white mb-4">Daily Limit Reached</h3>
        <p className="text-slate-300 mb-6 leading-relaxed">
          You've used your {MAX_DAILY_PROMPTS} AI prompts for today. Come back tomorrow for more creative adventures!
        </p>
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-4 mb-6">
          <p className="text-cyan-200 font-semibold">
            {dailyUsage} / {MAX_DAILY_PROMPTS} prompts used today
          </p>
        </div>
        <button
          onClick={() => setShowLimitModal(false)}
          className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/30 transform hover:scale-105"
        >
          Understood ✨
        </button>
      </motion.div>
    </div>
  );

  if (showInstructions) {
    return (
      <>
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-8xl mb-8">🎮</div>
            <h2 className="text-5xl font-bold text-white mb-6">{title}</h2>
            <p className="text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto">{instructions}</p>
          </motion.div>

          {/* Goal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-8"
            style={{
              boxShadow: '0 8px 32px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-3xl font-bold text-white">Your Mission</h3>
            </div>
            <p className="text-cyan-100 text-xl leading-relaxed">
              {scenario || "Create a prompt that generates a complete, playable browser game. Your prompt should describe the game mechanics, visual style, and player interactions clearly enough for AI to build it perfectly."}
            </p>
          </motion.div>

          {/* Stats & Instructions - Stacked */}
          <div className="space-y-8">
            {/* Usage Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-3xl p-6"
              style={{
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <span className="text-white text-lg">📊</span>
                </div>
                <h3 className="text-xl font-bold text-white">Your Progress</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/20 rounded-xl p-3">
                  <div className="text-center">
                    <span className="text-emerald-200 text-sm font-medium block mb-1">This Lesson</span>
                    <span className="text-white font-bold text-lg">{promptCount} / {MAX_PROMPTS_PER_LESSON}</span>
                  </div>
                </div>
                <div className="bg-emerald-500/20 rounded-xl p-3">
                  <div className="text-center">
                    <span className="text-emerald-200 text-sm font-medium block mb-1">Daily Usage</span>
                    <span className="text-white font-bold text-lg">{dailyUsage} / {MAX_DAILY_PROMPTS}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* How to Use Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-6"
              style={{
                boxShadow: '0 8px 32px rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="text-white text-lg">📝</span>
                </div>
                <h3 className="text-xl font-bold text-white">How to Use This AI Tool</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-500/20 rounded-xl p-4">
                  <h4 className="font-bold text-white mb-2 text-sm">Step 1: Create Your Prompt</h4>
                  <p className="text-purple-100 text-sm leading-relaxed">Write a detailed description. Be specific about controls, visuals, and game mechanics.</p>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-4">
                  <h4 className="font-bold text-white mb-2 text-sm">Step 2: Wait for AI Response</h4>
                  <p className="text-purple-100 text-sm leading-relaxed">ChatGPT will generate your code. This takes 10-30 seconds depending on complexity.</p>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-4">
                  <h4 className="font-bold text-white mb-2 text-sm">Step 3: Refine if Needed</h4>
                  <p className="text-purple-100 text-sm leading-relaxed">Not perfect? Create another prompt to modify or improve specific aspects.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center pt-4"
          >
            <button
              onClick={handleStartPractice}
              className="px-16 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-3xl font-bold text-2xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/30 transform hover:scale-105"
            >
              Start Creating 🚀
            </button>
          </motion.div>
        </div>
        
        {showLimitModal && <DailyLimitModal />}
      </>
    );
  }

  if (isComplete) {
    return (
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">Excellent Work!</h2>
          <p className="text-gray-300 mb-4">You've completed the AI sandbox practice!</p>
          
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-600/50">
            <div className="text-sm text-slate-300 space-y-1">
              <div>💬 Prompts used: <span className="text-white font-medium">{promptCount}</span></div>
              <div>🤖 AI responses: <span className="text-white font-medium">{conversation.filter(m => m.type === 'ai').length}</span></div>
            </div>
          </div>
          
          <motion.button
            onClick={onNext}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold shadow-lg transition-all duration-300"
          >
            Continue to Next Section →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Main sandbox interface
  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Goal Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6"
          style={{
            boxShadow: '0 8px 32px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <span className="text-white text-lg">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Your Mission</h3>
          </div>
          <p className="text-cyan-100 text-lg leading-relaxed">
            {scenario || "Create a prompt that generates a complete, playable browser game. Your prompt should describe the game mechanics, visual style, and player interactions clearly enough for AI to build it perfectly."}
          </p>
          
          {/* Usage Stats */}
          <div className="mt-4 flex items-center justify-between bg-black/20 rounded-lg px-4 py-2">
            <div className="text-cyan-200 text-sm">
              <span className="opacity-70">Prompts Used:</span> <span className="font-semibold">{promptCount} / {MAX_PROMPTS_PER_LESSON}</span>
            </div>
            <div className="text-cyan-200 text-sm">
              <span className="opacity-70">Daily:</span> <span className="font-semibold">{dailyUsage} / {MAX_DAILY_PROMPTS}</span>
            </div>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6"
          style={{
            boxShadow: '0 8px 32px rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white text-lg">💡</span>
            </div>
            <h3 className="text-xl font-bold text-white">Pro Tips</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-purple-100 text-sm">Be specific about player controls (arrow keys, mouse clicks)</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-purple-100 text-sm">Describe the visual style (colors, shapes, themes)</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-purple-100 text-sm">Include win/lose conditions and scoring</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-purple-100 text-sm">Ask for a complete HTML file with embedded code</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl overflow-hidden"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Header for output area */}
          <div className="bg-slate-700/50 px-6 py-3 border-b border-slate-600/50">
            <h3 className="text-white font-semibold flex items-center space-x-2">
              <span className="text-lg">💬</span>
              <span>AI Conversation & Output</span>
            </h3>
            <p className="text-slate-300 text-sm mt-1">Your prompts and ChatGPT's responses will appear below</p>
          </div>
          
          {/* Chat Messages Area */}
          <div className="h-80 overflow-y-auto p-6 space-y-4">
            {conversation.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤖</div>
                <p className="text-slate-300 text-lg mb-6">Ready to create something amazing?</p>
                {suggestedPrompt && (
                  <button
                    onClick={() => setUserInput(suggestedPrompt)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
                  >
                    ✨ Use Auto Prompt
                  </button>
                )}
              </div>
            )}
            
            <AnimatePresence>
              {conversation.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-6 py-4 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30' 
                      : 'bg-slate-700/60 text-slate-100 backdrop-blur-sm'
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-3 opacity-70 ${
                      message.type === 'user' ? 'text-cyan-100' : 'text-slate-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {message.type === 'ai' && message.provider && (
                        <span className="ml-2">• {message.provider}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-slate-700/60 backdrop-blur-sm rounded-2xl px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-slate-300 text-sm">AI is creating your game...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Enhanced Input Area */}
          <div className="bg-slate-800/60 backdrop-blur-sm p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 backdrop-blur-sm rounded-xl">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Large prompt input */}
              <div className="relative">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSubmit();
                    }
                  }}
                  placeholder={promptCount >= MAX_PROMPTS_PER_LESSON ? "You've reached the prompt limit for this lesson" : "Describe your game idea in detail - be specific about controls, visuals, and gameplay! (Press Enter to send, Shift+Enter for new line)"}
                  disabled={promptCount >= MAX_PROMPTS_PER_LESSON || isLoading}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  className="w-full h-32 bg-slate-700/50 backdrop-blur-sm rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed text-lg leading-relaxed"
                  style={{
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                  {userInput.length > 0 && (
                    <span className="text-cyan-400">
                      {userInput.length} characters
                    </span>
                  )}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  {suggestedPrompt && (
                    <button
                      onClick={() => setUserInput(suggestedPrompt)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-purple-500/30"
                    >
                      🎯 Auto Prompt
                    </button>
                  )}
                  <button
                    onClick={() => setUserInput('')}
                    className="px-4 py-2 bg-slate-600/50 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-all duration-300"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  {promptCount > 0 && (
                    <button
                      onClick={handleEndLesson}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-green-600 transition-all duration-300 shadow-lg shadow-green-500/30"
                    >
                      Complete Lesson ✓
                    </button>
                  )}
                  
                  <button
                    onClick={handleSubmit}
                    disabled={!userInput.trim() || promptCount >= MAX_PROMPTS_PER_LESSON || isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/30 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <span className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </span>
                    ) : (
                      'Send to AI 🚀'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showLimitModal && <DailyLimitModal />}
    </>
  );
};

export default SandboxSlide; 