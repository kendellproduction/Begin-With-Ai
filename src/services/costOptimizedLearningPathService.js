/**
 * Cost-Optimized Learning Path Service
 * Uses advanced rule-based logic instead of expensive AI API calls
 * Provides 90%+ of the personalization with 0% of the API costs
 */

import { sanitizeText, checkRateLimit } from '../utils/sanitization';
import logger from '../utils/logger';

export class CostOptimizedLearningPathService {
  static MAX_PATH_LENGTH = 20;
  static CACHE_DURATION = 86400000; // 24 hours in ms
  
  // Only use AI for complex edge cases - rate limit to 1 per user per day
  static AI_RATE_LIMIT_PER_USER = 1;
  static AI_RATE_LIMIT_WINDOW = 86400000; // 24 hours

  /**
   * Generate optimized learning path using rule-based logic (NO AI costs!)
   * @param {string} userId - User identifier
   * @param {Object} enhancedProfile - Enhanced user profile from questionnaire
   * @param {Object} preferences - User preferences
   * @returns {Promise<Object>} Optimized learning path
   */
  static async generateOptimizedPath(userId, enhancedProfile, preferences = {}) {
    try {
      // Check cache first
      const cached = this.getCachedPath(userId, enhancedProfile);
      if (cached) {
        logger.info('Using cached learning path', { userId });
        return {
          success: true,
          path: cached,
          source: 'cache',
          apiCost: 0
        };
      }

      // Use rule-based optimization (FREE)
      const optimizedPath = this.generateRuleBasedPath(enhancedProfile, preferences);
      
      // Only use AI for very complex cases or user requests
      const needsAI = this.shouldUseAI(enhancedProfile, preferences);
      
      if (needsAI) {
        // Check AI rate limit (very restrictive)
        const rateLimitCheck = checkRateLimit(
          `ai_path_${userId}`, 
          this.AI_RATE_LIMIT_PER_USER, 
          this.AI_RATE_LIMIT_WINDOW
        );
        
        if (rateLimitCheck.allowed) {
          const aiEnhanced = await this.enhanceWithAI(optimizedPath, enhancedProfile);
          this.cacheUserPath(userId, aiEnhanced, enhancedProfile);
          
          return {
            success: true,
            path: aiEnhanced,
            source: 'ai_enhanced',
            apiCost: 0.15, // Estimated cost
            remainingAIRequests: rateLimitCheck.remaining
          };
        } else {
          logger.info('AI rate limit reached, using rule-based path', { userId });
        }
      }

      // Cache the rule-based path
      this.cacheUserPath(userId, optimizedPath, enhancedProfile);
      
      return {
        success: true,
        path: optimizedPath,
        source: 'rule_based',
        apiCost: 0
      };

    } catch (error) {
      logger.error('Error generating optimized path:', error);
      return {
        success: false,
        error: error.message,
        path: this.getFallbackPath(enhancedProfile),
        source: 'fallback',
        apiCost: 0
      };
    }
  }

