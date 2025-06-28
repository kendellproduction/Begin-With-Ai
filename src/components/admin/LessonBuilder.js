import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const LessonBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Available content block types
  const blockTypes = [
    { 
      id: 'heading', 
      name: 'Heading', 
      icon: '📝', 
      color: 'from-blue-500 to-indigo-600',
      description: 'Large title text'
    },
    { 
      id: 'paragraph', 
      name: 'Paragraph', 
      icon: '📄', 
      color: 'from-gray-500 to-slate-600',
      description: 'Body text content'
    },
    { 
      id: 'checkbox', 
      name: 'Checkbox', 
      icon: '✅', 
      color: 'from-green-500 to-emerald-600',
      description: 'Interactive checkbox'
    },
    { 
      id: 'fill-blank', 
      name: 'Fill in Blank', 
      icon: '🔤', 
      color: 'from-purple-500 to-violet-600',
      description: 'Text input exercise'
    },
    { 
      id: 'image', 
      name: 'Image', 
      icon: '🖼️', 
      color: 'from-pink-500 to-rose-600',
      description: 'Photo or illustration'
    },
    { 
      id: 'video', 
      name: 'Video', 
      icon: '🎥', 
      color: 'from-red-500 to-orange-600',
      description: 'Video content'
    },
    { 
      id: 'ai-input', 
      name: 'AI Input', 
      icon: '🤖', 
      color: 'from-cyan-500 to-teal-600',
      description: 'OpenAI API interaction'
    },
    { 
      id: 'quiz', 
      name: 'Quiz', 
      icon: '❓', 
      color: 'from-amber-500 to-yellow-600',
      description: 'Multiple choice question'
    },
    { 
      id: 'code-sandbox', 
      name: 'Code Sandbox', 
      icon: '⚡', 
      color: 'from-violet-500 to-purple-600',
      description: 'Interactive coding area'
    }
  ];

  // Current lesson content blocks
  const [contentBlocks, setContentBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  // Generate unique ID for new blocks
  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Show notification helper
  const showNotification = (type, message, duration = 3000) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), duration);
  };

  // Auto-save with debouncing
  const triggerAutoSave = () => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    
    setSaveStatus('unsaved');
    
    const timer = setTimeout(() => {
      saveLesson();
    }, 2000);
    
    setAutoSaveTimer(timer);
  };

  // Save lesson
  const saveLesson = () => {
    setSaveStatus('saving');
    // Simulate save
    setTimeout(() => {
      setSaveStatus('saved');
      showNotification('success', 'Lesson saved successfully!');
    }, 1000);
  };

  // Enhanced back navigation
  const goBack = () => {
    if (saveStatus === 'unsaved') {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Do you want to save before leaving?'
      );
      if (confirmLeave) {
        saveLesson();
        setTimeout(() => navigateBack(), 1000);
        return;
      }
    }
    navigateBack();
  };

  const navigateBack = () => {
    // Check if we came from admin panel
    const fromAdmin = location.state?.fromAdmin || 
                      new URLSearchParams(window.location.search).get('fromAdmin');
    if (fromAdmin) {
      navigate('/admin', { state: { activePanel: 'content-creation' } });
    } else {
      navigate('/admin');
    }
  };

  // Add new content block
  const addBlock = (blockType) => {
    const newBlock = {
      id: generateId(),
      type: blockType.id,
      content: getDefaultContent(blockType.id),
      styles: getDefaultStyles(blockType.id),
      metadata: {
        name: blockType.name,
        icon: blockType.icon,
        created: new Date().toISOString()
      }
    };

    setContentBlocks([...contentBlocks, newBlock]);
    setSelectedBlock(newBlock);
    setShowStylePanel(true);
    
    // Auto-focus on the new block for editing
    if (blockType.id === 'heading' || blockType.id === 'paragraph') {
      setTimeout(() => setEditingBlockId(newBlock.id), 100);
    }
    
    triggerAutoSave();
  };

  // Enhanced inline editing functionality
  const handleInlineEdit = (blockId, field, value) => {
    setContentBlocks(contentBlocks.map(block => 
      block.id === blockId 
        ? { 
            ...block, 
            content: { ...block.content, [field]: value },
            metadata: { ...block.metadata, updated: new Date().toISOString() }
          } 
        : block
    ));
    triggerAutoSave();
  };

  // Get default content for block type
  const getDefaultContent = (type) => {
    const defaults = {
      'heading': { text: 'Click to edit heading', level: 'h2' },
      'paragraph': { text: 'Click to edit this paragraph. Start typing your content here...' },
      'checkbox': { label: 'Check this option', checked: false },
      'fill-blank': { question: 'Complete this sentence: AI is ___', answer: 'intelligent' },
      'image': { src: '', alt: '', caption: 'Add image caption...' },
      'video': { src: '', title: 'Video Title', autoplay: false },
      'ai-input': { prompt: 'Ask AI a question...', model: 'gpt-3.5-turbo' },
      'quiz': { question: 'What is AI?', options: ['Artificial Intelligence', 'Automatic Input', 'Advanced Interface'], correct: 0 },
      'code-sandbox': { language: 'javascript', code: '// Write your code here\nconsole.log("Hello World!");' }
    };
    return defaults[type] || {};
  };

  // Get default styles for block type
  const getDefaultStyles = (type) => {
    const baseStyles = {
      marginTop: '16px',
      marginBottom: '16px',
      marginLeft: '0px',
      marginRight: '0px',
      paddingTop: '16px',
      paddingBottom: '16px',
      paddingLeft: '16px',
      paddingRight: '16px',
      fontSize: '16px',
      fontWeight: 'normal',
      textAlign: 'left',
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropBlur: '12px'
    };

    const typeSpecific = {
      'heading': { fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' },
      'paragraph': { fontSize: '16px', lineHeight: '1.6' },
      'ai-input': { backgroundColor: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.3)' }
    };

    return { ...baseStyles, ...(typeSpecific[type] || {}) };
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newBlocks = Array.from(contentBlocks);
    const [reorderedItem] = newBlocks.splice(result.source.index, 1);
    newBlocks.splice(result.destination.index, 0, reorderedItem);

    setContentBlocks(newBlocks);
    triggerAutoSave();
  };

  // Update block content
  const updateBlockContent = (blockId, newContent) => {
    setContentBlocks(contentBlocks.map(block => 
      block.id === blockId ? { ...block, content: { ...block.content, ...newContent } } : block
    ));
    triggerAutoSave();
  };

  // Update block styles
  const updateBlockStyles = (blockId, newStyles) => {
    setContentBlocks(contentBlocks.map(block => 
      block.id === blockId ? { ...block, styles: { ...block.styles, ...newStyles } } : block
    ));
  };

  // Delete block
  const deleteBlock = (blockId) => {
    setContentBlocks(contentBlocks.filter(block => block.id !== blockId));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
      setShowStylePanel(false);
    }
    triggerAutoSave();
    showNotification('success', 'Block deleted');
  };

  // Duplicate block
  const duplicateBlock = (blockId) => {
    const blockToDuplicate = contentBlocks.find(b => b.id === blockId);
    if (!blockToDuplicate) return;

    const duplicatedBlock = {
      ...JSON.parse(JSON.stringify(blockToDuplicate)),
      id: generateId(),
      metadata: {
        ...blockToDuplicate.metadata,
        created: new Date().toISOString()
      }
    };

    const blockIndex = contentBlocks.findIndex(b => b.id === blockId);
    const newBlocks = [...contentBlocks];
    newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);

    setContentBlocks(newBlocks);
    triggerAutoSave();
    showNotification('success', 'Block duplicated');
  };

  // Enhanced content block rendering with inline editing
  const renderContentBlock = (block) => {
    const isEditing = editingBlockId === block.id;
    const isSelected = selectedBlock?.id === block.id;
    
    const styles = {
      margin: `${block.styles.marginTop} ${block.styles.marginRight} ${block.styles.marginBottom} ${block.styles.marginLeft}`,
      padding: `${block.styles.paddingTop} ${block.styles.paddingRight} ${block.styles.paddingBottom} ${block.styles.paddingLeft}`,
      fontSize: block.styles.fontSize,
      fontWeight: block.styles.fontWeight,
      textAlign: block.styles.textAlign,
      color: block.styles.color,
      backgroundColor: block.styles.backgroundColor,
      borderRadius: block.styles.borderRadius,
      border: isSelected ? '2px solid #3b82f6' : block.styles.border,
      backdropFilter: `blur(${block.styles.backdropBlur})`,
    };

    const BlockWrapper = ({ children }) => (
      <div 
        className={`group relative transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
        onClick={() => {
          if (!previewMode) {
            setSelectedBlock(block);
            setShowStylePanel(true);
          }
        }}
      >
        {children}
        
        {/* Block Controls - only show when selected */}
        {!previewMode && isSelected && (
          <div className="absolute top-2 right-2 flex space-x-1 bg-gray-900/95 rounded-lg p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowStylePanel(true);
              }}
              className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded"
              title="Edit Properties"
            >
              <Cog6ToothIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateBlock(block.id);
              }}
              className="p-1.5 text-green-400 hover:text-green-300 hover:bg-gray-700 rounded"
              title="Duplicate Block"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteBlock(block.id);
              }}
              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded"
              title="Delete Block"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );

    switch (block.type) {
      case 'heading':
        const HeadingTag = block.content.level || 'h2';
        return (
          <BlockWrapper>
            {isEditing ? (
              <input
                type="text"
                value={block.content.text}
                onChange={(e) => handleInlineEdit(block.id, 'text', e.target.value)}
                onBlur={() => setEditingBlockId(null)}
                onKeyPress={(e) => e.key === 'Enter' && setEditingBlockId(null)}
                style={styles}
                className="w-full bg-transparent border-none outline-none font-bold"
                autoFocus
              />
            ) : (
              <HeadingTag 
                style={styles} 
                className="font-bold cursor-text"
                onDoubleClick={() => !previewMode && setEditingBlockId(block.id)}
              >
                {block.content.text}
              </HeadingTag>
            )}
          </BlockWrapper>
        );

      case 'paragraph':
        return (
          <BlockWrapper>
            {isEditing ? (
              <textarea
                value={block.content.text}
                onChange={(e) => handleInlineEdit(block.id, 'text', e.target.value)}
                onBlur={() => setEditingBlockId(null)}
                style={{...styles, minHeight: '100px', resize: 'vertical'}}
                className="w-full bg-transparent border-none outline-none"
                autoFocus
              />
            ) : (
              <p 
                style={styles} 
                className="cursor-text"
                onDoubleClick={() => !previewMode && setEditingBlockId(block.id)}
              >
                {block.content.text}
              </p>
            )}
          </BlockWrapper>
        );

      case 'checkbox':
        return (
          <BlockWrapper>
            <div style={styles} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={block.content.checked}
                onChange={(e) => handleInlineEdit(block.id, 'checked', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                disabled={previewMode}
              />
              {isEditing ? (
                <input
                  type="text"
                  value={block.content.label}
                  onChange={(e) => handleInlineEdit(block.id, 'label', e.target.value)}
                  onBlur={() => setEditingBlockId(null)}
                  onKeyPress={(e) => e.key === 'Enter' && setEditingBlockId(null)}
                  className="flex-1 bg-transparent border-none outline-none text-white"
                  autoFocus
                />
              ) : (
                <span 
                  className="flex-1 cursor-text"
                  onDoubleClick={() => !previewMode && setEditingBlockId(block.id)}
                >
                  {block.content.label}
                </span>
              )}
            </div>
          </BlockWrapper>
        );

      case 'image':
        return (
          <BlockWrapper>
            <div style={styles} className="text-center">
              {block.content.src ? (
                <div>
                  <img 
                    src={block.content.src} 
                    alt={block.content.alt} 
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                  {block.content.caption && (
                    <p className="mt-2 text-sm text-gray-400">{block.content.caption}</p>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/30 rounded-lg py-12 px-6">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-gray-400">Click to add image</p>
                </div>
              )}
            </div>
          </BlockWrapper>
        );

      case 'video':
        return (
          <BlockWrapper>
            <div style={styles}>
              {block.content.src ? (
                <video 
                  controls 
                  autoPlay={block.content.autoplay}
                  className="w-full rounded-lg shadow-lg"
                >
                  <source src={block.content.src} type="video/mp4" />
                </video>
              ) : (
                <div className="border-2 border-dashed border-white/30 rounded-lg py-12 px-6 text-center">
                  <div className="text-4xl mb-2">🎥</div>
                  <p className="text-gray-400">Click to add video</p>
                </div>
              )}
            </div>
          </BlockWrapper>
        );

      case 'ai-input':
        return (
          <BlockWrapper>
            <div style={styles} className="space-y-4">
              <div className="flex items-center space-x-2 text-purple-300 mb-3">
                <span className="text-xl">🤖</span>
                <span className="font-medium">AI Assistant</span>
              </div>
              <textarea 
                placeholder={block.content.prompt}
                rows="4"
                className="w-full p-4 bg-black/20 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                Ask AI ✨
              </button>
            </div>
          </BlockWrapper>
        );

      case 'quiz':
        return (
          <BlockWrapper>
            <div style={styles} className="space-y-4">
              <h3 className="text-lg font-medium mb-4">{block.content.question}</h3>
              {block.content.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <input 
                    type="radio" 
                    name={`quiz-${block.id}`}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </BlockWrapper>
        );

      case 'code-sandbox':
        return (
          <BlockWrapper>
            <div style={styles} className="space-y-3">
              <div className="flex items-center space-x-2 text-violet-300 mb-3">
                <span className="text-xl">⚡</span>
                <span className="font-medium">Code Sandbox ({block.content.language})</span>
              </div>
              <textarea 
                value={block.content.code}
                onChange={(e) => handleInlineEdit(block.id, 'code', e.target.value)}
                rows="8"
                className="w-full p-4 bg-gray-900/50 border border-violet-500/30 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Run Code ▶️
              </button>
            </div>
          </BlockWrapper>
        );

      default:
        return (
          <BlockWrapper>
            <div style={styles}>
              <p className="text-gray-400">Unsupported block type: {block.type}</p>
            </div>
          </BlockWrapper>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black text-white">
      {/* Enhanced Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
              notification.type === 'success' 
                ? 'bg-green-600 text-white' 
                : notification.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            {notification.type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
            {notification.type === 'error' && <ExclamationTriangleIcon className="w-5 h-5" />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Header with Navigation */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button
              onClick={goBack}
              className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Back to Admin Panel"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                🎧 Quick Lesson Builder
              </h1>
              <p className="text-gray-400 mt-1">Intuitive editor with inline editing - Double-click to edit text</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Save Status Indicator */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                saveStatus === 'saving' ? 'bg-yellow-400 animate-pulse' :
                saveStatus === 'saved' ? 'bg-green-400' :
                saveStatus === 'error' ? 'bg-red-400' :
                'bg-orange-400'
              }`} />
              <span className="text-xs text-gray-300">
                {saveStatus === 'saving' ? 'Saving...' :
                 saveStatus === 'saved' ? 'Saved' :
                 saveStatus === 'error' ? 'Error' :
                 'Unsaved changes'}
              </span>
            </div>
            
            <button 
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                previewMode 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {previewMode ? '✏️ Edit Mode' : '👁️ Preview'}
            </button>
            
            <button 
              onClick={saveLesson}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
            >
              💾 Save Lesson
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Left Panel - Block Types */}
        <div className="w-80 border-r border-white/10 p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <span>🧩</span>
            <span>Content Blocks</span>
          </h2>
          
          <div className="space-y-3">
            {blockTypes.map((blockType) => (
              <motion.button
                key={blockType.id}
                onClick={() => addBlock(blockType)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-xl border border-white/10 bg-gradient-to-r ${blockType.color} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 text-left group`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    {blockType.icon}
                  </span>
                  <div>
                    <div className="font-medium text-white">{blockType.name}</div>
                    <div className="text-sm text-gray-400">{blockType.description}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Center Panel - Canvas */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
              <div className="text-2xl mb-2">📝</div>
              <h2 className="text-xl font-semibold mb-2">Lesson Canvas</h2>
              <p className="text-gray-400">Drag blocks to reorder • Click to edit • Select for styling</p>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="lesson-canvas">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4 min-h-[400px]"
                  >
                    <AnimatePresence>
                      {contentBlocks.map((block, index) => (
                        <Draggable key={block.id} draggableId={block.id} index={index}>
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className={`
                                relative group cursor-pointer rounded-xl
                                ${selectedBlock?.id === block.id ? 'ring-2 ring-cyan-400' : 'hover:ring-1 hover:ring-white/30'}
                                ${snapshot.isDragging ? 'shadow-2xl shadow-cyan-400/20 scale-105' : ''}
                                transition-all duration-300
                              `}
                              onClick={() => {
                                setSelectedBlock(block);
                                setShowStylePanel(true);
                              }}
                            >
                              {/* Block Header */}
                              <div className="absolute -top-8 left-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-xs bg-black/80 px-2 py-1 rounded flex items-center space-x-1">
                                  <span>{block.metadata.icon}</span>
                                  <span>{block.metadata.name}</span>
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteBlock(block.id);
                                  }}
                                  className="text-red-400 hover:text-red-300 text-sm bg-black/80 px-2 py-1 rounded"
                                >
                                  🗑️
                                </button>
                              </div>

                              {/* Drag Handle */}
                              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-xs">
                                  ⋮⋮
                                </div>
                              </div>

                              {/* Block Content */}
                              <div className="relative">
                                {renderContentBlock(block)}
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {contentBlocks.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-white/20 rounded-xl">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">Start Building Your Lesson</h3>
                <p className="text-gray-400">Add content blocks from the left panel to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Style Controls */}
        <AnimatePresence>
          {showStylePanel && selectedBlock && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              className="w-80 border-l border-white/10 p-6 overflow-y-auto bg-black/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center space-x-2">
                  <span>{selectedBlock.metadata.icon}</span>
                  <span>Style Panel</span>
                </h2>
                <button
                  onClick={() => setShowStylePanel(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <StyleControls
                block={selectedBlock}
                onContentUpdate={(content) => updateBlockContent(selectedBlock.id, content)}
                onStyleUpdate={(styles) => updateBlockStyles(selectedBlock.id, styles)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Style Controls Component
const StyleControls = ({ block, onContentUpdate, onStyleUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');

  const tabs = [
    { id: 'content', name: 'Content', icon: '📝' },
    { id: 'spacing', name: 'Spacing', icon: '📏' },
    { id: 'typography', name: 'Typography', icon: '🔤' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' }
  ];

  const renderContentControls = () => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text</label>
              <input
                type="text"
                value={block.content.text || ''}
                onChange={(e) => onContentUpdate({ text: e.target.value })}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Heading Level</label>
              <select
                value={block.content.level || 'h2'}
                onChange={(e) => onContentUpdate({ level: e.target.value })}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="h1">H1 - Largest</option>
                <option value="h2">H2 - Large</option>
                <option value="h3">H3 - Medium</option>
                <option value="h4">H4 - Small</option>
              </select>
            </div>
          </div>
        );

      case 'paragraph':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">Text Content</label>
            <textarea
              value={block.content.text || ''}
              onChange={(e) => onContentUpdate({ text: e.target.value })}
              rows="6"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
            />
          </div>
        );

      case 'checkbox':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">Checkbox Label</label>
            <input
              type="text"
              value={block.content.label || ''}
              onChange={(e) => onContentUpdate({ label: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
        );

      case 'ai-input':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prompt Placeholder</label>
              <textarea
                value={block.content.prompt || ''}
                onChange={(e) => onContentUpdate({ prompt: e.target.value })}
                rows="3"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">AI Model</label>
              <select
                value={block.content.model || 'gpt-3.5-turbo'}
                onChange={(e) => onContentUpdate({ model: e.target.value })}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="claude-3">Claude 3</option>
              </select>
            </div>
          </div>
        );

      default:
        return <div className="text-gray-400">Content controls for {block.type}</div>;
    }
  };

  const renderSpacingControls = () => (
    <div className="space-y-6">
      {/* Margin Controls */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center space-x-2">
          <span>📐</span>
          <span>Margin</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {['Top', 'Right', 'Bottom', 'Left'].map((direction) => (
            <div key={direction}>
              <label className="block text-xs text-gray-400 mb-1">{direction}</label>
              <input
                type="text"
                value={block.styles[`margin${direction}`] || '0px'}
                onChange={(e) => onStyleUpdate({ [`margin${direction}`]: e.target.value })}
                className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Padding Controls */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center space-x-2">
          <span>📦</span>
          <span>Padding</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {['Top', 'Right', 'Bottom', 'Left'].map((direction) => (
            <div key={direction}>
              <label className="block text-xs text-gray-400 mb-1">{direction}</label>
              <input
                type="text"
                value={block.styles[`padding${direction}`] || '0px'}
                onChange={(e) => onStyleUpdate({ [`padding${direction}`]: e.target.value })}
                className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTypographyControls = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Font Size</label>
        <input
          type="text"
          value={block.styles.fontSize || '16px'}
          onChange={(e) => onStyleUpdate({ fontSize: e.target.value })}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Font Weight</label>
        <select
          value={block.styles.fontWeight || 'normal'}
          onChange={(e) => onStyleUpdate({ fontWeight: e.target.value })}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="lighter">Light</option>
          <option value="bolder">Extra Bold</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Text Align</label>
        <select
          value={block.styles.textAlign || 'left'}
          onChange={(e) => onStyleUpdate({ textAlign: e.target.value })}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Text Color</label>
        <input
          type="color"
          value={block.styles.color || '#ffffff'}
          onChange={(e) => onStyleUpdate({ color: e.target.value })}
          className="w-full h-12 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
      </div>
    </div>
  );

  const renderAppearanceControls = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Background Color</label>
        <input
          type="text"
          value={block.styles.backgroundColor || 'rgba(255, 255, 255, 0.05)'}
          onChange={(e) => onStyleUpdate({ backgroundColor: e.target.value })}
          placeholder="rgba(255, 255, 255, 0.05)"
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Border Radius</label>
        <input
          type="text"
          value={block.styles.borderRadius || '12px'}
          onChange={(e) => onStyleUpdate({ borderRadius: e.target.value })}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Border</label>
        <input
          type="text"
          value={block.styles.border || '1px solid rgba(255, 255, 255, 0.1)'}
          onChange={(e) => onStyleUpdate({ border: e.target.value })}
          placeholder="1px solid rgba(255, 255, 255, 0.1)"
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Backdrop Blur</label>
        <input
          type="text"
          value={block.styles.backdropBlur || '12px'}
          onChange={(e) => onStyleUpdate({ backdropBlur: e.target.value })}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
      </div>
    </div>
  );

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-300
              ${activeTab === tab.id 
                ? 'bg-cyan-500/20 text-cyan-300 shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'}
            `}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'content' && renderContentControls()}
        {activeTab === 'spacing' && renderSpacingControls()}
        {activeTab === 'typography' && renderTypographyControls()}
        {activeTab === 'appearance' && renderAppearanceControls()}
      </div>
    </div>
  );
};

export default LessonBuilder; 