// Migration Validation Utility
// Tests migrated lessons to ensure they work correctly

import { logger } from './logger.js';
import { LessonFormatMigrator } from './lessonFormatMigration.js';

export class MigrationValidator {
  
  /**
   * Validate that a migrated lesson meets all requirements
   * @param {Object} migratedLesson - The migrated lesson to validate
   * @param {Object} originalLesson - The original lesson before migration
   * @returns {Object} - Validation results
   */
  static validateMigratedLesson(migratedLesson, originalLesson) {
    const results = {
      isValid: true,
      errors: [],
      warnings: [],
      details: {
        contentBlocks: 0,
        quizBlocks: 0,
        textBlocks: 0,
        codeBlocks: 0,
        hasMetadata: false,
        estimatedTime: 0
      }
    };

    try {
      // Validate basic structure
      this.validateBasicStructure(migratedLesson, results);
      
      // Validate content blocks
      this.validateContentBlocks(migratedLesson, results);
      
      // Validate metadata
      this.validateMetadata(migratedLesson, results);
      
      // Cross-validate with original
      this.crossValidateWithOriginal(migratedLesson, originalLesson, results);
      
      // Check admin panel compatibility
      this.validateAdminCompatibility(migratedLesson, results);
      
    } catch (error) {
      results.isValid = false;
      results.errors.push(`Validation error: ${error.message}`);
      logger.error('Migration validation failed:', error);
    }

    return results;
  }
  
  /**
   * Validate basic lesson structure
   */
  static validateBasicStructure(lesson, results) {
    // Required fields
    const requiredFields = ['id', 'title', 'content'];
    
    requiredFields.forEach(field => {
      if (!lesson[field]) {
        results.isValid = false;
        results.errors.push(`Missing required field: ${field}`);
      }
    });
    
    // Content should be an array
    if (lesson.content && !Array.isArray(lesson.content)) {
      results.isValid = false;
      results.errors.push('Content must be an array');
    }
    
    // ID should be valid
    if (lesson.id && typeof lesson.id !== 'string') {
      results.isValid = false;
      results.errors.push('Lesson ID must be a string');
    }
    
    // Title should be meaningful
    if (lesson.title && lesson.title.length < 3) {
      results.warnings.push('Title is very short - consider making it more descriptive');
    }
  }
  
  /**
   * Validate content blocks structure and content
   */
  static validateContentBlocks(lesson, results) {
    if (!lesson.content || !Array.isArray(lesson.content)) {
      return;
    }
    
    results.details.contentBlocks = lesson.content.length;
    
    if (lesson.content.length === 0) {
      results.warnings.push('No content blocks found - lesson may be empty');
      return;
    }
    
    lesson.content.forEach((block, index) => {
      // Validate block structure
      if (!block.type) {
        results.isValid = false;
        results.errors.push(`Content block ${index} missing type`);
        return;
      }
      
      // Count block types
      switch (block.type) {
        case 'quiz':
          results.details.quizBlocks++;
          this.validateQuizBlock(block, index, results);
          break;
        case 'text':
          results.details.textBlocks++;
          this.validateTextBlock(block, index, results);
          break;
        case 'code_challenge':
          results.details.codeBlocks++;
          this.validateCodeBlock(block, index, results);
          break;
        default:
          // Unknown block type - warn but don't fail
          results.warnings.push(`Unknown block type '${block.type}' at index ${index}`);
      }
      
      // Validate common block properties
      if (block.type !== 'quiz' && !block.value) {
        results.warnings.push(`Block ${index} (${block.type}) has no value`);
      }
    });
    
    // Content quality checks
    if (results.details.textBlocks === 0) {
      results.warnings.push('No text blocks found - lesson may lack instructional content');
    }
    
    if (results.details.contentBlocks > 20) {
      results.warnings.push('Lesson has many content blocks - consider breaking into multiple lessons');
    }
  }
  
