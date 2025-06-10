import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiTrash2, 
  FiMove, 
  FiSave, 
  FiArrowUp, 
  FiArrowDown,
  FiEdit,
  FiType,
  FiImage,
  FiPlay,
  FiHelpCircle,
  FiCode,
  FiZap,
  FiRefreshCw,
  FiPlusSquare,
  FiClock,
  FiCheck
} from 'react-icons/fi';
import { AILessonEditingService } from '../../services/aiLessonEditingService';
import { 
  saveLessonDraft, 
  getLessonDraft, 
  generateDraftId,
  deleteLessonDraft 
} from '../../utils/localStorage';

const LessonEditor = ({ lesson, pathId, moduleId, onSave, isDraft = false, draftId = null }) => {
  const [editedLesson, setEditedLesson] = useState({
    title: '',
    lessonType: 'concept_explanation',
    estimatedTimeMinutes: 15,
    xpAward: 25,
    learningObjectives: [],
    keyPoints: [],
    summary: '',
    includeSandbox: false,
    sandboxType: 'none',
    content: [],
    difficultyLevels: {
      beginner: null,
      intermediate: null,
      advanced: null
    },
    primaryDifficulty: 'advanced',
    ...lesson
  });
  
  const [currentDraftId, setCurrentDraftId] = useState(draftId);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [isAddingContent, setIsAddingContent] = useState(false);
  
  // AI editing states
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [showAIPageEditor, setShowAIPageEditor] = useState(false);
  const [showAILessonRegenerator, setShowAILessonRegenerator] = useState(false);
  const [showAITemplateCreator, setShowAITemplateCreator] = useState(false);
  const [isGeneratingDifficulties, setIsGeneratingDifficulties] = useState(false);
  const [aiInstructions, setAiInstructions] = useState('');
  const [aiResult, setAiResult] = useState(null);

  // Auto-save function
  const autoSaveDraft = useCallback(async (lessonData) => {
    if (!pathId || !moduleId || !lessonData.title) return; // Don't save empty lessons
    
    try {
      setAutoSaveStatus('saving');
      
      let draftIdToUse = currentDraftId;
      if (!draftIdToUse) {
        draftIdToUse = generateDraftId();
        setCurrentDraftId(draftIdToUse);
      }
      
      saveLessonDraft(draftIdToUse, lessonData, pathId, moduleId);
      setLastSaved(new Date());
      setAutoSaveStatus('saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
    }
  }, [currentDraftId, pathId, moduleId]);

  // Debounced auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (editedLesson.title && (pathId && moduleId)) {
        autoSaveDraft(editedLesson);
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [editedLesson, autoSaveDraft, pathId, moduleId]);

  useEffect(() => {
    if (lesson) {
      // Ensure content is always an array and transform AI-generated content if needed
      let processedLesson = { ...lesson };
      
      // If content exists but is not array, try to convert it
      if (processedLesson.content && !Array.isArray(processedLesson.content)) {
        console.warn('Lesson content is not an array, attempting to convert:', processedLesson.content);
        
        // If it's an object with sections, convert them to content pages
        if (typeof processedLesson.content === 'object' && processedLesson.content.sections) {
          processedLesson.content = processedLesson.content.sections.map((section, index) => ({
            type: 'text',
            value: section.content || section.text || `Section ${index + 1}: ${section.title || 'Content'}`
          }));
        } else if (typeof processedLesson.content === 'string') {
          // If it's a string, create a single text content page
          processedLesson.content = [{
            type: 'text',
            value: processedLesson.content
          }];
        } else {
          // Default to empty array
          processedLesson.content = [];
        }
      }
      
      // Ensure content is an array
      if (!Array.isArray(processedLesson.content)) {
        processedLesson.content = [];
      }
      
      setEditedLesson(processedLesson);
    } else if (isDraft && draftId) {
      // Load draft if this is a draft lesson
      const draftData = getLessonDraft(draftId);
      if (draftData) {
        setEditedLesson(draftData.lessonData);
        setCurrentDraftId(draftId);
        setLastSaved(new Date(draftData.lastSaved));
      }
    } else if (!lesson && pathId && moduleId) {
      // This is a new lesson, generate a draft ID
      const newDraftId = generateDraftId();
      setCurrentDraftId(newDraftId);
    }
  }, [lesson, isDraft, draftId, pathId, moduleId]);

  const handleSave = () => {
    onSave(editedLesson, currentDraftId);
  };

  const handleDeleteDraft = () => {
    if (currentDraftId && window.confirm('Are you sure you want to delete this draft?')) {
      deleteLessonDraft(currentDraftId);
      if (typeof onSave === 'function') {
        onSave(null, currentDraftId, true); // Signal deletion
      }
    }
  };

  const addContentPage = (type) => {
    const newContent = createContentTemplate(type);
    const currentContent = editedLesson.content || [];
    const newContentArray = [...currentContent, newContent];
    setEditedLesson({ ...editedLesson, content: newContentArray });
    setActiveContentIndex(newContentArray.length - 1);
    setIsAddingContent(false);
  };

  const removeContentPage = (index) => {
    const currentContent = editedLesson.content || [];
    const newContent = currentContent.filter((_, i) => i !== index);
    setEditedLesson({ ...editedLesson, content: newContent });
    setActiveContentIndex(Math.max(0, Math.min(activeContentIndex, newContent.length - 1)));
  };

  const moveContentPage = (index, direction) => {
    const currentContent = editedLesson.content || [];
    const newContent = [...currentContent];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newContent.length) {
      [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
      setEditedLesson({ ...editedLesson, content: newContent });
      setActiveContentIndex(newIndex);
    }
  };

  const updateContentPage = (index, updates) => {
    const currentContent = editedLesson.content || [];
    const newContent = [...currentContent];
    newContent[index] = { ...newContent[index], ...updates };
    setEditedLesson({ ...editedLesson, content: newContent });
  };

  const addLearningObjective = () => {
    const newObjectives = [...editedLesson.learningObjectives, 'New learning objective'];
    setEditedLesson({ ...editedLesson, learningObjectives: newObjectives });
  };

  const updateLearningObjective = (index, value) => {
    const newObjectives = [...editedLesson.learningObjectives];
    newObjectives[index] = value;
    setEditedLesson({ ...editedLesson, learningObjectives: newObjectives });
  };

  const removeLearningObjective = (index) => {
    const newObjectives = editedLesson.learningObjectives.filter((_, i) => i !== index);
    setEditedLesson({ ...editedLesson, learningObjectives: newObjectives });
  };

  const createContentTemplate = (type) => {
    const templates = {
      text: {
        type: 'text',
        value: 'Enter your text content here...'
      },
      ai_professor_tip: {
        type: 'ai_professor_tip',
        value: 'Add a helpful tip or insight here...'
      },
      image: {
        type: 'image',
        url: '',
        altText: 'Image description',
        caption: ''
      },
      video: {
        type: 'video',
        url: '',
        title: 'Video Title',
        description: ''
      },
      quiz: {
        type: 'quiz',
        question: 'Your quiz question here?',
        options: [
          { text: 'Option 1', correct: false },
          { text: 'Option 2', correct: true },
          { text: 'Option 3', correct: false },
          { text: 'Option 4', correct: false }
        ],
        feedback: 'Explanation of the correct answer...'
      },
      code_challenge: {
        type: 'code_challenge',
        value: 'Describe the coding challenge here...',
        startingCode: '// Your starting code here',
        solution: '// Solution code here',
        hints: ['Hint 1', 'Hint 2']
      }
    };
    
    return templates[type] || templates.text;
  };

  // AI Enhancement Methods
  const handleAIPageEnhancement = async () => {
    if (!aiInstructions.trim()) {
      alert('Please provide instructions for AI enhancement');
      return;
    }

    setIsAIProcessing(true);
    try {
      const currentPage = editedLesson.content[activeContentIndex];
      const lessonContext = {
        title: editedLesson.title,
        description: editedLesson.description,
        learningObjectives: editedLesson.learningObjectives
      };

      const result = await AILessonEditingService.enhanceLessonPage(
        currentPage, 
        aiInstructions, 
        lessonContext
      );

      if (result.success) {
        updateContentPage(activeContentIndex, result.enhancedPage);
        setAiResult({
          type: 'page_enhancement',
          success: true,
          summary: result.enhancedPage.enhancementSummary
        });
      } else {
        // Show fallback option
        setAiResult({
          type: 'page_enhancement',
          success: false,
          error: result.error,
          fallback: result.fallbackPage
        });
      }
    } catch (error) {
      console.error('AI enhancement failed:', error);
      setAiResult({
        type: 'page_enhancement',
        success: false,
        error: 'AI enhancement failed: ' + error.message
      });
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleAILessonRegeneration = async (options = {}) => {
    if (!aiInstructions.trim()) {
      alert('Please provide instructions for lesson regeneration');
      return;
    }

    setIsAIProcessing(true);
    try {
      const result = await AILessonEditingService.regenerateFullLesson(
        editedLesson,
        aiInstructions,
        options
      );

      if (result.success) {
        setEditedLesson(result.regeneratedLesson);
        setAiResult({
          type: 'lesson_regeneration',
          success: true,
          summary: result.regeneratedLesson.regenerationSummary
        });
      } else {
        setAiResult({
          type: 'lesson_regeneration',
          success: false,
          error: result.error,
          fallback: result.fallbackLesson
        });
      }
    } catch (error) {
      console.error('AI regeneration failed:', error);
      setAiResult({
        type: 'lesson_regeneration',
        success: false,
        error: 'AI regeneration failed: ' + error.message
      });
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleTemplateCreation = async (templateType, userInputs, options = {}) => {
    setIsAIProcessing(true);
    try {
      const result = await AILessonEditingService.createLessonFromTemplate(
        templateType,
        userInputs,
        options
      );

      if (result.success) {
        setEditedLesson(result.newLesson);
        setAiResult({
          type: 'template_creation',
          success: true,
          summary: result.newLesson.creationSummary
        });
      } else {
        setAiResult({
          type: 'template_creation',
          success: false,
          error: result.error,
          fallback: result.fallbackLesson
        });
      }
    } catch (error) {
      console.error('Template creation failed:', error);
      setAiResult({
        type: 'template_creation',
        success: false,
        error: 'Template creation failed: ' + error.message
      });
    } finally {
      setIsAIProcessing(false);
    }
  };

  // Auto-generate difficulty levels from the primary (advanced) version
  const generateDifficultyLevels = async () => {
    setIsGeneratingDifficulties(true);
    try {
      const baseLesson = editedLesson;
      const difficultyLevels = {};

      // Generate beginner version
      const beginnerPrompt = `Convert this advanced lesson to beginner level. Make it simpler, use basic language, add more explanations, and include more guided steps.

ADVANCED LESSON:
Title: ${baseLesson.title}
Key Points: ${baseLesson.keyPoints?.join(', ') || 'None'}
Learning Objectives: ${baseLesson.learningObjectives?.join(', ') || 'None'}
Content: ${baseLesson.content?.map(c => c.value || c.question || 'Content').join(' | ') || 'None'}

Return JSON format:
{
  "title": "beginner version title",
  "learningObjectives": ["simplified objective 1", "simplified objective 2"],
  "keyPoints": ["simple key point 1", "simple key point 2", "simple key point 3"],
  "content": [{"type": "text", "value": "simplified content"}],
  "estimatedTimeMinutes": 20,
  "xpAward": 15
}`;

      // Generate intermediate version
      const intermediatePrompt = `Convert this advanced lesson to intermediate level. Keep moderate complexity, balance theory with practice.

ADVANCED LESSON:
Title: ${baseLesson.title}
Key Points: ${baseLesson.keyPoints?.join(', ') || 'None'}
Learning Objectives: ${baseLesson.learningObjectives?.join(', ') || 'None'}
Content: ${baseLesson.content?.map(c => c.value || c.question || 'Content').join(' | ') || 'None'}

Return JSON format:
{
  "title": "intermediate version title",
  "learningObjectives": ["moderate objective 1", "moderate objective 2"],
  "keyPoints": ["key point 1", "key point 2", "key point 3"],
  "content": [{"type": "text", "value": "intermediate content"}],
  "estimatedTimeMinutes": ${baseLesson.estimatedTimeMinutes || 15},
  "xpAward": 20
}`;

      // Call AI service for both levels
      const [beginnerResponse, intermediateResponse] = await Promise.all([
        AILessonEditingService.callAIService(beginnerPrompt),
        AILessonEditingService.callAIService(intermediatePrompt)
      ]);

      difficultyLevels.beginner = JSON.parse(beginnerResponse);
      difficultyLevels.intermediate = JSON.parse(intermediateResponse);
      difficultyLevels.advanced = {
        title: baseLesson.title,
        learningObjectives: baseLesson.learningObjectives,
        keyPoints: baseLesson.keyPoints,
        content: baseLesson.content,
        estimatedTimeMinutes: baseLesson.estimatedTimeMinutes,
        xpAward: baseLesson.xpAward
      };

      setEditedLesson({
        ...editedLesson,
        difficultyLevels
      });

      setAiResult({
        type: 'difficulty_generation',
        success: true,
        summary: 'Successfully generated beginner and intermediate versions from your advanced lesson!'
      });

    } catch (error) {
      console.error('Error generating difficulty levels:', error);
      setAiResult({
        type: 'difficulty_generation',
        success: false,
        error: 'Failed to generate difficulty levels: ' + error.message
      });
    } finally {
      setIsGeneratingDifficulties(false);
    }
  };

  // Helper functions for lesson structure
  const addKeyPoint = () => {
    const newKeyPoints = [...(editedLesson.keyPoints || []), 'New key point'];
    setEditedLesson({ ...editedLesson, keyPoints: newKeyPoints });
  };

  const updateKeyPoint = (index, value) => {
    const newKeyPoints = [...(editedLesson.keyPoints || [])];
    newKeyPoints[index] = value;
    setEditedLesson({ ...editedLesson, keyPoints: newKeyPoints });
  };

  const removeKeyPoint = (index) => {
    const newKeyPoints = (editedLesson.keyPoints || []).filter((_, i) => i !== index);
    setEditedLesson({ ...editedLesson, keyPoints: newKeyPoints });
  };

  const lessonTypes = [
    { value: 'concept_explanation', label: 'Concept Explanation' },
    { value: 'interactive_practice', label: 'Interactive Practice' },
    { value: 'code_generation_interaction', label: 'Code Generation' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'project_step', label: 'Project Step' }
  ];

  const contentTypes = [
    { type: 'text', label: 'Text', icon: FiType },
    { type: 'ai_professor_tip', label: 'AI Tip', icon: FiHelpCircle },
    { type: 'image', label: 'Image', icon: FiImage },
    { type: 'video', label: 'Video', icon: FiPlay },
    { type: 'quiz', label: 'Quiz', icon: FiHelpCircle },
    { type: 'code_challenge', label: 'Code Challenge', icon: FiCode }
  ];

  return (
    <div className="space-y-6">
      {/* AI Enhancement Controls */}
      <div className="bg-purple-900/30 border border-purple-500/30 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-purple-200 mb-4 flex items-center">
          <FiZap className="mr-2" />
          AI-Powered Lesson Enhancement
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setShowAIPageEditor(true)}
            disabled={!editedLesson.content?.length || isAIProcessing}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            <FiEdit className="mr-2 h-4 w-4" />
            Enhance Current Page
          </button>
          <button
            onClick={() => setShowAILessonRegenerator(true)}
            disabled={isAIProcessing}
            className="flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            <FiRefreshCw className="mr-2 h-4 w-4" />
            Regenerate Lesson
          </button>
          <button
            onClick={() => setShowAITemplateCreator(true)}
            disabled={isAIProcessing}
            className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            <FiPlusSquare className="mr-2 h-4 w-4" />
            Create from Template
          </button>
        </div>
        {isAIProcessing && (
          <div className="mt-3 flex items-center text-purple-200">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400 mr-2"></div>
            AI is processing your request...
          </div>
        )}
      </div>

      {/* Basic Lesson Info */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">Lesson Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={editedLesson.title}
              onChange={(e) => setEditedLesson({ ...editedLesson, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Lesson Type</label>
            <select
              value={editedLesson.lessonType}
              onChange={(e) => setEditedLesson({ ...editedLesson, lessonType: e.target.value })}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
            >
              {lessonTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Time (minutes)</label>
            <input
              type="number"
              value={editedLesson.estimatedTimeMinutes}
              onChange={(e) => setEditedLesson({ ...editedLesson, estimatedTimeMinutes: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">XP Award</label>
            <input
              type="number"
              value={editedLesson.xpAward}
              onChange={(e) => setEditedLesson({ ...editedLesson, xpAward: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
            />
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white">Learning Objectives</h4>
          <button
            onClick={addLearningObjective}
            className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FiPlus className="mr-1 h-4 w-4" />
            Add
          </button>
        </div>
        
        <div className="space-y-2">
          {editedLesson.learningObjectives.map((objective, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => updateLearningObjective(index, e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
              />
              <button
                onClick={() => removeLearningObjective(index)}
                className="text-red-400 hover:text-red-300"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Key Points (for main page) */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white">Key Points (Main Page)</h4>
          <button
            onClick={addKeyPoint}
            className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FiPlus className="mr-1 h-4 w-4" />
            Add Key Point
          </button>
        </div>
        
        <div className="space-y-2">
          {(editedLesson.keyPoints || []).map((keyPoint, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={keyPoint}
                onChange={(e) => updateKeyPoint(index, e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                placeholder="Key point that will be displayed on the main page"
              />
              <button
                onClick={() => removeKeyPoint(index)}
                className="text-red-400 hover:text-red-300"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">Lesson Summary</h4>
        <textarea
          value={editedLesson.summary || ''}
          onChange={(e) => setEditedLesson({ ...editedLesson, summary: e.target.value })}
          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
          rows={4}
          placeholder="Write a summary that will be shown at the end of the lesson..."
        />
      </div>

      {/* Sandbox Options */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">Interactive Elements</h4>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="includeSandbox"
              checked={editedLesson.includeSandbox || false}
              onChange={(e) => setEditedLesson({ 
                ...editedLesson, 
                includeSandbox: e.target.checked,
                sandboxType: e.target.checked ? 'openai_api' : 'none'
              })}
              className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
            />
            <label htmlFor="includeSandbox" className="text-white font-medium">
              Include Interactive Sandbox
            </label>
          </div>

          {editedLesson.includeSandbox && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sandbox Type</label>
              <select
                value={editedLesson.sandboxType || 'openai_api'}
                onChange={(e) => setEditedLesson({ ...editedLesson, sandboxType: e.target.value })}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
              >
                <option value="openai_api">OpenAI API Input (users send prompts)</option>
                <option value="replit">Replit Sandbox (text-to-code experience)</option>
                <option value="both">Both OpenAI API and Replit</option>
              </select>
              <p className="text-gray-400 text-sm mt-2">
                {editedLesson.sandboxType === 'openai_api' && "Students will be able to send prompts to OpenAI API and see responses."}
                {editedLesson.sandboxType === 'replit' && "Students will have a code sandbox for hands-on coding experience."}
                {editedLesson.sandboxType === 'both' && "Students will have both AI prompting and coding sandbox options."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Auto-Generate Difficulty Levels */}
      <div className="bg-indigo-900/30 border border-indigo-500/30 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-indigo-200 mb-4 flex items-center">
          <FiZap className="mr-2" />
          Auto-Generate Difficulty Levels
        </h4>
        <p className="text-gray-300 text-sm mb-4">
          Create beginner and intermediate versions from your advanced lesson automatically.
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300">
            Primary Level: <span className="text-indigo-300 font-medium">Advanced</span>
          </div>
          <button
            onClick={generateDifficultyLevels}
            disabled={isGeneratingDifficulties || !editedLesson.title}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            <FiRefreshCw className={`mr-2 h-4 w-4 ${isGeneratingDifficulties ? 'animate-spin' : ''}`} />
            {isGeneratingDifficulties ? 'Generating...' : 'Generate All Levels'}
          </button>
        </div>

        {editedLesson.difficultyLevels?.beginner && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded">
            <p className="text-green-200 text-sm">
              ✓ Difficulty levels generated! Beginner and intermediate versions are ready.
            </p>
          </div>
        )}

        {isGeneratingDifficulties && (
          <div className="mt-3 flex items-center text-indigo-200">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400 mr-2"></div>
            Creating beginner and intermediate versions from your advanced lesson...
          </div>
        )}
      </div>

      {/* Content Pages */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white">Content Pages ({editedLesson.content.length})</h4>
          <button
            onClick={() => setIsAddingContent(true)}
            className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <FiPlus className="mr-1 h-4 w-4" />
            Add Page
          </button>
        </div>

        {/* Content Type Selector Modal */}
        <AnimatePresence>
          {isAddingContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
              >
                <h5 className="text-xl font-semibold text-white mb-4">Choose Content Type</h5>
                <div className="grid grid-cols-2 gap-3">
                  {contentTypes.map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => addContentPage(type)}
                      className="flex items-center p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                    >
                      <Icon className="mr-2 h-5 w-5" />
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsAddingContent(false)}
                  className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Pages List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pages Sidebar */}
          <div className="lg:col-span-1">
            <h5 className="text-sm font-medium text-gray-300 mb-2">Pages</h5>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(editedLesson.content || []).map((content, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer border-2 ${
                    activeContentIndex === index
                      ? 'border-indigo-500 bg-indigo-900'
                      : 'border-gray-600 bg-gray-600 hover:bg-gray-500'
                  }`}
                  onClick={() => setActiveContentIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">
                      {index + 1}. {content.type.replace('_', ' ')}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveContentPage(index, 'up');
                        }}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-white disabled:opacity-50"
                      >
                        <FiArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveContentPage(index, 'down');
                        }}
                        disabled={index === (editedLesson.content || []).length - 1}
                        className="text-gray-400 hover:text-white disabled:opacity-50"
                      >
                        <FiArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeContentPage(index);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FiTrash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-2">
            {(editedLesson.content || []).length > 0 && (editedLesson.content || [])[activeContentIndex] && (
              <ContentPageEditor
                content={(editedLesson.content || [])[activeContentIndex]}
                index={activeContentIndex}
                onUpdate={(updates) => updateContentPage(activeContentIndex, updates)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Auto-save Status & Draft Controls */}
      {(isDraft || currentDraftId) && (
        <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {autoSaveStatus === 'saving' && (
                  <>
                    <FiClock className="h-4 w-4 text-blue-400 animate-spin" />
                    <span className="text-blue-200 text-sm">Saving draft...</span>
                  </>
                )}
                {autoSaveStatus === 'saved' && lastSaved && (
                  <>
                    <FiCheck className="h-4 w-4 text-green-400" />
                    <span className="text-green-200 text-sm">
                      Draft saved {lastSaved.toLocaleTimeString()}
                    </span>
                  </>
                )}
                {autoSaveStatus === 'error' && (
                  <>
                    <div className="h-4 w-4 bg-red-400 rounded-full" />
                    <span className="text-red-200 text-sm">Auto-save failed</span>
                  </>
                )}
              </div>
            </div>
            {currentDraftId && (
              <button
                onClick={handleDeleteDraft}
                className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
              >
                <FiTrash2 className="mr-1 h-3 w-3" />
                Delete Draft
              </button>
            )}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {isDraft || currentDraftId ? (
            <span>Changes are automatically saved as drafts</span>
          ) : (
            <span>Changes will be saved when you click Save</span>
          )}
        </div>
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <FiSave className="mr-2 h-4 w-4" />
          {isDraft || currentDraftId ? 'Publish Lesson' : 'Save Lesson'}
        </button>
      </div>
    </div>
  );
};

// Content Page Editor Component
const ContentPageEditor = ({ content, index, onUpdate }) => {
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleUpdate = (updates) => {
    const newContent = { ...editedContent, ...updates };
    setEditedContent(newContent);
    onUpdate(updates);
  };

  const renderEditor = () => {
    switch (content.type) {
      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Text Content</label>
            <textarea
              value={editedContent.value || ''}
              onChange={(e) => handleUpdate({ value: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
              placeholder="Enter your text content..."
            />
          </div>
        );

      case 'ai_professor_tip':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">AI Professor Tip</label>
            <textarea
              value={editedContent.value || ''}
              onChange={(e) => handleUpdate({ value: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
              placeholder="Add a helpful tip or insight..."
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
              <input
                type="url"
                value={editedContent.url || ''}
                onChange={(e) => handleUpdate({ url: e.target.value })}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Alt Text</label>
              <input
                type="text"
                value={editedContent.altText || ''}
                onChange={(e) => handleUpdate({ altText: e.target.value })}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                placeholder="Describe the image..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Caption (optional)</label>
              <input
                type="text"
                value={editedContent.caption || ''}
                onChange={(e) => handleUpdate({ caption: e.target.value })}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                placeholder="Image caption..."
              />
            </div>
          </div>
        );

      case 'quiz':
        return (
          <QuizEditor content={editedContent} onUpdate={handleUpdate} />
        );

      case 'code_challenge':
        return (
          <CodeChallengeEditor content={editedContent} onUpdate={handleUpdate} />
        );

      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
            <textarea
              value={editedContent.value || ''}
              onChange={(e) => handleUpdate({ value: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-600 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-lg font-medium text-white">
          Page {index + 1}: {content.type.replace('_', ' ').toUpperCase()}
        </h5>
        <button
          onClick={() => setShowAIPageEditor(true)}
          className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
        >
          <FiZap className="mr-1 h-3 w-3" />
          AI Enhance
        </button>
      </div>
      {renderEditor()}
    </div>
  );
};

// Quiz Editor Component
const QuizEditor = ({ content, onUpdate }) => {
  const addOption = () => {
    const newOptions = [...(content.options || []), { text: 'New option', correct: false }];
    onUpdate({ options: newOptions });
  };

  const updateOption = (index, updates) => {
    const newOptions = [...content.options];
    newOptions[index] = { ...newOptions[index], ...updates };
    onUpdate({ options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = content.options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Question</label>
        <input
          type="text"
          value={content.question || ''}
          onChange={(e) => onUpdate({ question: e.target.value })}
          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
          placeholder="Enter quiz question..."
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-300">Options</label>
          <button
            onClick={addOption}
            className="text-sm px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Option
          </button>
        </div>
        <div className="space-y-2">
          {(content.options || []).map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`correct-${content.type}`}
                checked={option.correct}
                onChange={() => {
                  const newOptions = content.options.map((opt, i) => ({
                    ...opt,
                    correct: i === index
                  }));
                  onUpdate({ options: newOptions });
                }}
                className="text-indigo-600"
              />
              <input
                type="text"
                value={option.text}
                onChange={(e) => updateOption(index, { text: e.target.value })}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Option text..."
              />
              <button
                onClick={() => removeOption(index)}
                className="text-red-400 hover:text-red-300"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Feedback</label>
        <textarea
          value={content.feedback || ''}
          onChange={(e) => onUpdate({ feedback: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
          placeholder="Explanation for the correct answer..."
        />
      </div>
    </div>
  );
};

// Code Challenge Editor Component
const CodeChallengeEditor = ({ content, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Challenge Description</label>
        <textarea
          value={content.value || ''}
          onChange={(e) => onUpdate({ value: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
          placeholder="Describe the coding challenge..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Starting Code</label>
        <textarea
          value={content.startingCode || ''}
          onChange={(e) => onUpdate({ startingCode: e.target.value })}
          rows={5}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-500 rounded-md text-green-400 font-mono text-sm"
          placeholder="// Starting code for students..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Solution Code</label>
        <textarea
          value={content.solution || ''}
          onChange={(e) => onUpdate({ solution: e.target.value })}
          rows={5}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-500 rounded-md text-green-400 font-mono text-sm"
          placeholder="// Solution code..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Hints</label>
        <div className="space-y-2">
          {(content.hints || []).map((hint, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={hint}
                onChange={(e) => {
                  const newHints = [...(content.hints || [])];
                  newHints[index] = e.target.value;
                  onUpdate({ hints: newHints });
                }}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Hint text..."
              />
              <button
                onClick={() => {
                  const newHints = content.hints.filter((_, i) => i !== index);
                  onUpdate({ hints: newHints });
                }}
                className="text-red-400 hover:text-red-300"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newHints = [...(content.hints || []), 'New hint'];
              onUpdate({ hints: newHints });
            }}
            className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Hint
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;