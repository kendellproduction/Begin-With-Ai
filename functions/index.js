const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Configure CORS (restrict to prod/staging origins only)
const corsOptions = {
  origin: [
    'https://beginai1.firebaseapp.com',
    'https://beginai1.web.app',
    'https://beginningwithai.com',
    'https://www.beginningwithai.com'
  ],
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

// Simple in-memory rate limiter: 1 request/min per user/IP
const rateLimitWindowMs = 60 * 1000;
const lastRequestByKey = new Map();

function getClientKey(req) {
  const forwarded = (req.headers['x-forwarded-for'] || '').toString();
  const ip = forwarded.split(',')[0].trim() || req.ip || 'unknown';
  const userId = (req.body && (req.body.userId || req.body.uid)) || null;
  const email = (req.body && req.body.userEmail) || null;
  return userId || email || ip;
}

function isThrottled(req) {
  const key = getClientKey(req);
  const now = Date.now();
  const last = lastRequestByKey.get(key) || 0;
  if (now - last < rateLimitWindowMs) {
    const retryAfterMs = rateLimitWindowMs - (now - last);
    return { throttled: true, retryAfterMs };
  }
  lastRequestByKey.set(key, now);
  return { throttled: false, retryAfterMs: 0 };
}

// Admin auth/authorization helper
async function requireAdmin(req, res) {
  try {
    const authHeader = req.headers.authorization || '';
    const hasBearer = authHeader.startsWith('Bearer ');
    if (!hasBearer) {
      res.status(401).json({ success: false, message: 'Unauthorized: missing Bearer token' });
      return null;
    }
    const idToken = authHeader.replace('Bearer ', '').trim();
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const doc = await db.collection('users').doc(uid).get();
    const role = (doc.exists && doc.data() && doc.data().role) || null;
    if (role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden: admin role required' });
      return null;
    }
    return uid;
  } catch (e) {
    console.error('Admin auth check failed:', e);
    res.status(401).json({ success: false, message: 'Unauthorized: invalid token' });
    return null;
  }
}

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

// Scheduled function - runs once per day with region and timezone
exports.updateAINewsScheduled = functions
  .region('us-central1')
  .pubsub
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
      const uid = await requireAdmin(req, res);
      if (!uid) return;
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

// Helper to create a Gmail transporter from env or functions config
function createGmailTransporter() {
  try {
    const user = process.env.GMAIL_USER || (functions.config().gmail && functions.config().gmail.user);
    const pass = process.env.GMAIL_APP_PASSWORD || (functions.config().gmail && functions.config().gmail.app_password);
    if (!user || !pass) {
      console.warn('Email credentials not configured; email sending is disabled.');
      return null;
    }
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  } catch (e) {
    console.warn('Failed to initialize email transporter; email sending is disabled.', e);
    return null;
  }
}

// Email sending function for contact form
exports.sendContactEmail = functions.https.onRequest(async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      // Only allow POST requests
      if (req.method !== 'POST') {
        res.status(405).json({ success: false, message: 'Method not allowed' });
        return;
      }

      const throttle = isThrottled(req);
      if (throttle.throttled) {
        res.status(429).json({
          success: false,
          message: `You are sending messages too fast. Please wait ${Math.ceil(throttle.retryAfterMs / 1000)} seconds and try again.`
        });
        return;
      }

      const { name, email, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        res.status(400).json({ 
          success: false, 
          message: 'All fields are required' 
        });
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ 
          success: false, 
          message: 'Please provide a valid email address' 
        });
        return;
      }

      // Configure nodemailer with Gmail SMTP (from env/config)
      const transporter = createGmailTransporter();

      // Email content to send to kendellproduction@gmail.com
      const mailOptions = {
        from: 'kendellproduction@gmail.com',
        to: 'kendellproduction@gmail.com',
        replyTo: email,
        subject: `Beginning With Ai Contact: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2061a6, #1e40af); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h2 style="margin: 0;">New Contact Form Submission</h2>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Beginning With Ai</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #2061a6;">From:</strong> ${name}
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #2061a6;">Email:</strong> 
                <a href="mailto:${email}" style="color: #1e40af;">${email}</a>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #2061a6;">Subject:</strong> ${subject}
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #2061a6;">Message:</strong>
              </div>
              
              <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2061a6; margin-bottom: 20px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              
              <div style="text-align: center; padding: 15px; background: #e7f3ff; border-radius: 5px;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  <strong>Reply directly to this email</strong> to respond to ${name}
                </p>
              </div>
            </div>
          </div>
        `
      };

      // Send the email when transporter is available
      if (transporter) {
        await transporter.sendMail(mailOptions);
      } else {
        console.warn('Contact email not sent due to missing transporter configuration.');
      }

      // Log the contact form submission to Firestore for record keeping
      try {
        await db.collection('contactSubmissions').add({
          name,
          email,
          subject,
          message,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          status: 'sent'
        });
      } catch (firestoreError) {
        console.error('Error logging to Firestore:', firestoreError);
      }

      res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully! We\'ll get back to you soon.'
      });

    } catch (error) {
      console.error('Error sending contact email:', error);
      res.status(500).json({
        success: false,
        message: 'Sorry, there was an error sending your message. Please try again later.'
      });
    }
  });
});

