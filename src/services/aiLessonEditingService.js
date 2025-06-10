/**
 * AI-Powered Lesson Editing Service
 * Provides AI assistance for editing individual lesson pages, full lessons, and creating templates
 */

export class AILessonEditingService {
  
  /**
   * Enhance a single lesson page with AI assistance
   * @param {Object} currentPage - Current page content
   * @param {string} userInstructions - User's editing instructions
   * @param {Object} lessonContext - Context about the lesson for better AI understanding
   * @returns {Object} Enhanced page content
   */
  static async enhanceLessonPage(currentPage, userInstructions, lessonContext = {}) {
    try {
      const prompt = this.generatePageEditPrompt(currentPage, userInstructions, lessonContext);
      const aiResponse = await this.callAIService(prompt);
      const enhancedPage = this.parsePageEditResponse(aiResponse);
      
      return {
        success: true,
        enhancedPage,
        originalPage: currentPage
      };
    } catch (error) {
      console.error('Error enhancing lesson page:', error);
      return {
        success: false,
        error: error.message,
        fallbackPage: this.generateFallbackPageEdit(currentPage, userInstructions)
      };
    }
  }

  /**
   * Regenerate entire lesson with AI assistance
   * @param {Object} currentLesson - Current lesson data
   * @param {string} userInstructions - User's regeneration instructions
   * @param {Object} options - Regeneration options
   * @returns {Object} Regenerated lesson
   */
  static async regenerateFullLesson(currentLesson, userInstructions, options = {}) {
    try {
      const prompt = this.generateLessonRegenerationPrompt(currentLesson, userInstructions, options);
      const aiResponse = await this.callAIService(prompt);
      const regeneratedLesson = this.parseLessonRegenerationResponse(aiResponse);
      
      return {
        success: true,
        regeneratedLesson,
        originalLesson: currentLesson
      };
    } catch (error) {
      console.error('Error regenerating lesson:', error);
      return {
        success: false,
        error: error.message,
        fallbackLesson: this.generateFallbackLessonEdit(currentLesson, userInstructions)
      };
    }
  }

  /**
   * Create a new lesson from template with AI assistance
   * @param {string} templateType - Type of lesson template
   * @param {Object} userInputs - User's inputs for the template
   * @param {Object} options - Creation options
   * @returns {Object} New lesson based on template
   */
  static async createLessonFromTemplate(templateType, userInputs, options = {}) {
    try {
      const template = this.getLessonTemplate(templateType);
      const prompt = this.generateTemplateCreationPrompt(template, userInputs, options);
      const aiResponse = await this.callAIService(prompt);
      const newLesson = this.parseTemplateCreationResponse(aiResponse);
      
      return {
        success: true,
        newLesson,
        template
      };
    } catch (error) {
      console.error('Error creating lesson from template:', error);
      return {
        success: false,
        error: error.message,
        fallbackLesson: this.generateFallbackTemplateLesson(templateType, userInputs)
      };
    }
  }

  /**
   * Generate prompt for page editing
   */
  static generatePageEditPrompt(currentPage, userInstructions, lessonContext) {
    return `You are an expert instructional designer. Please enhance this lesson page based on the user's instructions.

CURRENT PAGE CONTENT:
Type: ${currentPage.type}
${currentPage.type === 'text' ? `Content: ${currentPage.value}` : 
  currentPage.type === 'quiz' ? `Question: ${currentPage.question}\nOptions: ${JSON.stringify(currentPage.options)}` :
  currentPage.type === 'code_challenge' ? `Challenge: ${currentPage.value}\nStarting Code: ${currentPage.startingCode}` :
  `Content: ${JSON.stringify(currentPage)}`}

LESSON CONTEXT:
Title: ${lessonContext.title || 'Unknown'}
Description: ${lessonContext.description || 'Unknown'}
Learning Objectives: ${lessonContext.learningObjectives?.join(', ') || 'None specified'}

USER INSTRUCTIONS:
${userInstructions}

Please return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "type": "${currentPage.type}",
  "value": "enhanced content here (for text/ai_professor_tip types)",
  "question": "enhanced question (for quiz type)",
  "options": [enhanced options array (for quiz type)],
  "feedback": "enhanced feedback (for quiz type)",
  "startingCode": "enhanced starting code (for code_challenge type)",
  "solution": "enhanced solution (for code_challenge type)",
  "hints": ["enhanced hints array (for code_challenge type)"],
  "url": "enhanced url (for image/video types)",
  "altText": "enhanced alt text (for image type)",
  "caption": "enhanced caption (for image type)",
  "title": "enhanced title (for video type)",
  "description": "enhanced description (for video type)",
  "enhancementSummary": "Brief summary of what was enhanced and why"
}`;
  }

