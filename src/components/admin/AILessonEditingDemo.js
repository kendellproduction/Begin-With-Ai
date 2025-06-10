import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiEdit, FiRefreshCw, FiPlusSquare, FiArrowRight } from 'react-icons/fi';

/**
 * Demo component showcasing AI-powered lesson editing features
 */
const AILessonEditingDemo = () => {
  const [activeDemo, setActiveDemo] = useState(null);

  const demoFeatures = [
    {
      id: 'page_enhancement',
      title: 'AI Page Enhancement',
      description: 'Enhance individual lesson pages with AI assistance',
      icon: FiEdit,
      color: 'blue',
      example: {
        before: 'Variables are containers that store data values.',
        instructions: 'Make this more engaging with practical examples',
        after: 'Think of variables as labeled boxes in your code! 📦 Just like how you might label a box "Books" to store your favorite novels, variables let you label and store different types of data. For example, you might store a player\'s name in a variable called "playerName" or their score in "currentScore". This makes your code organized and easy to understand!'
      }
    },
    {
      id: 'lesson_regeneration',
      title: 'Full Lesson Regeneration',
      description: 'Regenerate entire lessons with specific instructions',
      icon: FiRefreshCw,
      color: 'purple',
      example: {
        before: 'Basic lesson about loops',
        instructions: 'Make this more interactive with practical coding exercises',
        after: 'Interactive lesson with step-by-step coding challenges, multiple practice exercises, and real-world examples like automating repetitive tasks'
      }
    },
    {
      id: 'template_creation',
      title: 'Template-Based Creation',
      description: 'Create new lessons from AI-powered templates',
      icon: FiPlusSquare,
      color: 'green',
      example: {
        inputs: {
          topic: 'React Hooks',
          key_concepts: 'useState, useEffect, custom hooks',
          target_audience: 'intermediate developers'
        },
        output: 'Complete lesson with introduction, concept explanations, code examples, interactive exercises, and assessment quizzes'
      }
    }
  ];

  const DemoCard = ({ feature, isActive, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
        isActive 
          ? `border-${feature.color}-500 bg-${feature.color}-900/20` 
          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
      }`}
    >
      <div className="flex items-center mb-4">
        <feature.icon className={`h-8 w-8 mr-3 text-${feature.color}-400`} />
        <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
      </div>
      <p className="text-gray-300 mb-4">{feature.description}</p>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-gray-600"
        >
          <ExampleDisplay feature={feature} />
        </motion.div>
      )}
    </motion.div>
  );

  const ExampleDisplay = ({ feature }) => {
    if (feature.id === 'template_creation') {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Template Inputs:</h4>
            <div className="bg-gray-800 p-3 rounded text-sm">
              {Object.entries(feature.example.inputs).map(([key, value]) => (
                <div key={key} className="text-gray-300">
                  <span className="text-blue-400">{key}:</span> {value}
                </div>
              ))}
            </div>
          </div>
          <FiArrowRight className="text-green-400 mx-auto" />
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">AI Generated:</h4>
            <div className="bg-green-900/20 border border-green-500/30 p-3 rounded text-sm text-green-200">
              {feature.example.output}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Before:</h4>
          <div className="bg-gray-800 p-3 rounded text-sm text-gray-300">
            {feature.example.before}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">AI Instructions:</h4>
          <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded text-sm text-blue-200">
            "{feature.example.instructions}"
          </div>
        </div>
        <FiArrowRight className={`text-${feature.color}-400 mx-auto`} />
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">After AI Enhancement:</h4>
          <div className={`bg-${feature.color}-900/20 border border-${feature.color}-500/30 p-3 rounded text-sm text-${feature.color}-200`}>
            {feature.example.after}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
          <FiZap className="mr-3 text-yellow-400" />
          AI-Powered Lesson Editing
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Transform your lesson creation and editing workflow with intelligent AI assistance. 
          Enhance individual pages, regenerate full lessons, or create from scratch using smart templates.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mb-8">
        {demoFeatures.map(feature => (
          <DemoCard
            key={feature.id}
            feature={feature}
            isActive={activeDemo === feature.id}
            onClick={() => setActiveDemo(activeDemo === feature.id ? null : feature.id)}
          />
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-white font-medium mb-2">Provide Instructions</h3>
            <p className="text-gray-300 text-sm">
              Tell the AI what you want to improve or create using natural language
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-white font-medium mb-2">AI Processing</h3>
            <p className="text-gray-300 text-sm">
              Advanced AI analyzes your content and requirements to generate improvements
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-white font-medium mb-2">Review & Apply</h3>
            <p className="text-gray-300 text-sm">
              Review the AI-enhanced content and apply changes with one click
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Key Benefits</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="text-green-400 mr-3">✓</div>
            <div>
              <h3 className="text-white font-medium">Save Time</h3>
              <p className="text-gray-300 text-sm">Reduce lesson creation time by 70% with AI assistance</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-green-400 mr-3">✓</div>
            <div>
              <h3 className="text-white font-medium">Improve Quality</h3>
              <p className="text-gray-300 text-sm">AI ensures consistent, engaging content structure</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-green-400 mr-3">✓</div>
            <div>
              <h3 className="text-white font-medium">Maintain Control</h3>
              <p className="text-gray-300 text-sm">Review and edit all AI suggestions before applying</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-green-400 mr-3">✓</div>
            <div>
              <h3 className="text-white font-medium">Cost Effective</h3>
              <p className="text-gray-300 text-sm">Optimized API usage keeps costs under $15/month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILessonEditingDemo; 