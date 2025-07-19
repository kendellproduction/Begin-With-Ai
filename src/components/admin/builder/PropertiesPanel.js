import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SwatchIcon, 
  PhotoIcon, 
  VideoCameraIcon,
  CodeBracketIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  TrashIcon,
  PlusIcon,
  PaintBrushIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

const PropertiesPanel = ({ block, onContentUpdate, onConfigUpdate, onStylesUpdate }) => {
  const [localContent, setLocalContent] = useState(block?.content || {});
  const [localConfig, setLocalConfig] = useState(block?.config || {});
  const [localStyles, setLocalStyles] = useState(block?.styles || {});
  const [activeTab, setActiveTab] = useState('content'); // content, styles, config

  // Update local state when block changes
  useEffect(() => {
    if (block) {
      setLocalContent(block.content || {});
      setLocalConfig(block.config || {});
      setLocalStyles(block.styles || {});
    }
  }, [block]);

  if (!block) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-gradient-to-b from-gray-800 to-gray-850">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-600/30">
            <div className="text-3xl">🎯</div>
          </div>
          <div className="font-semibold text-white mb-2">No Block Selected</div>
          <div className="text-sm text-gray-400 leading-relaxed">Click on a block in the canvas<br />to edit its properties</div>
        </div>
      </div>
    );
  }

  const handleContentChange = (field, value) => {
    const newContent = { ...localContent, [field]: value };
    setLocalContent(newContent);
    onContentUpdate(newContent);
  };

  const handleConfigChange = (field, value) => {
    const newConfig = { ...localConfig, [field]: value };
    setLocalConfig(newConfig);
    onConfigUpdate(newConfig);
  };

  const handleStyleChange = (field, value) => {
    const newStyles = { ...localStyles, [field]: value };
    setLocalStyles(newStyles);
    onStylesUpdate(newStyles);
  };

  const handleMarginChange = (side, value) => {
    const currentMargin = localStyles.margin || { top: 0, bottom: 0, left: 0, right: 0 };
    const newMargin = { ...currentMargin, [side]: parseInt(value) || 0 };
    handleStyleChange('margin', newMargin);
  };

  const handlePaddingChange = (side, value) => {
    const currentPadding = localStyles.padding || { top: 0, bottom: 0, left: 0, right: 0 };
    const newPadding = { ...currentPadding, [side]: parseInt(value) || 0 };
    handleStyleChange('padding', newPadding);
  };

  const handleMarginPaddingChange = (type, side, value) => {
    if (type === 'margin') {
      handleMarginChange(side, value);
    } else if (type === 'padding') {
      handlePaddingChange(side, value);
    }
  };

  // Enhanced Text Block Properties with rich formatting
  const renderTextBlockProperties = () => (
    <div className="space-y-6">
      {/* Content Tab */}
      {activeTab === 'content' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
            <textarea
              value={localContent.text || ''}
              onChange={(e) => handleContentChange('text', e.target.value)}
              placeholder="Enter your text content..."
              className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              dir="ltr"
              style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                fontFamily: 'inherit',
                lineHeight: '1.5',
                direction: 'ltr',
                textAlign: 'left',
                unicodeBidi: 'normal'
              }}
              onPaste={(e) => {
                // Preserve formatting from pasted content
                e.preventDefault();
                const pastedText = e.clipboardData.getData('text/plain');
                const currentText = e.target.value;
                const selectionStart = e.target.selectionStart;
                const selectionEnd = e.target.selectionEnd;
                
                const newText = currentText.substring(0, selectionStart) + 
                              pastedText + 
                              currentText.substring(selectionEnd);
                
                handleContentChange('text', newText);
                
                // Update cursor position
                setTimeout(() => {
                  e.target.selectionStart = e.target.selectionEnd = selectionStart + pastedText.length;
                }, 0);
              }}
            />
            <div className="text-xs text-gray-500 mt-1">
              Supports Markdown formatting. Line breaks and spacing will be preserved.
            </div>
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localContent.markdown || false}
                onChange={(e) => handleContentChange('markdown', e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Enable Markdown</span>
            </label>
          </div>
        </>
      )}

      {/* Styles Tab */}
      {activeTab === 'styles' && (
        <>
          {/* Typography Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Font Family</label>
              <select
                value={localStyles.fontFamily || 'inherit'}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              >
                <option value="inherit">Default</option>
                <option value="'Inter', sans-serif">Inter (Modern)</option>
                <option value="'Roboto', sans-serif">Roboto (Clean)</option>
                <option value="'Poppins', sans-serif">Poppins (Friendly)</option>
                <option value="'Montserrat', sans-serif">Montserrat (Professional)</option>
                <option value="'Source Sans Pro', sans-serif">Source Sans Pro</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
                <option value="'Lato', sans-serif">Lato</option>
                <option value="Georgia, serif">Georgia (Serif)</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New (Code)</option>
                <option value="'Fira Code', monospace">Fira Code (Modern Code)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Font Size</label>
              <input
                type="range"
                min="12"
                max="48"
                value={parseInt(localStyles.fontSize) || 16}
                onChange={(e) => handleStyleChange('fontSize', e.target.value + 'px')}
                className="w-full"
              />
              <div className="text-xs text-gray-400 text-center mt-1">{parseInt(localStyles.fontSize) || 16}px</div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Line Height</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={parseFloat(localStyles.lineHeight) || 1.5}
                onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                className="w-full"
              />
              <div className="text-xs text-gray-400 text-center mt-1">{parseFloat(localStyles.lineHeight) || 1.5}</div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Font Weight</label>
              <select
                value={localStyles.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              >
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semi Bold</option>
                <option value="700">Bold</option>
                <option value="800">Extra Bold</option>
              </select>
            </div>

            <ColorPicker
              value={localStyles.color || '#ffffff'}
              onChange={(value) => handleStyleChange('color', value)}
              label="Text Color"
            />

            <div>
              <label className="block text-xs text-gray-400 mb-2">Text Alignment</label>
              <div className="flex space-x-1">
                {['left', 'center', 'right', 'justify'].map((align) => (
                  <button
                    key={align}
                    onClick={() => handleStyleChange('textAlign', align)}
                    className={`flex-1 py-2 px-3 text-xs rounded ${
                      (localStyles.textAlign || 'left') === align
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <SpacingDiagram
            type="margin"
            values={localStyles.margin || {}}
            onChange={(side, value) => handleMarginPaddingChange('margin', side, value)}
            label="Margin"
          />

          <SpacingDiagram
            type="padding"
            values={localStyles.padding || {}}
            onChange={(side, value) => handleMarginPaddingChange('padding', side, value)}
            label="Padding"
          />

          <ColorPicker
            value={localStyles.backgroundColor || 'transparent'}
            onChange={(value) => handleStyleChange('backgroundColor', value)}
            label="Background Color"
          />
        </>
      )}
    </div>
  );

  // New Heading Block Properties
  const renderHeadingBlockProperties = () => (
    <div className="space-y-6">
      {/* Content Tab */}
      {activeTab === 'content' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Heading Text</label>
            <input
              type="text"
              value={localContent.text || ''}
              onChange={(e) => handleContentChange('text', e.target.value)}
              placeholder="Enter your heading..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Heading Level</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    handleContentChange('level', level);
                    // Auto-adjust font size based on heading level
                    const sizes = { 1: '32px', 2: '28px', 3: '24px', 4: '20px', 5: '18px', 6: '16px' };
                    handleStyleChange('fontSize', sizes[level]);
                  }}
                  className={`px-3 py-2 text-sm rounded ${
                    localContent.level === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  H{level}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Styles Tab */}
      {activeTab === 'styles' && (
        <>
          {/* Typography Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Font Family</label>
              <select
                value={localStyles.fontFamily || 'inherit'}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              >
                <option value="inherit">Default</option>
                <option value="'Inter', sans-serif">Inter (Modern)</option>
                <option value="'Roboto', sans-serif">Roboto (Clean)</option>
                <option value="'Poppins', sans-serif">Poppins (Friendly)</option>
                <option value="'Montserrat', sans-serif">Montserrat (Professional)</option>
                <option value="'Source Sans Pro', sans-serif">Source Sans Pro</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
                <option value="'Lato', sans-serif">Lato</option>
                <option value="Georgia, serif">Georgia (Serif)</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New (Code)</option>
                <option value="'Fira Code', monospace">Fira Code (Modern Code)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Font Size</label>
              <input
                type="range"
                min="12"
                max="48"
                value={parseInt(localStyles.fontSize) || 16}
                onChange={(e) => handleStyleChange('fontSize', e.target.value + 'px')}
                className="w-full"
              />
              <div className="text-xs text-gray-400 text-center mt-1">{parseInt(localStyles.fontSize) || 16}px</div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Line Height</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={parseFloat(localStyles.lineHeight) || 1.5}
                onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                className="w-full"
              />
              <div className="text-xs text-gray-400 text-center mt-1">{parseFloat(localStyles.lineHeight) || 1.5}</div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Font Weight</label>
              <select
                value={localStyles.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              >
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semi Bold</option>
                <option value="700">Bold</option>
                <option value="800">Extra Bold</option>
              </select>
            </div>

            <ColorPicker
              value={localStyles.color || '#ffffff'}
              onChange={(value) => handleStyleChange('color', value)}
              label="Text Color"
            />

            <div>
              <label className="block text-xs text-gray-400 mb-2">Text Alignment</label>
              <div className="flex space-x-1">
                {['left', 'center', 'right', 'justify'].map((align) => (
                  <button
                    key={align}
                    onClick={() => handleStyleChange('textAlign', align)}
                    className={`flex-1 py-2 px-3 text-xs rounded ${
                      (localStyles.textAlign || 'left') === align
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <SpacingDiagram
            type="margin"
            values={localStyles.margin || {}}
            onChange={(side, value) => handleMarginPaddingChange('margin', side, value)}
            label="Margin"
          />

          <SpacingDiagram
            type="padding"
            values={localStyles.padding || {}}
            onChange={(side, value) => handleMarginPaddingChange('padding', side, value)}
            label="Padding"
          />

          <ColorPicker
            value={localStyles.backgroundColor || 'transparent'}
            onChange={(value) => handleStyleChange('backgroundColor', value)}
            label="Background Color"
          />
        </>
      )}
    </div>
  );

  const renderQuizBlockProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Question</label>
        <input
          type="text"
          value={localContent.question || ''}
          onChange={(e) => handleContentChange('question', e.target.value)}
          placeholder="Enter your question..."
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Answer Options</label>
        <div className="space-y-2">
          {(localContent.options || ['', '', '']).map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                name="correct-answer"
                checked={localContent.correctAnswer === index}
                onChange={() => handleContentChange('correctAnswer', index)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...(localContent.options || ['', '', ''])];
                  newOptions[index] = e.target.value;
                  handleContentChange('options', newOptions);
                }}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {(localContent.options || []).length > 2 && (
                <button
                  onClick={() => {
                    const newOptions = (localContent.options || []).filter((_, i) => i !== index);
                    handleContentChange('options', newOptions);
                    if (localContent.correctAnswer >= newOptions.length) {
                      handleContentChange('correctAnswer', 0);
                    }
                  }}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={() => {
            const newOptions = [...(localContent.options || []), ''];
            handleContentChange('options', newOptions);
          }}
          className="mt-2 flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Option</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Explanation</label>
        <textarea
          value={localContent.explanation || ''}
          onChange={(e) => handleContentChange('explanation', e.target.value)}
          placeholder="Explain why this is the correct answer..."
          className="w-full h-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );

  const renderImageBlockProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
        <input
          type="url"
          value={localContent.src || ''}
          onChange={(e) => handleContentChange('src', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Alt Text</label>
        <input
          type="text"
          value={localContent.alt || ''}
          onChange={(e) => handleContentChange('alt', e.target.value)}
          placeholder="Describe the image for accessibility"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Caption</label>
        <input
          type="text"
          value={localContent.caption || ''}
          onChange={(e) => handleContentChange('caption', e.target.value)}
          placeholder="Optional image caption"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderSandboxBlockProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Programming Language</label>
        <select
          value={localContent.language || 'javascript'}
          onChange={(e) => handleContentChange('language', e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="react">React JSX</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Initial Code</label>
        <textarea
          value={localContent.code || ''}
          onChange={(e) => handleContentChange('code', e.target.value)}
          placeholder="// Write your starter code here..."
          className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Instructions</label>
        <textarea
          value={localContent.instructions || ''}
          onChange={(e) => handleContentChange('instructions', e.target.value)}
          placeholder="Instructions for the coding exercise..."
          className="w-full h-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );

  const renderCallToActionProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
        <input
          type="text"
          value={localContent.title || ''}
          onChange={(e) => handleContentChange('title', e.target.value)}
          placeholder="Call to action title"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          value={localContent.description || ''}
          onChange={(e) => handleContentChange('description', e.target.value)}
          placeholder="Describe what happens when users click..."
          className="w-full h-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Button Text</label>
        <input
          type="text"
          value={localContent.buttonText || ''}
          onChange={(e) => handleContentChange('buttonText', e.target.value)}
          placeholder="Click here"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
        <select
          value={localContent.action || 'next'}
          onChange={(e) => handleContentChange('action', e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="next">Next Page</option>
          <option value="external">External Link</option>
          <option value="modal">Open Modal</option>
          <option value="submit">Submit Form</option>
        </select>
      </div>
    </div>
  );

  const renderBlockProperties = () => {
    switch (block.type) {
      case 'text':
        return renderTextBlockProperties();
      case 'heading':
        return renderHeadingBlockProperties();
      case 'quiz':
        return renderQuizBlockProperties();
      case 'image':
        return renderImageBlockProperties();
      case 'sandbox':
        return renderSandboxBlockProperties();
      case 'call_to_action':
        return renderCallToActionProperties();
      default:
        return (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🔧</div>
            <div>Properties for {block.type} coming soon</div>
          </div>
        );
    }
  };

  const getBlockIcon = () => {
    const IconComponent = getBlockIconComponent();
    return <IconComponent className="w-5 h-5" />;
  };

  const getBlockIconComponent = () => {
    const iconMap = {
      text: DocumentTextIcon,
      quiz: QuestionMarkCircleIcon,
      image: PhotoIcon,
      video: VideoCameraIcon,
      sandbox: CodeBracketIcon,
      call_to_action: AdjustmentsHorizontalIcon,
      heading: Squares2X2Icon
    };
    return iconMap[block.type] || DocumentTextIcon;
  };

  const shouldShowTabs = ['text', 'heading'].includes(block.type);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-800 to-gray-850">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            {getBlockIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{block.type} Properties</h3>
            <p className="text-sm text-gray-400">Customize this block's appearance and behavior</p>
          </div>
        </div>
        
        {/* Enhanced Tab Navigation */}
        <div className="flex space-x-1 bg-gray-700/50 rounded-xl p-1">
          {[
            { id: 'content', label: 'Content', icon: '📝' },
            { id: 'styles', label: 'Styles', icon: '🎨' },
            { id: 'config', label: 'Config', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-glass p-6 space-y-6">
          {renderBlockProperties()}
        </div>
      </div>
      
      {/* Enhanced Footer with Block Info */}
      <div className="p-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/50">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">💡 Quick Tip</p>
          <p className="text-xs text-gray-500">
            {activeTab === 'content' && 'Edit the text and content of your block'}
            {activeTab === 'styles' && 'Customize colors, spacing, and typography'}
            {activeTab === 'config' && 'Configure advanced block settings'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Enhanced Color Picker Component
const ColorPicker = ({ value = '#ffffff', onChange, label = 'Color' }) => {
  const [showPicker, setShowPicker] = useState(false);
  
  const colorPresets = [
    '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd',
    '#6c757d', '#495057', '#343a40', '#212529', '#000000',
    '#007bff', '#6f42c1', '#e83e8c', '#dc3545', '#fd7e14',
    '#ffc107', '#28a745', '#20c997', '#17a2b8', '#6610f2'
  ];

  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="w-8 h-8 rounded border border-gray-600 bg-gray-700 relative overflow-hidden"
            style={{ backgroundColor: value }}
          >
            <div className="absolute inset-0 bg-checkerboard opacity-20"></div>
          </button>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#ffffff"
            className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {showPicker && (
          <div className="absolute top-full mt-2 left-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 p-3">
            <div className="grid grid-cols-6 gap-1 mb-3">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color);
                    setShowPicker(false);
                  }}
                  className="w-6 h-6 rounded border border-gray-500 hover:scale-105"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8 border border-gray-600 rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Webflow-style Spacing Diagram
const SpacingDiagram = ({ type, values, onChange, label }) => {
  const [hoveredSide, setHoveredSide] = useState(null);
  
  const isMargin = type === 'margin';
  const color = isMargin ? 'orange' : 'blue';
  const bgColor = isMargin ? 'bg-orange-500' : 'bg-blue-500';
  const textColor = isMargin ? 'text-orange-200' : 'text-blue-200';
  
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-2">{label}</label>
      <div className="bg-gray-700 p-4 rounded-lg">
        {/* Visual Diagram */}
        <div className="relative bg-gray-600 p-3 rounded">
          {/* Top */}
          <div 
            className={`absolute -top-0 left-1/2 transform -translate-x-1/2 -translate-y-full`}
            onMouseEnter={() => setHoveredSide('top')}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <input
              type="number"
              value={values.top || 0}
              onChange={(e) => onChange('top', e.target.value)}
              className={`w-12 h-6 text-xs text-center bg-gray-800 border rounded text-white focus:outline-none ${
                hoveredSide === 'top' ? `border-${color}-500` : 'border-gray-600'
              }`}
            />
          </div>
          
          {/* Bottom */}
          <div 
            className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
            onMouseEnter={() => setHoveredSide('bottom')}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <input
              type="number"
              value={values.bottom || 0}
              onChange={(e) => onChange('bottom', e.target.value)}
              className={`w-12 h-6 text-xs text-center bg-gray-800 border rounded text-white focus:outline-none ${
                hoveredSide === 'bottom' ? `border-${color}-500` : 'border-gray-600'
              }`}
            />
          </div>
          
          {/* Left */}
          <div 
            className="absolute -left-0 top-1/2 transform -translate-x-full -translate-y-1/2"
            onMouseEnter={() => setHoveredSide('left')}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <input
              type="number"
              value={values.left || 0}
              onChange={(e) => onChange('left', e.target.value)}
              className={`w-12 h-6 text-xs text-center bg-gray-800 border rounded text-white focus:outline-none ${
                hoveredSide === 'left' ? `border-${color}-500` : 'border-gray-600'
              }`}
            />
          </div>
          
          {/* Right */}
          <div 
            className="absolute -right-0 top-1/2 transform translate-x-full -translate-y-1/2"
            onMouseEnter={() => setHoveredSide('right')}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <input
              type="number"
              value={values.right || 0}
              onChange={(e) => onChange('right', e.target.value)}
              className={`w-12 h-6 text-xs text-center bg-gray-800 border rounded text-white focus:outline-none ${
                hoveredSide === 'right' ? `border-${color}-500` : 'border-gray-600'
              }`}
            />
          </div>
          
          {/* Center Content Box */}
          <div className={`h-12 w-20 mx-auto ${bgColor}/20 border border-dashed border-${color}-400 rounded flex items-center justify-center`}>
            <span className={`text-xs ${textColor} font-medium`}>
              {isMargin ? 'M' : 'P'}
            </span>
          </div>
        </div>
        
        {/* Quick Presets */}
        <div className="mt-3 flex space-x-1">
          <button
            onClick={() => {
              onChange('top', 0);
              onChange('bottom', 0);
              onChange('left', 0);
              onChange('right', 0);
            }}
            className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-gray-300 rounded"
          >
            Reset
          </button>
          <button
            onClick={() => {
              const value = isMargin ? 16 : 8;
              onChange('top', value);
              onChange('bottom', value);
              onChange('left', value);
              onChange('right', value);
            }}
            className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-gray-300 rounded"
          >
            Auto
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel; 