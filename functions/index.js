const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');

// Configure CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3002', 'https://beginai1.firebaseapp.com', 'https://beginai1.web.app'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const corsHandler = cors(corsOptions);

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// News fetching logic (similar to the client-side service)
class CloudNewsService {
  constructor() {
    this.sources = [
      {
        name: 'OpenAI Blog',
        url: 'https://openai.com/blog/',
        rss: 'https://openai.com/blog/rss.xml',
        company: 'OpenAI',
        category: 'Model Release',
        icon: '🚀',
        gradient: 'from-blue-600/20 to-cyan-600/20',
        border: 'border-blue-500/30 hover:border-blue-400/50'
      },
      {
        name: 'Google AI Blog',
        url: 'https://ai.googleblog.com/',
        rss: 'https://ai.googleblog.com/feeds/posts/default',
        company: 'Google',
        category: 'Research',
        icon: '🌟',
        gradient: 'from-green-600/20 to-emerald-600/20',
        border: 'border-green-500/30 hover:border-green-400/50'
      },
      {
        name: 'Meta AI',
        url: 'https://ai.meta.com/blog/',
        rss: 'https://ai.meta.com/blog/feed/',
        company: 'Meta',
        category: 'Platform',
        icon: '💻',
        gradient: 'from-pink-600/20 to-rose-600/20',
        border: 'border-pink-500/30 hover:border-pink-400/50'
      }
    ];
  }

  async fetchRSSFeed(url) {
    try {
      const fetch = require('node-fetch');
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.status === 'ok') {
        return data.items.slice(0, 5);
      }
      return [];
    } catch (error) {
      console.error(`Error fetching RSS from ${url}:`, error);
      return [];
    }
  }

  generateRecentMockNews(source) {
    const recentTopics = {
      'OpenAI': [
        'GPT-5 Development Progress Update',
        'OpenAI Announces New Safety Research Initiative',
        'ChatGPT Enterprise Features Expansion'
      ],
      'Google': [
        'Gemini Ultra 2.0 Performance Benchmarks',
        'Google Cloud AI Platform Updates',
        'Bard Integration with Google Workspace'
      ],
      'Meta': [
        'Llama 3 Open Source Release',
        'Meta AI Assistant New Features',
        'VR Integration with AI Models'
      ]
    };

    const topics = recentTopics[source.company] || ['AI Research Update'];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    const articles = [];
    for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
      const daysAgo = Math.floor(Math.random() * 7); // Last week only
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      articles.push({
        title: `${randomTopic} ${i > 0 ? `- Update ${i + 1}` : ''}`,
        description: `Latest developments from ${source.company} in AI research and development.`,
        pubDate: date.toISOString(),
        link: `${source.url}#${Date.now()}-${i}`,
        content: `Detailed information about ${randomTopic} from ${source.company}'s research team.`
      });
    }
    
    return articles;
  }

  processArticle(article, source) {
    return {
      id: `${source.company}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: article.title || 'AI News Update',
      summary: this.extractSummary(article.description || article.content || ''),
      content: article.content || article.description || '',
      date: new Date(article.pubDate || Date.now()),
      source: source.company,
      category: source.category,
      icon: source.icon,
      gradient: source.gradient,
      border: source.border,
      url: article.link || article.url || source.url,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true
    };
  }

  extractSummary(content) {
    if (!content) return 'Latest AI development and research update.';
    
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    if (cleanContent.length <= 150) return cleanContent;
    
    return cleanContent.substring(0, 147) + '...';
  }

  async fetchAllNews() {
    console.log('Cloud Function: Fetching AI news from all sources...');
    const allArticles = [];

    for (const source of this.sources) {
      try {
        let articles = [];
        
        if (source.rss) {
          articles = await this.fetchRSSFeed(source.rss);
        } else {
          articles = this.generateRecentMockNews(source);
        }

        const processedArticles = articles.map(article => 
          this.processArticle(article, source)
        );

        allArticles.push(...processedArticles);
        console.log(`Fetched ${processedArticles.length} articles from ${source.company}`);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error processing source ${source.company}:`, error);
      }
    }

    return allArticles;
  }

  async saveNewsToFirestore(articles) {
    try {
      const newsCollection = db.collection('aiNews');
      const savedArticles = [];

      for (const article of articles) {
        // Check if article already exists
        const existingQuery = await newsCollection
          .where('title', '==', article.title)
          .where('source', '==', article.source)
          .get();
        
        if (existingQuery.empty) {
          const docRef = await newsCollection.add(article);
          savedArticles.push({ ...article, firestoreId: docRef.id });
          console.log(`Saved article: ${article.title}`);
        } else {
          console.log(`Article already exists: ${article.title}`);
        }
      }

      return savedArticles;
    } catch (error) {
      console.error('Error saving news to Firestore:', error);
      throw error;
    }
  }

  async updateNews() {
    try {
      console.log('Cloud Function: Starting news update process...');
      
      const newArticles = await this.fetchAllNews();
      console.log(`Found ${newArticles.length} new articles`);
      
      if (newArticles.length > 0) {
        await this.saveNewsToFirestore(newArticles);
        console.log('Cloud Function: News update completed successfully');
      }
      
      return newArticles;
    } catch (error) {
      console.error('Cloud Function: Error in news update process:', error);
      throw error;
    }
  }

  async cleanOldNews() {
    try {
      const newsCollection = db.collection('aiNews');
      const allNewsQuery = await newsCollection.orderBy('date', 'desc').get();
      
      const docs = allNewsQuery.docs;
      if (docs.length > 100) {
        const batch = db.batch();
        const docsToDelete = docs.slice(100);
        
        docsToDelete.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        console.log(`Cleaned ${docsToDelete.length} old news articles`);
      }
    } catch (error) {
      console.error('Error cleaning old news:', error);
    }
  }
}

const newsService = new CloudNewsService();

// Scheduled function - runs once per day
exports.updateAINewsScheduled = functions.pubsub
  .schedule('every day')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    try {
      console.log('Scheduled news update starting...');
      await newsService.updateNews();
      await newsService.cleanOldNews();
      console.log('Scheduled news update completed successfully');
      return null;
    } catch (error) {
      console.error('Scheduled news update failed:', error);
      throw error;
    }
  });

// Manual trigger function (can be called via HTTP)
exports.updateAINewsManual = functions.https.onRequest(async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      console.log('Manual news update triggered...');
      const results = await newsService.updateNews();
      await newsService.cleanOldNews();
      
      res.status(200).json({
        success: true,
        message: 'News update completed successfully',
        articlesProcessed: results.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Manual news update failed:', error);
      res.status(500).json({
        success: false,
        message: 'News update failed',
        error: error.message
      });
    }
  });
});

// Initialize with some sample data
exports.initializeNewsData = functions.https.onRequest(async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const sampleNews = [
        {
          id: 'init-1',
          title: 'Welcome to AI News Automation',
          summary: 'Your automated AI news system is now active and will fetch the latest updates from major AI companies.',
          content: 'The system monitors OpenAI, Google AI, Meta AI, and other major sources.',
          date: new Date(),
          source: 'BeginningWithAi',
          category: 'Platform',
          icon: '🎉',
          gradient: 'from-purple-600/20 to-indigo-600/20',
          border: 'border-purple-500/30 hover:border-purple-400/50',
          url: 'https://beginningwithai.com',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          isActive: true
        }
      ];

      await newsService.saveNewsToFirestore(sampleNews);
      
      res.status(200).json({
        success: true,
        message: 'Sample news data initialized',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to initialize news data:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
}); 