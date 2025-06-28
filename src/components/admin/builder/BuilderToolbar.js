import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  PlayIcon 
} from '@heroicons/react/24/outline';

const BuilderToolbar = ({
  onSave,
  onSaveDraft,
  onBack,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onPreviewToggle,
  previewMode,
  onTemplateManager,
  zoom,
  onZoomChange,
  onThemeChange,
  currentTheme = 'dark',
  lastSaved
}) => {
  const zoomLevels = [50, 75, 100, 125, 150, 200];
  
  const themeOptions = [
    { id: 'dark', name: 'Dark', icon: '🌙' },
    { id: 'blue', name: 'Ocean', icon: '🌊' },
    { id: 'green', name: 'Forest', icon: '🌲' },
    { id: 'purple', name: 'Cosmic', icon: '🌌' },
    { id: 'orange', name: 'Sunset', icon: '🌅' },
    { id: 'coding', name: 'Terminal', icon: '💻' },
    { id: 'light', name: 'Light', icon: '☀️' }
  ];

  const handleZoomIn = () => {
    const currentIndex = zoomLevels.indexOf(zoom);
    if (currentIndex < zoomLevels.length - 1) {
      onZoomChange(zoomLevels[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.indexOf(zoom);
    if (currentIndex > 0) {
      onZoomChange(zoomLevels[currentIndex - 1]);
    }
  };

  return (
    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      {/* Left Section - Back Button & Project Info */}
      <div className="flex items-center space-x-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <div>
            <h1 className="text-white font-semibold">Enterprise Builder</h1>
            <p className="text-xs text-gray-400">Phase 3 • Lesson Designer</p>
          </div>
        </div>
      </div>

      {/* Center Section - Main Actions */}
      <div className="flex items-center space-x-2">
        {/* Undo/Redo */}
        <div className="flex items-center bg-gray-700 rounded-lg p-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded transition-colors ${
              canUndo 
                ? 'text-white hover:bg-gray-600' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <ArrowUturnLeftIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded transition-colors ${
              canRedo 
                ? 'text-white hover:bg-gray-600' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <ArrowUturnRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center bg-gray-700 rounded-lg p-1">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= zoomLevels[0]}
            className={`p-2 rounded transition-colors ${
              zoom > zoomLevels[0]
                ? 'text-white hover:bg-gray-600' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
            title="Zoom Out"
          >
            <MagnifyingGlassMinusIcon className="w-4 h-4" />
          </button>
          
          <select
            value={zoom}
            onChange={(e) => onZoomChange(parseInt(e.target.value))}
            className="bg-transparent text-white text-sm px-2 py-1 focus:outline-none"
          >
            {zoomLevels.map(level => (
              <option key={level} value={level} className="bg-gray-700">
                {level}%
              </option>
            ))}
          </select>
          
          <button
            onClick={handleZoomIn}
            disabled={zoom >= zoomLevels[zoomLevels.length - 1]}
            className={`p-2 rounded transition-colors ${
              zoom < zoomLevels[zoomLevels.length - 1]
                ? 'text-white hover:bg-gray-600' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
            title="Zoom In"
          >
            <MagnifyingGlassPlusIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Toggle */}
        <motion.button
          onClick={onPreviewToggle}
          className={`
            flex items-center px-4 py-2 rounded-lg font-medium transition-all
            ${previewMode 
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/25' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {previewMode ? (
            <>
              <EyeSlashIcon className="w-4 h-4 mr-2" />
              Exit Preview
            </>
          ) : (
            <>
              <EyeIcon className="w-4 h-4 mr-2" />
              Preview
            </>
          )}
        </motion.button>
      </div>

      {/* Right Section - Save & Templates */}
      <div className="flex items-center space-x-2">
        {/* Last Saved Indicator */}
        {lastSaved && (
          <div className="text-xs text-gray-400 px-2">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}

        {/* Theme Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Theme:</span>
          <select
            value={currentTheme}
            onChange={(e) => onThemeChange?.(e.target.value)}
            className="bg-gray-700 text-white rounded-md px-3 py-1 text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {themeOptions.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.icon} {theme.name}
              </option>
            ))}
          </select>
        </div>

        {/* Templates */}
        <button
          onClick={onTemplateManager}
          className="flex items-center px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
          title="Template Manager"
        >
          <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
          Templates
        </button>

        {/* Save Draft Button */}
        <motion.button
          onClick={onSaveDraft}
          className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title="Save as Draft"
        >
          <DocumentIcon className="w-4 h-4 mr-2" />
          Draft
        </motion.button>

        {/* Save Button */}
        <motion.button
          onClick={onSave}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
          Save Lesson
        </motion.button>

        {/* Status Indicator */}
        <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
          <span className="text-xs text-gray-400 mr-2">Ready</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default BuilderToolbar; 