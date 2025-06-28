import React, { useState, useEffect, useRef, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const TextBlock = ({ 
  content = {}, 
  styles = {},
  config = {},
  onContentUpdate,
  isEditing = false,
  editable = false 
}) => {
  const [localText, setLocalText] = useState(content.text || '');
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState('auto');

  // Debounced update to prevent too many re-renders
  const debouncedUpdate = useCallback(
    debounce((newText) => {
      if (onContentUpdate) {
        onContentUpdate({ text: newText });
      }
    }, 300),
    [onContentUpdate]
  );

  useEffect(() => {
    setLocalText(content.text || '');
  }, [content.text]);

  // Measure and fix container height to prevent movement
  useEffect(() => {
    if (containerRef.current && !isLocalEditing) {
      const height = containerRef.current.offsetHeight;
      setContainerHeight(height + 'px');
    }
  }, [localText, isLocalEditing]);

  const handleTextClick = () => {
    if (editable && !isLocalEditing) {
      setIsLocalEditing(true);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.select();
        }
      }, 50);
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setLocalText(newText);
    debouncedUpdate(newText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Allow line breaks with Shift+Enter
      return;
    }
    if (e.key === 'Enter' || e.key === 'Escape') {
      handleBlur();
    }
  };

  const handleBlur = () => {
    setIsLocalEditing(false);
    if (onContentUpdate) {
      onContentUpdate({ text: localText });
    }
  };

  // Auto-resize textarea to fit content
  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (isLocalEditing) {
      autoResizeTextarea();
    }
  }, [localText, isLocalEditing]);

  // Process markdown if enabled
  const processedContent = content.markdown && !isLocalEditing
    ? DOMPurify.sanitize(marked(localText || ''))
    : localText || '';

  // Stable styling to prevent layout shifts
  const containerStyles = {
    ...styles,
    minHeight: containerHeight !== 'auto' ? containerHeight : '1.5em',
    transition: 'none', // Remove transitions during editing
    margin: styles.margin ? 
      `${styles.margin.top || 0}px ${styles.margin.right || 0}px ${styles.margin.bottom || 0}px ${styles.margin.left || 0}px` : 
      undefined,
    padding: styles.padding ? 
      `${styles.padding.top || 0}px ${styles.padding.right || 0}px ${styles.padding.bottom || 0}px ${styles.padding.left || 0}px` : 
      undefined,
  };

  const textStyles = {
    fontSize: styles.fontSize || '16px',
    fontWeight: styles.fontWeight || 'normal',
    lineHeight: styles.lineHeight || '1.6',
    color: styles.color || '#ffffff',
    textAlign: styles.textAlign || 'left',
    fontFamily: styles.fontFamily || 'inherit',
  };

  if (isLocalEditing) {
    return (
      <div 
        ref={containerRef}
        className="content-block-stable relative"
        style={containerStyles}
      >
        <textarea
          ref={textareaRef}
          value={localText}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onInput={autoResizeTextarea}
          className="w-full bg-transparent border-2 border-blue-500/50 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none stable-content"
          style={{
            ...textStyles,
            minHeight: '1.5em',
            fontFamily: 'inherit',
          }}
          placeholder="Enter your text here..."
        />
        <div className="absolute -bottom-6 left-0 text-xs text-blue-400 bg-gray-800 px-2 py-1 rounded">
          Press Enter to save, Shift+Enter for new line
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`content-block-stable ${editable ? 'cursor-pointer hover:bg-gray-800/30 rounded-lg transition-colors' : ''}`}
      style={containerStyles}
      onClick={handleTextClick}
    >
      {content.markdown ? (
        <div 
          className="prose prose-invert max-w-none"
          style={textStyles}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      ) : (
        <div style={textStyles} className="whitespace-pre-wrap">
          {processedContent || (editable ? 'Click to edit text...' : '')}
        </div>
      )}
      
      {editable && !isLocalEditing && (
        <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
          <div className="text-xs text-blue-400 bg-gray-800/80 px-2 py-1 rounded">
            Click to edit
          </div>
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default TextBlock; 