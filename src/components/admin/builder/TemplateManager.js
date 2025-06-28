import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon,
  CodeBracketIcon,
  QuestionMarkCircleIcon,
  PhotoIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const TemplateManager = ({ onApplyTemplate, currentBlocks = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const templates = [
    {
      id: 'coding-lesson',
      name: 'Coding Lesson',
      description: 'Complete coding lesson with explanation and exercise',
      category: 'Programming',
      icon: CodeBracketIcon,
      color: 'from-blue-500 to-indigo-600',
      preview: '5 blocks: Intro → Explanation → Example → Exercise → Summary',
      blocks: [
        {
          id: 'intro-1',
          type: 'text',
          content: {
            text: '# Learn JavaScript Functions\n\nIn this lesson, you\'ll learn how to create and use functions in JavaScript.',
            markdown: true
          }
        },
        {
          id: 'example-1',
          type: 'sandbox',
          content: {
            language: 'javascript',
            code: '// Example: A function that adds two numbers\nfunction addNumbers(a, b) {\n  return a + b;\n}\n\nconst result = addNumbers(5, 3);\nconsole.log(result);',
            instructions: 'Run this code to see how functions work'
          }
        },
        {
          id: 'exercise-1',
          type: 'sandbox',
          content: {
            language: 'javascript',
            code: '// Your turn! Create a function that multiplies two numbers\n// TODO: Write your function here',
            instructions: 'Create a function called multiplyNumbers'
          }
        }
      ]
    },
    {
      id: 'quiz-lesson',
      name: 'Interactive Quiz',
      description: 'Knowledge assessment with multiple choice questions',
      category: 'Assessment',
      icon: QuestionMarkCircleIcon,
      color: 'from-purple-500 to-pink-600',
      preview: '3 blocks: Introduction → Quiz Questions → Results',
      blocks: [
        {
          id: 'quiz-intro-1',
          type: 'text',
          content: {
            text: '# Knowledge Check\n\nLet\'s test what you\'ve learned so far.',
            markdown: true
          }
        },
        {
          id: 'quiz-1',
          type: 'quiz',
          content: {
            question: 'What is the correct way to declare a variable in JavaScript?',
            options: ['var myVariable = 5;', 'variable myVariable = 5;', 'declare myVariable = 5;'],
            correctAnswer: 0,
            explanation: 'In JavaScript, you use "var", "let", or "const" to declare variables.'
          }
        }
      ]
    },
    {
      id: 'simple-intro',
      name: 'Simple Introduction',
      description: 'Basic lesson structure for getting started',
      category: 'Basic',
      icon: SparklesIcon,
      color: 'from-yellow-500 to-orange-500',
      preview: '3 blocks: Welcome → Main Content → Next Steps',
      blocks: [
        {
          id: 'simple-welcome-1',
          type: 'text',
          content: {
            text: '# Welcome to This Lesson\n\nYou\'re about to learn something new and exciting!',
            markdown: true
          }
        },
        {
          id: 'simple-content-1',
          type: 'text',
          content: {
            text: '## Main Content\n\nAdd your lesson content here. You can include key concepts, examples, and activities.',
            markdown: true
          }
        }
      ]
    }
  ];

  const categories = ['All', 'Programming', 'Assessment', 'Basic'];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleApplyTemplate = (template) => {
    if (currentBlocks.length > 0) {
      const confirmReplace = window.confirm(
        'This will replace your current content. Are you sure?'
      );
      if (!confirmReplace) return;
    }
    
    onApplyTemplate(template);
  };

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Template Library</h2>
        <p className="text-gray-400">
          Choose from pre-built lesson templates to get started quickly.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const IconComponent = template.icon;
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-all"
            >
              {/* Template Header */}
              <div className="flex items-start space-x-3 mb-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${template.color} flex-shrink-0`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-lg mb-1">
                    {template.name}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Template Preview */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">Structure Preview:</div>
                <div className="text-sm text-gray-300 bg-gray-800 rounded p-2">
                  {template.preview}
                </div>
              </div>

              {/* Template Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                    {template.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {template.blocks.length} blocks
                  </span>
                </div>
                
                <button
                  onClick={() => handleApplyTemplate(template)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Use Template
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateManager; 