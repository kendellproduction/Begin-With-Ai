import React, { useRef, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  TrashIcon, 
  DocumentDuplicateIcon, 
  EyeIcon,
  Cog6ToothIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

import ContentBlockRenderer from '../../ContentBlocks/ContentBlockRenderer';

const CanvasPreview = ({
  blocks = [],
  selectedBlockId,
  onBlockSelect,
  onBlockUpdate,
  onBlockDelete,
  onBlockDuplicate,
  onAddComponent,
  previewMode = false,
  zoom = 100,
  pageTheme = 'dark'
}) => {
  const canvasRef = useRef(null);
  const [showInsertDropdown, setShowInsertDropdown] = useState(null);

  // Component options for the dropdown
  const COMPONENT_OPTIONS = [
    { id: 'text', name: 'Text Block', icon: '📝', description: 'Rich text content' },
    { id: 'heading', name: 'Heading', icon: '📰', description: 'H1, H2, H3 headings' },
    { id: 'image', name: 'Image', icon: '🖼️', description: 'Images with captions' },
    { id: 'video', name: 'Video', icon: '🎥', description: 'Video content' },
    { id: 'quiz', name: 'Quiz', icon: '❓', description: 'Interactive quiz' },
    { id: 'sandbox', name: 'Code', icon: '💻', description: 'Code sandbox' },
    { id: 'fill_blank', name: 'Fill Blanks', icon: '🔤', description: 'Fill in the blanks' },
  ];

  // Background themes for different lesson types (real lesson backgrounds)
  const backgroundThemes = {
    dark: 'bg-gradient-to-br from-gray-900 via-black to-gray-900',
    blue: 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900',
    green: 'bg-gradient-to-br from-green-900 via-emerald-800 to-green-900',
    purple: 'bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900',
    orange: 'bg-gradient-to-br from-orange-900 via-red-800 to-orange-900',
    light: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    coding: 'bg-gradient-to-br from-slate-900 via-black to-zinc-900'
  };

  // Calculate responsive zoom styles
  const canvasStyles = {
    transform: `scale(${zoom / 100})`,
    transformOrigin: 'top center',
    width: `${10000 / zoom}%`,
    maxWidth: 'none'
  };

  const BlockWrapper = ({ block, index, isDragging }) => {
    const isSelected = selectedBlockId === block.id;

    return (
      <div
        className={`
          relative rounded-lg cursor-pointer
          ${isSelected ? 'border-2 border-blue-500 bg-blue-500/10' : 'border-2 border-transparent'}
          ${isDragging ? 'opacity-50' : ''}
        `}
        onClick={(e) => {
          e.stopPropagation();
          if (!previewMode) {
            onBlockSelect(block);
          }
        }}
      >
        {/* Content */}
        <div className="relative">
          <ContentBlockRenderer
            blocks={[block]}
            config={{ 
              lazyLoading: false,
              animations: false,
              trackProgress: false,
              intersectionThreshold: 1,
              preloadOffset: 0
            }}
            styles={block.styles}
          />
        </div>

        {/* Action Buttons - only show when selected */}
        {!previewMode && isSelected && (
          <div className="absolute top-2 right-2 flex space-x-1 bg-gray-900/95 rounded-lg p-1 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBlockSelect(block);
              }}
              className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded"
              title="Edit Properties"
            >
              <Cog6ToothIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBlockDuplicate(block.id);
              }}
              className="p-1.5 text-green-400 hover:text-green-300 hover:bg-gray-700 rounded"
              title="Duplicate Block"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBlockDelete(block.id);
              }}
              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded"
              title="Delete Block"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Block Type Badge - only when selected */}
        {!previewMode && isSelected && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded z-10">
            {block.type}
          </div>
        )}
      </div>
    );
  };

  // Always-visible insertion zones (no hover effects)
  const InsertionZone = ({ index }) => {
    if (previewMode) return null;

    return (
      <div className="relative py-2">
        <div className="flex items-center justify-center relative z-10">
          <div className="relative">
            <button
              onClick={() => setShowInsertDropdown(showInsertDropdown === index ? null : index)}
              className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center space-x-2"
            >
              <PlusIcon className="w-3 h-3" />
              <span>Add</span>
              <ChevronDownIcon className="w-3 h-3" />
            </button>

            {/* Component Dropdown */}
            {showInsertDropdown === index && (
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 min-w-64">
                <div className="p-2">
                  {COMPONENT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        if (onAddComponent) {
                          onAddComponent(option.id, index);
                        }
                        setShowInsertDropdown(null);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 text-left"
                    >
                      <span className="text-lg">{option.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{option.name}</div>
                        <div className="text-xs text-gray-400">{option.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full h-0.5 bg-blue-400/30 rounded-full mt-2" />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-850 overflow-hidden">
      {/* Canvas Header */}
      {!previewMode && (
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-white">Lesson Canvas</h2>
              <span className="text-sm text-gray-400">
                {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Zoom: {zoom}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Content - Real Lesson Style */}
      <div className={`flex-1 overflow-auto relative ${backgroundThemes[pageTheme] || backgroundThemes.dark}`}>
        {/* Static Star Background (like real lessons but calm) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="stars-bg absolute inset-0">
            {/* Generate static stars - no animation */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full opacity-20"
                style={{
                  width: Math.random() * 1.5 + 0.5 + 'px',
                  height: Math.random() * 1.5 + 0.5 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
              />
            ))}
          </div>
        </div>

        {/* Lesson Content Area */}
        <div 
          ref={canvasRef}
          className="relative z-10 min-h-full max-w-4xl mx-auto py-8 px-4"
          style={canvasStyles}
          onClick={() => {
            // Deselect block when clicking on empty canvas
            if (!previewMode) {
              onBlockSelect(null);
            }
          }}
        >

          {/* Drop Zone */}
          <Droppable droppableId="lesson-canvas">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`
                  relative z-10 min-h-full rounded-lg transition-all duration-200
                  ${snapshot.isDraggingOver ? 'bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-400' : ''}
                `}
              >

                {/* Empty State */}
                {blocks.length === 0 && !previewMode && (
                  <div className="flex items-center justify-center min-h-[400px] text-center">
                    <div className="max-w-md">
                      <div className="text-6xl mb-4">🎨</div>
                      <h3 className="text-xl font-semibold text-white mb-2">Start Building Your Lesson</h3>
                      <p className="text-gray-400 mb-6">
                        Click on components from the left panel to add them to your lesson. 
                        Create engaging content with text, images, videos, quizzes, and interactive code blocks.
                      </p>
                      
                      <div className="flex flex-wrap gap-3 justify-center max-w-lg mb-4">
                        <span className="px-4 py-2 bg-blue-600 bg-opacity-30 text-blue-200 rounded-full text-sm font-medium border border-blue-500 border-opacity-30">📝 Text</span>
                        <span className="px-4 py-2 bg-green-600 bg-opacity-30 text-green-200 rounded-full text-sm font-medium border border-green-500 border-opacity-30">🖼️ Images</span>
                        <span className="px-4 py-2 bg-purple-600 bg-opacity-30 text-purple-200 rounded-full text-sm font-medium border border-purple-500 border-opacity-30">🎥 Videos</span>
                        <span className="px-4 py-2 bg-orange-600 bg-opacity-30 text-orange-200 rounded-full text-sm font-medium border border-orange-500 border-opacity-30">❓ Quizzes</span>
                        <span className="px-4 py-2 bg-cyan-600 bg-opacity-30 text-cyan-200 rounded-full text-sm font-medium border border-cyan-500 border-opacity-30">💻 Code</span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        👈 Click components in the left panel to get started
                      </div>
                    </div>
                  </div>
                )}

                {/* Dragging Overlay - only for reordering existing blocks */}
                {snapshot.isDraggingOver && blocks.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="bg-blue-600 bg-opacity-20 border-2 border-dashed border-blue-400 rounded-lg p-8">
                      <div className="text-center text-blue-300">
                        <div className="text-2xl mb-2">🔄</div>
                        <div className="font-semibold">Reorder blocks</div>
                        <div className="text-sm opacity-75">Drop to change position</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lesson Blocks */}
                <div className="space-y-4">
                  {/* Insertion zone at the beginning */}
                  {!previewMode && blocks.length > 0 && (
                    <InsertionZone index={0} />
                  )}
                  
                  {blocks.map((block, index) => (
                    <React.Fragment key={`block-fragment-${block.id}`}>
                      <Draggable
                        key={block.id}
                        draggableId={block.id}
                        index={index}
                        isDragDisabled={previewMode}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <BlockWrapper
                              block={block}
                              index={index}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                      
                      {/* Insertion zone after each block */}
                      {!previewMode && (
                        <InsertionZone index={index + 1} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>

      {/* Canvas Footer */}
      {!previewMode && blocks.length > 0 && (
        <div className="p-3 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div>
              Total blocks: {blocks.length} • 
              Selected: {selectedBlockId ? blocks.find(b => b.id === selectedBlockId)?.type || 'None' : 'None'}
            </div>
            <div className="flex items-center space-x-2">
              <span>Canvas ready</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasPreview; 