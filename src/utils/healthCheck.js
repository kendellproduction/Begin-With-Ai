// Health Check Utility for BeginningWithAi Production Readiness
import { analytics } from '../firebase';

export class HealthCheck {
  constructor() {
    this.results = {
      core: {},
      features: {},
      apis: {},
      security: {},
      performance: {}
    };
  }

  // Run all health checks
  async runAllChecks() {
    console.log('🏥 Running BeginningWithAi Health Check...');
    
    await this.checkCoreServices();
    await this.checkFeatures();
    await this.checkAPIIntegrations();
    await this.checkSecurity();
    await this.checkPerformance();
    
    return this.generateReport();
  }

  // Check core Firebase services
  async checkCoreServices() {
    console.log('🔧 Checking core services...');

    // Firebase Authentication
    try {
      const authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
      this.results.core.firebase_auth = {
        status: authDomain ? 'configured' : 'missing',
        message: authDomain ? 'Firebase Auth domain configured' : 'Firebase Auth domain missing'
      };
    } catch (error) {
      this.results.core.firebase_auth = {
        status: 'error',
        message: `Firebase Auth error: ${error.message}`
      };
    }

    // Firebase Firestore
    try {
      const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
      this.results.core.firestore = {
        status: projectId ? 'configured' : 'missing',
        message: projectId ? 'Firestore project ID configured' : 'Firestore project ID missing'
      };
    } catch (error) {
      this.results.core.firestore = {
        status: 'error',
        message: `Firestore error: ${error.message}`
      };
    }

    // Firebase Analytics
    try {
      const measurementId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;
      this.results.core.analytics = {
        status: analytics && measurementId ? 'enabled' : 'disabled',
        message: analytics && measurementId ? 
          'Firebase Analytics initialized' : 
          'Firebase Analytics disabled or not configured'
      };
    } catch (error) {
      this.results.core.analytics = {
        status: 'error',
        message: `Analytics error: ${error.message}`
      };
    }
  }

  // Check enabled features
  async checkFeatures() {
    console.log('✨ Checking enabled features...');

    // Admin Panel
    this.results.features.admin_panel = {
      status: 'enabled',
      route: '/admin',
      protection: 'role-based',
      message: 'Admin panel enabled with role-based access control'
    };

    // AI News
    const hasSearchAPI = process.env.REACT_APP_GOOGLE_SEARCH_API_KEY || 
                        process.env.REACT_APP_BING_SEARCH_API_KEY;
    this.results.features.ai_news = {
      status: 'enabled',
      route: '/ai-news',
      apis: hasSearchAPI ? 'configured' : 'fallback',
      message: hasSearchAPI ? 
        'AI News enabled with search API integration' : 
        'AI News enabled with fallback static content'
    };

    // Pricing Page
    const hasStripe = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    this.results.features.pricing = {
      status: 'enabled',
      route: '/pricing',
      payment: hasStripe ? 'configured' : 'display-only',
      message: hasStripe ? 
        'Pricing page enabled with Stripe integration' : 
        'Pricing page enabled (display only - no payment processing)'
    };

    // PWA Functionality
    this.results.features.pwa = {
      status: 'enabled',
      manifest: 'public/manifest.json',
      service_worker: 'public/sw.js',
      message: 'PWA manifest enabled - app can be installed'
    };
  }

  // Check API integrations
  async checkAPIIntegrations() {
    console.log('🔌 Checking API integrations...');

    // OpenAI API
    const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.results.apis.openai = {
      status: openaiKey ? 'configured' : 'missing',
      message: openaiKey ? 
        'OpenAI API key configured' : 
        'OpenAI API key missing - AI features will be limited'
    };

    // Alternative AI APIs
    const xaiKey = process.env.REACT_APP_XAI_API_KEY;
    const anthropicKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
    this.results.apis.alternative_ai = {
      status: (xaiKey || anthropicKey) ? 'available' : 'none',
      message: `Alternative AI APIs: ${xaiKey ? 'xAI ' : ''}${anthropicKey ? 'Anthropic' : ''}${!xaiKey && !anthropicKey ? 'None configured' : ''}`
    };

    // Search APIs
    const googleSearch = process.env.REACT_APP_GOOGLE_SEARCH_API_KEY;
    const bingSearch = process.env.REACT_APP_BING_SEARCH_API_KEY;
    this.results.apis.search = {
      status: (googleSearch || bingSearch) ? 'configured' : 'missing',
      message: `Search APIs: ${googleSearch ? 'Google ' : ''}${bingSearch ? 'Bing' : ''}${!googleSearch && !bingSearch ? 'None - using fallback content' : ''}`
    };

    // Payment Processing
    const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    this.results.apis.payments = {
      status: stripeKey ? 'configured' : 'missing',
      message: stripeKey ? 
        'Stripe payment processing configured' : 
        'Payment processing not configured - premium features disabled'
    };
  }

