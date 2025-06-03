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
    progressInfo
  } = slide.content;

  // Check if this is an interactive teaching slide for a single term
  const isInteractiveTeaching = slide.type === 'interactive_teaching';

  return (
    <div className="text-center space-y-8">
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="text-6xl mb-4"
      >
        {icon}
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-white mb-4"
      >
        {title}
      </motion.h1>

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

      {/* Explanation */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xl md:text-2xl text-gray-100 leading-relaxed font-medium max-w-5xl mx-auto px-4 mb-8 tracking-wide"
      >
        {explanation}
      </motion.p>

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
          className="space-y-3 text-left bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-blue-200 text-center mb-4">Key Points:</h3>
          {keyPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + (index * 0.2) }}
              className="flex items-start space-x-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1 + (index * 0.2) }}
                className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"
              />
              <span className="text-gray-100 leading-relaxed text-base font-medium">{point}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-semibold text-base shadow-lg transition-all duration-300"
      >
        Got it! Continue →
      </motion.button>

      {/* Progress hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
        className="text-gray-500 text-sm"
      >
        Swipe up when ready
      </motion.p>
    </div>
  );
};

export default ConceptSlide; 