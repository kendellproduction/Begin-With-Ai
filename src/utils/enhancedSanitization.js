import { sanitizeText, sanitizeHtml, sanitizeCode, checkRateLimit } from './sanitization';
import DOMPurify from 'dompurify';

/**
 * Enhanced Sanitization utilities for AI features
 * Additional safety measures beyond the base sanitization
 */

/**
 * Sanitize AI prompts with extra security measures
 * @param {string} prompt - User prompt to sanitize
 * @param {Object} options - Sanitization options
 * @returns {Object} Sanitization result
 */
export const sanitizeAIPrompt = (prompt, options = {}) => {
  if (typeof prompt !== 'string') {
    return { isValid: false, sanitized: '', error: 'Prompt must be a string' };
  }

  const maxLength = options.maxLength || 2000;
  if (prompt.length > maxLength) {
    return { 
      isValid: false, 
      sanitized: '', 
      error: `Prompt too long. Maximum ${maxLength} characters allowed.` 
    };
  }

  // Advanced threat patterns
  const dangerousPatterns = [
    // Prompt injection attempts
    /ignore\s+previous\s+instructions/gi,
    /forget\s+everything\s+above/gi,
    /system\s+prompt/gi,
    /pretend\s+to\s+be/gi,
    /act\s+as\s+if/gi,
    /role\s*:\s*system/gi,
    
    // Information extraction attempts
    /what\s+is\s+your\s+system\s+prompt/gi,
    /show\s+me\s+your\s+instructions/gi,
    /reveal\s+your\s+prompt/gi,
    /training\s+data/gi,
    
    // Jailbreak attempts
    /developer\s+mode/gi,
    /admin\s+mode/gi,
    /unrestricted/gi,
    /uncensored/gi,
    /bypass\s+safety/gi,
    
    // Code execution attempts
    /exec\s*\(/gi,
    /eval\s*\(/gi,
    /system\s*\(/gi,
    /subprocess/gi,
    /shell\s+command/gi,
    
    // Personal information requests
    /tell\s+me\s+about\s+user/gi,
    /user\s+data/gi,
    /personal\s+information/gi,
    /private\s+key/gi,
    /api\s+key/gi,
    
    // Harmful content generation
    /create\s+virus/gi,
    /hack\s+into/gi,
    /generate\s+malware/gi,
    /phishing/gi,
    /illegal\s+content/gi
  ];

  // Check for dangerous patterns
  for (const pattern of dangerousPatterns) {
    if (pattern.test(prompt)) {
      return {
        isValid: false,
        sanitized: '',
        error: 'Prompt contains potentially unsafe content that violates our safety guidelines.'
      };
    }
  }

  // Sanitize the prompt
  let sanitized = sanitizeText(prompt);

  // Additional cleaning
  sanitized = sanitized
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
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
    .replace(/\s{4,}/g, '   ') // Limit consecutive spaces
    .trim();

  // Check for empty result
  if (sanitized.length === 0) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Prompt is empty after sanitization.'
    };
  }

  return {
    isValid: true,
    sanitized,
    error: null
  };
};

/**
 * Sanitize AI responses before displaying to users
 * @param {string} response - AI response to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized response
 */
export const sanitizeAIResponse = (response, options = {}) => {
  if (typeof response !== 'string') return '';

  const allowedTags = options.allowedTags || ['b', 'i', 'em', 'strong', 'code', 'pre', 'ul', 'ol', 'li', 'p', 'br'];
  
  let sanitized = DOMPurify.sanitize(response, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: ['class'],
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe', 'meta', 'link'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style', 'href']
  });

  // Remove potentially sensitive information leakage
  const sensitivePatterns = [
    /api[_-]?key[s]?\s*[:=]\s*['"]?[a-zA-Z0-9-_]{20,}['"]?/gi,
    /secret[s]?\s*[:=]\s*['"]?[a-zA-Z0-9-_]{20,}['"]?/gi,
    /token[s]?\s*[:=]\s*['"]?[a-zA-Z0-9-_]{20,}['"]?/gi,
    /password[s]?\s*[:=]\s*['"]?[^\s'"]{8,}['"]?/gi,
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi, // Email addresses
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/gi, // Phone numbers
    /\b\d{1,5}\s+[A-Za-z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)\b/gi // Addresses
  ];

  sensitivePatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  // Limit response length
  const maxLength = options.maxLength || 5000;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength) + '...';
  }

  return sanitized;
};

