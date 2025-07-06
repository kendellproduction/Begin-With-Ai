import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const LessonBuilder = () => {
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

  // Generate unique ID for new blocks
  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
  };

  // Get default content for block type
  const getDefaultContent = (type) => {
    const defaults = {
      'heading': { text: 'New Heading', level: 'h2' },
      'paragraph': { text: 'Enter your content here...' },
      'checkbox': { label: 'Check this option', checked: false },
      'fill-blank': { question: 'Complete this sentence: AI is ___', answer: 'intelligent' },
      'image': { src: '', alt: '', caption: '' },
      'video': { src: '', title: '', autoplay: false },
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
  };

  // Update block content
  const updateBlockContent = (blockId, newContent) => {
    setContentBlocks(contentBlocks.map(block => 
      block.id === blockId ? { ...block, content: { ...block.content, ...newContent } } : block
    ));
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
  };

  // Render content block
  const renderContentBlock = (block) => {
    const styles = {
      margin: `${block.styles.marginTop} ${block.styles.marginRight} ${block.styles.marginBottom} ${block.styles.marginLeft}`,
      padding: `${block.styles.paddingTop} ${block.styles.paddingRight} ${block.styles.paddingBottom} ${block.styles.paddingLeft}`,
      fontSize: block.styles.fontSize,
      fontWeight: block.styles.fontWeight,
      textAlign: block.styles.textAlign,
      color: block.styles.color,
      backgroundColor: block.styles.backgroundColor,
      borderRadius: block.styles.borderRadius,
      border: block.styles.border,
      backdropFilter: `blur(${block.styles.backdropBlur})`,
    };

    switch (block.type) {
      case 'heading':
        const HeadingTag = block.content.level || 'h2';
        return (
          <HeadingTag style={styles} className="font-bold">
            {block.content.text}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p style={styles} className="leading-relaxed">
            {block.content.text}
          </p>
        );

      case 'checkbox':
        return (
          <label style={styles} className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={block.content.checked} 
              className="w-5 h-5 rounded border-2 border-white/30 bg-white/10"
              onChange={() => updateBlockContent(block.id, { checked: !block.content.checked })}
            />
            <span>{block.content.label}</span>
          </label>
        );

      case 'fill-blank':
        return (
          <div style={styles} className="space-y-3">
            <p className="mb-3">{block.content.question}</p>
            <input 
              type="text" 
              placeholder="Your answer..."
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        );

      case 'image':
        return (
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
        );

      case 'video':
        return (
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
        );

      case 'ai-input':
        return (
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
        );

      case 'quiz':
        return (
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
        );

      case 'code-sandbox':
        return (
          <div style={styles} className="space-y-3">
            <div className="flex items-center space-x-2 text-violet-300 mb-3">
              <span className="text-xl">⚡</span>
              <span className="font-medium">Code Sandbox ({block.content.language})</span>
            </div>
            <textarea 
              value={block.content.code}
              onChange={(e) => updateBlockContent(block.id, { code: e.target.value })}
              rows="8"
              className="w-full p-4 bg-gray-900/50 border border-violet-500/30 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              Run Code ▶️
            </button>
          </div>
        );

      default:
        return <div style={styles}>Unknown block type: {block.type}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              🎧 Advanced Lesson Builder
            </h1>
            <p className="text-gray-400 mt-1">Webflow-style editor for podcast-powered lessons</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105">
              💾 Save Lesson
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
              👁️ Preview
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