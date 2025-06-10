/**
 * Smart Hint Service
 * Provides context-aware hints for stuck students
 * Analyzes user progress and provides progressive hints
 */

import { sanitizeText, checkRateLimit } from '../utils/sanitization';
import logger from '../utils/logger';

export class SmartHintService {
  static MAX_HINT_LENGTH = 500;
  static RATE_LIMIT_PER_USER = 30; // 30 hint requests per hour
  static RATE_LIMIT_WINDOW = 3600000; // 1 hour in ms

  /**
   * Get context-aware hint for a stuck student
   * @param {string} userId - User identifier
   * @param {Object} context - Learning context
   * @returns {Promise<Object>} Hint response
   */
  static async getSmartHint(userId, context) {
    try {
      // Rate limiting check
      const rateLimitCheck = checkRateLimit(
        `smart_hint_${userId}`, 
        this.RATE_LIMIT_PER_USER, 
        this.RATE_LIMIT_WINDOW
      );
      
      if (!rateLimitCheck.allowed) {
        throw new Error(`Hint rate limit exceeded. Try again in ${Math.ceil((rateLimitCheck.resetTime - Date.now()) / 60000)} minutes.`);
      }

      // Sanitize and validate context
      const sanitizedContext = this.sanitizeContext(context);
      if (!sanitizedContext.isValid) {
        return {
          success: false,
          error: sanitizedContext.error,
          hint: null
        };
      }

      // Analyze user's situation
      const analysis = this.analyzeUserContext(sanitizedContext.data);
      
      // Generate appropriate hint
      const hint = await this.generateHint(analysis);

      // Log for analytics
      logger.info('Smart hint generated', {
        userId,
        lessonId: sanitizedContext.data.lessonId,
        hintType: hint.type,
        difficulty: hint.difficulty
      });

      return {
        success: true,
        hint,
        remainingRequests: rateLimitCheck.remaining
      };

    } catch (error) {
      logger.error('Error generating smart hint:', error);
      return {
        success: false,
        error: error.message,
        hint: null
      };
    }
  }

  /**
   * Sanitize and validate hint context
   * @param {Object} context - Raw context data
   * @returns {Object} Validation result
   */
  static sanitizeContext(context) {
    if (!context || typeof context !== 'object') {
      return { isValid: false, error: 'Context must be an object' };
    }

    const required = ['lessonId', 'currentStep', 'userCode'];
    const missing = required.filter(field => !context[field]);
    
    if (missing.length > 0) {
      return { isValid: false, error: `Missing required fields: ${missing.join(', ')}` };
    }

    // Sanitize string fields
    const sanitized = {
      lessonId: sanitizeText(context.lessonId),
      currentStep: sanitizeText(context.currentStep),
      userCode: this.sanitizeUserCode(context.userCode),
      difficulty: sanitizeText(context.difficulty || 'intermediate'),
      timeSpent: Math.min(Number(context.timeSpent) || 0, 3600), // Max 1 hour
      attempts: Math.min(Number(context.attempts) || 0, 100), // Max 100 attempts
      errorMessage: sanitizeText(context.errorMessage || ''),
      expectedOutput: sanitizeText(context.expectedOutput || ''),
      previousHints: Array.isArray(context.previousHints) 
        ? context.previousHints.slice(0, 10).map(h => sanitizeText(h))
        : []
    };

    return { isValid: true, data: sanitized };
  }

  /**
   * Sanitize user code for hint generation
   * @param {string} code - User's code
   * @returns {string} Sanitized code
   */
  static sanitizeUserCode(code) {
    if (typeof code !== 'string') return '';
    
    // Basic sanitization while preserving code structure
    return code
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .substring(0, 5000); // Limit length
  }

  /**
   * Analyze user context to determine what kind of hint is needed
   * @param {Object} context - Sanitized context
   * @returns {Object} Analysis result
   */
  static analyzeUserContext(context) {
    const analysis = {
      strugglingArea: 'general',
      hintLevel: 1,
      userState: 'learning',
      suggestions: []
    };

    // Analyze time spent
    if (context.timeSpent > 900) { // 15 minutes
      analysis.userState = 'stuck';
      analysis.hintLevel = Math.min(3, Math.floor(context.timeSpent / 300)); // More detailed hints for longer struggles
    }

    // Analyze attempts
    if (context.attempts > 5) {
      analysis.userState = 'frustrated';
      analysis.hintLevel = Math.min(3, analysis.hintLevel + 1);
    }

    // Analyze error patterns
    if (context.errorMessage) {
      analysis.strugglingArea = this.categorizeError(context.errorMessage);
    }

    // Analyze code patterns
    if (context.userCode) {
      const codeAnalysis = this.analyzeCodePatterns(context.userCode);
      analysis.strugglingArea = codeAnalysis.likelyIssue || analysis.strugglingArea;
      analysis.suggestions = codeAnalysis.suggestions;
    }

    // Check previous hints to avoid repetition
    if (context.previousHints.length > 2) {
      analysis.hintLevel = Math.min(3, analysis.hintLevel + 1);
      analysis.avoidRepetition = true;
    }

    return analysis;
  }