/**
 * Validate and sanitize user learning context
 * @param {Object} context - Learning context object
 * @returns {Object} Validation result
 */
export const sanitizeLearningContext = (context) => {
  if (!context || typeof context !== 'object') {
    return { isValid: false, sanitized: null, error: 'Context must be an object' };
  }

  const sanitized = {};
  
  // Sanitize each field with appropriate rules
  if (context.lessonId) {
    sanitized.lessonId = sanitizeText(context.lessonId).substring(0, 100);
  }
  
  if (context.userCode) {
    const codeResult = sanitizeUserCode(context.userCode);
    if (!codeResult.isValid) {
      return { isValid: false, sanitized: null, error: codeResult.error };
    }
    sanitized.userCode = codeResult.sanitized;
  }
  
  if (context.errorMessage) {
    sanitized.errorMessage = sanitizeText(context.errorMessage).substring(0, 500);
  }
  
  if (context.expectedOutput) {
    sanitized.expectedOutput = sanitizeText(context.expectedOutput).substring(0, 1000);
  }
  
  if (context.timeSpent) {
    sanitized.timeSpent = Math.min(Math.max(Number(context.timeSpent) || 0, 0), 86400); // Max 24 hours
  }
  
  if (context.attempts) {
    sanitized.attempts = Math.min(Math.max(Number(context.attempts) || 0, 0), 1000);
  }
  
  if (context.difficulty) {
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    sanitized.difficulty = validDifficulties.includes(context.difficulty) ? context.difficulty : 'intermediate';
  }

  return { isValid: true, sanitized, error: null };
};

/**
 * Enhanced code sanitization for AI processing
 * @param {string} code - User code to sanitize
 * @param {Object} options - Sanitization options
 * @returns {Object} Sanitization result
 */
