import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const TextBlock = ({ 
  content,
  config = {},
  styles = {},
  isVisible = true,
  onComplete = () => {},
  className = ""
}) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);
  const blockRef = useRef(null);

  const defaultConfig = {
    sanitization: true,
    markdown: true,
    typography: 'prose',
    animations: true,
    readingTime: true
  };

  const defaultStyles = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#ffffff',
    textAlign: 'left',
    margin: { top: 0, bottom: 16, left: 0, right: 0 },
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  };

  const finalConfig = { ...defaultConfig, ...config };
  const mergedStyles = { ...defaultStyles, ...styles };

  // Convert margin and padding objects to CSS
  const marginStyle = mergedStyles.margin 
    ? `${mergedStyles.margin.top}px ${mergedStyles.margin.right}px ${mergedStyles.margin.bottom}px ${mergedStyles.margin.left}px`
    : '0';
  
  const paddingStyle = mergedStyles.padding 
    ? `${mergedStyles.padding.top}px ${mergedStyles.padding.right}px ${mergedStyles.padding.bottom}px ${mergedStyles.padding.left}px`
    : '0';

  const textStyles = {
    fontSize: mergedStyles.fontSize,
    lineHeight: mergedStyles.lineHeight,
    color: mergedStyles.color,
    textAlign: mergedStyles.textAlign,
    margin: marginStyle,
    padding: paddingStyle
  };

  // Intersection observer for view tracking
  useEffect(() => {
    if (!blockRef.current || hasBeenViewed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          setHasBeenViewed(true);
          onComplete({ type: 'text', viewed: true, timestamp: Date.now() });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(blockRef.current);
    return () => observer.disconnect();
  }, [hasBeenViewed, onComplete]);

  // Podcast synchronization highlight effect
  useEffect(() => {
    setIsHighlighted(isVisible);
  }, [isVisible]);

  // Process content based on configuration
  const processContent = (rawContent) => {
    if (!rawContent) return '';

    let processed = rawContent;

    // Convert markdown to HTML if enabled
    if (finalConfig.markdown && typeof rawContent === 'string') {
      processed = marked(rawContent);
    }

    // Sanitize HTML content for security
    if (finalConfig.sanitization) {
      processed = DOMPurify.sanitize(processed, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 'strike', 'code', 'pre', 
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li', 'blockquote',
          'a', 'img', 'span', 'div'
        ],
        ALLOWED_ATTR: ['href', 'title', 'src', 'alt', 'class', 'id'],
        ALLOW_DATA_ATTR: false
      });
    }

    return processed;
  };

  // Calculate estimated reading time
  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.toString().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes === 1 ? '1 min read' : `${minutes} min read`;
  };

  const processedContent = processContent(content.text || content);
  const readingTime = finalConfig.readingTime ? calculateReadingTime(processedContent) : null;

  return (
    <div
      ref={blockRef}
      className={`text-block ${className}`}
      style={{
        ...textStyles,
        borderRadius: isHighlighted ? '12px' : '0',
        padding: isHighlighted ? '16px' : '0',
        border: isHighlighted ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Reading time indicator */}
      {readingTime && (
        <div className="flex items-center text-sm text-gray-400 mb-3">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {readingTime}
        </div>
      )}

      {/* Main content */}
      <div 
        className={`text-content ${finalConfig.typography === 'prose' ? 'prose prose-invert prose-lg max-w-none' : ''}`}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />

      {/* Visual feedback for completion */}
      {hasBeenViewed && (
        <div
          className="inline-flex items-center mt-3 px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Read
        </div>
      )}
    </div>
  );
};

export default TextBlock; 