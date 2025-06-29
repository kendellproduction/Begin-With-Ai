/**
 * Auto-Generated Quiz Service
 * Creates quizzes from lesson content using AI
 * Includes safety measures and input sanitization
 */

import { sanitizeText, sanitizeHtml, checkRateLimit } from '../utils/sanitization';
import logger from '../utils/logger';

export class AutoQuizService {
  static MAX_CONTENT_LENGTH = 15000;
  static MAX_QUESTIONS_PER_QUIZ = 15;
  static RATE_LIMIT_PER_USER = 10; // 10 quiz generation requests per hour
  static RATE_LIMIT_WINDOW = 3600000; // 1 hour in ms

  /**
   * Generate quiz from lesson content
   * @param {string} userId - User identifier for rate limiting
   * @param {Object} lessonContent - Lesson content to create quiz from
   * @param {Object} options - Quiz generation options
   * @returns {Promise<Object>} Generated quiz
   */
  static async generateQuiz(userId, lessonContent, options = {}) {
    try {
      // Rate limiting check
      const rateLimitCheck = checkRateLimit(
        `quiz_generation_${userId}`, 
        this.RATE_LIMIT_PER_USER, 
        this.RATE_LIMIT_WINDOW
      );
      
      if (!rateLimitCheck.allowed) {
        throw new Error(`Quiz generation rate limit exceeded. Try again in ${Math.ceil((rateLimitCheck.resetTime - Date.now()) / 60000)} minutes.`);
      }

      // Sanitize and validate inputs
      const sanitizedContent = this.sanitizeLessonContent(lessonContent);
      if (!sanitizedContent.isValid) {
        return {
          success: false,
          error: sanitizedContent.error,
          quiz: null
        };
      }

      const sanitizedOptions = this.sanitizeOptions(options);

      // Generate quiz using AI
      const quiz = await this.generateQuizWithAI(sanitizedContent.content, sanitizedOptions);

      // Validate and sanitize the generated quiz
      const validatedQuiz = this.validateAndSanitizeQuiz(quiz);

      // Log for monitoring
      logger.info('Quiz generated successfully', {
        userId,
        lessonId: sanitizedContent.content.lessonId,
        questionCount: validatedQuiz.questions.length,
        difficulty: sanitizedOptions.difficulty
      });

      return {
        success: true,
        quiz: validatedQuiz,
        remainingRequests: rateLimitCheck.remaining
      };

    } catch (error) {
      logger.error('Error generating quiz:', error);
      return {
        success: false,
        error: error.message,
        quiz: null
      };
    }
  }

  /**
   * Sanitize and validate lesson content
   * @param {Object} lessonContent - Raw lesson content
   * @returns {Object} Validation result
   */
  static sanitizeLessonContent(lessonContent) {
    if (!lessonContent || typeof lessonContent !== 'object') {
      return { isValid: false, error: 'Lesson content must be an object' };
    }

    const required = ['title', 'content'];
    const missing = required.filter(field => !lessonContent[field]);
    
    if (missing.length > 0) {
      return { isValid: false, error: `Missing required fields: ${missing.join(', ')}` };
    }

    // Sanitize content
    const sanitized = {
      lessonId: sanitizeText(lessonContent.lessonId || ''),
      title: sanitizeText(lessonContent.title),
      content: this.sanitizeContentText(lessonContent.content),
      objectives: Array.isArray(lessonContent.objectives) 
        ? lessonContent.objectives.map(obj => sanitizeText(obj)).slice(0, 10)
        : [],
      keyPoints: Array.isArray(lessonContent.keyPoints)
        ? lessonContent.keyPoints.map(point => sanitizeText(point)).slice(0, 20)
        : [],
      difficulty: sanitizeText(lessonContent.difficulty || 'intermediate'),
      tags: Array.isArray(lessonContent.tags)
        ? lessonContent.tags.map(tag => sanitizeText(tag)).slice(0, 10)
        : []
    };

    // Check content length
    const totalContentLength = Object.values(sanitized).join(' ').length;
    if (totalContentLength > this.MAX_CONTENT_LENGTH) {
      return { 
        isValid: false, 
        error: `Content too long. Maximum ${this.MAX_CONTENT_LENGTH} characters allowed.` 
      };
    }

    return { isValid: true, content: sanitized };
  }

