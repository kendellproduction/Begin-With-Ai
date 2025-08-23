import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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
  CloudArrowUpIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  BookOpenIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { storage } from '../../firebase'; // Add Firebase Storage import
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Add Firebase Storage functions
import logger from '../../utils/logger';

const UnifiedLessonBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const podcastInputRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const lessonTitleInputRef = useRef(null);
  
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
  
  // NEW: Lesson card visual customization
  const [lessonIcon, setLessonIcon] = useState('');
  const [lessonPaletteIndex, setLessonPaletteIndex] = useState(3); // Default to blue (Ocean Blue palette)
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [customCardColors, setCustomCardColors] = useState({
    gradient: 'bg-blue-600/85',
    borderGlow: 'border-blue-400/70', 
    shadowColor: 'shadow-blue-600/50',
    textAccent: 'text-blue-100',
    buttonStyle: 'from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600'
  });
  
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
    { id: 'light', name: 'Light', description: 'Light theme', preview: 'bg-gray-100', textColor: 'text-gray-900' }
  ]);
  
  // Card color palettes (same as LessonCard.js)
  const [colorPalettes] = useState([
    // Ocean Blue (Index 3 - Default)
    {
      name: 'Ocean Blue',
      gradient: 'bg-blue-600/85',
      borderGlow: 'border-blue-400/70',
      shadowColor: 'shadow-blue-600/50',
      textAccent: 'text-blue-100',
      buttonStyle: 'from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600',
      particles: ['🌊', '💧', '🐟']
    },
    // Warm Caramel
    {
      name: 'Warm Caramel',
      gradient: 'bg-amber-600/85',
      borderGlow: 'border-amber-400/70',
      shadowColor: 'shadow-amber-600/50',
      textAccent: 'text-amber-100',
      buttonStyle: 'from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600',
      particles: ['✨', '🍯', '🌟']
    },
    // Forest Green
    {
      name: 'Forest Green',
      gradient: 'bg-green-600/85',
      borderGlow: 'border-green-400/70',
      shadowColor: 'shadow-green-600/50',
      textAccent: 'text-green-100',
      buttonStyle: 'from-green-500 to-green-700 hover:from-green-400 hover:to-green-600',
      particles: ['🌿', '🍃', '🌱']
    },
    // Rich Terracotta
    {
      name: 'Rich Terracotta',
      gradient: 'bg-orange-700/85',
      borderGlow: 'border-orange-500/70',
      shadowColor: 'shadow-orange-700/50',
      textAccent: 'text-orange-100',
      buttonStyle: 'from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700',
      particles: ['🏺', '🍂', '🌅']
    },
    // Deep Purple
    {
      name: 'Deep Purple',
      gradient: 'bg-purple-600/85',
      borderGlow: 'border-purple-400/70',
      shadowColor: 'shadow-purple-600/50',
      textAccent: 'text-purple-100',
      buttonStyle: 'from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600',
      particles: ['🔮', '🌙', '💜']
    },
    // Emerald 
    {
      name: 'Emerald',
      gradient: 'bg-emerald-600/85',
      borderGlow: 'border-emerald-400/70',
      shadowColor: 'shadow-emerald-600/50',
      textAccent: 'text-emerald-100',
      buttonStyle: 'from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600',
      particles: ['💚', '🔮', '🌿']
    }
  ]);
  
  // Popular lesson icons
  const [popularIcons] = useState([
    '🚀', '📚', '🧠', '📖', '⚙️', '🎨', '🔧', '🤖', 
    '💡', '🎯', '⭐', '🔥', '💎', '🌟', '✨', '🎪',
    '🎓', '🎊', '🏆', '📊', '🔍', '💼', '🎮', '🎵'
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
  
  // After existing state declarations:
  const [currentTier, setCurrentTier] = useState('free');
  const [freePages, setFreePages] = useState([]);
  const [premiumPages, setPremiumPages] = useState([]);
  
  // State for tracking uploading files
  const [uploadingFiles, setUploadingFiles] = useState(new Set());
  
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
  }, []); // Remove checkScreenSize dependency to prevent infinite loop

  // Add optimized handlers to prevent focus loss
  const handleTitleChange = useCallback((e) => {
    setLessonTitle(e.target.value);
    triggerUnsavedState();
  }, []);

  const handleTitleFocus = useCallback(() => {
    setIsEditingTitle(true);
  }, []);

  const handleTitleBlur = useCallback(() => {
    setIsEditingTitle(false);
  }, []);

  // Utility functions
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const triggerUnsavedState = () => {
    setSaveStatus('unsaved');
  };

  // Robust file picker that falls back to a temporary input if needed
  const openFilePicker = (inputRef, accept, onFileSelected) => {
    try {
      const input = inputRef?.current;
      if (input) {
        input.value = '';
        if (accept) input.setAttribute('accept', accept);
        input.click();
        return;
      }
    } catch (err) {
      // Fallback below
    }
    // Fallback: ephemeral input element
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    if (accept) tempInput.accept = accept;
    tempInput.style.display = 'none';
    document.body.appendChild(tempInput);
    tempInput.click();
    // Relay change back to the hidden input if present
    tempInput.onchange = (e) => {
      const file = e.target?.files?.[0];
      if (!file) {
        document.body.removeChild(tempInput);
        return;
      }
      if (onFileSelected && typeof onFileSelected === 'function') {
        try { onFileSelected(file); } catch (_) {}
      } else if (inputRef?.current) {
        // Assign files to the hidden input to reuse existing onChange logic
        Object.defineProperty(inputRef.current, 'files', { value: e.target.files, writable: false });
        const event = new Event('change', { bubbles: true });
        inputRef.current.dispatchEvent(event);
      }
      document.body.removeChild(tempInput);
    };
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

  // Initialize with draft data from navigation state or default page
  useEffect(() => {
    const initializeLesson = () => {
      // Check if we're editing an existing draft
      if (location.state?.draft) {
        const draft = location.state.draft;
        logger.log('Loading draft for editing:', draft);
        
        // Set lesson metadata
        setLessonTitle(draft.title || 'Untitled Lesson');
        setLessonDescription(draft.description || '');
        setCurrentDraftId(draft.id);
        
        // Load visual customization settings
        setLessonIcon(draft.icon || '');
        setLessonPaletteIndex(draft.paletteIndex !== undefined ? draft.paletteIndex : 3); // Default to blue
        setUseCustomColors(!!draft.customColors);
        if (draft.customColors) {
          setCustomCardColors(draft.customColors);
        }
        
        const loadedFreePages = draft.contentVersions?.free?.pages || draft.pages || [];
        const loadedPremiumPages = draft.contentVersions?.premium?.pages || draft.pages || [];
        setFreePages(loadedFreePages);
        setPremiumPages(loadedPremiumPages);
        setLessonPages(currentTier === 'free' ? loadedFreePages : loadedPremiumPages);
        
        showNotification('info', `Loaded draft: ${draft.title || 'Untitled Lesson'}`);
      } else if (location.state?.editingLesson) {
        const lesson = location.state.editingLesson;
        logger.log('Loading published lesson for editing:', lesson);
        
        // Set lesson metadata
        setLessonTitle(lesson.title || 'Untitled Lesson');
        setLessonDescription(lesson.description || '');
        
        // Load visual customization settings
        setLessonIcon(lesson.icon || '');
        setLessonPaletteIndex(lesson.paletteIndex !== undefined ? lesson.paletteIndex : 3); // Default to blue
        setUseCustomColors(!!lesson.customColors);
        if (lesson.customColors) {
          setCustomCardColors(lesson.customColors);
        }
        
        const loadedFreePages = lesson.contentVersions?.free?.pages || lesson.pages || [];
        const loadedPremiumPages = lesson.contentVersions?.premium?.pages || lesson.pages || [];
        setFreePages(loadedFreePages);
        setPremiumPages(loadedPremiumPages);
        setLessonPages(currentTier === 'free' ? loadedFreePages : loadedPremiumPages);
        
        showNotification('info', `Loaded lesson: ${lesson.title || 'Untitled Lesson'}`);
        
        // Show migration info if lesson was migrated
        if (lesson.wasMigrated) {
          showNotification('warning', `This lesson was migrated from ${lesson.originalFormat} format. Please review content blocks carefully.`, 8000);
        }
      } else if (lessonPages.length === 0) {
        // No draft or lesson data, create default page
        const defaultPage = {
          id: generateId(),
          title: 'Introduction',
          blocks: [],
          created: new Date().toISOString()
        };
        setFreePages([defaultPage]);
        setPremiumPages([defaultPage]);
        setLessonPages([defaultPage]);
      }
    };

    initializeLesson();
  }, [location.state]);

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

  // Enhanced file upload handling with Firebase Storage
  const handleFileUpload = async (file, blockId, fileType) => {
    try {
      showNotification('info', `Uploading ${fileType}...`);
      setUploadingFiles(prev => new Set([...prev, blockId]));
      
      let downloadURL;
      let fileName = file.name;
      
      // Check if Firebase Storage is properly configured
      const isStorageConfigured = storage && storage.app && storage.app.options.storageBucket;
      
      if (!isStorageConfigured) {
        // Fallback to object URL if Firebase Storage isn't configured
        logger.warn('Firebase Storage not configured, using local object URL');
        downloadURL = URL.createObjectURL(file);
        
        if (fileType === 'audio' || fileType === 'podcast') {
          handleInlineEdit(blockId, 'audioSrc', downloadURL);
          handleInlineEdit(blockId, 'fileName', fileName);
          
          // Add duration for audio files
          const audio = new Audio(downloadURL);
          audio.addEventListener('loadedmetadata', () => {
            if (audio.duration && isFinite(audio.duration)) {
              const minutes = Math.floor(audio.duration / 60);
              const seconds = Math.floor(audio.duration % 60);
              const durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
              handleInlineEdit(blockId, 'duration', durationText);
              showNotification('success', `Audio uploaded locally! Duration: ${durationText}`);
            }
          });
        } else {
          handleInlineEdit(blockId, 'src', downloadURL);
          handleInlineEdit(blockId, 'fileName', fileName);
        }
        
        showNotification('warning', `${fileType} uploaded locally (Firebase Storage not configured)`);
        triggerUnsavedState();
        return;
      }
      
      // Upload to Firebase Storage for persistent hosting
      if (fileType === 'audio' || fileType === 'podcast') {
        const storageRef = ref(storage, `lessons/audio/${Date.now()}_${fileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        downloadURL = await getDownloadURL(snapshot.ref);
        
        // Update the block with Firebase Storage URL
        handleInlineEdit(blockId, 'audioSrc', downloadURL);
        handleInlineEdit(blockId, 'fileName', fileName);
        handleInlineEdit(blockId, 'uploadPath', snapshot.ref.fullPath); // Store path for potential deletion
        
        // Add duration for audio files
        const audio = new Audio(downloadURL);
        audio.addEventListener('loadedmetadata', () => {
          if (audio.duration && isFinite(audio.duration)) {
            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60);
            const durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            handleInlineEdit(blockId, 'duration', durationText);
            showNotification('success', `Audio uploaded successfully! Duration: ${durationText}`);
          }
        });
        
      } else if (fileType === 'image') {
        const storageRef = ref(storage, `lessons/images/${Date.now()}_${fileName}`);
        // Optimistic preview
        try { handleInlineEdit(blockId, 'src', URL.createObjectURL(file)); } catch (_) {}
        const snapshot = await uploadBytes(storageRef, file);
        downloadURL = await getDownloadURL(snapshot.ref);
        
        handleInlineEdit(blockId, 'src', downloadURL);
        handleInlineEdit(blockId, 'fileName', fileName);
        handleInlineEdit(blockId, 'uploadPath', snapshot.ref.fullPath);
        
      } else if (fileType === 'video') {
        const storageRef = ref(storage, `lessons/videos/${Date.now()}_${fileName}`);
        // Optimistic preview (may not render all codecs, but keeps UI responsive)
        try { handleInlineEdit(blockId, 'src', URL.createObjectURL(file)); } catch (_) {}
        const snapshot = await uploadBytes(storageRef, file);
        downloadURL = await getDownloadURL(snapshot.ref);
        
        handleInlineEdit(blockId, 'src', downloadURL);
        handleInlineEdit(blockId, 'fileName', fileName);
        handleInlineEdit(blockId, 'uploadPath', snapshot.ref.fullPath);
        
      } else {
        // Fallback to object URL for unsupported types
        downloadURL = URL.createObjectURL(file);
        handleInlineEdit(blockId, 'src', downloadURL);
        handleInlineEdit(blockId, 'fileName', fileName);
      }
      
      showNotification('success', `${fileType} uploaded successfully!`);
      triggerUnsavedState();
      
    } catch (error) {
      logger.error(`Error uploading ${fileType}:`, error);
      
      // Fallback to object URL on Firebase error
      try {
        const objectUrl = URL.createObjectURL(file);
        if (fileType === 'audio' || fileType === 'podcast') {
          handleInlineEdit(blockId, 'audioSrc', objectUrl);
        } else {
          handleInlineEdit(blockId, 'src', objectUrl);
        }
        handleInlineEdit(blockId, 'fileName', file.name);
        
        // Provide better error feedback
        let errorMsg = error.message;
        if (error.code === 'storage/unauthorized') {
          errorMsg = 'You need admin permissions to upload files';
        } else if (error.message.includes('CORS')) {
          errorMsg = 'Storage configuration issue - using local file';
        }
        
        showNotification('warning', `${fileType} uploaded locally (${errorMsg})`);
        triggerUnsavedState();
      } catch (fallbackError) {
        showNotification('error', `Failed to upload ${fileType}: ${fallbackError.message}`);
      }
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(blockId);
        return newSet;
      });
    }
  };

  // Function to delete uploaded files from Firebase Storage
  const deleteUploadedFile = async (uploadPath) => {
    if (!uploadPath) return;
    
    try {
      const fileRef = ref(storage, uploadPath);
      await deleteObject(fileRef);
      logger.info('File deleted from Firebase Storage:', uploadPath);
    } catch (error) {
      logger.warn('Error deleting file from Firebase Storage:', error);
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
      heading: { text: 'New Heading', level: 1 },
      paragraph: { text: '' },
      image: { src: '', alt: '', caption: '' },
      video: { src: '', title: 'Video Title', description: 'Video description...', fileName: '' },
      podcast: { audioSrc: '', title: 'Podcast Episode', description: 'Episode description...', duration: '', fileName: '' },
      quiz: { 
        question: 'What is the correct answer?', 
        options: ['Option A', 'Option B', 'Option C', 'Option D'], 
        correctAnswer: 0,
        explanation: 'Explanation of the correct answer...'
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
    
    // Auto-open file picker for image blocks
    if (blockType === 'image') {
      setTimeout(() => {
        const input = fileInputRef.current;
        if (input) {
          input.value = '';
          try {
            // Direct click is the most reliable method for file inputs
            input.click();
          } catch (error) {
            console.warn('Auto file picker failed:', error);
            // Fallback to direct click
            input.click();
          }
        }
      }, 300);
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

  // Simple debounce implementation
  const debounceRef = useRef({});
  
  const debouncedUpdate = useCallback((blockId, field, value) => {
    const key = `${blockId}-${field}`;
    
    // Clear existing timeout
    if (debounceRef.current[key]) {
      clearTimeout(debounceRef.current[key]);
    }
    
    // Set new timeout
    debounceRef.current[key] = setTimeout(() => {
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
      
      delete debounceRef.current[key];
    }, 300);
  }, [updateCurrentPageBlocks]);

  // Enhanced inline editing for all block types with improved focus handling
  const handleInlineEdit = useCallback((blockId, field, value) => {
    // Preserve focus/caret and scroll during quiz typing
    const activeEl = document.activeElement;
    const isTextInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
    const selectionStart = isTextInput && 'selectionStart' in activeEl ? activeEl.selectionStart : null;
    const selectionEnd = isTextInput && 'selectionEnd' in activeEl ? activeEl.selectionEnd : null;
    const currentScrollY = window.scrollY || 0;
    const targetBlock = lessonBlocks.find(b => b.id === blockId);

    // Update selected block immediately for responsive UI
    if (selectedBlockId === blockId) {
      setSelectedBlock(prev => prev ? {
        ...prev,
        content: { ...prev.content, [field]: value }
      } : prev);
    }
    
    // Update local block state immediately to prevent input lag
    const newBlocks = lessonBlocks.map(block => 
      block.id === blockId 
        ? { 
            ...block, 
            content: { ...block.content, [field]: value }
          } 
        : block
    );
    
    // Update the lesson pages immediately for responsive typing
    const newPages = [...lessonPages];
    if (newPages[currentPageIndex]) {
      newPages[currentPageIndex] = {
        ...newPages[currentPageIndex],
        blocks: newBlocks,
        updated: new Date().toISOString()
      };
      setLessonPages(newPages);
    }
    
    // Debounce only the save status update to prevent excessive API calls
    triggerUnsavedState();

    // Restore focus/caret for quiz edits to prevent blur (avoid forcing window scroll)
    if (targetBlock && targetBlock.type === 'quiz') {
      requestAnimationFrame(() => {
        // Re-find the same input by data attribute to avoid stale node refs
        const selector = activeEl?.getAttribute && activeEl.getAttribute('data-block-input')
          ? `[data-block-input="${activeEl.getAttribute('data-block-input')}"]`
          : null;
        const refocusEl = selector ? document.querySelector(selector) : activeEl;
        if (isTextInput && refocusEl && typeof refocusEl.focus === 'function') {
          refocusEl.focus();
          try {
            if (selectionStart !== null && selectionEnd !== null && 'setSelectionRange' in refocusEl) {
              refocusEl.setSelectionRange(selectionStart, selectionEnd);
            }
          } catch (_) {}
        }
        // Do not adjust window scroll here; it can cause jump-to-top during typing
      });
    }
  }, [selectedBlockId, lessonBlocks, lessonPages, currentPageIndex]);

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

  // Enhanced save system with proper publication status
  const saveDraft = async () => {
    if (!user?.uid) {
      showNotification('error', 'Please log in to save drafts');
      return;
    }

    try {
      setSaveStatus('saving');
      
      // Persist all pages for both tiers; fall back to single page if empty
      const normalizedFreePages = (currentTier === 'free' ? lessonPages : freePages).length > 0
        ? (currentTier === 'free' ? lessonPages : freePages)
        : [{ id: 'page-1', title: lessonTitle, blocks: lessonBlocks.length > 0 ? lessonBlocks : [{ id: 'block-1', type: 'heading', content: { text: lessonTitle || 'New Lesson' } }] }];
      const normalizedPremiumPages = (currentTier === 'premium' ? lessonPages : premiumPages).length > 0
        ? (currentTier === 'premium' ? lessonPages : premiumPages)
        : normalizedFreePages;

      const lessonData = {
        id: currentDraftId || generateId(),
        title: lessonTitle || 'Untitled Draft',
        description: lessonDescription || 'Draft lesson description',
        contentVersions: {
          free: {
            title: lessonTitle || 'Untitled Draft',
            description: lessonDescription || 'Draft lesson description',
            pages: normalizedFreePages.map(p => ({ ...p, blocks: p.blocks?.map(b => ({ ...b })) }))
          },
          premium: {
            title: lessonTitle || 'Untitled Draft',
            description: lessonDescription || 'Draft lesson description', 
            pages: normalizedPremiumPages.map(p => ({ ...p, blocks: p.blocks?.map(b => ({ ...b })) }))
          }
        },
        pages: normalizedFreePages.map(p => ({ ...p, blocks: p.blocks?.map(b => ({ ...b })) })), // Root-level compatibility
        metadata: {
          lessonType: 'concept_explanation',
          estimatedTimeMinutes: 15,
          xpAward: 10,
          category: selectedModule || 'General',
          tags: [],
          blocksCount: lessonBlocks.length,
          lastEditedAt: new Date().toISOString()
        },
        // Visual customization fields
        icon: lessonIcon || undefined,
        paletteIndex: lessonPaletteIndex,
        customColors: useCustomColors ? customCardColors : undefined,
        // Mark as draft - not published
        status: 'draft',
        published: false,
        isPublished: false
      };

      // Before saving, update the current tier's pages
      if (currentTier === 'free') setFreePages(lessonPages);
      if (currentTier === 'premium') setPremiumPages(lessonPages);

      const result = await draftService.saveDraft(user.uid, lessonData);
      setCurrentDraftId(result.id);
      setSaveStatus('saved');
      setLastSaved(new Date());
      showNotification('success', 'Draft saved successfully!');
      
    } catch (error) {
      logger.error('Error saving draft:', error);
      setSaveStatus('error');
      showNotification('error', 'Failed to save draft');
    }
  };

  // Enhanced publish function with proper status setting
  const publishDraft = async () => {
    if (!currentDraftId) {
      showNotification('error', 'No draft to publish');
      return;
    }

    if (!lessonTitle.trim()) {
      showNotification('error', 'Please add a lesson title before publishing');
      return;
    }

    try {
      setSaveStatus('saving');
      showNotification('info', 'Publishing lesson...');

      // Import the adminService dynamically
      const adminServiceModule = await import('../../services/adminService');
      const { createLesson } = adminServiceModule;

      const lessonData = {
        title: lessonTitle,
        description: lessonDescription,
        content: (currentTier === 'free' ? lessonPages : freePages).map(p => ({ ...p, blocks: p.blocks?.map(b => ({ ...b })) })),
        premiumContent: (currentTier === 'premium' ? lessonPages : premiumPages).map(p => ({ ...p, blocks: p.blocks?.map(b => ({ ...b })) })),
        contentVersions: {
          free: {
            title: lessonTitle,
            description: lessonDescription,
            pages: (currentTier === 'free' ? lessonPages : freePages).map(p => ({ ...p, blocks: p.blocks?.map(b => ({ ...b })) }))
          },
          premium: {
            title: lessonTitle,
            description: lessonDescription,
            pages: (currentTier === 'premium' ? lessonPages : premiumPages).map(p => ({ ...p, blocks: p.blocks?.map(b => ({ ...b })) }))
          }
        },
        estimatedTimeMinutes: 15,
        xpAward: 10,
        category: selectedModule || 'General',
        tags: [],
        // Visual customization fields
        icon: lessonIcon || undefined,
        paletteIndex: lessonPaletteIndex,
        customColors: useCustomColors ? customCardColors : undefined,
        // FIXED: Properly mark as published
        status: 'published',
        published: true,
        isPublished: true,
        publishedAt: new Date(),
        publishedBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      };

      // Default path and module for new lessons
      const defaultPathId = 'ai-fundamentals';
      const defaultModuleId = 'intro-to-ai';

      await createLesson(defaultPathId, defaultModuleId, lessonData, user.uid);
      
      // Delete the draft after successful publication
      await draftService.deleteDraft(user.uid, currentDraftId);
      
      setSaveStatus('saved');
      setLastSaved(new Date());
      showNotification('success', '🎉 Lesson published successfully! It will now appear on the lessons page.');
      
      // Clear the current draft ID since it's now published
      setCurrentDraftId(null);
      
    } catch (error) {
      logger.error('Error publishing lesson:', error);
      setSaveStatus('error');
      showNotification('error', `Failed to publish lesson: ${error.message}`);
    }
  };

  // Direct update for published lessons (bypasses draft system)
  const updatePublishedLesson = async () => {
    const editingLesson = location.state?.editingLesson;
    
    logger.info('=== Update Published Lesson Debug ===');
    logger.info('Location state:', location.state);
    logger.info('Editing lesson:', editingLesson);
    logger.info('Required fields check:');
    logger.info('- pathId:', editingLesson?.pathId);
    logger.info('- moduleId:', editingLesson?.moduleId);  
    logger.info('- lesson id:', editingLesson?.id);
    logger.info('=====================================');
    
    if (!editingLesson) {
      showNotification('error', 'No lesson information found. Please try editing the lesson again from the admin dashboard.');
      return;
    }
    
    if (!editingLesson.pathId || !editingLesson.moduleId || !editingLesson.id) {
      logger.error('Missing lesson information:', {
        pathId: editingLesson.pathId,
        moduleId: editingLesson.moduleId,
        id: editingLesson.id,
        fullLesson: editingLesson
      });
      
      showNotification('error', `Missing lesson information: ${!editingLesson.pathId ? 'pathId ' : ''}${!editingLesson.moduleId ? 'moduleId ' : ''}${!editingLesson.id ? 'lesson id' : ''}`);
      return;
    }

    if (!user?.uid) {
      showNotification('error', 'User not authenticated');
      return;
    }

    try {
      setSaveStatus('saving');
      showNotification('info', 'Updating lesson...');
      
      // Import the adminService dynamically
      const adminServiceModule = await import('../../services/adminService');
      const { updateLesson } = adminServiceModule;
      
      if (!updateLesson) {
        throw new Error('updateLesson function not found in adminService');
      }
      
      const lessonData = {
        title: lessonTitle,
        description: lessonDescription,
        content: freePages,
        premiumContent: premiumPages,
        contentVersions: {
          free: {
            title: lessonTitle,
            description: lessonDescription,
            pages: freePages
          },
          premium: {
            title: lessonTitle,
            description: lessonDescription,
            pages: premiumPages
          }
        },
        estimatedTimeMinutes: 15,
        xpAward: 10,
        category: selectedModule || 'General',
        tags: [],
        // Visual customization fields
        icon: lessonIcon || undefined,
        paletteIndex: lessonPaletteIndex,
        customColors: useCustomColors ? customCardColors : undefined,
        // FIXED: Maintain the original publication status unless explicitly changed
        status: editingLesson.status || 'published',
        published: editingLesson.published !== false, // Default to true if not explicitly false
        isPublished: editingLesson.isPublished !== false,
        updatedAt: new Date(),
        updatedBy: user.uid,
        version: (editingLesson.version || 1) + 1
      };

      logger.info('Updating lesson with data:', {
        pathId: editingLesson.pathId,
        moduleId: editingLesson.moduleId,
        lessonId: editingLesson.id,
        dataKeys: Object.keys(lessonData),
        publicationStatus: {
          status: lessonData.status,
          published: lessonData.published,
          isPublished: lessonData.isPublished
        }
      });

      await updateLesson(editingLesson.pathId, editingLesson.moduleId, editingLesson.id, lessonData);
      
      setSaveStatus('saved');
      setLastSaved(new Date());
      showNotification('success', 'Lesson updated successfully! Changes are now live.');
      
    } catch (error) {
      logger.error('Error updating published lesson:', error);
      setSaveStatus('error');
      showNotification('error', `Failed to update lesson: ${error.message}`);
    }
  };

  // Function to toggle publication status
  const togglePublicationStatus = async () => {
    const editingLesson = location.state?.editingLesson;
    
    if (!editingLesson) {
      showNotification('error', 'No lesson to toggle publication status');
      return;
    }

    const isCurrentlyPublished = editingLesson.status === 'published' || editingLesson.published === true;
    const newStatus = isCurrentlyPublished ? 'draft' : 'published';
    
    try {
      // Update the lesson in state
      const updatedLesson = {
        ...editingLesson,
        status: newStatus,
        published: !isCurrentlyPublished,
        isPublished: !isCurrentlyPublished
      };
      
      // Update the lesson in database
      await updatePublishedLesson();
      
      showNotification('success', `Lesson ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`);
    } catch (error) {
      logger.error('Error toggling publication status:', error);
      showNotification('error', 'Failed to update publication status');
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

  // Enhanced preview modal component with better functionality
  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden mx-4 border border-gray-700 shadow-2xl">
        <div className="flex flex-col h-full max-h-[95vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                <EyeIcon className="w-6 h-6 mr-2 text-blue-400" />
                Lesson Preview
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Preview how your lesson will appear to students
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  // Open in full lesson viewer
                  const previewUrl = `/lessons/preview?data=${encodeURIComponent(JSON.stringify({
                    title: lessonTitle,
                    description: lessonDescription,
                    pages: lessonPages,
                    isPreview: true
                  }))}`;
                  window.open(previewUrl, '_blank');
                }}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex items-center space-x-2"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                <span>Open Full Preview</span>
              </button>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
          
          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-slate-900 to-black">
            <div className="p-8 max-w-4xl mx-auto">
              {/* Lesson Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                  {lessonTitle || 'Untitled Lesson'}
                </h1>
                {lessonDescription && (
                  <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                    {lessonDescription}
                  </p>
                )}
                <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-400">
                  <span className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {Math.max(lessonBlocks.length * 2, 5)} min
                  </span>
                  <span className="flex items-center">
                    <BookOpenIcon className="w-4 h-4 mr-1" />
                    {lessonBlocks.length} sections
                  </span>
                  <span className="flex items-center">
                    <StarIcon className="w-4 h-4 mr-1" />
                    {lessonBlocks.length * 10} XP
                  </span>
                </div>
              </div>
              
              {/* Content Blocks */}
              <div className="space-y-8">
                {lessonBlocks.length > 0 ? (
                  lessonBlocks.map((block, index) => (
                    <div key={block.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                      <div className="mb-2">
                        <span className="text-xs text-blue-400 font-medium bg-blue-400/10 px-2 py-1 rounded-md">
                          {block.type.replace(/[_-]/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <ContentBlockRenderer
                        block={block}
                        onComplete={() => {}}
                        onInteraction={() => {}}
                        isPreview={true}
                        config={{
                          showProgress: false,
                          enableInteraction: false,
                          autoplay: false
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-600 text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Content Yet</h3>
                    <p className="text-gray-500">Add some content blocks to see your lesson preview</p>
                  </div>
                )}
              </div>
              
              {/* Lesson Footer */}
              {lessonBlocks.length > 0 && (
                <div className="mt-12 text-center">
                  <div className="bg-green-600/10 border border-green-600/20 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-green-400 mb-2">🎉 Lesson Complete!</h3>
                    <p className="text-green-300">
                      Students will earn {lessonBlocks.length * 10} XP for completing this lesson
                    </p>
                  </div>
                </div>
              )}
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
    // Keep quiz in editing mode when selected to avoid input remounts while typing
    const isEditing = block.type === 'quiz' ? (editingBlockId === block.id || isSelected) : (editingBlockId === block.id);
    
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
                    onChange={(e) => {
                      e.stopPropagation();
                      handleInlineEdit(block.id, 'text', e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Enter heading..."
                    autoFocus
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setEditingBlockId(null);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    type="button"
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
                    ref={(el) => {
                      if (el && isEditing) {
                        // Focus and move cursor to end
                        setTimeout(() => {
                          el.focus();
                          // If the content is placeholder text, start with empty field
                          const isPlaceholder = !block.content.text || 
                                              block.content.text === 'Double-click to add text...' ||
                                              block.content.text.trim() === '';
                          
                          if (isPlaceholder) {
                            // Don't call handleInlineEdit here to avoid re-render loop
                            el.value = '';
                            el.setSelectionRange(0, 0);
                          } else {
                            const textLength = el.value.length;
                            el.setSelectionRange(textLength, textLength);
                          }
                          
                          // Force text direction
                          el.style.direction = 'ltr';
                          el.style.textAlign = 'left';
                          el.style.unicodeBidi = 'normal';
                        }, 100);
                      }
                    }}
                    value={block.content.text === 'Double-click to add text...' ? '' : (block.content.text || '')}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleInlineEdit(block.id, 'text', e.target.value);
                      
                      // Maintain text direction
                      e.target.style.direction = 'ltr';
                      e.target.style.textAlign = 'left';
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => {
                      e.stopPropagation();
                      // Only handle cursor positioning, no state updates
                      const textLength = e.target.value.length;
                      e.target.setSelectionRange(textLength, textLength);
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white min-h-[80px] whitespace-pre-wrap paragraph-editor"
                    placeholder="Enter your lesson content here..."
                    autoFocus
                    dir="ltr"
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      fontFamily: 'inherit',
                      lineHeight: '1.5',
                      direction: 'ltr',
                      textAlign: 'left',
                      unicodeBidi: 'normal',
                      writingMode: 'horizontal-tb'
                    }}
                    onPaste={(e) => {
                      e.stopPropagation();
                      // Preserve formatting from pasted content
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text/plain');
                      const currentText = e.target.value;
                      const selectionStart = e.target.selectionStart;
                      const selectionEnd = e.target.selectionEnd;
                      
                      const newText = currentText.substring(0, selectionStart) + 
                                    pastedText + 
                                    currentText.substring(selectionEnd);
                      
                      handleInlineEdit(block.id, 'text', newText);
                      
                      // Set cursor position after paste
                      setTimeout(() => {
                        const newPosition = selectionStart + pastedText.length;
                        e.target.setSelectionRange(newPosition, newPosition);
                      }, 0);
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Line breaks and formatting will be preserved
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setEditingBlockId(null);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      type="button"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="text-gray-300 cursor-pointer whitespace-pre-wrap leading-relaxed"
                  onDoubleClick={() => setEditingBlockId(block.id)}
                  dir="ltr"
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    lineHeight: '1.6',
                    direction: 'ltr',
                    textAlign: 'left',
                    unicodeBidi: 'normal'
                  }}
                >
                  {block.content.text || (
                    <span className="italic text-gray-500">
                      Double-click to add text...
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
          
          {block.type === 'image' && (
            <div className="w-full text-center">
              {block.content.src ? (
                <div className="relative group">
                  <img 
                    src={block.content.src} 
                    alt={block.content.alt || 'Uploaded image'} 
                    className="max-h-40 mx-auto rounded cursor-pointer"
                    onDoubleClick={() => setEditingBlockId(block.id)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBlockId(block.id);
                          setSelectedBlock(block);
                          
                          // Trigger file dialog with proper user interaction
                          setTimeout(() => {
                            const input = fileInputRef.current;
                            if (input) {
                              input.value = '';
                              // Direct click should work best for file inputs
                              input.click();
                            }
                          }, 100);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        type="button"
                      >
                        Change Image
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInlineEdit(block.id, 'src', '');
                          handleInlineEdit(block.id, 'alt', '');
                          handleInlineEdit(block.id, 'fileName', '');
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-lg py-8 cursor-pointer hover:border-gray-500 transition-colors relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlockId(block.id);
                    setSelectedBlock(block);
                    openFilePicker(fileInputRef, 'image/*', (file) => handleFileUpload(file, block.id, 'image'));
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.add('border-blue-500', 'bg-blue-500/10');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-500/10');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-500/10');
                    
                    const files = Array.from(e.dataTransfer.files);
                    const imageFile = files.find(file => file.type.startsWith('image/'));
                    
                    if (imageFile) {
                      setSelectedBlockId(block.id);
                      setSelectedBlock(block);
                      handleFileUpload(imageFile, block.id, 'image');
                    } else {
                      showNotification('error', 'Please drop an image file');
                    }
                  }}
                >
                  <PhotoIcon className="w-12 h-12 mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-500">Click to select or drag & drop an image</p>
                  <p className="text-gray-400 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              
              {/* Image editing mode */}
              {isEditing && (
                <div className="mt-4 space-y-3 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Alt Text</label>
                    <input
                      type="text"
                      value={block.content.alt || ''}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleInlineEdit(block.id, 'alt', e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Describe the image for accessibility..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Caption (Optional)</label>
                    <input
                      type="text"
                      value={block.content.caption || ''}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleInlineEdit(block.id, 'caption', e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Add a caption for the image..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBlockId(block.id);
                        setSelectedBlock(block);
                        const input = fileInputRef.current;
                        if (input) {
                          // Reset the input to ensure change events fire even for same file
                          input.value = '';
                          // Simple direct click is most reliable for file inputs
                          try {
                            input.click();
                          } catch (error) {
                            console.warn('File picker failed:', error);
                            // Fallback approaches
                            input.focus();
                            input.click();
                          }
                        }
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      type="button"
                    >
                      {block.content.src ? 'Change Image' : 'Upload Image'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setEditingBlockId(null);
                      }}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      type="button"
                    >
                      Done
                    </button>
                  </div>
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
                      onChange={(e) => {
                        e.stopPropagation();
                        handleInlineEdit(block.id, 'question', e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      data-block-input={`quiz-question-${block.id}`}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Enter your question..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Options</label>
                    {block.content.options.map((option, index) => (
                      <div key={`${block.id}-option-${index}`} className="flex items-center mb-2">
                        <input
                          type="radio"
                          name={`correct-${block.id}`}
                          checked={block.content.correctAnswer === index}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleInlineEdit(block.id, 'correctAnswer', index);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            e.stopPropagation();
                            const newOptions = [...block.content.options];
                            newOptions[index] = e.target.value;
                            handleInlineEdit(block.id, 'options', newOptions);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                          data-block-input={`quiz-option-${block.id}-${index}`}
                          className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white"
                          placeholder={`Option ${index + 1}`}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const newOptions = block.content.options.filter((_, i) => i !== index);
                            handleInlineEdit(block.id, 'options', newOptions);
                            if (block.content.correctAnswer === index) {
                              handleInlineEdit(block.id, 'correctAnswer', 0);
                            }
                          }}
                          className="ml-2 p-1 text-red-400 hover:text-red-300"
                          type="button"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const newOptions = [...block.content.options, `Option ${block.content.options.length + 1}`];
                        handleInlineEdit(block.id, 'options', newOptions);
                      }}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      type="button"
                    >
                      Add Option
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Explanation</label>
                    <textarea
                      value={block.content.explanation}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleInlineEdit(block.id, 'explanation', e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      data-block-input={`quiz-explanation-${block.id}`}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20"
                      placeholder="Explain the correct answer..."
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setEditingBlockId(null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    type="button"
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
                  {/* Inline video preview */}
                  <div className="rounded-lg overflow-hidden bg-gray-800">
                    <video
                      className="w-full h-auto"
                      controls
                      preload="metadata"
                      src={block.content.src}
                    />
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-gray-300 text-sm">Video: {block.content.title || 'Untitled'}</p>
                    <p className="text-gray-500 text-xs">{block.content.fileName || 'video file'}</p>
                  </div>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-lg py-8 cursor-pointer hover:border-gray-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlockId(block.id);
                    setSelectedBlock(block);
                    openFilePicker(videoInputRef, 'video/*', (file) => handleFileUpload(file, block.id, 'video'));
                  }}
                >
                  <VideoCameraIcon className="w-12 h-12 mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-500">Click to add video</p>
                </div>
              )}
            </div>
          )}
          
          {block.type === 'podcast' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Audio File</label>
                <div className="space-y-3">
                  {block.content.audioSrc ? (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                            🎧
                          </div>
                          <div>
                            <p className="text-white font-medium">{block.content.fileName || 'Audio File'}</p>
                            {block.content.duration && (
                              <p className="text-gray-400 text-sm">Duration: {block.content.duration}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              if (block.content.audioSrc) {
                                const audio = new Audio(block.content.audioSrc);
                                audio.play().catch(e => console.warn('Audio play failed:', e));
                              }
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                            type="button"
                          >
                            <span>▶️</span>
                            <span>Test</span>
                          </button>
                          <button
                            onClick={async () => {
                              // Delete from Firebase Storage if uploaded
                              if (block.content.uploadPath) {
                                await deleteUploadedFile(block.content.uploadPath);
                              }
                              handleInlineEdit(block.id, 'audioSrc', '');
                              handleInlineEdit(block.id, 'fileName', '');
                              handleInlineEdit(block.id, 'duration', '');
                              handleInlineEdit(block.id, 'uploadPath', '');
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      {/* Audio Preview */}
                      <audio 
                        controls 
                        className="w-full"
                        src={block.content.audioSrc}
                        onError={() => showNotification('warning', 'Audio file may not be compatible with this browser')}
                      >
                        Your browser does not support the audio element.
                      </audio>
                      
                      {block.content.uploadPath && (
                        <div className="mt-2 text-xs text-green-400 flex items-center space-x-1">
                          <span>✅</span>
                          <span>Uploaded to Firebase Storage</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                      {uploadingFiles.has(block.id) ? (
                        <div className="space-y-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                          <p className="text-gray-400">Uploading audio to Firebase Storage...</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-4xl">🎧</div>
                          <p className="text-gray-400">Upload audio file for podcast block</p>
                          <button
                            onClick={() => {
                              setSelectedBlockId(block.id);
                              setSelectedBlock(block);
                              openFilePicker(podcastInputRef, 'audio/*,.mp3,.wav,.m4a,.aac,.ogg', (file) => handleFileUpload(file, block.id, 'audio'));
                            }}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
                            type="button"
                          >
                            <CloudArrowUpIcon className="w-5 h-5" />
                            <span>Upload Audio</span>
                          </button>
                          <p className="text-xs text-gray-500">
                            Supports MP3, WAV, M4A files. Will be uploaded to Firebase Storage.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Podcast Title</label>
                <input
                  type="text"
                  value={block.content.title || ''}
                  onChange={(e) => handleInlineEdit(block.id, 'title', e.target.value)}
                  placeholder="Enter podcast episode title..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={block.content.description || ''}
                  onChange={(e) => handleInlineEdit(block.id, 'description', e.target.value)}
                  placeholder="Describe what this podcast episode covers..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
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

  // Add switchTier function:
  const switchTier = (newTier) => {
    if (newTier === currentTier) return;
    if (currentTier === 'free') {
      setFreePages(lessonPages);
      setLessonPages(premiumPages);
    } else {
      setPremiumPages(lessonPages);
      setLessonPages(freePages);
    }
    setCurrentTier(newTier);
    showNotification('info', `Switched to ${newTier} tier editing`);
    triggerUnsavedState();
  };

  // Listen for preview messages from admin dashboard (safe now that live editing is disabled)
  useEffect(() => {
    const handlePreviewMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data?.type === 'PREVIEW_LESSON' && event.data?.lesson) {
        const lesson = event.data.lesson;
        setLessonTitle(lesson.title || 'Preview Lesson');
        setLessonDescription(lesson.description || '');
        
        // Load lesson content if available
        if (lesson.pages && Array.isArray(lesson.pages)) {
          setLessonPages(lesson.pages);
        } else if (lesson.slides && Array.isArray(lesson.slides)) {
          // Convert slides to pages format
          const convertedPages = [{
            id: 'preview-page',
            title: 'Preview Content',
            blocks: lesson.slides.map(slide => ({
              id: slide.id || generateId(),
              type: slide.type === 'concept' ? 'paragraph' : slide.type,
              content: slide.content || {}
            }))
          }];
          setLessonPages(convertedPages);
        }
        
        // Show preview modal
        setShowPreviewModal(true);
      }
    };

    window.addEventListener('message', handlePreviewMessage);
    return () => window.removeEventListener('message', handlePreviewMessage);
  }, []);

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
            {/* Always Visible Lesson Title */}
            <div className="p-4 border-b border-gray-700">
              <div>
                <label 
                  htmlFor="lesson-title-input"
                  className="block text-sm font-medium mb-1 text-gray-300"
                >
                  Lesson Title
                </label>
                <input
                  ref={lessonTitleInputRef}
                  id="lesson-title-input"
                  type="text"
                  value={lessonTitle}
                  onChange={handleTitleChange}
                  onFocus={handleTitleFocus}
                  onBlur={handleTitleBlur}
                  onClick={(e) => {
                    logger.log('🔍 Title input clicked, focusing...');
                    e.stopPropagation();
                    lessonTitleInputRef.current?.focus();
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                  placeholder="Enter lesson title..."
                  tabIndex={0}
                  autoComplete="off"
                />
              </div>
            </div>
            
            {/* Lesson Settings */}
            <div className="p-4 border-b border-gray-700">
              <button
                onClick={() => setShowLessonSettings(!showLessonSettings)}
                className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <span className="font-medium">More Settings</span>
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              
              {showLessonSettings && (
                <div className="mt-3 space-y-4">
                  {/* Background Options - Enhanced with animations */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Lesson Background</label>
                    <div className="grid grid-cols-2 gap-2">
                      {backgroundOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => setLessonBackground(option.id)}
                          className={`p-2 rounded-lg border-2 transition-all ${
                            lessonBackground === option.id
                              ? 'border-blue-500 bg-blue-900'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                          title={option.description}
                        >
                          <div className={`w-full h-4 rounded mb-1 ${option.preview}`}></div>
                          <span className="text-xs">{option.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Animation */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Animation</label>
                    <select
                      value={backgroundAnimation}
                      onChange={(e) => setBackgroundAnimation(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                    >
                      {animationOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name} - {option.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Background Image Upload */}
                  {lessonBackground === 'custom-image' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Background Image</label>
                      <input
                        ref={backgroundImageRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleBackgroundImageUpload(e.target.files[0]);
                          }
                        }}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  )}

                  {/* File upload inputs with proper event handling */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && selectedBlockId) {
                        handleFileUpload(file, selectedBlockId, 'image');
                      }
                      // Reset input to allow same file selection
                      e.target.value = '';
                    }}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                  />
                  
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && selectedBlockId) {
                        handleFileUpload(file, selectedBlockId, 'video');
                      }
                      // Reset input to allow same file selection
                      e.target.value = '';
                    }}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                  />
                  
                  <input
                    ref={podcastInputRef}
                    type="file"
                    accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && selectedBlockId) {
                        handleFileUpload(file, selectedBlockId, 'audio');
                      }
                      // Reset input to allow same file selection
                      e.target.value = '';
                    }}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      key="lesson-description-input"
                      value={lessonDescription}
                      onChange={(e) => {
                        setLessonDescription(e.target.value);
                        triggerUnsavedState();
                      }}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a module...</option>
                      {availableModules.map(module => (
                        <option key={module.id} value={module.id}>{module.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Add toggle UI in showLessonSettings section, after Description textarea: */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Editing Tier</label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => switchTier('free')}
                        className={`flex-1 py-2 rounded-lg ${currentTier === 'free' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
                      >
                        Free
                      </button>
                      <button
                        onClick={() => switchTier('premium')}
                        className={`flex-1 py-2 rounded-lg ${currentTier === 'premium' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
                      >
                        Premium
                      </button>
                    </div>
                  </div>

                  {/* NEW: Card Visual Customization */}
                  <div className="border-t border-gray-600 pt-4">
                    <h3 className="text-sm font-medium mb-3 text-purple-300">🎨 Card Appearance</h3>
                    
                    {/* Icon Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Lesson Icon</label>
                      <div className="grid grid-cols-8 gap-1 p-2 bg-gray-800 rounded-lg max-h-24 overflow-y-auto">
                        {popularIcons.map(icon => (
                          <button
                            key={icon}
                            onClick={() => {
                              setLessonIcon(icon);
                              triggerUnsavedState();
                            }}
                            className={`w-8 h-8 rounded flex items-center justify-center text-lg transition-all ${
                              lessonIcon === icon
                                ? 'bg-blue-600 ring-2 ring-blue-400'
                                : 'hover:bg-gray-700'
                            }`}
                            title={`Use ${icon} icon`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={lessonIcon}
                        onChange={(e) => {
                          setLessonIcon(e.target.value);
                          triggerUnsavedState();
                        }}
                        placeholder="Custom emoji or leave blank"
                        className="w-full mt-2 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
                      />
                    </div>

                    {/* Color Palette Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Color Theme</label>
                      <div className="grid grid-cols-2 gap-2">
                        {colorPalettes.map((palette, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setLessonPaletteIndex(index);
                              setUseCustomColors(false);
                              triggerUnsavedState();
                            }}
                            className={`p-2 rounded-lg border-2 transition-all ${
                              !useCustomColors && lessonPaletteIndex === index
                                ? 'border-blue-500 bg-blue-900/50'
                                : 'border-gray-600 hover:border-gray-500'
                            }`}
                            title={palette.name}
                          >
                            <div className={`w-full h-4 rounded mb-1 ${palette.gradient.replace('/85', '')}`}></div>
                            <span className="text-xs">{palette.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors Toggle */}
                    <div className="mb-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useCustomColors}
                          onChange={(e) => {
                            setUseCustomColors(e.target.checked);
                            triggerUnsavedState();
                          }}
                          className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">Use custom colors (advanced)</span>
                      </label>
                    </div>
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
            <div className="flex items-center space-x-4">
              {/* Save Status */}
              <div className="flex items-center space-x-2 bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700">
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
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
                  title="Preview lesson"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>Preview</span>
                </button>

                {/* Show different buttons based on whether we're editing a published lesson or a draft */}
                {location.state?.editingLesson && location.state.editingLesson.isPublished ? (
                  // Editing published lesson - show Update and Publication Toggle buttons
                  <div className="flex items-center space-x-2">
                    {/* Publication Status Toggle */}
                    <button
                      onClick={togglePublicationStatus}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                        location.state.editingLesson.status === 'published' || location.state.editingLesson.published
                          ? 'bg-orange-600 hover:bg-orange-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                      title={
                        location.state.editingLesson.status === 'published' || location.state.editingLesson.published
                          ? 'Unpublish lesson (remove from lessons page)'
                          : 'Publish lesson (add to lessons page)'
                      }
                    >
                      {location.state.editingLesson.status === 'published' || location.state.editingLesson.published ? (
                        <>
                          <EyeSlashIcon className="w-4 h-4" />
                          <span>Unpublish</span>
                        </>
                      ) : (
                        <>
                          <EyeIcon className="w-4 h-4" />
                          <span>Publish</span>
                        </>
                      )}
                    </button>
                    
                    {/* Update Button */}
                    <button
                      onClick={updatePublishedLesson}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                      title="Save changes to published lesson"
                    >
                      <CloudArrowUpIcon className="w-4 h-4" />
                      <span>Update Lesson</span>
                    </button>
                  </div>
                ) :
                  // Working with drafts - show both Save Draft and Publish buttons
                  <>
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
                  </>
                }
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
                      <OptimizedStarField starCount={220} opacity={0.6} speed={1.2} size={1} />
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