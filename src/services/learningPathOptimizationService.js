/**
 * Learning Path Optimization Service
 * Uses AI to suggest optimal learning sequences
 * Analyzes user progress and preferences to personalize learning paths
 */

import { sanitizeText, checkRateLimit } from '../utils/sanitization';
import logger from '../utils/logger';
import { firestoreService } from './firestoreService';

export class LearningPathOptimizationService {
  static MAX_PATH_LENGTH = 50;
  static RATE_LIMIT_PER_USER = 3; // 3 AI optimization requests per user per day (balanced approach)
  static RATE_LIMIT_WINDOW = 86400000; // 24 hours in ms
  static CACHE_DURATION = 86400000; // 24 hours in ms
  
  // Cost optimization flags
  static PREFER_RULE_BASED = true; // Use rule-based logic first
  static AI_ONLY_FOR_COMPLEX = true; // Only use AI for complex cases

  /**
   * Generate optimized learning path for user
   * @param {string} userId - User identifier
   * @param {Object} userProfile - User's learning profile
   * @param {Object} preferences - User preferences
   * @returns {Promise<Object>} Optimized learning path
   */
  static async generateOptimizedPath(userId, userProfile, preferences = {}) {
    try {
      // COST OPTIMIZATION: Check cache first
      const cached = this.getCachedPath(userId, userProfile);
      if (cached) {
        logger.info('Using cached learning path (cost optimization)', { userId });
        return {
          success: true,
          path: cached,
          source: 'cache',
          apiCost: 0,
          costOptimized: true
        };
      }

      // Sanitize and validate inputs
      const sanitizedProfile = this.sanitizeUserProfile(userProfile);
      if (!sanitizedProfile.isValid) {
        return {
          success: false,
          error: sanitizedProfile.error,
          path: null
        };
      }

      const sanitizedPreferences = this.sanitizePreferences(preferences);

      // COST OPTIMIZATION: Use rule-based logic first
      if (this.PREFER_RULE_BASED) {
        const ruleBasedPath = this.generateRuleBasedPath(sanitizedProfile.data, sanitizedPreferences);
        
        // Only use AI for complex cases
        const needsAI = this.AI_ONLY_FOR_COMPLEX && this.shouldUseAI(sanitizedProfile.data, sanitizedPreferences);
        
        if (!needsAI) {
          // Cache the rule-based path
          this.cacheUserPath(userId, ruleBasedPath, sanitizedProfile.data);
          
          logger.info('Generated rule-based learning path (cost optimized)', {
            userId,
            pathLength: ruleBasedPath.lessons.length,
            difficulty: sanitizedProfile.data.skillLevel
          });

          return {
            success: true,
            path: ruleBasedPath,
            source: 'rule_based',
            apiCost: 0,
            costOptimized: true
          };
        }
      }

      // AI path generation (only for complex cases)
      const rateLimitCheck = checkRateLimit(
        `ai_path_optimization_${userId}`, 
        this.RATE_LIMIT_PER_USER, 
        this.RATE_LIMIT_WINDOW
      );
      
      if (!rateLimitCheck.allowed) {
        // Fallback to rule-based if AI rate limited
        const fallbackPath = this.generateRuleBasedPath(sanitizedProfile.data, sanitizedPreferences);
        this.cacheUserPath(userId, fallbackPath, sanitizedProfile.data);
        
        return {
          success: true,
          path: fallbackPath,
          source: 'rule_based_fallback',
          message: `AI optimization rate limit reached. Try again in ${Math.ceil((rateLimitCheck.resetTime - Date.now()) / 3600000)} hours.`,
          apiCost: 0,
          costOptimized: true
        };
      }

      // Analyze user's current state for AI optimization
      const userAnalysis = await this.analyzeUserProgress(userId, sanitizedProfile.data);
      
      // Get available lessons and paths
      const availableContent = await this.getAvailableContent(sanitizedProfile.data.interests);

      // Generate optimized path using AI (only for complex cases)
      const optimizedPath = await this.generatePathWithAI(
        sanitizedProfile.data,
        sanitizedPreferences,
        userAnalysis,
        availableContent
      );

      // Validate and enhance the path
      const enhancedPath = await this.enhancePathWithMetadata(optimizedPath, userId);
      
      // Cache the AI-generated path
      this.cacheUserPath(userId, enhancedPath, sanitizedProfile.data);

      // Log for analytics
      logger.info('AI-optimized learning path generated', {
        userId,
        pathLength: enhancedPath.lessons.length,
        estimatedDuration: enhancedPath.estimatedDuration,
        difficulty: sanitizedProfile.data.skillLevel,
        apiCost: 0.25 // Estimated cost
      });

      return {
        success: true,
        path: enhancedPath,
        source: 'ai_optimized',
        apiCost: 0.25,
        remainingAIRequests: rateLimitCheck.remaining
      };

    } catch (error) {
      logger.error('Error optimizing learning path:', error);
      
      // Always provide a fallback path
      const fallbackPath = this.generateFallbackPath(userProfile, {}, {}, {});
      
      return {
        success: false,
        error: error.message,
        path: fallbackPath,
        source: 'error_fallback',
        apiCost: 0
      };
    }
  }