  /**
   * Categorize error messages to understand what user is struggling with
   * @param {string} errorMessage - Error message
   * @returns {string} Error category
   */
  static categorizeError(errorMessage) {
    const errorMap = {
      'syntax': /syntax|unexpected|missing|bracket|parenthes|semicolon/i,
      'reference': /not defined|reference|variable/i,
      'type': /type|cannot read|undefined|null/i,
      'logic': /wrong|incorrect|expected|result/i,
      'async': /promise|async|await|callback/i,
      'scope': /scope|closure|hoisting/i,
      'array': /array|index|length/i,
      'object': /object|property|method/i,
      'function': /function|parameter|argument|return/i
    };

    for (const [category, pattern] of Object.entries(errorMap)) {
      if (pattern.test(errorMessage)) {
        return category;
      }
    }

    return 'general';
  }

  /**
   * Analyze code patterns to identify likely issues
   * @param {string} code - User's code
   * @returns {Object} Code analysis
   */
  static analyzeCodePatterns(code) {
    const issues = [];
    const suggestions = [];

    // Common beginner issues
    if (!code.includes(';') && code.length > 20) {
      issues.push('Missing semicolons');
      suggestions.push('Remember to end statements with semicolons');
    }

    if (/\bvar\b/.test(code)) {
      issues.push('Using var instead of let/const');
      suggestions.push('Try using let or const instead of var');
    }

    if (/function\s*\(\s*\)/.test(code) && !code.includes('return')) {
      issues.push('Function missing return statement');
      suggestions.push('Functions usually need to return a value');
    }

    if (/for\s*\(/.test(code) && !code.includes('++')) {
      issues.push('Loop missing increment');
      suggestions.push('For loops usually need to increment the counter');
    }

    if (code.includes('console.log') && code.split('console.log').length > 3) {
      issues.push('Too many console.log statements');
      suggestions.push('Try using fewer console.log statements for debugging');
    }

    return {
      likelyIssue: issues[0] || 'general',
      allIssues: issues,
      suggestions
    };
  }

  /**
   * Generate appropriate hint based on analysis
   * @param {Object} analysis - User context analysis
   * @returns {Promise<Object>} Generated hint
   */
  static async generateHint(analysis) {
    // Use predefined hints for common scenarios
    const predefinedHint = this.getPredefinedHint(analysis);
    if (predefinedHint) {
      return predefinedHint;
    }

    // Generate AI-powered hint for complex scenarios
    return await this.generateAIHint(analysis);
  }

  /**
   * Get predefined hints for common scenarios
   * @param {Object} analysis - Analysis result
   * @returns {Object|null} Predefined hint or null
   */
  static getPredefinedHint(analysis) {
    const hintDatabase = {
      syntax: {
        1: {
          type: 'syntax',
          difficulty: 'gentle',
          title: 'Syntax Check',
          message: 'Check your code for missing brackets, parentheses, or semicolons. Every opening bracket needs a closing one!',
          example: 'if (condition) { // code here }',
          actionable: true
        },
        2: {
          type: 'syntax',
          difficulty: 'specific',
          title: 'Common Syntax Issues',
          message: 'Look for missing semicolons at the end of statements, unmatched brackets, or missing quotes around strings.',
          example: 'let name = "John"; // semicolon needed',
          actionable: true
        },
        3: {
          type: 'syntax',
          difficulty: 'detailed',
          title: 'Detailed Syntax Guide',
          message: 'Here\'s what to check: 1) Every { has a matching }, 2) Every ( has a matching ), 3) Strings are in quotes, 4) Statements end with ;',
          example: 'function getName() {\n  return "John";\n}',
          actionable: true
        }
      },
      logic: {
        1: {
          type: 'logic',
          difficulty: 'gentle',
          title: 'Logic Check',
          message: 'Think about what your code is supposed to do step by step. Is each step doing what you expect?',
          actionable: false
        },
        2: {
          type: 'logic',
          difficulty: 'specific',
          title: 'Logic Debugging',
          message: 'Try adding console.log statements to see what values your variables have at different points.',
          example: 'console.log("x is:", x);',
          actionable: true
        },
        3: {
          type: 'logic',
          difficulty: 'detailed',
          title: 'Step-by-Step Logic',
          message: 'Break down your problem: 1) What input do you have? 2) What output do you want? 3) What steps get you there?',
          actionable: true
        }
      },
      function: {
        1: {
          type: 'function',
          difficulty: 'gentle',
          title: 'Function Basics',
          message: 'Remember that functions need to return a value if they\'re supposed to give you something back.',
          example: 'function add(a, b) { return a + b; }',
          actionable: true
        },
        2: {
          type: 'function',
          difficulty: 'specific',
          title: 'Function Parameters',
          message: 'Check that you\'re passing the right number and type of parameters to your function.',
          actionable: true
        }
      }
    };

    const categoryHints = hintDatabase[analysis.strugglingArea];
    if (categoryHints) {
      const levelHint = categoryHints[analysis.hintLevel] || categoryHints[1];
      return {
        ...levelHint,
        timestamp: new Date().toISOString(),
        source: 'predefined'
      };
    }

    return null;
  }

  /**
   * Generate AI-powered hint for complex scenarios
   * @param {Object} analysis - Analysis result
   * @returns {Promise<Object>} AI-generated hint
   */
  static async generateAIHint(analysis) {
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return this.getFallbackHint(analysis);
    }

    try {
      const prompt = this.generateHintPrompt(analysis);
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
              content: 'You are a patient coding tutor. Provide helpful hints without giving away the full solution. Be encouraging and specific.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';

      return this.parseAIHint(aiResponse, analysis);

    } catch (error) {
      logger.warn('AI hint generation failed, using fallback:', error);
      return this.getFallbackHint(analysis);
    }
  }

