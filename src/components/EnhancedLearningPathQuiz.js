import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import LoggedInNavbar from './LoggedInNavbar';

const EnhancedLearningPathQuiz = () => {
  const { user } = useAuth();
  const { awardXP } = useGamification();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Enhanced 15-question assessment focused on AI learning (no project building)
  const questions = [
    // Welcome slide
    {
      id: 'welcome',
      category: '👋 Welcome to BeginningWithAi',
      question: "Let's create your perfect AI learning path!",
      type: 'info-slide',
      content: {
        title: "Enhanced AI Learning Assessment",
        description: "15 thoughtful questions to create a highly personalized learning experience that helps you master AI tools and concepts effectively.",
        benefits: [
          "🎯 Precisely matched to your experience level",
          "⚡ Optimized for your learning style and pace", 
          "💡 Focused on AI tools you want to master",
          "📈 Designed for your specific goals and challenges"
        ]
      }
    },

    // Core Experience Assessment
    {
      id: 'ai_experience',
      category: '🤖 AI Experience Level',
      question: "What's your current experience with AI tools?",
      type: 'single-choice',
      options: [
        { text: "Complete beginner - never used AI tools", value: 'none', skillPoints: { beginner: 4, intermediate: 0, advanced: 0 } },
        { text: "Tried ChatGPT or similar once or twice", value: 'minimal', skillPoints: { beginner: 3, intermediate: 1, advanced: 0 } },
        { text: "Use AI tools occasionally (few times a month)", value: 'occasional', skillPoints: { beginner: 2, intermediate: 2, advanced: 0 } },
        { text: "Use AI tools regularly (weekly)", value: 'regular', skillPoints: { beginner: 1, intermediate: 3, advanced: 1 } },
        { text: "AI tools are part of my daily routine", value: 'daily', skillPoints: { beginner: 0, intermediate: 2, advanced: 3 } },
        { text: "I'm advanced with AI tools and techniques", value: 'expert', skillPoints: { beginner: 0, intermediate: 0, advanced: 4 } }
      ]
    },

    // Learning Pace Preference
    {
      id: 'learning_pace',
      category: '📚 Learning Style',
      question: "How do you prefer to learn new concepts?",
      type: 'single-choice',
      options: [
        { text: "Very slowly with lots of detailed explanation", value: 'slow', paceScore: 1 },
        { text: "Step-by-step with clear examples", value: 'guided', paceScore: 2 },
        { text: "At a steady, moderate pace", value: 'moderate', paceScore: 3 },
        { text: "Quickly with concise explanations", value: 'fast', paceScore: 4 },
        { text: "Jump to advanced concepts rapidly", value: 'accelerated', paceScore: 5 }
      ]
    },

    // Time Commitment Assessment
    {
      id: 'time_availability',
      category: '⏰ Time Commitment',
      question: "How much time can you typically dedicate per learning session?",
      type: 'single-choice',
      options: [
        { text: "15-20 minutes (quick sessions)", value: 'short', timeScore: 1, sessionMinutes: 18 },
        { text: "25-35 minutes (focused sessions)", value: 'medium', timeScore: 2, sessionMinutes: 30 },
        { text: "40-60 minutes (deep learning)", value: 'long', timeScore: 3, sessionMinutes: 50 },
        { text: "1+ hours when I have time", value: 'extended', timeScore: 4, sessionMinutes: 75 },
        { text: "Varies - prefer flexible timing", value: 'flexible', timeScore: 2, sessionMinutes: 35 }
      ]
    },

    // Primary Learning Goals
    {
      id: 'primary_goals',
      category: '🎯 Your AI Learning Goals',
      question: "What do you want to achieve with AI? (Select all that apply)",
      type: 'multi-choice',
      options: [
        { text: "Understand AI basics and how it works", value: 'understand_basics', category: 'foundational' },
        { text: "Master prompt engineering techniques", value: 'prompt_engineering', category: 'practical' },
        { text: "Use AI for work productivity and efficiency", value: 'work_productivity', category: 'professional' },
        { text: "Create content with AI (writing, images, videos)", value: 'content_creation', category: 'creative' },
        { text: "Stay current with AI trends and developments", value: 'stay_current', category: 'knowledge' },
        { text: "Understand AI ethics and responsible use", value: 'ethics_safety', category: 'responsible' },
        { text: "Use AI for personal tasks and organization", value: 'personal_use', category: 'lifestyle' },
        { text: "Teach others about AI tools and concepts", value: 'teach_others', category: 'teaching' }
      ]
    },

    // Technical Comfort Level
    {
      id: 'technical_comfort',
      category: '💻 Technical Comfort',
      question: "How comfortable are you with technology in general?",
      type: 'single-choice',
      options: [
        { text: "Prefer simple, non-technical explanations", value: 'basic', techLevel: 0 },
        { text: "Comfortable with basic tech concepts", value: 'comfortable', techLevel: 1 },
        { text: "Good with technology, enjoy learning new tools", value: 'proficient', techLevel: 2 },
        { text: "Very tech-savvy, like understanding how things work", value: 'advanced', techLevel: 3 },
        { text: "Expert level - interested in technical details", value: 'expert', techLevel: 4 }
      ]
    },

    // Professional Context
    {
      id: 'professional_context',
      category: '🏢 Professional Background',
      question: "Which best describes your professional situation?",
      type: 'single-choice',
      options: [
        { text: "Student or recent graduate", value: 'student', domain: 'education' },
        { text: "Marketing, creative, or content professional", value: 'creative', domain: 'creative' },
        { text: "Business, management, or consulting", value: 'business', domain: 'business' },
        { text: "Education, training, or teaching", value: 'educator', domain: 'education' },
        { text: "Technology or software industry", value: 'tech', domain: 'technology' },
        { text: "Healthcare or medical field", value: 'healthcare', domain: 'healthcare' },
        { text: "Finance, legal, or professional services", value: 'finance', domain: 'professional' },
        { text: "Retired, career transition, or other", value: 'other', domain: 'general' }
      ]
    },

    // Learning Challenges Assessment
    {
      id: 'learning_challenges',
      category: '🚧 Potential Learning Challenges',
      question: "What might make learning AI challenging for you? (Select all that apply)",
      type: 'multi-choice',
      options: [
        { text: "Technical jargon and complex terminology", value: 'jargon', concern: 'complexity' },
        { text: "Finding consistent time to practice and learn", value: 'time', concern: 'time_management' },
        { text: "Keeping up with rapidly changing AI landscape", value: 'pace', concern: 'information_overload' },
        { text: "Understanding real-world applications", value: 'practical', concern: 'application_gap' },
        { text: "Feeling overwhelmed by too much information", value: 'overwhelm', concern: 'confidence' },
        { text: "Lack of hands-on practice opportunities", value: 'practice', concern: 'application' },
        { text: "None - I'm confident about learning AI", value: 'none', concern: 'confident' }
      ]
    },

    // Content Learning Preferences
    {
      id: 'content_preferences',
      category: '📖 Learning Content Style',
      question: "What type of learning content works best for you? (Select all that apply)",
      type: 'multi-choice',
      options: [
        { text: "Step-by-step tutorials with clear examples", value: 'tutorials', style: 'guided' },
        { text: "Interactive exercises and hands-on practice", value: 'interactive', style: 'hands_on' },
        { text: "Real-world case studies and use cases", value: 'case_studies', style: 'contextual' },
        { text: "Quick tips and practical shortcuts", value: 'quick_tips', style: 'concise' },
        { text: "In-depth explanations and background theory", value: 'detailed', style: 'comprehensive' },
        { text: "Visual diagrams and infographics", value: 'visual', style: 'visual' },
        { text: "Lists, summaries, and reference materials", value: 'reference', style: 'reference' }
      ]
    },

    // Immediate AI Interests
    {
      id: 'immediate_interests',
      category: '⚡ Most Exciting AI Topics',
      question: "Which AI topic interests you most right now?",
      type: 'single-choice',
      options: [
        { text: "ChatGPT and conversational AI assistants", value: 'chat_ai', topic: 'conversational_ai' },
        { text: "AI image generation (DALL-E, Midjourney, etc.)", value: 'image_ai', topic: 'creative_ai' },
        { text: "AI for writing, editing, and content creation", value: 'writing_ai', topic: 'content_ai' },
        { text: "AI for business productivity and automation", value: 'business_ai', topic: 'business_ai' },
        { text: "AI ethics, safety, and societal impact", value: 'ethics_ai', topic: 'ai_ethics' },
        { text: "Understanding how AI actually works (technical)", value: 'technical_ai', topic: 'ai_fundamentals' },
        { text: "Future of AI and emerging trends", value: 'future_ai', topic: 'ai_trends' }
      ]
    },

    // Success Definition
    {
      id: 'success_definition',
      category: '🏆 Success Metrics',
      question: "How will you know you've succeeded in learning AI?",
      type: 'single-choice',
      options: [
        { text: "I can confidently use AI tools for daily tasks", value: 'daily_use', outcome: 'practical_mastery' },
        { text: "I understand AI concepts and can explain them", value: 'understand_explain', outcome: 'conceptual_mastery' },
        { text: "I can effectively use AI for my work or studies", value: 'work_application', outcome: 'professional_mastery' },
        { text: "I stay informed about AI developments", value: 'stay_informed', outcome: 'knowledge_mastery' },
        { text: "I can help others learn about AI", value: 'teach_others', outcome: 'teaching_mastery' },
        { text: "I'm no longer intimidated or confused by AI", value: 'confidence', outcome: 'confidence_mastery' }
      ]
    },

    // Motivation and Urgency
    {
      id: 'motivation_level',
      category: '🔥 Motivation Level',
      question: "How urgent is learning AI for you right now?",
      type: 'single-choice',
      options: [
        { text: "Very urgent - critical for my career/studies", value: 'urgent', motivation: 5 },
        { text: "Important - I see clear benefits", value: 'important', motivation: 4 },
        { text: "Moderately interested - seems useful", value: 'moderate', motivation: 3 },
        { text: "Casually curious - just exploring", value: 'casual', motivation: 2 },
        { text: "Low priority - learning when convenient", value: 'low', motivation: 1 }
      ]
    },

    // AI Tool Interests
    {
      id: 'tool_interests',
      category: '🛠️ AI Tool Preferences',
      question: "Which AI tools are you most interested in mastering? (Select all that apply)",
      type: 'multi-choice',
      options: [
        { text: "ChatGPT, Claude, and text-based AI assistants", value: 'chat_tools', priority: 'high' },
        { text: "Midjourney, DALL-E, and AI image generators", value: 'image_tools', priority: 'high' },
        { text: "AI writing assistants and content tools", value: 'writing_tools', priority: 'high' },
        { text: "AI productivity tools for work", value: 'productivity_tools', priority: 'medium' },
        { text: "AI presentation and design tools", value: 'design_tools', priority: 'medium' },
        { text: "AI for research and data analysis", value: 'research_tools', priority: 'medium' },
        { text: "Voice AI and transcription tools", value: 'voice_tools', priority: 'low' },
        { text: "Specialized AI tools for my industry", value: 'specialized_tools', priority: 'medium' }
      ]
    },

    // Learning Confidence
    {
      id: 'learning_confidence',
      category: '🧠 Learning Confidence',
      question: "How do you typically approach learning new technologies?",
      type: 'single-choice',
      options: [
        { text: "Jump right in and learn by experimenting", value: 'experimental', confidence: 5 },
        { text: "Like guided learning with some exploration", value: 'guided_exploration', confidence: 4 },
        { text: "Prefer clear instructions before trying", value: 'structured', confidence: 3 },
        { text: "Need detailed explanations and support", value: 'supported', confidence: 2 },
        { text: "Learn best by watching others first", value: 'observational', confidence: 1 }
      ]
    },

    // Final Customization
    {
      id: 'learning_priorities',
      category: '🎨 Learning Priorities',
      question: "What's most important for your AI learning experience? (Select all that apply)",
      type: 'multi-choice',
      options: [
        { text: "Practical examples I can use immediately", value: 'practical', feature: 'application_focused' },
        { text: "Clear, simple explanations without jargon", value: 'simple', feature: 'simplicity_focused' },
        { text: "Comprehensive understanding of concepts", value: 'comprehensive', feature: 'depth_focused' },
        { text: "Quick wins and immediate progress", value: 'quick_wins', feature: 'progress_focused' },
        { text: "Relevant to my work or personal interests", value: 'relevant', feature: 'relevance_focused' },
        { text: "Encouragement and confidence building", value: 'supportive', feature: 'confidence_building' },
        { text: "Staying current with latest developments", value: 'current', feature: 'trend_focused' }
      ]
    }
  ];

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Handle different question types
  const handleAnswer = (questionId, answer) => {
    if (questions[currentQuestion].type === 'multi-choice') {
      // Handle multi-select
      const currentAnswers = answers[questionId] || [];
      let newAnswers;
      
      if (currentAnswers.includes(answer)) {
        newAnswers = currentAnswers.filter(a => a !== answer);
      } else {
        newAnswers = [...currentAnswers, answer];
      }
      
      setAnswers(prev => ({
        ...prev,
        [questionId]: newAnswers
      }));
    } else {
      // Handle single select
      setAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
      
      // Auto-advance for single choice questions (except info slides)
      if (questions[currentQuestion].type !== 'info-slide') {
        setTimeout(() => {
          if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(prev => prev + 1);
          } else {
            completeQuiz();
          }
        }, 500);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeQuiz();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Enhanced calculation for optimal learning paths
  const calculateDetailedResults = (userAnswers) => {
    let skillPoints = { beginner: 0, intermediate: 0, advanced: 0 };
    let paceScore = 3; // Default moderate
    let timeScore = 2; // Default medium
    let techLevel = 0;
    let motivation = 3; // Default moderate
    let confidence = 3; // Default moderate
    
    // Extract key metrics from answers
    Object.entries(userAnswers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;

      if (question.type === 'single-choice') {
        const option = question.options?.find(opt => opt.value === answer);
        if (option) {
          // Accumulate skill points
          if (option.skillPoints) {
            Object.entries(option.skillPoints).forEach(([skill, points]) => {
              skillPoints[skill] += points;
            });
          }
          
          // Set specific scores
          if (option.paceScore) paceScore = option.paceScore;
          if (option.timeScore) timeScore = option.timeScore;
          if (option.techLevel !== undefined) techLevel = option.techLevel;
          if (option.motivation) motivation = option.motivation;
          if (option.confidence) confidence = option.confidence;
        }
      }
    });

    // Determine skill level
    const maxSkill = Math.max(skillPoints.beginner, skillPoints.intermediate, skillPoints.advanced);
    let skillLevel;
    if (maxSkill === skillPoints.advanced && skillPoints.advanced > 0) {
      skillLevel = 'advanced';
    } else if (maxSkill === skillPoints.intermediate && skillPoints.intermediate > 0) {
      skillLevel = 'intermediate';
    } else {
      skillLevel = 'beginner';
    }

    // Generate detailed profile
    const learningProfile = {
      skillLevel,
      pace: paceScore <= 2 ? 'slow' : paceScore >= 4 ? 'fast' : 'moderate',
      sessionLength: timeScore <= 1 ? 'short' : timeScore >= 3 ? 'long' : 'medium',
      techLevel,
      motivation,
      confidence,
      goals: userAnswers.primary_goals || [],
      challenges: userAnswers.learning_challenges || [],
      preferences: userAnswers.content_preferences || [],
      interests: userAnswers.tool_interests || [],
      domain: userAnswers.professional_context,
      successDefinition: userAnswers.success_definition,
      priorities: userAnswers.learning_priorities || []
    };

    // Create optimized learning path using rule-based logic (no AI needed)
    const optimizedPath = createOptimizedPathFromProfile(learningProfile, userAnswers);

    return {
      skillLevel,
      learningProfile,
      optimizedPath,
      confidence: calculateConfidence(learningProfile),
      estimatedCompletion: calculateEstimatedTime(learningProfile),
      recommendations: generateRecommendations(learningProfile),
      nextSteps: generateNextSteps(learningProfile)
    };
  };

  // Create optimized path using advanced rule-based logic (NO AI costs)
  const createOptimizedPathFromProfile = (profile, answers) => {
    const basePaths = {
      beginner: [
        { id: 'ai-welcome', title: 'Welcome to AI Learning', duration: 15, difficulty: 'beginner' },
        { id: 'what-is-ai', title: 'Understanding AI Basics', duration: 25, difficulty: 'beginner' },
        { id: 'ai-in-daily-life', title: 'AI in Your Daily Life', duration: 20, difficulty: 'beginner' },
        { id: 'first-ai-conversation', title: 'Your First AI Conversation', duration: 30, difficulty: 'beginner' }
      ],
      intermediate: [
        { id: 'ai-fundamentals', title: 'AI Fundamentals', duration: 30, difficulty: 'intermediate' },
        { id: 'prompt-engineering', title: 'Prompt Engineering Mastery', duration: 40, difficulty: 'intermediate' },
        { id: 'ai-tools-landscape', title: 'AI Tools Landscape', duration: 35, difficulty: 'intermediate' },
        { id: 'workflow-integration', title: 'AI Workflow Integration', duration: 45, difficulty: 'intermediate' }
      ],
      advanced: [
        { id: 'advanced-ai-concepts', title: 'Advanced AI Concepts', duration: 40, difficulty: 'advanced' },
        { id: 'ai-optimization', title: 'AI Optimization Techniques', duration: 50, difficulty: 'advanced' },
        { id: 'ai-strategy', title: 'AI Strategy and Planning', duration: 45, difficulty: 'advanced' },
        { id: 'ai-future-trends', title: 'AI Future and Trends', duration: 40, difficulty: 'advanced' }
      ]
    };

    let recommendedLessons = [...basePaths[profile.skillLevel]];

    // Customize based on goals (no project building)
    if (profile.goals.includes('content_creation')) {
      recommendedLessons.push({
        id: 'ai-content-mastery',
        title: 'AI Content Creation Mastery',
        duration: 40,
        difficulty: profile.skillLevel
      });
    }

    if (profile.goals.includes('work_productivity')) {
      recommendedLessons.push({
        id: 'ai-productivity-tools',
        title: 'AI Productivity Tools',
        duration: 35,
        difficulty: profile.skillLevel
      });
    }

    if (profile.goals.includes('prompt_engineering')) {
      recommendedLessons.push({
        id: 'advanced-prompting',
        title: 'Advanced Prompting Techniques',
        duration: 45,
        difficulty: profile.skillLevel
      });
    }

    // Adjust based on pace preference
    if (profile.pace === 'fast' && recommendedLessons.length > 6) {
      recommendedLessons = recommendedLessons.slice(0, 6); // Fewer lessons for faster pace
    } else if (profile.pace === 'slow') {
      // Add review lessons for slower pace
      recommendedLessons.splice(2, 0, {
        id: 'ai-concepts-review',
        title: 'AI Concepts Review',
        duration: 20,
        difficulty: profile.skillLevel
      });
    }

    // Adjust session length based on time availability
    if (profile.sessionLength === 'short') {
      recommendedLessons = recommendedLessons.map(lesson => ({
        ...lesson,
        duration: Math.min(lesson.duration, 25)
      }));
    }

    return {
      title: `${profile.skillLevel.charAt(0).toUpperCase() + profile.skillLevel.slice(1)} AI Learning Path`,
      lessons: recommendedLessons,
      estimatedDuration: recommendedLessons.reduce((sum, lesson) => sum + lesson.duration, 0),
      personalizedFor: profile
    };
  };

  const calculateConfidence = (profile) => {
    let confidence = 50; // Base confidence
    
    if (profile.motivation >= 4) confidence += 20;
    if (profile.confidence >= 4) confidence += 15;
    if (profile.techLevel >= 2) confidence += 10;
    if (!profile.challenges.includes('overwhelm')) confidence += 10;
    if (profile.pace === 'fast') confidence += 5;
    
    return Math.min(confidence, 95);
  };

  const calculateEstimatedTime = (profile) => {
    const sessionMap = {
      short: 20,
      medium: 35,
      long: 50
    };
    
    const sessionsPerWeek = profile.motivation >= 4 ? 4 : profile.motivation >= 3 ? 3 : 2;
    const minutesPerSession = sessionMap[profile.sessionLength] || 35;
    
    return `${Math.ceil(300 / (sessionsPerWeek * minutesPerSession))} weeks`;
  };

  const generateRecommendations = (profile) => {
    const recommendations = [];
    
    if (profile.pace === 'slow') {
      recommendations.push("Take your time with each concept - understanding is more important than speed");
    }
    
    if (profile.challenges.includes('jargon')) {
      recommendations.push("We'll use simple language and explain technical terms clearly");
    }
    
    if (profile.goals.includes('work_productivity')) {
      recommendations.push("Focus on practical AI tools you can use immediately in your work");
    }

    if (profile.challenges.includes('time')) {
      recommendations.push("Lessons are designed for your time constraints with flexible pacing");
    }
    
    return recommendations;
  };

  const generateNextSteps = (profile) => {
    const steps = ["Complete your personalized welcome lesson"];
    
    if (profile.skillLevel === 'beginner') {
      steps.push("Start with 'Understanding AI Basics' to build foundation");
    } else {
      steps.push("Jump into practical AI tool mastery");
    }
    
    steps.push("Practice with real AI tools in guided exercises");
    return steps;
  };

  const completeQuiz = async () => {
    setIsLoading(true);
    
    // Calculate results using enhanced logic (NO AI API calls)
    const results = calculateDetailedResults(answers);
    results.completedAt = new Date().toISOString();
    results.answersProvided = Object.keys(answers).length;

    setResults(results);
    setIsComplete(true);

    // Award XP
    if (user && awardXP && typeof awardXP === 'function') {
      try {
        awardXP(75, 'Completed Enhanced AI Learning Assessment');
      } catch (error) {
        console.log('XP award not available:', error);
      }
    }

    // Save comprehensive data
    const completionState = {
      completed: true,
      results,
      detailedAnswers: answers,
      completedAt: new Date().toISOString(),
      userId: user?.uid || 'anonymous',
      version: 'enhanced_v1'
    };
    
    // Create learning path
    const learningPath = {
      pathId: 'enhanced-personalized-path',
      pathTitle: results.optimizedPath.title,
      skillLevel: results.skillLevel,
      lessons: results.optimizedPath.lessons,
      startedAt: new Date().toISOString(),
      isActive: false,
      nextLessonIndex: 0,
      completedLessons: [],
      enhancedResults: results,
      requiresAIOptimization: false // No AI needed for most users!
    };
    
    // Save to localStorage
    localStorage.setItem('enhancedAssessmentResults', JSON.stringify(results));
    localStorage.setItem('enhancedQuizCompleted', JSON.stringify(completionState));
    localStorage.setItem('activeLearningPath', JSON.stringify(learningPath));
    
    setIsLoading(false);
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    
    if (question.type === 'info-slide') {
      return (
        <div className="text-center space-y-8">
          <div className="text-6xl mb-6">{question.category.split(' ')[0]}</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {question.content.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {question.content.description}
          </p>
          
          {question.content.benefits && (
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {question.content.benefits.map((benefit, index) => (
                <div key={index} className="text-left p-4 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={handleNext}
            className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Let's Begin! 🚀
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="text-lg text-blue-400 mb-2">{question.category}</div>
          <h2 className="text-3xl font-bold text-white mb-8">{question.question}</h2>
        </div>
        
        <div className="grid gap-4 max-w-3xl mx-auto">
          {question.options?.map((option, index) => {
            const isSelected = question.type === 'multi-choice' 
              ? (answers[question.id] || []).includes(option.value)
              : answers[question.id] === option.value;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option.value)}
                className={`p-4 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/20 text-white'
                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded border-2 mr-3 ${
                    isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                  </div>
                  <span className="font-medium">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
        
        {question.type === 'multi-choice' && (
          <div className="text-center space-x-4">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-all duration-300"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Creating your enhanced learning path...</p>
          <p className="text-sm text-gray-400 mt-2">Using intelligent algorithms (no AI costs!)</p>
        </div>
      </div>
    );
  }

  if (isComplete && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <LoggedInNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-8xl mb-6">🎯</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Your AI Learning Path is Ready!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Based on your detailed responses, we've created a highly personalized AI learning experience.
            </p>
            
            {/* Results Summary */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
                <h3 className="text-2xl font-bold text-blue-400 mb-2">{results.skillLevel.charAt(0).toUpperCase() + results.skillLevel.slice(1)}</h3>
                <p className="text-gray-300">Your Starting Level</p>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-teal-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                <h3 className="text-2xl font-bold text-green-400 mb-2">{results.optimizedPath.lessons.length} Lessons</h3>
                <p className="text-gray-300">Customized for You</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-2">{results.confidence}%</h3>
                <p className="text-gray-300">Success Confidence</p>
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div className="bg-gray-800/50 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-2xl font-bold text-white mb-4">🎯 Your Personalized Recommendations</h3>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-300 flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate('/lessons')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Start Your AI Learning Journey 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <LoggedInNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {totalQuestions}</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderQuestion()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLearningPathQuiz; 