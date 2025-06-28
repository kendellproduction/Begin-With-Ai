import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoggedInNavbar from '../components/LoggedInNavbar';
import PodcastPlayer from '../components/PodcastPlayer';
import ContentBlockRenderer from '../components/ContentBlocks/ContentBlockRenderer';
import { BLOCK_TYPES } from '../components/ContentBlocks';

const ContentBlockDemo = () => {
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [completedBlocks, setCompletedBlocks] = useState([]);

  // Demo lesson content using the new modular block system
  const lessonBlocks = [
    {
      type: BLOCK_TYPES.TEXT,
      content: {
        text: `# Welcome to the New Content Block System 🎉

This demonstration showcases **Phase 2** of our lesson system update: the **Modular Content Block System**.

Instead of static slides, lessons now use dynamic, interactive content blocks that can be:
- Lazy loaded for performance
- Synchronized with audio content
- Customized with rich configurations
- Combined in any order to create engaging lessons

**Key Features:**
- 🔒 **Security**: All content is sanitized with DOMPurify
- 📱 **Mobile-first**: Touch-optimized and responsive
- ⚡ **Performance**: Lazy loading and error boundaries
- 🎨 **Customizable**: Extensive configuration options`
      },
      config: {
        readingTime: true,
        typography: 'prose'
      }
    },
    {
      type: BLOCK_TYPES.SECTION_BREAK,
      content: { label: 'Interactive Content Blocks' },
      config: { 
        style: 'gradient',
        animation: 'slide',
        spacing: 'medium'
      }
    },
    {
      type: BLOCK_TYPES.PODCAST_SYNC,
      content: {
        text: `This block is **synchronized with the podcast audio**. When the audio reaches the specific timestamp, this content will be highlighted automatically.

Try clicking on this block to jump to the corresponding audio section!`
      },
      config: {
        startTime: 30,
        endTime: 60,
        audioSync: true,
        autoScroll: true
      }
    },
    {
      type: BLOCK_TYPES.FILL_BLANK,
      content: {
        text: "The new content block system replaces {{slides|hint: what did we use before?}} with modular {{blocks|hint: what are we using now?}} for better {{performance|hint: what does lazy loading improve?}}.",
        instructions: "Fill in the blanks to test your understanding of the new system!"
      },
      config: {
        instantFeedback: true,
        showHints: true
      }
    },
    {
      type: BLOCK_TYPES.IMAGE,
      content: {
        src: "https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Content+Block+Architecture",
        alt: "Content Block Architecture Diagram",
        caption: "The modular architecture allows for flexible lesson composition"
      },
      config: {
        lazy: true,
        webp: true,
        responsive: true
      }
    },
    {
      type: BLOCK_TYPES.QUIZ,
      content: {
        question: "What is the main advantage of the new content block system?",
        options: [
          "It looks prettier",
          "Modular, performant, and customizable lessons",
          "It uses more JavaScript",
          "It's more complicated"
        ],
        correctAnswer: 1,
        correctFeedback: "Exactly! The modular system provides flexibility, performance, and rich customization options.",
        incorrectFeedback: "Not quite. The main advantage is the modular, performant, and customizable approach to lesson creation."
      },
      config: {
        instantFeedback: false,
        allowRetry: true
      }
    },
    {
      type: BLOCK_TYPES.SANDBOX,
      content: {
        title: "Try the Interactive Sandbox",
        instructions: "Test the sandbox component by running some JavaScript code:",
        code: `// Welcome to the secure sandbox!
console.log("Hello from the Content Block System!");

// Try creating a simple function
function generateBlocks(count) {
  const blockTypes = ['text', 'image', 'quiz', 'sandbox'];
  return Array.from({length: count}, (_, i) => ({
    id: i,
    type: blockTypes[i % blockTypes.length],
    content: \`Block \${i + 1} content\`
  }));
}

const demoBlocks = generateBlocks(5);
console.log("Generated blocks:", demoBlocks);

// Return a message
"Successfully demonstrated the sandbox block! 🎉"`
      },
      config: {
        language: 'javascript',
        expandable: true
      }
    },
    {
      type: BLOCK_TYPES.VIDEO,
      content: {
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "Sample Educational Video",
        description: "This video block supports both embedded videos (YouTube, Vimeo) and native HTML5 video with full controls and progress tracking."
      },
      config: {
        lazy: true,
        trackProgress: true
      }
    },
    {
      type: BLOCK_TYPES.PROGRESS_CHECKPOINT,
      content: {
        title: "Checkpoint: Content Blocks Mastered!",
        description: "You've successfully explored the key components of our new content block system.",
        progress: 75,
        id: "demo-checkpoint"
      },
      config: {
        milestone: true,
        autoSave: true,
        showProgress: true
      }
    },
    {
      type: BLOCK_TYPES.CALL_TO_ACTION,
      content: {
        title: "Ready to Build Amazing Lessons?",
        description: "The modular content block system is now ready for production use. Create engaging, interactive lessons with powerful components.",
        buttonText: "Explore Lesson Builder",
        action: "navigate",
        path: "/admin",
        hint: "Access the admin panel to start building lessons with these new components"
      },
      config: {
        style: 'gradient',
        size: 'large',
        animation: 'glow'
      }
    }
  ];

  // Demo podcast data
  const podcastData = {
    audioUrl: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav",
    title: "Content Block System Overview",
    instructor: "BeginningWithAI Development Team",
    chapters: [
      { title: "Introduction to Content Blocks", startTime: 0, endTime: 30 },
      { title: "Synchronized Audio Content", startTime: 30, endTime: 90 },
      { title: "Interactive Components", startTime: 90, endTime: 150 },
      { title: "Performance Features", startTime: 150, endTime: 210 },
      { title: "Future Enhancements", startTime: 210, endTime: 270 }
    ]
  };

  const handleBlockComplete = (blockIndex, completionData) => {
    console.log(`Block ${blockIndex} completed:`, completionData);
    setCompletedBlocks(prev => [...prev, blockIndex]);
  };

  const handleProgressUpdate = (progressData) => {
    console.log('Lesson progress:', progressData);
  };

  const handleAudioTimeUpdate = (currentTime, duration) => {
    setCurrentAudioTime(currentTime);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black text-white">
      <LoggedInNavbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6"
            >
              Phase 2: Content Blocks
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Experience the new modular content block system that powers our next-generation lessons. 
              Interactive, performant, and fully customizable.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
          >
            <div className="text-center p-4 bg-gray-800/30 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold text-blue-400 mb-1">{lessonBlocks.length}</div>
              <div className="text-sm text-gray-400">Block Types</div>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold text-green-400 mb-1">{completedBlocks.length}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold text-purple-400 mb-1">∞</div>
              <div className="text-sm text-gray-400">Possibilities</div>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold text-pink-400 mb-1">V2</div>
              <div className="text-sm text-gray-400">Phase</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Blocks Demo */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ContentBlockRenderer
          blocks={lessonBlocks}
          audioCurrentTime={currentAudioTime}
          onBlockComplete={handleBlockComplete}
          onProgressUpdate={handleProgressUpdate}
          config={{
            lazyLoading: true,
            animations: true,
            trackProgress: true
          }}
        />
      </div>

      {/* Sticky Podcast Player */}
      <PodcastPlayer
        audioUrl={podcastData.audioUrl}
        title={podcastData.title}
        instructor={podcastData.instructor}
        chapters={podcastData.chapters}
        onTimeUpdate={handleAudioTimeUpdate}
        isSticky={true}
      />
    </div>
  );
};

export default ContentBlockDemo; 