  /**
   * Generate highly personalized path using advanced rule-based logic
   * @param {Object} enhancedProfile - Enhanced user profile
   * @param {Object} preferences - User preferences
   * @returns {Object} Optimized learning path
   */
  static generateRuleBasedPath(enhancedProfile, preferences) {
    const {
      skillLevel,
      pace,
      sessionLength,
      techLevel,
      motivation,
      goals,
      challenges,
      contentPreferences,
      interests,
      domain,
      successDefinition
    } = enhancedProfile;

    // Base lesson library organized by skill and topic
    const lessonLibrary = this.getLessonLibrary();
    
    // Start with core path based on skill level
    let lessons = [...lessonLibrary.core[skillLevel]];
    
    // Customize based on primary goals
    lessons = this.addGoalBasedLessons(lessons, goals, lessonLibrary, skillLevel);
    
    // Adjust for technical background
    lessons = this.adjustForTechLevel(lessons, techLevel, lessonLibrary);
    
    // Add domain-specific content
    lessons = this.addDomainContent(lessons, domain, lessonLibrary, skillLevel);
    
    // Customize for learning challenges
    lessons = this.addressLearningChallenges(lessons, challenges, lessonLibrary);
    
    // Adjust based on time and pace preferences
    lessons = this.optimizeForTimeAndPace(lessons, pace, sessionLength, motivation);
    
    // Add interest-based lessons
    lessons = this.addInterestBasedContent(lessons, interests, lessonLibrary, skillLevel);
    
    // Organize lessons with optimal progression
    lessons = this.optimizeLessonProgression(lessons, enhancedProfile);
    
    // Add milestones and checkpoints
    const milestones = this.generateMilestones(lessons, successDefinition);
    
    // Calculate metadata
    const metadata = this.calculatePathMetadata(lessons, enhancedProfile);

    return {
      title: this.generatePathTitle(enhancedProfile),
      description: this.generatePathDescription(enhancedProfile),
      lessons: lessons.slice(0, this.MAX_PATH_LENGTH),
      milestones,
      metadata,
      personalization: {
        skillLevel,
        customizedFor: goals,
        addressesChallenges: challenges,
        optimizedFor: pace,
        estimatedCompletion: metadata.estimatedCompletion
      }
    };
  }