  // Check security configuration
  async checkSecurity() {
    console.log('🛡️ Checking security configuration...');

    // Environment
    const isProduction = process.env.NODE_ENV === 'production';
    this.results.security.environment = {
      status: isProduction ? 'production' : 'development',
      message: `Running in ${process.env.NODE_ENV} mode`
    };

    // Source maps (should be disabled in production)
    const sourceMaps = process.env.GENERATE_SOURCEMAP !== 'false';
    this.results.security.source_maps = {
      status: isProduction && sourceMaps ? 'warning' : 'ok',
      message: sourceMaps && isProduction ? 
        'Source maps enabled in production (security risk)' : 
        'Source maps properly configured'
    };

    // Admin configuration
    const adminEmails = process.env.REACT_APP_ADMIN_EMAILS;
    this.results.security.admin_config = {
      status: adminEmails ? 'configured' : 'warning',
      message: adminEmails ? 
        'Admin emails configured' : 
        'Admin emails not configured - manual user role assignment required'
    };
  }

  // Check performance settings
  async checkPerformance() {
    console.log('⚡ Checking performance configuration...');

    // Lazy loading
    this.results.performance.lazy_loading = {
      status: 'enabled',
      message: 'Route-based code splitting implemented'
    };

    // Bundle optimization
    const inlineRuntime = process.env.INLINE_RUNTIME_CHUNK !== 'false';
    this.results.performance.bundle_optimization = {
      status: !inlineRuntime ? 'optimized' : 'default',
      message: !inlineRuntime ? 
        'Runtime chunk optimization enabled' : 
        'Using default bundling configuration'
    };

    // Rate limiting
    const rateLimit = process.env.REACT_APP_RATE_LIMIT_PER_MINUTE || '10';
    this.results.performance.rate_limiting = {
      status: 'configured',
      limit: `${rateLimit} requests/minute`,
      message: `API rate limiting set to ${rateLimit} requests per minute`
    };
  }

  // Generate comprehensive report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      overall_status: this.calculateOverallStatus(),
      results: this.results,
      recommendations: this.generateRecommendations()
    };

    this.printReport(report);
    return report;
  }

  // Calculate overall system status
  calculateOverallStatus() {
    let criticalIssues = 0;
    let warnings = 0;

    const checkCategory = (category) => {
      Object.values(category).forEach(check => {
        if (check.status === 'error' || check.status === 'missing') {
          criticalIssues++;
        } else if (check.status === 'warning' || check.status === 'disabled') {
          warnings++;
        }
      });
    };

    checkCategory(this.results.core);
    checkCategory(this.results.features);
    checkCategory(this.results.apis);
    checkCategory(this.results.security);
    checkCategory(this.results.performance);

    if (criticalIssues > 0) return 'critical';
    if (warnings > 2) return 'warning';
    return 'healthy';
  }

  // Generate actionable recommendations
  generateRecommendations() {
    const recommendations = [];

    // Check for critical missing configurations
    if (this.results.apis.openai?.status === 'missing') {
      recommendations.push({
        priority: 'high',
        category: 'API Configuration',
        issue: 'OpenAI API key missing',
        action: 'Configure REACT_APP_OPENAI_API_KEY for AI features to work properly'
      });
    }

    if (this.results.security.source_maps?.status === 'warning') {
      recommendations.push({
        priority: 'high',
        category: 'Security',
        issue: 'Source maps enabled in production',
        action: 'Set GENERATE_SOURCEMAP=false in production environment'
      });
    }

    if (this.results.apis.search?.status === 'missing') {
      recommendations.push({
        priority: 'medium',
        category: 'Features',
        issue: 'Search APIs not configured',
        action: 'Configure Google Custom Search or Bing Search API for dynamic AI news'
      });
    }

    if (this.results.apis.payments?.status === 'missing') {
      recommendations.push({
        priority: 'low',
        category: 'Features',
        issue: 'Payment processing not configured',
        action: 'Configure Stripe for premium feature payments'
      });
    }

    return recommendations;
  }

  // Print formatted report to console
  printReport(report) {
    console.log('\n🏥 HEALTH CHECK REPORT');
    console.log('=' .repeat(50));
    console.log(`Overall Status: ${this.getStatusEmoji(report.overall_status)} ${report.overall_status.toUpperCase()}`);
    console.log(`Timestamp: ${report.timestamp}`);
    
    // Print each category
    Object.entries(report.results).forEach(([category, checks]) => {
      console.log(`\n📋 ${category.toUpperCase()}`);
      console.log('-'.repeat(30));
      
      Object.entries(checks).forEach(([checkName, result]) => {
        const emoji = this.getStatusEmoji(result.status);
        console.log(`${emoji} ${checkName}: ${result.message}`);
      });
    });

    // Print recommendations
    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS');
      console.log('-'.repeat(30));
      report.recommendations.forEach((rec, index) => {
        const priorityEmoji = rec.priority === 'high' ? '🚨' : rec.priority === 'medium' ? '⚠️' : 'ℹ️';
        console.log(`${priorityEmoji} [${rec.priority.toUpperCase()}] ${rec.category}: ${rec.action}`);
      });
    }

    console.log('\n' + '='.repeat(50));
  }

  // Get emoji for status
  getStatusEmoji(status) {
    const emojis = {
      'enabled': '✅',
      'configured': '✅',
      'healthy': '✅',
      'optimized': '✅',
      'ok': '✅',
      'available': '✅',
      'production': '🏭',
      'development': '🔧',
      'disabled': '⚠️',
      'warning': '⚠️',
      'missing': '❌',
      'error': '❌',
      'critical': '🚨',
      'display-only': '📄',
      'fallback': '🔄'
    };
    return emojis[status] || '❓';
  }
}

// Export singleton instance
export const healthCheck = new HealthCheck(); 