  /**
   * Validate quiz block structure
   */
  static validateQuizBlock(block, index, results) {
    if (!block.question) {
      results.isValid = false;
      results.errors.push(`Quiz block ${index} missing question`);
    }
    
    if (!block.options || !Array.isArray(block.options)) {
      results.isValid = false;
      results.errors.push(`Quiz block ${index} missing or invalid options`);
      return;
    }
    
    if (block.options.length < 2) {
      results.isValid = false;
      results.errors.push(`Quiz block ${index} needs at least 2 options`);
    }
    
    // Check for correct answer marking
    const correctOptions = block.options.filter(opt => 
      (typeof opt === 'object' && opt.correct) || opt.correct === true
    );
    
    if (correctOptions.length === 0) {
      results.warnings.push(`Quiz block ${index} has no correct answer marked`);
    }
    
    if (correctOptions.length > 1) {
      results.warnings.push(`Quiz block ${index} has multiple correct answers - ensure this is intentional`);
    }
  }
  
  /**
   * Validate text block content
   */
  static validateTextBlock(block, index, results) {
    if (!block.value || typeof block.value !== 'string') {
      results.warnings.push(`Text block ${index} has no text content`);
      return;
    }
    
    if (block.value.length < 10) {
      results.warnings.push(`Text block ${index} has very short content`);
    }
    
    if (block.value.length > 2000) {
      results.warnings.push(`Text block ${index} has very long content - consider breaking it up`);
    }
  }
  
  /**
   * Validate code block structure
   */
  static validateCodeBlock(block, index, results) {
    if (!block.value) {
      results.warnings.push(`Code block ${index} has no instructions`);
    }
    
    if (!block.startingCode) {
      results.warnings.push(`Code block ${index} has no starting code`);
    }
  }
  
  /**
   * Validate lesson metadata
   */
  static validateMetadata(lesson, results) {
    const metadata = lesson.migrationMetadata;
    
    if (metadata) {
      results.details.hasMetadata = true;
      
      if (!metadata.originalFormat) {
        results.warnings.push('Migration metadata missing original format');
      }
      
      if (!metadata.migratedAt) {
        results.warnings.push('Migration metadata missing timestamp');
      }
    }
    
    // Validate other metadata
    if (lesson.estimatedTimeMinutes) {
      results.details.estimatedTime = lesson.estimatedTimeMinutes;
      
      if (lesson.estimatedTimeMinutes < 5) {
        results.warnings.push('Estimated time is very short');
      }
      
      if (lesson.estimatedTimeMinutes > 120) {
        results.warnings.push('Estimated time is very long - consider breaking into multiple lessons');
      }
    }
    
    if (!lesson.description) {
      results.warnings.push('No lesson description provided');
    }
    
    if (!lesson.learningObjectives || lesson.learningObjectives.length === 0) {
      results.warnings.push('No learning objectives defined');
    }
  }
  
  /**
   * Cross-validate migrated lesson with original
   */
  static crossValidateWithOriginal(migratedLesson, originalLesson, results) {
    if (!originalLesson) {
      results.warnings.push('Original lesson not provided for comparison');
      return;
    }
    
    // Check that key information was preserved
    if (originalLesson.title && migratedLesson.title !== originalLesson.title) {
      results.warnings.push('Lesson title changed during migration');
    }
    
    if (originalLesson.id && migratedLesson.id !== originalLesson.id) {
      results.errors.push('Lesson ID changed during migration - this will break references');
    }
    
    // Check content preservation based on original format
    const originalFormat = LessonFormatMigrator.detectLessonFormat(originalLesson);
    
    switch (originalFormat) {
      case 'local_lessons':
        this.validateLocalLessonMigration(migratedLesson, originalLesson, results);
        break;
      case 'adaptive_lessons':
        this.validateAdaptiveLessonMigration(migratedLesson, originalLesson, results);
        break;
      case 'slides_format':
        this.validateSlidesLessonMigration(migratedLesson, originalLesson, results);
        break;
    }
  }
  
  /**
   * Validate local lesson migration
   */
  static validateLocalLessonMigration(migrated, original, results) {
    // Check that key content was migrated
    if (original.adaptedContent?.content?.keyPoints) {
      const hasKeyPointsContent = migrated.content.some(block => 
        block.value && block.value.includes('Key Points:')
      );
      
      if (!hasKeyPointsContent) {
        results.warnings.push('Original key points may not have been migrated');
      }
    }
    
    if (original.adaptedContent?.assessment?.questions) {
      const quizCount = migrated.content.filter(block => block.type === 'quiz').length;
      const originalQuizCount = original.adaptedContent.assessment.questions.length;
      
      if (quizCount !== originalQuizCount) {
        results.warnings.push(`Quiz count mismatch: original had ${originalQuizCount}, migrated has ${quizCount}`);
      }
    }
  }
  