  /**
   * Sanitize and validate user profile
   * @param {Object} userProfile - Raw user profile
   * @returns {Object} Validation result
   */
  static sanitizeUserProfile(userProfile) {
    if (!userProfile || typeof userProfile !== 'object') {
      return { isValid: false, error: 'User profile must be an object' };
    }

    const sanitized = {
      skillLevel: sanitizeText(userProfile.skillLevel || 'beginner'),
      interests: Array.isArray(userProfile.interests)
        ? userProfile.interests.map(interest => sanitizeText(interest)).slice(0, 10)
        : [],
      goals: Array.isArray(userProfile.goals)
        ? userProfile.goals.map(goal => sanitizeText(goal)).slice(0, 5)
        : [],
      learningStyle: sanitizeText(userProfile.learningStyle || 'mixed'),
      timeAvailable: Math.min(Math.max(Number(userProfile.timeAvailable) || 30, 10), 480), // 10min to 8hours
      previousExperience: Array.isArray(userProfile.previousExperience)
        ? userProfile.previousExperience.map(exp => sanitizeText(exp)).slice(0, 20)
        : [],
      weakAreas: Array.isArray(userProfile.weakAreas)
        ? userProfile.weakAreas.map(area => sanitizeText(area)).slice(0, 10)
        : [],
      strongAreas: Array.isArray(userProfile.strongAreas)
        ? userProfile.strongAreas.map(area => sanitizeText(area)).slice(0, 10)
        : []
    };

    // Validate skill level
    const validSkillLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validSkillLevels.includes(sanitized.skillLevel)) {
      sanitized.skillLevel = 'beginner';
    }

    // Validate learning style
    const validLearningStyles = ['visual', 'auditory', 'kinesthetic', 'reading', 'mixed'];
    if (!validLearningStyles.includes(sanitized.learningStyle)) {
      sanitized.learningStyle = 'mixed';
    }

