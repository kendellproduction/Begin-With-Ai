import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import BlockErrorBoundary from './BlockErrorBoundary';
import { BLOCK_TYPES, DEFAULT_BLOCK_CONFIG } from './constants';

// Lazy load all content blocks for performance
const TextBlock = lazy(() => import('./TextBlock'));
const HeadingBlock = lazy(() => import('./HeadingBlock'));
const ImageBlock = lazy(() => import('./ImageBlock'));
const VideoBlock = lazy(() => import('./VideoBlock'));
const PodcastSyncBlock = lazy(() => import('./PodcastSyncBlock'));
const QuizBlock = lazy(() => import('./QuizBlock'));
const SandboxBlock = lazy(() => import('./SandboxBlock'));
const SectionBreak = lazy(() => import('./SectionBreak'));
const FillBlankBlock = lazy(() => import('./FillBlankBlock'));
const ChecklistBlock = lazy(() => import('./ChecklistBlock'));
const ProgressCheckpoint = lazy(() => import('./ProgressCheckpoint'));
const CallToActionBlock = lazy(() => import('./CallToActionBlock'));
const APICallBlock = lazy(() => import('./APICallBlock'));

const ContentBlockRenderer = ({
  blocks = [],
  config = {},
  styles = {},
  audioCurrentTime = 0,
  onBlockComplete = () => {},
  onProgressUpdate = () => {},
  className = ""
}) => {
  const [visibleBlocks, setVisibleBlocks] = useState(new Set());
  const [completedBlocks, setCompletedBlocks] = useState(new Set());
  const containerRef = useRef(null);

  const defaultConfig = {
    lazyLoading: true,
    animations: true,
    trackProgress: true,
    intersectionThreshold: 0.1,
    preloadOffset: 2 // Number of blocks to preload before they become visible
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!finalConfig.lazyLoading || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const blockIndex = parseInt(entry.target.dataset.blockIndex);
          
          if (entry.isIntersecting) {
            setVisibleBlocks(prev => new Set([...prev, blockIndex]));
            
            // Preload upcoming blocks
            for (let i = 1; i <= finalConfig.preloadOffset; i++) {
              const nextIndex = blockIndex + i;
              if (nextIndex < blocks.length) {
                setVisibleBlocks(prev => new Set([...prev, nextIndex]));
              }
            }
          }
        });
      },
      { threshold: finalConfig.intersectionThreshold }
    );

    // Observe all block containers
    const blockElements = containerRef.current.querySelectorAll('[data-block-index]');
    blockElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [blocks.length, finalConfig.lazyLoading, finalConfig.intersectionThreshold, finalConfig.preloadOffset]);

  // Initialize first few blocks as visible for immediate loading
  useEffect(() => {
    if (finalConfig.lazyLoading) {
      const initialVisible = new Set();
      for (let i = 0; i < Math.min(3, blocks.length); i++) {
        initialVisible.add(i);
      }
      setVisibleBlocks(initialVisible);
    } else {
      // Load all blocks if lazy loading is disabled
      const allVisible = new Set(blocks.map((_, index) => index));
      setVisibleBlocks(allVisible);
    }
  }, [blocks.length, finalConfig.lazyLoading]);

  const handleBlockComplete = (blockIndex, completionData) => {
    const newCompleted = new Set([...completedBlocks, blockIndex]);
    setCompletedBlocks(newCompleted);
    
    const progressPercentage = (newCompleted.size / blocks.length) * 100;
    
    onBlockComplete(blockIndex, completionData);
    onProgressUpdate({
      completed: newCompleted.size,
      total: blocks.length,
      percentage: progressPercentage,
      lastCompleted: blockIndex
    });
  };

  const getBlockComponent = (blockType) => {
    const componentMap = {
      [BLOCK_TYPES.TEXT]: TextBlock,
      [BLOCK_TYPES.HEADING]: HeadingBlock,
      [BLOCK_TYPES.IMAGE]: ImageBlock,
      [BLOCK_TYPES.VIDEO]: VideoBlock,
      [BLOCK_TYPES.PODCAST_SYNC]: PodcastSyncBlock,
      [BLOCK_TYPES.QUIZ]: QuizBlock,
      [BLOCK_TYPES.SANDBOX]: SandboxBlock,
      [BLOCK_TYPES.SECTION_BREAK]: SectionBreak,
      [BLOCK_TYPES.FILL_BLANK]: FillBlankBlock,
      [BLOCK_TYPES.CHECKLIST]: ChecklistBlock,
      [BLOCK_TYPES.PROGRESS_CHECKPOINT]: ProgressCheckpoint,
      [BLOCK_TYPES.CALL_TO_ACTION]: CallToActionBlock,
      [BLOCK_TYPES.API_CALL]: APICallBlock
    };

    return componentMap[blockType] || TextBlock;
  };

  const renderBlock = (block, index) => {
    const isVisible = visibleBlocks.has(index);
    const isCompleted = completedBlocks.has(index);
    
    if (!isVisible && finalConfig.lazyLoading) {
      return (
        <div 
          key={`placeholder-${index}`}
          className="h-32 bg-gray-800/20 rounded-lg animate-pulse"
          data-block-index={index}
        />
      );
    }

    const BlockComponent = getBlockComponent(block.type);
    const blockConfig = {
      ...DEFAULT_BLOCK_CONFIG[block.type],
      ...block.config
    };

    // Merge global styles with block-specific styles
    const blockStyles = {
      ...styles,
      ...block.styles
    };

    return (
      <div
        key={`block-${index}`}
        data-block-index={index}
        className={`content-block-wrapper mb-8 ${isCompleted ? 'completed' : ''}`}
      >
        <BlockErrorBoundary blockIndex={index} blockType={block.type}>
          <Suspense fallback={<BlockLoadingPlaceholder />}>
            <BlockComponent
              content={block.content}
              config={blockConfig}
              styles={blockStyles}
              audioCurrentTime={audioCurrentTime}
              onComplete={(completionData) => handleBlockComplete(index, completionData)}
              className={`block-${block.type} ${isCompleted ? 'block-completed' : ''}`}
            />
          </Suspense>
        </BlockErrorBoundary>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`content-block-renderer ${className}`}
    >
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

// Simple loading placeholder component (no animations)
const BlockLoadingPlaceholder = () => (
  <div className="flex items-center justify-center h-20 bg-gray-800/30 rounded-lg">
    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
  </div>
);

export default ContentBlockRenderer;