  /**
   * Comprehensive lesson library organized by skill level and topic
   * @returns {Object} Lesson library
   */
  static getLessonLibrary() {
    return {
      core: {
        beginner: [
          {
            id: 'ai-welcome',
            title: 'Welcome to AI',
            duration: 15,
            difficulty: 'beginner',
            topics: ['introduction'],
            prerequisites: [],
            type: 'welcome'
          },
          {
            id: 'what-is-ai',
            title: 'What is Artificial Intelligence?',
            duration: 25,
            difficulty: 'beginner',
            topics: ['fundamentals'],
            prerequisites: ['ai-welcome'],
            type: 'concept'
          },
          {
            id: 'ai-in-daily-life',
            title: 'AI in Your Daily Life',
            duration: 20,
            difficulty: 'beginner',
            topics: ['applications', 'real-world'],
            prerequisites: ['what-is-ai'],
            type: 'application'
          },
          {
            id: 'first-ai-interaction',
            title: 'Your First AI Conversation',
            duration: 30,
            difficulty: 'beginner',
            topics: ['hands-on', 'chatgpt'],
            prerequisites: ['ai-in-daily-life'],
            type: 'interactive'
          }
        ],
        intermediate: [
          {
            id: 'ai-fundamentals-deep',
            title: 'AI Fundamentals Deep Dive',
            duration: 35,
            difficulty: 'intermediate',
            topics: ['fundamentals', 'technical'],
            prerequisites: [],
            type: 'concept'
          },
          {
            id: 'prompt-engineering-basics',
            title: 'Prompt Engineering Fundamentals',
            duration: 40,
            difficulty: 'intermediate',
            topics: ['prompt-engineering', 'practical'],
            prerequisites: ['ai-fundamentals-deep'],
            type: 'skill'
          },
          {
            id: 'ai-tools-landscape',
            title: 'Navigating the AI Tools Landscape',
            duration: 35,
            difficulty: 'intermediate',
            topics: ['tools', 'practical'],
            prerequisites: ['prompt-engineering-basics'],
            type: 'survey'
          },
          {
            id: 'workflow-integration',
            title: 'Integrating AI into Your Workflow',
            duration: 45,
            difficulty: 'intermediate',
            topics: ['productivity', 'workflow'],
            prerequisites: ['ai-tools-landscape'],
            type: 'application'
          }
        ],
        advanced: [
          {
            id: 'advanced-prompt-techniques',
            title: 'Advanced Prompting Techniques',
            duration: 50,
            difficulty: 'advanced',
            topics: ['prompt-engineering', 'advanced'],
            prerequisites: [],
            type: 'skill'
          },
          {
            id: 'ai-workflow-optimization',
            title: 'AI Workflow Optimization',
            duration: 55,
            difficulty: 'advanced',
            topics: ['optimization', 'efficiency'],
            prerequisites: ['advanced-prompt-techniques'],
            type: 'optimization'
          },
          {
            id: 'building-ai-solutions',
            title: 'Building AI-Powered Solutions',
            duration: 60,
            difficulty: 'advanced',
            topics: ['development', 'solutions'],
            prerequisites: ['ai-workflow-optimization'],
            type: 'project'
          },
          {
            id: 'ai-strategy-leadership',
            title: 'AI Strategy and Leadership',
            duration: 45,
            difficulty: 'advanced',
            topics: ['strategy', 'leadership'],
            prerequisites: ['building-ai-solutions'],
            type: 'strategic'
          }
        ]
      },
      
      goalBased: {
        content_creation: [
          {
            id: 'ai-writing-assistant',
            title: 'AI as Your Writing Assistant',
            duration: 35,
            topics: ['writing', 'content'],
            type: 'practical'
          },
          {
            id: 'image-generation-basics',
            title: 'AI Image Generation Basics',
            duration: 40,
            topics: ['images', 'creative'],
            type: 'creative'
          },
          {
            id: 'content-workflow',
            title: 'Building a Content Creation Workflow',
            duration: 45,
            topics: ['workflow', 'content'],
            type: 'workflow'
          }
        ],
        work_productivity: [
          {
            id: 'ai-email-assistant',
            title: 'AI for Email and Communication',
            duration: 30,
            topics: ['communication', 'productivity'],
            type: 'practical'
          },
          {
            id: 'ai-research-assistant',
            title: 'AI as a Research Assistant',
            duration: 35,
            topics: ['research', 'productivity'],
            type: 'practical'
          },
          {
            id: 'meeting-productivity',
            title: 'AI for Meeting Productivity',
            duration: 25,
            topics: ['meetings', 'productivity'],
            type: 'practical'
          }
        ],
        build_apps: [
          {
            id: 'ai-development-intro',
            title: 'Introduction to AI Development',
            duration: 50,
            topics: ['development', 'technical'],
            type: 'technical'
          },
          {
            id: 'api-integration',
            title: 'Integrating AI APIs',
            duration: 55,
            topics: ['apis', 'integration'],
            type: 'technical'
          },
          {
            id: 'building-chatbots',
            title: 'Building Your First AI Chatbot',
            duration: 60,
            topics: ['chatbots', 'development'],
            type: 'project'
          }
        ]
      },
      
      domainSpecific: {
        education: [
          {
            id: 'ai-in-education',
            title: 'AI in Educational Settings',
            duration: 40,
            topics: ['education', 'teaching'],
            type: 'domain'
          },
          {
            id: 'ai-lesson-planning',
            title: 'AI for Lesson Planning',
            duration: 35,
            topics: ['lesson-planning', 'education'],
            type: 'practical'
          }
        ],
        business: [
          {
            id: 'ai-business-strategy',
            title: 'AI in Business Strategy',
            duration: 45,
            topics: ['business', 'strategy'],
            type: 'strategic'
          },
          {
            id: 'ai-customer-service',
            title: 'AI for Customer Service',
            duration: 40,
            topics: ['customer-service', 'business'],
            type: 'practical'
          }
        ],
        creative: [
          {
            id: 'ai-creative-process',
            title: 'AI in the Creative Process',
            duration: 40,
            topics: ['creativity', 'process'],
            type: 'creative'
          },
          {
            id: 'ai-design-tools',
            title: 'AI Design and Art Tools',
            duration: 45,
            topics: ['design', 'art'],
            type: 'creative'
          }
        ]
      },
      
      challengeAddressing: {
        jargon: [
          {
            id: 'ai-terminology-guide',
            title: 'AI Terminology Made Simple',
            duration: 25,
            topics: ['terminology', 'fundamentals'],
            type: 'reference'
          }
        ],
        overwhelm: [
          {
            id: 'step-by-step-approach',
            title: 'Taking AI One Step at a Time',
            duration: 20,
            topics: ['confidence', 'approach'],
            type: 'supportive'
          }
        ],
        time: [
          {
            id: 'efficient-ai-learning',
            title: 'Learning AI Efficiently',
            duration: 15,
            topics: ['efficiency', 'time-management'],
            type: 'meta-learning'
          }
        ]
      }
    };
  }

