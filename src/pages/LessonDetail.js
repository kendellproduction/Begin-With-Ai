import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import LoggedInNavbar from '../components/LoggedInNavbar';
import InteractiveSandbox from '../components/InteractiveSandbox';
import { AdaptiveLessonService } from '../services/adaptiveLessonService';
import { completeLesson } from '../services/progressService';

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { awardXP } = useGamification();
  
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [sandboxCompleted, setSandboxCompleted] = useState(false);
  const [userSkillLevel, setUserSkillLevel] = useState('intermediate');

  // Get path and module info from navigation state
  const pathId = location.state?.pathId || 'prompt-engineering-mastery';
  const moduleId = location.state?.moduleId;

  useEffect(() => {
    loadLesson();
    
    // Get user's skill level from localStorage (from assessment)
    const assessmentResults = localStorage.getItem('aiAssessmentResults');
    if (assessmentResults) {
      const results = JSON.parse(assessmentResults);
      setUserSkillLevel(results.skillLevel || 'intermediate');
    }
  }, [lessonId, pathId, moduleId, userSkillLevel]);

  const loadLesson = async () => {
    setIsLoading(true);
    setError('');

    try {
      // First try to load from adaptive lesson system
      if (moduleId) {
        const adaptiveLesson = await AdaptiveLessonService.getAdaptedLesson(
          pathId,
          moduleId,
          lessonId,
          userSkillLevel
        );
        
        if (adaptiveLesson) {
          setLesson(adaptiveLesson);
          setIsLoading(false);
          return;
        }
      }

      // Fallback: try to find lesson in any module
      const learningPath = await AdaptiveLessonService.getAdaptedLearningPath(
        pathId,
        { skillLevel: userSkillLevel }
      );

      if (learningPath && learningPath.modules) {
        let foundLesson = null;
        for (const module of learningPath.modules) {
          const lessonInModule = module.lessons.find(l => l.id === lessonId);
          if (lessonInModule) {
            foundLesson = {
              ...lessonInModule,
              moduleId: module.id,
              moduleTitle: module.title,
              adaptedContent: AdaptiveLessonService.adaptContentForSkillLevel(lessonInModule, userSkillLevel)
            };
            break;
          }
        }
        
        if (foundLesson) {
          setLesson(foundLesson);
        } else {
          setError('Lesson not found');
        }
      } else {
        setError('Learning path not found');
      }
    } catch (err) {
      console.error('Error loading lesson:', err);
      setError('Failed to load lesson. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSandboxComplete = (completionData) => {
    setSandboxCompleted(true);
    console.log('Sandbox completed:', completionData);
  };

  const handleCompleteLesson = async () => {
    if (!user || !lesson) return;

    try {
      const completionData = {
        pathId: pathId,
        moduleId: lesson.moduleId,
        sandboxCompleted: sandboxCompleted,
        xpAward: lesson.adaptedContent?.xpReward || 20,
        userInputs: [],
        notes: `Completed ${lesson.title} at ${userSkillLevel} level`
      };

      const result = await completeLesson(user.uid, lesson.id, completionData);
      
      if (result.success) {
        setLessonCompleted(true);
        
        // Award XP through gamification context
        awardXP(completionData.xpAward, `Completed: ${lesson.title}`);
        
        // Navigate to next lesson or back to overview
        setTimeout(() => {
          navigate('/lessons', { 
            state: { 
              completedLesson: lesson.id,
              pathId: pathId 
            } 
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      setError('Failed to complete lesson. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <LoggedInNavbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-xl text-gray-300">Loading lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <LoggedInNavbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-4">{error}</h1>
            <button
              onClick={() => navigate('/lessons')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors"
            >
              Back to Lessons
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <LoggedInNavbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
            <button
              onClick={() => navigate('/lessons')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors"
            >
              Back to Lessons
            </button>
          </div>
        </div>
      </div>
    );
  }

  const content = lesson.adaptedContent?.content || lesson.content?.intermediate || {};
  const sandboxConfig = lesson.adaptedContent?.sandbox || lesson.sandbox?.intermediate || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <LoggedInNavbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <button 
              onClick={() => navigate('/lessons')}
              className="hover:text-white transition-colors"
            >
              Lessons
            </button>
            <span>→</span>
            {lesson.moduleTitle && (
              <>
                <span>{lesson.moduleTitle}</span>
                <span>→</span>
              </>
            )}
            <span className="text-white">{lesson.title}</span>
          </div>
        </div>

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userSkillLevel === 'beginner' ? 'bg-green-600/30 text-green-300' :
                    userSkillLevel === 'intermediate' ? 'bg-yellow-600/30 text-yellow-300' :
                    'bg-red-600/30 text-red-300'
                  }`}>
                    {userSkillLevel.charAt(0).toUpperCase() + userSkillLevel.slice(1)} Level
                  </span>
                  <span className="text-sm text-gray-400">
                    {lesson.adaptedContent?.estimatedTime || 15} min
                  </span>
                  <span className="text-sm text-gray-400">
                    {lesson.adaptedContent?.xpReward || 20} XP
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-4">{lesson.title}</h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {content.introduction || lesson.coreConcept}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Main Content */}
          {content.mainContent && (
            <section className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <span className="text-3xl mr-3">📚</span>
                Learn the Concepts
              </h2>
              <div className="prose prose-invert max-w-none">
                {typeof content.mainContent === 'string' ? (
                  <p className="text-gray-300 leading-relaxed text-lg">{content.mainContent}</p>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(content.mainContent).map(([key, value]) => (
                      <div key={key} className="bg-gray-800/50 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-3 text-blue-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        {typeof value === 'string' ? (
                          <p className="text-gray-300 leading-relaxed">{value}</p>
                        ) : Array.isArray(value) ? (
                          <ul className="space-y-2">
                            {value.map((item, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2"></span>
                                <span className="text-gray-300">{typeof item === 'object' ? `${item.type}: ${item.description}` : item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-300">{JSON.stringify(value)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Examples Section */}
          {content.examples && content.examples.length > 0 && (
            <section className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <span className="text-3xl mr-3">💡</span>
                Examples
              </h2>
              <div className="grid gap-6">
                {content.examples.map((example, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-blue-500/30">
                    <p className="text-blue-200 leading-relaxed">{example}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interactive Sandbox */}
          {lesson.sandbox?.required && (
            <section className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <span className="text-3xl mr-3">🚀</span>
                Interactive Practice
              </h2>
              <InteractiveSandbox
                sandboxConfig={sandboxConfig}
                lessonId={lesson.id}
                onComplete={handleSandboxComplete}
              />
            </section>
          )}

          {/* Common Misunderstandings */}
          {content.commonMisunderstandings && content.commonMisunderstandings.length > 0 && (
            <section className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <span className="text-3xl mr-3">⚠️</span>
                Common Misunderstandings
              </h2>
              <div className="space-y-4">
                {content.commonMisunderstandings.map((misunderstanding, index) => (
                  <div key={index} className="bg-yellow-900/20 border border-yellow-600/30 rounded-2xl p-4">
                    <p className="text-yellow-200">{misunderstanding}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Completion Section */}
          <section className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-3xl p-8 border border-green-500/30">
            <div className="text-center">
              {lessonCompleted ? (
                <div>
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-green-400 mb-4">Lesson Complete!</h2>
                  <p className="text-green-200 mb-6">
                    Great job! You've completed this lesson and earned {lesson.adaptedContent?.xpReward || 20} XP.
                  </p>
                  <div className="animate-pulse text-green-300">
                    Returning to lessons overview...
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                    <span className="text-3xl mr-3">✅</span>
                    Ready to Complete?
                  </h2>
                  <p className="text-gray-300 mb-6">
                    {sandboxConfig && lesson.sandbox?.required 
                      ? sandboxCompleted 
                        ? "You've completed the interactive practice! Now you can complete the lesson."
                        : "Complete the interactive practice above to unlock lesson completion."
                      : "Mark this lesson as complete to track your progress and earn XP."
                    }
                  </p>
                  <button
                    onClick={handleCompleteLesson}
                    disabled={lesson.sandbox?.required && !sandboxCompleted}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {lesson.sandbox?.required && !sandboxCompleted 
                      ? 'Complete Practice First' 
                      : `Complete Lesson (+${lesson.adaptedContent?.xpReward || 20} XP)`
                    }
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LessonDetail; 