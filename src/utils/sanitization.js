import DOMPurify from 'dompurify';

/**
 * Sanitization utilities for user input to prevent XSS attacks
 * Following BeginningWithAi security guidelines
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - The potentially unsafe HTML string
 * @param {Object} options - DOMPurify configuration options
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHtml = (dirty, options = {}) => {
  if (typeof dirty !== 'string') return '';
  
  const defaultOptions = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  };
  
  return DOMPurify.sanitize(dirty, { ...defaultOptions, ...options });
};

/**
 * Sanitize plain text input (removes all HTML)
 * @param {string} input - The input string
 * @returns {string} - Plain text without HTML
 */
export const sanitizeText = (input) => {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

/**
 * Sanitize code input for lessons (more permissive but still safe)
 * @param {string} code - The code string
 * @param {string} language - The programming language
 * @returns {string} - Sanitized code
 */
export const sanitizeCode = (code, language = 'javascript') => {
  if (typeof code !== 'string') return '';
  
  // Remove potentially dangerous patterns while preserving code structure
  let sanitized = code
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/eval\s*\(/gi, 'EVAL_BLOCKED(') // Block eval
    .replace(/Function\s*\(/gi, 'FUNCTION_BLOCKED('); // Block Function constructor
  
  // Language-specific sanitization
  if (language === 'javascript') {
    sanitized = sanitized
      .replace(/document\s*\.\s*write/gi, 'DOCUMENT_WRITE_BLOCKED')
      .replace(/window\s*\.\s*location/gi, 'WINDOW_LOCATION_BLOCKED')
      .replace(/\.innerHTML\s*=/gi, '.INNER_HTML_BLOCKED=');
  }
  
  return sanitized;
};

/**
 * Sanitize forum post content
 * @param {string} content - The post content
 * @returns {string} - Sanitized content
 */
export const sanitizeForumPost = (content) => {
  if (typeof content !== 'string') return '';
  
  // Remove personal information patterns
  let sanitized = content
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REMOVED]') // Email
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REMOVED]') // Phone numbers
    .replace(/\b(?:\d{1,5}\s+)?[A-Za-z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)\b/gi, '[ADDRESS_REMOVED]'); // Addresses
  
  return sanitizeHtml(sanitized, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
};

/**
 * Validate and sanitize JSON input
 * @param {string} jsonString - The JSON string to validate
 * @returns {Object} - { isValid: boolean, data: any, error: string }
 */
export const sanitizeAndValidateJson = (jsonString) => {
  try {
    // Basic sanitization
    const sanitized = sanitizeText(jsonString);
    
    // Parse JSON
    const data = JSON.parse(sanitized);
    
    // Check for dangerous patterns in JSON
    const jsonStr = JSON.stringify(data);
    if (jsonStr.includes('__proto__') || jsonStr.includes('constructor') || jsonStr.includes('prototype')) {
      return { isValid: false, data: null, error: 'Potentially dangerous JSON structure detected' };
    }
    
    return { isValid: true, data, error: null };
  } catch (error) {
    return { isValid: false, data: null, error: error.message };
  }
};

/**
 * Rate limiting helper (simple in-memory implementation)
 * For production, use Redis or database-backed solution
 */
const rateLimitStore = new Map();

export const checkRateLimit = (identifier, maxRequests = 10, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, []);
  }
  
  const requests = rateLimitStore.get(identifier);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  
  if (validRequests.length >= maxRequests) {
    return { allowed: false, resetTime: windowStart + windowMs };
  }
  
  // Add current request
  validRequests.push(now);
  rateLimitStore.set(identifier, validRequests);
  
  return { allowed: true, remaining: maxRequests - validRequests.length };
}; 