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
          
          // Check if content is placeholder text
          const isPlaceholder = !localText || 
                               localText === 'Click to edit text...' ||
                               localText.trim() === '';
          
          if (isPlaceholder) {
            // Start with empty field for placeholder text
            setLocalText('');
            textareaRef.current.value = '';
            textareaRef.current.setSelectionRange(0, 0);
          } else {
            // Move cursor to the end of existing content
            const textLength = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(textLength, textLength);
          }
          
          // Force text direction
          textareaRef.current.style.direction = 'ltr';
          textareaRef.current.style.textAlign = 'left';
          textareaRef.current.style.unicodeBidi = 'normal';
        }
      }, 50);
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setLocalText(newText);
    debouncedUpdate(newText);
    
    // Ensure cursor positioning is maintained
    if (textareaRef.current) {
      textareaRef.current.style.direction = 'ltr';
      textareaRef.current.style.textAlign = 'left';
    }
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
    fontSize: styles.fontSize || '18px', // Increased from 16px
    fontWeight: styles.fontWeight || 'normal',
    lineHeight: styles.lineHeight || '1.8', // Increased from 1.6 for better readability
    color: styles.color || '#ffffff',
    textAlign: styles.textAlign || 'left',
    fontFamily: styles.fontFamily || 'inherit',
    marginBottom: '1.5rem', // Add space between blocks
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
          value={localText === 'Click to edit text...' ? '' : localText}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onInput={autoResizeTextarea}
          className="w-full bg-transparent border-2 border-blue-500/50 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none stable-content text-block"
          dir="ltr"
          style={{
            ...textStyles,
            minHeight: '1.5em',
            fontFamily: 'inherit',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            direction: 'ltr',
            textAlign: 'left',
            unicodeBidi: 'normal',
            writingMode: 'horizontal-tb'
          }}
          placeholder="Enter your text here..."
          onPaste={(e) => {
            // Preserve formatting from pasted content
            e.preventDefault();
            const pastedText = e.clipboardData.getData('text/plain');
            const currentText = e.target.value;
            const selectionStart = e.target.selectionStart;
            const selectionEnd = e.target.selectionEnd;
            
            const newText = currentText.substring(0, selectionStart) + 
                          pastedText + 
                          currentText.substring(selectionEnd);
            
            setLocalText(newText);
            debouncedUpdate(newText);
            
            // Update cursor position
            setTimeout(() => {
              e.target.selectionStart = e.target.selectionEnd = selectionStart + pastedText.length;
            }, 0);
          }}
        />
        <div className="absolute -bottom-6 left-0 text-xs text-blue-400 bg-gray-800 px-2 py-1 rounded">
          Press Enter to save, Shift+Enter for new line. Formatting will be preserved.
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
      dir="ltr"
    >
      {content.markdown ? (
        <div 
          className="prose prose-invert max-w-none prose-lg prose-enhanced lesson-content"
          style={{
            ...textStyles,
            '--tw-prose-body': '#ffffff',
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-bullets': '#94a3b8',
            '--tw-prose-hr': '#475569',
            '--tw-prose-quotes': '#e2e8f0',
            direction: 'ltr',
            textAlign: 'left',
            unicodeBidi: 'normal'
          }}
          dangerouslySetInnerHTML={{ __html: processedContent }}
          dir="ltr"
        />
      ) : (
        <div 
          style={{
            ...textStyles,
            direction: 'ltr',
            textAlign: 'left',
            unicodeBidi: 'normal'
          }} 
          className="whitespace-pre-wrap leading-relaxed lesson-content"
          dir="ltr"
        >
          {processedContent || (editable ? (
            <span className="italic text-gray-500">
              Click to edit text...
            </span>
          ) : '')}
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