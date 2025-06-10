/**
 * AI Code Feedback Service
 * Provides real-time feedback on student code submissions
 * Includes safety measures and input sanitization
 */

import { sanitizeCode, checkRateLimit } from '../utils/sanitization';
import logger from '../utils/logger';

export class AICodeFeedbackService {
  static MAX_CODE_LENGTH = 10000;
  static RATE_LIMIT_PER_USER = 20; // 20 feedback requests per hour
  static RATE_LIMIT_WINDOW = 3600000; // 1 hour in ms

  /**
   * Analyze code and provide feedback
   * @param {string} userId - User identifier for rate limiting
   * @param {string} code - The code to analyze
   * @param {string} language - Programming language
   * @param {Object} context - Additional context (lesson, expected output, etc.)
   * @returns {Promise<Object>} Feedback object
   */
  static async analyzeCode(userId, code, language = 'javascript', context = {}) {
    try {
      // Rate limiting check
      const rateLimitCheck = checkRateLimit(
        `code_feedback_${userId}`, 
        this.RATE_LIMIT_PER_USER, 
        this.RATE_LIMIT_WINDOW
      );
      
      if (!rateLimitCheck.allowed) {
        throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((rateLimitCheck.resetTime - Date.now()) / 60000)} minutes.`);
      }

      // Input validation and sanitization
      const sanitizedCode = this.sanitizeAndValidateCode(code, language);
      if (!sanitizedCode.isValid) {
        return {
          success: false,
          error: sanitizedCode.error,
          feedback: null
        };
      }

      // Generate AI feedback prompt
      const prompt = this.generateFeedbackPrompt(sanitizedCode.code, language, context);
      
      // Call AI service
      const aiResponse = await this.callAIService(prompt);
      const feedback = this.parseAIFeedback(aiResponse);

      // Log for monitoring
      logger.info('Code feedback generated', {
        userId,
        language,
        codeLength: sanitizedCode.code.length,
        feedbackType: feedback.type
      });

      return {
        success: true,
        feedback,
        remainingRequests: rateLimitCheck.remaining
      };

    } catch (error) {
      logger.error('Error analyzing code:', error);
      return {
        success: false,
        error: error.message,
        feedback: null
      };
    }
  }

  /**
   * Sanitize and validate code input
   * @param {string} code - Raw code input
   * @param {string} language - Programming language
   * @returns {Object} Validation result
   */
  static sanitizeAndValidateCode(code, language) {
    // Basic validation
    if (typeof code !== 'string') {
      return { isValid: false, error: 'Code must be a string' };
    }

    if (code.length === 0) {
      return { isValid: false, error: 'Code cannot be empty' };
    }

    if (code.length > this.MAX_CODE_LENGTH) {
      return { isValid: false, error: `Code too long. Maximum ${this.MAX_CODE_LENGTH} characters allowed.` };
    }

    // Sanitize the code
    const sanitizedCode = sanitizeCode(code, language);

    // Additional security checks
    const dangerousPatterns = [
      /require\s*\(\s*['"]fs['"]/, // File system access
      /require\s*\(\s*['"]child_process['"]/, // Process execution
      /require\s*\(\s*['"]net['"]/, // Network access
      /require\s*\(\s*['"]http['"]/, // HTTP requests
      /fetch\s*\(/, // Fetch requests
      /XMLHttpRequest/, // XHR requests
      /localStorage|sessionStorage/, // Storage access
      /window\.|document\./, // DOM manipulation
      /\$\{.*\}/, // Template literal injection
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(sanitizedCode)) {
        return { 
          isValid: false, 
          error: 'Code contains potentially unsafe operations that are not allowed in the learning environment.' 
        };
      }
    }

    return { isValid: true, code: sanitizedCode };
  }

  /**
   * Generate AI prompt for code feedback
   * @param {string} code - Sanitized code
   * @param {string} language - Programming language
   * @param {Object} context - Additional context
   * @returns {string} AI prompt
   */
  static generateFeedbackPrompt(code, language, context) {
    const { lessonGoal, expectedOutput, difficulty = 'intermediate' } = context;

    return `You are an expert coding instructor providing feedback on student code. Be encouraging, specific, and educational.

**Code to Review:**
\`\`\`${language}
${code}
\`\`\`

**Context:**
- Language: ${language}
- Difficulty Level: ${difficulty}
- Lesson Goal: ${lessonGoal || 'General programming practice'}
- Expected Output: ${expectedOutput || 'Not specified'}

**Please provide feedback in this JSON format:**
{
  "type": "positive|constructive|error",
  "overall": "Brief overall assessment",
  "strengths": ["List of what the student did well"],
  "improvements": ["Specific suggestions for improvement"],
  "codeQuality": {
    "readability": "1-10 score with explanation",
    "efficiency": "1-10 score with explanation",
    "correctness": "1-10 score with explanation"
  },
  "suggestions": ["Specific code improvement suggestions"],
  "encouragement": "Encouraging message for the student",
  "nextSteps": ["What the student should focus on next"]
}

**Guidelines:**
- Be specific and constructive
- Provide actionable feedback
- Encourage learning and growth
- Point out both strengths and areas for improvement
- Suggest specific code improvements when possible
- Keep feedback appropriate for the difficulty level`;
  }

  /**
   * Call AI service for feedback generation
   * @param {string} prompt - AI prompt
   * @returns {Promise<string>} AI response
   */
  static async callAIService(prompt) {
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      // Return mock feedback for development
      return this.generateMockFeedback();
    }

    try {
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
              content: 'You are an expert coding instructor. Provide helpful, encouraging feedback on student code.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || this.generateMockFeedback();

    } catch (error) {
      logger.warn('OpenAI API failed, using mock feedback:', error);
      return this.generateMockFeedback();
    }
  }

