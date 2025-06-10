import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiYoutube, 
  FiUpload, 
  FiFileText, 
  FiEdit3,
  FiCheck, 
  FiX, 
  FiLoader,
  FiAlertCircle,
  FiEye,
  FiGlobe,
  FiSave,
  FiPlay
} from 'react-icons/fi';
import { AIContentProcessor } from '../../services/aiContentProcessor';
import { useNavigate } from 'react-router-dom';

const ContentProcessor = ({ onProcess, onSave }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('youtube');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedContent, setProcessedContent] = useState(null);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  
  // YouTube form state
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeOptions, setYoutubeOptions] = useState({
    targetAudience: 'intermediate',
    contentType: 'auto', // auto, lesson, module
    includeQuizzes: true,
    includeExercises: true,
    maxLessonsPerModule: 6,
    transcriptSource: 'auto' // auto, manual, captions
  });

  // Text input state
  const [textContent, setTextContent] = useState('');
  const [textOptions, setTextOptions] = useState({
    contentType: 'detailed', // 'detailed' or 'outline'
    targetAudience: 'intermediate',
    enhancementLevel: 'moderate', // 'minimal', 'moderate', 'extensive'
    enableResearch: false // New option for web research
  });

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileOptions, setFileOptions] = useState({
    preserveStructure: true,
    targetAudience: 'intermediate',
    enhancementLevel: 'moderate'
  });

  // Add new function to take a lesson
  const handleTakeLesson = (lesson) => {
    // Navigate to the lesson viewer with the lesson data
    navigate(`/lesson-viewer/${lesson.id}`, {
      state: {
        lesson: lesson,
        fromAdmin: true
      }
    });
  };

  // Add new function to analyze content complexity
  const analyzeContentComplexity = (content) => {
    const wordCount = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = wordCount / sentences.length;
    
    // Count technical terms and concepts
    const technicalTerms = [
      'algorithm', 'machine learning', 'neural network', 'artificial intelligence',
      'data science', 'api', 'framework', 'library', 'programming', 'coding',
      'development', 'software', 'technology', 'computer', 'digital'
    ];
    
    const technicalTermCount = technicalTerms.reduce((count, term) => {
      const regex = new RegExp(term, 'gi');
      return count + (content.match(regex) || []).length;
    }, 0);
    
    // Determine complexity score
    let complexityScore = 0;
    if (wordCount > 5000) complexityScore += 3; // Long content
    else if (wordCount > 2000) complexityScore += 2;
    else if (wordCount > 1000) complexityScore += 1;
    
    if (avgWordsPerSentence > 20) complexityScore += 2; // Complex sentences
    else if (avgWordsPerSentence > 15) complexityScore += 1;
    
    if (technicalTermCount > 50) complexityScore += 3; // Highly technical
    else if (technicalTermCount > 20) complexityScore += 2;
    else if (technicalTermCount > 10) complexityScore += 1;
    
    return {
      wordCount,
      sentenceCount: sentences.length,
      avgWordsPerSentence: Math.round(avgWordsPerSentence),
      technicalTermCount,
      complexityScore,
      shouldBeModule: complexityScore >= 4, // Complex content becomes module
      estimatedReadingTime: Math.ceil(wordCount / 200), // 200 words per minute
      suggestedLessonCount: Math.max(1, Math.ceil(complexityScore / 2))
    };
  };

  // Enhanced processing options
  const [processingOptions, setProcessingOptions] = useState({
    contentType: 'auto', // auto, lesson, module
    targetAudience: 'intermediate',
    includeTranscript: false,
    generateQuizzes: true,
    generatePractical: true,
    maxLessonsPerModule: 6
  });

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => 
      file.type === 'application/pdf' || 
      file.type === 'text/plain' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    
    if (validFile) {
      setUploadedFile(validFile);
      setError(null);
    } else {
      setError('Please upload a PDF, TXT, or Word document');
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setError(null);
    }
  };

  const processYouTubeContent = async () => {
    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Call your existing YouTube processing service
      const result = await onProcess('youtube', {
        url: youtubeUrl,
        options: youtubeOptions
      });
      
      setProcessedContent({
        type: 'youtube',
        source: youtubeUrl,
        ...result
      });
    } catch (err) {
      console.error('YouTube processing error:', err);
      
      // Provide specific error messages based on the error type
      let errorMessage = 'Failed to process YouTube video';
      
      if (err.message.includes('transcript')) {
        errorMessage = `❌ No Transcript Available

This video doesn't have a usable transcript or captions. To create lessons from YouTube videos, we need:

📝 Manual transcripts (preferred)
🎯 Auto-generated captions 
📖 Detailed video descriptions (as fallback)

Please try:
• A video with manual transcripts
• A video with auto-captions enabled
• A video with a comprehensive description
• Check if the video is publicly accessible

We don't create lessons from made-up content - we need real transcript data to ensure quality and accuracy.`;
      } else if (err.message.includes('captions')) {
        errorMessage = `❌ No Captions Available

This video doesn't have any usable captions or transcript data available.

Please choose a video that has:
• Manual transcripts
• Auto-generated captions
• Detailed descriptions

We require actual content from the video to create meaningful lessons.`;
      } else if (err.message.includes('invalid') || err.message.includes('URL')) {
        errorMessage = `❌ Invalid YouTube URL

Please check that your URL is valid and points to a public YouTube video.

Supported formats:
• https://www.youtube.com/watch?v=VIDEO_ID
• https://youtu.be/VIDEO_ID
• https://youtube.com/embed/VIDEO_ID`;
      } else if (err.message.includes('private') || err.message.includes('unavailable')) {
        errorMessage = `❌ Video Not Accessible

This video appears to be private, unlisted, or unavailable. Please use a public YouTube video that can be accessed without restrictions.`;
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const processTextContent = async () => {
    if (!textContent.trim()) {
      setError('Please enter some content');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Enhanced AI processing for text content
      const result = await processWithAI(textContent, 'text', textOptions);
      
      setProcessedContent({
        type: 'text',
        source: 'Manual Input',
        ...result
      });
    } catch (err) {
      setError('Failed to process text content: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const processFileContent = async () => {
    if (!uploadedFile) {
      setError('Please upload a file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Extract text from file and process with AI
      const fileText = await extractTextFromFile(uploadedFile);
      const result = await processWithAI(fileText, 'file', fileOptions);
      
      setProcessedContent({
        type: 'file',
        source: uploadedFile.name,
        ...result
      });
    } catch (err) {
      setError('Failed to process file: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const processWithAI = async (content, type, options) => {
    try {
      if (type === 'text') {
        return await AIContentProcessor.processTextContent(content, options);
      } else if (type === 'file') {
        // Content is already extracted text from file
        return await AIContentProcessor.processTextContent(content, options);
      }
      
      // Fallback
      return {
        lessons: [
          {
            title: "Generated Lesson",
            description: "AI-generated lesson from content",
            content: [
              {
                type: 'text',
                content: 'This is processed content...'
              }
            ]
          }
        ]
      };
    } catch (error) {
      console.error('Error in AI processing:', error);
      throw error;
    }
  };

  const generateLessonPrompt = (content, type, options) => {
    const basePrompt = `Create comprehensive, engaging lessons from the following content. `;
    
    let specificInstructions = '';
    
    if (options.enhancementLevel === 'minimal') {
      specificInstructions = `The content is already detailed. Preserve the existing structure and information while formatting it into clear lesson modules. Maintain all technical details and instructions.`;
    } else if (options.enhancementLevel === 'moderate') {
      specificInstructions = `Enhance the content by adding clearer explanations, examples, and better flow while preserving all important details. Add practical exercises where appropriate.`;
    } else {
      specificInstructions = `Significantly expand and enhance the content. Add comprehensive explanations, multiple examples, step-by-step instructions, exercises, and assessments. Create a complete learning experience.`;
    }

    return `${basePrompt}${specificInstructions}

Target Audience: ${options.targetAudience}
${type === 'file' && options.preserveStructure ? 'Preserve the original document structure where possible.' : ''}

Content to process:
${content}

Return a structured JSON with lessons, each containing title, description, learning objectives, content sections, and assessment questions.`;
  };

  const extractTextFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (file.type === 'text/plain') {
          resolve(e.target.result);
        } else {
          // For PDF/Word files, you'd need a proper extraction library
          // For now, mock the extraction
          resolve("Extracted text from " + file.name);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handlePublishLesson = async (lesson, isLive = false) => {
    try {
      await onSave({
        ...lesson,
        isPublished: isLive,
        publishedAt: isLive ? new Date().toISOString() : null,
        status: isLive ? 'live' : 'draft'
      });
    } catch (err) {
      setError('Failed to save lesson: ' + err.message);
    }
  };

  const handlePreviewLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson({ ...lesson });
  };

  const handleUpdateLesson = (updatedLesson) => {
    if (processedContent) {
      const updatedLessons = processedContent.lessons.map(lesson => 
        lesson.id === updatedLesson.id ? updatedLesson : lesson
      );
      setProcessedContent({
        ...processedContent,
        lessons: updatedLessons
      });
    }
    setEditingLesson(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'youtube':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Audience
                </label>
                <select
                  value={youtubeOptions.targetAudience}
                  onChange={(e) => setYoutubeOptions(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content Structure
                </label>
                <select
                  value={youtubeOptions.contentType}
                  onChange={(e) => setYoutubeOptions(prev => ({ ...prev, contentType: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="auto">Auto-detect (Recommended)</option>
                  <option value="lesson">Single Lesson</option>
                  <option value="module">Multi-lesson Module</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Transcript Source
                </label>
                <select
                  value={youtubeOptions.transcriptSource}
                  onChange={(e) => setYoutubeOptions(prev => ({ ...prev, transcriptSource: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="auto">Auto (Manual → Captions → Generated)</option>
                  <option value="manual">Manual Transcript Only</option>
                  <option value="captions">Auto-captions Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Lessons per Module
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={youtubeOptions.maxLessonsPerModule}
                  onChange={(e) => setYoutubeOptions(prev => ({ ...prev, maxLessonsPerModule: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={youtubeOptions.includeQuizzes}
                  onChange={(e) => setYoutubeOptions(prev => ({ ...prev, includeQuizzes: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-gray-300">Include Quizzes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={youtubeOptions.includeExercises}
                  onChange={(e) => setYoutubeOptions(prev => ({ ...prev, includeExercises: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-gray-300">Include Exercises</span>
              </label>
            </div>

            <button
              onClick={processYouTubeContent}
              disabled={isProcessing || !youtubeUrl.trim()}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Processing Video...
                </>
              ) : (
                <>
                  <FiYoutube className="mr-2" />
                  Process YouTube Video
                </>
              )}
            </button>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content Input
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste your lesson content, outline, or ideas here..."
                rows={10}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content Type
                </label>
                <select
                  value={textOptions.contentType}
                  onChange={(e) => setTextOptions(prev => ({ ...prev, contentType: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="detailed">Already Detailed</option>
                  <option value="outline">Basic Outline</option>
                  <option value="idea">Just an Idea</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enhancement Level
                </label>
                <select
                  value={textOptions.enhancementLevel}
                  onChange={(e) => setTextOptions(prev => ({ ...prev, enhancementLevel: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="minimal">Minimal (Keep as-is)</option>
                  <option value="moderate">Moderate Enhancement</option>
                  <option value="extensive">Extensive Enhancement</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={textOptions.enableResearch}
                    onChange={(e) => setTextOptions(prev => ({ ...prev, enableResearch: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Enable Web Research</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  {process.env.REACT_APP_GOOGLE_SEARCH_API_KEY || process.env.REACT_APP_BING_SEARCH_API_KEY 
                    ? 'Automatically research current events and incomplete topics'
                    : 'Search APIs not configured - will use AI enhancement only'
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Audience
                </label>
                <select
                  value={textOptions.targetAudience}
                  onChange={(e) => setTextOptions(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* API Status Indicator */}
            <div className="bg-gray-700 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-300 mb-2">API Status</h4>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    (process.env.REACT_APP_OPENAI_API_KEY || process.env.OPENAI_API_KEY) ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <span className="text-gray-400">
                    OpenAI API: {(process.env.REACT_APP_OPENAI_API_KEY || process.env.OPENAI_API_KEY) ? 'Connected' : 'Not configured'}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    (process.env.REACT_APP_GOOGLE_SEARCH_API_KEY || process.env.REACT_APP_BING_SEARCH_API_KEY) ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="text-gray-400">
                    Search API: {(process.env.REACT_APP_GOOGLE_SEARCH_API_KEY || process.env.REACT_APP_BING_SEARCH_API_KEY) ? 'Connected' : 'Optional'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={processTextContent}
              disabled={isProcessing || !textContent.trim()}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Processing Content...
                </>
              ) : (
                <>
                  <FiEdit3 className="mr-2" />
                  Process Text Content
                </>
              )}
            </button>
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-300 mb-2">
                Drag and drop your file here, or{' '}
                <label className="text-green-400 hover:text-green-300 cursor-pointer underline">
                  browse
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, TXT, DOC, DOCX files
              </p>
              
              {uploadedFile && (
                <div className="mt-4 flex items-center justify-center">
                  <FiFileText className="mr-2 text-green-400" />
                  <span className="text-green-400">{uploadedFile.name}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={fileOptions.preserveStructure}
                    onChange={(e) => setFileOptions(prev => ({ ...prev, preserveStructure: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Preserve Document Structure</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enhancement Level
                </label>
                <select
                  value={fileOptions.enhancementLevel}
                  onChange={(e) => setFileOptions(prev => ({ ...prev, enhancementLevel: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="minimal">Minimal (Keep as-is)</option>
                  <option value="moderate">Moderate Enhancement</option>
                  <option value="extensive">Extensive Enhancement</option>
                </select>
              </div>
            </div>

            <button
              onClick={processFileContent}
              disabled={isProcessing || !uploadedFile}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Processing File...
                </>
              ) : (
                <>
                  <FiFileText className="mr-2" />
                  Process Uploaded File
                </>
              )}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Content Source Tabs */}
      <div className="flex space-x-4 border-b border-gray-700">
        {[
          { id: 'youtube', label: 'YouTube', icon: FiYoutube, color: 'text-red-400' },
          { id: 'text', label: 'Text Input', icon: FiEdit3, color: 'text-blue-400' },
          { id: 'upload', label: 'File Upload', icon: FiUpload, color: 'text-green-400' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 border-b-2 font-medium transition-colors ${
              activeTab === tab.id
                ? `border-current ${tab.color}`
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <tab.icon className="mr-2 h-5 w-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start p-4 bg-red-600/20 border border-red-600 rounded-lg"
        >
          <FiAlertCircle className="mr-3 mt-0.5 text-red-400 flex-shrink-0" />
          <div className="text-red-300">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{error}</pre>
          </div>
        </motion.div>
      )}

      {/* Active Tab Content */}
      <div className="bg-gray-800 rounded-lg p-6">
        {renderTabContent()}
      </div>

      {/* Processed Content Preview */}
      <AnimatePresence>
        {processedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Generated Lessons</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">
                  Source: {processedContent.source}
                </span>
                <button
                  onClick={() => setProcessedContent(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content Analysis Display */}
            {processedContent.contentAnalysis && (
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h4 className="text-md font-medium text-white mb-3">📊 Content Analysis</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Word Count:</span>
                    <div className="text-white font-medium">{processedContent.contentAnalysis.wordCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Reading Time:</span>
                    <div className="text-white font-medium">{processedContent.contentAnalysis.estimatedReadingTime} min</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Topics:</span>
                    <div className="text-white font-medium">{processedContent.contentAnalysis.topicCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Technical Density:</span>
                    <div className="text-white font-medium">{processedContent.contentAnalysis.technicalDensity?.toFixed(1)}/1000</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Recommended Structure:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      processedContent.contentAnalysis.shouldBeModule 
                        ? 'bg-purple-600 text-purple-100' 
                        : 'bg-blue-600 text-blue-100'
                    }`}>
                      {processedContent.contentAnalysis.contentType === 'module' ? 
                        `Module (${processedContent.contentAnalysis.suggestedLessonCount} lessons)` : 
                        'Single Lesson'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-400">Complexity:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      processedContent.contentAnalysis.complexity === 'advanced' ? 'bg-red-600 text-red-100' :
                      processedContent.contentAnalysis.complexity === 'intermediate' ? 'bg-yellow-600 text-yellow-100' :
                      'bg-green-600 text-green-100'
                    }`}>
                      {processedContent.contentAnalysis.complexity}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {processedContent.lessons?.map((lesson, index) => (
                <div key={index} className="border border-gray-700 rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{lesson.title}</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleTakeLesson(lesson)}
                          className="flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                        >
                          <FiPlay className="mr-1 h-3 w-3" />
                          Take Lesson
                        </button>
                        <button
                          onClick={() => handlePreviewLesson(lesson)}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          <FiEye className="mr-1 h-3 w-3" />
                          Preview
                        </button>
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className="flex items-center px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                        >
                          <FiEdit3 className="mr-1 h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handlePublishLesson(lesson, false)}
                          className="flex items-center px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                        >
                          <FiSave className="mr-1 h-3 w-3" />
                          Save Draft
                        </button>
                        <button
                          onClick={() => handlePublishLesson(lesson, true)}
                          className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          <FiGlobe className="mr-1 h-3 w-3" />
                          Publish Live
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{lesson.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{lesson.content?.length || 0} content sections</span>
                      <span>Duration: {lesson.estimatedDuration || '15 minutes'}</span>
                      <span>Level: {lesson.difficulty || 'intermediate'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Preview Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{selectedLesson.title}</h3>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-300 mb-4">{selectedLesson.description}</p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400">Duration</div>
                      <div className="text-white font-medium">{selectedLesson.estimatedDuration || '15 minutes'}</div>
                    </div>
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400">Difficulty</div>
                      <div className="text-white font-medium capitalize">{selectedLesson.difficulty || 'intermediate'}</div>
                    </div>
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400">Sections</div>
                      <div className="text-white font-medium">{selectedLesson.content?.length || 0}</div>
                    </div>
                  </div>
                </div>

                {selectedLesson.learningObjectives && (
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Learning Objectives</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      {selectedLesson.learningObjectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Lesson Content</h4>
                  <div className="space-y-4">
                    {selectedLesson.content?.map((section, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded uppercase">
                            {section.type}
                          </span>
                          <h5 className="text-white font-medium ml-3">{section.title}</h5>
                        </div>
                        <p className="text-gray-300 mb-2">{section.content}</p>
                        
                        {section.keyPoints && (
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Key Points:</div>
                            <ul className="list-disc list-inside text-sm text-gray-300">
                              {section.keyPoints.map((point, pointIndex) => (
                                <li key={pointIndex}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {section.tasks && (
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Tasks:</div>
                            <ul className="list-decimal list-inside text-sm text-gray-300">
                              {section.tasks.map((task, taskIndex) => (
                                <li key={taskIndex}>{task}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {section.questions && (
                          <div>
                            <div className="text-sm text-gray-400 mb-2">Assessment Questions:</div>
                            <div className="space-y-2">
                              {section.questions.map((question, qIndex) => (
                                <div key={qIndex} className="bg-gray-600 p-3 rounded">
                                  <div className="text-white font-medium mb-2">{question.question}</div>
                                  <div className="space-y-1">
                                    {question.options?.map((option, oIndex) => (
                                      <div 
                                        key={oIndex} 
                                        className={`text-sm p-2 rounded ${
                                          option === question.correct 
                                            ? 'bg-green-600 text-white' 
                                            : 'bg-gray-500 text-gray-200'
                                        }`}
                                      >
                                        {option}
                                      </div>
                                    ))}
                                  </div>
                                  {question.explanation && (
                                    <div className="mt-2 text-sm text-gray-300">
                                      <strong>Explanation:</strong> {question.explanation}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEditLesson(selectedLesson);
                    setSelectedLesson(null);
                  }}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <FiEdit3 className="mr-2 h-4 w-4" />
                  Edit Lesson
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Edit Modal */}
      <AnimatePresence>
        {editingLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Edit Lesson</h3>
                <button
                  onClick={() => setEditingLesson(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      value={editingLesson.title}
                      onChange={(e) => setEditingLesson(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      value={editingLesson.estimatedDuration || ''}
                      onChange={(e) => setEditingLesson(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                      placeholder="e.g., 15-20 minutes"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingLesson.description}
                    onChange={(e) => setEditingLesson(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-vertical"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={editingLesson.difficulty || 'intermediate'}
                      onChange={(e) => setEditingLesson(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingLesson.category || ''}
                      onChange={(e) => setEditingLesson(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., AI Tools, Programming"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {editingLesson.learningObjectives && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Learning Objectives (one per line)
                    </label>
                    <textarea
                      value={editingLesson.learningObjectives.join('\n')}
                      onChange={(e) => setEditingLesson(prev => ({ 
                        ...prev, 
                        learningObjectives: e.target.value.split('\n').filter(obj => obj.trim())
                      }))}
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-vertical"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingLesson(null)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateLesson(editingLesson)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  Update Lesson
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentProcessor; 