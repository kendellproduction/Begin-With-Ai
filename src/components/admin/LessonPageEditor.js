import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiTrash2, 
  FiMove, 
  FiSave, 
  FiArrowUp, 
  FiArrowDown,
  FiEdit,
  FiType,
  FiImage,
  FiPlay,
  FiHelpCircle,
  FiCode,
  FiX,
  FiFileText
} from 'react-icons/fi';

const LessonPageEditor = ({ pages, onSave, onCancel }) => {
  const [editedPages, setEditedPages] = useState(pages || []);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isAddingPage, setIsAddingPage] = useState(false);

  useEffect(() => {
    setEditedPages(pages || []);
  }, [pages]);

  const handleSave = () => {
    onSave(editedPages);
  };

  const addPage = (type) => {
    const newPage = createPageTemplate(type);
    const newPages = [...editedPages, newPage];
    setEditedPages(newPages);
    setActivePageIndex(newPages.length - 1);
    setIsAddingPage(false);
  };

  const removePage = (index) => {
    const newPages = editedPages.filter((_, i) => i !== index);
    setEditedPages(newPages);
    setActivePageIndex(Math.max(0, Math.min(activePageIndex, newPages.length - 1)));
  };

  const movePage = (index, direction) => {
    const newPages = [...editedPages];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newPages.length) {
      [newPages[index], newPages[newIndex]] = [newPages[newIndex], newPages[index]];
      setEditedPages(newPages);
      setActivePageIndex(newIndex);
    }
  };

  const updatePage = (index, updates) => {
    const newPages = [...editedPages];
    newPages[index] = { ...newPages[index], ...updates };
    setEditedPages(newPages);
  };

  const createPageTemplate = (type) => {
    const templates = {
      text: {
        type: 'text',
        value: 'Enter your text content here...'
      },
      ai_professor_tip: {
        type: 'ai_professor_tip',
        value: 'Add a helpful tip or insight here...'
      },
      image: {
        type: 'image',
        url: '',
        altText: 'Image description',
        caption: ''
      },
      video: {
        type: 'video',
        url: '',
        title: 'Video Title',
        description: ''
      },
      quiz: {
        type: 'quiz',
        question: 'Your quiz question here?',
        options: [
          { text: 'Option 1', correct: false },
          { text: 'Option 2', correct: true },
          { text: 'Option 3', correct: false },
          { text: 'Option 4', correct: false }
        ],
        feedback: 'Explanation of the correct answer...'
      },
      code_challenge: {
        type: 'code_challenge',
        value: 'Describe the coding challenge here...',
        startingCode: '// Your starting code here',
        solution: '// Solution code here',
        hints: ['Hint 1', 'Hint 2']
      }
    };
    
    return templates[type] || templates.text;
  };

  const pageTypes = [
    { type: 'text', label: 'Text', icon: FiType },
    { type: 'ai_professor_tip', label: 'AI Tip', icon: FiHelpCircle },
    { type: 'image', label: 'Image', icon: FiImage },
    { type: 'video', label: 'Video', icon: FiPlay },
    { type: 'quiz', label: 'Quiz', icon: FiHelpCircle },
    { type: 'code_challenge', label: 'Code Challenge', icon: FiCode }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
        <div>
          <h4 className="text-lg font-semibold text-white">Lesson Pages ({editedPages.length})</h4>
          <p className="text-gray-400 text-sm">Edit the content of each page</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddingPage(true)}
            className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <FiPlus className="mr-1 h-4 w-4" />
            Add Page
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FiSave className="mr-2 h-4 w-4" />
            Save All Changes
          </button>
        </div>
      </div>

      {/* Content Type Selector Modal */}
      <AnimatePresence>
        {isAddingPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h5 className="text-xl font-semibold text-white mb-4">Choose Page Type</h5>
              <div className="grid grid-cols-2 gap-3">
                {pageTypes.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => addPage(type)}
                    className="flex items-center p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    {label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsAddingPage(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-4 gap-6 overflow-hidden">
        {/* Pages Sidebar */}
        <div className="col-span-1">
          <h5 className="text-sm font-medium text-gray-300 mb-3">Pages</h5>
          <div className="space-y-2 max-h-full overflow-y-auto">
            {editedPages.map((page, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg cursor-pointer border-2 ${
                  activePageIndex === index
                    ? 'border-indigo-500 bg-indigo-900'
                    : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setActivePageIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white text-sm font-medium">
                      {index + 1}. {page.type.replace('_', ' ')}
                    </span>
                    <p className="text-gray-400 text-xs mt-1">
                      {page.type === 'text' && (page.value?.substring(0, 30) + '...')}
                      {page.type === 'quiz' && page.question?.substring(0, 30) + '...'}
                      {page.type === 'video' && page.title}
                      {page.type === 'image' && page.altText}
                      {page.type === 'code_challenge' && 'Coding Exercise'}
                      {page.type === 'ai_professor_tip' && 'AI Tip'}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePage(index, 'up');
                      }}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-white disabled:opacity-50 p-1"
                    >
                      <FiArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePage(index, 'down');
                      }}
                      disabled={index === editedPages.length - 1}
                      className="text-gray-400 hover:text-white disabled:opacity-50 p-1"
                    >
                      <FiArrowDown className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePage(index);
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <FiTrash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page Editor */}
        <div className="col-span-3">
          {editedPages.length > 0 && editedPages[activePageIndex] && (
            <PageContentEditor
              page={editedPages[activePageIndex]}
              index={activePageIndex}
              onUpdate={(updates) => updatePage(activePageIndex, updates)}
            />
          )}
          
          {editedPages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <FiFileText className="h-12 w-12 mx-auto mb-4" />
                <p>No pages yet. Add your first page to get started.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Page Content Editor Component
const PageContentEditor = ({ page, index, onUpdate }) => {
  const [editedPage, setEditedPage] = useState(page);

  useEffect(() => {
    setEditedPage(page);
  }, [page]);

  const handleUpdate = (updates) => {
    const newPage = { ...editedPage, ...updates };
    setEditedPage(newPage);
    onUpdate(updates);
  };

  const renderEditor = () => {
    switch (page.type) {
      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Text Content</label>
            <textarea
              value={editedPage.value || ''}
              onChange={(e) => handleUpdate({ value: e.target.value })}
              rows={12}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              placeholder="Enter your text content here..."
            />
          </div>
        );

      case 'ai_professor_tip':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">AI Professor Tip</label>
            <textarea
              value={editedPage.value || ''}
              onChange={(e) => handleUpdate({ value: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              placeholder="Add a helpful tip or insight here..."
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
              <input
                type="text"
                value={editedPage.url || ''}
                onChange={(e) => handleUpdate({ url: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Alt Text</label>
              <input
                type="text"
                value={editedPage.altText || ''}
                onChange={(e) => handleUpdate({ altText: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Image description for accessibility"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Caption</label>
              <input
                type="text"
                value={editedPage.caption || ''}
                onChange={(e) => handleUpdate({ caption: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Optional caption"
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Video URL</label>
              <input
                type="text"
                value={editedPage.url || ''}
                onChange={(e) => handleUpdate({ url: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="https://youtube.com/watch?v=... or video file URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={editedPage.title || ''}
                onChange={(e) => handleUpdate({ title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Video title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={editedPage.description || ''}
                onChange={(e) => handleUpdate({ description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Video description"
              />
            </div>
          </div>
        );

      case 'quiz':
        return <QuizEditor page={editedPage} onUpdate={handleUpdate} />;

      case 'code_challenge':
        return <CodeChallengeEditor page={editedPage} onUpdate={handleUpdate} />;

      default:
        return (
          <div className="text-gray-500 text-center py-8">
            Unknown page type: {page.type}
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-gray-800 rounded-lg p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-white">
          Page {index + 1}: {page.type.replace('_', ' ')}
        </h4>
      </div>
      {renderEditor()}
    </div>
  );
};

// Quiz Editor Component
const QuizEditor = ({ page, onUpdate }) => {
  const addOption = () => {
    const newOptions = [...(page.options || []), { text: 'New option', correct: false }];
    onUpdate({ options: newOptions });
  };

  const updateOption = (index, updates) => {
    const newOptions = [...page.options];
    newOptions[index] = { ...newOptions[index], ...updates };
    onUpdate({ options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = page.options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Question</label>
        <textarea
          value={page.question || ''}
          onChange={(e) => onUpdate({ question: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          placeholder="Enter your quiz question here..."
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-300">Options</label>
          <button
            onClick={addOption}
            className="flex items-center px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            <FiPlus className="mr-1 h-3 w-3" />
            Add Option
          </button>
        </div>
        
        <div className="space-y-2">
          {(page.options || []).map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={option.correct}
                onChange={(e) => updateOption(index, { correct: e.target.checked })}
                className="text-green-600"
              />
              <input
                type="text"
                value={option.text}
                onChange={(e) => updateOption(index, { text: e.target.value })}
                className="flex-1 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                placeholder={`Option ${index + 1}`}
              />
              <button
                onClick={() => removeOption(index)}
                className="text-red-400 hover:text-red-300 p-1"
              >
                <FiTrash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Feedback/Explanation</label>
        <textarea
          value={page.feedback || ''}
          onChange={(e) => onUpdate({ feedback: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          placeholder="Explain why this is the correct answer..."
        />
      </div>
    </div>
  );
};

// Code Challenge Editor Component
const CodeChallengeEditor = ({ page, onUpdate }) => {
  const addHint = () => {
    const newHints = [...(page.hints || []), 'New hint'];
    onUpdate({ hints: newHints });
  };

  const updateHint = (index, value) => {
    const newHints = [...page.hints];
    newHints[index] = value;
    onUpdate({ hints: newHints });
  };

  const removeHint = (index) => {
    const newHints = page.hints.filter((_, i) => i !== index);
    onUpdate({ hints: newHints });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Challenge Description</label>
        <textarea
          value={page.value || ''}
          onChange={(e) => onUpdate({ value: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          placeholder="Describe the coding challenge here..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Starting Code</label>
        <textarea
          value={page.startingCode || ''}
          onChange={(e) => onUpdate({ startingCode: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white font-mono text-sm"
          placeholder="// Your starting code here"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Solution Code</label>
        <textarea
          value={page.solution || ''}
          onChange={(e) => onUpdate({ solution: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white font-mono text-sm"
          placeholder="// Solution code here"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-300">Hints</label>
          <button
            onClick={addHint}
            className="flex items-center px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            <FiPlus className="mr-1 h-3 w-3" />
            Add Hint
          </button>
        </div>
        
        <div className="space-y-2">
          {(page.hints || []).map((hint, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={hint}
                onChange={(e) => updateHint(index, e.target.value)}
                className="flex-1 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                placeholder={`Hint ${index + 1}`}
              />
              <button
                onClick={() => removeHint(index)}
                className="text-red-400 hover:text-red-300 p-1"
              >
                <FiTrash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonPageEditor; 