  /**
   * Generate prompt for full lesson regeneration
   */
  static generateLessonRegenerationPrompt(currentLesson, userInstructions, options) {
    const contentSummary = currentLesson.content?.map((page, index) => 
      `Page ${index + 1} (${page.type}): ${page.value || page.question || 'Content'}`
    ).join('\n') || 'No content pages';

    return `You are an expert instructional designer. Please regenerate this lesson based on the user's instructions.

CURRENT LESSON:
Title: ${currentLesson.title}
Description: ${currentLesson.description || 'No description'}
Type: ${currentLesson.lessonType}
Estimated Time: ${currentLesson.estimatedTimeMinutes} minutes
XP Award: ${currentLesson.xpAward}
Learning Objectives: ${currentLesson.learningObjectives?.join(', ') || 'None'}

CURRENT CONTENT PAGES:
${contentSummary}

USER INSTRUCTIONS:
${userInstructions}

REGENERATION OPTIONS:
- Preserve structure: ${options.preserveStructure ? 'Yes' : 'No'}
- Enhancement level: ${options.enhancementLevel || 'moderate'}
- Target audience: ${options.targetAudience || 'intermediate learners'}
- Focus areas: ${options.focusAreas?.join(', ') || 'general improvement'}

Please return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "title": "enhanced lesson title",
  "description": "enhanced lesson description", 
  "lessonType": "${currentLesson.lessonType}",
  "estimatedTimeMinutes": ${currentLesson.estimatedTimeMinutes},
  "xpAward": ${currentLesson.xpAward},
  "learningObjectives": ["enhanced objective 1", "enhanced objective 2", "enhanced objective 3"],
  "content": [
    {
      "type": "text",
      "value": "enhanced content for page 1"
    },
    {
      "type": "ai_professor_tip", 
      "value": "helpful AI tip related to the content"
    },
    {
      "type": "quiz",
      "question": "assessment question",
      "options": [
        {"text": "option 1", "correct": false},
        {"text": "option 2", "correct": true},
        {"text": "option 3", "correct": false},
        {"text": "option 4", "correct": false}
      ],
      "feedback": "explanation of correct answer"
    }
  ],
  "regenerationSummary": "Summary of what was changed and improved"
}`;
  }

  /**
   * Generate prompt for template-based lesson creation
   */
  static generateTemplateCreationPrompt(template, userInputs, options) {
    return `You are an expert instructional designer. Please create a new lesson using this template and the user's inputs.

TEMPLATE TYPE: ${template.type}
TEMPLATE STRUCTURE: ${JSON.stringify(template.structure, null, 2)}

USER INPUTS:
${Object.entries(userInputs).map(([key, value]) => `${key}: ${value}`).join('\n')}

CREATION OPTIONS:
- Difficulty level: ${options.difficulty || 'intermediate'}
- Estimated time: ${options.estimatedTime || '15-20 minutes'}
- Include assessments: ${options.includeAssessments !== false ? 'Yes' : 'No'}
- Interactive elements: ${options.interactiveElements !== false ? 'Yes' : 'No'}

Please create a comprehensive lesson that fills in all the template blanks with engaging, educational content.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "title": "lesson title based on user inputs",
  "description": "engaging lesson description",
  "lessonType": "concept_explanation",
  "estimatedTimeMinutes": 20,
  "xpAward": 100,
  "learningObjectives": ["objective 1", "objective 2", "objective 3"],
  "content": [
    {
      "type": "text",
      "value": "comprehensive introduction content"
    },
    {
      "type": "ai_professor_tip",
      "value": "helpful expert tip"
    },
    {
      "type": "quiz",
      "question": "assessment question",
      "options": [
        {"text": "option 1", "correct": false},
        {"text": "correct option", "correct": true},
        {"text": "option 3", "correct": false},
        {"text": "option 4", "correct": false}
      ],
      "feedback": "detailed explanation"
    }
  ],
  "templateUsed": "${template.type}",
  "creationSummary": "Brief summary of the lesson created"
}`;
  }

  /**
   * Get available lesson templates
   */
  static getLessonTemplate(templateType) {
    const templates = {
      'concept_explanation': {
        type: 'concept_explanation',
        name: 'Concept Explanation',
        description: 'Explain a new concept with examples and practice',
        structure: {
          required_inputs: ['topic', 'key_concepts', 'target_audience'],
          optional_inputs: ['real_world_examples', 'common_misconceptions', 'related_topics'],
          content_flow: ['introduction', 'concept_explanation', 'examples', 'professor_tips', 'practice_quiz', 'summary']
        }
      },
      'step_by_step_tutorial': {
        type: 'step_by_step_tutorial',
        name: 'Step-by-Step Tutorial',
        description: 'Guide users through a process with clear steps',
        structure: {
          required_inputs: ['tutorial_topic', 'tools_needed', 'end_goal'],
          optional_inputs: ['prerequisites', 'troubleshooting_tips', 'advanced_techniques'],
          content_flow: ['introduction', 'prerequisites', 'step_by_step_guide', 'tips_and_tricks', 'troubleshooting', 'next_steps']
        }
      },
      'problem_solving': {
        type: 'problem_solving',
        name: 'Problem Solving',
        description: 'Present a problem and guide through solutions',
        structure: {
          required_inputs: ['problem_description', 'context', 'solution_approach'],
          optional_inputs: ['alternative_solutions', 'common_pitfalls', 'tools_and_resources'],
          content_flow: ['problem_presentation', 'analysis', 'solution_development', 'implementation', 'validation', 'reflection']
        }
      },
      'comparison_analysis': {
        type: 'comparison_analysis',
        name: 'Comparison & Analysis',
        description: 'Compare different options, tools, or approaches',
        structure: {
          required_inputs: ['comparison_topic', 'items_to_compare', 'comparison_criteria'],
          optional_inputs: ['use_cases', 'pros_and_cons', 'recommendations'],
          content_flow: ['introduction', 'overview_of_options', 'detailed_comparison', 'analysis', 'recommendations', 'decision_framework']
        }
      },
      'interactive_practice': {
        type: 'interactive_practice',
        name: 'Interactive Practice',
        description: 'Hands-on practice with immediate feedback',
        structure: {
          required_inputs: ['skill_to_practice', 'practice_exercises', 'success_criteria'],
          optional_inputs: ['common_mistakes', 'hints_and_tips', 'advanced_challenges'],
          content_flow: ['skill_introduction', 'guided_practice', 'independent_practice', 'challenges', 'feedback_and_reflection']
        }
      }
    };

    return templates[templateType] || templates['concept_explanation'];
  }

