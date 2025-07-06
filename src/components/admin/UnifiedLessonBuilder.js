import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/backgroundAnimations.css';
import OptimizedStarField from '../OptimizedStarField';
import { useAuth } from '../../contexts/AuthContext';
import draftService from '../../services/draftService';
import ContentBlockRenderer from '../ContentBlocks/ContentBlockRenderer';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  Cog6ToothIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Squares2X2Icon,
  Bars3Icon,
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  BookmarkIcon,
  ShareIcon,
  PlayIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

const UnifiedLessonBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const podcastInputRef = useRef(null);
  const backgroundImageRef = useRef(null);
  
  // Core state
  const [lessonPages, setLessonPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // Lesson metadata
  const [lessonTitle, setLessonTitle] = useState('Untitled Lesson');
  const [lessonDescription, setLessonDescription] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [lessonBackground, setLessonBackground] = useState('dark');
  const [customBackgroundImage, setCustomBackgroundImage] = useState('');
  const [backgroundAnimation, setBackgroundAnimation] = useState('floating-stars');
  const [availableModules] = useState([
    { id: 'prompt-engineering', name: 'Prompt Engineering Mastery' },
    { id: 'vibe-coding', name: 'Vibe Coding' },
    { id: 'ai-fundamentals', name: 'AI Fundamentals' },
    { id: 'web-development', name: 'Web Development' },
    { id: 'data-science', name: 'Data Science' }
  ]);
  
  // Background theme options
  const [backgroundOptions] = useState([
    { id: 'dark', name: 'Dark', description: 'Dark theme', preview: 'bg-gray-900', textColor: 'text-white' },
    { id: 'blue', name: 'Blue', description: 'Blue theme', preview: 'bg-blue-900', textColor: 'text-white' },
    { id: 'purple', name: 'Purple', description: 'Purple theme', preview: 'bg-purple-900', textColor: 'text-white' },
    { id: 'green', name: 'Green', description: 'Green theme', preview: 'bg-green-900', textColor: 'text-white' },
    { id: 'orange', name: 'Orange', description: 'Orange theme', preview: 'bg-orange-900', textColor: 'text-white' },
    { id: 'light', name: 'Light', description: 'Light theme', preview: 'bg-gray-100', textColor: 'text-gray-900' },
    { id: 'custom-image', name: 'Custom Image', description: 'Upload custom background', preview: 'bg-gray-600', textColor: 'text-white' }
  ]);

  // Background animation options - only star, bubbles, rain, and snow
  const [animationOptions] = useState([
    { id: 'none', name: 'None', description: 'No animation' },
    { id: 'floating-stars', name: 'Floating Stars', description: 'Gentle floating stars' },
    { id: 'rain', name: 'Rain Drops', description: 'Soft falling rain' },
    { id: 'bubbles', name: 'Bubbles', description: 'Rising bubbles' },
    { id: 'snow', name: 'Snow', description: 'Gentle falling snow' }
  ]);

  // UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [notification, setNotification] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [showLessonSettings, setShowLessonSettings] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [showMoreBlocks, setShowMoreBlocks] = useState(false);
  
  // History
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Screen size detection
  const [screenSize, setScreenSize] = useState('desktop');
  
  // Get current page and blocks
  const currentPage = lessonPages[currentPageIndex];
  const lessonBlocks = currentPage?.blocks || [];
  
  const checkScreenSize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) {
      setScreenSize('mobile');
      setSidebarCollapsed(true);
    } else if (width < 1024) {
      setScreenSize('tablet');
    } else {
      setScreenSize('desktop');
    }
  }, []);

  useEffect(() => {
    checkScreenSize();
    const handleResize = () => checkScreenSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkScreenSize]);

  // Utility functions
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const triggerUnsavedState = () => {
    setSaveStatus('unsaved');
  };

  const saveToHistory = (state) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(state)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const updateCurrentPageBlocks = (newBlocks) => {
    const newPages = [...lessonPages];
    if (newPages[currentPageIndex]) {
      newPages[currentPageIndex] = {
        ...newPages[currentPageIndex],
        blocks: newBlocks,
        updated: new Date().toISOString()
      };
      setLessonPages(newPages);
    }
  };

  // Block movement functions - replacing drag and drop
  const moveBlockUp = useCallback((blockId) => {
    const currentIndex = lessonBlocks.findIndex(block => block.id === blockId);
    if (currentIndex > 0) {
      const newBlocks = [...lessonBlocks];
      const [movedBlock] = newBlocks.splice(currentIndex, 1);
      newBlocks.splice(currentIndex - 1, 0, movedBlock);
      updateCurrentPageBlocks(newBlocks);
      triggerUnsavedState();
      saveToHistory(lessonPages);
      showNotification('success', 'Block moved up');
    }
  }, [lessonBlocks, lessonPages]);

  const moveBlockDown = useCallback((blockId) => {
    const currentIndex = lessonBlocks.findIndex(block => block.id === blockId);
    if (currentIndex < lessonBlocks.length - 1) {
      const newBlocks = [...lessonBlocks];
      const [movedBlock] = newBlocks.splice(currentIndex, 1);
      newBlocks.splice(currentIndex + 1, 0, movedBlock);
      updateCurrentPageBlocks(newBlocks);
      triggerUnsavedState();
      saveToHistory(lessonPages);
      showNotification('success', 'Block moved down');
    }
  }, [lessonBlocks, lessonPages]);

  // Initialize with default page
  useEffect(() => {
    if (lessonPages.length === 0) {
      const defaultPage = {
        id: generateId(),
        title: 'Introduction',
        blocks: [],
        created: new Date().toISOString()
      };
      setLessonPages([defaultPage]);
    }
  }, [lessonPages.length]);

  // Browser navigation guard
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (saveStatus === 'unsaved') {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  // File upload handling
  const handleFileUpload = async (file, blockId, fileType) => {
    try {
      const objectUrl = URL.createObjectURL(file);
      let field;
      
      // Determine the correct field based on file type
      switch (fileType) {
        case 'image':
          field = 'src';
          break;
        case 'video':
          field = 'src';
          break;
        case 'audio':
          field = 'audioSrc';
          break;
        default:
          field = 'src';
      }
      
      handleInlineEdit(blockId, field, objectUrl);
      handleInlineEdit(blockId, 'fileName', file.name);
      
      // Add duration for audio files if possible
      if (fileType === 'audio') {
        const audio = new Audio(objectUrl);
        audio.addEventListener('loadedmetadata', () => {
          if (audio.duration && isFinite(audio.duration)) {
            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60);
            const durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            handleInlineEdit(blockId, 'duration', durationText);
          }
        });
      }
      
      showNotification('success', `${fileType} uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      showNotification('error', `Failed to upload ${fileType}`);
    }
  };

  // Enhanced block types with better icons and organization
  const blockTypes = [
    // Basic Content
    { id: 'heading', name: 'Heading', icon: '📝', category: 'Text', description: 'Add headings and titles' },
    { id: 'paragraph', name: 'Text', icon: '📄', category: 'Text', description: 'Add paragraphs and text content' },
    { id: 'image', name: 'Image', icon: '🖼️', category: 'Media', description: 'Add images with captions' },
    { id: 'video', name: 'Video', icon: '🎬', category: 'Media', description: 'Embed videos' },
    
    // Interactive Elements
    { id: 'quiz', name: 'Quiz', icon: '❓', category: 'Interactive', description: 'Create multiple-choice questions' },
    { id: 'code-sandbox', name: 'Code Block', icon: '💻', category: 'Interactive', description: 'Interactive code editor' },
    { id: 'fill-blank', name: 'Fill Blanks', icon: '✏️', category: 'Interactive', description: 'Fill in the blank exercises' },
    
    // Advanced Content
    { id: 'podcast', name: 'Audio', icon: '🎧', category: 'Media', description: 'Add audio content' },
    { id: 'checklist', name: 'Checklist', icon: '✅', category: 'Interactive', description: 'Create task lists' },
    
    // AI Features
    { id: 'api_call', name: 'AI API Call', icon: '🤖', category: 'AI', description: 'AI prompt with response area' }
  ];

  // Group blocks by category for better organization
  const blockCategories = {
    'Text': blockTypes.filter(b => b.category === 'Text'),
    'Media': blockTypes.filter(b => b.category === 'Media'),
    'Interactive': blockTypes.filter(b => b.category === 'Interactive'),
    'AI': blockTypes.filter(b => b.category === 'AI')
  };

  // Enhanced block creation with all content types
  const createNewBlock = (blockType) => {
    const defaultContent = {
      heading: { text: 'Click to edit heading', level: 2 },
      paragraph: { text: 'Double-click to edit this text. You can write your lesson content here...' },
      image: { src: '', alt: 'Image', caption: 'Add caption...', fileName: '' },
      video: { src: '', title: 'Video Title', description: 'Video description...', fileName: '' },
      podcast: { audioSrc: '', title: 'Podcast Episode', description: 'Episode description...', duration: '', fileName: '' },
      quiz: { 
        question: 'What is the correct answer?', 
        options: ['Option A', 'Option B', 'Option C', 'Option D'], 
        correctAnswer: 0,
        explanation: 'Explanation for the correct answer...'
      },
      'code-sandbox': { 
        language: 'javascript', 
        code: '// Write your code here\nconsole.log("Hello World!");',
        title: 'Code Exercise',
        instructions: 'Complete the code below:'
      },
      checklist: { 
        items: [
          { id: generateId(), text: 'Check this item', checked: false },
          { id: generateId(), text: 'Another item', checked: false }
        ],
        title: 'Checklist'
      },
      'fill-blank': { 
        text: 'Complete this sentence: The sky is {{blue|colorful}} and the grass is {{green|lush}}.', 
        title: 'Fill in the Blanks'
      },
      'api_call': {
        title: 'AI Assistant',
        prompt: 'Ask the AI assistant a question...',
        apiEndpoint: 'https://api.x.ai/v1/chat/completions',
        responseType: 'text', // 'text' or 'image'
        placeholder: 'Type your question here...',
        responseArea: 'The AI response will appear here...',
        systemPrompt: 'You are a helpful AI assistant. Provide clear and educational responses.',
        maxTokens: 150,
        temperature: 0.7
      }
    };

    return {
      id: generateId(),
      type: blockType,
      content: defaultContent[blockType] || {},
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
  };

  const addBlock = (blockType) => {
    const newBlock = createNewBlock(blockType);
    const newBlocks = [...lessonBlocks, newBlock];
    updateCurrentPageBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
    setSelectedBlock(newBlock);
    
    if ((blockType === 'heading' || blockType === 'paragraph') && !isEditingTitle) {
      setTimeout(() => setEditingBlockId(newBlock.id), 100);
    }
    
    showNotification('success', `${blockTypes.find(t => t.id === blockType)?.name} added`);
  };

  const deleteBlock = (blockId) => {
    const newBlocks = lessonBlocks.filter(block => block.id !== blockId);
    updateCurrentPageBlocks(newBlocks);
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      setSelectedBlock(null);
    }
    
    showNotification('success', 'Block deleted');
  };

  const duplicateBlock = (blockId) => {
    const blockToDuplicate = lessonBlocks.find(b => b.id === blockId);
    if (!blockToDuplicate) return;

    const duplicatedBlock = {
      ...JSON.parse(JSON.stringify(blockToDuplicate)),
      id: generateId(),
      metadata: {
        ...blockToDuplicate.metadata,
        created: new Date().toISOString()
      }
    };

    const blockIndex = lessonBlocks.findIndex(b => b.id === blockId);
    const newBlocks = [...lessonBlocks];
    newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);

    updateCurrentPageBlocks(newBlocks);
    showNotification('success', 'Block duplicated');
  };

  // Enhanced inline editing for all block types
  const handleInlineEdit = (blockId, field, value) => {
    const newBlocks = lessonBlocks.map(block => 
      block.id === blockId 
        ? { 
            ...block, 
            content: { ...block.content, [field]: value },
            metadata: { ...block.metadata, updated: new Date().toISOString() }
          } 
        : block
    );
    
    updateCurrentPageBlocks(newBlocks);
    
    if (selectedBlockId === blockId) {
      setSelectedBlock(newBlocks.find(b => b.id === blockId));
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setLessonPages(history[historyIndex - 1]);
      showNotification('info', 'Undone');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setLessonPages(history[historyIndex + 1]);
      showNotification('info', 'Redone');
    }
  };

  // Enhanced save system with draft service integration
  const saveDraft = async () => {
    if (!user?.uid) {
      showNotification('error', 'Please log in to save drafts');
      return;
    }

    try {
      setSaveStatus('saving');
      
      const lessonData = {
        id: currentDraftId || generateId(),
        title: lessonTitle,
        description: lessonDescription,
        contentVersions: {
          free: {
            title: lessonTitle,
            description: lessonDescription,
            pages: lessonPages
          },
          premium: {
            title: lessonTitle,
            description: lessonDescription,
            pages: lessonPages
          }
        },
        metadata: {
          lessonType: 'concept_explanation',
          estimatedTimeMinutes: 15,
          xpAward: 10,
          category: selectedModule || 'General',
          tags: []
        }
      };

      const result = await draftService.saveDraft(user.uid, lessonData);
      setCurrentDraftId(result.id);
      setSaveStatus('saved');
      setLastSaved(new Date());
      showNotification('success', 'Draft saved successfully!');
      
    } catch (error) {
      console.error('Error saving draft:', error);
      setSaveStatus('error');
      showNotification('error', 'Failed to save draft');
    }
  };

  // Publish draft to production
  const publishDraft = async () => {
    if (!currentDraftId) {
      showNotification('error', 'Please save the draft first');
      return;
    }

    if (!user?.uid) {
      showNotification('error', 'User not authenticated');
      return;
    }

    // Simple publish for now - you can make this more sophisticated later
    const pathId = 'ai-fundamentals'; // Default learning path
    const moduleId = 'intro-to-ai'; // Default module
    
    try {
      const result = await draftService.publishDraft(user.uid, currentDraftId, pathId, moduleId);
      showNotification('success', `Draft published as lesson: ${result.lessonId}`);
      console.log('Published lesson:', result);
    } catch (error) {
      console.error('Error publishing draft:', error);
      showNotification('error', 'Failed to publish draft');
    }
  };

  // Convert lesson to format suitable for preview
  const convertToPreviewFormat = () => {
    const slides = lessonBlocks.map((block, index) => {
      switch (block.type) {
        case 'heading':
          return {
            type: 'concept',
            content: {
              title: block.content.text,
              explanation: '',
              keyPoints: []
            }
          };
        case 'paragraph':
          return {
            type: 'concept',
            content: {
              title: 'Content',
              explanation: block.content.text,
              keyPoints: []
            }
          };
        case 'quiz':
          return {
            type: 'quiz',
            content: {
              question: block.content.question,
              options: block.content.options,
              correctAnswer: block.content.correctAnswer,
              explanation: block.content.explanation
            }
          };
        case 'api_call':
          return {
            type: 'api_call',
            content: block.content
          };
        default:
          return {
            type: 'concept',
            content: {
              title: block.type,
              explanation: 'Preview content',
              keyPoints: []
            }
          };
      }
    });

    return {
      id: generateId(),
      title: lessonTitle,
      description: lessonDescription,
      slides: slides,
      metadata: {
        estimatedTimeMinutes: 15,
        xpAward: 10,
        category: selectedModule || 'General'
      }
    };
  };

  // Preview modal component
  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4 border border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Lesson Preview</h2>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-white mb-4">{lessonTitle}</h1>
            {lessonDescription && (
              <p className="text-gray-300 mb-6">{lessonDescription}</p>
            )}
            
            <div className="space-y-6">
              {lessonBlocks.map((block, index) => (
                <div key={block.id} className="bg-gray-700 rounded-lg p-4">
                  <ContentBlockRenderer
                    block={block}
                    onComplete={() => {}}
                    onInteraction={() => {}}
                    isPreview={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Save prompt modal state
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(false);

  // Navigation
  const goBack = () => {
    if (saveStatus === 'unsaved') {
      setPendingNavigation(true);
      setShowSavePrompt(true);
      return;
    }
    navigateBack();
  };

  const handleSavePromptCancel = () => {
    setShowSavePrompt(false);
    setPendingNavigation(false);
  };

  const handleSavePromptDontSave = () => {
    setShowSavePrompt(false);
    setPendingNavigation(false);
    setSaveStatus('saved');
    navigateBack();
  };

  const handleSavePromptSave = async () => {
    setShowSavePrompt(false);
    setPendingNavigation(false);
    try {
      await saveDraft();
      setTimeout(() => navigateBack(), 1000);
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  const navigateBack = () => {
    const fromAdmin = location.state?.fromAdmin || new URLSearchParams(window.location.search).get('fromAdmin');
    if (fromAdmin) {
      navigate('/admin', { state: { activePanel: 'content-creation' } });
    } else {
      navigate('/admin');
    }
  };

  // Background image upload handler
  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const objectUrl = URL.createObjectURL(file);
      setCustomBackgroundImage(objectUrl);
      setLessonBackground('custom-image');
      triggerUnsavedState();
      showNotification('success', 'Background image uploaded successfully');
    } catch (error) {
      console.error('Error uploading background image:', error);
      showNotification('error', 'Failed to upload background image');
    }
  };

  // Get current background style
  const getCurrentBackgroundStyle = () => {
    if (lessonBackground === 'custom-image' && customBackgroundImage) {
      return {
        backgroundImage: `url(${customBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    
    const bgOption = backgroundOptions.find(bg => bg.id === lessonBackground);
    if (bgOption) {
      switch (bgOption.id) {
        case 'dark':
          return { className: 'bg-gradient-to-br from-gray-900 via-black to-gray-900' };
        case 'blue':
          return { className: 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900' };
        case 'purple':
          return { className: 'bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900' };
        case 'green':
          return { className: 'bg-gradient-to-br from-green-900 via-emerald-800 to-green-900' };
        case 'orange':
          return { className: 'bg-gradient-to-br from-orange-900 via-red-800 to-orange-900' };
        case 'light':
          return { className: 'bg-gradient-to-br from-gray-50 via-white to-gray-100' };
        default:
          return { className: bgOption.preview };
      }
    }
    
    return { className: 'bg-gradient-to-br from-gray-900 via-black to-gray-900' };
  };

  // Get current text color
  const getCurrentTextColor = () => {
    const bgOption = backgroundOptions.find(bg => bg.id === lessonBackground);
    return bgOption ? bgOption.textColor : 'text-gray-900';
  };

  // Sortable Item Component using @dnd-kit
  const SortableItem = ({ block, renderBlock }) => {
    return (
      <div className="transition-all duration-200">
        {renderBlock(block)}
      </div>
    );
  };

  // Simplified block rendering for the builder
  const renderBlock = (block) => {
    const isSelected = selectedBlockId === block.id;
    const isEditing = editingBlockId === block.id;
    
    return (
      <div 
        className={`group relative transition-all duration-200 bg-gray-800/50 rounded-lg p-4 border-2 ${
          isSelected ? 'border-blue-500' : 'border-gray-700 hover:border-gray-600'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedBlockId(block.id);
          setSelectedBlock(block);
        }}
      >
        {/* Move Up/Down Controls - Left Side */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Move Up */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveBlockUp(block.id);
            }}
            disabled={lessonBlocks.findIndex(b => b.id === block.id) === 0}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-lg transition-all duration-200 transform hover:scale-110"
            title="Move Up"
          >
            <ChevronUpIcon className="w-5 h-5 text-white" />
          </button>
          
          {/* Move Down */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveBlockDown(block.id);
            }}
            disabled={lessonBlocks.findIndex(b => b.id === block.id) === lessonBlocks.length - 1}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-lg transition-all duration-200 transform hover:scale-110"
            title="Move Down"
          >
            <ChevronDownIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Other Actions - Right Side */}
        <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Duplicate */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateBlock(block.id);
            }}
            className="p-2 bg-gray-700 hover:bg-green-600 rounded-md shadow-lg transition-all duration-200 transform hover:scale-110"
            title="Duplicate"
          >
            <DocumentDuplicateIcon className="w-4 h-4 text-gray-300 hover:text-white" />
          </button>
          
          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteBlock(block.id);
            }}
            className="p-2 bg-gray-700 hover:bg-red-600 rounded-md shadow-lg transition-all duration-200 transform hover:scale-110"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4 text-gray-300 hover:text-white" />
          </button>
        </div>
        {/* Block content */}
        <div className="min-h-[60px] flex items-center justify-center">
          {block.type === 'heading' && (
            <div className="w-full">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={block.content.text}
                    onChange={(e) => handleInlineEdit(block.id, 'text', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Enter heading..."
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingBlockId(null)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <h2 
                  className="text-xl font-bold text-white cursor-pointer"
                  onDoubleClick={() => setEditingBlockId(block.id)}
                >
                  {block.content.text}
                </h2>
              )}
            </div>
          )}
          
          {block.type === 'paragraph' && (
            <div className="w-full">
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={block.content.text}
                    onChange={(e) => handleInlineEdit(block.id, 'text', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white min-h-[80px]"
                    placeholder="Enter text..."
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingBlockId(null)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <p 
                  className="text-gray-300 cursor-pointer"
                  onDoubleClick={() => setEditingBlockId(block.id)}
                >
                  {block.content.text}
                </p>
              )}
            </div>
          )}
          
          {block.type === 'image' && (
            <div className="w-full text-center">
              {block.content.src ? (
                <img 
                  src={block.content.src} 
                  alt={block.content.alt} 
                  className="max-h-40 mx-auto rounded cursor-pointer"
                  onDoubleClick={() => setEditingBlockId(block.id)}
                />
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-lg py-8 cursor-pointer hover:border-gray-500"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <PhotoIcon className="w-12 h-12 mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-500">Click to add image</p>
                </div>
              )}
            </div>
          )}
          
          {block.type === 'quiz' && (
            <div className="w-full">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Question</label>
                    <input
                      type="text"
                      value={block.content.question}
                      onChange={(e) => handleInlineEdit(block.id, 'question', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Enter your question..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Options</label>
                    {block.content.options.map((option, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="radio"
                          name={`correct-${block.id}`}
                          checked={block.content.correctAnswer === index}
                          onChange={() => handleInlineEdit(block.id, 'correctAnswer', index)}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...block.content.options];
                            newOptions[index] = e.target.value;
                            handleInlineEdit(block.id, 'options', newOptions);
                          }}
                          className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white"
                          placeholder={`Option ${index + 1}`}
                        />
                        <button
                          onClick={() => {
                            const newOptions = block.content.options.filter((_, i) => i !== index);
                            handleInlineEdit(block.id, 'options', newOptions);
                            if (block.content.correctAnswer === index) {
                              handleInlineEdit(block.id, 'correctAnswer', 0);
                            }
                          }}
                          className="ml-2 p-1 text-red-400 hover:text-red-300"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newOptions = [...block.content.options, `Option ${block.content.options.length + 1}`];
                        handleInlineEdit(block.id, 'options', newOptions);
                      }}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Add Option
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Explanation</label>
                    <textarea
                      value={block.content.explanation}
                      onChange={(e) => handleInlineEdit(block.id, 'explanation', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20"
                      placeholder="Explain the correct answer..."
                    />
                  </div>
                  <button
                    onClick={() => setEditingBlockId(null)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl mb-2">❓</div>
                  <p className="text-gray-300 mb-2">Quiz: {block.content.question}</p>
                  <div className="text-sm text-gray-400">
                    {block.content.options.length} options • Correct: {block.content.options[block.content.correctAnswer]}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {block.type === 'video' && (
            <div className="w-full text-center">
              {block.content.src ? (
                <div className="space-y-2">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <VideoCameraIcon className="w-12 h-12 mx-auto text-blue-400 mb-2" />
                    <p className="text-gray-300 text-sm">Video: {block.content.title || 'Untitled'}</p>
                    <p className="text-gray-500 text-xs">
                      {block.content.fileName || 'video file'}
                    </p>
                  </div>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-lg py-8 cursor-pointer hover:border-gray-500"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <VideoCameraIcon className="w-12 h-12 mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-500">Click to add video</p>
                </div>
              )}
            </div>
          )}
          
          {block.type === 'podcast' && (
            <div className="w-full text-center">
              {block.content.audioSrc ? (
                <div className="space-y-2">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <SpeakerWaveIcon className="w-12 h-12 mx-auto text-purple-400 mb-2" />
                    <p className="text-gray-300 text-sm">Audio: {block.content.title || 'Untitled'}</p>
                    <p className="text-gray-500 text-xs">
                      {block.content.fileName || 'audio file'}
                    </p>
                    {block.content.duration && (
                      <p className="text-gray-500 text-xs">
                        Duration: {block.content.duration}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-lg py-8 cursor-pointer hover:border-gray-500"
                  onClick={() => podcastInputRef.current?.click()}
                >
                  <SpeakerWaveIcon className="w-12 h-12 mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-500">Click to add audio</p>
                </div>
              )}
            </div>
          )}
          
          {block.type === 'code-sandbox' && (
            <div className="w-full">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={block.content.title}
                      onChange={(e) => handleInlineEdit(block.id, 'title', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Code exercise title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Instructions</label>
                    <textarea
                      value={block.content.instructions}
                      onChange={(e) => handleInlineEdit(block.id, 'instructions', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20"
                      placeholder="Instructions for students..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Programming Language</label>
                    <select
                      value={block.content.language}
                      onChange={(e) => handleInlineEdit(block.id, 'language', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="json">JSON</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Starter Code</label>
                    <textarea
                      value={block.content.code}
                      onChange={(e) => handleInlineEdit(block.id, 'code', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono text-sm h-32"
                      placeholder="// Write starter code here..."
                    />
                  </div>
                  <button
                    onClick={() => setEditingBlockId(null)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl mb-2">💻</div>
                    <p className="text-gray-300">Code: {block.content.title || 'Untitled'}</p>
                    <p className="text-gray-500 text-xs">Language: {block.content.language}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {block.type === 'fill-blank' && (
            <div className="w-full">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={block.content.title}
                      onChange={(e) => handleInlineEdit(block.id, 'title', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Fill in the blanks title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Text with Blanks
                    </label>
                    <p className="text-xs text-gray-400 mb-2">
                      Use {`{{answer|hint}}`} format for blanks. Example: The sky is {`{{blue|color}}`}.
                    </p>
                    <textarea
                      value={block.content.text}
                      onChange={(e) => handleInlineEdit(block.id, 'text', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-32"
                      placeholder="Write text with blanks using {{answer|hint}} format..."
                    />
                  </div>
                  <button
                    onClick={() => setEditingBlockId(null)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl mb-2">✏️</div>
                    <p className="text-gray-300">Fill Blanks: {block.content.title || 'Untitled'}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {(block.content.text?.match(/\{\{[^}]+\}\}/g) || []).length} blanks
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {block.type === 'checklist' && (
            <div className="w-full">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={block.content.title}
                      onChange={(e) => handleInlineEdit(block.id, 'title', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Checklist title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Items</label>
                    {block.content.items?.map((item, index) => (
                      <div key={item.id || index} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(e) => {
                            const newItems = [...(block.content.items || [])];
                            newItems[index] = { ...item, checked: e.target.checked };
                            handleInlineEdit(block.id, 'items', newItems);
                          }}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => {
                            const newItems = [...(block.content.items || [])];
                            newItems[index] = { ...item, text: e.target.value };
                            handleInlineEdit(block.id, 'items', newItems);
                          }}
                          className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white"
                          placeholder={`Item ${index + 1}`}
                        />
                        <button
                          onClick={() => {
                            const newItems = (block.content.items || []).filter((_, i) => i !== index);
                            handleInlineEdit(block.id, 'items', newItems);
                          }}
                          className="ml-2 p-1 text-red-400 hover:text-red-300"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newItems = [...(block.content.items || []), {
                          id: generateId(),
                          text: `Item ${(block.content.items || []).length + 1}`,
                          checked: false
                        }];
                        handleInlineEdit(block.id, 'items', newItems);
                      }}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Add Item
                    </button>
                  </div>
                  <button
                    onClick={() => setEditingBlockId(null)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl mb-2">✅</div>
                    <p className="text-gray-300">Checklist: {block.content.title || 'Untitled'}</p>
                    <p className="text-gray-500 text-xs">
                      {block.content.items?.length || 0} items
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {block.type === 'api_call' && (
            <div className="w-full">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={block.content.title}
                      onChange={(e) => handleInlineEdit(block.id, 'title', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="AI assistant title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Prompt Instructions</label>
                    <textarea
                      value={block.content.prompt}
                      onChange={(e) => handleInlineEdit(block.id, 'prompt', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20"
                      placeholder="Instructions for what students should ask..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Input Placeholder</label>
                    <input
                      type="text"
                      value={block.content.placeholder}
                      onChange={(e) => handleInlineEdit(block.id, 'placeholder', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Placeholder text for user input..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Response Type</label>
                    <select
                      value={block.content.responseType}
                      onChange={(e) => handleInlineEdit(block.id, 'responseType', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      <option value="text">Text Response</option>
                      <option value="image">Image Generation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">System Prompt</label>
                    <textarea
                      value={block.content.systemPrompt}
                      onChange={(e) => handleInlineEdit(block.id, 'systemPrompt', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20"
                      placeholder="System instructions for the AI..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Max Tokens</label>
                      <input
                        type="number"
                        value={block.content.maxTokens}
                        onChange={(e) => handleInlineEdit(block.id, 'maxTokens', parseInt(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        min="1"
                        max="4000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Temperature</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={block.content.temperature}
                        onChange={(e) => handleInlineEdit(block.id, 'temperature', parseFloat(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingBlockId(null)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl mb-2">🤖</div>
                    <p className="text-gray-300">AI API: {block.content.title || 'Untitled'}</p>
                    <p className="text-gray-500 text-xs">
                      Type: {block.content.responseType} • Max tokens: {block.content.maxTokens}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!['heading', 'paragraph', 'image', 'quiz', 'video', 'podcast', 'code-sandbox', 'fill-blank', 'checkbox', 'api_call'].includes(block.type) && (
            <div className="w-full text-center">
              <div className="text-2xl mb-2">
                {blockTypes.find(t => t.id === block.type)?.icon || '📝'}
              </div>
              <p className="text-gray-400">
                {blockTypes.find(t => t.id === block.type)?.name || block.type}
              </p>
            </div>
          )}
        </div>
        
        {/* Block actions */}
        {isSelected && (
          <div className="absolute top-2 right-2 flex space-x-1 bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setEditingBlockId(block.id)}
              className="p-1 text-blue-400 hover:text-blue-300 rounded"
              title="Edit"
            >
              <Cog6ToothIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => duplicateBlock(block.id)}
              className="p-1 text-green-400 hover:text-green-300 rounded"
              title="Duplicate"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteBlock(block.id)}
              className="p-1 text-red-400 hover:text-red-300 rounded"
              title="Delete"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 bg-gray-800 border-r border-gray-700 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold">Lesson Builder</h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <Bars3Icon className="w-5 h-5" /> : <XMarkIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Content */}
        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto">
            {/* Lesson Settings */}
            <div className="p-4 border-b border-gray-700">
              <button
                onClick={() => setShowLessonSettings(!showLessonSettings)}
                className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <span className="font-medium">Lesson Settings</span>
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              
              {showLessonSettings && (
                <div className="mt-3 space-y-4">
                  {/* Background Options - Enhanced with animations */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Lesson Background</label>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {backgroundOptions.map((bg) => (
                        <button
                          key={bg.id}
                          onClick={() => {
                            if (bg.id === 'custom-image') {
                              backgroundImageRef.current?.click();
                            } else {
                              setLessonBackground(bg.id);
                              triggerUnsavedState();
                            }
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            lessonBackground === bg.id
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className={`w-full h-6 rounded mb-2 ${bg.preview} ${bg.id === 'custom-image' ? 'border-2 border-dashed border-gray-400 flex items-center justify-center' : ''}`}>
                            {bg.id === 'custom-image' && (
                              <span className="text-xs text-gray-600">📁</span>
                            )}
                          </div>
                          <div className="text-xs font-medium">{bg.name}</div>
                          <div className="text-xs text-gray-400 truncate">{bg.description}</div>
                        </button>
                      ))}
                    </div>

                    {/* Background Animation Options */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Background Animation</label>
                      <select
                        value={backgroundAnimation}
                        onChange={(e) => {
                          setBackgroundAnimation(e.target.value);
                          triggerUnsavedState();
                        }}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                      >
                        {animationOptions.map((animation) => (
                          <option key={animation.id} value={animation.id}>
                            {animation.name} - {animation.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Hidden file inputs */}
                    <input
                      ref={backgroundImageRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundImageUpload}
                      className="hidden"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0] && selectedBlockId) {
                          handleFileUpload(e.target.files[0], selectedBlockId, 'image');
                        }
                      }}
                      className="hidden"
                    />
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files[0] && selectedBlockId) {
                          handleFileUpload(e.target.files[0], selectedBlockId, 'video');
                        }
                      }}
                      className="hidden"
                    />
                    <input
                      ref={podcastInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        if (e.target.files[0] && selectedBlockId) {
                          handleFileUpload(e.target.files[0], selectedBlockId, 'audio');
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      key="lesson-title-input"
                      type="text"
                      value={lessonTitle}
                      onChange={(e) => {
                        setLessonTitle(e.target.value);
                        triggerUnsavedState();
                      }}
                      onFocus={() => setIsEditingTitle(true)}
                      onBlur={() => setIsEditingTitle(false)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                      placeholder="Enter lesson title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      key="lesson-description-input"
                      value={lessonDescription}
                      onChange={(e) => {
                        setLessonDescription(e.target.value);
                        triggerUnsavedState();
                      }}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm h-20 resize-none"
                      placeholder="Describe your lesson..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Module</label>
                    <select
                      value={selectedModule}
                      onChange={(e) => {
                        setSelectedModule(e.target.value);
                        triggerUnsavedState();
                      }}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">Select a module...</option>
                      {availableModules.map(module => (
                        <option key={module.id} value={module.id}>{module.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Block Palette - Webflow Style */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Add Content</h3>
                <div className="text-xs text-gray-400">
                  {blockTypes.length} blocks available
                </div>
              </div>
              
              {/* Block Categories */}
              <div className="space-y-8">
                {Object.entries(blockCategories).map(([category, blocks]) => (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                        {category}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {blocks.map(blockType => (
                        <motion.button
                          key={blockType.id}
                          onClick={() => addBlock(blockType.id)}
                          className="group relative overflow-hidden bg-gray-800 hover:bg-gray-700 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 border border-gray-700 hover:border-blue-500/50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                              {blockType.icon}
                            </div>
                            <div className="flex-1 text-left">
                              <h5 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                                {blockType.name}
                              </h5>
                              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                {blockType.description}
                              </p>
                            </div>
                            <div className="flex-shrink-0 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                              <svg className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Subtle hover glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Quick Tips */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-800/30">
                <div className="flex items-start space-x-3">
                  <div className="text-blue-400 mt-0.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-300 mb-1">Pro Tip</h4>
                    <p className="text-xs text-gray-400">
                      Start with a heading, add some text, then enhance with interactive elements like quizzes or code blocks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 rounded"
                  title="Undo"
                >
                  <ArrowUturnLeftIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 rounded"
                  title="Redo"
                >
                  <ArrowUturnRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Streamlined Action Bar */}
            <div className="flex items-center justify-between bg-gray-800/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700">
              {/* Save Status */}
              <div className="flex items-center space-x-2">
                {saveStatus === 'saving' && (
                  <div className="flex items-center space-x-2 text-blue-400">
                    <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Saving...</span>
                  </div>
                )}
                
                {saveStatus === 'saved' && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span className="text-sm">Saved</span>
                  </div>
                )}
                
                {saveStatus === 'unsaved' && (
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span className="text-sm">Unsaved</span>
                  </div>
                )}
                
                {saveStatus === 'error' && (
                  <div className="flex items-center space-x-2 text-red-400">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span className="text-sm">Error</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
                  title="Preview lesson"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={saveDraft}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                  title="Save as draft"
                >
                  <BookmarkIcon className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>

                {currentDraftId && (
                  <button
                    onClick={publishDraft}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
                    title="Publish draft as lesson"
                  >
                    <CloudArrowUpIcon className="w-4 h-4" />
                    <span>Publish</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editor Area with enhanced background system */}
        <div className="flex-1 overflow-y-auto relative">
          <div 
            className={`min-h-full ${lessonBackground === 'custom-image' ? '' : getCurrentBackgroundStyle().className}`}
            style={lessonBackground === 'custom-image' ? getCurrentBackgroundStyle() : {}}
          >
            {/* Background Animation Layer */}
            {backgroundAnimation !== 'none' && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`background-animation ${backgroundAnimation}`}>
                  {/* Stars Animation */}
                  {backgroundAnimation === 'floating-stars' && (
                    <div className="stars-container">
                      <OptimizedStarField starCount={100} opacity={0.6} speed={1.2} size={1} />
                    </div>
                  )}

                  {/* Rain Animation */}
                  {backgroundAnimation === 'rain' && (
                    <div className="rain-container">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div
                          key={i}
                          className="raindrop"
                          style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Snow Animation */}
                  {backgroundAnimation === 'snow' && (
                    <div className="snow-container">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          key={i}
                          className="snowflake"
                          style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${6 + Math.random() * 4}s`
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Bubbles Animation - slower and less visible */}
                  {backgroundAnimation === 'bubbles' && (
                    <div className="bubbles-container">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div
                          key={i}
                          className="bubble-slow"
                          style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${15 + Math.random() * 10}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="max-w-4xl mx-auto p-6 relative z-10">
              <div className="mb-8">
                <h1 className={`text-3xl font-bold mb-2 ${getCurrentTextColor()}`}>
                  {lessonTitle}
                </h1>
                {lessonDescription && (
                  <p className={`${getCurrentTextColor()} opacity-80`}>
                    {lessonDescription}
                  </p>
                )}
              </div>

            {/* Blocks */}
            <div 
              className="min-h-[300px] space-y-4 p-4 border-2 border-transparent"
              onClick={() => {
                if (!showPreviewModal) {
                  setSelectedBlockId(null);
                  setSelectedBlock(null);
                }
              }}
            >
              {lessonBlocks.map((block) => (
                <SortableItem
                  key={block.id}
                  block={block}
                  renderBlock={renderBlock}
                />
              ))}
              
              {/* Empty State */}
              {lessonBlocks.length === 0 && (
                <div className="text-center py-12">
                  <Squares2X2Icon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">
                    Start Building Your Lesson
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add content blocks from the sidebar to create your lesson
                  </p>
                  <button
                    onClick={() => addBlock('heading')}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Your First Block
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`px-6 py-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-600' :
              notification.type === 'error' ? 'bg-red-600' :
              notification.type === 'info' ? 'bg-blue-600' :
              'bg-yellow-600'
            }`}>
              <div className="flex items-center space-x-3">
                {notification.type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
                {notification.type === 'error' && <ExclamationTriangleIcon className="w-5 h-5" />}
                <span className="font-medium">{notification.message}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Prompt Modal */}
      {showSavePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Save Changes?</h3>
            <p className="text-gray-300 mb-6">
              You have unsaved changes. Would you like to save them before leaving?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleSavePromptCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePromptDontSave}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Don't Save
              </button>
              <button
                onClick={handleSavePromptSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <PreviewModal />
      )}
    </div>
  );
};

export default UnifiedLessonBuilder; 