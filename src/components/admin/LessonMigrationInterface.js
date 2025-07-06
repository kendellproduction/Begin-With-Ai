import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayIcon,
  XMarkIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  ClockIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { localLessonsData } from '../../data/lessonsData';
import { adaptiveLessons } from '../../utils/adaptiveLessonData';
import LessonFormatMigrator from '../../utils/lessonFormatMigration';
import MigrationValidator from '../../utils/migrationValidation';
import { logger } from '../../utils/logger';

const LessonMigrationInterface = () => {
  const [allLessons, setAllLessons] = useState([]);
  const [migrationStats, setMigrationStats] = useState(null);
  const [migrationResults, setMigrationResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [selectedLessons, setSelectedLessons] = useState(new Set());
  const [expandedLesson, setExpandedLesson] = useState(null);

  useEffect(() => {
    analyzeLessons();
  }, []);

  const analyzeLessons = async () => {
    setIsAnalyzing(true);
    try {
      const lessons = [];
      
      // Collect all lessons from different sources
      if (localLessonsData && typeof localLessonsData === 'object') {
        Object.values(localLessonsData).forEach(lesson => {
          if (lesson && lesson.id) {
            lessons.push({
              ...lesson,
              source: 'local'
            });
          }
        });
      }

      if (adaptiveLessons && typeof adaptiveLessons === 'object') {
        Object.values(adaptiveLessons).forEach(lessonGroup => {
          if (Array.isArray(lessonGroup)) {
            lessonGroup.forEach(lesson => {
              if (lesson && lesson.id) {
                lessons.push({
                  ...lesson,
                  source: 'adaptive'
                });
              }
            });
          }
        });
      }

      // Analyze each lesson
      const analyzedLessons = lessons.map(lesson => {
        const format = LessonFormatMigrator.detectLessonFormat(lesson);
        const needsMigration = format !== 'admin_format';
        
        return {
          ...lesson,
          format,
          needsMigration,
          status: needsMigration ? 'needs_migration' : 'up_to_date'
        };
      });

      // Get migration statistics
      const stats = LessonFormatMigrator.getMigrationStats(lessons);
      
      setAllLessons(analyzedLessons);
      setMigrationStats(stats);
      
      // Auto-select lessons that need migration
      const needsMigrationIds = analyzedLessons
        .filter(lesson => lesson.needsMigration)
        .map(lesson => lesson.id);
      setSelectedLessons(new Set(needsMigrationIds));
      
    } catch (error) {
      logger.error('Error analyzing lessons:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMigrateLessons = async (lessonIds = null) => {
    setIsMigrating(true);
    try {
      const lessonsToMigrate = lessonIds 
        ? allLessons.filter(lesson => lessonIds.includes(lesson.id))
        : allLessons.filter(lesson => selectedLessons.has(lesson.id));

      const results = LessonFormatMigrator.batchMigrateLessons(lessonsToMigrate);
      
      // Validate migrated lessons
      const validationResults = {};
      const originalLessons = {};
      
      lessonsToMigrate.forEach(lesson => {
        originalLessons[lesson.id] = lesson;
      });
      
      results.migrated.forEach(migratedLesson => {
        const originalLesson = originalLessons[migratedLesson.id];
        const validation = MigrationValidator.validateMigratedLesson(migratedLesson, originalLesson);
        validationResults[migratedLesson.id] = validation;
      });
      
      // Update lesson statuses with validation info
      const updatedLessons = allLessons.map(lesson => {
        const migrated = results.migrated.find(m => m.id === lesson.id);
        if (migrated) {
          const validation = validationResults[migrated.id];
          return {
            ...lesson,
            status: validation.isValid ? 'migrated' : 'migration_failed',
            needsMigration: false,
            format: 'admin_format',
            migratedLesson: migrated,
            validationResults: validation
          };
        }
        return lesson;
      });

      setAllLessons(updatedLessons);
      setMigrationResults({
        ...results,
        validationResults
      });
      
      // Update stats
      const newStats = LessonFormatMigrator.getMigrationStats(updatedLessons);
      setMigrationStats(newStats);
      
    } catch (error) {
      logger.error('Error migrating lessons:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSingleMigration = (lessonId) => {
    handleMigrateLessons([lessonId]);
  };

  const handleBulkMigration = () => {
    handleMigrateLessons();
  };

  const toggleLessonSelection = (lessonId) => {
    const newSelected = new Set(selectedLessons);
    if (newSelected.has(lessonId)) {
      newSelected.delete(lessonId);
    } else {
      newSelected.add(lessonId);
    }
    setSelectedLessons(newSelected);
  };

  const selectAllNeedingMigration = () => {
    const needsMigrationIds = allLessons
      .filter(lesson => lesson.needsMigration)
      .map(lesson => lesson.id);
    setSelectedLessons(new Set(needsMigrationIds));
  };

  const clearSelection = () => {
    setSelectedLessons(new Set());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'up_to_date':
        return 'text-green-400 bg-green-400/20';
      case 'needs_migration':
        return 'text-amber-400 bg-amber-400/20';
      case 'migrated':
        return 'text-blue-400 bg-blue-400/20';
      case 'migration_failed':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'up_to_date':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'needs_migration':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'migrated':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'migration_failed':
        return <XMarkIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const MigrationStatsCard = ({ stats }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Migration Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
          <div className="text-sm text-gray-400">Total Lessons</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400">{stats.needsMigration}</div>
          <div className="text-sm text-gray-400">Need Migration</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{stats.alreadyMigrated}</div>
          <div className="text-sm text-gray-400">Up to Date</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {Math.round((stats.alreadyMigrated / stats.total) * 100)}%
          </div>
          <div className="text-sm text-gray-400">Completion</div>
        </div>
      </div>
      
      {/* Format breakdown */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Format Breakdown</h4>
        <div className="space-y-1">
          {Object.entries(stats.byFormat).map(([format, count]) => (
            <div key={format} className="flex justify-between text-sm">
              <span className="text-gray-400 capitalize">{format.replace('_', ' ')}</span>
              <span className="text-gray-300">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const LessonMigrationCard = ({ lesson }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Selection checkbox */}
            <div className="flex items-center pt-1">
              <input
                type="checkbox"
                checked={selectedLessons.has(lesson.id)}
                onChange={() => toggleLessonSelection(lesson.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
            </div>
            
            {/* Lesson info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-white">{lesson.title}</h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                  {getStatusIcon(lesson.status)}
                  <span className="ml-1 capitalize">{lesson.status.replace('_', ' ')}</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                <span>Source: {lesson.source}</span>
                <span>Format: {lesson.format}</span>
                <span>ID: {lesson.id}</span>
              </div>
              
              <p className="text-sm text-gray-300 line-clamp-2">
                {lesson.description || lesson.coreConcept || 'No description available'}
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {expandedLesson === lesson.id ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
            
            {lesson.needsMigration && (
              <button
                onClick={() => handleSingleMigration(lesson.id)}
                disabled={isMigrating}
                className="flex items-center space-x-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
              >
                <WrenchScrewdriverIcon className="w-4 h-4" />
                <span>Migrate</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Expanded details */}
        {expandedLesson === lesson.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-1">Format Details</h5>
                <p className="text-sm text-gray-400">
                  Current format: <span className="font-mono">{lesson.format}</span>
                </p>
                {lesson.needsMigration && (
                  <p className="text-sm text-amber-400">
                    This lesson needs to be migrated to the new admin format for proper editing.
                  </p>
                )}
              </div>
              
              {lesson.migratedLesson && (
                <div>
                  <h5 className="text-sm font-medium text-gray-300 mb-1">Migration Results</h5>
                  <p className="text-sm text-green-400">
                    Successfully migrated with {lesson.migratedLesson.content?.length || 0} content blocks
                  </p>
                </div>
              )}
              
              {lesson.validationResults && (
                <div>
                  <h5 className="text-sm font-medium text-gray-300 mb-1">Validation Results</h5>
                  <div className="space-y-2">
                    <div className={`text-sm ${lesson.validationResults.isValid ? 'text-green-400' : 'text-red-400'}`}>
                      Status: {lesson.validationResults.isValid ? 'Valid' : 'Has Issues'}
                    </div>
                    
                    {lesson.validationResults.errors.length > 0 && (
                      <div>
                        <div className="text-xs text-red-400 font-medium">Errors:</div>
                        {lesson.validationResults.errors.slice(0, 3).map((error, index) => (
                          <div key={index} className="text-xs text-red-300">• {error}</div>
                        ))}
                        {lesson.validationResults.errors.length > 3 && (
                          <div className="text-xs text-red-400">+{lesson.validationResults.errors.length - 3} more errors</div>
                        )}
                      </div>
                    )}
                    
                    {lesson.validationResults.warnings.length > 0 && (
                      <div>
                        <div className="text-xs text-amber-400 font-medium">Warnings:</div>
                        {lesson.validationResults.warnings.slice(0, 2).map((warning, index) => (
                          <div key={index} className="text-xs text-amber-300">• {warning}</div>
                        ))}
                        {lesson.validationResults.warnings.length > 2 && (
                          <div className="text-xs text-amber-400">+{lesson.validationResults.warnings.length - 2} more warnings</div>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-400">
                      Content: {lesson.validationResults.details.textBlocks} text, {lesson.validationResults.details.quizBlocks} quiz, {lesson.validationResults.details.codeBlocks} code blocks
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Lesson Migration Center</h1>
          <p className="text-gray-400">Update lessons to the new admin format</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={analyzeLessons}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowRightIcon className="w-4 h-4" />
            <span>Refresh Analysis</span>
          </button>
        </div>
      </div>

      {/* Migration Stats */}
      {migrationStats && <MigrationStatsCard stats={migrationStats} />}

      {/* Migration Results */}
      {migrationResults && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Migration Results</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{migrationResults.migrated.length}</div>
              <div className="text-sm text-gray-400">Successfully Migrated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{migrationResults.alreadyMigrated.length}</div>
              <div className="text-sm text-gray-400">Already Up to Date</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{migrationResults.failed.length}</div>
              <div className="text-sm text-gray-400">Failed</div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Bulk Actions</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>{selectedLessons.size} lessons selected</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={selectAllNeedingMigration}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            Select All Needing Migration
          </button>
          
          <button
            onClick={clearSelection}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Clear Selection
          </button>
          
          <button
            onClick={handleBulkMigration}
            disabled={selectedLessons.size === 0 || isMigrating}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isMigrating ? 'Migrating...' : `Migrate Selected (${selectedLessons.size})`}
          </button>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          All Lessons ({allLessons.length})
        </h3>
        
        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">Analyzing lessons...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allLessons.map(lesson => (
              <LessonMigrationCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonMigrationInterface; 