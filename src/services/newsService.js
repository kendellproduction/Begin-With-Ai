import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, where, Timestamp, doc, updateDoc } from 'firebase/firestore';

class NewsService {
  constructor() {
    // BRIGHT NEON colors that really pop
    const neonColors = [
      {
        gradient: 'from-red-400/70 to-orange-400/70',
        border: 'border-red-300/90 hover:border-red-200'
      },
      {
        gradient: 'from-blue-400/70 to-cyan-400/70',
        border: 'border-blue-300/90 hover:border-blue-200'
      },
      {
        gradient: 'from-green-400/70 to-emerald-400/70',
        border: 'border-green-300/90 hover:border-green-200'
      },
      {
        gradient: 'from-purple-400/70 to-pink-400/70',
        border: 'border-purple-300/90 hover:border-purple-200'
      },
      {
        gradient: 'from-yellow-400/70 to-amber-400/70',
        border: 'border-yellow-300/90 hover:border-yellow-200'
      },
      {
        gradient: 'from-indigo-400/70 to-violet-400/70',
        border: 'border-indigo-300/90 hover:border-indigo-200'
      },
      {
        gradient: 'from-teal-400/70 to-cyan-400/70',
        border: 'border-teal-300/90 hover:border-teal-200'
      },
      {
        gradient: 'from-rose-400/70 to-pink-400/70',
        border: 'border-rose-300/90 hover:border-rose-200'
      },
      {
        gradient: 'from-lime-400/70 to-green-400/70',
        border: 'border-lime-300/90 hover:border-lime-200'
      },
      {
        gradient: 'from-orange-400/70 to-red-400/70',
        border: 'border-orange-300/90 hover:border-orange-200'
      },
      {
        gradient: 'from-sky-400/70 to-blue-400/70',
        border: 'border-sky-300/90 hover:border-sky-200'
      },
      {
        gradient: 'from-emerald-400/70 to-teal-400/70',
        border: 'border-emerald-300/90 hover:border-emerald-200'
      },
      {
        gradient: 'from-fuchsia-400/70 to-purple-400/70',
        border: 'border-fuchsia-300/90 hover:border-fuchsia-200'
      },
      {
        gradient: 'from-amber-400/70 to-yellow-400/70',
        border: 'border-amber-300/90 hover:border-amber-200'
      },
      {
        gradient: 'from-violet-400/70 to-indigo-400/70',
        border: 'border-violet-300/90 hover:border-violet-200'
      },
      {
        gradient: 'from-cyan-400/70 to-teal-400/70',
        border: 'border-cyan-300/90 hover:border-cyan-200'
      },
      {
        gradient: 'from-pink-400/70 to-fuchsia-400/70',
        border: 'border-pink-300/90 hover:border-pink-200'
      },
      {
        gradient: 'from-red-300/80 to-pink-300/80',
        border: 'border-red-200 hover:border-red-100'
      }
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
      console.error(`Error fetching RSS from ${url}:`, error);
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
      console.log(`Filtered political article: ${article.title}`);
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
    console.log('Fetching AI news from real RSS sources only...');
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
          console.log(`Fetched ${processedArticles.length} articles from ${source.company} (after filtering)`);
        } else {
          console.log(`Skipping ${source.company} - no RSS feed available`);
        }
        
        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error processing source ${source.company}:`, error);
      }
    }

    return allArticles;
  }

  // Save news articles to Firestore
  async saveNewsToFirestore(articles) {
    try {
      const newsCollection = collection(db, 'aiNews');
      const savedArticles = [];

      for (const article of articles) {
        // Check if article already exists
        const existingQuery = query(
          newsCollection,
          where('title', '==', article.title),
          where('source', '==', article.source)
        );
        
        const querySnapshot = await getDocs(existingQuery);
        
        if (querySnapshot.empty) {
          const docRef = await addDoc(newsCollection, article);
          savedArticles.push({ ...article, firestoreId: docRef.id });
          console.log(`Saved article: ${article.title}`);
        } else {
          console.log(`Article already exists: ${article.title}`);
        }
      }

      return savedArticles;
    } catch (error) {
      console.error('Error saving news to Firestore:', error);
      
      // If it's a permissions error, provide helpful message
      if (error.code === 'permission-denied') {
        console.log('⚠️ Firestore write permissions not set up. Please update Firebase Security Rules.');
        console.log('📖 See firebase-security-rules.md for instructions.');
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
      console.error('Error fetching news from Firestore:', error);
      
      // If it's a permissions error, return empty array to trigger fallback
      if (error.code === 'permission-denied') {
        console.log('Firestore permissions not set up yet. Using fallback news.');
        return [];
      }
      
      return [];
    }
  }

  // Main function to update news
  async updateNews() {
    try {
      console.log('Starting news update process...');
      
      const newArticles = await this.fetchAllNews();
      console.log(`Found ${newArticles.length} new articles`);
      
      if (newArticles.length > 0) {
        await this.saveNewsToFirestore(newArticles);
        console.log('News update completed successfully');
      }
      
      return newArticles;
    } catch (error) {
      console.error('Error in news update process:', error);
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
        console.log(`Cleaned ${docsToDelete.length} old news articles`);
      }
    } catch (error) {
      console.error('Error cleaning old news:', error);
    }
  }

  // Like an article (real user interaction)
  async likeArticle(articleId, userId) {
    try {
      const newsCollection = collection(db, 'aiNews');
      const articleDoc = doc(newsCollection, articleId);
      
      // Get current article data
      const articleSnapshot = await getDocs(query(newsCollection, where('id', '==', articleId)));
      
      if (articleSnapshot.empty) {
        throw new Error('Article not found');
      }
      
      const articleData = articleSnapshot.docs[0].data();
      const docRef = articleSnapshot.docs[0].ref;
      
      // Check if user already liked this article
      const likedBy = articleData.likedBy || [];
      const hasLiked = likedBy.includes(userId);
      
      let updatedLikedBy;
      let realLikes = articleData.likes?.real || 0;
      
      if (hasLiked) {
        // Unlike - remove user from likedBy array
        updatedLikedBy = likedBy.filter(id => id !== userId);
        realLikes = Math.max(0, realLikes - 1);
      } else {
        // Like - add user to likedBy array
        updatedLikedBy = [...likedBy, userId];
        realLikes += 1;
      }
      
      const simulatedLikes = articleData.likes?.simulated || 0;
      const totalLikes = simulatedLikes + realLikes;
      
      // Update the article
      await updateDoc(docRef, {
        likedBy: updatedLikedBy,
        'likes.real': realLikes,
        'likes.total': totalLikes
      });
      
      console.log(`Article ${hasLiked ? 'unliked' : 'liked'} by user ${userId}`);
      return { liked: !hasLiked, totalLikes, realLikes };
      
    } catch (error) {
      console.error('Error liking article:', error);
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
      console.error('Error getting like status:', error);
      return { liked: false, totalLikes: 0 };
    }
  }
}

// Create singleton instance
const newsService = new NewsService();

// Export functions for use in components and cloud functions
export const updateAINews = () => newsService.updateNews();
export const getAINews = (limit) => newsService.getNewsFromFirestore(limit);
export const cleanOldAINews = () => newsService.cleanOldNews();
export const likeAINewsArticle = (articleId, userId) => newsService.likeArticle(articleId, userId);
export const getAINewsLikeStatus = (articleId, userId) => newsService.getUserLikeStatus(articleId, userId);

export default newsService; 