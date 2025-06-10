import React from 'react';
import { motion } from 'framer-motion';

const ConceptSlide = ({ slide, onNext, isActive }) => {
  const { 
    title, 
    explanation, 
    icon, 
    keyPoints, 
    vocabulary,
    term,
    definition,
    whatItMeans,
    example,
    category,
    progressInfo,
    isHighlight,
    isComplete,
    imageUrl,
    videoUrl
  } = slide.content;

  // Check if this is an interactive teaching slide for a single term
  const isInteractiveTeaching = slide.type === 'interactive_teaching';

  // Special styling for summary and completion slides
  const isSpecialSlide = isComplete || title.includes('Summary') || title.includes('Complete');
  const containerClass = isSpecialSlide 
    ? "text-center space-y-6 bg-gradient-to-br from-green-900/20 to-blue-900/20 p-6 rounded-2xl border border-green-500/30"
    : isHighlight 
      ? "text-center space-y-6 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-6 rounded-2xl border border-yellow-500/30"
      : "text-center space-y-6";

  return (
    <div className={containerClass}>
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="text-6xl mb-4"
      >
        {icon}
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`text-2xl md:text-3xl font-bold mb-4 ${
          isComplete ? 'text-green-300' : isHighlight ? 'text-yellow-300' : 'text-white'
        }`}
      >
        {title}
      </motion.h2>

      {/* Progress Info for Interactive Teaching */}
      {progressInfo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-blue-500/20 rounded-xl px-4 py-2 text-blue-200 text-sm font-medium mb-4"
        >
          {progressInfo}
        </motion.div>
      )}

      {/* Main explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-4"
      >
        <p className="text-lg md:text-xl text-gray-100 leading-relaxed max-w-2xl mx-auto">
          {explanation}
        </p>

        {/* Display image if provided */}
        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6"
          >
            <img 
              src={imageUrl} 
              alt={title}
              className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
            />
          </motion.div>
        )}

        {/* Display video if provided */}
        {videoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6"
          >
            <video 
              src={videoUrl} 
              controls
              className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
            >
              Your browser does not support the video tag.
            </video>
          </motion.div>
        )}
      </motion.div>

      {/* Interactive Teaching: Single Term Display */}
      {isInteractiveTeaching && term && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-3xl p-8 border border-slate-600/50 max-w-2xl mx-auto shadow-2xl"
        >
          <div className="text-left space-y-6">
            {/* Term Title */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-cyan-300 mb-3">{term}</h2>
              {category && (
                <span className="inline-block bg-purple-500/20 text-purple-200 px-4 py-2 rounded-full text-sm font-medium">
                  {category}
                </span>
              )}
            </div>

            {/* Definition */}
            <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/20">
              <h4 className="text-blue-300 font-semibold mb-3">Definition:</h4>
              <p className="text-gray-200 text-lg leading-relaxed">{definition}</p>
            </div>

            {/* What it means (simplified) */}
            {whatItMeans && (
              <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/20">
                <h4 className="text-green-300 font-semibold mb-3">In Simple Terms:</h4>
                <p className="text-gray-200 text-lg leading-relaxed">{whatItMeans}</p>
              </div>
            )}

            {/* Example */}
            {example && (
              <div className="bg-orange-500/10 rounded-2xl p-6 border border-orange-500/20">
                <h4 className="text-orange-300 font-semibold mb-3">Example:</h4>
                <p className="text-gray-200 text-lg leading-relaxed">{example}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Vocabulary Terms */}
      {!isInteractiveTeaching && vocabulary && vocabulary.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-4 max-w-4xl mx-auto"
        >
          {vocabulary.map((term, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + (index * 0.15) }}
              className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600/50"
            >
              <div className="text-left space-y-3">
                {/* Term and Definition */}
                <div>
                  <h3 className="text-xl font-bold text-cyan-300 mb-2">{term.term}</h3>
                  <p className="text-gray-200 text-lg leading-relaxed">{term.definition}</p>
                </div>

                {/* What it means (simplified) */}
                {term.whatItMeans && (
                  <div className="bg-blue-500/10 rounded-xl p-4">
                    <p className="text-blue-200 text-base">
                      <span className="font-semibold">In simple terms:</span> {term.whatItMeans}
                    </p>
                  </div>
                )}

                {/* Example */}
                {term.example && (
                  <div className="bg-green-500/10 rounded-xl p-4">
                    <p className="text-green-200 text-base">
                      <span className="font-semibold">Example:</span> {term.example}
                    </p>
                  </div>
                )}

                {/* Category tag */}
                {term.category && (
                  <div className="flex justify-start">
                    <span className="inline-block bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
                      {term.category}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Key Points */}
      {!isInteractiveTeaching && keyPoints && keyPoints.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-3 text-left bg-white/10 rounded-lg p-4 max-w-2xl mx-auto"
        >
          <h4 className="text-md font-semibold text-blue-200 mb-3">Key Points:</h4>
          <ul className="space-y-2 text-left">
            {keyPoints.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + (index * 0.1) }}
                className="flex items-start space-x-2"
              >
                <span className="text-blue-400 text-sm mt-1">•</span>
                <span className="text-gray-200 text-sm leading-relaxed">{point}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Continue button */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 ${
          isComplete 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-green-500/30' 
            : isHighlight 
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600 shadow-yellow-500/30'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-blue-500/30'
        }`}
      >
        {isComplete ? '🎉 Finish Lesson!' : 'Continue'}
      </motion.button>

      {/* Swipe hint for non-completion slides */}
      {!isComplete && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="text-gray-500 text-sm"
        >
          Swipe up to continue
        </motion.p>
      )}
    </div>
  );
};

export default ConceptSlide; 