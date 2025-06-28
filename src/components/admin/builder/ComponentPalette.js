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
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-700">
        <input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredComponents.map((component, index) => (
            <motion.div
              key={component.type}
              className="bg-gray-700 rounded-lg p-3 border border-gray-600 cursor-pointer hover:border-blue-500 hover:bg-gray-650 transition-all duration-200 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAddComponent(component.type)}
            >
              {/* Component Header */}
              <div className="flex items-center mb-2">
                <div className={`
                  w-8 h-8 rounded-lg bg-gradient-to-r ${component.color} 
                  flex items-center justify-center text-white text-sm mr-3
                `}>
                  {component.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">
                    {component.name}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {component.category}
                  </span>
                </div>
                {/* Add Button */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <PlusIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Component Description */}
              <p className="text-xs text-gray-300 mb-2">
                {component.description}
              </p>

              {/* Preview Text */}
              <div className="text-xs text-blue-400 italic">
                {component.preview}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredComponents.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">
              No components found
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Try adjusting your search or category filter
            </div>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="text-xs text-gray-400">
          <div className="font-medium mb-1">💡 Tips:</div>
          <ul className="space-y-1 text-gray-500">
            <li>• Click components to add them to canvas</li>
            <li>• Use search to find specific blocks</li>
            <li>• Filter by category for organization</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComponentPalette; 