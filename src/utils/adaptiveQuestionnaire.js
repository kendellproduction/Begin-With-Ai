/**
 * Adaptive Questionnaire System for BeginningWithAi
 * Determines user skill level and recommends personalized learning paths
 */

export const adaptiveQuestionnaire = {
  title: "AI Learning Path Finder",
  description: "Help us create the perfect learning experience for you! This quick assessment will customize your AI journey.",
  totalQuestions: 10,
  adaptiveThreshold: 0.7, // Confidence threshold for early completion
  
  // Question categories for comprehensive assessment
  categories: {
    experience: "Prior AI Experience",
    goals: "Learning Goals", 
    context: "Usage Context",
    technical: "Technical Comfort",
    preferences: "Learning Style"
  },

  questions: [
    // Question 1: Core AI Experience (Critical)
    {
      id: 'ai-experience',
      category: 'experience',
      type: 'single_choice',
      weight: 3, // High importance
      required: true,
      
      question: "How would you describe your experience with AI tools?",
      
      options: [
        {
          value: 'never-used',
          text: "I've never used AI tools like ChatGPT or similar",
          points: { beginner: 3, intermediate: 0, advanced: 0 },
          followUp: 'tech-comfort'
        },
        {
          value: 'tried-once',
          text: "I've tried ChatGPT or similar tools a few times",
          points: { beginner: 2, intermediate: 1, advanced: 0 },
          followUp: 'usage-frequency'
        },
        {
          value: 'regular-user',
          text: "I use AI tools regularly (weekly or more)",
          points: { beginner: 0, intermediate: 3, advanced: 1 },
          followUp: 'advanced-features'
        },
        {
          value: 'power-user',
          text: "I'm comfortable with multiple AI tools and advanced features",
          points: { beginner: 0, intermediate: 1, advanced: 3 },
          followUp: 'technical-depth'
        }
      ]
    },

    // Question 2: Technical Comfort (Adaptive follow-up)
    {
      id: 'tech-comfort',
      category: 'technical',
      type: 'single_choice',
      weight: 2,
      adaptiveCondition: (answers) => answers['ai-experience']?.value === 'never-used',
      
      question: "How comfortable are you with learning new technology?",
      
      options: [
        {
          value: 'very-cautious',
          text: "I prefer simple, step-by-step guidance",
          points: { beginner: 3, intermediate: 0, advanced: 0 }
        },
        {
          value: 'moderate',
          text: "I'm okay with technology but like clear instructions",
          points: { beginner: 2, intermediate: 1, advanced: 0 }
        },
        {
          value: 'confident',
          text: "I enjoy learning new tech and figuring things out",
          points: { beginner: 1, intermediate: 2, advanced: 1 }
        }
      ]
    },

    // Question 3: Usage Frequency (For intermediate users)
    {
      id: 'usage-frequency',
      category: 'experience',
      type: 'single_choice',
      weight: 2,
      adaptiveCondition: (answers) => ['tried-once', 'regular-user'].includes(answers['ai-experience']?.value),
      
      question: "When you use AI tools, what do you typically do?",
      
      options: [
        {
          value: 'basic-questions',
          text: "Ask simple questions or basic help",
          points: { beginner: 2, intermediate: 1, advanced: 0 }
        },
        {
          value: 'specific-tasks',
          text: "Use them for specific work or school tasks",
          points: { beginner: 1, intermediate: 2, advanced: 1 }
        },
        {
          value: 'complex-projects',
          text: "Integrate AI into complex projects or workflows",
          points: { beginner: 0, intermediate: 1, advanced: 2 }
        }
      ]
    },

    // Question 4: Advanced Features (For experienced users)
    {
      id: 'advanced-features',
      category: 'technical',
      type: 'multiple_choice',
      weight: 2,
      adaptiveCondition: (answers) => ['regular-user', 'power-user'].includes(answers['ai-experience']?.value),
      
      question: "Which of these have you used? (Select all that apply)",
      
      options: [
        {
          value: 'prompt-engineering',
          text: "Carefully crafted prompts for better results",
          points: { beginner: 0, intermediate: 1, advanced: 2 }
        },
        {
          value: 'multiple-tools',
          text: "Multiple AI tools (ChatGPT + Midjourney, etc.)",
          points: { beginner: 0, intermediate: 2, advanced: 1 }
        },
        {
          value: 'api-integration',
          text: "AI APIs or integrations with other software",
          points: { beginner: 0, intermediate: 1, advanced: 3 }
        },
        {
          value: 'local-models',
          text: "Running AI models locally on my computer",
          points: { beginner: 0, intermediate: 0, advanced: 3 }
        },
        {
          value: 'none',
          text: "None of these",
          points: { beginner: 1, intermediate: 1, advanced: 0 }
        }
      ]
    },

    // Question 5: Learning Goals (Universal)
    {
      id: 'learning-goals',
      category: 'goals',
      type: 'single_choice',
      weight: 2,
      required: true,
      
      question: "What's your main goal with AI?",
      
      options: [
        {
          value: 'understand-basics',
          text: "Understand what AI is and how it works",
          points: { beginner: 3, intermediate: 1, advanced: 0 },
          pathRecommendation: 'foundation-focused'
        },
        {
          value: 'practical-skills',
          text: "Learn practical skills for work or school",
          points: { beginner: 1, intermediate: 3, advanced: 1 },
          pathRecommendation: 'application-focused'
        },
        {
          value: 'advanced-mastery',
          text: "Master advanced AI techniques and workflows",
          points: { beginner: 0, intermediate: 1, advanced: 3 },
          pathRecommendation: 'mastery-focused'
        },
        {
          value: 'business-application',
          text: "Apply AI to solve business problems",
          points: { beginner: 0, intermediate: 2, advanced: 2 },
          pathRecommendation: 'business-focused'
        }
      ]
    },

    // Question 6: Use Context
    {
      id: 'use-context',
      category: 'context',
      type: 'multiple_choice',
      weight: 1,
      
      question: "Where do you plan to use AI? (Select all that apply)",
      
      options: [
        {
          value: 'personal',
          text: "Personal projects and learning",
          points: { beginner: 1, intermediate: 1, advanced: 1 }
        },
        {
          value: 'work',
          text: "Professional work and career",
          points: { beginner: 0, intermediate: 2, advanced: 2 }
        },
        {
          value: 'education',
          text: "School and academic studies",
          points: { beginner: 2, intermediate: 1, advanced: 0 }
        },
        {
          value: 'creative',
          text: "Creative projects (art, writing, content)",
          points: { beginner: 1, intermediate: 2, advanced: 1 }
        },
        {
          value: 'business',
          text: "Business development and entrepreneurship",
          points: { beginner: 0, intermediate: 1, advanced: 3 }
        }
      ]
    },

    // Question 7: Time Commitment
    {
      id: 'time-commitment',
      category: 'preferences',
      type: 'single_choice',
      weight: 1,
      
      question: "How much time can you dedicate to learning AI?",
      
      options: [
        {
          value: 'casual',
          text: "A few minutes here and there",
          points: { beginner: 2, intermediate: 1, advanced: 0 },
          pacing: 'relaxed'
        },
        {
          value: 'regular',
          text: "15-30 minutes a few times per week",
          points: { beginner: 1, intermediate: 2, advanced: 1 },
          pacing: 'steady'
        },
        {
          value: 'intensive',
          text: "1+ hours per week, I'm motivated to learn quickly",
          points: { beginner: 0, intermediate: 1, advanced: 3 },
          pacing: 'accelerated'
        }
      ]
    },

    // Question 8: Learning Style
    {
      id: 'learning-style',
      category: 'preferences',
      type: 'single_choice',
      weight: 1,
      
      question: "How do you prefer to learn new skills?",
      
      options: [
        {
          value: 'guided',
          text: "Step-by-step with lots of examples and guidance",
          points: { beginner: 2, intermediate: 1, advanced: 0 },
          stylePreference: 'structured'
        },
        {
          value: 'practical',
          text: "Hands-on practice with real projects",
          points: { beginner: 1, intermediate: 2, advanced: 1 },
          stylePreference: 'experiential'
        },
        {
          value: 'exploratory',
          text: "Explore independently with minimal guidance",
          points: { beginner: 0, intermediate: 1, advanced: 2 },
          stylePreference: 'self-directed'
        }
      ]
    },

    // Question 9: Challenge Preference
    {
      id: 'challenge-level',
      category: 'preferences',
      type: 'single_choice',
      weight: 1,
      
      question: "When learning something new, do you prefer:",
      
      options: [
        {
          value: 'gradual',
          text: "Start easy and build up slowly",
          points: { beginner: 3, intermediate: 1, advanced: 0 }
        },
        {
          value: 'balanced',
          text: "Mix of easy and challenging content",
          points: { beginner: 1, intermediate: 2, advanced: 1 }
        },
        {
          value: 'ambitious',
          text: "Jump into challenging material quickly",
          points: { beginner: 0, intermediate: 1, advanced: 2 }
        }
      ]
    },

    // Question 10: Motivation Source
    {
      id: 'motivation',
      category: 'goals',
      type: 'single_choice',
      weight: 1,
      
      question: "What motivates you most about learning AI?",
      
      options: [
        {
          value: 'curiosity',
          text: "I'm curious about how AI works",
          points: { beginner: 2, intermediate: 1, advanced: 1 }
        },
        {
          value: 'productivity',
          text: "I want to be more productive and efficient",
          points: { beginner: 1, intermediate: 3, advanced: 1 }
        },
        {
          value: 'career',
          text: "It's important for my career advancement",
          points: { beginner: 0, intermediate: 2, advanced: 3 }
        },
        {
          value: 'innovation',
          text: "I want to build innovative solutions",
          points: { beginner: 0, intermediate: 1, advanced: 3 }
        }
      ]
    }
  ]
};

