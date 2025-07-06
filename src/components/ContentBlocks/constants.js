// Content Block Constants
// Extracted from index.js to prevent circular dependencies

// Block type registry for dynamic rendering
export const BLOCK_TYPES = {
  TEXT: 'text',
  HEADING: 'heading',
  IMAGE: 'image', 
  VIDEO: 'video',
  PODCAST_SYNC: 'podcast_sync',
  QUIZ: 'quiz',
  SANDBOX: 'sandbox',
  SECTION_BREAK: 'section_break',
  FILL_BLANK: 'fill_blank',
  CHECKLIST: 'checklist',
  PROGRESS_CHECKPOINT: 'progress_checkpoint',
  CALL_TO_ACTION: 'call_to_action',
  API_CALL: 'api_call'
};

// Default block configurations
export const DEFAULT_BLOCK_CONFIG = {
  [BLOCK_TYPES.TEXT]: {
    styles: {
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '24px',
      color: '#ffffff'
    },
    sanitization: true,
    markdown: true
  },
  [BLOCK_TYPES.HEADING]: {
    styles: {
      fontWeight: 'bold',
      lineHeight: '1.2',
      marginBottom: '16px',
      color: '#ffffff'
    },
    animations: true,
    clickable: false
  },
  [BLOCK_TYPES.IMAGE]: {
    lazy: true,
    webp: true,
    responsive: true,
    maxWidth: '100%'
  },
  [BLOCK_TYPES.VIDEO]: {
    lazy: true,
    autoplay: false,
    controls: true,
    responsive: true
  },
  [BLOCK_TYPES.PODCAST_SYNC]: {
    highlightColor: 'rgba(59, 130, 246, 0.3)',
    animationDuration: '0.5s'
  },
  [BLOCK_TYPES.QUIZ]: {
    showFeedback: true,
    allowRetry: true,
    shuffleOptions: false
  },
  [BLOCK_TYPES.SANDBOX]: {
    isolationLevel: 'strict',
    timeout: 30000,
    allowedModules: []
  },
  [BLOCK_TYPES.CHECKLIST]: {
    allowAdd: false,
    allowDelete: false,
    showProgress: true,
    completionThreshold: 1.0
  },
  [BLOCK_TYPES.API_CALL]: {
    enableAPI: false,
    showSystemPrompt: false,
    allowEdit: true,
    maxLength: 500,
    rateLimitMs: 2000
  }
}; 