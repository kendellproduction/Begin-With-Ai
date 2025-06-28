import React from 'react';
import { motion } from 'framer-motion';
import { BLOCK_TYPES } from '../../ContentBlocks';
import { PlusIcon } from '@heroicons/react/24/outline';

// Component definitions with icons and descriptions
const COMPONENT_LIBRARY = [
  {
    type: BLOCK_TYPES.TEXT,
    name: 'Text Block',
    icon: '📝',
    description: 'Rich text content with markdown support',
    category: 'Content',
    color: 'from-blue-500 to-indigo-600',
    preview: 'Add formatted text, headings, and paragraphs'
  },
  {
    type: BLOCK_TYPES.IMAGE,
    name: 'Image Block',
    icon: '🖼️',
    description: 'Optimized images with lazy loading',
    category: 'Media',
    color: 'from-green-500 to-emerald-600',
    preview: 'Display images with captions and zoom'
  },
  {
    type: BLOCK_TYPES.VIDEO,
    name: 'Video Block',
    icon: '🎥',
    description: 'YouTube, Vimeo, or HTML5 video',
    category: 'Media',
    color: 'from-red-500 to-pink-600',
    preview: 'Embed videos with progress tracking'
  },
  {
    type: BLOCK_TYPES.QUIZ,
    name: 'Quiz Block',
    icon: '❓',
    description: 'Interactive multiple choice questions',
    category: 'Interactive',
    color: 'from-purple-500 to-violet-600',
    preview: 'Create quizzes with instant feedback'
  },
  {
    type: BLOCK_TYPES.SANDBOX,
    name: 'Code Sandbox',
    icon: '⚡',
    description: 'Interactive coding environment',
    category: 'Interactive',
    color: 'from-yellow-500 to-orange-600',
    preview: 'Let users write and run code'
  },
  {
    type: BLOCK_TYPES.FILL_BLANK,
    name: 'Fill in Blanks',
    icon: '🔤',
    description: 'Interactive text completion exercise',
    category: 'Interactive',
    color: 'from-teal-500 to-cyan-600',
    preview: 'Create fill-in-the-blank exercises'
  },
  {
    type: BLOCK_TYPES.PODCAST_SYNC,
    name: 'Audio Sync',
    icon: '🎵',
    description: 'Content synchronized with audio',
    category: 'Media',
    color: 'from-indigo-500 to-purple-600',
    preview: 'Sync text with podcast timestamps'
  },
  {
    type: BLOCK_TYPES.SECTION_BREAK,
    name: 'Section Break',
    icon: '➖',
    description: 'Visual divider between sections',
    category: 'Layout',
    color: 'from-gray-500 to-slate-600',
    preview: 'Add visual breaks between content'
  },
  {
    type: BLOCK_TYPES.PROGRESS_CHECKPOINT,
    name: 'Progress Point',
    icon: '🎯',
    description: 'Save progress and celebrate milestones',
    category: 'System',
    color: 'from-emerald-500 to-green-600',
    preview: 'Create progress save points'
  },
  {
    type: BLOCK_TYPES.CALL_TO_ACTION,
    name: 'Call to Action',
    icon: '👆',
    description: 'Button or link to guide user actions',
    category: 'Interactive',
    color: 'from-rose-500 to-red-600',
    preview: 'Add buttons and navigation links'
  }
];

// Group components by category
const CATEGORIES = ['Content', 'Media', 'Interactive', 'Layout', 'System'];

const ComponentPalette = ({ onAddComponent }) => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filter components based on category and search
  const filteredComponents = COMPONENT_LIBRARY.filter(component => {
    const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddComponent = (componentType) => {
    if (onAddComponent) {
      onAddComponent(componentType);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-800 to-gray-850">
      {/* Enhanced Search Bar - Compact */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700/50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Enhanced Category Filter - Compact */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700/50">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</h3>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Component List with Custom Scrollbar */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 p-4 space-y-3">
          {filteredComponents.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-gray-400 text-sm">No components found</p>
              <p className="text-gray-500 text-xs mt-1">Try adjusting your search or category filter</p>
            </div>
          ) : (
            filteredComponents.map((component, index) => (
              <motion.div
                key={component.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="group relative bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg p-3 border border-gray-600/30 cursor-pointer hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200 backdrop-blur-sm"
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleAddComponent(component.type)}
              >
                {/* Component Header */}
                <div className="flex items-center mb-2">
                  <div className={`
                    w-8 h-8 rounded-lg bg-gradient-to-r ${component.color} 
                    flex items-center justify-center text-white text-sm mr-3 shadow-sm
                    group-hover:scale-105 transition-transform duration-200
                  `}>
                    {component.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm truncate">
                      {component.name}
                    </h4>
                    <span className="text-xs text-blue-400 font-medium bg-blue-400/10 px-2 py-0.5 rounded-md">
                      {component.category}
                    </span>
                  </div>
                  {/* Enhanced Add Button */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <PlusIcon className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Component Description */}
                <p className="text-xs text-gray-300 mb-2 leading-relaxed line-clamp-2">
                  {component.description}
                </p>

                {/* Component Preview */}
                <div className="text-xs text-gray-400 bg-gray-800/50 rounded-md p-2 border border-gray-700/50">
                  <span className="text-gray-500">Example:</span> {component.preview}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Footer with Tips - Compact */}
      <div className="flex-shrink-0 p-3 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/50">
        <div className="text-center">
          <p className="text-xs text-gray-500">💡 Click any component to add to lesson</p>
        </div>
      </div>
    </div>
  );
};

export default ComponentPalette; 