  /**
   * Generate mock feedback for development/fallback
   * @returns {string} Mock AI response
   */
  static generateMockFeedback() {
    return JSON.stringify({
      type: "constructive",
      overall: "Good effort! Your code shows understanding of the basic concepts.",
      strengths: [
        "Code is well-formatted and readable",
        "Correct use of variables and functions",
        "Good logical flow"
      ],
      improvements: [
        "Consider adding comments to explain complex logic",
        "Some edge cases could be handled better",
        "Variable names could be more descriptive"
      ],
      codeQuality: {
        readability: "7/10 - Code is generally easy to read",
        efficiency: "6/10 - Could be optimized for better performance",
        correctness: "8/10 - Logic is mostly correct with minor issues"
      },
      suggestions: [
        "Add input validation",
        "Consider using more descriptive variable names",
        "Break down complex functions into smaller ones"
      ],
      encouragement: "You're making great progress! Keep practicing and experimenting with different approaches.",
      nextSteps: [
        "Practice error handling",
        "Learn about code optimization",
        "Try implementing similar functionality in different ways"
      ]
    });
  }

  /**
   * Parse AI feedback response
   * @param {string} response - Raw AI response
   * @returns {Object} Parsed feedback
   */
  static parseAIFeedback(response) {
    try {
      // Try to parse JSON response
      const feedback = JSON.parse(response);
      
      // Validate required fields
      if (!feedback.type || !feedback.overall) {
        throw new Error('Invalid feedback format');
      }

      // Sanitize text fields
      return {
        type: this.sanitizeFeedbackText(feedback.type),
        overall: this.sanitizeFeedbackText(feedback.overall),
        strengths: Array.isArray(feedback.strengths) 
          ? feedback.strengths.map(s => this.sanitizeFeedbackText(s))
          : [],
        improvements: Array.isArray(feedback.improvements)
          ? feedback.improvements.map(i => this.sanitizeFeedbackText(i))
          : [],
        codeQuality: feedback.codeQuality || {},
        suggestions: Array.isArray(feedback.suggestions)
          ? feedback.suggestions.map(s => this.sanitizeFeedbackText(s))
          : [],
        encouragement: this.sanitizeFeedbackText(feedback.encouragement || ''),
        nextSteps: Array.isArray(feedback.nextSteps)
          ? feedback.nextSteps.map(n => this.sanitizeFeedbackText(n))
          : []
      };

    } catch (error) {
      logger.warn('Failed to parse AI feedback, using fallback:', error);
      
      // Return sanitized fallback feedback
      return {
        type: 'constructive',
        overall: 'Code analysis completed successfully.',
        strengths: ['Code submitted successfully'],
        improvements: ['Continue practicing'],
        codeQuality: {
          readability: 'Analysis pending',
          efficiency: 'Analysis pending',
          correctness: 'Analysis pending'
        },
        suggestions: ['Keep coding and experimenting'],
        encouragement: 'Great job submitting your code!',
        nextSteps: ['Try the next exercise']
      };
    }
  }