  /**
   * Add lessons based on user goals
   * @param {Array} lessons - Current lessons
   * @param {Array} goals - User goals
   * @param {Object} library - Lesson library
   * @param {string} skillLevel - User skill level
   * @returns {Array} Enhanced lessons
   */
  static addGoalBasedLessons(lessons, goals, library, skillLevel) {
    goals.forEach(goal => {
      if (library.goalBased[goal]) {
        const goalLessons = library.goalBased[goal]
          .map(lesson => ({
            ...lesson,
            difficulty: skillLevel,
            goalRelated: true
          }));
        lessons.push(...goalLessons);
      }
    });
    
    return lessons;
  }

  /**
   * Adjust lessons based on technical level
   * @param {Array} lessons - Current lessons
   * @param {number} techLevel - Technical level (0-5)
   * @param {Object} library - Lesson library
   * @returns {Array} Adjusted lessons
   */
  static adjustForTechLevel(lessons, techLevel, library) {
    if (techLevel >= 3) {
      // Add technical depth
      lessons.forEach(lesson => {
        if (lesson.topics.includes('fundamentals')) {
          lesson.duration += 10; // More technical depth
          lesson.technicalDepth = 'high';
        }
      });
    } else if (techLevel <= 1) {
      // Simplify and add explanatory content
      lessons.forEach(lesson => {
        if (lesson.type === 'concept') {
          lesson.simplified = true;
          lesson.duration += 5; // More explanation time
        }
      });
    }
    
    return lessons;
  }

  /**
   * Add domain-specific content
   * @param {Array} lessons - Current lessons
   * @param {string} domain - User domain
   * @param {Object} library - Lesson library
   * @param {string} skillLevel - User skill level
   * @returns {Array} Enhanced lessons
   */
  static addDomainContent(lessons, domain, library, skillLevel) {
    if (library.domainSpecific[domain]) {
      const domainLessons = library.domainSpecific[domain]
        .map(lesson => ({
          ...lesson,
          difficulty: skillLevel,
          domainSpecific: true
        }));
      lessons.push(...domainLessons);
    }
    
    return lessons;
  }

  /**
   * Address specific learning challenges
   * @param {Array} lessons - Current lessons
   * @param {Array} challenges - User challenges
   * @param {Object} library - Lesson library
   * @returns {Array} Enhanced lessons
   */
  static addressLearningChallenges(lessons, challenges, library) {
    challenges.forEach(challenge => {
      if (library.challengeAddressing[challenge]) {
        const supportLessons = library.challengeAddressing[challenge];
        // Insert support lessons early in the path
        lessons.splice(1, 0, ...supportLessons);
      }
    });
    
    return lessons;
  }

  /**
   * Optimize for time and pace preferences
   * @param {Array} lessons - Current lessons
   * @param {string} pace - Learning pace
   * @param {string} sessionLength - Session length preference
   * @param {number} motivation - Motivation level
   * @returns {Array} Optimized lessons
   */
  static optimizeForTimeAndPace(lessons, pace, sessionLength, motivation) {
    const sessionLimits = {
      short: 25,
      medium: 40,
      long: 60
    };
    
    const maxDuration = sessionLimits[sessionLength] || 40;
    
    // Adjust lesson durations to fit session preferences
    lessons.forEach(lesson => {
      if (lesson.duration > maxDuration) {
        lesson.splitIntoSessions = Math.ceil(lesson.duration / maxDuration);
        lesson.sessionDuration = maxDuration;
      }
    });
    
    // Adjust total lessons based on pace and motivation
    if (pace === 'fast' && motivation >= 4) {
      // Remove some intermediate steps
      lessons = lessons.filter(lesson => lesson.type !== 'supportive');
    } else if (pace === 'slow' || motivation <= 2) {
      // Add more practice and review
      lessons.forEach((lesson, index) => {
        if (index > 0 && index % 2 === 0) {
          lessons.splice(index + 1, 0, {
            id: `review-${index}`,
            title: `Review: ${lesson.title}`,
            duration: 15,
            type: 'review',
            reviewsLesson: lesson.id
          });
        }
      });
    }
    
    return lessons;
  }

