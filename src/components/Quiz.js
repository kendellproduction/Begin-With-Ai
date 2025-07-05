import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lessonsData from '../utils/lessonsData';
import quizData from '../utils/quizData';
import OptimizedStarField from './OptimizedStarField';

const Quiz = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const lesson = lessonsData.find(l => l.id === parseInt(lessonId));
    if (lesson) {
      setQuestions(quizData[lesson.quizId] || []);
    }
  }, [lessonId]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{ backgroundColor: '#3b82f6' }}>
        {/* Optimized Star Field */}
        <OptimizedStarField starCount={150} opacity={0.8} speed={1} size={1.2} />

        <div className="text-center relative z-10">
          <h1 className="text-2xl font-bold mb-4">Loading quiz...</h1>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSubmit = () => {
    if (selectedOption === currentQuestion.correct) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      navigate(`/lesson/${lessonId}/results`, {
        state: { score, total: questions.length }
      });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4" style={{ backgroundColor: '#3b82f6' }}>
      {/* Optimized Star Field */}
      <OptimizedStarField starCount={150} opacity={0.8} speed={1} size={1.2} />

      <div className="max-w-2xl w-full bg-gray-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showAnswer && setSelectedOption(index)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                selectedOption === index
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              } ${
                showAnswer && index === currentQuestion.correct
                  ? 'bg-green-600'
                  : showAnswer && selectedOption === index && index !== currentQuestion.correct
                  ? 'bg-red-600'
                  : ''
              }`}
              disabled={showAnswer}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showAnswer && (
          <div className="mb-8 p-4 bg-gray-700/50 rounded-xl">
            <p className="text-gray-300">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          {!showAnswer ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedOption === null
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all duration-300"
            >
              {isLastQuestion ? 'See Results' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz; 