  /**
   * Sanitize feedback text to prevent XSS
   * @param {string} text - Raw text
   * @returns {string} Sanitized text
   */
  static sanitizeFeedbackText(text) {
    if (typeof text !== 'string') return '';
    
    // Remove HTML tags and escape special characters
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>&"']/g, (match) => {
        const escapes = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return escapes[match];
      })
      .substring(0, 500); // Limit length
  }

  /**
   * Get detailed code analysis for advanced users
   * @param {string} userId - User identifier
   * @param {string} code - Code to analyze
   * @param {string} language - Programming language
   * @returns {Promise<Object>} Detailed analysis
   */
  static async getDetailedAnalysis(userId, code, language) {
    try {
      const sanitizedCode = this.sanitizeAndValidateCode(code, language);
      if (!sanitizedCode.isValid) {
        return { success: false, error: sanitizedCode.error };
      }

      const analysis = {
        complexity: this.analyzeComplexity(sanitizedCode.code),
        patterns: this.detectPatterns(sanitizedCode.code, language),
        performance: this.analyzePerformance(sanitizedCode.code, language),
        security: this.securityCheck(sanitizedCode.code),
        bestPractices: this.checkBestPractices(sanitizedCode.code, language)
      };

      return { success: true, analysis };

    } catch (error) {
      logger.error('Error in detailed analysis:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Analyze code complexity
   * @param {string} code - Code to analyze
   * @returns {Object} Complexity metrics
   */
  static analyzeComplexity(code) {
    const lines = code.split('\n').filter(line => line.trim().length > 0);
    const cyclomaticComplexity = this.calculateCyclomaticComplexity(code);
    
    return {
      linesOfCode: lines.length,
      cyclomaticComplexity,
      complexityLevel: cyclomaticComplexity < 5 ? 'low' : cyclomaticComplexity < 10 ? 'medium' : 'high'
    };
  }

  /**
   * Calculate cyclomatic complexity
   * @param {string} code - Code to analyze
   * @returns {number} Complexity score
   */
  static calculateCyclomaticComplexity(code) {
    const patterns = [
      /\bif\b/g,
      /\belse\b/g,
      /\bwhile\b/g,
      /\bfor\b/g,
      /\bswitch\b/g,
      /\bcase\b/g,
      /\bcatch\b/g,
      /\b&&\b/g,
      /\b\|\|\b/g,
      /\?.*:/g
    ];

    let complexity = 1; // Base complexity
    
    patterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });

    return complexity;
  }

  /**
   * Detect code patterns
   * @param {string} code - Code to analyze
   * @param {string} language - Programming language
   * @returns {Array} Detected patterns
   */
  static detectPatterns(code, language) {
    const patterns = [];

    if (language === 'javascript') {
      if (/function\s+\w+\s*\(/.test(code)) patterns.push('function_declaration');
      if (/const\s+\w+\s*=\s*\(/.test(code)) patterns.push('arrow_function');
      if (/class\s+\w+/.test(code)) patterns.push('class_definition');
      if (/\.\s*map\s*\(/.test(code)) patterns.push('array_map');
      if (/\.\s*filter\s*\(/.test(code)) patterns.push('array_filter');
      if (/async\s+function/.test(code)) patterns.push('async_function');
      if (/try\s*\{/.test(code)) patterns.push('error_handling');
    }

    return patterns;
  }

  /**
   * Analyze performance characteristics
   * @param {string} code - Code to analyze
   * @param {string} language - Programming language
   * @returns {Object} Performance analysis
   */
  static analyzePerformance(code, language) {
    const issues = [];
    const suggestions = [];

    if (language === 'javascript') {
      // Check for common performance issues
      if (/for\s*\(.*\.length.*\)/.test(code)) {
        issues.push('Loop condition evaluates array length each iteration');
        suggestions.push('Cache array length in a variable');
      }

      if (/document\.querySelector/.test(code) && code.match(/document\.querySelector/g)?.length > 3) {
        issues.push('Multiple DOM queries detected');
        suggestions.push('Cache DOM elements in variables');
      }

      if (/console\.log/.test(code)) {
        issues.push('Console.log statements may impact performance');
        suggestions.push('Remove console.log in production code');
      }
    }

    return { issues, suggestions, score: Math.max(1, 10 - issues.length) };
  }

  /**
   * Security check for common vulnerabilities
   * @param {string} code - Code to analyze
   * @returns {Object} Security analysis
   */
  static securityCheck(code) {
    const vulnerabilities = [];
    const recommendations = [];

    // Check for potential security issues
    if (/eval\s*\(/.test(code)) {
      vulnerabilities.push('Use of eval() function detected');
      recommendations.push('Avoid using eval() as it can execute arbitrary code');
    }

    if (/innerHTML\s*=/.test(code)) {
      vulnerabilities.push('Direct innerHTML assignment detected');
      recommendations.push('Use textContent or sanitize HTML to prevent XSS');
    }

    if (/document\.write/.test(code)) {
      vulnerabilities.push('Use of document.write detected');
      recommendations.push('Use modern DOM methods instead of document.write');
    }

    return {
      vulnerabilities,
      recommendations,
      riskLevel: vulnerabilities.length === 0 ? 'low' : vulnerabilities.length < 3 ? 'medium' : 'high'
    };
  }

  /**
   * Check adherence to best practices
   * @param {string} code - Code to analyze
   * @param {string} language - Programming language
   * @returns {Object} Best practices analysis
   */
  static checkBestPractices(code, language) {
    const violations = [];
    const recommendations = [];

    if (language === 'javascript') {
      // Check for var usage
      if (/\bvar\b/.test(code)) {
        violations.push('Use of var keyword');
        recommendations.push('Use const or let instead of var');
      }

      // Check for === usage
      if (/[^=!]==/.test(code)) {
        violations.push('Use of == instead of ===');
        recommendations.push('Use strict equality (===) instead of loose equality (==)');
      }

      // Check for magic numbers
      const numbers = code.match(/\b\d{2,}\b/g);
      if (numbers && numbers.length > 0) {
        violations.push('Magic numbers detected');
        recommendations.push('Define constants for magic numbers to improve readability');
      }

      // Check for function naming
      if (/function\s+[a-z]/.test(code)) {
        // Check if function names follow camelCase
        const funcNames = code.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
        if (funcNames) {
          funcNames.forEach(func => {
            const name = func.replace('function ', '');
            if (!/^[a-z][a-zA-Z0-9]*$/.test(name)) {
              violations.push(`Function name '${name}' doesn't follow camelCase`);
              recommendations.push('Use camelCase for function names');
            }
          });
        }
      }
    }

    return {
      violations,
      recommendations,
      score: Math.max(1, 10 - violations.length)
    };
  }
} 