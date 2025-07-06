import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const ChecklistBlock = ({ 
  content,
  config = {},
  onComplete = () => {},
  className = ""
}) => {
  const [items, setItems] = useState(content.items || []);
  const [isCompleted, setIsCompleted] = useState(false);
  const blockRef = useRef(null);

  const defaultConfig = {
    allowAdd: false, // Only allow in editing mode
    allowDelete: false,
    showProgress: true,
    completionThreshold: 1.0 // 100% completion required
  };

  const finalConfig = { ...defaultConfig, ...config };

  const handleItemToggle = (itemId) => {
    const newItems = items.map(item => 
      item.id === itemId 
        ? { ...item, checked: !item.checked }
        : item
    );
    
    setItems(newItems);
    
    // Check for completion
    const checkedCount = newItems.filter(item => item.checked).length;
    const completionPercentage = newItems.length > 0 ? checkedCount / newItems.length : 0;
    
    if (completionPercentage >= finalConfig.completionThreshold && !isCompleted) {
      setIsCompleted(true);
      onComplete({ 
        type: 'checklist', 
        completed: true, 
        checkedItems: checkedCount,
        totalItems: newItems.length,
        completionPercentage,
        timestamp: Date.now() 
      });
    }
  };

  const addItem = (text = 'New item') => {
    const newItem = {
      id: Date.now() + Math.random(),
      text,
      checked: false
    };
    setItems([...items, newItem]);
  };

  const removeItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateItemText = (itemId, newText) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, text: newText }
        : item
    ));
  };

  const getProgress = () => {
    const checkedCount = items.filter(item => item.checked).length;
    const totalCount = items.length;
    return totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;
  };

  // Safety check
  if (!items || items.length === 0) {
    return (
      <div className={`checklist-block ${className} bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4`}>
        <h3 className="text-xl font-semibold text-white mb-3">{content.title || 'Checklist'}</h3>
        <p className="text-yellow-400">No checklist items available.</p>
      </div>
    );
  }

  return (
    <motion.div
      ref={blockRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`checklist-block ${className}`}
    >
      {/* Title */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          {content.title || 'Checklist'}
        </h3>
        {content.description && (
          <p className="text-gray-300 text-sm">
            {content.description}
          </p>
        )}
      </div>

      {/* Progress bar */}
      {finalConfig.showProgress && items.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(getProgress())}% complete</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Checklist items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300
              ${item.checked 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-gray-800/50 border-gray-600 hover:border-gray-500'
              }
            `}
          >
            {/* Checkbox */}
            <button
              onClick={() => handleItemToggle(item.id)}
              className={`
                w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300
                ${item.checked 
                  ? 'border-green-400 bg-green-400 text-white' 
                  : 'border-gray-500 hover:border-gray-400'
                }
              `}
            >
              {item.checked && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </motion.svg>
              )}
            </button>

            {/* Item text */}
            <span className={`
              flex-1 transition-all duration-300
              ${item.checked 
                ? 'text-gray-400 line-through' 
                : 'text-gray-200'
              }
            `}>
              {item.text}
            </span>

            {/* Delete button (only in edit mode) */}
            {finalConfig.allowDelete && (
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-500 hover:text-red-400 transition-colors p-1"
                title="Remove item"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add item button (only in edit mode) */}
      {finalConfig.allowAdd && (
        <motion.button
          onClick={() => addItem()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 w-full p-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors"
        >
          + Add item
        </motion.button>
      )}

      {/* Completion message */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center space-x-2 text-green-300"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>All tasks completed! Great work!</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChecklistBlock; 