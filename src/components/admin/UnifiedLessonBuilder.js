import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
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
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';

const UnifiedLessonBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const podcastInputRef = useRef(null);
  
  // Core state
  const [lessonPages, setLessonPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Lesson metadata
  const [lessonTitle, setLessonTitle] = useState('Untitled Lesson');
  const [lessonDescription, setLessonDescription] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [availableModules] = useState([
    { id: 'prompt-engineering', name: 'Prompt Engineering Mastery' },
    { id: 'vibe-coding', name: 'Vibe Coding' },
    { id: 'ai-fundamentals', name: 'AI Fundamentals' },
    { id: 'web-development', name: 'Web Development' },
    { id: 'data-science', name: 'Data Science' }
  ]);
  
  // UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [notification, setNotification] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [showLessonSettings, setShowLessonSettings] = useState(false);
  
  // History
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  
  // Screen size detection
  const [screenSize, setScreenSize] = useState('desktop');
  
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

  const currentPage = lessonPages[currentPageIndex];
  const lessonBlocks = currentPage?.blocks || [];

  // Enhanced block types with podcast support
  const blockTypes = [
    { id: 'heading', name: 'Heading', icon: '📝', color: 'from-blue-500 to-indigo-600', description: 'Title and headings' },
    { id: 'paragraph', name: 'Text', icon: '📄', color: 'from-gray-500 to-slate-600', description: 'Paragraphs and content' },
    { id: 'image', name: 'Image', icon: '🖼️', color: 'from-pink-500 to-rose-600', description: 'Photos and graphics' },
    { id: 'video', name: 'Video', icon: '🎥', color: 'from-red-500 to-orange-600', description: 'Video content' },
    { id: 'podcast', name: 'Podcast', icon: '🎙️', color: 'from-purple-500 to-violet-600', description: 'Audio/Podcast MP4' },
    { id: 'quiz', name: 'Quiz', icon: '❓', color: 'from-amber-500 to-yellow-600', description: 'Multiple choice quiz' },
    { id: 'code-sandbox', name: 'Code', icon: '💻', color: 'from-violet-500 to-purple-600', description: 'Code editor' },
    { id: 'checkbox', name: 'Checklist', icon: '✅', color: 'from-green-500 to-emerald-600', description: 'Interactive checklist' },
    { id: 'fill-blank', name: 'Fill Blanks', icon: '🔤', color: 'from-teal-500 to-cyan-600', description: 'Fill in the blanks' }
  ];

  // Utility functions
  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const generatePageId = () => `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const showNotification = (type, message, duration = 3000) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), duration);
  };

  // File upload handling
  const handleFileUpload = async (file, blockId, fileType) => {
    try {
      const objectUrl = URL.createObjectURL(file);
      const field = fileType === 'image' ? 'src' : fileType === 'video' ? 'src' : 'audioSrc';
      handleInlineEdit(blockId, field, objectUrl);
      handleInlineEdit(blockId, 'fileName', file.name);
      showNotification('success', `${fileType} uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      showNotification('error', `Failed to upload ${fileType}`);
    }
  };

  // Auto-save system
  const triggerAutoSave = useCallback((pages = lessonPages) => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    setSaveStatus('unsaved');
    
    const timer = setTimeout(() => {
      setSaveStatus('saving');
      setTimeout(() => {
        setSaveStatus('saved');
        setLastSaved(new Date());
      }, 800);
    }, 2000);
    
    setAutoSaveTimer(timer);
  }, [autoSaveTimer, lessonPages]);

  // History management
  const saveToHistory = useCallback((newPages) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newPages)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    triggerAutoSave(newPages);
  }, [history, historyIndex, triggerAutoSave]);

  // Initialize with default page
  useEffect(() => {
    if (lessonPages.length === 0) {
      const defaultPage = {
        id: generatePageId(),
        title: 'Introduction',
        blocks: [],
        created: new Date().toISOString()
      };
      setLessonPages([defaultPage]);
    }
  }, [lessonPages.length]);

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
      checkbox: { 
        items: [
          { id: generateId(), text: 'Check this item', checked: false },
          { id: generateId(), text: 'Another item', checked: false }
        ],
        title: 'Checklist'
      },
      'fill-blank': { 
        text: 'Complete this sentence: The sky is {{blue|colorful}} and the grass is {{green|lush}}.', 
        title: 'Fill in the Blanks'
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
    
    if (blockType === 'heading' || blockType === 'paragraph') {
      setTimeout(() => setEditingBlockId(newBlock.id), 100);
    }
    
    showNotification('success', `${blockTypes.find(t => t.id === blockType)?.name} added`);
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
      saveToHistory(newPages);
    }
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newBlocks = Array.from(lessonBlocks);
    const [reorderedItem] = newBlocks.splice(result.source.index, 1);
    newBlocks.splice(result.destination.index, 0, reorderedItem);

    updateCurrentPageBlocks(newBlocks);
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

  // Save lesson
  const saveLesson = async () => {
    try {
      setSaveStatus('saving');
      
      const lessonData = {
        id: generateId(),
        title: lessonTitle,
        description: lessonDescription,
        module: selectedModule,
        pages: lessonPages,
        metadata: {
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          version: '1.0'
        }
      };
      
      setSaveStatus('saved');
      setLastSaved(new Date());
      showNotification('success', 'Lesson saved successfully!');
      
    } catch (error) {
      console.error('Error saving lesson:', error);
      setSaveStatus('error');
      showNotification('error', 'Failed to save lesson');
    }
  };

  // Navigation
  const goBack = () => {
    if (saveStatus === 'unsaved') {
      const confirmLeave = window.confirm('You have unsaved changes. Do you want to save before leaving?');
      if (confirmLeave) {
        saveLesson();
        setTimeout(() => navigateBack(), 1000);
        return;
      }
    }
    navigateBack();
  };

  const navigateBack = () => {
    const fromAdmin = location.state?.fromAdmin || new URLSearchParams(window.location.search).get('fromAdmin');
    if (fromAdmin) {
      navigate('/admin', { state: { activePanel: 'content-creation' } });
    } else {
      navigate('/admin');
    }
  };

  // Enhanced block rendering with full editing capabilities for ALL block types
  const renderBlock = (block) => {
    const isEditing = editingBlockId === block.id;
    const isSelected = selectedBlockId === block.id;
    
    const blockStyle = {
      margin: `${block.styles.marginTop}px 0 ${block.styles.marginBottom}px 0`,
      padding: `${block.styles.padding}px`,
      backgroundColor: block.styles.backgroundColor,
      borderRadius: `${block.styles.borderRadius}px`,
      border: isSelected ? '2px solid #3b82f6' : block.styles.border,
    };

    const BlockWrapper = ({ children }) => (
      <div 
        className={`group relative transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!previewMode) {
            setSelectedBlockId(block.id);
            setSelectedBlock(block);
          }
        }}
      >
        {children}
        
        {!previewMode && isSelected && !isEditing && (
          <div className="absolute top-2 right-2 flex space-x-1 bg-gray-900/95 rounded-lg p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingBlockId(block.id);
              }}
              className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded"
              title="Edit"
            >
              <Cog6ToothIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateBlock(block.id);
              }}
              className="p-1.5 text-green-400 hover:text-green-300 hover:bg-gray-700 rounded"
              title="Duplicate"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteBlock(block.id);
              }}
              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded"
              title="Delete"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );

    switch (block.type) {
      case 'heading':
        return (
          <BlockWrapper>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={block.content.text}
                  onChange={(e) => handleInlineEdit(block.id, 'text', e.target.value)}
                  placeholder="Enter heading text..."
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <select 
                  value={block.content.level}
                  onChange={(e) => handleInlineEdit(block.id, 'level', parseInt(e.target.value))}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
                >
                  <option value={1}>H1 - Main Title</option>
                  <option value={2}>H2 - Section</option>
                  <option value={3}>H3 - Subsection</option>
                  <option value={4}>H4 - Minor Heading</option>
                </select>
                <button
                  onClick={() => setEditingBlockId(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              React.createElement(`h${block.content.level || 2}`, {
                style: blockStyle,
                className: "font-bold cursor-text text-lg sm:text-xl md:text-2xl lg:text-3xl break-words",
                onDoubleClick: () => !previewMode && setEditingBlockId(block.id)
              }, block.content.text)
            )}
          </BlockWrapper>
        );

      case 'paragraph':
        return (
          <BlockWrapper>
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={block.content.text}
                  onChange={(e) => handleInlineEdit(block.id, 'text', e.target.value)}
                  placeholder="Enter your text content..."
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                  autoFocus
                />
                <button
                  onClick={() => setEditingBlockId(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <p 
                style={blockStyle}
                className="cursor-text text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap"
                onDoubleClick={() => !previewMode && setEditingBlockId(block.id)}
              >
                {block.content.text}
              </p>
            )}
          </BlockWrapper>
        );

      case 'image':
        return (
          <BlockWrapper>
            <div style={blockStyle}>
              {isEditing ? (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium flex items-center">
                    <PhotoIcon className="w-5 h-5 mr-2" />
                    Edit Image
                  </h4>
                  
                  {block.content.src ? (
                    <div className="space-y-3">
                      <img 
                        src={block.content.src} 
                        alt={block.content.alt} 
                        className="max-w-full h-auto rounded-lg shadow-lg mx-auto max-h-64"
                      />
                      <p className="text-sm text-gray-400">File: {block.content.fileName}</p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg py-8 px-6 text-center">
                      <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-400">No image selected</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleFileUpload(file, block.id, 'image');
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      <PhotoIcon className="w-4 h-4 mr-2" />
                      Choose Image
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={block.content.alt}
                      onChange={(e) => handleInlineEdit(block.id, 'alt', e.target.value)}
                      placeholder="Alt text (for accessibility)"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                    
                    <input
                      type="text"
                      value={block.content.caption}
                      onChange={(e) => handleInlineEdit(block.id, 'caption', e.target.value)}
                      placeholder="Caption (optional)"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  
                  <button
                    onClick={() => setEditingBlockId(null)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  {block.content.src ? (
                    <div className="space-y-2">
                      <img 
                        src={block.content.src} 
                        alt={block.content.alt} 
                        className="max-w-full h-auto rounded-lg shadow-lg mx-auto cursor-pointer"
                        onDoubleClick={() => !previewMode && setEditingBlockId(block.id)}
                      />
                      {block.content.caption && (
                        <p className="text-xs sm:text-sm text-gray-400">{block.content.caption}</p>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-white/30 rounded-lg py-8 sm:py-12 px-4 sm:px-6 cursor-pointer hover:border-white/50 transition-colors"
                      onDoubleClick={() => !previewMode && setEditingBlockId(block.id)}
                    >
                      <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-400 text-sm sm:text-base">Double-click to add image</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </BlockWrapper>
        );

      case 'video':
        return (
          <BlockWrapper>
            <div style={blockStyle}>
              {isEditing ? (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium flex items-center">
                    <VideoCameraIcon className="w-5 h-5 mr-2" />
                    Edit Video
                  </h4>
                  
                  {block.content.src ? (
                    <div className="space-y-3">
                      <video 
                        src={block.content.src} 
                        controls 
                        className="w-full rounded-lg shadow-lg max-h-64"
                      />
                      <p className="text-sm text-gray-400">File: {block.content.fileName}</p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg py-8 px-6 text-center">
                      <VideoCameraIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-400">No video selected</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    ref={videoInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleFileUpload(file, block.id, 'video');
                    }}
                    accept="video/*"
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <VideoCameraIcon className="w-4 h-4 mr-2" />
                    Choose Video
                  </button>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={block.content.title}
                      onChange={(e) => handleInlineEdit(block.id, 'title', e.target.value)}
                      placeholder="Video title"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                    
                    <textarea
                      value={block.content.description}
                      onChange={(e) => handleInlineEdit(block.id, 'description', e.target.value)}
                      placeholder="Video description"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white h-20 resize-none"
                    />
                  </div>
                  
                  <button
                    onClick={() => setEditingBlockId(null)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {block.content.src ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">{block.content.title}</h3>
                      <video 
                        src={block.content.src} 
                        controls 
                        className="w-full rounded-lg shadow-lg cursor-pointer"
                        onDoubleClick={() => !previewMode && setEditingBlockId(block.id)}
                      />
                      {block.content.description && (
                        <p className="text-sm text-gray-400">{block.content.description}</p>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-white/30 rounded-lg py-8 sm:py-12 px-4 sm:px-6 text-center cursor-pointer hover:border-white/50 transition-colors"
                      onDoubleClick={() => !previewMode && setEditingBlockId(block.id)}
                    >
                      <VideoCameraIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-400 text-sm sm:text-base">Double-click to add video</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </BlockWrapper>
        );

      case 'podcast':
        return (
          <BlockWrapper>
            <div style={blockStyle}>
              {isEditing ? (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium flex items-center">
                    <SpeakerWaveIcon className="w-5 h-5 mr-2" />
                    Edit Podcast
                  </h4>
                  
                  {block.content.audioSrc ? (
                    <div className="space-y-3">
                      <audio 
                        src={block.content.audioSrc} 
                        controls 
                        className="w-full"
                      />
                      <p className="text-sm text-gray-400">File: {block.content.fileName}</p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg py-8 px-6 text-center">
                      <SpeakerWaveIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-400">No podcast selected</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    ref={podcastInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleFileUpload(file, block.id, 'podcast');
                    }}
                    accept="audio/*,video/mp4"
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => podcastInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <SpeakerWaveIcon className="w-4 h-4 mr-2" />
                    Choose Audio/MP4
                  </button>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={block.content.title}
                      onChange={(e) => handleInlineEdit(block.id, 'title', e.target.value)}
                      placeholder="Podcast title"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                    
                    <textarea
                      value={block.content.description}
                      onChange={(e) => handleInlineEdit(block.id, 'description', e.target.value)}
                      placeholder="Episode description"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white h-20 resize-none"
                    />
                  </div>
                  
                  <button
                    onClick={() => setEditingBlockId(null)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {block.content.audioSrc ? (
                    <div className="bg-gradient-to-r from-purple-900/50 to-violet-900/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <SpeakerWaveIcon className="w-6 h-6 text-purple-400" />
                        <div>
                          <h3 className="text-lg font-medium">{block.content.title}</h3>
                        </div>
                      </div>
                      
                      <audio 
                        src={block.content.audioSrc} 
                        controls 
                        className="w-full cursor-pointer"
                        onDoubleClick={() => !previewMode && setEditingBlockId(block.id)}
                      />
                      
                      {block.content.description && (
                        <p className="text-sm text-gray-300">{block.content.description}</p>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-purple-500/30 rounded-lg py-8 sm:py-12 px-4 sm:px-6 text-center cursor-pointer hover:border-purple-500/50 transition-colors bg-purple-900/10"
                      onDoubleClick={() => !previewMode && setEditingBlockId(block.id)}
                    >
                      <SpeakerWaveIcon className="w-12 h-12 mx-auto text-purple-400 mb-3" />
                      <p className="text-purple-300 text-sm sm:text-base">Double-click to add podcast/audio</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </BlockWrapper>
        );

      default:
        return (
          <BlockWrapper>
            <div style={blockStyle} className="text-center text-gray-400 text-sm sm:text-base">
              Block type: {block.type} - Double-click to edit
            </div>
          </BlockWrapper>
        );
    }
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
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                      placeholder="Enter lesson title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={lessonDescription}
                      onChange={(e) => setLessonDescription(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm h-20 resize-none"
                      placeholder="Describe your lesson..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Module</label>
                    <select
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
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

            {/* Block Types */}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Add Content</h3>
              <div className="space-y-2">
                {blockTypes.map(blockType => (
                  <button
                    key={blockType.id}
                    onClick={() => addBlock(blockType.id)}
                    className={`w-full p-3 rounded-lg bg-gradient-to-r ${blockType.color} hover:opacity-90 transition-opacity flex items-center space-x-3`}
                  >
                    <span className="text-lg">{blockType.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">{blockType.name}</div>
                      <div className="text-xs opacity-75">{blockType.description}</div>
                    </div>
                  </button>
                ))}
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

            <div className="flex items-center space-x-4">
              {/* Save Status */}
              <div className="flex items-center space-x-2">
                {saveStatus === 'saving' && (
                  <div className="flex items-center space-x-2 text-blue-400">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Saving...</span>
                  </div>
                )}
                
                {saveStatus === 'saved' && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span className="text-sm">
                      Saved {lastSaved && `at ${lastSaved.toLocaleTimeString()}`}
                    </span>
                  </div>
                )}
                
                {saveStatus === 'unsaved' && (
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span className="text-sm">Unsaved changes</span>
                  </div>
                )}
                
                {saveStatus === 'error' && (
                  <div className="flex items-center space-x-2 text-red-400">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span className="text-sm">Save failed</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  previewMode 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {previewMode ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                <span>{previewMode ? 'Edit Mode' : 'Preview'}</span>
              </button>

              <button
                onClick={saveLesson}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Save Lesson
              </button>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{lessonTitle}</h1>
              {lessonDescription && (
                <p className="text-gray-400">{lessonDescription}</p>
              )}
            </div>

            {/* Blocks */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="blocks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                    onClick={() => {
                      if (!previewMode) {
                        setSelectedBlockId(null);
                        setSelectedBlock(null);
                      }
                    }}
                  >
                    <AnimatePresence>
                      {lessonBlocks.map((block, index) => (
                        <Draggable key={block.id} draggableId={block.id} index={index}>
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className={`transition-all duration-200 ${
                                snapshot.isDragging ? 'shadow-2xl scale-105' : ''
                              }`}
                            >
                              {renderBlock(block)}
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}

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
                )}
              </Droppable>
            </DragDropContext>
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
    </div>
  );
};

export default UnifiedLessonBuilder; 