// Bug reporting function for logged-in users
exports.sendBugReport = functions.https.onRequest(async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      // Only allow POST requests
      if (req.method !== 'POST') {
        res.status(405).json({ success: false, message: 'Method not allowed' });
        return;
      }

      const throttle = isThrottled(req);
      if (throttle.throttled) {
        res.status(429).json({
          success: false,
          message: `Thanks for the report! You recently submitted one. Please wait ${Math.ceil(throttle.retryAfterMs / 1000)} seconds and try again.`
        });
        return;
      }

      const { 
        bugTitle, 
        bugDescription, 
        bugCategory, 
        bugPriority,
        userAgent,
        currentUrl,
        userEmail,
        userId,
        userName,
        reproductionSteps,
        expectedBehavior,
        actualBehavior
      } = req.body;

      // Validate required fields (user email and ID are optional for anonymous reports)
      if (!bugTitle || !bugDescription || !bugCategory) {
        res.status(400).json({ 
          success: false, 
          message: 'Missing required fields: title, description, and category are required' 
        });
        return;
      }

      // Configure nodemailer with Gmail SMTP (from env/config)
      const transporter = createGmailTransporter();

      // Bug severity emoji mapping
      const priorityEmojis = {
        'critical': '🚨',
        'high': '⚠️',
        'medium': '🔶',
        'low': '🔵'
      };

      // Category emoji mapping
      const categoryEmojis = {
        'lesson-content': '📚',
        'authentication': '🔐',
        'payment-billing': '💳',
        'user-interface': '🖥️',
        'performance': '⚡',
        'mobile-app': '📱',
        'data-sync': '🔄',
        'other': '🐛'
      };

      const priorityEmoji = priorityEmojis[bugPriority] || '🐛';
      const categoryEmoji = categoryEmojis[bugCategory] || '🐛';

      // Email content to send to kendellproduction@gmail.com
      const mailOptions = {
        from: 'kendellproduction@gmail.com',
        to: 'kendellproduction@gmail.com',
        replyTo: userEmail || 'noreply@beginningwithai.com',
        subject: `${priorityEmoji} Bug Report: ${bugTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #f8f9fa;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">🐛 Bug Report - Beginning With Ai</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Priority: ${bugPriority.toUpperCase()} • Category: ${bugCategory.replace('-', ' ').toUpperCase()}</p>
            </div>
            
            <!-- Main Content -->
            <div style="background: white; padding: 25px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
              
              <!-- Bug Overview -->
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #dc2626;">
                <h2 style="color: #dc2626; margin: 0 0 10px 0; font-size: 20px;">
                  ${categoryEmoji} ${bugTitle}
                </h2>
                <p style="color: #666; margin: 0; font-size: 16px; line-height: 1.5;">
                  ${bugDescription.replace(/\n/g, '<br>')}
                </p>
              </div>

              <!-- User Information -->
              <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1976d2; margin: 0 0 15px 0; font-size: 16px;">👤 Reporter Information</h3>
                <div style="color: #333;">
                  <strong>Name:</strong> ${userName || 'Anonymous User'}<br>
                  <strong>Email:</strong> ${userEmail ? `<a href="mailto:${userEmail}" style="color: #1976d2;">${userEmail}</a>` : 'Not provided (anonymous report)'}<br>
                  <strong>User ID:</strong> ${userId || 'Anonymous'}<br>
                  <strong>Current URL:</strong> ${currentUrl || 'Not provided'}<br>
                  <strong>User Agent:</strong> ${userAgent || 'Not provided'}
                </div>
              </div>

              <!-- Technical Details -->
              ${reproductionSteps || expectedBehavior || actualBehavior ? `
              <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #f57c00; margin: 0 0 15px 0; font-size: 16px;">🔧 Technical Details</h3>
                
                ${reproductionSteps ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #333;">Steps to Reproduce:</strong>
                  <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 5px; border-left: 3px solid #f57c00;">
                    ${reproductionSteps.replace(/\n/g, '<br>')}
                  </div>
                </div>
                ` : ''}
                
                ${expectedBehavior ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #333;">Expected Behavior:</strong>
                  <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 5px; border-left: 3px solid #4caf50;">
                    ${expectedBehavior.replace(/\n/g, '<br>')}
                  </div>
                </div>
                ` : ''}
                
                ${actualBehavior ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #333;">Actual Behavior:</strong>
                  <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 5px; border-left: 3px solid #dc2626;">
                    ${actualBehavior.replace(/\n/g, '<br>')}
                  </div>
                </div>
                ` : ''}
              </div>
              ` : ''}

              <!-- Priority & Category Info -->
              <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                <div style="flex: 1; background: #ffebee; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; margin-bottom: 5px;">${priorityEmoji}</div>
                  <strong style="color: #c62828;">Priority: ${bugPriority.toUpperCase()}</strong>
                </div>
                <div style="flex: 1; background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; margin-bottom: 5px;">${categoryEmoji}</div>
                  <strong style="color: #2e7d32;">Category: ${bugCategory.replace('-', ' ').toUpperCase()}</strong>
                </div>
              </div>
              
              <!-- Action Required -->
              <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; text-align: center;">
                <h3 style="color: #7b1fa2; margin: 0 0 10px 0;">⚡ Quick Actions</h3>
                <p style="margin: 0 0 15px 0; color: #666;">
                  ${userEmail ? `<strong>Reply directly to this email</strong> to communicate with ${userName || userEmail}` : '<strong>Anonymous report</strong> - no reply email available'}
                </p>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                  ${userEmail ? `
                  <a href="mailto:${userEmail}?subject=Re: Bug Report - ${bugTitle}" 
                     style="background: #7b1fa2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    📧 Reply to User
                  </a>
                  ` : ''}
                  ${userId ? `
                  <a href="https://console.firebase.google.com/project/beginai1/firestore/data/users/${userId}" 
                     style="background: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;" 
                     target="_blank">
                    👤 View User Profile
                  </a>
                  ` : ''}
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
              <p style="margin: 0;">Beginning With Ai Bug Tracking System</p>
              <p style="margin: 5px 0 0 0;">This report was automatically generated on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `
      };

      // Email sending can be enabled by uncommenting the line below once credentials are configured
      // if (transporter) { await transporter.sendMail(mailOptions); }
      console.log('Bug report received and saved to Firestore (email temporarily disabled):', { bugTitle, bugDescription, bugCategory, bugPriority, userEmail });
      
      // Log the bug report to Firestore for record keeping and analytics
      try {
        await db.collection('bugReports').add({
          title: bugTitle,
          description: bugDescription,
          category: bugCategory,
          priority: bugPriority,
          userEmail: userEmail || null,
          userId: userId || null,
          userName: userName || null,
          userAgent: userAgent || null,
          currentUrl: currentUrl || null,
          reproductionSteps: reproductionSteps || null,
          expectedBehavior: expectedBehavior || null,
          actualBehavior: actualBehavior || null,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          status: 'reported',
          emailSent: false
        });
      } catch (firestoreError) {
        console.error('Error logging bug report to Firestore:', firestoreError);
        // Don't fail the request if Firestore logging fails
      }

      res.status(200).json({
        success: true,
        message: 'Thank you for the bug report! We\'ve received your report and saved it to our database. We\'ll investigate this issue promptly.'
      });

    } catch (error) {
      console.error('Error sending bug report:', error);
      res.status(500).json({
        success: false,
        message: 'Sorry, there was an error submitting your bug report. Please try again later or email us directly.'
      });
    }
  });
});

// Initialize with some sample data
exports.initializeNewsData = functions.https.onRequest(async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const uid = await requireAdmin(req, res);
      if (!uid) return;
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

// Export YouTube functions
const youtubeTranscript = require('./youtubeTranscript');
exports.extractYouTubeTranscript = youtubeTranscript.extractYouTubeTranscript;
exports.getYouTubeMetadata = youtubeTranscript.getYouTubeMetadata;
exports.generateContentFromTranscript = youtubeTranscript.generateContentFromTranscript; 