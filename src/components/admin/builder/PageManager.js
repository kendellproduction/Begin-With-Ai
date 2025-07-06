import React, { useState, useRef } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  QuestionMarkCircleIcon,
  CodeBracketIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  SparklesIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

const PageManager = ({
  pages = [],
  currentPageIndex = 0,
  onPageSelect,
  onPageAdd,
  onPageDelete,
  onPageDuplicate,
  onPageReorder,
  className = "",
  dragContext = true // Allow disabling internal DragDropContext
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showPageTypes, setShowPageTypes] = useState(false);
  const scrollRef = useRef(null);

  // Page type configurations
  const pageTypes = [
    {
      id: 'intro-page',
      name: 'Intro Page',
      icon: SparklesIcon,
      color: 'from-blue-500 to-indigo-600',
      description: 'Welcome page with objectives',
      blocks: [
        { type: 'text', content: { text: '# Welcome to this lesson!\n\nIn this lesson, you will learn...' } },
        { type: 'call_to_action', content: { title: 'Ready to start?', buttonText: 'Begin Learning' } }
      ]
    },
    {
      id: 'content-page',
      name: 'Content Page',
      icon: DocumentTextIcon,
      color: 'from-green-500 to-emerald-600',
      description: 'Text content with optional media',
      blocks: [
        { type: 'text', content: { text: 'Enter your content here...' } }
      ]
    },
    {
      id: 'media-page',
      name: 'Media Page',
      icon: PhotoIcon,
      color: 'from-purple-500 to-violet-600',
      description: 'Image or video focused page',
      blocks: [
        { type: 'image', content: { src: '', alt: 'Content image', caption: 'Add your image description' } },
        { type: 'text', content: { text: 'Describe what learners should notice about this image...' } }
      ]
    },
    {
      id: 'quiz-page',
      name: 'Quiz Page',
      icon: QuestionMarkCircleIcon,
      color: 'from-orange-500 to-red-600',
      description: 'Interactive quiz or assessment',
      blocks: [
        { type: 'quiz', content: { question: 'What is the correct answer?', options: ['Option A', 'Option B', 'Option C'], correctAnswer: 0 } }
      ]
    },
    {
      id: 'coding-page',
      name: 'Coding Page',
      icon: CodeBracketIcon,
      color: 'from-cyan-500 to-teal-600',
      description: 'Interactive coding exercise',
      blocks: [
        { type: 'text', content: { text: '## Coding Challenge\n\nComplete the following exercise:' } },
        { type: 'sandbox', content: { language: 'javascript', code: '// Write your code here\n', instructions: 'Complete the function' } }
      ]
    },
    {
      id: 'summary-page',
      name: 'Summary Page',
      icon: CheckCircleIcon,
      color: 'from-indigo-500 to-purple-600',
      description: 'Lesson summary and next steps',
      blocks: [
        { type: 'text', content: { text: '## Great work!\n\nYou have completed this lesson. Here\'s what you learned:' } },
        { type: 'progress_checkpoint', content: { title: 'Lesson Complete!', message: 'You\'ve mastered the concepts in this lesson.' } }
      ]
    }
  ];

  // Get page type icon and color based on page content
  const getPageVisuals = (page) => {
    if (!page.blocks || page.blocks.length === 0) {
      return { icon: DocumentTextIcon, color: 'bg-gray-600' };
    }

    const blockTypes = page.blocks.map(block => block.type);
    
    // Determine page type based on dominant block types
    if (blockTypes.includes('quiz')) {
      return { icon: QuestionMarkCircleIcon, color: 'bg-orange-500' };
    } else if (blockTypes.includes('sandbox')) {
      return { icon: CodeBracketIcon, color: 'bg-cyan-500' };
    } else if (blockTypes.includes('image') || blockTypes.includes('video')) {
      return { icon: PhotoIcon, color: 'bg-purple-500' };
    } else if (blockTypes.includes('call_to_action')) {
      return { icon: SparklesIcon, color: 'bg-blue-500' };
    } else if (blockTypes.includes('progress_checkpoint')) {
      return { icon: CheckCircleIcon, color: 'bg-indigo-500' };
    } else {
      return { icon: DocumentTextIcon, color: 'bg-green-500' };
    }
  };

  // Handle drag end for page reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    
    if (startIndex !== endIndex) {
      onPageReorder(startIndex, endIndex);
    }
    
    setIsDragging(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Scroll to current page thumbnail
  const scrollToCurrentPage = () => {
    if (scrollRef.current && pages.length > 0) {
      const thumbnailWidth = 120; // Approximate width of each thumbnail
      const scrollPosition = currentPageIndex * thumbnailWidth - scrollRef.current.clientWidth / 2;
      scrollRef.current.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    scrollToCurrentPage();
  }, [currentPageIndex]);

  return (
    <div className={`bg-gray-900 border-t border-gray-700 ${className}`}>
      {/* Page Type Selector Modal */}
      <AnimatePresence>
        {showPageTypes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowPageTypes(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Choose Page Type</h2>
                <button
                  onClick={() => setShowPageTypes(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <MinusIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pageTypes.map((pageType) => (
                  <motion.button
                    key={pageType.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onPageAdd(pageType);
                      setShowPageTypes(false);
                    }}
                    className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-colors"
                  >
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${pageType.color} mr-3`}>
                        <pageType.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{pageType.name}</h3>
                    </div>
                    <p className="text-gray-300 text-sm">{pageType.description}</p>
                    <div className="mt-3 text-xs text-gray-400">
                      {pageType.blocks.length} block{pageType.blocks.length !== 1 ? 's' : ''}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Manager Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h3 className="text-sm font-medium text-gray-300">
            Pages ({pages.length})
          </h3>
          {pages.length > 0 && (
            <span className="text-xs text-gray-500">
              Page {currentPageIndex + 1} of {pages.length}
            </span>
          )}
        </div>
        
        <button
          onClick={() => setShowPageTypes(true)}
          className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add Page
        </button>
      </div>

      {/* iPhone Photos-style Thumbnail Bar */}
      <div className="p-3">
        {dragContext ? (
          <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <Droppable droppableId="pages" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex space-x-2 overflow-x-auto pb-2"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <div ref={scrollRef} className="flex space-x-2">
                    {pages.map((page, index) => {
                    const { icon: PageIcon, color } = getPageVisuals(page);
                    const isCurrentPage = index === currentPageIndex;
                    
                    return (
                      <Draggable key={page.id || index} draggableId={`page-${index}`} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            layout
                            className={`
                              relative group cursor-pointer flex-shrink-0
                              w-20 h-20 rounded-lg overflow-hidden
                              border-2 transition-all duration-200
                              ${isCurrentPage 
                                ? 'border-blue-400 shadow-lg shadow-blue-400/25 ring-2 ring-blue-400/50' 
                                : 'border-gray-600 hover:border-gray-500'}
                              ${snapshot.isDragging ? 'rotate-2 scale-105 z-50' : ''}
                            `}
                            onClick={() => onPageSelect(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Page Thumbnail Background */}
                            <div className={`w-full h-full ${color} opacity-20`} />
                            
                            {/* Page Type Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <PageIcon className={`w-6 h-6 ${isCurrentPage ? 'text-blue-400' : 'text-gray-300'}`} />
                            </div>
                            
                            {/* Page Number */}
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                              {index + 1}
                            </div>
                            
                            {/* Page Controls (show on hover) */}
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex space-x-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onPageDuplicate(index);
                                  }}
                                  className="p-1 bg-black bg-opacity-60 text-green-400 rounded hover:bg-opacity-80"
                                  title="Duplicate Page"
                                >
                                  <DocumentDuplicateIcon className="w-3 h-3" />
                                </button>
                                
                                {pages.length > 1 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onPageDelete(index);
                                    }}
                                    className="p-1 bg-black bg-opacity-60 text-red-400 rounded hover:bg-opacity-80"
                                    title="Delete Page"
                                  >
                                    <TrashIcon className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Current Page Indicator */}
                            {isCurrentPage && (
                              <motion.div
                                layoutId="current-page-indicator"
                                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"
                              />
                            )}
                          </motion.div>
                        )}
                      </Draggable>
                    );
                  })}
                                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
        ) : (
          <Droppable droppableId="pages" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex space-x-2 overflow-x-auto pb-2"
                style={{ scrollBehavior: 'smooth' }}
              >
                <div ref={scrollRef} className="flex space-x-2">
                  {pages.map((page, index) => {
                    const { icon: PageIcon, color } = getPageVisuals(page);
                    const isCurrentPage = index === currentPageIndex;
                    
                    return (
                      <Draggable key={page.id || index} draggableId={`page-${index}`} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            layout
                            className={`
                              relative group cursor-pointer flex-shrink-0
                              w-20 h-20 rounded-lg overflow-hidden
                              border-2 transition-all duration-200
                              ${isCurrentPage 
                                ? 'border-blue-400 shadow-lg shadow-blue-400/25 ring-2 ring-blue-400/50' 
                                : 'border-gray-600 hover:border-gray-500'}
                              ${snapshot.isDragging ? 'rotate-2 scale-105 z-50' : ''}
                            `}
                            onClick={() => onPageSelect(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Page Thumbnail Background */}
                            <div className={`w-full h-full ${color} opacity-20`} />
                            
                            {/* Page Type Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <PageIcon className={`w-6 h-6 ${isCurrentPage ? 'text-blue-400' : 'text-gray-300'}`} />
                            </div>
                            
                            {/* Page Number */}
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                              {index + 1}
                            </div>
                            
                            {/* Page Controls (show on hover) */}
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex space-x-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onPageDuplicate(index);
                                  }}
                                  className="p-1 bg-black bg-opacity-60 text-green-400 rounded hover:bg-opacity-80"
                                  title="Duplicate Page"
                                >
                                  <DocumentDuplicateIcon className="w-3 h-3" />
                                </button>
                                
                                {pages.length > 1 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onPageDelete(index);
                                    }}
                                    className="p-1 bg-black bg-opacity-60 text-red-400 rounded hover:bg-opacity-80"
                                    title="Delete Page"
                                  >
                                    <TrashIcon className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Current Page Indicator */}
                            {isCurrentPage && (
                              <motion.div
                                layoutId="current-page-indicator"
                                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"
                              />
                            )}
                          </motion.div>
                        )}
                      </Draggable>
                    );
                  })}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
        
        {/* Empty State */}
        {pages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <DocumentTextIcon className="w-12 h-12 text-gray-500 mb-3" />
            <p className="text-gray-400 mb-4">No pages yet</p>
            <button
              onClick={() => setShowPageTypes(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageManager; 