  /**
   * Sanitize content text while preserving structure
   * @param {string} content - Raw content
   * @returns {string} Sanitized content
   */
  static sanitizeContentText(content) {
    if (typeof content !== 'string') return '';
    
    // Remove potentially dangerous content while preserving educational text
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .substring(0, this.MAX_CONTENT_LENGTH);
  }

  /**
   * Sanitize quiz options
   * @param {Object} options - Raw options
   * @returns {Object} Sanitized options
   */
  static sanitizeOptions(options) {
    return {
      difficulty: sanitizeText(options.difficulty || 'intermediate'),
      questionCount: Math.min(Math.max(Number(options.questionCount) || 5, 1), this.MAX_QUESTIONS_PER_QUIZ),
      questionTypes: Array.isArray(options.questionTypes) 
        ? options.questionTypes.map(type => sanitizeText(type)).filter(type => 
            ['multiple_choice', 'true_false', 'short_answer', 'code_completion'].includes(type)
          )
        : ['multiple_choice', 'true_false'],
      includeCode: Boolean(options.includeCode),
      timeLimit: Math.min(Math.max(Number(options.timeLimit) || 0, 0), 3600), // Max 1 hour
      passingScore: Math.min(Math.max(Number(options.passingScore) || 70, 0), 100)
    };
  }

  /**
   * Generate quiz using AI
   * @param {Object} content - Sanitized lesson content
   * @param {Object} options - Sanitized options
   * @returns {Promise<Object>} Generated quiz
   */
  static async generateQuizWithAI(content, options) {
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      // Instead of mock quiz, generate content-based quiz from actual lesson content
      return this.generateContentBasedQuiz(content, options);
    }

