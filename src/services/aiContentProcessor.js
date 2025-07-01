/**
 * AI Content Processor Service
 * Handles processing of text content and files into structured lessons
 * Includes web search and research capabilities for current events
 */

export class AIContentProcessor {
  
  /**
   * Process text content with optional research enhancement
   */
  static async processTextContent(content, options = {}) {
    const {
      contentType = 'detailed',
      targetAudience = 'intermediate',
      enhancementLevel = 'moderate',
      enableResearch = false
    } = options;

    let processedContent = content;
    
    // If research is enabled and content seems incomplete/current
    if (enableResearch && this.needsResearch(content)) {
      try {
        const researchResults = await this.conductResearch(content);
        processedContent = this.combineContentWithResearch(content, researchResults);
      } catch (error) {
        console.warn('Research failed, proceeding with original content:', error);
      }
    }

    const prompt = this.generateLessonPrompt(processedContent, 'text', {
      contentType,
      targetAudience,
      enhancementLevel,
      hasResearch: enableResearch
    });

    try {
      const aiResponse = await this.callAIService(prompt);
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('Error processing text content:', error);
      throw new Error('Failed to process text content with AI');
    }
  }

  /**
   * Determine if content needs research (incomplete ideas, current events, etc.)
   */
  static needsResearch(content) {
    const researchIndicators = [
      /new.*google.*ai/i,
      /latest.*openai/i,
      /recently.*announced/i,
      /just.*released/i,
      /today.*launched/i,
      /current.*trends/i,
      /\b(2024|2025)\b/,
      /need more info/i,
      /find out about/i,
      /research.*topic/i,
      /incomplete/i,
      /outline.*idea/i
    ];

    return researchIndicators.some(pattern => pattern.test(content));
  }

  /**
   * Conduct web research on the topic
   */
  static async conductResearch(query) {
    const searchQueries = this.generateSearchQueries(query);
    const searchResults = [];

    // Check if any search APIs are available
    const hasGoogleAPI = process.env.REACT_APP_GOOGLE_SEARCH_API_KEY && process.env.REACT_APP_GOOGLE_SEARCH_ENGINE_ID;
    const hasBingAPI = process.env.REACT_APP_BING_SEARCH_API_KEY;
    
    if (!hasGoogleAPI && !hasBingAPI) {
      return [{
        title: 'Web Research Not Available',
        snippet: 'To enable automatic web research for current events, please configure Google Search API or Bing Search API in your environment variables. See API_SETUP_GUIDE.md for instructions.',
        url: '#',
        source: 'system'
      }];
    }

    for (const searchQuery of searchQueries) {
      try {
        const results = await this.webSearch(searchQuery);
        if (results && results.length > 0) {
          searchResults.push(...results);
        }
      } catch (error) {
        console.warn(`Search failed for query: ${searchQuery}`, error.message);
      }
    }

    if (searchResults.length === 0) {
      return [{
        title: 'No Search Results Found',
        snippet: 'Unable to find current information about this topic. The lesson will be generated based on the original content only.',
        url: '#',
        source: 'system'
      }];
    }

    return searchResults;
  }

  /**
   * Generate multiple search queries from the original content
   */
  static generateSearchQueries(content) {
    // Extract key terms and create focused searches
    const queries = [];
    
    // Main query
    queries.push(content.substring(0, 100));
    
    // Extract specific product/company mentions
    const products = content.match(/\b(Google|OpenAI|ChatGPT|Gemini|Claude|GPT-4|Bard)\b/gi) || [];
    products.forEach(product => {
      queries.push(`${product} latest news 2024`);
      queries.push(`${product} new features announcement`);
    });

    // Add current date context
    const currentYear = new Date().getFullYear();
    queries.push(`AI news ${currentYear}`);
    queries.push(`artificial intelligence latest developments ${currentYear}`);

    return queries.slice(0, 5); // Limit to 5 queries to avoid rate limits
  }