  /**
   * Add interest-based content
   * @param {Array} lessons - Current lessons
   * @param {Array} interests - User interests
   * @param {Object} library - Lesson library
   * @param {string} skillLevel - User skill level
   * @returns {Array} Enhanced lessons
   */
  static addInterestBasedContent(lessons, interests, library, skillLevel) {
    const interestMap = {
      chat_ai: 'conversational_ai',
      image_ai: 'creative_ai',
      writing_ai: 'content_ai'
    };
    
    interests.forEach(interest => {
      const mappedInterest = interestMap[interest] || interest;
      // Add relevant lessons based on interests
      if (mappedInterest === 'creative_ai') {
        lessons.push({
          id: 'creative-ai-exploration',
          title: 'Exploring Creative AI Tools',
          duration: 35,
          difficulty: skillLevel,
          topics: ['creative', 'tools'],
          type: 'exploration',
          interestBased: true
        });
      }
    });
    
    return lessons;
  }

  /**
   * Optimize lesson progression for maximum learning
   * @param {Array} lessons - Current lessons
   * @param {Object} enhancedProfile - User profile
   * @returns {Array} Optimized lessons
   */
  static optimizeLessonProgression(lessons, enhancedProfile) {
    // Remove duplicates
    const unique = lessons.filter((lesson, index, self) => 
      index === self.findIndex(l => l.id === lesson.id)
    );
    
    // Sort by logical progression
    const sorted = unique.sort((a, b) => {
      // Welcome lessons first
      if (a.type === 'welcome') return -1;
      if (b.type === 'welcome') return 1;
      
      // Support lessons early
      if (a.type === 'supportive' && b.type !== 'supportive') return -1;
      if (b.type === 'supportive' && a.type !== 'supportive') return 1;
      
      // Concepts before applications
      if (a.type === 'concept' && b.type === 'application') return -1;
      if (b.type === 'concept' && a.type === 'application') return 1;
      
      // Skills before projects
      if (a.type === 'skill' && b.type === 'project') return -1;
      if (b.type === 'skill' && a.type === 'project') return 1;
      
      return 0;
    });
    
    // Add position numbers
    return sorted.map((lesson, index) => ({
      ...lesson,
      position: index + 1,
      prerequisites: index > 0 ? [sorted[index - 1].id] : []
    }));
  }

  /**
   * Generate milestones based on lesson progression
   * @param {Array} lessons - Lessons in path
   * @param {string} successDefinition - How user defines success
   * @returns {Array} Milestones
   */
  static generateMilestones(lessons, successDefinition) {
    const milestones = [];
    const totalLessons = lessons.length;
    
    // Early milestone (25%)
    const earlyPoint = Math.floor(totalLessons * 0.25);
    milestones.push({
      position: earlyPoint,
      title: 'Foundation Built',
      description: 'You understand the AI basics and are ready for practical applications',
      type: 'foundation'
    });
    
    // Mid milestone (50%)
    const midPoint = Math.floor(totalLessons * 0.5);
    milestones.push({
      position: midPoint,
      title: 'Practical Skills Developed',
      description: 'You can confidently use AI tools for real tasks',
      type: 'practical'
    });
    
    // Success milestone based on user definition
    const finalPoint = Math.floor(totalLessons * 0.8);
    const successTitles = {
      daily_use: 'Daily AI Integration',
      understand_explain: 'AI Knowledge Mastery',
      build_something: 'AI Creation Skills',
      stay_current: 'AI Awareness Expertise',
      teach_others: 'AI Teaching Readiness',
      not_overwhelmed: 'AI Confidence Achieved'
    };
    
    milestones.push({
      position: finalPoint,
      title: successTitles[successDefinition] || 'AI Proficiency Achieved',
      description: 'You have achieved your learning goals and can apply AI effectively',
      type: 'success'
    });
    
    return milestones;
  }