  /**
   * Validate adaptive lesson migration
   */
  static validateAdaptiveLessonMigration(migrated, original, results) {
    if (original.coreConcept) {
      const hasCoreConceptContent = migrated.content.some(block => 
        block.value && block.value.includes(original.coreConcept.substring(0, 50))
      );
      
      if (!hasCoreConceptContent) {
        results.warnings.push('Core concept may not have been preserved in migration');
      }
    }
  }
  
  /**
   * Validate slides lesson migration
   */
  static validateSlidesLessonMigration(migrated, original, results) {
    if (original.slides) {
      const originalSlideCount = original.slides.length;
      const migratedBlockCount = migrated.content.length;
      
      // Rough heuristic - should have similar amount of content
      if (migratedBlockCount < originalSlideCount * 0.5) {
        results.warnings.push('Migrated lesson may have lost content during slide conversion');
      }
    }
  }
  
  /**
   * Validate admin panel compatibility
   */
  static validateAdminCompatibility(lesson, results) {
    // Check that lesson can be loaded in admin panel
    if (!lesson.content || !Array.isArray(lesson.content)) {
      results.isValid = false;
      results.errors.push('Lesson not compatible with admin panel - content must be array');
      return;
    }
    
    // Check for admin-required fields
    const adminRequiredFields = ['lessonType', 'estimatedTimeMinutes', 'xpAward'];
    
    adminRequiredFields.forEach(field => {
      if (!lesson[field]) {
        results.warnings.push(`Missing admin field: ${field} (will use defaults)`);
      }
    });
    
    // Check content block compatibility
    lesson.content.forEach((block, index) => {
      if (!['text', 'quiz', 'code_challenge', 'ai_professor_tip', 'video', 'image'].includes(block.type)) {
        results.warnings.push(`Block ${index} type '${block.type}' may not be fully supported in admin panel`);
      }
    });
  }
  
  /**
   * Batch validate multiple lessons
   */
  static batchValidate(lessons, originalLessons = {}) {
    const results = {
      totalLessons: lessons.length,
      validLessons: 0,
      invalidLessons: 0,
      lessonsWithWarnings: 0,
      results: []
    };
    
    lessons.forEach(lesson => {
      const originalLesson = originalLessons[lesson.id];
      const validation = this.validateMigratedLesson(lesson, originalLesson);
      
      results.results.push({
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        validation
      });
      
      if (validation.isValid) {
        results.validLessons++;
      } else {
        results.invalidLessons++;
      }
      
      if (validation.warnings.length > 0) {
        results.lessonsWithWarnings++;
      }
    });
    
    return results;
  }
  
  /**
   * Generate a validation report
   */
  static generateValidationReport(validationResults) {
    const { results, totalLessons, validLessons, invalidLessons, lessonsWithWarnings } = validationResults;
    
    let report = `# Migration Validation Report\n\n`;
    report += `**Total Lessons:** ${totalLessons}\n`;
    report += `**Valid Lessons:** ${validLessons}\n`;
    report += `**Invalid Lessons:** ${invalidLessons}\n`;
    report += `**Lessons with Warnings:** ${lessonsWithWarnings}\n\n`;
    
    if (invalidLessons > 0) {
      report += `## Critical Issues\n\n`;
      results.filter(r => !r.validation.isValid).forEach(result => {
        report += `### ${result.lessonTitle} (${result.lessonId})\n`;
        result.validation.errors.forEach(error => {
          report += `- ❌ ${error}\n`;
        });
        report += `\n`;
      });
    }
    
    if (lessonsWithWarnings > 0) {
      report += `## Warnings\n\n`;
      results.filter(r => r.validation.warnings.length > 0).forEach(result => {
        report += `### ${result.lessonTitle} (${result.lessonId})\n`;
        result.validation.warnings.forEach(warning => {
          report += `- ⚠️ ${warning}\n`;
        });
        report += `\n`;
      });
    }
    
    return report;
  }
}

export default MigrationValidator; 