import React, { useState, useRef, useEffect } from 'react';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

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

  const finalConfig = {
    ...defaultConfig,
    ...config,
    // In development, disable lazy-loading to avoid any observer edge-cases
    lazy: process.env.NODE_ENV === 'production' ? (config.lazy ?? defaultConfig.lazy) : false
  };

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

    // Strip query/hash to detect file extension safely
    const cleanSrc = src.split('?')[0].split('#')[0];
    const hasDot = cleanSrc.includes('.');
    const baseUrl = hasDot ? cleanSrc.split('.').slice(0, -1).join('.') : cleanSrc;
    const extension = hasDot ? cleanSrc.split('.').pop().toLowerCase() : '';

    const sources = [];

    // WebP support
    if (finalConfig.webp && hasDot) {
      sources.push({
        srcSet: `${baseUrl}.webp`,
        type: 'image/webp'
      });
    }

    // Original format fallback
    sources.push({
      srcSet: src,
      type: extension ? `image/${extension}` : 'image/*'
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

  const initialSrc = content.src || content.url || content.downloadURL;
  const [resolvedSrc, setResolvedSrc] = useState(initialSrc || '');
  const { src, sources } = generateImageSources(resolvedSrc);

  // Resolve gs:// Firebase Storage URLs to downloadable URLs on the client
  useEffect(() => {
    // Priority 1: explicit stable URL
    if (initialSrc && typeof initialSrc === 'string' && initialSrc.startsWith('http')) {
      setResolvedSrc(initialSrc);
      return;
    }

    // Priority 2: gs:// path -> resolve via Storage
    if (initialSrc && typeof initialSrc === 'string' && initialSrc.startsWith('gs://')) {
      try {
        const withoutScheme = initialSrc.slice('gs://'.length);
        const [bucket, ...pathParts] = withoutScheme.split('/');
        const path = pathParts.join('/');
        if (bucket && path) {
          const r = storageRef(storage, `gs://${bucket}/${path}`);
          getDownloadURL(r).then((url) => setResolvedSrc(url)).catch(() => {
            // Fall back to public alt=media URL (may work if object is public)
            setResolvedSrc(`https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media`);
          });
          return;
        }
      } catch (_) {
        // Ignore and keep initial src
        setResolvedSrc(initialSrc);
      }
    }

    // Priority 3: uploadPath saved by builder
    if (content && content.uploadPath) {
      try {
        const r = storageRef(storage, content.uploadPath);
        getDownloadURL(r).then((url) => setResolvedSrc(url)).catch(() => setResolvedSrc(''));
        return;
      } catch (_) {
        setResolvedSrc('');
      }
    }

    // Priority 4: unsupported blob/file -> show placeholder
    setResolvedSrc('');
  }, [initialSrc]);

  // If an optimistic blob URL is present, force visible and loaded state
  useEffect(() => {
    if (!resolvedSrc) return;
    if (resolvedSrc.startsWith('blob:')) {
      setIsVisible(true);
    }
  }, [resolvedSrc]);

  // Don't render anything if no source
  if (!resolvedSrc) {
    return (
      <div className={`image-block-placeholder ${className}`}>
        <div className="flex items-center justify-center h-48 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600">
          <div className="text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No image provided</p>
            {process.env.NODE_ENV === 'development' && initialSrc && initialSrc.startsWith('blob:') && (
              <p className="text-xs opacity-70 mt-1">This image uses a temporary blob URL. Re-upload in the builder to save to Firebase.</p>
            )}
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