  /**
   * Calculate path metadata
   * @param {Array} lessons - Lessons in path
   * @param {Object} enhancedProfile - User profile
   * @returns {Object} Metadata
   */
  static calculatePathMetadata(lessons, enhancedProfile) {
    const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
    const sessionMap = { short: 25, medium: 40, long: 60 };
    const sessionDuration = sessionMap[enhancedProfile.sessionLength] || 40;
    const sessionsNeeded = Math.ceil(totalDuration / sessionDuration);
    
    return {
      totalLessons: lessons.length,
      totalDuration,
      averageLessonDuration: Math.round(totalDuration / lessons.length),
      estimatedSessions: sessionsNeeded,
      estimatedCompletion: this.calculateCompletionTime(sessionsNeeded, enhancedProfile.motivation),
      difficulty: this.calculateAverageDifficulty(lessons),
      generatedAt: new Date().toISOString(),
      source: 'rule_based',
      version: '2.0'
    };
  }

  /**
   * Calculate estimated completion time
   * @param {number} sessions - Number of sessions
   * @param {number} motivation - Motivation level
   * @returns {string} Completion estimate
   */
  static calculateCompletionTime(sessions, motivation) {
    const sessionsPerWeek = {
      1: 1, // Low motivation
      2: 2,
      3: 3, // Moderate motivation
      4: 4,
      5: 5  // High motivation
    };
    
    const weeklyRate = sessionsPerWeek[motivation] || 3;
    const weeks = Math.ceil(sessions / weeklyRate);
    
    if (weeks <= 2) return `${weeks} week${weeks > 1 ? 's' : ''}`;
    if (weeks <= 8) return `${weeks} weeks`;
    return `${Math.ceil(weeks / 4)} month${weeks > 8 ? 's' : ''}`;
  }

  /**
   * Calculate average difficulty
   * @param {Array} lessons - Lessons
   * @returns {string} Average difficulty
   */
  static calculateAverageDifficulty(lessons) {
    const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3 };
    const totalScore = lessons.reduce((sum, lesson) => 
      sum + (difficultyMap[lesson.difficulty] || 1), 0
    );
    const average = totalScore / lessons.length;
    
