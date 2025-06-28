// Content Blocks Module - Phase 2: Modular Content Block System
// Replaces the slide-based lesson system with scroll-based content blocks

// Core content blocks
export { default as TextBlock } from './TextBlock';
export { default as HeadingBlock } from './HeadingBlock';
export { default as ImageBlock } from './ImageBlock';
export { default as VideoBlock } from './VideoBlock';
export { default as PodcastSyncBlock } from './PodcastSyncBlock';
export { default as QuizBlock } from './QuizBlock';
export { default as SandboxBlock } from './SandboxBlock';
export { default as SectionBreak } from './SectionBreak';

// Interactive content blocks
export { default as FillBlankBlock } from './FillBlankBlock';
export { default as ProgressCheckpoint } from './ProgressCheckpoint';
export { default as CallToActionBlock } from './CallToActionBlock';

// Block rendering utilities
export { default as ContentBlockRenderer } from './ContentBlockRenderer';
export { default as BlockErrorBoundary } from './BlockErrorBoundary';

// Re-export constants from dedicated constants file
export { BLOCK_TYPES, DEFAULT_BLOCK_CONFIG } from './constants'; 