  /**
   * Get all available templates
   */
  static getAvailableTemplates() {
    return [
      { id: 'concept_explanation', name: 'Concept Explanation', description: 'Explain a new concept with examples and practice' },
      { id: 'step_by_step_tutorial', name: 'Step-by-Step Tutorial', description: 'Guide users through a process with clear steps' },
      { id: 'problem_solving', name: 'Problem Solving', description: 'Present a problem and guide through solutions' },
      { id: 'comparison_analysis', name: 'Comparison & Analysis', description: 'Compare different options, tools, or approaches' },
      { id: 'interactive_practice', name: 'Interactive Practice', description: 'Hands-on practice with immediate feedback' }
    ];
  }

  /**
   * Call AI service (reusing pattern from existing codebase)
   */
  static async callAIService(prompt) {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY || 
                   process.env.OPENAI_API_KEY || 
                   process.env.REACT_APP_OPENAI_KEY ||
                   process.env.OPENAI_KEY;
    
    if (apiKey && (apiKey.startsWith('sk-') || apiKey.startsWith('org-'))) {
      try {
        console.log('Using OpenAI API for lesson editing...');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
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
            max_tokens: 4000
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.warn('OpenAI API failed:', error.message);
        throw new Error(`AI service unavailable: ${error.message}`);
      }
    } else {
      throw new Error('OpenAI API key not configured. Please add REACT_APP_OPENAI_API_KEY to your environment variables.');
    }
  }

  /**
   * Parse AI response for page editing
   */
  static parsePageEditResponse(response) {
    try {
      // Remove any markdown formatting if present
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('AI returned invalid response format');
    }
  }

  /**
   * Parse AI response for lesson regeneration
   */
  static parseLessonRegenerationResponse(response) {
    try {
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('AI returned invalid response format');
    }
  }

  /**
   * Parse AI response for template creation
   */
  static parseTemplateCreationResponse(response) {
    try {
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('AI returned invalid response format');
    }
  }

  /**
   * Generate fallback page edit when AI is unavailable
   */
  static generateFallbackPageEdit(currentPage, userInstructions) {
    const fallbackPage = { ...currentPage };
    
    // Add a note about the fallback
    if (currentPage.type === 'text' || currentPage.type === 'ai_professor_tip') {
      fallbackPage.value = `${currentPage.value}\n\n[Note: AI enhancement requested: "${userInstructions}" - but AI service is currently unavailable. Please edit manually.]`;
    }
    
    fallbackPage.enhancementSummary = "AI service unavailable - manual editing required";
    return fallbackPage;
  }

  /**
   * Generate fallback lesson edit when AI is unavailable
   */
  static generateFallbackLessonEdit(currentLesson, userInstructions) {
    const fallbackLesson = { ...currentLesson };
    fallbackLesson.description = `${currentLesson.description}\n\n[Note: AI regeneration requested: "${userInstructions}" - but AI service is currently unavailable. Please edit manually.]`;
    fallbackLesson.regenerationSummary = "AI service unavailable - manual editing required";
    return fallbackLesson;
  }

  /**
   * Generate fallback template lesson when AI is unavailable
   */
  static generateFallbackTemplateLesson(templateType, userInputs) {
    const template = this.getLessonTemplate(templateType);
    
    return {
      title: userInputs.topic || userInputs.title || "New Lesson",
      description: "This lesson was created from a template. AI enhancement is currently unavailable.",
      lessonType: "concept_explanation",
      estimatedTimeMinutes: 20,
      xpAward: 100,
      learningObjectives: [
        "Understand the key concepts",
        "Apply the learning to real situations", 
        "Complete practice exercises"
      ],
      content: [
        {
          type: "text",
          value: `Welcome to this lesson about ${userInputs.topic || 'the topic'}. This content needs to be enhanced with AI assistance.`
        },
        {
          type: "ai_professor_tip",
          value: "AI service is currently unavailable. Please manually add helpful tips here."
        }
      ],
      templateUsed: templateType,
      creationSummary: "Template-based lesson created - AI enhancement unavailable"
    };
  }
} 