    return { isValid: true, data: sanitized };
  }

  /**
   * Sanitize user preferences
   * @param {Object} preferences - Raw preferences
   * @returns {Object} Sanitized preferences
   */
  static sanitizePreferences(preferences) {
    return {
      difficulty: sanitizeText(preferences.difficulty || 'adaptive'),
      pace: sanitizeText(preferences.pace || 'moderate'),
      includeProjects: Boolean(preferences.includeProjects),
      includeQuizzes: Boolean(preferences.includeQuizzes),
      focusAreas: Array.isArray(preferences.focusAreas)
        ? preferences.focusAreas.map(area => sanitizeText(area)).slice(0, 5)
        : [],
      avoidTopics: Array.isArray(preferences.avoidTopics)
        ? preferences.avoidTopics.map(topic => sanitizeText(topic)).slice(0, 5)
        : [],
      preferredFormats: Array.isArray(preferences.preferredFormats)
        ? preferences.preferredFormats.map(format => sanitizeText(format)).slice(0, 5)
        : ['interactive', 'text'],
      dailyTimeLimit: Math.min(Math.max(Number(preferences.dailyTimeLimit) || 60, 15), 240) // 15min to 4hours
    };
  }

  /**
   * Analyze user's current progress and performance
   * @param {string} userId - User identifier
   * @param {Object} userProfile - Sanitized user profile
   * @returns {Promise<Object>} User analysis
   */
  static async analyzeUserProgress(userId, userProfile) {
    try {
      // Get user's lesson completion data
      const completedLessons = await this.getUserCompletedLessons(userId);
      const recentPerformance = await this.getRecentPerformance(userId);
      const learningPatterns = this.analyzeLearningPatterns(completedLessons, recentPerformance);

      return {
        completedLessons,
        recentPerformance,
        learningPatterns,
        recommendedDifficulty: this.calculateRecommendedDifficulty(recentPerformance, userProfile.skillLevel),
        estimatedPace: this.estimateLearningPace(learningPatterns),
        knowledgeGaps: this.identifyKnowledgeGaps(completedLessons, userProfile),
        strengths: this.identifyStrengths(recentPerformance)
      };

    } catch (error) {
      logger.warn('Error analyzing user progress, using defaults:', error);
      return {
        completedLessons: [],
        recentPerformance: [],
        learningPatterns: { consistency: 'low', preferredTime: 'varied' },
        recommendedDifficulty: userProfile.skillLevel,
        estimatedPace: 'moderate',
        knowledgeGaps: [],
        strengths: []
      };
    }
  }

  /**
   * Get user's completed lessons
   * @param {string} userId - User identifier
   * @returns {Promise<Array>} Completed lessons
   */
  static async getUserCompletedLessons(userId) {
    try {
      // This would integrate with the actual firestore service
      // For now, return mock data
      return [
        { lessonId: 'js-basics-1', score: 85, completedAt: '2024-01-15', topic: 'javascript' },
        { lessonId: 'js-basics-2', score: 92, completedAt: '2024-01-16', topic: 'javascript' },
        { lessonId: 'html-intro', score: 78, completedAt: '2024-01-17', topic: 'html' }
      ];
    } catch (error) {
      logger.warn('Error fetching completed lessons:', error);
      return [];
    }
  }

  /**
   * Get user's recent performance data
   * @param {string} userId - User identifier
   * @returns {Promise<Array>} Recent performance
   */
  static async getRecentPerformance(userId) {
    try {
      // This would integrate with actual performance tracking
      return [
        { date: '2024-01-15', score: 85, timeSpent: 45, topic: 'javascript' },
        { date: '2024-01-16', score: 92, timeSpent: 38, topic: 'javascript' },
        { date: '2024-01-17', score: 78, timeSpent: 52, topic: 'html' }
      ];
    } catch (error) {
      logger.warn('Error fetching recent performance:', error);
      return [];
    }
  }

  /**
   * Analyze learning patterns from user data
   * @param {Array} completedLessons - Completed lessons
   * @param {Array} recentPerformance - Recent performance data
   * @returns {Object} Learning patterns
   */
  static analyzeLearningPatterns(completedLessons, recentPerformance) {
    const patterns = {
      consistency: 'low',
      preferredTime: 'varied',
      averageScore: 0,
      averageTimeSpent: 0,
      topicPreferences: [],
      strugglingAreas: []
    };

    if (recentPerformance.length > 0) {
      // Calculate averages
      patterns.averageScore = recentPerformance.reduce((sum, p) => sum + p.score, 0) / recentPerformance.length;
      patterns.averageTimeSpent = recentPerformance.reduce((sum, p) => sum + p.timeSpent, 0) / recentPerformance.length;

      // Determine consistency
      const dates = recentPerformance.map(p => new Date(p.date));
      const daysDiff = (Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24);
      patterns.consistency = daysDiff <= 7 && recentPerformance.length >= 3 ? 'high' : 'moderate';

      // Find topic preferences
      const topicScores = {};
      recentPerformance.forEach(p => {
        if (!topicScores[p.topic]) topicScores[p.topic] = [];
        topicScores[p.topic].push(p.score);
      });

      patterns.topicPreferences = Object.entries(topicScores)
        .map(([topic, scores]) => ({
          topic,
          avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
        }))
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 3);

      // Find struggling areas
      patterns.strugglingAreas = Object.entries(topicScores)
        .filter(([topic, scores]) => {
          const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
          return avg < 70;
        })
        .map(([topic]) => topic);
    }

    return patterns;
  }

  /**
   * Calculate recommended difficulty based on performance
   * @param {Array} recentPerformance - Recent performance data
   * @param {string} currentLevel - Current skill level
   * @returns {string} Recommended difficulty
   */
  static calculateRecommendedDifficulty(recentPerformance, currentLevel) {
    if (recentPerformance.length === 0) return currentLevel;

    const avgScore = recentPerformance.reduce((sum, p) => sum + p.score, 0) / recentPerformance.length;

    if (avgScore >= 90) {
      return currentLevel === 'beginner' ? 'intermediate' : 'advanced';
    } else if (avgScore >= 80) {
      return currentLevel;
    } else {
      return currentLevel === 'advanced' ? 'intermediate' : 'beginner';
    }
  }

  /**
   * Estimate learning pace based on patterns
   * @param {Object} learningPatterns - Learning patterns
   * @returns {string} Estimated pace
   */
  static estimateLearningPace(learningPatterns) {
    if (learningPatterns.consistency === 'high' && learningPatterns.averageScore > 85) {
      return 'fast';
    } else if (learningPatterns.consistency === 'low' || learningPatterns.averageScore < 70) {
      return 'slow';
    }
    return 'moderate';
  }

  /**
   * Identify knowledge gaps based on completed lessons
   * @param {Array} completedLessons - Completed lessons
   * @param {Object} userProfile - User profile
   * @returns {Array} Knowledge gaps
   */
  static identifyKnowledgeGaps(completedLessons, userProfile) {
    const coveredTopics = [...new Set(completedLessons.map(lesson => lesson.topic))];
    const interestedTopics = userProfile.interests;
    
    return interestedTopics.filter(topic => !coveredTopics.includes(topic));
  }

  /**
   * Identify user strengths from performance
   * @param {Array} recentPerformance - Recent performance data
   * @returns {Array} Strengths
   */
  static identifyStrengths(recentPerformance) {
    const topicScores = {};
    recentPerformance.forEach(p => {
      if (!topicScores[p.topic]) topicScores[p.topic] = [];
      topicScores[p.topic].push(p.score);
    });

    return Object.entries(topicScores)
      .filter(([topic, scores]) => {
        const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return avg >= 85;
      })
      .map(([topic]) => topic);
  }

  /**
   * Get available content based on interests
   * @param {Array} interests - User interests
   * @returns {Promise<Object>} Available content
   */
  static async getAvailableContent(interests) {
    try {
      // This would fetch from the actual lesson database
      // For now, return mock data organized by topics
      return {
        javascript: [
          { id: 'js-basics-1', title: 'JavaScript Variables', difficulty: 'beginner', duration: 30 },
          { id: 'js-basics-2', title: 'JavaScript Functions', difficulty: 'beginner', duration: 45 },
          { id: 'js-advanced-1', title: 'Async JavaScript', difficulty: 'advanced', duration: 60 }
        ],
        html: [
          { id: 'html-intro', title: 'HTML Basics', difficulty: 'beginner', duration: 25 },
          { id: 'html-forms', title: 'HTML Forms', difficulty: 'intermediate', duration: 40 }
        ],
        css: [
          { id: 'css-basics', title: 'CSS Fundamentals', difficulty: 'beginner', duration: 35 },
          { id: 'css-flexbox', title: 'CSS Flexbox', difficulty: 'intermediate', duration: 50 }
        ]
      };
    } catch (error) {
      logger.warn('Error fetching available content:', error);
      return {};
    }
  }

  /**
   * Generate optimized learning path using AI
   * @param {Object} userProfile - User profile
   * @param {Object} preferences - User preferences
   * @param {Object} userAnalysis - User analysis
   * @param {Object} availableContent - Available content
   * @returns {Promise<Object>} Generated path
   */
  static async generatePathWithAI(userProfile, preferences, userAnalysis, availableContent) {
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return this.generateFallbackPath(userProfile, preferences, userAnalysis, availableContent);
    }

    try {
      const prompt = this.generatePathPrompt(userProfile, preferences, userAnalysis, availableContent);
      
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
              content: 'You are an expert learning path designer. Create personalized learning sequences that optimize for knowledge retention and skill building.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';

      return this.parseAIPathResponse(aiResponse, userProfile, availableContent);

    } catch (error) {
      logger.warn('AI path generation failed, using fallback:', error);
      return this.generateFallbackPath(userProfile, preferences, userAnalysis, availableContent);
    }
  }

  /**
   * Generate AI prompt for path optimization
   * @param {Object} userProfile - User profile
   * @param {Object} preferences - User preferences
   * @param {Object} userAnalysis - User analysis
   * @param {Object} availableContent - Available content
   * @returns {string} AI prompt
   */
  static generatePathPrompt(userProfile, preferences, userAnalysis, availableContent) {
    return `Design an optimal learning path for a student based on their profile and available content.

**Student Profile:**
- Skill Level: ${userProfile.skillLevel}
- Interests: ${userProfile.interests.join(', ')}
- Goals: ${userProfile.goals.join(', ')}
- Learning Style: ${userProfile.learningStyle}
- Time Available: ${userProfile.timeAvailable} minutes per session
- Weak Areas: ${userProfile.weakAreas.join(', ')}
- Strong Areas: ${userProfile.strongAreas.join(', ')}

**Learning Analysis:**
- Recent Average Score: ${userAnalysis.averageScore}%
- Recommended Difficulty: ${userAnalysis.recommendedDifficulty}
- Estimated Pace: ${userAnalysis.estimatedPace}
- Knowledge Gaps: ${userAnalysis.knowledgeGaps.join(', ')}
- Strengths: ${userAnalysis.strengths.join(', ')}

**Preferences:**
- Pace: ${preferences.pace}
- Include Projects: ${preferences.includeProjects}
- Include Quizzes: ${preferences.includeQuizzes}
- Focus Areas: ${preferences.focusAreas.join(', ')}
- Daily Time Limit: ${preferences.dailyTimeLimit} minutes

**Available Content:**
${Object.entries(availableContent).map(([topic, lessons]) => 
  `${topic}: ${lessons.map(l => `${l.id} (${l.difficulty}, ${l.duration}min)`).join(', ')}`
).join('\n')}

Create a learning path that:
1. Builds on existing knowledge
2. Addresses knowledge gaps
3. Follows logical progression
4. Respects time constraints
5. Matches learning style
6. Includes variety and engagement

Respond with JSON:
{
  "title": "Personalized Learning Path",
  "description": "Brief description of the path",
  "estimatedDuration": "total hours",
  "lessons": [
    {
      "id": "lesson_id",
      "title": "lesson_title",
      "position": 1,
      "difficulty": "beginner|intermediate|advanced",
      "duration": 30,
      "prerequisites": ["lesson_id"],
      "topics": ["topic1", "topic2"],
      "reasoning": "Why this lesson is placed here"
    }
  ],
  "milestones": [
    {
      "position": 3,
      "title": "First Milestone",
      "description": "What the student will achieve"
    }
  ]
}`;
  }

  /**
   * Parse AI path response
   * @param {string} response - AI response
   * @param {Object} userProfile - User profile
   * @param {Object} availableContent - Available content
   * @returns {Object} Parsed path
   */
  static parseAIPathResponse(response, userProfile, availableContent) {
    try {
      const path = JSON.parse(response);
      
      // Validate and sanitize the path
      return {
        title: sanitizeText(path.title || 'Personalized Learning Path'),
        description: sanitizeText(path.description || 'Your customized learning journey'),
        estimatedDuration: sanitizeText(path.estimatedDuration || 'Varies'),
        lessons: Array.isArray(path.lessons) 
          ? path.lessons.slice(0, this.MAX_PATH_LENGTH).map((lesson, index) => ({
              id: sanitizeText(lesson.id || `lesson_${index + 1}`),
              title: sanitizeText(lesson.title || 'Lesson'),
              position: Number(lesson.position) || index + 1,
              difficulty: sanitizeText(lesson.difficulty || userProfile.skillLevel),
              duration: Math.min(Math.max(Number(lesson.duration) || 30, 10), 180),
              prerequisites: Array.isArray(lesson.prerequisites) 
                ? lesson.prerequisites.map(p => sanitizeText(p)).slice(0, 5)
                : [],
              topics: Array.isArray(lesson.topics)
                ? lesson.topics.map(t => sanitizeText(t)).slice(0, 3)
                : [],
              reasoning: sanitizeText(lesson.reasoning || 'Part of learning progression')
            }))
          : [],
        milestones: Array.isArray(path.milestones)
          ? path.milestones.slice(0, 10).map(milestone => ({
              position: Number(milestone.position) || 1,
              title: sanitizeText(milestone.title || 'Milestone'),
              description: sanitizeText(milestone.description || 'Achievement unlocked')
            }))
          : [],
        metadata: {
          generatedAt: new Date().toISOString(),
          source: 'ai',
          userSkillLevel: userProfile.skillLevel
        }
      };

    } catch (error) {
      logger.warn('Failed to parse AI path response:', error);
      return this.generateFallbackPath(userProfile, {}, {}, availableContent);
    }
  }

  /**
   * Generate fallback learning path
   * @param {Object} userProfile - User profile
   * @param {Object} preferences - User preferences
   * @param {Object} userAnalysis - User analysis
   * @param {Object} availableContent - Available content
   * @returns {Object} Fallback path
   */
  static generateFallbackPath(userProfile, preferences, userAnalysis, availableContent) {
    const allLessons = Object.values(availableContent).flat();
    const suitableLessons = allLessons
      .filter(lesson => 
        lesson.difficulty === userProfile.skillLevel || 
        lesson.difficulty === 'beginner'
      )
      .slice(0, 10);

    return {
      title: 'Getting Started Path',
      description: 'A basic learning path to get you started',
      estimatedDuration: '5-10 hours',
      lessons: suitableLessons.map((lesson, index) => ({
        id: lesson.id,
        title: lesson.title,
        position: index + 1,
        difficulty: lesson.difficulty,
        duration: lesson.duration,
        prerequisites: index > 0 ? [suitableLessons[index - 1].id] : [],
        topics: [lesson.id.split('-')[0]], // Extract topic from ID
        reasoning: 'Part of foundational learning'
      })),
      milestones: [
        {
          position: 3,
          title: 'Foundation Complete',
          description: 'You\'ve mastered the basics!'
        }
      ],
      metadata: {
        generatedAt: new Date().toISOString(),
        source: 'fallback',
        userSkillLevel: userProfile.skillLevel
      }
    };
  }

  /**
   * Enhance path with additional metadata
   * @param {Object} path - Generated path
   * @param {string} userId - User identifier
   * @returns {Promise<Object>} Enhanced path
   */
  static async enhancePathWithMetadata(path, userId) {
    try {
      // Add progress tracking
      const enhancedLessons = path.lessons.map(lesson => ({
        ...lesson,
        completed: false,
        progress: 0,
        estimatedCompletionDate: this.calculateEstimatedCompletion(lesson, path.lessons),
        difficulty_adapted: lesson.difficulty // Could be adjusted based on real-time performance
      }));

      // Add path statistics
      const totalDuration = enhancedLessons.reduce((sum, lesson) => sum + lesson.duration, 0);
      const averageDifficulty = this.calculateAverageDifficulty(enhancedLessons);

      return {
        ...path,
        lessons: enhancedLessons,
        statistics: {
          totalLessons: enhancedLessons.length,
          totalDuration: totalDuration,
          averageDifficulty,
          estimatedCompletion: Math.ceil(totalDuration / 60) + ' hours'
        },
        personalization: {
          adaptedFor: userId,
          lastUpdated: new Date().toISOString(),
          canBeModified: true
        }
      };

    } catch (error) {
      logger.warn('Error enhancing path with metadata:', error);
      return path;
    }
  }

  /**
   * Calculate estimated completion date for a lesson
   * @param {Object} lesson - Lesson data
   * @param {Array} allLessons - All lessons in path
   * @returns {string} Estimated completion date
   */
  static calculateEstimatedCompletion(lesson, allLessons) {
    const previousLessons = allLessons.slice(0, lesson.position - 1);
    const totalPreviousDuration = previousLessons.reduce((sum, l) => sum + l.duration, 0);
    
    const estimatedDays = Math.ceil(totalPreviousDuration / 60); // Assuming 1 hour per day
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + estimatedDays);
    
    return futureDate.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
  }

  /**
   * Calculate average difficulty of path
   * @param {Array} lessons - Lessons in path
   * @returns {string} Average difficulty
   */
  static calculateAverageDifficulty(lessons) {
    const difficultyScores = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };

    const totalScore = lessons.reduce((sum, lesson) => {
      return sum + (difficultyScores[lesson.difficulty] || 1);
    }, 0);

    const averageScore = totalScore / lessons.length;
    
    if (averageScore <= 1.3) return 'beginner';
    if (averageScore <= 2.3) return 'intermediate';
    return 'advanced';
  }

  /**
   * Update learning path based on user progress
   * @param {string} userId - User identifier
   * @param {string} pathId - Path identifier
   * @param {Object} progressData - Progress data
   * @returns {Promise<Object>} Updated path
   */
  static async updatePathBasedOnProgress(userId, pathId, progressData) {
    try {
      // Get current path
      const currentPath = await this.getUserPath(userId, pathId);
      if (!currentPath) {
        throw new Error('Path not found');
      }

      // Analyze recent progress
      const recentPerformance = await this.getRecentPerformance(userId);
      const shouldAdapt = this.shouldAdaptPath(recentPerformance, progressData);

      if (shouldAdapt) {
        // Regenerate path with updated user profile
        const userProfile = await this.getUserProfile(userId);
        const optimizedPath = await this.generateOptimizedPath(userId, userProfile, {
          continueFrom: progressData.lastCompletedLesson
        });

        return optimizedPath;
      }

      return { success: true, path: currentPath, adapted: false };

    } catch (error) {
      logger.error('Error updating learning path:', error);
      return {
        success: false,
        error: error.message,
        path: null
      };
    }
  }

  /**
   * Determine if path should be adapted based on progress
   * @param {Array} recentPerformance - Recent performance data
   * @param {Object} progressData - Progress data
   * @returns {boolean} Should adapt
   */
  static shouldAdaptPath(recentPerformance, progressData) {
    if (recentPerformance.length < 3) return false;

    const avgScore = recentPerformance.reduce((sum, p) => sum + p.score, 0) / recentPerformance.length;
    
    // Adapt if performance is consistently high or low
    return avgScore > 95 || avgScore < 60;
  }

  /**
   * Get user's current learning path
   * @param {string} userId - User identifier
   * @param {string} pathId - Path identifier
   * @returns {Promise<Object>} User's path
   */
  static async getUserPath(userId, pathId) {
    try {
      // This would integrate with actual data storage
      // For now, return mock data
      return null;
    } catch (error) {
      logger.warn('Error fetching user path:', error);
      return null;
    }
  }

  /**
   * Get user profile for path optimization
   * @param {string} userId - User identifier
   * @returns {Promise<Object>} User profile
   */
  static async getUserProfile(userId) {
    try {
      // This would integrate with actual user data
      // For now, return mock data
      return {
        skillLevel: 'intermediate',
        interests: ['javascript', 'web-development'],
        goals: ['build-portfolio', 'get-job'],
        learningStyle: 'visual',
        timeAvailable: 60
      };
    } catch (error) {
      logger.warn('Error fetching user profile:', error);
      return {
        skillLevel: 'beginner',
        interests: [],
        goals: [],
        learningStyle: 'mixed',
        timeAvailable: 30
      };
    }
  }

  /**
   * Generate rule-based learning path (NO AI needed - cost optimization)
   * @param {Object} userProfile - Sanitized user profile
   * @param {Object} preferences - Sanitized preferences
   * @returns {Object} Rule-based learning path
   */
  static generateRuleBasedPath(userProfile, preferences) {
    const {
      skillLevel,
      interests,
      goals,
      learningStyle,
      timeAvailable,
      weakAreas,
      strongAreas
    } = userProfile;

    // Base lesson sequences by skill level
    const baseLessons = {
      beginner: [
        { id: 'ai-welcome', title: 'Welcome to AI', duration: 15, topics: ['introduction'] },
        { id: 'what-is-ai', title: 'What is AI?', duration: 25, topics: ['fundamentals'] },
        { id: 'ai-daily-life', title: 'AI in Daily Life', duration: 20, topics: ['applications'] },
        { id: 'first-ai-tool', title: 'Your First AI Tool', duration: 30, topics: ['hands-on'] }
      ],
      intermediate: [
        { id: 'ai-fundamentals', title: 'AI Fundamentals', duration: 30, topics: ['fundamentals'] },
        { id: 'prompt-engineering', title: 'Prompt Engineering', duration: 40, topics: ['prompting'] },
        { id: 'ai-tools-overview', title: 'AI Tools Overview', duration: 35, topics: ['tools'] },
        { id: 'workflow-integration', title: 'AI Workflow Integration', duration: 45, topics: ['productivity'] }
      ],
      advanced: [
        { id: 'advanced-prompting', title: 'Advanced Prompting', duration: 45, topics: ['advanced-prompting'] },
        { id: 'ai-workflows', title: 'AI Workflows', duration: 50, topics: ['workflows'] },
        { id: 'building-solutions', title: 'Building AI Solutions', duration: 60, topics: ['development'] },
        { id: 'ai-strategy', title: 'AI Strategy', duration: 45, topics: ['strategy'] }
      ]
    };

    let lessons = [...baseLessons[skillLevel] || baseLessons.beginner];

         // Add goal-specific lessons (no project building)
     if (goals.includes('work_productivity')) {
       lessons.push({
         id: 'ai-productivity-mastery',
         title: 'AI for Work Productivity',
         duration: 40,
         topics: ['productivity', 'workplace']
       });
     }

     if (goals.includes('content_creation')) {
       lessons.push({
         id: 'ai-content-creation',
         title: 'AI Content Creation Tools',
         duration: 45,
         topics: ['content', 'creative']
       });
     }

     if (goals.includes('stay_current')) {
       lessons.push({
         id: 'ai-trends-awareness',
         title: 'Staying Current with AI',
         duration: 35,
         topics: ['trends', 'awareness']
       });
     }

         // Add interest-based content (learning focused, not project building)
     if (interests.includes('chat_ai')) {
       lessons.push({
         id: 'conversational-ai-mastery',
         title: 'Mastering Conversational AI',
         duration: 40,
         topics: ['chatgpt', 'conversation']
       });
     }

     if (interests.includes('image_ai')) {
       lessons.push({
         id: 'image-ai-tools',
         title: 'AI Image Generation Tools',
         duration: 45,
         topics: ['images', 'creative']
       });
     }

     if (interests.includes('writing_ai')) {
       lessons.push({
         id: 'ai-writing-mastery',
         title: 'AI Writing and Content Tools',
         duration: 40,
         topics: ['writing', 'content']
       });
     }

    // Adjust for time constraints
    if (timeAvailable < 30) {
      // Split longer lessons
      lessons = lessons.map(lesson => {
        if (lesson.duration > 30) {
          return {
            ...lesson,
            duration: 25,
            splitLesson: true
          };
        }
        return lesson;
      });
    }

    // Address weak areas
    if (weakAreas.includes('prompt-engineering') && skillLevel !== 'beginner') {
      lessons.splice(1, 0, {
        id: 'prompt-engineering-basics',
        title: 'Prompt Engineering Fundamentals',
        duration: 35,
        topics: ['prompting', 'fundamentals'],
        remedial: true
      });
    }

    // Add lessons with proper structure
    const structuredLessons = lessons.map((lesson, index) => ({
      ...lesson,
      position: index + 1,
      difficulty: skillLevel,
      prerequisites: index > 0 ? [lessons[index - 1].id] : [],
      reasoning: `Part of ${skillLevel} learning progression`
    }));

    // Generate milestones
    const milestones = [
      {
        position: Math.ceil(structuredLessons.length * 0.33),
        title: 'Foundation Complete',
        description: 'You understand AI basics and can use simple tools'
      },
      {
        position: Math.ceil(structuredLessons.length * 0.66),
        title: 'Practical Skills Developed',
        description: 'You can effectively use AI for real tasks'
      },
      {
        position: structuredLessons.length,
        title: 'AI Proficiency Achieved',
        description: 'You have the skills to leverage AI effectively'
      }
    ];

    return {
      title: `${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} AI Learning Path`,
      description: `A personalized ${skillLevel}-level AI learning journey tailored to your goals and interests`,
      estimatedDuration: `${Math.ceil(structuredLessons.reduce((sum, l) => sum + l.duration, 0) / 60)} hours`,
      lessons: structuredLessons,
      milestones,
      metadata: {
        generatedAt: new Date().toISOString(),
        source: 'rule_based',
        userSkillLevel: skillLevel,
        customizedFor: goals,
        totalLessons: structuredLessons.length
      }
    };
  }

  /**
   * Determine if AI optimization is needed (cost optimization)
   * @param {Object} userProfile - User profile
   * @param {Object} preferences - User preferences
   * @returns {boolean} Whether AI is needed
   */
  static shouldUseAI(userProfile, preferences) {
    const complexityFactors = [
      userProfile.goals?.length > 3, // Many goals
      userProfile.weakAreas?.length > 2, // Many weak areas
      userProfile.strongAreas?.length > 3, // Many strong areas
      preferences.customRequirements, // Custom requirements
      userProfile.learningStyle === 'mixed' && userProfile.interests?.length > 4 // Complex profile
    ];

    // Only use AI if multiple complexity factors are present
    const complexityScore = complexityFactors.filter(Boolean).length;
    return complexityScore >= 2;
  }

  /**
   * Cache user learning path (cost optimization)
   * @param {string} userId - User identifier
   * @param {Object} path - Generated path
   * @param {Object} userProfile - User profile
   */
  static cacheUserPath(userId, path, userProfile) {
    try {
      const cacheKey = `learning_path_${userId}`;
      const cacheData = {
        path,
        profileHash: this.hashUserProfile(userProfile),
        cachedAt: Date.now(),
        expiresAt: Date.now() + this.CACHE_DURATION
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      logger.info('Cached learning path for user', { userId, cacheKey });
    } catch (error) {
      logger.warn('Failed to cache learning path:', error);
    }
  }

  /**
   * Get cached learning path if valid (cost optimization)
   * @param {string} userId - User identifier
   * @param {Object} currentProfile - Current user profile
   * @returns {Object|null} Cached path or null
   */
  static getCachedPath(userId, currentProfile) {
    try {
      const cacheKey = `learning_path_${userId}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) return null;
      
      const cacheData = JSON.parse(cached);
      
      // Check if expired
      if (Date.now() > cacheData.expiresAt) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      // Check if profile significantly changed
      const currentHash = this.hashUserProfile(currentProfile);
      if (currentHash !== cacheData.profileHash) {
        return null; // Profile changed, need fresh path
      }
      
      return cacheData.path;
      
    } catch (error) {
      logger.warn('Failed to get cached path:', error);
      return null;
    }
  }

  /**
   * Create hash of user profile for cache validation
   * @param {Object} userProfile - User profile
   * @returns {string} Profile hash
   */
  static hashUserProfile(userProfile) {
    const key = [
      userProfile.skillLevel,
      (userProfile.goals || []).sort().join(','),
      (userProfile.interests || []).sort().join(','),
      userProfile.learningStyle,
      userProfile.timeAvailable
    ].join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }
} 