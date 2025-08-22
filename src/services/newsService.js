import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, where, Timestamp, doc, updateDoc, startAfter } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import logger from '../utils/logger';

class NewsService {
  constructor() {
    // V3: Glassy backgrounds, vibrant borders, matching shadows, revised color palette
    const neonColors = [
      // Reds & Oranges
      { gradient: 'from-red-700/80 to-orange-600/80', border: 'border-red-500 hover:border-red-400', shadow: 'shadow-red-500/50' },
      { gradient: 'from-orange-600/80 to-amber-600/80', border: 'border-orange-400 hover:border-orange-300', shadow: 'shadow-orange-400/50' },

      // Yellows & Limes (darker gradients for text contrast)
      { gradient: 'from-yellow-800/80 to-amber-700/80', border: 'border-yellow-500 hover:border-yellow-400', shadow: 'shadow-yellow-500/50' },
      { gradient: 'from-lime-700/80 to-green-600/80', border: 'border-lime-500 hover:border-lime-400', shadow: 'shadow-lime-500/50' },

      // Greens & Teals
      { gradient: 'from-green-700/80 to-emerald-600/80', border: 'border-green-500 hover:border-green-400', shadow: 'shadow-green-500/50' },
      { gradient: 'from-teal-600/80 to-cyan-600/80', border: 'border-teal-400 hover:border-teal-300', shadow: 'shadow-teal-400/50' }, // Kept cyan light here

      // Pinks & Roses (distinct from deep purples)
      { gradient: 'from-pink-600/80 to-rose-500/80', border: 'border-pink-400 hover:border-pink-300', shadow: 'shadow-pink-400/50' },
      { gradient: 'from-fuchsia-600/80 to-pink-600/80', border: 'border-fuchsia-500 hover:border-fuchsia-400', shadow: 'shadow-fuchsia-500/50' },
      
      // Lighter/Alternative Purples & Blues (avoiding deep indigo/violet that blends with page bg)
      { gradient: 'from-purple-500/80 to-violet-500/80', border: 'border-purple-400 hover:border-purple-300', shadow: 'shadow-purple-400/50' }, // Lighter purple
      { gradient: 'from-sky-600/80 to-cyan-500/80', border: 'border-sky-400 hover:border-sky-300', shadow: 'shadow-sky-400/50' }, // Lighter blue/cyan focus

      // Unique Mixes
      { gradient: 'from-emerald-600/80 to-lime-700/80', border: 'border-emerald-400 hover:border-emerald-300', shadow: 'shadow-emerald-400/50' },
      { gradient: 'from-rose-600/80 to-orange-600/80', border: 'border-rose-400 hover:border-rose-300', shadow: 'shadow-rose-400/50' },
      { gradient: 'from-cyan-500/80 to-blue-500/80', border: 'border-cyan-400 hover:border-cyan-300', shadow: 'shadow-cyan-400/50' } // Lightest blue
    ];

    this.sources = [
      // Real RSS feeds - colors assigned randomly from the neon palette
      {
        name: 'OpenAI Blog',
        url: 'https://openai.com/blog/',
        rss: 'https://openai.com/blog/rss.xml',
        company: 'OpenAI',
        category: 'Model Release',
        icon: '🚀'
      },
      {
        name: 'NVIDIA AI Blog',
        url: 'https://blogs.nvidia.com/blog/category/deep-learning/',
        rss: 'https://blogs.nvidia.com/feed/',
        company: 'NVIDIA',
        category: 'Hardware',
        icon: '🎮'
      },
      {
        name: 'AI News',
        url: 'https://www.artificialintelligence-news.com/',
        rss: 'https://www.artificialintelligence-news.com/feed/',
        company: 'AI News',
        category: 'Industry News',
        icon: '📰'
      },
      {
        name: 'VentureBeat AI',
        url: 'https://venturebeat.com/ai/',
        rss: 'https://venturebeat.com/ai/feed/',
        company: 'VentureBeat',
        category: 'Business',
        icon: '💼'
      },
      {
        name: 'The Verge AI',
        url: 'https://www.theverge.com/ai-artificial-intelligence',
        rss: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
        company: 'The Verge',
        category: 'Tech News',
        icon: '🔗'
      },
      {
        name: 'MIT Tech Review AI',
        url: 'https://www.technologyreview.com/topic/artificial-intelligence/',
        rss: 'https://www.technologyreview.com/feed/',
        company: 'MIT Technology Review',
        category: 'Research',
        icon: '🎓'
      }
    ];

    // Store the neon colors array for dynamic assignment
    this.neonColors = neonColors;
    this.usedColorIndices = []; // Track used colors to avoid repetition
  }

