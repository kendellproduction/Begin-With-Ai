import React, { useState, useRef, useEffect } from 'react';

const ImageBlock = ({ 
  content,
  config = {},
  onComplete = () => {},
  className = ""
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);
  const imgRef = useRef(null);
  const blockRef = useRef(null);

  const defaultConfig = {
    lazy: true,
    webp: true,
    responsive: true,
    maxWidth: '100%',
    quality: 85,
    placeholder: true,
    zoom: false,
    caption: true
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Intersection observer for lazy loading
  useEffect(() => {
    if (!finalConfig.lazy || !blockRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(blockRef.current);
    return () => observer.disconnect();
  }, [finalConfig.lazy]);

  // View tracking for completion
  useEffect(() => {
    if (!blockRef.current || hasBeenViewed || !isLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          setHasBeenViewed(true);
          onComplete({ type: 'image', viewed: true, timestamp: Date.now() });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(blockRef.current);
    return () => observer.disconnect();
  }, [hasBeenViewed, onComplete, isLoaded]);

  // Generate responsive image sources
  const generateImageSources = (src) => {
    if (!src) return { src: '', sources: [] };

    const baseUrl = src.split('.').slice(0, -1).join('.');
    const extension = src.split('.').pop();

    const sources = [];

    // WebP support
    if (finalConfig.webp) {
      sources.push({
        srcSet: `${baseUrl}.webp`,
        type: 'image/webp'
      });
    }

    // Original format fallback
    sources.push({
      srcSet: src,
      type: `image/${extension}`
    });

    return { src, sources };
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };

  const handleImageError = () => {
    setIsError(true);
    setIsLoaded(false);
  };

  const handleZoomClick = () => {
    if (finalConfig.zoom) {
      // TODO: Implement zoom modal
    }
  };

  const { src, sources } = generateImageSources(content.src || content.url);

  // Don't render anything if no source
  if (!src) {
    return (
      <div className={`image-block-placeholder ${className}`}>
        <div className="flex items-center justify-center h-48 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600">
          <div className="text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No image provided</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={blockRef}
      className={`image-block ${className}`}
      style={{ maxWidth: finalConfig.maxWidth }}
    >
      {/* Image container */}
      <div className="relative overflow-hidden rounded-lg bg-gray-800/50">
        {/* Loading placeholder */}
        {finalConfig.placeholder && !isLoaded && !isError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex items-center justify-center h-48 text-red-400">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm">Failed to load image</p>
            </div>
          </div>
        )}

        {/* Actual image */}
        {(isVisible || !finalConfig.lazy) && (
          <picture>
            {sources.map((source, index) => (
              <source key={index} srcSet={source.srcSet} type={source.type} />
            ))}
            <img
              ref={imgRef}
              src={src}
              alt={content.alt || content.altText || ''}
              onLoad={handleImageLoad}
              onError={handleImageError}
              onClick={finalConfig.zoom ? handleZoomClick : undefined}
              className={`w-full h-auto ${finalConfig.zoom ? 'cursor-zoom-in' : ''} ${finalConfig.responsive ? 'max-w-full' : ''}`}
              style={{
                display: isError ? 'none' : 'block',
                opacity: isLoaded ? 1 : 0
              }}
            />
          </picture>
        )}

        {/* Zoom indicator */}
        {finalConfig.zoom && isLoaded && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </div>
        )}
      </div>

      {/* Caption */}
      {finalConfig.caption && (content.caption || content.title) && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-400 italic">
            {content.caption || content.title}
          </p>
        </div>
      )}

      {/* Completion indicator */}
      {hasBeenViewed && (
        <div className="inline-flex items-center mt-3 px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Viewed
        </div>
      )}
    </div>
  );
};

export default ImageBlock; 