// Scoring and recommendation system
export const assessmentScoring = {
  // Calculate final skill level based on weighted responses
  calculateSkillLevel: (answers) => {
    const scores = { beginner: 0, intermediate: 0, advanced: 0 };
    let totalWeight = 0;

    // Process each answer
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = adaptiveQuestionnaire.questions.find(q => q.id === questionId);
      if (!question || !answer) return;

      const weight = question.weight || 1;
      totalWeight += weight;

      if (question.type === 'multiple_choice' && Array.isArray(answer.value)) {
        // Multiple choice - average the points
        answer.value.forEach(optionValue => {
          const option = question.options.find(opt => opt.value === optionValue);
          if (option?.points) {
            Object.entries(option.points).forEach(([level, points]) => {
              scores[level] += (points * weight) / answer.value.length;
            });
          }
        });
      } else {
        // Single choice
        const option = question.options.find(opt => opt.value === answer.value);
        if (option?.points) {
          Object.entries(option.points).forEach(([level, points]) => {
            scores[level] += points * weight;
          });
        }
      }
    });

    // Normalize scores
    Object.keys(scores).forEach(level => {
      scores[level] = scores[level] / totalWeight;
    });

    return scores;
  },

  // Determine primary skill level
  determineSkillLevel: (scores) => {
    const maxScore = Math.max(...Object.values(scores));
    const primaryLevel = Object.entries(scores).find(([level, score]) => score === maxScore)[0];
    
    // Add confidence calculation
    const confidence = maxScore / (Object.values(scores).reduce((sum, score) => sum + score, 0));
    
    return {
      primary: primaryLevel,
      scores,
      confidence,
      isConfident: confidence > 0.5
    };
  },

  // Generate personalized recommendations
  generateRecommendations: (answers, skillLevel) => {
    const recommendations = {
      primaryPath: 'prompt-engineering-mastery',
      difficulty: skillLevel.primary,
      customizations: [],
      nextPaths: [],
      studyPlan: {}
    };

    // Analyze specific answers for customization
    const goals = answers['learning-goals']?.value;
    const context = answers['use-context']?.value || [];
    const timeCommitment = answers['time-commitment']?.value;
    const learningStyle = answers['learning-style']?.value;

    // Customize based on goals
    if (goals === 'business-application') {
      recommendations.nextPaths.push('ai-for-business');
      recommendations.customizations.push('business-focus');
    }
    
    if (context.includes('creative')) {
      recommendations.nextPaths.push('ai-for-content-creation');
      recommendations.customizations.push('creative-emphasis');
    }

    if (context.includes('work')) {
      recommendations.nextPaths.push('ai-workflow-automation');
      recommendations.customizations.push('professional-focus');
    }

    // Study plan based on time commitment
    const pacingMap = {
      'casual': { lessonsPerWeek: 1, estimatedCompletion: '8-10 weeks' },
      'regular': { lessonsPerWeek: 2, estimatedCompletion: '4-5 weeks' },
      'intensive': { lessonsPerWeek: 3, estimatedCompletion: '3-4 weeks' }
    };

    recommendations.studyPlan = pacingMap[timeCommitment] || pacingMap['regular'];

    // Learning style adaptations
    if (learningStyle === 'guided') {
      recommendations.customizations.push('extra-guidance');
    } else if (learningStyle === 'exploratory') {
      recommendations.customizations.push('self-directed');
    }

    return recommendations;
  }
};

