import { db } from '../firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

/**
 * Secure Sandbox API Service for AI Interactions
 * Handles user prompts with sanitization, rate limiting, and session isolation
 */
export class SandboxAPIService {
  
  // Rate limiting configuration
  static RATE_LIMITS = {
    promptsPerMinute: 10,
    promptsPerHour: 100,
    maxPromptLength: 2000,
    maxResponseLength: 4000
  };

  // Supported AI providers (configured via environment variables)
  static AI_PROVIDERS = {
    OPENAI: 'openai',
    ANTHROPIC: 'anthropic', 
    XAI: 'xai'
  };

  /**
   * Sanitize user input to prevent injection attacks
   */
  static sanitizePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Invalid prompt input');
    }

    // Remove potentially harmful patterns
    const sanitized = prompt
      .trim()
      .slice(0, this.RATE_LIMITS.maxPromptLength)
      // Remove script tags and similar
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove potential XSS vectors
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      // Remove potential prompt injection patterns
      .replace(/system:|assistant:|human:|user:/gi, '')
      .replace(/\[SYSTEM\]|\[ASSISTANT\]|\[HUMAN\]|\[USER\]/gi, '')
      // Remove potential API key patterns
      .replace(/sk-[a-zA-Z0-9]{48}/g, '[REDACTED]')
      .replace(/Bearer\s+[a-zA-Z0-9-_]+/gi, '[REDACTED]');

    if (sanitized.length === 0) {
      throw new Error('Prompt cannot be empty after sanitization');
    }

    return sanitized;
  }

  /**
   * Check rate limits for a user
   */
  static async checkRateLimit(userId, sessionId) {
    if (!userId || !sessionId) {
      throw new Error('User ID and session ID required for rate limiting');
    }

    try {
      const rateLimitRef = doc(db, 'sandboxRateLimits', userId);
      const rateLimitDoc = await getDoc(rateLimitRef);
      
      const now = Date.now();
      const oneMinuteAgo = now - 60 * 1000;
      const oneHourAgo = now - 60 * 60 * 1000;

      if (rateLimitDoc.exists()) {
        const data = rateLimitDoc.data();
        const recentPrompts = (data.prompts || []).filter(timestamp => timestamp > oneHourAgo);
        const recentMinutePrompts = recentPrompts.filter(timestamp => timestamp > oneMinuteAgo);

        if (recentMinutePrompts.length >= this.RATE_LIMITS.promptsPerMinute) {
          throw new Error(`Rate limit exceeded: ${this.RATE_LIMITS.promptsPerMinute} prompts per minute`);
        }

        if (recentPrompts.length >= this.RATE_LIMITS.promptsPerHour) {
          throw new Error(`Rate limit exceeded: ${this.RATE_LIMITS.promptsPerHour} prompts per hour`);
        }

        // Update with new prompt timestamp
        const updatedPrompts = [...recentPrompts, now];
        await updateDoc(rateLimitRef, {
          prompts: updatedPrompts,
          lastPromptAt: now,
          sessionId: sessionId // Track current session
        });
      } else {
        // First prompt for this user
        await updateDoc(rateLimitRef, {
          prompts: [now],
          lastPromptAt: now,
          sessionId: sessionId,
          userId: userId
        }, { merge: true });
      }

      return true;
    } catch (error) {
      logger.error('Rate limit check failed:', error);
      throw error;
    }
  }

  /**
   * Send prompt to AI provider with sandbox context
   */
  static async sendPromptToAI(prompt, context = {}) {
    const {
      provider = context.sandboxType === 'ai_game_generator' ? this.AI_PROVIDERS.OPENAI : this.AI_PROVIDERS.XAI,
      lessonId = 'unknown',
      sandboxType = 'general',
      userLevel = 'beginner'
    } = context;

    // Create system prompt based on sandbox context
    const systemPrompt = this.generateSystemPrompt(sandboxType, userLevel, lessonId);
    
    try {
      switch (provider) {
        case this.AI_PROVIDERS.XAI:
          return await this.sendToXAI(systemPrompt, prompt);
        case this.AI_PROVIDERS.OPENAI:
          return await this.sendToOpenAI(systemPrompt, prompt);
        case this.AI_PROVIDERS.ANTHROPIC:
          return await this.sendToAnthropic(systemPrompt, prompt);
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }
    } catch (error) {
      logger.error('AI API call failed:', error);
      throw new Error('AI service temporarily unavailable. Please try again.');
    }
  }

  /**
   * Generate appropriate system prompt for sandbox context
   */
  static generateSystemPrompt(sandboxType, userLevel, lessonId) {
    const basePrompt = `You are an AI learning assistant for BeginningWithAi. 
Current context: ${sandboxType} sandbox, ${userLevel} level, lesson: ${lessonId}.

Guidelines:
- Provide helpful, educational responses appropriate for ${userLevel} learners
- Keep responses under ${this.RATE_LIMITS.maxResponseLength} characters
- Focus on the lesson objectives
- Be encouraging and supportive
- Do not provide harmful, inappropriate, or off-topic content
- If asked about unrelated topics, gently redirect to the lesson content`;

    switch (sandboxType) {
      case 'prompt_builder':
        return `${basePrompt}
- Help users craft better prompts for AI models
- Explain prompt engineering techniques
- Provide specific, actionable feedback on their prompts`;

      case 'ai_tool_matcher':
        return `${basePrompt}
- Help users understand which AI tools are best for specific tasks
- Explain the strengths and limitations of different AI platforms
- Guide them toward the most suitable tool for their needs`;

      case 'creative_prompt_lab':
        return `${basePrompt}
- Assist with creative AI prompts for art, video, and voice generation
- Suggest improvements for visual and audio content creation
- Explain best practices for different creative AI tools`;

      case 'vocabulary_practice':
        return `${basePrompt}
- Help users understand AI terminology and concepts
- Provide clear, simple explanations of technical terms
- Use examples and analogies appropriate for their level`;

      case 'ai_game_generator':
        return `You are a game development AI. Create complete, playable HTML games based on user descriptions. Include all HTML, CSS, and JavaScript in a single file. Make games simple but engaging, using canvas or DOM elements. Include basic graphics using CSS or simple shapes. Add clear instructions and scoring. IMPORTANT: Only generate safe, educational game content. Do not include any external links, network requests, or potentially harmful code.

Guidelines:
- Create a complete HTML document with embedded CSS and JavaScript
- Use simple graphics (CSS shapes, emojis, or basic canvas drawing)
- Include player controls (arrow keys, mouse, spacebar, etc.)
- Add scoring or objectives to make it engaging
- Ensure the game works in a modern browser
- Keep the code educational and beginner-friendly
- No external dependencies or network requests
- Include brief instructions in the game`;

      default:
        return basePrompt;
    }
  }

  /**
   * Send request to xAI Grok API
   */
  static async sendToXAI(systemPrompt, userPrompt) {
    const apiKey = process.env.REACT_APP_XAI_API_KEY;
    if (!apiKey) {
      throw new Error('xAI API key not configured');
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: 'grok-beta',
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`xAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      response: data.choices[0]?.message?.content || 'No response generated',
      provider: 'xAI',
      model: 'grok-beta',
      usage: data.usage
    };
  }

  /**
   * Send request to OpenAI API (fallback)
   */
  static async sendToOpenAI(systemPrompt, userPrompt) {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      response: data.choices[0]?.message?.content || 'No response generated',
      provider: 'OpenAI',
      model: 'gpt-4o',
      usage: data.usage
    };
  }

  /**
   * Send request to Anthropic Claude API (fallback)
   */
  static async sendToAnthropic(systemPrompt, userPrompt) {
    const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      response: data.content[0]?.text || 'No response generated',
      provider: 'Anthropic',
      model: 'claude-3-haiku',
      usage: data.usage
    };
  }

  /**
   * Main method to handle sandbox AI interactions
   */
  static async processSandboxPrompt(userId, sessionId, prompt, context = {}) {
    try {
      // 1. Validate inputs
      if (!userId || !sessionId || !prompt) {
        throw new Error('User ID, session ID, and prompt are required');
      }

      // 2. Sanitize the prompt
      const sanitizedPrompt = this.sanitizePrompt(prompt);

      // 3. Check rate limits
      await this.checkRateLimit(userId, sessionId);

      // 4. Send to AI provider
      const aiResponse = await this.sendPromptToAI(sanitizedPrompt, context);

      // 5. Log the interaction (without storing the actual content)
      await this.logInteraction(userId, sessionId, context.lessonId);

      return {
        success: true,
        response: aiResponse.response,
        provider: aiResponse.provider,
        model: aiResponse.model,
        sessionId: sessionId,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Sandbox prompt processing failed:', error);
      return {
        success: false,
        error: error.message,
        sessionId: sessionId,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Log interaction for analytics (without storing content)
   */
  static async logInteraction(userId, sessionId, lessonId) {
    try {
      const logRef = doc(db, 'sandboxUsage', `${userId}_${Date.now()}`);
      await updateDoc(logRef, {
        userId,
        sessionId,
        lessonId,
        timestamp: new Date().toISOString(),
        // Note: We don't store the actual prompt or response for privacy
      }, { merge: true });

      // Update user's total usage count
      const userStatsRef = doc(db, 'users', userId);
      await updateDoc(userStatsRef, {
        sandboxPromptsUsed: increment(1),
        lastSandboxUsage: new Date().toISOString()
      }, { merge: true });

    } catch (error) {
      logger.error('Failed to log interaction:', error);
      // Don't throw error here - logging failures shouldn't break the main flow
    }
  }

  /**
   * Generate a unique session ID for sandbox isolation
   */
  static generateSessionId() {
    return `sandbox_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Clean up expired rate limit data
   */
  static async cleanupExpiredRateLimits() {
    // This would be called by a scheduled function
    // Implementation would query and clean old rate limit documents
    logger.info('Rate limit cleanup would run here');
  }
}

export default SandboxAPIService; 