// Content Blocks Module - Phase 2: Modular Content Block System
// Replaces the slide-based lesson system with scroll-based content blocks
import { lazy } from 'react';

// Core content blocks - Lazy loaded for better performance
export const TextBlock = lazy(() => import('./TextBlock'));
export const HeadingBlock = lazy(() => import('./HeadingBlock'));
export const ImageBlock = lazy(() => import('./ImageBlock'));
export const VideoBlock = lazy(() => import('./VideoBlock'));
export const PodcastSyncBlock = lazy(() => import('./PodcastSyncBlock'));
export const QuizBlock = lazy(() => import('./QuizBlock'));
export const SandboxBlock = lazy(() => import('./SandboxBlock'));
export const SectionBreak = lazy(() => import('./SectionBreak'));

// Interactive content blocks - Lazy loaded
export const FillBlankBlock = lazy(() => import('./FillBlankBlock'));
export const ProgressCheckpoint = lazy(() => import('./ProgressCheckpoint'));
export const CallToActionBlock = lazy(() => import('./CallToActionBlock'));
export const APICallBlock = lazy(() => import('./APICallBlock'));

// Block rendering utilities - Always loaded (needed for error boundaries)
export { default as ContentBlockRenderer } from './ContentBlockRenderer';
export { default as BlockErrorBoundary } from './BlockErrorBoundary';

// Re-export constants from dedicated constants file
export { BLOCK_TYPES, DEFAULT_BLOCK_CONFIG } from './constants'; 