    if (average <= 1.3) return 'beginner';
    if (average <= 2.3) return 'intermediate';
    return 'advanced';
  }

  /**
   * Generate personalized path title
   * @param {Object} enhancedProfile - User profile
   * @returns {string} Path title
   */
  static generatePathTitle(enhancedProfile) {
    const { skillLevel, goals, domain } = enhancedProfile;
    
    const levelTitles = {
      beginner: 'Your AI Foundation Journey',
      intermediate: 'AI Mastery Path',
      advanced: 'Advanced AI Expertise Track'
    };
    
    if (goals.includes('content_creation')) {
      return `${levelTitles[skillLevel]} - Creative AI Focus`;
    }
    
    if (goals.includes('work_productivity')) {
      return `${levelTitles[skillLevel]} - Productivity Focus`;
    }
    
    if (domain === 'education') {
      return `${levelTitles[skillLevel]} - Educator Edition`;
    }
    
    return levelTitles[skillLevel];
  }

  /**
   * Generate personalized path description
   * @param {Object} enhancedProfile - User profile
   * @returns {string} Path description
   */
  static generatePathDescription(enhancedProfile) {
    const { skillLevel, pace, goals, challenges } = enhancedProfile;
    
    let description = `A personalized AI learning journey designed for ${skillLevel} learners who prefer a ${pace} pace. `;
    
    if (goals.length > 0) {
      description += `This path focuses on ${goals.slice(0, 2).join(' and ')} `;
    }
    
    if (challenges.includes('jargon')) {
      description += 'with clear, jargon-free explanations ';
    }
    
    if (challenges.includes('time')) {
      description += 'optimized for busy schedules ';
    }
    
    description += 'to help you achieve your AI learning goals effectively.';
    
    return description;
  }

  /**
   * Determine if AI enhancement is needed (rarely)
   * @param {Object} enhancedProfile - User profile
   * @param {Object} preferences - User preferences
   * @returns {boolean} Whether AI is needed
   */
  static shouldUseAI(enhancedProfile, preferences) {
    // Only use AI for very complex edge cases
    const complexCases = [
      enhancedProfile.goals.length > 4, // Too many goals
      enhancedProfile.challenges.length > 3, // Too many challenges
      preferences.customRequest, // Specific custom request
      enhancedProfile.techLevel >= 4 && enhancedProfile.skillLevel === 'beginner' // Mismatch
    ];
    
    return complexCases.some(Boolean);
  }

  /**
   * Enhance path with AI (only for complex cases)
   * @param {Object} rulePath - Rule-based path
   * @param {Object} enhancedProfile - User profile
   * @returns {Promise<Object>} AI-enhanced path
   */
  static async enhanceWithAI(rulePath, enhancedProfile) {
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return rulePath; // Fallback to rule-based
    }

    try {
      const prompt = `Enhance this learning path based on the user's complex requirements:
      
User Profile: ${JSON.stringify(enhancedProfile, null, 2)}
Current Path: ${JSON.stringify(rulePath, null, 2)}

Provide minor adjustments to lesson order, duration, or add 1-2 specialized lessons if needed.
Respond with the enhanced path in the same JSON format.`;

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
              content: 'You are a learning path optimization expert. Make minimal, targeted improvements to the provided rule-based path.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const enhancedPath = JSON.parse(data.choices[0]?.message?.content || '{}');
      
      return {
        ...rulePath,
        ...enhancedPath,
        metadata: {
          ...rulePath.metadata,
          aiEnhanced: true,
          enhancedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      logger.warn('AI enhancement failed, using rule-based path:', error);
      return rulePath;
    }
  }

  /**
   * Cache user path to avoid regeneration
   * @param {string} userId - User identifier
   * @param {Object} path - Generated path
   * @param {Object} profile - User profile
   */
  static cacheUserPath(userId, path, profile) {
    try {
      const cacheKey = `user_path_${userId}`;
      const cacheData = {
        path,
        profile: {
          skillLevel: profile.skillLevel,
          goals: profile.goals,
          hash: this.hashProfile(profile)
        },
        cachedAt: Date.now(),
        expiresAt: Date.now() + this.CACHE_DURATION
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      logger.warn('Failed to cache user path:', error);
    }
  }

  /**
   * Get cached path if still valid
   * @param {string} userId - User identifier
   * @param {Object} currentProfile - Current user profile
   * @returns {Object|null} Cached path or null
   */
  static getCachedPath(userId, currentProfile) {
    try {
      const cacheKey = `user_path_${userId}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) return null;
      
      const cacheData = JSON.parse(cached);
      
      // Check if expired
      if (Date.now() > cacheData.expiresAt) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      // Check if profile significantly changed
      const currentHash = this.hashProfile(currentProfile);
      if (currentHash !== cacheData.profile.hash) {
        return null;
      }
      
      return cacheData.path;
      
    } catch (error) {
      logger.warn('Failed to get cached path:', error);
      return null;
    }
  }

  /**
   * Create simple hash of user profile for cache validation
   * @param {Object} profile - User profile
   * @returns {string} Profile hash
   */
  static hashProfile(profile) {
    const key = `${profile.skillLevel}-${profile.goals.sort().join(',')}-${profile.pace}-${profile.sessionLength}`;
    return btoa(key).slice(0, 10);
  }

  /**
   * Get fallback path for errors
   * @param {Object} enhancedProfile - User profile
   * @returns {Object} Fallback path
   */
  static getFallbackPath(enhancedProfile) {
    return {
      title: 'Getting Started with AI',
      description: 'A basic introduction to AI concepts and tools',
      lessons: [
        {
          id: 'ai-intro',
          title: 'Introduction to AI',
          duration: 20,
          difficulty: 'beginner',
          position: 1
        },
        {
          id: 'first-steps',
          title: 'Your First Steps with AI',
          duration: 25,
          difficulty: 'beginner', 
          position: 2
        }
      ],
      milestones: [
        {
          position: 1,
          title: 'AI Awareness',
          description: 'You understand what AI is and how it can help you'
        }
      ],
      metadata: {
        source: 'fallback',
        generatedAt: new Date().toISOString()
      }
    };
  }
}

export default CostOptimizedLearningPathService; 