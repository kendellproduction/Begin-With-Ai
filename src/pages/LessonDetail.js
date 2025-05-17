import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('video');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Mock lesson data - in a real app, this would come from an API
  const lesson = {
    id: lessonId,
    title: 'Introduction to Machine Learning',
    description: 'Learn the fundamentals of machine learning and its applications in AI.',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
    keyConcepts: [
      'What is Machine Learning?',
      'Types of Machine Learning',
      'Supervised vs Unsupervised Learning',
      'Common Applications',
    ],
    quiz: [
      {
        id: 1,
        question: 'What is the main goal of machine learning?',
        options: [
          'To create human-like robots',
          'To enable computers to learn from data',
          'To replace human decision making',
          'To automate all tasks',
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'Which type of learning uses labeled data?',
        options: [
          'Unsupervised Learning',
          'Reinforcement Learning',
          'Supervised Learning',
          'Deep Learning',
        ],
        correctAnswer: 2,
      },
    ],
  };

  const handleQuizSubmit = () => {
    const correctAnswers = lesson.quiz.filter(
      (q) => quizAnswers[q.id] === q.correctAnswer
    ).length;
    const score = (correctAnswers / lesson.quiz.length) * 100;
    setShowResults(true);
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-900"
    >
      {/* Hero Banner */}
      <div className="relative h-96">
        <img
          src={lesson.imageUrl}
          alt={lesson.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl font-bold text-white mb-2">{lesson.title}</h1>
          <p className="text-gray-300">{lesson.description}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-8">
          {['video', 'concepts', 'quiz'].map((section) => (
            <button
              key={section}
              onClick={() => setCurrentSection(section)}
              className={`px-4 py-2 rounded-lg ${
                currentSection === section
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="bg-gray-800 rounded-xl p-6">
          {currentSection === 'video' && (
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={lesson.videoUrl}
                title={lesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          )}

          {currentSection === 'concepts' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Key Concepts</h2>
              {lesson.keyConcepts.map((concept, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-lg p-4 flex items-start space-x-4"
                >
                  <span className="text-indigo-400 font-bold">{index + 1}.</span>
                  <p className="text-white">{concept}</p>
                </div>
              ))}
            </div>
          )}

          {currentSection === 'quiz' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Quiz</h2>
              {lesson.quiz.map((question) => (
                <div key={question.id} className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-medium text-white mb-4">
                    {question.question}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-600 rounded-lg cursor-pointer hover:bg-gray-500"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={index}
                          checked={quizAnswers[question.id] === index}
                          onChange={() =>
                            setQuizAnswers({
                              ...quizAnswers,
                              [question.id]: index,
                            })
                          }
                          className="form-radio text-indigo-600"
                        />
                        <span className="text-white">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {!showResults ? (
                <button
                  onClick={handleQuizSubmit}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Submit Quiz
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-xl text-white mb-4">
                    Great job! You've completed the quiz.
                  </p>
                  <button
                    onClick={handleComplete}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Complete Lesson
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LessonDetail; 