  // Fetch news from RSS feeds
  async fetchRSSFeed(url) {
    try {
      // Use CORS proxy for RSS feeds
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.status === 'ok') {
        return data.items.slice(0, 5); // Get latest 5 articles
      }
      return [];
    } catch (error) {
      logger.error(`Error fetching RSS from ${url}:`, error);
      return [];
    }
  }

  // Filter out political content
  isPoliticalContent(title, content) {
    const politicalKeywords = [
      'election', 'vote', 'voting', 'campaign', 'congress', 'senate', 'president', 'presidential',
      'republican', 'democrat', 'biden', 'trump', 'politics', 'political', 'government',
      'immigration', 'border', 'policy', 'legislation', 'bill', 'law', 'regulation',
      'supreme court', 'justice', 'constitutional', 'amendment', 'partisan',
      'liberal', 'conservative', 'progressive', 'socialism', 'capitalism'
    ];
    
    const text = (title + ' ' + content).toLowerCase();
    return politicalKeywords.some(keyword => text.includes(keyword));
  }

  // Generate simulated engagement for articles older than 1 hour
  generateSimulatedEngagement(articleDate) {
    const now = new Date();
    const hoursSincePublished = (now - articleDate) / (1000 * 60 * 60);
    
    if (hoursSincePublished < 1) {
      return 0; // No simulated likes for new articles
    }
    
    // Generate likes based on article age (more likes for older articles)
    const baseEngagement = Math.floor(hoursSincePublished * 2) + Math.floor(Math.random() * 15);
    const popularityBoost = Math.floor(Math.random() * 25); // Random popularity factor
    
    return Math.min(baseEngagement + popularityBoost, 150); // Cap at 150 simulated likes
  }

  // Process and standardize article data
  processArticle(article, source) {
    const articleContent = article.content || article.description || '';
    
    // Filter out political content
    if (this.isPoliticalContent(article.title || '', articleContent)) {
      logger.info(`Filtered political article: ${article.title}`);
      return null; // Skip political articles
    }
    
    const articleDate = new Date(article.pubDate || article.published || Date.now());
    const simulatedLikes = this.generateSimulatedEngagement(articleDate);
    
    // Get a unique neon color (avoid repetition)
    let randomColorIndex;
    
    // If we've used most colors, reset the used list
    if (this.usedColorIndices.length >= this.neonColors.length - 2) {
      this.usedColorIndices = [];
    }
    
    // Find an unused color
    do {
      randomColorIndex = Math.floor(Math.random() * this.neonColors.length);
    } while (this.usedColorIndices.includes(randomColorIndex));
    
    // Mark this color as used
    this.usedColorIndices.push(randomColorIndex);
    
    const randomColors = this.neonColors[randomColorIndex];
    
    return {
      id: `${source.company}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: article.title || article.name || 'AI News Update',
      summary: this.extractSummary(articleContent),
      content: articleContent,
      date: articleDate,
      source: source.company,
      category: source.category,
      icon: source.icon,
      // Use unique neon colors with no repetition
      gradient: randomColors.gradient,
      border: randomColors.border,
      url: article.link || article.url || source.url,
      createdAt: Timestamp.now(),
      isActive: true,
      // Like system
      likes: {
        simulated: simulatedLikes, // Simulated engagement for older articles
        real: 0, // Real user likes start at 0
        total: simulatedLikes // Total = simulated + real
      },
      likedBy: [] // Array of user IDs who liked this article
    };
  }

  // Extract meaningful summary from content
  extractSummary(content) {
    if (!content) return 'Latest AI development and research update.';
    
    // Remove HTML tags and limit to ~150 characters
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    if (cleanContent.length <= 150) return cleanContent;
    
    const summary = cleanContent.substring(0, 147) + '...';
    return summary;
  }

  // Fetch all news from all sources (RSS only - no mock data)
  async fetchAllNews() {
    logger.info('Fetching AI news from real RSS sources only...');
    const allArticles = [];

    for (const source of this.sources) {
      try {
        // Only fetch from RSS feeds - no mock data
        if (source.rss) {
          const articles = await this.fetchRSSFeed(source.rss);
          
          const processedArticles = articles
            .map(article => this.processArticle(article, source))
            .filter(article => article !== null); // Filter out political articles

          allArticles.push(...processedArticles);
          logger.info(`Fetched ${processedArticles.length} articles from ${source.company} (after filtering)`);
        } else {
          logger.info(`Skipping ${source.company} - no RSS feed available`);
        }
        
        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        logger.error(`Error processing source ${source.company}:`, error);
      }
    }

    return allArticles;
  }

  // Save news articles to Firestore (admin-only; retained for server-side contexts). Not used from client.
  async saveNewsToFirestore(articles) {
    try {
      const newsCollection = collection(db, 'aiNews');
      const savedOrUpdatedArticles = [];

      for (const article of articles) {
        const existingQuery = query(
          newsCollection,
          where('title', '==', article.title),
          where('source', '==', article.source)
        );
        
        const querySnapshot = await getDocs(existingQuery);
        
        if (querySnapshot.empty) {
          // Article is new, add it
          const docRef = await addDoc(newsCollection, article);
          savedOrUpdatedArticles.push({ ...article, firestoreId: docRef.id });
          logger.info(`Saved new article: ${article.title}`);
        } else {
          // Article exists, update it
          // Assuming only one match, as title and source should be unique enough
          const existingDoc = querySnapshot.docs[0];
          await updateDoc(existingDoc.ref, article); // article contains all fields, including new colors
          savedOrUpdatedArticles.push({ ...article, firestoreId: existingDoc.id });
          logger.info(`Updated existing article: ${article.title}`);
        }
      }

      return savedOrUpdatedArticles;
    } catch (error) {
      logger.error('Error saving news to Firestore:', error);
      
      // If it's a permissions error, provide helpful message
      if (error.code === 'permission-denied') {
        logger.info('⚠️ Firestore write permissions not set up. Please update Firebase Security Rules.');
        logger.info('📖 See firebase-security-rules.md for instructions.');
      }
      
      throw error;
    }
  }

  // Get news articles from Firestore
  async getNewsFromFirestore(limitCount = 20) {
    try {
      const newsCollection = collection(db, 'aiNews');
      // Simplified query - just order by date, no isActive filter to avoid index requirement
      const newsQuery = query(
        newsCollection,
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(newsQuery);
      const articles = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filter active articles client-side instead of in query
        if (data.isActive !== false) {
          articles.push({
            ...data,
            firestoreId: doc.id,
            date: data.date.toDate ? data.date.toDate() : new Date(data.date)
          });
        }
      });

      return articles;
    } catch (error) {
      logger.error('Error fetching news from Firestore:', error);
      
      // If it's a permissions error, return empty array to trigger fallback
      if (error.code === 'permission-denied') {
        logger.info('Firestore permissions not set up yet. Using fallback news.');
        return [];
      }
      
      return [];
    }
  }

  // Paginated news fetch with cursor
  async getNewsPage(pageSize = 12, cursor = null) {
    try {
      const newsCollection = collection(db, 'aiNews');
      const constraints = [orderBy('date', 'desc'), limit(pageSize)];
      if (cursor) {
        const cursorValue = cursor.toDate ? cursor : Timestamp.fromDate(cursor);
        constraints.splice(1, 0, startAfter(cursorValue));
      }
      const newsQuery = query(newsCollection, ...constraints);
      const querySnapshot = await getDocs(newsQuery);

      const articles = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.isActive !== false) {
          articles.push({
            ...data,
            firestoreId: docSnap.id,
            date: data.date.toDate ? data.date.toDate() : new Date(data.date)
          });
        }
      });

      const last = articles[articles.length - 1];
      return {
        articles,
        nextCursor: last ? (last.date instanceof Date ? last.date : new Date(last.date)) : null,
        hasMore: articles.length === pageSize
      };
    } catch (error) {
      logger.error('Error fetching paginated news from Firestore:', error);
      return { articles: [], nextCursor: null, hasMore: false };
    }
  }

  // Main function to update news via Cloud Function (admin-only)
  async updateNews() {
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken?.();
      const resp = await fetch('https://us-central1-beginai1.cloudfunctions.net/updateAINewsManual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({})
      });
      if (!resp.ok) {
        throw new Error(`Update failed with status ${resp.status}`);
      }
      const data = await resp.json();
      logger.info('News update triggered via Cloud Function', data);
      return data?.articlesProcessed ? new Array(data.articlesProcessed).fill(0) : [];
    } catch (error) {
      logger.error('Error triggering Cloud Function update:', error);
      throw error;
    }
  }

  // Clean old news (keep only last 100 articles)
  async cleanOldNews() {
    try {
      const newsCollection = collection(db, 'aiNews');
      const allNewsQuery = query(newsCollection, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(allNewsQuery);
      
      const docs = querySnapshot.docs;
      if (docs.length > 100) {
        // Delete articles beyond the first 100
        const docsToDelete = docs.slice(100);
        for (const doc of docsToDelete) {
          await doc.ref.delete();
        }
        logger.info(`Cleaned ${docsToDelete.length} old news articles`);
      }
    } catch (error) {
      logger.error('Error cleaning old news:', error);
    }
  }

  // Like/unlike an article via Cloud Function
  async likeArticle(articleId, userId) {
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken?.();
      if (!token) {
        throw new Error('Not authenticated');
      }
      const resp = await fetch('https://us-central1-beginai1.cloudfunctions.net/toggleNewsLike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ articleId })
      });
      if (!resp.ok) {
        throw new Error(`Like toggle failed with status ${resp.status}`);
      }
      const data = await resp.json();
      return { liked: !!data.liked, totalLikes: data.totalLikes || 0, realLikes: data.realLikes || 0 };
    } catch (error) {
      logger.error('Error toggling like via Cloud Function:', error);
      throw error;
    }
  }

  // Get like status for a user and article
  async getUserLikeStatus(articleId, userId) {
    try {
      const newsCollection = collection(db, 'aiNews');
      const articleQuery = query(newsCollection, where('id', '==', articleId));
      const querySnapshot = await getDocs(articleQuery);
      
      if (querySnapshot.empty) {
        return { liked: false, totalLikes: 0 };
      }
      
      const articleData = querySnapshot.docs[0].data();
      const likedBy = articleData.likedBy || [];
      const liked = likedBy.includes(userId);
      const totalLikes = articleData.likes?.total || 0;
      
      return { liked, totalLikes };
    } catch (error) {
      logger.error('Error getting like status:', error);
      return { liked: false, totalLikes: 0 };
    }
  }
}

// Create singleton instance
const newsService = new NewsService();

// Export functions for use in components and cloud functions
export const updateAINews = () => newsService.updateNews();
export const getAINews = (limit) => newsService.getNewsFromFirestore(limit);
export const getAINewsPage = (pageSize, cursor) => newsService.getNewsPage(pageSize, cursor);
export const cleanOldAINews = () => newsService.cleanOldNews();
export const likeAINewsArticle = (articleId, userId) => newsService.likeArticle(articleId, userId);
export const getAINewsLikeStatus = (articleId, userId) => newsService.getUserLikeStatus(articleId, userId);

export default newsService; 