export const sanitizeUserCode = (code, options = {}) => {
  if (typeof code !== 'string') {
    return { isValid: false, sanitized: '', error: 'Code must be a string' };
  }

  const maxLength = options.maxLength || 10000;
  if (code.length > maxLength) {
    return { 
      isValid: false, 
      sanitized: '', 
      error: `Code too long. Maximum ${maxLength} characters allowed.` 
    };
  }

  // Extremely dangerous patterns that should never be allowed
  const forbiddenPatterns = [
    // File system access
    /require\s*\(\s*['"]fs['"]|import.*from\s*['"]fs['"]/gi,
    /fs\.readFile|fs\.writeFile|fs\.unlink|fs\.rmdir/gi,
    
    // Process execution
    /require\s*\(\s*['"]child_process['"]|import.*from\s*['"]child_process['"]/gi,
    /exec\s*\(|spawn\s*\(|fork\s*\(/gi,
    
    // Network access
    /require\s*\(\s*['"]http['"]|require\s*\(\s*['"]https['"]|require\s*\(\s*['"]net['"]/gi,
    /fetch\s*\(|XMLHttpRequest|WebSocket/gi,
    
    // System access
    /process\.exit|process\.kill|process\.env/gi,
    /require\s*\(\s*['"]os['"]|require\s*\(\s*['"]path['"]/gi,
    
    // Dynamic code execution
    /eval\s*\(|Function\s*\(|setTimeout\s*\(.*string|setInterval\s*\(.*string/gi,
    /new\s+Function|vm\.runInThisContext|vm\.runInNewContext/gi,
    
    // Browser APIs that could be dangerous
    /localStorage|sessionStorage|indexedDB/gi,
    /navigator\.|location\.|window\.|document\./gi,
    
    // Prototype pollution
    /__proto__|constructor\.prototype|Object\.prototype/gi
  ];

  // Check for forbidden patterns
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(code)) {
      return {
        isValid: false,
        sanitized: '',
        error: 'Code contains forbidden operations that are not allowed in the learning environment.'
      };
    }
  }

  // Use base sanitization
  let sanitized = sanitizeCode(code, options.language || 'javascript');

  // Additional cleaning specific to AI processing
  sanitized = sanitized
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/console\.log\s*\([^)]*\)\s*;?/gi, '') // Remove console.log statements
    .replace(/debugger\s*;?/gi, '') // Remove debugger statements
    .trim();

  if (sanitized.length === 0) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Code is empty after sanitization.'
    };
  }

  return { isValid: true, sanitized, error: null };
};

/**
 * Sanitize quiz content for AI generation
 * @param {Object} quizContent - Quiz content to sanitize
 * @returns {Object} Sanitization result
 */
export const sanitizeQuizContent = (quizContent) => {
  if (!quizContent || typeof quizContent !== 'object') {
    return { isValid: false, sanitized: null, error: 'Quiz content must be an object' };
  }

  const sanitized = {
    title: sanitizeText(quizContent.title || '').substring(0, 200),
    description: sanitizeText(quizContent.description || '').substring(0, 500),
    questions: []
  };

  if (quizContent.questions && Array.isArray(quizContent.questions)) {
    sanitized.questions = quizContent.questions.slice(0, 20).map((question, index) => {
      const sanitizedQuestion = {
        id: index + 1,
        type: ['multiple_choice', 'true_false', 'short_answer', 'code_completion'].includes(question.type) 
          ? question.type : 'multiple_choice',
        question: sanitizeText(question.question || '').substring(0, 500),
        points: Math.min(Math.max(Number(question.points) || 1, 1), 10)
      };

      if (question.options && Array.isArray(question.options)) {
        sanitizedQuestion.options = question.options
          .slice(0, 6)
          .map(option => sanitizeText(option).substring(0, 200));
      }

      if (question.correctAnswer !== undefined) {
        sanitizedQuestion.correctAnswer = sanitizeText(String(question.correctAnswer)).substring(0, 200);
      }

      if (question.explanation) {
        sanitizedQuestion.explanation = sanitizeText(question.explanation).substring(0, 300);
      }

      return sanitizedQuestion;
    });
  }

  return { isValid: true, sanitized, error: null };
};

/**
 * Advanced rate limiting with user behavior analysis
 * @param {string} identifier - User/IP identifier
 * @param {string} action - Action being performed
 * @param {Object} options - Rate limiting options
 * @returns {Object} Rate limit result
 */
export const advancedRateLimit = (identifier, action, options = {}) => {
  const baseResult = checkRateLimit(identifier, options.maxRequests, options.windowMs);
  
  if (!baseResult.allowed) {
    return {
      ...baseResult,
      reason: 'rate_limit_exceeded',
      severity: 'medium'
    };
  }

  // Additional checks for suspicious behavior
  const suspiciousBehavior = detectSuspiciousBehavior(identifier, action);
  
  if (suspiciousBehavior.detected) {
    return {
      allowed: false,
      reason: suspiciousBehavior.reason,
      severity: suspiciousBehavior.severity,
      resetTime: Date.now() + (suspiciousBehavior.penaltyMinutes * 60000)
    };
  }

  return baseResult;
};

/**
 * Detect suspicious user behavior patterns
 * @param {string} identifier - User identifier
 * @param {string} action - Action being performed
 * @returns {Object} Suspicion analysis
 */
const detectSuspiciousBehavior = (identifier, action) => {
  // This would integrate with a more sophisticated behavior analysis system
  // For now, return basic analysis
  
  const behaviorHistory = getBehaviorHistory(identifier);
  
  // Check for rapid-fire requests
  const recentRequests = behaviorHistory.filter(
    entry => Date.now() - entry.timestamp < 60000 // Last minute
  );
  
  if (recentRequests.length > 10) {
    return {
      detected: true,
      reason: 'rapid_fire_requests',
      severity: 'high',
      penaltyMinutes: 15
    };
  }

  // Check for repeated identical requests
  const identicalRequests = behaviorHistory.filter(
    entry => entry.action === action && Date.now() - entry.timestamp < 300000 // Last 5 minutes
  );
  
  if (identicalRequests.length > 5) {
    return {
      detected: true,
      reason: 'repeated_identical_requests',
      severity: 'medium',
      penaltyMinutes: 5
    };
  }

  return { detected: false };
};

/**
 * Get behavior history for user (mock implementation)
 * @param {string} identifier - User identifier
 * @returns {Array} Behavior history
 */
const getBehaviorHistory = (identifier) => {
  // In a real implementation, this would fetch from a database or cache
  // For now, return mock data
  return [
    { timestamp: Date.now() - 30000, action: 'code_feedback' },
    { timestamp: Date.now() - 60000, action: 'smart_hint' },
    { timestamp: Date.now() - 90000, action: 'quiz_generation' }
  ];
};

/**
 * Content moderation for user-generated content
 * @param {string} content - Content to moderate
 * @param {Object} options - Moderation options
 * @returns {Object} Moderation result
 */
export const moderateContent = (content, options = {}) => {
  if (typeof content !== 'string') {
    return { approved: false, reason: 'Invalid content type' };
  }

  // Check for inappropriate content
  const inappropriatePatterns = [
    // Profanity (basic patterns - in production, use a comprehensive filter)
    /\b(damn|hell|crap)\b/gi,
    
    // Harassment patterns
    /you\s+are\s+(stupid|dumb|idiot)/gi,
    /shut\s+up/gi,
    
    // Spam patterns
    /buy\s+now|click\s+here|limited\s+time/gi,
    /www\.|http[s]?:\/\//gi,
    
    // Off-topic content
    /politics|religion|controversial/gi
  ];

  for (const pattern of inappropriatePatterns) {
    if (pattern.test(content)) {
      return {
        approved: false,
        reason: 'Content contains inappropriate material',
        pattern: pattern.toString()
      };
    }
  }

  // Check content length
  if (content.length > (options.maxLength || 2000)) {
    return {
      approved: false,
      reason: 'Content exceeds maximum length'
    };
  }

  return { approved: true, reason: null };
};

/**
 * Sanitize learning path data
 * @param {Object} pathData - Learning path data
 * @returns {Object} Sanitization result
 */
export const sanitizeLearningPath = (pathData) => {
  if (!pathData || typeof pathData !== 'object') {
    return { isValid: false, sanitized: null, error: 'Path data must be an object' };
  }

  const sanitized = {
    title: sanitizeText(pathData.title || '').substring(0, 200),
    description: sanitizeText(pathData.description || '').substring(0, 500),
    estimatedDuration: sanitizeText(pathData.estimatedDuration || '').substring(0, 50),
    lessons: [],
    milestones: []
  };

  // Sanitize lessons
  if (pathData.lessons && Array.isArray(pathData.lessons)) {
    sanitized.lessons = pathData.lessons.slice(0, 50).map((lesson, index) => ({
      id: sanitizeText(lesson.id || `lesson_${index + 1}`).substring(0, 100),
      title: sanitizeText(lesson.title || '').substring(0, 200),
      position: Math.min(Math.max(Number(lesson.position) || index + 1, 1), 1000),
      difficulty: ['beginner', 'intermediate', 'advanced'].includes(lesson.difficulty) 
        ? lesson.difficulty : 'intermediate',
      duration: Math.min(Math.max(Number(lesson.duration) || 30, 5), 300),
      prerequisites: Array.isArray(lesson.prerequisites) 
        ? lesson.prerequisites.slice(0, 10).map(p => sanitizeText(p).substring(0, 100))
        : [],
      topics: Array.isArray(lesson.topics)
        ? lesson.topics.slice(0, 5).map(t => sanitizeText(t).substring(0, 50))
        : [],
      reasoning: sanitizeText(lesson.reasoning || '').substring(0, 300)
    }));
  }

  // Sanitize milestones
  if (pathData.milestones && Array.isArray(pathData.milestones)) {
    sanitized.milestones = pathData.milestones.slice(0, 20).map(milestone => ({
      position: Math.min(Math.max(Number(milestone.position) || 1, 1), 1000),
      title: sanitizeText(milestone.title || '').substring(0, 200),
      description: sanitizeText(milestone.description || '').substring(0, 300)
    }));
  }

  return { isValid: true, sanitized, error: null };
};

export default {
  sanitizeAIPrompt,
  sanitizeAIResponse,
  sanitizeLearningContext,
  sanitizeUserCode,
  sanitizeQuizContent,
  advancedRateLimit,
  moderateContent,
  sanitizeLearningPath
}; 