  /**
   * Generate prompt for AI hint generation
   * @param {Object} analysis - Analysis result
   * @returns {string} AI prompt
   */
  static generateHintPrompt(analysis) {
    return `A student is struggling with a coding exercise. Please provide a helpful hint.

Context:
- Struggling area: ${analysis.strugglingArea}
- User state: ${analysis.userState}
- Hint level needed: ${analysis.hintLevel} (1=gentle, 2=specific, 3=detailed)
- Previous suggestions: ${analysis.suggestions.join(', ') || 'none'}

Guidelines:
- Be encouraging and supportive
- Don't give away the complete solution
- Provide actionable advice
- Keep it under 200 words
- Use simple, clear language

Provide a JSON response with:
{
  "type": "hint_category",
  "difficulty": "gentle|specific|detailed", 
  "title": "Short descriptive title",
  "message": "The main hint message",
  "example": "Optional code example if helpful",
  "actionable": true/false
}`;
  }

  /**
   * Parse AI hint response
   * @param {string} response - AI response
   * @param {Object} analysis - Original analysis
   * @returns {Object} Parsed hint
   */
  static parseAIHint(response, analysis) {
    try {
      const hint = JSON.parse(response);
      
      return {
        type: this.sanitizeText(hint.type || analysis.strugglingArea),
        difficulty: this.sanitizeText(hint.difficulty || 'gentle'),
        title: this.sanitizeText(hint.title || 'Coding Hint'),
        message: this.sanitizeText(hint.message || 'Keep trying! You\'re on the right track.'),
        example: hint.example ? this.sanitizeText(hint.example) : null,
        actionable: Boolean(hint.actionable),
        timestamp: new Date().toISOString(),
        source: 'ai'
      };

    } catch (error) {
      logger.warn('Failed to parse AI hint response:', error);
      return this.getFallbackHint(analysis);
    }
  }

  /**
   * Get fallback hint when AI fails
   * @param {Object} analysis - Analysis result
   * @returns {Object} Fallback hint
   */
  static getFallbackHint(analysis) {
    const fallbackHints = {
      syntax: 'Check your syntax - look for missing brackets, parentheses, or semicolons.',
      logic: 'Think through your logic step by step. What should happen at each point?',
      function: 'Make sure your function returns a value and has the right parameters.',
      general: 'Take a step back and think about what you\'re trying to accomplish.'
    };

    return {
      type: analysis.strugglingArea,
      difficulty: 'gentle',
      title: 'Helpful Hint',
      message: fallbackHints[analysis.strugglingArea] || fallbackHints.general,
      example: null,
      actionable: true,
      timestamp: new Date().toISOString(),
      source: 'fallback'
    };
  }

  /**
   * Sanitize text for hint display
   * @param {string} text - Raw text
   * @returns {string} Sanitized text
   */
  static sanitizeText(text) {
    if (typeof text !== 'string') return '';
    
    return sanitizeText(text).substring(0, this.MAX_HINT_LENGTH);
  }

  /**
   * Get progressive hints for a specific lesson step
   * @param {string} userId - User identifier
   * @param {string} lessonId - Lesson identifier
   * @param {string} stepId - Current step identifier
   * @returns {Promise<Object>} Progressive hints
   */
  static async getProgressiveHints(userId, lessonId, stepId) {
    try {
      // This would integrate with lesson data to provide step-specific hints
      const stepHints = await this.getStepSpecificHints(lessonId, stepId);
      
      return {
        success: true,
        hints: stepHints.map(hint => ({
          ...hint,
          difficulty: 'progressive'
        }))
      };

    } catch (error) {
      logger.error('Error getting progressive hints:', error);
      return {
        success: false,
        error: error.message,
        hints: []
      };
    }
  }

  /**
   * Get hints specific to a lesson step
   * @param {string} lessonId - Lesson identifier
   * @param {string} stepId - Step identifier
   * @returns {Promise<Array>} Step-specific hints
   */
  static async getStepSpecificHints(lessonId, stepId) {
    // This would fetch from lesson data or generate dynamically
    // For now, return mock progressive hints
    return [
      {
        level: 1,
        title: 'Getting Started',
        message: 'Think about what this step is asking you to do.',
        actionable: false
      },
      {
        level: 2,
        title: 'Approach Hint',
        message: 'Break the problem down into smaller parts.',
        actionable: true
      },
      {
        level: 3,
        title: 'Implementation Hint',
        message: 'Consider what programming concepts might be useful here.',
        actionable: true
      }
    ];
  }
} 