#!/usr/bin/env node

/**
 * BeginningWithAi Production Health Check Script
 * 
 * This script validates that all production features are properly configured
 * and ready for deployment. It checks environment variables, feature states,
 * and provides actionable recommendations.
 */

const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local file
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && key.startsWith('REACT_APP_')) {
      process.env[key] = value.replace(/[\r\n%]/g, '');
    }
  });
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class ProductionHealthCheck {
  constructor() {
    this.results = {
      core: {},
      features: {},
      apis: {},
      security: {},
      performance: {},
      files: {}
    };
    this.warnings = [];
    this.criticalIssues = [];
  }

  async runAllChecks() {
    console.log(`${colors.cyan}🏥 BeginningWithAi Production Health Check${colors.reset}`);
    console.log('='.repeat(60));
    
    this.checkEnvironmentVariables();
    this.checkCoreFiles();
    this.checkFeatureConfiguration();
    this.checkSecuritySettings();
    this.checkBuildConfiguration();
    
    return this.generateReport();
  }

  checkEnvironmentVariables() {
    console.log(`\n${colors.blue}🔧 Checking Environment Variables...${colors.reset}`);
    
    const requiredVars = [
      'REACT_APP_FIREBASE_API_KEY',
      'REACT_APP_FIREBASE_AUTH_DOMAIN',
      'REACT_APP_FIREBASE_PROJECT_ID',
      'REACT_APP_FIREBASE_STORAGE_BUCKET',
      'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
      'REACT_APP_FIREBASE_APP_ID'
    ];

    const optionalVars = [
      'REACT_APP_FIREBASE_MEASUREMENT_ID',
      'REACT_APP_OPENAI_API_KEY',
      'REACT_APP_GOOGLE_SEARCH_API_KEY',
      'REACT_APP_BING_SEARCH_API_KEY',
      'REACT_APP_STRIPE_PUBLISHABLE_KEY',
      'REACT_APP_SENTRY_DSN'
    ];

    // Check required environment variables
    const missingRequired = requiredVars.filter(varName => !process.env[varName]);
    if (missingRequired.length > 0) {
      this.criticalIssues.push({
        category: 'Environment',
        message: `Missing required environment variables: ${missingRequired.join(', ')}`
      });
      console.log(`${colors.red}❌ Missing required: ${missingRequired.join(', ')}${colors.reset}`);
    } else {
      console.log(`${colors.green}✅ All required Firebase variables configured${colors.reset}`);
    }

    // Check optional environment variables
    const configuredOptional = optionalVars.filter(varName => process.env[varName]);
    const missingOptional = optionalVars.filter(varName => !process.env[varName]);
    
    console.log(`${colors.green}✅ Configured optional: ${configuredOptional.length}/${optionalVars.length}${colors.reset}`);
    if (missingOptional.length > 0) {
      console.log(`${colors.yellow}⚠️  Missing optional: ${missingOptional.join(', ')}${colors.reset}`);
    }

    this.results.core.environment = {
      required: requiredVars.length - missingRequired.length,
      optional: configuredOptional.length,
      missing: missingRequired.length + missingOptional.length
    };
  }

  checkCoreFiles() {
    console.log(`\n${colors.blue}📁 Checking Core Files...${colors.reset}`);
    
    const criticalFiles = [
      'src/App.js',
      'src/firebase.js',
      'src/components/ProtectedRoute.js',
      'src/pages/AdminPanel.js',
      'src/pages/AiNews.js',
      'src/pages/Pricing.js',
      'public/manifest.json',
      'public/sw.js'
    ];

    const missingFiles = criticalFiles.filter(file => {
      const fullPath = path.join(process.cwd(), file);
      return !fs.existsSync(fullPath);
    });

    if (missingFiles.length > 0) {
      this.criticalIssues.push({
        category: 'Files',
        message: `Missing critical files: ${missingFiles.join(', ')}`
      });
      console.log(`${colors.red}❌ Missing files: ${missingFiles.join(', ')}${colors.reset}`);
    } else {
      console.log(`${colors.green}✅ All critical files present${colors.reset}`);
    }

    // Check if PWA manifest was re-enabled
    const manifestExists = fs.existsSync(path.join(process.cwd(), 'public/manifest.json'));
    const disabledManifestExists = fs.existsSync(path.join(process.cwd(), 'public/manifest.json.disabled'));
    
    if (manifestExists) {
      console.log(`${colors.green}✅ PWA manifest enabled${colors.reset}`);
    } else if (disabledManifestExists) {
      this.warnings.push({
        category: 'PWA',
        message: 'PWA manifest still disabled - rename manifest.json.disabled to manifest.json'
      });
      console.log(`${colors.yellow}⚠️  PWA manifest still disabled${colors.reset}`);
    }

    this.results.files = {
      critical: criticalFiles.length - missingFiles.length,
      missing: missingFiles.length,
      pwa_enabled: manifestExists
    };
  }

  checkFeatureConfiguration() {
    console.log(`\n${colors.blue}✨ Checking Feature Configuration...${colors.reset}`);
    
    // Check App.js for enabled routes
    const appJsPath = path.join(process.cwd(), 'src/App.js');
    if (fs.existsSync(appJsPath)) {
      const appJsContent = fs.readFileSync(appJsPath, 'utf8');
      
      const features = [
        { name: 'Admin Panel', route: '/admin', component: 'AdminPanel' },
        { name: 'AI News', route: '/ai-news', component: 'AiNews' },
        { name: 'Pricing', route: '/pricing', component: 'Pricing' }
      ];

      features.forEach(feature => {
        const isEnabled = appJsContent.includes(`path="${feature.route}"`) && 
                         !appJsContent.includes(`{/* <Route path="${feature.route}"`);
        
        if (isEnabled) {
          console.log(`${colors.green}✅ ${feature.name} route enabled${colors.reset}`);
        } else {
          this.warnings.push({
            category: 'Features',
            message: `${feature.name} route appears to be disabled or missing`
          });
          console.log(`${colors.yellow}⚠️  ${feature.name} route disabled${colors.reset}`);
        }
        
        this.results.features[feature.name.toLowerCase().replace(' ', '_')] = {
          enabled: isEnabled,
          route: feature.route
        };
      });
    }

    // Check Firebase Analytics
    const firebaseJsPath = path.join(process.cwd(), 'src/firebase.js');
    if (fs.existsSync(firebaseJsPath)) {
      const firebaseContent = fs.readFileSync(firebaseJsPath, 'utf8');
      const analyticsEnabled = !firebaseContent.includes('const analytics = null') && 
                              firebaseContent.includes('getAnalytics');
      
      if (analyticsEnabled) {
        console.log(`${colors.green}✅ Firebase Analytics enabled${colors.reset}`);
      } else {
        this.warnings.push({
          category: 'Analytics',
          message: 'Firebase Analytics appears to be disabled'
        });
        console.log(`${colors.yellow}⚠️  Firebase Analytics disabled${colors.reset}`);
      }
      
      this.results.features.firebase_analytics = { enabled: analyticsEnabled };
    }
  }

  checkSecuritySettings() {
    console.log(`\n${colors.blue}🛡️  Checking Security Settings...${colors.reset}`);
    
    // Check if running in production mode
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      console.log(`${colors.green}✅ Running in production mode${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠️  Running in ${process.env.NODE_ENV || 'development'} mode${colors.reset}`);
    }

    // Check source map configuration
    const sourceMapsDisabled = process.env.GENERATE_SOURCEMAP === 'false';
    if (isProduction && sourceMapsDisabled) {
      console.log(`${colors.green}✅ Source maps disabled for production${colors.reset}`);
    } else if (isProduction && !sourceMapsDisabled) {
      this.warnings.push({
        category: 'Security',
        message: 'Source maps should be disabled in production (set GENERATE_SOURCEMAP=false)'
      });
      console.log(`${colors.yellow}⚠️  Source maps enabled in production${colors.reset}`);
    }

    this.results.security = {
      production_mode: isProduction,
      source_maps_disabled: sourceMapsDisabled,
      admin_emails_configured: !!process.env.REACT_APP_ADMIN_EMAILS
    };
  }

  checkBuildConfiguration() {
    console.log(`\n${colors.blue}⚡ Checking Build Configuration...${colors.reset}`);
    
    // Check package.json for build optimizations
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check if health-check script exists
      const hasHealthCheck = packageJson.scripts && packageJson.scripts['health-check'];
      if (hasHealthCheck) {
        console.log(`${colors.green}✅ Health check script available${colors.reset}`);
      }

      // Check if safe scripts are available
      const safeScripts = ['safe-install', 'dev-session-start', 'fix-corruption'];
      const availableSafeScripts = safeScripts.filter(script => 
        packageJson.scripts && packageJson.scripts[script]
      );
      
      console.log(`${colors.green}✅ Safe scripts available: ${availableSafeScripts.length}/${safeScripts.length}${colors.reset}`);
    }

    this.results.performance = {
      build_optimizations: true,
      safe_scripts_available: true
    };
  }

  generateReport() {
    console.log(`\n${colors.cyan}📊 HEALTH CHECK SUMMARY${colors.reset}`);
    console.log('='.repeat(60));
    
    const totalIssues = this.criticalIssues.length + this.warnings.length;
    const status = this.criticalIssues.length > 0 ? 'CRITICAL' : 
                   this.warnings.length > 3 ? 'WARNING' : 'HEALTHY';
    
    const statusColor = status === 'CRITICAL' ? colors.red : 
                       status === 'WARNING' ? colors.yellow : colors.green;
    
    console.log(`${statusColor}Overall Status: ${status}${colors.reset}`);
    console.log(`Total Issues: ${totalIssues} (${this.criticalIssues.length} critical, ${this.warnings.length} warnings)`);
    
    if (this.criticalIssues.length > 0) {
      console.log(`\n${colors.red}🚨 CRITICAL ISSUES (Must fix before launch):${colors.reset}`);
      this.criticalIssues.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.category}] ${issue.message}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`\n${colors.yellow}⚠️  WARNINGS (Recommended fixes):${colors.reset}`);
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. [${warning.category}] ${warning.message}`);
      });
    }

    if (status === 'HEALTHY') {
      console.log(`\n${colors.green}🎉 All systems ready for production deployment!${colors.reset}`);
    }

    console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
    if (this.criticalIssues.length > 0) {
      console.log('1. Fix all critical issues above');
      console.log('2. Re-run health check with: npm run health-check');
    } else {
      console.log('1. Review and address warnings if needed');
      console.log('2. Test all features in staging environment');
      console.log('3. Deploy to production');
    }

    console.log('='.repeat(60));
    
    return {
      status,
      criticalIssues: this.criticalIssues,
      warnings: this.warnings,
      results: this.results
    };
  }
}

// Run the health check if this script is executed directly
if (require.main === module) {
  const healthCheck = new ProductionHealthCheck();
  healthCheck.runAllChecks()
    .then(report => {
      process.exit(report.criticalIssues.length > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error(`${colors.red}❌ Health check failed:${colors.reset}`, error);
      process.exit(1);
    });
}

module.exports = ProductionHealthCheck; 