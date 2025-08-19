const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { YoutubeTranscript } = require('youtube-transcript');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Firebase Function to extract YouTube video transcripts
 * This function handles CORS and provides a secure backend for transcript extraction
 */
exports.extractYouTubeTranscript = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      // Only allow POST requests
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      const { videoId, youtubeUrl } = req.body;

      if (!videoId && !youtubeUrl) {
        res.status(400).json({ error: 'Video ID or YouTube URL is required' });
        return;
      }

      let extractedVideoId = videoId;
      
      // Extract video ID from URL if provided
      if (youtubeUrl && !videoId) {
        const urlPatterns = [
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
          /youtube\.com\/v\/([^&\n?#]+)/,
          /youtube\.com\/watch\?.*v=([^&\n?#]+)/
        ];
        
        for (const pattern of urlPatterns) {
          const match = youtubeUrl.match(pattern);
          if (match && match[1]) {
            extractedVideoId = match[1];
            break;
          }
        }
        
        if (!extractedVideoId) {
          res.status(400).json({ error: 'Invalid YouTube URL format' });
          return;
        }
      }

      // Extract transcript using youtube-transcript library
      const transcript = await YoutubeTranscript.fetchTranscript(extractedVideoId);
      
      // Combine transcript segments into a single text
      const fullTranscript = transcript
        .map(segment => segment.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!fullTranscript) {
        res.status(404).json({ 
          error: 'No transcript found for this video. The video may not have captions available.' 
        });
        return;
      }

      res.status(200).json({
        success: true,
        videoId: extractedVideoId,
        transcript: fullTranscript,
        segments: transcript.length,
        length: fullTranscript.length
      });

    } catch (error) {
      console.error('Error extracting YouTube transcript:', error);
      
      // Handle specific error types
      if (error.message.includes('Transcript is disabled')) {
        res.status(404).json({
          error: 'Transcript is disabled for this video'
        });
      } else if (error.message.includes('No transcript found')) {
        res.status(404).json({
          error: 'No transcript available for this video'
        });
      } else if (error.message.includes('Video unavailable')) {
        res.status(404).json({
          error: 'Video is unavailable or private'
        });
      } else {
        res.status(500).json({
          error: 'Failed to extract transcript',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
  });
});

/**
 * Firebase Function to get YouTube video metadata
 */
exports.getYouTubeMetadata = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      const { videoId, youtubeUrl } = req.body;

      if (!videoId && !youtubeUrl) {
        res.status(400).json({ error: 'Video ID or YouTube URL is required' });
        return;
      }

      let extractedVideoId = videoId;
      
      // Extract video ID from URL if provided
      if (youtubeUrl && !videoId) {
        const urlPatterns = [
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
          /youtube\.com\/v\/([^&\n?#]+)/,
          /youtube\.com\/watch\?.*v=([^&\n?#]+)/
        ];
        
        for (const pattern of urlPatterns) {
          const match = youtubeUrl.match(pattern);
          if (match && match[1]) {
            extractedVideoId = match[1];
            break;
          }
        }
        
        if (!extractedVideoId) {
          res.status(400).json({ error: 'Invalid YouTube URL format' });
          return;
        }
      }

      // For now, return basic metadata based on video ID
      // In a production environment, you would use the YouTube Data API
      const metadata = {
        videoId: extractedVideoId,
        title: 'Video Title (API Key Required)',
        description: 'Video description would be available with YouTube Data API',
        thumbnailUrl: `https://img.youtube.com/vi/${extractedVideoId}/maxresdefault.jpg`,
        duration: 'Duration not available',
        channelName: 'Channel name not available',
        publishedAt: new Date().toISOString(),
        viewCount: 0,
        likeCount: 0
      };

      res.status(200).json({
        success: true,
        metadata
      });

    } catch (error) {
      console.error('Error getting YouTube metadata:', error);
      res.status(500).json({
        error: 'Failed to get video metadata',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
});

/**
 * Utility function to validate admin permissions
 */
const validateAdminPermissions = async (uid) => {
  try {
    const userDoc = await admin.firestore().doc(`users/${uid}`).get();
    if (!userDoc.exists) {
      throw new Error('User profile not found');
    }
    
    const userData = userDoc.data();
    if (userData.role !== 'admin' && userData.role !== 'developer') {
      throw new Error('Insufficient permissions');
    }
    
    return userData;
  } catch (error) {
    throw new Error(`Permission validation failed: ${error.message}`);
  }
};

/**
 * Firebase Function to generate learning content from transcript using AI
 * This would integrate with OpenAI GPT-4 or similar AI service
 */
exports.generateContentFromTranscript = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      // Validate admin permissions
      await validateAdminPermissions(decodedToken.uid);

      const { transcript, options = {} } = req.body;

      if (!transcript) {
        res.status(400).json({ error: 'Transcript is required' });
        return;
      }

      // For demo purposes, return a structured response
      // In production, this would call OpenAI GPT-4 or similar AI service
      const generatedContent = generateMockLearningContent(transcript, options);

      res.status(200).json({
        success: true,
        content: generatedContent,
        generatedAt: new Date().toISOString(),
        model: 'demo-generator-v1'
      });

    } catch (error) {
      console.error('Error generating content from transcript:', error);
      res.status(500).json({
        error: 'Failed to generate content',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
});

/**
 * Mock content generator for demonstration
 * In production, replace with actual AI service integration
 */
function generateMockLearningContent(transcript, options) {
  // Extract key topics (simplified)
  const words = transcript.toLowerCase().split(/\s+/);
  const keywordFreq = {};
  const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 3 && !commonWords.has(cleanWord)) {
      keywordFreq[cleanWord] = (keywordFreq[cleanWord] || 0) + 1;
    }
  });

  const topKeywords = Object.entries(keywordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([word]) => word);

  // Generate learning path structure
  const learningPath = {
    title: generateTitle(topKeywords),
    description: generateDescription(topKeywords),
    estimatedDuration: '2-3 hours',
    targetAudience: [options.targetAudience || 'intermediate'],
    isPremium: false,
    published: false,
    modules: generateModules(topKeywords, options)
  };

  return learningPath;
}

function generateTitle(keywords) {
  const titleTemplates = [
    `Complete Guide to ${keywords[0]?.toUpperCase()}`,
    `Mastering ${keywords[0]?.toUpperCase()}`,
    `${keywords[0]?.toUpperCase()} Fundamentals`,
    `Introduction to ${keywords[0]?.toUpperCase()}`
  ];
  
  return titleTemplates[Math.floor(Math.random() * titleTemplates.length)] || 'Generated Learning Path';
}

function generateDescription(keywords) {
  return `A comprehensive learning path covering ${keywords.slice(0, 3).join(', ')} and related concepts. This course provides practical knowledge and hands-on experience.`;
}

function generateModules(keywords, options) {
  const modules = [];
  const moduleCount = Math.min(4, keywords.length);
  
  for (let i = 0; i < moduleCount; i++) {
    const module = {
      title: `Module ${i + 1}: ${keywords[i]?.toUpperCase() || 'Concept'} Fundamentals`,
      description: `Learn about ${keywords[i]} and its practical applications.`,
      lessons: generateLessons(keywords.slice(i, i + 2), options)
    };
    modules.push(module);
  }
  
  return modules;
}

function generateLessons(keywords, options) {
  const lessons = [];
  
  keywords.forEach((keyword, index) => {
    if (!keyword) return;
    
    const lesson = {
      title: `Understanding ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`,
      lessonType: index === 0 ? 'concept_explanation' : 'interactive_practice',
      estimatedTimeMinutes: 15 + (index * 5),
      xpAward: 25,
      learningObjectives: [
        `Understand the basics of ${keyword}`,
        `Learn practical applications`,
        `Apply concepts in real scenarios`
      ],
      content: generateLessonContent(keyword, options)
    };
    
    lessons.push(lesson);
  });
  
  return lessons;
}

function generateLessonContent(topic, options) {
  const content = [
    {
      type: 'text',
      value: `Welcome to this lesson on ${topic}. We'll explore the fundamentals and practical applications.`
    },
    {
      type: 'text',
      value: `${topic.charAt(0).toUpperCase() + topic.slice(1)} is an important concept that forms the foundation of many modern applications.`
    }
  ];
  
  if (options.includeQuizzes) {
    content.push({
      type: 'quiz',
      question: `What is the main benefit of understanding ${topic}?`,
      options: [
        { text: 'It sounds impressive', correct: false },
        { text: 'It enables practical applications', correct: true },
        { text: 'It\'s required for certification', correct: false }
      ],
      feedback: `Understanding ${topic} enables you to build practical applications and solve real-world problems.`
    });
  }
  
  return content;
} 