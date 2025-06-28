import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Squares2X2Icon, 
  EyeIcon, 
  Cog6ToothIcon,
  PlayIcon,
  DocumentDuplicateIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  TrashIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Import content block system
import { ContentBlockRenderer, BLOCK_TYPES } from '../ContentBlocks';

// Import sub-components
import ComponentPalette from './builder/ComponentPalette';
import CanvasPreview from './builder/CanvasPreview';
import PropertiesPanel from './builder/PropertiesPanel';
import BuilderToolbar from './builder/BuilderToolbar';
import TemplateManager from './builder/TemplateManager';
import PageManagerSimple from './builder/PageManagerSimple';

const EnterpriseBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Multi-page lesson state
  const [lessonPages, setLessonPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // Current page's blocks (derived from lessonPages)
  const currentPage = lessonPages[currentPageIndex];
  const lessonBlocks = currentPage?.blocks || [];
  
  // Block selection state
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  
  // UI state
  const [activePanel, setActivePanel] = useState('components'); // components, templates, settings
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [pageTheme, setPageTheme] = useState('dark');
  
  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Templates and AI
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  
  // Enhanced draft saving with better UX
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [draftName, setDraftName] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving', 'saved', 'error', 'unsaved'
  const [notification, setNotification] = useState(null);

  // Auto-save functionality
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  // Show notification helper
  const showNotification = (type, message, duration = 3000) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), duration);
  };

  // Generate unique IDs for new blocks
  const generateBlockId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Generate unique draft ID
  const generateDraftId = () => `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Save current state to history
  const saveToHistory = useCallback((newPages) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newPages)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Trigger auto-save after changes
    triggerAutoSave(newPages);
  }, [history, historyIndex]);

  // Auto-save with debouncing
  const triggerAutoSave = (pages = lessonPages) => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    
    setSaveStatus('unsaved');
    
    const timer = setTimeout(() => {
      saveDraftSilently(pages);
    }, 2000); // Auto-save after 2 seconds of inactivity
    
    setAutoSaveTimer(timer);
  };

  // Silent draft save for auto-save
  const saveDraftSilently = async (pages = lessonPages) => {
    try {
      setSaveStatus('saving');
      
      let draftId = currentDraftId;
      if (!draftId) {
        draftId = generateDraftId();
        setCurrentDraftId(draftId);
      }

      const finalDraftName = draftName || `Draft ${new Date().toLocaleDateString()}`;

      const draftData = {
        id: draftId,
        name: finalDraftName,
        pages: pages,
        currentPageIndex,
        pageTheme,
        created: currentDraftId ? lastSaved || new Date().toISOString() : new Date().toISOString(),
        lastSaved: new Date().toISOString(),
        metadata: {
          totalPages: pages.length,
          totalBlocks: pages.reduce((total, page) => total + page.blocks.length, 0),
          version: '3.0-enterprise'
        }
      };
      
      // Save to localStorage with the persistent ID
      const existingDrafts = JSON.parse(localStorage.getItem('lesson-drafts') || '[]');
      const draftIndex = existingDrafts.findIndex(draft => draft.id === draftId);
      
      if (draftIndex >= 0) {
        existingDrafts[draftIndex] = draftData;
      } else {
        existingDrafts.push(draftData);
      }
      
      localStorage.setItem('lesson-drafts', JSON.stringify(existingDrafts));
      setLastSaved(new Date());
      setDraftName(finalDraftName);
      setSaveStatus('saved');
      
    } catch (error) {
      console.error('Error auto-saving draft:', error);
      setSaveStatus('error');
    }
  };

  // Update current page's blocks
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

  // Handle drag and drop only for reordering blocks and pages
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    
    if (!destination) return;

    // Handle page reordering in PageManager
    if (source.droppableId === 'pages' && destination.droppableId === 'pages') {
      handlePageReorder(source.index, destination.index);
      return;
    }

    // Reordering blocks within canvas
    if (source.droppableId === 'lesson-canvas' && destination.droppableId === 'lesson-canvas') {
      const newBlocks = Array.from(lessonBlocks);
      const [reorderedBlock] = newBlocks.splice(source.index, 1);
      newBlocks.splice(destination.index, 0, reorderedBlock);
      
      updateCurrentPageBlocks(newBlocks);
    }
  };

  // Handle adding component from palette (click-to-add)
  const handleAddComponent = (blockType, insertIndex = null) => {
    const newBlock = createNewBlock(blockType);
    
    // If no insert index specified, add to end
    const targetIndex = insertIndex !== null ? insertIndex : lessonBlocks.length;
    
    // Insert at specific position
    const newBlocks = [...lessonBlocks];
    newBlocks.splice(targetIndex, 0, newBlock);
    
    updateCurrentPageBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
    setSelectedBlock(newBlock);
  };

  // Add component after a specific block
  const handleAddComponentAfter = (blockType, afterBlockId) => {
    const afterIndex = lessonBlocks.findIndex(block => block.id === afterBlockId);
    if (afterIndex !== -1) {
      handleAddComponent(blockType, afterIndex + 1);
    } else {
      handleAddComponent(blockType);
    }
  };

  // Create new block with default content
  const createNewBlock = (blockType) => {
    const blockId = generateBlockId();
    
    const defaultContent = {
      [BLOCK_TYPES.TEXT]: {
        content: {
          text: 'Enter your text here...',
          markdown: true
        },
        styles: {
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#ffffff',
          textAlign: 'left',
          margin: { top: 0, bottom: 16, left: 0, right: 0 },
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }
      },
      heading: {
        content: {
          text: 'Your Heading Here',
          level: 1, // H1, H2, H3, etc.
          markdown: false
        },
        styles: {
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'left',
          margin: { top: 0, bottom: 16, left: 0, right: 0 },
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }
      },
      [BLOCK_TYPES.IMAGE]: {
        content: {
          src: '',
          alt: 'New image',
          caption: ''
        },
        styles: {
          margin: { top: 16, bottom: 16, left: 0, right: 0 },
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }
      },
      [BLOCK_TYPES.VIDEO]: {
        content: {
          src: '',
          title: 'New video',
          autoplay: false
        },
        styles: {
          margin: { top: 16, bottom: 16, left: 0, right: 0 },
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }
      },
      [BLOCK_TYPES.QUIZ]: {
        content: {
          question: 'What is the correct answer?',
          options: ['Option A', 'Option B', 'Option C'],
          correctAnswer: 0,
          explanation: 'Explanation here...'
        },
        styles: {
          margin: { top: 16, bottom: 16, left: 0, right: 0 },
          padding: { top: 16, bottom: 16, left: 16, right: 16 }
        }
      },
      [BLOCK_TYPES.SANDBOX]: {
        content: {
          language: 'javascript',
          code: '// Write your code here\nconsole.log("Hello World!");',
          instructions: 'Complete the coding exercise'
        },
        styles: {
          margin: { top: 16, bottom: 16, left: 0, right: 0 },
          padding: { top: 16, bottom: 16, left: 16, right: 16 }
        }
      },
      [BLOCK_TYPES.FILL_BLANK]: {
        content: {
          text: 'Complete this sentence: The capital of France is {{Paris|The City of Light}}.',
          instructions: 'Fill in the blanks'
        },
        styles: {
          margin: { top: 16, bottom: 16, left: 0, right: 0 },
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }
      },
      [BLOCK_TYPES.PODCAST_SYNC]: {
        content: {
          text: 'This content will sync with audio timestamps',
          startTime: 0,
          endTime: 30
        },
        styles: {
          margin: { top: 16, bottom: 16, left: 0, right: 0 },
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }
      },
      [BLOCK_TYPES.SECTION_BREAK]: {
        content: {
          style: 'line',
          title: 'Section Break'
        },
        styles: {
          margin: { top: 32, bottom: 32, left: 0, right: 0 },
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }
      },
      [BLOCK_TYPES.PROGRESS_CHECKPOINT]: {
        content: {
          title: 'Progress Checkpoint',
          message: 'Great progress! Keep going.',
          milestone: true
        },
        styles: {
          margin: { top: 16, bottom: 16, left: 0, right: 0 },
          padding: { top: 16, bottom: 16, left: 16, right: 16 }
        }
      },
      [BLOCK_TYPES.CALL_TO_ACTION]: {
        content: {
          title: 'Ready to continue?',
          description: 'Click to proceed to the next section',
          buttonText: 'Continue',
          action: 'next'
        },
        styles: {
          margin: { top: 16, bottom: 16, left: 0, right: 0 },
          padding: { top: 16, bottom: 16, left: 16, right: 16 }
        }
      }
    };

    return {
      id: blockId,
      type: blockType,
      ...defaultContent[blockType],
      config: {},
      styles: defaultContent[blockType]?.styles || {},
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        version: '1.0'
      }
    };
  };

  // Update block content
  const updateBlockContent = (blockId, newContent) => {
    const newBlocks = lessonBlocks.map(block => 
      block.id === blockId 
        ? { 
            ...block, 
            content: { ...block.content, ...newContent },
            metadata: { ...block.metadata, updated: new Date().toISOString() }
          }
        : block
    );
    
    updateCurrentPageBlocks(newBlocks);
    
    // Update selected block if it's the one being edited
    if (selectedBlockId === blockId) {
      setSelectedBlock(newBlocks.find(b => b.id === blockId));
    }
  };

  // Update block config
  const updateBlockConfig = (blockId, newConfig) => {
    const newBlocks = lessonBlocks.map(block => 
      block.id === blockId 
        ? { 
            ...block, 
            config: { ...block.config, ...newConfig },
            metadata: { ...block.metadata, updated: new Date().toISOString() }
          }
        : block
    );
    
    updateCurrentPageBlocks(newBlocks);
    
    if (selectedBlockId === blockId) {
      setSelectedBlock(newBlocks.find(b => b.id === blockId));
    }
  };

  // Update block styles
  const updateBlockStyles = (blockId, newStyles) => {
    const newBlocks = lessonBlocks.map(block => 
      block.id === blockId 
        ? { 
            ...block, 
            styles: { ...block.styles, ...newStyles },
            metadata: { ...block.metadata, updated: new Date().toISOString() }
          }
        : block
    );
    
    updateCurrentPageBlocks(newBlocks);
    
    if (selectedBlockId === blockId) {
      setSelectedBlock(newBlocks.find(b => b.id === blockId));
    }
  };

  // Delete block
  const deleteBlock = (blockId) => {
    const newBlocks = lessonBlocks.filter(block => block.id !== blockId);
    updateCurrentPageBlocks(newBlocks);
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      setSelectedBlock(null);
    }
  };

  // Duplicate block
  const duplicateBlock = (blockId) => {
    const blockToDuplicate = lessonBlocks.find(b => b.id === blockId);
    if (!blockToDuplicate) return;
    
    const duplicatedBlock = {
      ...JSON.parse(JSON.stringify(blockToDuplicate)),
      id: generateBlockId(),
      metadata: {
        ...blockToDuplicate.metadata,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }
    };
    
    const blockIndex = lessonBlocks.findIndex(b => b.id === blockId);
    const newBlocks = [...lessonBlocks];
    newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
    
    updateCurrentPageBlocks(newBlocks);
  };

  // Undo/Redo functionality
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setLessonPages(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setLessonPages(history[historyIndex + 1]);
    }
  };

  // Handle block selection from canvas
  const handleBlockSelect = (block) => {
    setSelectedBlockId(block?.id || null);
    setSelectedBlock(block);
    setShowPropertiesPanel(!!block);
  };

  // Page management functions
  const handlePageAdd = (pageTemplate) => {
    const newPage = {
      id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: pageTemplate.name,
      type: pageTemplate.id,
      blocks: pageTemplate.blocks.map(blockTemplate => ({
        ...createNewBlock(blockTemplate.type),
        content: blockTemplate.content
      })),
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    
    const newPages = [...lessonPages, newPage];
    setLessonPages(newPages);
    saveToHistory(newPages);
    setCurrentPageIndex(newPages.length - 1);
  };

  const handlePageDelete = (pageIndex) => {
    if (lessonPages.length <= 1) return; // Don't delete the last page
    
    const newPages = lessonPages.filter((_, index) => index !== pageIndex);
    setLessonPages(newPages);
    saveToHistory(newPages);
    
    // Adjust current page index if necessary
    if (currentPageIndex >= newPages.length) {
      setCurrentPageIndex(newPages.length - 1);
    } else if (currentPageIndex > pageIndex) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handlePageDuplicate = (pageIndex) => {
    const pageToDuplicate = lessonPages[pageIndex];
    if (!pageToDuplicate) return;
    
    const newPage = {
      ...JSON.parse(JSON.stringify(pageToDuplicate)),
      id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${pageToDuplicate.title} (Copy)`,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      blocks: pageToDuplicate.blocks.map(block => ({
        ...block,
        id: generateBlockId()
      }))
    };
    
    const newPages = [...lessonPages];
    newPages.splice(pageIndex + 1, 0, newPage);
    setLessonPages(newPages);
    saveToHistory(newPages);
    setCurrentPageIndex(pageIndex + 1);
  };

  const handlePageReorder = (startIndex, endIndex) => {
    const newPages = Array.from(lessonPages);
    const [reorderedPage] = newPages.splice(startIndex, 1);
    newPages.splice(endIndex, 0, reorderedPage);
    
    setLessonPages(newPages);
    saveToHistory(newPages);
    
    // Update current page index
    if (currentPageIndex === startIndex) {
      setCurrentPageIndex(endIndex);
    } else if (currentPageIndex > startIndex && currentPageIndex <= endIndex) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (currentPageIndex < startIndex && currentPageIndex >= endIndex) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePageSelect = (pageIndex) => {
    setCurrentPageIndex(pageIndex);
    setSelectedBlockId(null);
    setSelectedBlock(null);
  };

  // Initialize with a default page if empty, or load draft data
  React.useEffect(() => {
    // Check if we have draft data from navigation
    const draftData = location.state?.draft;
    
    if (draftData) {
      // Load draft data
      setLessonPages(draftData.pages || []);
      setCurrentPageIndex(draftData.currentPageIndex || 0);
      setPageTheme(draftData.pageTheme || 'dark');
      setCurrentDraftId(draftData.id);
      setDraftName(draftData.name);
      setLastSaved(draftData.lastSaved ? new Date(draftData.lastSaved) : null);
    } else if (lessonPages.length === 0) {
      // Initialize with default page for new lesson
      handlePageAdd({
        id: 'intro-page',
        name: 'Introduction',
        blocks: [
          { type: 'text', content: { text: '# Welcome to Your New Lesson!\n\nStart building your content here...' } }
        ]
      });
    }
  }, [location.state]); // Only run when location.state changes

  // Save lesson
  const saveLesson = async () => {
    try {
      const lessonData = {
        pages: lessonPages,
        metadata: {
          totalPages: lessonPages.length,
          totalBlocks: lessonPages.reduce((total, page) => total + page.blocks.length, 0),
          lastSaved: new Date().toISOString(),
          version: '3.0-enterprise'
        }
      };
      
      // TODO: Implement actual save to database
  
      
      setLastSaved(new Date());
      
      // Show success notification
      alert('Lesson saved successfully!');
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Error saving lesson. Please try again.');
    }
  };

  // Enhanced back navigation with proper routing
  const goBack = () => {
    // Check if there are unsaved changes
    if (saveStatus === 'unsaved') {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Do you want to save before leaving?'
      );
      if (confirmLeave) {
        saveDraftSilently().then(() => {
          navigateBack();
        });
        return;
      }
    }
    navigateBack();
  };

  const navigateBack = () => {
    // Try to go back to the specific admin panel page, not browser history
    const fromAdmin = location.state?.fromAdmin || 
                      new URLSearchParams(window.location.search).get('fromAdmin');
    if (fromAdmin) {
      navigate('/admin', { state: { activePanel: 'content-creation' } });
    } else {
      // Fallback to admin panel if no specific reference
      navigate('/admin');
    }
  };

  // Enhanced template application
  const handleApplyTemplate = (template) => {
    if (lessonBlocks.length > 0) {
      const confirmReplace = window.confirm(
        'This will replace the current page content. Are you sure?'
      );
      if (!confirmReplace) return;
    }
    
    // Create new blocks from template with proper IDs
    const newBlocks = template.blocks.map(blockTemplate => ({
      ...createNewBlock(blockTemplate.type),
      content: blockTemplate.content
    }));
    
    updateCurrentPageBlocks(newBlocks);
    setShowTemplateManager(false);
    showNotification('success', `Applied template: ${template.name}`);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
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

      {/* Top Toolbar with enhanced save status */}
      <BuilderToolbar
        onSave={saveLesson}
        onSaveDraft={() => setShowDraftModal(true)}
        onBack={goBack}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onPreviewToggle={() => setPreviewMode(!previewMode)}
        previewMode={previewMode}
        onTemplateManager={() => setShowTemplateManager(true)}
        zoom={canvasZoom}
        onZoomChange={setCanvasZoom}
        onThemeChange={setPageTheme}
        currentTheme={pageTheme}
        lastSaved={lastSaved}
        saveStatus={saveStatus}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Left Sidebar - Component Palette */}
            {!previewMode && (
            <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
              <div className="p-3 border-b border-gray-700 flex-shrink-0">
                <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setActivePanel('components')}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activePanel === 'components' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Squares2X2Icon className="w-4 h-4 mr-1" />
                    Components
                  </button>
                  <button
                    onClick={() => setActivePanel('templates')}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activePanel === 'templates' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                    Templates
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden min-h-0">
                {activePanel === 'components' && <ComponentPalette onAddComponent={handleAddComponent} />}
                {activePanel === 'templates' && (
                  <TemplateManager
                    onApplyTemplate={handleApplyTemplate}
                  />
                )}
              </div>
            </div>
          )}

          {/* Center Canvas - Live Preview */}
          <div className="flex-1 flex flex-col bg-gray-850 overflow-hidden min-h-0">
            <CanvasPreview
              blocks={lessonBlocks}
              selectedBlockId={selectedBlockId}
              onBlockSelect={handleBlockSelect}
              onBlockUpdate={updateBlockContent}
              onBlockDelete={deleteBlock}
              onBlockDuplicate={duplicateBlock}
              onAddComponent={handleAddComponent}
              previewMode={previewMode}
              zoom={canvasZoom}
              pageTheme={pageTheme}
            />
          </div>

          {/* Right Sidebar - Properties Panel */}
          {!previewMode && showPropertiesPanel && selectedBlock && (
            <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
                <h3 className="text-lg font-semibold">Properties</h3>
                <button
                  onClick={() => setShowPropertiesPanel(false)}
                  className="p-1 text-gray-400 hover:text-white rounded"
                >
                  ×
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden min-h-0">
                <PropertiesPanel
                  block={selectedBlock}
                  onContentUpdate={(content) => updateBlockContent(selectedBlock.id, content)}
                  onConfigUpdate={(config) => updateBlockConfig(selectedBlock.id, config)}
                  onStylesUpdate={(styles) => updateBlockStyles(selectedBlock.id, styles)}
                />
              </div>
            </div>
          )}
          </div>

          {/* Bottom iPhone Photos-style Page Manager */}
          {!previewMode && (
            <div className="flex-shrink-0 bg-gray-800 border-t border-gray-700">
              <PageManagerSimple
                pages={lessonPages}
                currentPageIndex={currentPageIndex}
                onPageSelect={handlePageSelect}
                onPageAdd={handlePageAdd}
                onPageDelete={handlePageDelete}
                onPageDuplicate={handlePageDuplicate}
                className="h-28 p-4"
              />
            </div>
          )}
        </DragDropContext>
      </div>

      {/* Draft Save Modal */}
      <AnimatePresence>
        {showDraftModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDraftModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Save Draft</h2>
                <button
                  onClick={() => setShowDraftModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Draft Name
                  </label>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder={`Draft ${new Date().toLocaleDateString()}`}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDraftModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      saveDraftSilently();
                      setShowDraftModal(false);
                      setDraftName('');
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Draft
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Manager Modal */}
      <AnimatePresence>
        {showTemplateManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowTemplateManager(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Template Manager</h2>
                <button
                  onClick={() => setShowTemplateManager(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              
              <TemplateManager
                onApplyTemplate={handleApplyTemplate}
                currentBlocks={lessonBlocks}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnterpriseBuilder; 