// User-friendly results interpretation
export const resultInterpretation = {
  beginner: {
    title: "AI Explorer 🌟",
    description: "Perfect! You're starting your AI journey from the ground up. We'll guide you through everything step-by-step.",
    approach: "We'll start with the fundamentals and build your confidence with hands-on practice and clear explanations.",
    strengths: ["Fresh perspective", "No bad habits to unlearn", "Great potential for growth"],
    focusAreas: ["Understanding AI basics", "Simple practical applications", "Building confidence"]
  },
  
  intermediate: {
    title: "AI Practitioner 🚀",
    description: "Great! You have some AI experience and you're ready to level up your skills significantly.",
    approach: "We'll build on what you know and introduce professional-level techniques and workflows.",
    strengths: ["Practical experience", "Understanding of basics", "Ready for advanced concepts"],
    focusAreas: ["Advanced prompting techniques", "Professional workflows", "Specialized applications"]
  },
  
  advanced: {
    title: "AI Innovator 🎯",
    description: "Excellent! You're already skilled with AI and ready to master sophisticated applications.",
    approach: "We'll dive deep into advanced techniques, complex workflows, and cutting-edge applications.",
    strengths: ["Strong foundation", "Technical confidence", "Innovation potential"],
    focusAreas: ["Mastery-level techniques", "Complex integrations", "Leadership and innovation"]
  }
};

export default {
  adaptiveQuestionnaire,
  assessmentScoring,
  resultInterpretation
}; 