  /**
   * Perform web search using multiple providers
   */
  static async webSearch(query) {
    // Priority order: Try Google first, then fallback options
    const searchProviders = [
      () => this.googleSearch(query),
      () => this.bingSearch(query),
      () => this.duckDuckGoSearch(query)
    ];

    for (const searchProvider of searchProviders) {
      try {
        const results = await searchProvider();
        if (results && results.length > 0) {
          return results;
        }
      } catch (error) {
        console.warn('Search provider failed, trying next...', error);
      }
    }

    return [];
  }

  /**
   * Google Custom Search API
   */
  static async googleSearch(query) {
    const apiKey = process.env.REACT_APP_GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.REACT_APP_GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      throw new Error('Google Search API credentials not configured');
    }

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=5`
    );

    if (!response.ok) {
      throw new Error('Google Search API request failed');
    }

    const data = await response.json();
    
    return (data.items || []).map(item => ({
      title: item.title,
      snippet: item.snippet,
      url: item.link,
      source: 'google'
    }));
  }

  /**
   * Bing Search API
   */
  static async bingSearch(query) {
    const apiKey = process.env.REACT_APP_BING_SEARCH_API_KEY;
    
    if (!apiKey) {
      throw new Error('Bing Search API key not configured');
    }

    const response = await fetch(
      `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=5`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey
        }
      }
    );

    if (!response.ok) {
      throw new Error('Bing Search API request failed');
    }

    const data = await response.json();
    
    return (data.webPages?.value || []).map(item => ({
      title: item.name,
      snippet: item.snippet,
      url: item.url,
      source: 'bing'
    }));
  }

  /**
   * DuckDuckGo Search (free alternative, no API key required)
   */
  static async duckDuckGoSearch(query) {
    // Note: This would require a proxy or server-side implementation
    // DuckDuckGo doesn't have a direct API for frontend use
    // You'd implement this on your backend
    throw new Error('DuckDuckGo search requires server-side implementation');
  }

  /**
   * Combine original content with research results
   */
  static combineContentWithResearch(originalContent, researchResults) {
    const researchSummary = researchResults
      .slice(0, 10) // Limit to top 10 results
      .map(result => `• ${result.title}: ${result.snippet}`)
      .join('\n');

    return `ORIGINAL TOPIC: ${originalContent}

RESEARCH FINDINGS:
${researchSummary}

SOURCES:
${researchResults.slice(0, 5).map(result => `- ${result.url}`).join('\n')}

Please create a comprehensive lesson incorporating both the original topic and the latest research findings above.`;
  }

  /**
   * Process uploaded file content into lessons
   */
  static async processFileContent(file, options = {}) {
    const {
      preserveStructure = true,
      targetAudience = 'intermediate',
      enhancementLevel = 'moderate'
    } = options;

    try {
      // Extract text from file
      const extractedText = await this.extractTextFromFile(file);
      
      // Process with AI
      const prompt = this.generateLessonPrompt(extractedText, 'file', {
        preserveStructure,
        targetAudience,
        enhancementLevel
      });

      const aiResponse = await this.callAIService(prompt);
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('Error processing file content:', error);
      throw new Error('Failed to process file content with AI');
    }
  }

  /**
   * Generate AI prompt based on content type and options
   */
  static generateLessonPrompt(content, type, options) {
    const basePrompt = `You are an expert instructional designer specializing in creating engaging, comprehensive lessons. Create a detailed lesson specifically about the topic provided by the user.`;
    
    let specificInstructions = '';
    
    if (options.enhancementLevel === 'minimal') {
      specificInstructions = `The content provided is already detailed. Preserve the existing structure and information while formatting it into clear lesson modules. Maintain all technical details and instructions exactly as provided. DO NOT add generic content - use the specific information provided.`;
    } else if (options.enhancementLevel === 'moderate') {
      specificInstructions = `Enhance the content by adding clearer explanations, practical examples, and better flow while preserving all important details. Add interactive exercises where appropriate. Focus specifically on the topic mentioned by the user.`;
    } else {
      specificInstructions = `Significantly expand and enhance the content about the specific topic provided. Add comprehensive explanations, multiple examples, step-by-step instructions, hands-on exercises, and assessment questions. Create a complete learning experience that thoroughly covers the user's requested topic.`;
    }

    const structureInstructions = type === 'file' && options.preserveStructure 
      ? 'Preserve the original document structure and hierarchy where possible.' 
      : 'Organize content into logical learning modules with clear progression.';

    // Extract key topic words for emphasis
    const topicWords = content.toLowerCase().match(/\b(cursor|openai|chatgpt|ai|programming|coding|javascript|python|react|git|github|development|software|web|mobile|machine learning|data science|analytics)\b/g) || [];
    const topicEmphasis = topicWords.length > 0 
      ? `\n\nIMPORTANT: This lesson must be specifically about: ${topicWords.join(', ')}. Include practical examples, current information, and actionable advice related to these topics.`
      : '';

    return `${basePrompt}

CRITICAL: The lesson must be specifically about the topic the user requested. Do not create generic content. Use the actual topic and details provided.

ENHANCEMENT LEVEL: ${specificInstructions}

TARGET AUDIENCE: ${options.targetAudience} level learners

STRUCTURE: ${structureInstructions}
${topicEmphasis}

USER'S TOPIC REQUEST:
${content}

REQUIRED OUTPUT FORMAT:
Return a JSON object with the following structure:
{
  "lessons": [
    {
      "id": "unique-lesson-id",
      "title": "Specific title about the user's topic (e.g., 'Mastering Cursor: Complete Guide' or 'Advanced React Hooks')",
      "description": "Brief description specifically about what the user requested",
      "learningObjectives": ["Specific objective 1", "Specific objective 2", "Specific objective 3"],
      "estimatedDuration": "15-20 minutes",
      "difficulty": "beginner|intermediate|advanced",
      "content": [
        {
          "type": "introduction",
          "title": "Introduction to [Specific Topic]",
          "content": "Specific introduction about the user's topic..."
        },
        {
          "type": "concept",
          "title": "Key [Topic] Concepts",
          "content": "Detailed explanation specifically about the user's topic...",
          "keyPoints": ["Specific point 1", "Specific point 2", "Specific point 3"]
        },
        {
          "type": "example",
          "title": "Practical [Topic] Examples",
          "content": "Real-world examples specific to the user's topic...",
          "code": "// Relevant code examples if applicable"
        },
        {
          "type": "exercise",
          "title": "Hands-on [Topic] Practice",
          "content": "Practice exercises specifically for the user's topic...",
          "tasks": ["Specific task 1", "Specific task 2"]
        },
        {
          "type": "assessment",
          "title": "[Topic] Knowledge Check",
          "questions": [
            {
              "question": "Specific question about the user's topic?",
              "options": ["Relevant option A", "Relevant option B", "Relevant option C", "Relevant option D"],
              "correct": "Correct answer related to the topic",
              "explanation": "Explanation specific to the user's topic"
            }
          ]
        }
      ],
      "tags": ["user-topic-related", "specific-keywords"],
      "category": "Relevant Category"
    }
  ]
}

REMEMBER: The lesson content must be specifically about what the user requested. Do not use placeholder or generic content. If the user asked about Cursor, make it a comprehensive Cursor lesson. If they asked about React, make it a detailed React lesson. Be specific and relevant to their actual request.`;
  }

  /**
   * Extract text from uploaded files
   */
  static async extractTextFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          if (file.type === 'text/plain') {
            resolve(e.target.result);
          } else if (file.type === 'application/pdf') {
            // For PDF files, you'd need a library like pdf-parse or pdfjs-dist
            // For now, provide a placeholder
            resolve(`[PDF Content] - ${file.name}\nExtracted text would go here...`);
          } else if (file.type.includes('word') || file.type.includes('document')) {
            // For Word docs, you'd need a library like mammoth.js
            resolve(`[Word Document] - ${file.name}\nExtracted text would go here...`);
          } else {
            resolve(`[${file.type}] - ${file.name}\nExtracted text would go here...`);
          }
        } catch (error) {
          reject(new Error('Failed to extract text from file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Call AI service (OpenAI, Claude, etc.)
   */
  static async callAIService(prompt) {
    // Check for OpenAI API key in common environment variable names
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY || 
                   process.env.OPENAI_API_KEY || 
                   process.env.REACT_APP_OPENAI_KEY ||
                   process.env.OPENAI_KEY;
    
    // Development-only API key validation
    if (process.env.NODE_ENV === 'development' && !apiKey) {
      console.warn('⚠️ OpenAI API key not found in any environment variable');
    }
    
    // If OpenAI API key is available, use real API
    if (apiKey && (apiKey.startsWith('sk-') || apiKey.startsWith('org-'))) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini', // Cost-effective model for lesson generation
            messages: [
              {
                role: 'system',
                content: 'You are an expert instructional designer specializing in creating engaging, comprehensive lessons. CRITICAL: Always respond with ONLY valid JSON - no markdown formatting, no code blocks, no additional text. Return pure JSON only in the exact format requested.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 3000
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.warn('OpenAI API failed, using fallback:', error.message);
        return this.generateFallbackResponse(prompt);
      }
          }
      // Note: Using fallback when API key is not available

    // Fallback mock response for development/when API key not available
    return this.generateFallbackResponse(prompt);
  }

  /**
   * Generate fallback response when AI API is not available
   */
  static generateFallbackResponse(prompt) {
    // Extract the original content from the prompt to make a better fallback
    const contentMatch = prompt.match(/CONTENT TO PROCESS:\s*([\s\S]*?)(?:\n\nReturn a structured JSON|$)/);
    const originalContent = contentMatch ? contentMatch[1].trim() : 'AI lesson content';
    
    // Create a more specific lesson based on the original content
    const isAboutCursor = /cursor/i.test(originalContent);
    const isAboutAI = /ai|artificial intelligence|openai|chatgpt/i.test(originalContent);
    
    let lessonTitle = "AI Generated Lesson";
    let lessonDescription = "This lesson was automatically generated from your content.";
    let contentSections = [];
    
    if (isAboutCursor) {
      lessonTitle = "Mastering Cursor: AI-Powered Code Editor";
      lessonDescription = "Learn how to use Cursor effectively and leverage its latest AI features to boost your coding productivity.";
      contentSections = [
        {
          type: "introduction",
          title: "Welcome to Cursor",
          content: "Cursor is a revolutionary AI-powered code editor that transforms how developers write, debug, and understand code. In this lesson, you'll discover how to harness its full potential."
        },
        {
          type: "concept",
          title: "Core Cursor Features",
          content: "Cursor combines the familiar VS Code interface with powerful AI capabilities. Key features include AI-powered code completion, natural language code generation, intelligent debugging assistance, and context-aware suggestions.",
          keyPoints: [
            "AI-powered autocomplete that understands your codebase",
            "Natural language to code conversion",
            "Intelligent refactoring suggestions",
            "Context-aware documentation generation",
            "Smart debugging and error resolution"
          ]
        },
        {
          type: "concept",
          title: "Recent Cursor Updates",
          content: "Cursor continuously evolves with new AI capabilities. Recent updates include improved context understanding, faster AI responses, better multi-language support, and enhanced collaboration features.",
          keyPoints: [
            "Enhanced GPT-4 integration for better code understanding",
            "Improved codebase indexing for faster searches",
            "Better support for large projects",
            "Enhanced AI chat for code discussions",
            "Improved diff view and merge conflict resolution"
          ]
        },
        {
          type: "exercise",
          title: "Getting the Most Out of Cursor",
          content: "To maximize Cursor's potential, follow these best practices and use these advanced techniques.",
          tasks: [
            "Set up your workspace with proper file organization",
            "Use Ctrl+K (Cmd+K) for AI-powered code generation",
            "Leverage the AI chat for complex coding questions",
            "Use @ symbols to reference specific files in AI conversations",
            "Enable copilot mode for real-time AI assistance"
          ]
        },
        {
          type: "assessment",
          title: "Cursor Knowledge Check",
          questions: [
            {
              question: "What makes Cursor different from traditional code editors?",
              options: [
                "It only works with Python",
                "It has AI-powered features built directly into the editor",
                "It's only available on Mac",
                "It requires internet connection"
              ],
              correct: "It has AI-powered features built directly into the editor",
              explanation: "Cursor integrates AI capabilities like GPT-4 directly into the coding experience, making it more than just a traditional editor."
            }
          ]
        }
      ];
    } else if (isAboutAI) {
      lessonTitle = "Understanding AI Technology";
      lessonDescription = "Explore the fundamentals and applications of artificial intelligence technology.";
      contentSections = [
        {
          type: "introduction",
          title: "Introduction to AI",
          content: "Artificial Intelligence is transforming how we work, learn, and interact with technology."
        },
        {
          type: "concept",
          title: "AI Fundamentals",
          content: "Learn the core concepts that power modern AI systems.",
          keyPoints: ["Machine Learning", "Neural Networks", "Natural Language Processing"]
        }
      ];
    } else {
      // Generic content based on user input
      const words = originalContent.split(' ').slice(0, 10).join(' ');
      lessonTitle = `Understanding: ${words}`;
      lessonDescription = `A comprehensive lesson based on: ${originalContent.substring(0, 150)}...`;
      contentSections = [
        {
          type: "introduction",
          title: "Introduction",
          content: `Let's explore the topic: ${originalContent.substring(0, 200)}...`
        },
        {
          type: "concept",
          title: "Key Concepts",
          content: "Based on your input, here are the main concepts we'll cover in this lesson.",
          keyPoints: ["Understanding the fundamentals", "Practical applications", "Best practices"]
        }
      ];
    }

    return JSON.stringify({
      lessons: [
        {
          id: `lesson-${Date.now()}`,
          title: lessonTitle,
          description: lessonDescription,
          learningObjectives: [
            "Understand the key concepts presented",
            "Apply knowledge through practical examples",
            "Demonstrate mastery through hands-on practice"
          ],
          estimatedDuration: "15-20 minutes",
          difficulty: "intermediate",
          content: contentSections.map(section => ({
            type: section.type === 'introduction' ? 'text' : 
                  section.type === 'concept' ? 'text' :
                  section.type === 'exercise' ? 'text' :
                  section.type === 'assessment' ? 'quiz' : 'text',
            value: section.content,
            title: section.title,
            keyPoints: section.keyPoints,
            tasks: section.tasks,
            questions: section.questions,
            question: section.questions && section.questions[0] ? section.questions[0].question : undefined,
            options: section.questions && section.questions[0] ? section.questions[0].options.map(opt => ({
              text: opt,
              correct: opt === section.questions[0].correct
            })) : undefined,
            feedback: section.questions && section.questions[0] ? section.questions[0].explanation : undefined
          })),
          tags: ["ai-generated", "auto-processed"],
          category: "General",
          isPublished: false,
          status: 'draft'
        }
      ]
    });
  }

  /**
   * Parse AI response and validate structure
   */
  static parseAIResponse(response) {
    try {
      // Remove markdown code blocks if present
      let cleanResponse = response.trim();
      
      // Handle markdown-wrapped JSON (```json ... ``` or ``` ... ```)
      const markdownMatch = cleanResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (markdownMatch) {
        cleanResponse = markdownMatch[1].trim();
      }
      
      // Remove any leading/trailing whitespace and normalize quotes
      cleanResponse = cleanResponse.trim();
      
      const parsed = JSON.parse(cleanResponse);
      
      // Validate required structure
      if (!parsed.lessons || !Array.isArray(parsed.lessons)) {
        throw new Error('Invalid AI response structure - missing lessons array');
      }

      // Add default values for missing fields
      parsed.lessons = parsed.lessons.map(lesson => ({
        id: lesson.id || `lesson-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: lesson.title || 'Untitled Lesson',
        description: lesson.description || 'AI generated lesson',
        estimatedDuration: lesson.estimatedDuration || '15 minutes',
        difficulty: lesson.difficulty || 'intermediate',
        content: lesson.content || [],
        tags: lesson.tags || ['ai-generated'],
        category: lesson.category || 'General',
        isPublished: false,
        status: 'draft',
        createdAt: new Date().toISOString(),
        ...lesson
      }));

      return parsed;
    } catch (error) {
      console.error('❌ Error parsing AI response:', error);
      console.error('📝 Raw response (first 500 chars):', response.substring(0, 500));
      throw new Error('Failed to parse AI response: ' + error.message);
    }
  }
}

export default AIContentProcessor; 