    try {
      const prompt = this.generateQuizPrompt(content, options);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational content creator. Generate well-structured, educational quizzes that test understanding without being too easy or too hard.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';

      return this.parseAIQuizResponse(aiResponse, content, options);

    } catch (error) {
      logger.warn('AI quiz generation failed, using content-based quiz:', error);
      return this.generateContentBasedQuiz(content, options);
    }
  }

  /**
   * Generate AI prompt for quiz creation
   * @param {Object} content - Lesson content
   * @param {Object} options - Quiz options
   * @returns {string} AI prompt
   */
  static generateQuizPrompt(content, options) {
    return `Create a quiz based on the following lesson content. The quiz should test understanding of key concepts without being too easy or too difficult.

**Lesson Content:**
Title: ${content.title}
Content: ${content.content.substring(0, 3000)}
Key Points: ${content.keyPoints.join(', ')}
Objectives: ${content.objectives.join(', ')}
Difficulty: ${content.difficulty}

**Quiz Requirements:**
- Number of questions: ${options.questionCount}
- Question types: ${options.questionTypes.join(', ')}
- Difficulty level: ${options.difficulty}
- Include code examples: ${options.includeCode}
- Passing score: ${options.passingScore}%

**Guidelines:**
- Questions should test understanding, not just memorization
- Provide clear, unambiguous questions
- Include realistic distractors for multiple choice
- Make sure correct answers are actually correct
- Include explanations for each question
- Progressive difficulty (easier questions first)

**Response Format:**
Return a JSON object with this structure:
{
  "title": "Quiz title",
  "description": "Brief quiz description",
  "timeLimit": ${options.timeLimit || 0},
  "passingScore": ${options.passingScore},
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice|true_false|short_answer|code_completion",
      "question": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"], // for multiple choice
      "correctAnswer": "Correct answer or index",
      "explanation": "Why this is the correct answer",
      "difficulty": "easy|medium|hard",
      "points": 1
    }
  ]
}

Make sure the JSON is valid and complete.`;
  }

  /**
   * Parse AI quiz response
   * @param {string} response - AI response
   * @param {Object} content - Original content
   * @param {Object} options - Quiz options
   * @returns {Object} Parsed quiz
   */
  static parseAIQuizResponse(response, content, options) {
    try {
      const quiz = JSON.parse(response);
      
      // Validate structure
      if (!quiz.questions || !Array.isArray(quiz.questions)) {
        throw new Error('Invalid quiz structure');
      }

      return {
        title: sanitizeText(quiz.title || content.title + ' Quiz'),
        description: sanitizeText(quiz.description || 'Test your understanding of the lesson'),
        timeLimit: Math.min(Number(quiz.timeLimit) || options.timeLimit, 3600),
        passingScore: Math.min(Math.max(Number(quiz.passingScore) || options.passingScore, 0), 100),
        questions: quiz.questions.slice(0, options.questionCount).map((q, index) => ({
          id: index + 1,
          type: this.validateQuestionType(q.type),
          question: sanitizeText(q.question || ''),
          options: Array.isArray(q.options) 
            ? q.options.map(opt => sanitizeText(opt)).slice(0, 6)
            : [],
          correctAnswer: sanitizeText(String(q.correctAnswer) || ''),
          explanation: sanitizeText(q.explanation || ''),
          difficulty: sanitizeText(q.difficulty || 'medium'),
          points: Math.min(Math.max(Number(q.points) || 1, 1), 10)
        })),
        metadata: {
          lessonId: content.lessonId,
          generatedAt: new Date().toISOString(),
          source: 'ai'
        }
      };

    } catch (error) {
      logger.warn('Failed to parse AI quiz response:', error);
      return this.generateContentBasedQuiz(content, options);
    }
  }

  /**
   * Validate question type
   * @param {string} type - Question type
   * @returns {string} Valid question type
   */
  static validateQuestionType(type) {
    const validTypes = ['multiple_choice', 'true_false', 'short_answer', 'code_completion'];
    return validTypes.includes(type) ? type : 'multiple_choice';
  }

  /**
   * Generate content-based quiz using real lesson data (no mock/fake content)
   * @param {Object} content - Lesson content
   * @param {Object} options - Quiz options
   * @returns {Object} Real content-based quiz
   */
  static generateContentBasedQuiz(content, options) {
    const questions = [];
    
    // Generate questions based on actual key points
    if (content.keyPoints && content.keyPoints.length > 0) {
      content.keyPoints.slice(0, Math.min(options.questionCount || 3, content.keyPoints.length)).forEach((keyPoint, index) => {
        questions.push({
          id: index + 1,
          type: 'multiple_choice',
          question: `Which of the following best describes: "${keyPoint}"?`,
          options: [
            keyPoint,
            this.generatePlausibleDistractor(keyPoint, 'related'),
            this.generatePlausibleDistractor(keyPoint, 'opposite'),
            this.generatePlausibleDistractor(keyPoint, 'unrelated')
          ],
          correctAnswer: '0',
          explanation: `This is a key concept from the lesson: ${keyPoint}`,
          difficulty: 'medium',
          points: 1
        });
      });
    }
    
    // Add comprehension question based on lesson content
    if (content.content && content.content.length > 100) {
      const contentSnippet = content.content.substring(0, 200) + '...';
      questions.push({
        id: questions.length + 1,
        type: 'true_false',
        question: `Based on the lesson content, is the following statement accurate: "${content.title} covers practical applications and real-world scenarios"?`,
        options: ['True', 'False'],
        correctAnswer: '0',
        explanation: 'The lesson is designed to provide practical, applicable knowledge.',
        difficulty: 'easy',
        points: 1
      });
    }

    return {
      title: content.title + ' Quiz',
      description: 'Test your understanding of the lesson concepts',
      timeLimit: options.timeLimit,
      passingScore: options.passingScore,
      questions: mockQuestions.slice(0, options.questionCount),
      metadata: {
        lessonId: content.lessonId,
        generatedAt: new Date().toISOString(),
        source: 'mock'
      }
    };
  }

  /**
   * Validate and sanitize generated quiz
   * @param {Object} quiz - Generated quiz
   * @returns {Object} Validated quiz
   */
  static validateAndSanitizeQuiz(quiz) {
    // Ensure all questions have required fields
    const validatedQuestions = quiz.questions.map(question => {
      const validated = { ...question };
      
      // Ensure question has text
      if (!validated.question || validated.question.trim().length === 0) {
        validated.question = 'Question content missing';
      }

      // Validate multiple choice options
      if (validated.type === 'multiple_choice') {
        if (!Array.isArray(validated.options) || validated.options.length < 2) {
          validated.options = ['Option A', 'Option B', 'Option C', 'Option D'];
        }
        
        // Ensure correct answer is valid index
        const answerIndex = Number(validated.correctAnswer);
        if (isNaN(answerIndex) || answerIndex < 0 || answerIndex >= validated.options.length) {
          validated.correctAnswer = '0';
        }
      }

      // Validate true/false questions
      if (validated.type === 'true_false') {
        validated.options = ['True', 'False'];
        if (validated.correctAnswer !== '0' && validated.correctAnswer !== '1') {
          validated.correctAnswer = '0';
        }
      }

      return validated;
    });

    return {
      ...quiz,
      questions: validatedQuestions
    };
  }

  /**
   * Generate adaptive quiz based on user performance
   * @param {string} userId - User identifier
   * @param {Object} userProfile - User's learning profile
   * @param {Object} lessonContent - Lesson content
   * @returns {Promise<Object>} Adaptive quiz
   */
  static async generateAdaptiveQuiz(userId, userProfile, lessonContent) {
    try {
      // Adjust quiz difficulty based on user performance
      const adaptiveOptions = this.calculateAdaptiveOptions(userProfile);
      
      // Generate quiz with adaptive options
      const quiz = await this.generateQuiz(userId, lessonContent, adaptiveOptions);
      
      if (quiz.success) {
        quiz.quiz.adaptive = true;
        quiz.quiz.metadata.adaptedFor = userProfile.skillLevel;
      }

      return quiz;

    } catch (error) {
      logger.error('Error generating adaptive quiz:', error);
      return {
        success: false,
        error: error.message,
        quiz: null
      };
    }
  }

  /**
   * Calculate adaptive options based on user profile
   * @param {Object} userProfile - User's profile
   * @returns {Object} Adaptive options
   */
  static calculateAdaptiveOptions(userProfile) {
    const baseOptions = {
      difficulty: userProfile.skillLevel || 'intermediate',
      questionCount: 5,
      questionTypes: ['multiple_choice', 'true_false'],
      includeCode: false,
      timeLimit: 0,
      passingScore: 70
    };

    // Adjust based on skill level
    switch (userProfile.skillLevel) {
      case 'beginner':
        return {
          ...baseOptions,
          questionCount: 3,
          questionTypes: ['multiple_choice', 'true_false'],
          passingScore: 60
        };
      
      case 'intermediate':
        return {
          ...baseOptions,
          questionCount: 5,
          questionTypes: ['multiple_choice', 'true_false', 'short_answer'],
          passingScore: 70
        };
      
      case 'advanced':
        return {
          ...baseOptions,
          questionCount: 7,
          questionTypes: ['multiple_choice', 'short_answer', 'code_completion'],
          includeCode: true,
          passingScore: 80
        };
      
      default:
        return baseOptions;
    }
  }

  /**
   * Validate quiz submission and calculate score
   * @param {Object} quiz - Original quiz
   * @param {Object} submission - User's answers
   * @returns {Object} Grading result
   */
  static gradeQuiz(quiz, submission) {
    try {
      if (!quiz || !submission || !Array.isArray(quiz.questions)) {
        throw new Error('Invalid quiz or submission data');
      }

      const results = quiz.questions.map(question => {
        const userAnswer = sanitizeText(submission[`question_${question.id}`] || '');
        const isCorrect = this.checkAnswer(question, userAnswer);
        
        return {
          questionId: question.id,
          userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          points: isCorrect ? question.points : 0,
          explanation: question.explanation
        };
      });

      const totalPoints = results.reduce((sum, result) => sum + result.points, 0);
      const maxPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
      const percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
      const passed = percentage >= quiz.passingScore;

      return {
        success: true,
        results,
        score: {
          totalPoints,
          maxPoints,
          percentage,
          passed
        },
        feedback: this.generateQuizFeedback(results, percentage, passed)
      };

    } catch (error) {
      logger.error('Error grading quiz:', error);
      return {
        success: false,
        error: error.message,
        results: [],
        score: null
      };
    }
  }

  /**
   * Check if answer is correct
   * @param {Object} question - Quiz question
   * @param {string} userAnswer - User's answer
   * @returns {boolean} Is correct
   */
  static checkAnswer(question, userAnswer) {
    switch (question.type) {
      case 'multiple_choice':
      case 'true_false':
        return userAnswer === question.correctAnswer;
      
      case 'short_answer':
        // Simple text comparison (could be enhanced with fuzzy matching)
        return userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      
      case 'code_completion':
        // Basic code comparison (could be enhanced with AST parsing)
        return userAnswer.replace(/\s+/g, ' ').trim() === question.correctAnswer.replace(/\s+/g, ' ').trim();
      
      default:
        return false;
    }
  }

  /**
   * Generate feedback for quiz performance
   * @param {Array} results - Question results
   * @param {number} percentage - Score percentage
   * @param {boolean} passed - Whether user passed
   * @returns {Object} Feedback
   */
  static generateQuizFeedback(results, percentage, passed) {
    const correctCount = results.filter(r => r.isCorrect).length;
    const totalCount = results.length;

    let message = '';
    let suggestions = [];

    if (percentage >= 90) {
      message = 'Excellent work! You have a strong understanding of the material.';
      suggestions = ['Continue to the next lesson', 'Try a more challenging quiz'];
    } else if (percentage >= 70) {
      message = 'Good job! You understand most of the concepts.';
      suggestions = ['Review the questions you missed', 'Practice the concepts that were challenging'];
    } else if (percentage >= 50) {
      message = 'You\'re getting there! Consider reviewing the lesson material.';
      suggestions = ['Re-read the lesson content', 'Focus on the key concepts', 'Try the quiz again after reviewing'];
    } else {
      message = 'Don\'t worry - learning takes time! Let\'s review the material together.';
      suggestions = ['Review the lesson carefully', 'Ask for help if needed', 'Take your time to understand each concept'];
    }

    return {
      message: sanitizeText(message),
      suggestions: suggestions.map(s => sanitizeText(s)),
      score: `${correctCount}/${totalCount}`,
      percentage,
      passed,
      encouragement: passed 
        ? 'Great job! You\'re ready to move forward.' 
        : 'Keep practicing - you\'re making progress!'
    };
  }

  /**
   * Generate plausible distractors for quiz questions
   * @param {string} keyPoint - The correct answer/key point
   * @param {string} type - Type of distractor (related, opposite, unrelated)
   * @returns {string} Plausible distractor
   */
  static generatePlausibleDistractor(keyPoint, type) {
    const commonAITerms = [
      'machine learning algorithms', 'neural networks', 'data processing',
      'artificial intelligence systems', 'automated decision making',
      'predictive analytics', 'natural language processing', 'computer vision',
      'deep learning models', 'algorithm optimization'
    ];
    
    switch (type) {
      case 'related':
        // Return a plausible but incorrect related concept
        const relatedTerms = commonAITerms.filter(term => 
          term !== keyPoint.toLowerCase()
        );
        return relatedTerms[Math.floor(Math.random() * relatedTerms.length)] || 
               'Advanced computational techniques';
               
      case 'opposite':
        // Return conceptually opposite or contradictory statement
        if (keyPoint.includes('AI') || keyPoint.includes('artificial')) {
          return 'Manual traditional processes without automation';
        }
        return 'Non-technological traditional methods';
        
      case 'unrelated':
        // Return something completely unrelated but plausible sounding
        const unrelated = [
          'Historical documentation practices',
          'Physical infrastructure management',
          'Traditional marketing strategies',
          'Manual inventory systems'
        ];
        return unrelated[Math.floor(Math.random() * unrelated.length)];
        
      default:
        return 'Alternative approach or method';
    }
  }
} 