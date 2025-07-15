// Lesson Format Migration Utility
// Converts old lesson formats to new admin-compatible format

import { logger } from './logger.js';

export class LessonFormatMigrator {
  
  /**
   * Create a properly formatted block for the lesson builder
   * @param {string} type - Block type
   * @param {Object} content - Block content
   * @returns {Object} - Formatted block
   */
  static createBlock(type, content) {
    const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: generateId(),
      type: type,
      content: content,
      styles: {
        marginTop: 16,
        marginBottom: 16,
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.1)'
      },
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }
    };
  }

  /**
   * Migrate a lesson from old format to new format
   * @param {Object} lesson - The lesson to migrate
   * @param {string} sourceFormat - The source format type
   * @returns {Object} - The migrated lesson
   */
  static migrateLesson(lesson, sourceFormat = 'auto') {
    try {
      // Auto-detect format if not specified
      if (sourceFormat === 'auto') {
        sourceFormat = this.detectLessonFormat(lesson);
      }
      
      logger.info(`Migrating lesson ${lesson.id} from format: ${sourceFormat}`);
      
      switch (sourceFormat) {
        case 'local_lessons':
          return this.migrateLocalLesson(lesson);
        case 'adaptive_lessons':
          return this.migrateAdaptiveLesson(lesson);
        case 'slides_format':
          return this.migrateSlidesLesson(lesson);
        case 'admin_format':
          return lesson; // Already in correct format
        default:
          return this.createBasicMigratedLesson(lesson);
      }
    } catch (error) {
      logger.error(`Error migrating lesson ${lesson.id}:`, error);
      return this.createBasicMigratedLesson(lesson);
    }
  }
  
  /**
   * Auto-detect the lesson format
   * @param {Object} lesson - The lesson to analyze
   * @returns {string} - The detected format
   */
  static detectLessonFormat(lesson) {
    // Check for admin format (has content array with proper structure)
    if (lesson.content && Array.isArray(lesson.content) && 
        lesson.content.length > 0 && 
        lesson.content[0].type && lesson.content[0].value !== undefined) {
      return 'admin_format';
    }
    
    // Check for slides format (has slides array) - improved detection
    if (lesson.slides && Array.isArray(lesson.slides) && lesson.slides.length > 0) {
      // Additional check for slide structure
      const firstSlide = lesson.slides[0];
      if (firstSlide && firstSlide.type && firstSlide.content) {
        return 'slides_format';
      }
    }
    
    // Check for adaptive lessons format
    if (lesson.coreConcept && lesson.content && lesson.content.free) {
      return 'adaptive_lessons';
    }
    
    // Check for local lessons format
    if (lesson.adaptedContent && (lesson.difficulty || lesson.category)) {
      return 'local_lessons';
    }
    
    // Special check for history lesson format
    if (lesson.id === 'history-of-ai' && lesson.slides && Array.isArray(lesson.slides)) {
      return 'slides_format';
    }
    
    return 'unknown';
  }
  
  /**
   * Migrate local lessons format to admin format
   * @param {Object} lesson - Local lesson
   * @returns {Object} - Migrated lesson
   */
  static migrateLocalLesson(lesson) {
    const contentBlocks = [];
    
    // Add title block
    contentBlocks.push(this.createBlock('heading', {
      text: lesson.title || 'Untitled Lesson',
      level: 1
    }));
    
    // Add description block
    if (lesson.description) {
      contentBlocks.push(this.createBlock('text', {
        text: lesson.description
      }));
    }
    
          // Add adapted content
      if (lesson.adaptedContent?.content) {
        const adaptedContent = lesson.adaptedContent.content;
        
        // Add introduction
        if (adaptedContent.introduction) {
          contentBlocks.push(this.createBlock('text', {
            text: adaptedContent.introduction
          }));
        }
        
        // Add key points
        if (adaptedContent.keyPoints && adaptedContent.keyPoints.length > 0) {
          contentBlocks.push(this.createBlock('text', {
            text: '**Key Points:**\n' + adaptedContent.keyPoints.map(point => `• ${point}`).join('\n')
          }));
        }
        
        // Add examples
        if (adaptedContent.examples && adaptedContent.examples.length > 0) {
          contentBlocks.push(this.createBlock('text', {
            text: '**Examples:**\n' + adaptedContent.examples.map(example => `• ${example}`).join('\n')
          }));
        }
      }
    
    // Add assessment questions
    if (lesson.adaptedContent?.assessment?.questions) {
      lesson.adaptedContent.assessment.questions.forEach(question => {
        contentBlocks.push(this.createBlock('quiz', {
          question: question.question,
          options: question.options.map(opt => (typeof opt === 'string' ? opt : opt.text)),
          correctAnswer: question.options.findIndex(opt => opt.correct || opt.isCorrect),
          explanation: question.explanation || 'Great job!'
        }));
      });
    }
    
    // Add sandbox if required
    if (lesson.sandbox?.required) {
      contentBlocks.push(this.createBlock('code-sandbox', {
        language: 'javascript',
        code: '// Write your code here',
        title: 'Code Exercise',
        instructions: lesson.adaptedContent?.sandbox?.instructions || 'Try out the concepts!'
      }));
    }
    
    return {
      id: lesson.id,
      title: lesson.title || 'Untitled Lesson',
      description: lesson.description || 'No description available',
      lessonType: 'concept_explanation',
      estimatedTimeMinutes: lesson.adaptedContent?.estimatedTime || 15,
      xpAward: lesson.adaptedContent?.xpReward || 100,
      difficulty: lesson.difficulty || 'Beginner',
      category: lesson.category || 'General',
      content: contentBlocks,
      learningObjectives: lesson.learningObjectives || [],
      tags: lesson.tags || [],
      // Add lesson builder compatible structure
      contentVersions: {
        free: {
          pages: [{
            id: `${lesson.id}-page-1`,
            title: 'Introduction',
            blocks: contentBlocks,
            created: new Date().toISOString()
          }]
        }
      },
      migrationMetadata: {
        originalFormat: 'local_lessons',
        migratedAt: new Date().toISOString(),
        migrationVersion: '1.0'
      }
    };
  }
  
  /**
   * Migrate adaptive lessons format to admin format
   * @param {Object} lesson - Adaptive lesson
   * @returns {Object} - Migrated lesson
   */
  static migrateAdaptiveLesson(lesson) {
    const contentBlocks = [];
    
    // Add lesson title
    contentBlocks.push(this.createBlock('heading', {
      text: lesson.title || 'Untitled AI Lesson',
      level: 1
    }));
    
    // Add core concept as introduction
    if (lesson.coreConcept) {
      contentBlocks.push(this.createBlock('paragraph', {
        text: lesson.coreConcept
      }));
    }
    
    // Process content based on difficulty (use 'free' as default)
    const content = lesson.content?.free || lesson.content?.beginner || lesson.content;
    
    if (content) {
      // Add introduction
      if (content.introduction) {
        contentBlocks.push(this.createBlock('text', {
          text: content.introduction
        }));
      }
      
              // Add main content
        if (content.mainContent) {
          if (typeof content.mainContent === 'string') {
            contentBlocks.push(this.createBlock('text', {
              text: content.mainContent
            }));
          } else if (typeof content.mainContent === 'object') {
            Object.entries(content.mainContent).forEach(([key, value]) => {
              if (typeof value === 'string') {
                contentBlocks.push(this.createBlock('text', {
                  text: `**${key}:** ${value}`
                }));
              }
            });
          }
        }
      
      // Add key points
      if (content.keyPoints && content.keyPoints.length > 0) {
        contentBlocks.push(this.createBlock('text', {
          text: '**Key Points:**\n' + content.keyPoints.map(point => `• ${point}`).join('\n')
        }));
      }
      
      // Add examples
      if (content.examples && content.examples.length > 0) {
        contentBlocks.push(this.createBlock('text', {
          text: '**Examples:**\n' + content.examples.map(example => `• ${example}`).join('\n')
        }));
      }
    }
    
    // Add sandbox exercises
    if (lesson.sandbox) {
      const sandbox = lesson.sandbox.beginner || lesson.sandbox.intermediate || lesson.sandbox;
      if (sandbox?.scenarios) {
        sandbox.scenarios.forEach((scenario, index) => {
          contentBlocks.push(this.createBlock('code-sandbox', {
            language: 'javascript',
            code: scenario.code || '// Write your code here',
            title: 'Code Exercise',
            instructions: scenario.task || scenario.instructions || 'Practice exercise'
          }));
        });
      }
    }
    
    return {
      id: lesson.id,
      title: lesson.title || 'Untitled Lesson',
      description: lesson.coreConcept || 'AI lesson',
      lessonType: lesson.lessonType || 'concept_explanation',
      estimatedTimeMinutes: 25,
      xpAward: 150,
      difficulty: 'Beginner',
      category: 'AI Fundamentals',
      content: contentBlocks,
      learningObjectives: lesson.learningObjectives || [],
      tags: ['ai', 'fundamentals'],
      // Add lesson builder compatible structure
      contentVersions: {
        free: {
          pages: [{
            id: `${lesson.id}-page-1`,
            title: 'Introduction',
            blocks: contentBlocks,
            created: new Date().toISOString()
          }]
        }
      },
      migrationMetadata: {
        originalFormat: 'adaptive_lessons',
        migratedAt: new Date().toISOString(),
        migrationVersion: '1.0'
      }
    };
  }
  
  /**
   * Migrate slides format to admin format
   * @param {Object} lesson - Slides lesson
   * @returns {Object} - Migrated lesson
   */
  static migrateSlidesLesson(lesson) {
    const contentBlocks = [];
    
    // Add lesson title
    contentBlocks.push(this.createBlock('heading', {
      text: lesson.title || 'Untitled Lesson',
      level: 1
    }));
    
    // Add lesson description if available
    if (lesson.description) {
      contentBlocks.push(this.createBlock('text', {
        text: lesson.description
      }));
    }
    
    // Process slides and convert them to content blocks
    if (lesson.slides && Array.isArray(lesson.slides)) {
      lesson.slides.forEach((slide, index) => {
        switch (slide.type) {
          case 'concept':
          case 'intro':
            // Add section title if available
            if (slide.content.title) {
              contentBlocks.push(this.createBlock('heading', {
                text: slide.content.title,
                level: 2
              }));
            }
            
            // Add main content
            if (slide.content.explanation || slide.content.description) {
              contentBlocks.push(this.createBlock('text', {
                text: slide.content.explanation || slide.content.description
              }));
            }
            
            // Add key points as separate text block
            if (slide.content.keyPoints && slide.content.keyPoints.length > 0) {
              contentBlocks.push(this.createBlock('text', {
                text: '**Key Points:**\n' + slide.content.keyPoints.map(point => `• ${point}`).join('\n')
              }));
            }
            break;
            
          case 'quiz':
            // Handle quiz slides
            if (slide.content.question && slide.content.options) {
              const options = slide.content.options.map(opt => {
                if (typeof opt === 'string') return opt;
                return opt.text || opt;
              });
              
              const correctIndex = slide.content.options.findIndex(opt => opt.correct || opt.isCorrect);
              
              contentBlocks.push(this.createBlock('quiz', {
                question: slide.content.question,
                options: options,
                correctAnswer: correctIndex,
                explanation: slide.content.explanation || slide.content.correctFeedback || 'Great job!'
              }));
            }
            break;
            
          case 'progress_checkpoint':
            // Handle progress checkpoints as informational blocks
            contentBlocks.push(this.createBlock('text', {
              text: `**${slide.content.title}**\n\n${slide.content.message || ''}`
            }));
            break;
            
          case 'example':
            contentBlocks.push(this.createBlock('heading', {
              text: 'Example',
              level: 3
            }));
            contentBlocks.push(this.createBlock('text', {
              text: slide.content.example || slide.content.explanation || ''
            }));
            break;
            
          case 'sandbox':
            contentBlocks.push(this.createBlock('code-sandbox', {
              language: 'javascript',
              code: slide.content.code || '// Write your code here',
              title: 'Code Exercise',
              instructions: slide.content.instructions || 'Complete the exercise'
            }));
            break;
            
          case 'fill-blank':
            contentBlocks.push(this.createBlock('heading', {
              text: 'Fill in the Blanks',
              level: 3
            }));
            contentBlocks.push(this.createBlock('fill-blank', {
              text: slide.content.text || slide.content.sentence || '',
              title: 'Fill in the Blanks'
            }));
            break;
            
          default:
            // Handle any other slide types
            if (slide.content.title || slide.content.explanation) {
              if (slide.content.title) {
                contentBlocks.push(this.createBlock('heading', {
                  text: slide.content.title,
                  level: 3
                }));
              }
              if (slide.content.explanation || slide.content.description) {
                contentBlocks.push(this.createBlock('text', {
                  text: slide.content.explanation || slide.content.description
                }));
              }
            }
        }
      });
    }
    
    return {
      id: lesson.id,
      title: lesson.title || 'Untitled Lesson',
      description: lesson.description || 'Interactive lesson',
      lessonType: 'concept_explanation',
      estimatedTimeMinutes: lesson.estimatedTime || 20,
      xpAward: lesson.xpReward || 150,
      difficulty: lesson.difficulty || 'Beginner',
      category: 'AI Fundamentals',
      content: contentBlocks,
      learningObjectives: lesson.learningObjectives || [],
      tags: lesson.tags || [],
      // Add lesson builder compatible structure
      contentVersions: {
        free: {
          pages: [{
            id: `${lesson.id}-page-1`,
            title: 'Introduction',
            blocks: contentBlocks,
            created: new Date().toISOString()
          }]
        }
      },
      migrationMetadata: {
        originalFormat: 'slides_format',
        migratedAt: new Date().toISOString(),
        migrationVersion: '1.0'
      }
    };
  }
  
  /**
   * Create a basic migrated lesson for unknown formats
   * @param {Object} lesson - Unknown format lesson
   * @returns {Object} - Basic migrated lesson
   */
  static createBasicMigratedLesson(lesson) {
    const contentBlocks = [];
    
    // Add title
    contentBlocks.push(this.createBlock('heading', {
      text: lesson.title || 'Untitled Lesson',
      level: 1
    }));
    
    // Add description if available
    if (lesson.description) {
      contentBlocks.push(this.createBlock('paragraph', {
        text: lesson.description
      }));
    }
    
    // Add fallback content
    contentBlocks.push(this.createBlock('text', {
      text: 'This lesson is being migrated to the new format. Content will be available soon.'
    }));
    
    return {
      id: lesson.id,
      title: lesson.title || 'Untitled Lesson',
      description: lesson.description || 'Lesson content needs migration',
      lessonType: 'concept_explanation',
      estimatedTimeMinutes: 15,
      xpAward: 100,
      difficulty: lesson.difficulty || 'Beginner',
      category: lesson.category || 'General',
      content: contentBlocks,
      learningObjectives: lesson.learningObjectives || [],
      tags: lesson.tags || [],
      // Add lesson builder compatible structure
      contentVersions: {
        free: {
          pages: [{
            id: `${lesson.id}-page-1`,
            title: 'Introduction',
            blocks: contentBlocks,
            created: new Date().toISOString()
          }]
        }
      },
      migrationMetadata: {
        originalFormat: 'unknown',
        migratedAt: new Date().toISOString(),
        migrationVersion: '1.0',
        needsManualReview: true
      }
    };
  }
  
  /**
   * Batch migrate multiple lessons
   * @param {Array} lessons - Array of lessons to migrate
   * @returns {Array} - Array of migrated lessons
   */
  static batchMigrateLessons(lessons) {
    const results = {
      migrated: [],
      failed: [],
      alreadyMigrated: []
    };
    
    lessons.forEach(lesson => {
      try {
        const format = this.detectLessonFormat(lesson);
        
        if (format === 'admin_format') {
          results.alreadyMigrated.push(lesson);
        } else {
          const migrated = this.migrateLesson(lesson, format);
          results.migrated.push(migrated);
        }
      } catch (error) {
        logger.error(`Failed to migrate lesson ${lesson.id}:`, error);
        results.failed.push({
          lesson,
          error: error.message
        });
      }
    });
    
    return results;
  }
  
  /**
   * Validate a migrated lesson
   * @param {Object} lesson - The lesson to validate
   * @returns {Object} - Validation result
   */
  static validateMigratedLesson(lesson) {
    const issues = [];
    
    // Check required fields
    if (!lesson.id) issues.push('Missing lesson ID');
    if (!lesson.title) issues.push('Missing lesson title');
    if (!lesson.content || !Array.isArray(lesson.content)) issues.push('Missing or invalid content array');
    
    // Check content blocks
    if (lesson.content && Array.isArray(lesson.content)) {
      lesson.content.forEach((block, index) => {
        if (!block.type) issues.push(`Content block ${index} missing type`);
        if (block.type === 'quiz' && !block.question) issues.push(`Quiz block ${index} missing question`);
        if (block.type === 'text' && !block.value) issues.push(`Text block ${index} missing value`);
      });
    }
    
    return {
      isValid: issues.length === 0,
      issues: issues
    };
  }
  
  /**
   * Get migration statistics
   * @param {Array} lessons - Array of lessons to analyze
   * @returns {Object} - Migration statistics
   */
  static getMigrationStats(lessons) {
    const stats = {
      total: lessons.length,
      byFormat: {},
      needsMigration: 0,
      alreadyMigrated: 0
    };
    
    lessons.forEach(lesson => {
      const format = this.detectLessonFormat(lesson);
      
      if (!stats.byFormat[format]) {
        stats.byFormat[format] = 0;
      }
      stats.byFormat[format]++;
      
      if (format === 'admin_format') {
        stats.alreadyMigrated++;
      } else {
        stats.needsMigration++;
      }
    });
    
    return stats;
  }
}

export default LessonFormatMigrator; 