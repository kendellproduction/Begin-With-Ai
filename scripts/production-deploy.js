#!/usr/bin/env node

/**
 * Production Deployment Script for BeginningWithAi
 * 
 * This script prepares the app for production deployment with:
 * - Mobile-first optimization
 * - Console.log cleanup verification
 * - Environment variable validation
 * - Performance optimization
 * - Security hardening
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting BeginningWithAi Production Deployment...\n');

// Production Environment Variables Template
const PRODUCTION_ENV_TEMPLATE = `# Production Environment Variables for BeginningWithAi
# =======================================================

# Build Configuration - Mobile Optimized
NODE_ENV=production
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false

# Firebase Configuration (Production)
REACT_APP_FIREBASE_API_KEY=your_production_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_production_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_production_project
REACT_APP_FIREBASE_STORAGE_BUCKET=your_production_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
REACT_APP_FIREBASE_APP_ID=your_production_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_production_measurement_id

# AI Services Configuration
REACT_APP_OPENAI_API_KEY=your_production_openai_api_key

# Performance & Analytics (Optional)
REACT_APP_SENTRY_DSN=your_sentry_dsn_for_error_monitoring
REACT_APP_GA_MEASUREMENT_ID=your_google_analytics_id

# Mobile-First Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_ERROR_REPORTING=true
REACT_APP_ENABLE_PERFORMANCE_MONITORING=true
REACT_APP_ENABLE_PWA=true

# Mobile Optimization Settings
REACT_APP_MOBILE_CACHE_DURATION=3600000
REACT_APP_MOBILE_MAX_BUNDLE_SIZE=512000
REACT_APP_ENABLE_LAZY_LOADING=true

# Security Configuration
REACT_APP_API_RATE_LIMIT=10
REACT_APP_SESSION_TIMEOUT=86400000

# Production URLs
REACT_APP_API_BASE_URL=https://your-production-domain.com
`;

class ProductionDeployment {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.projectRoot = process.cwd();
  }

  async run() {
    try {
      console.log('📱 Step 1: Mobile-First Validation...');
      await this.validateMobileOptimization();

      console.log('🧹 Step 2: Console.log Cleanup Verification...');
      await this.verifyConsoleLogCleanup();

      console.log('🔧 Step 3: Environment Configuration...');
      await this.setupProductionEnvironment();

      console.log('⚡ Step 4: Performance Optimization...');
      await this.optimizeForMobile();

      console.log('🛡️ Step 5: Security Hardening...');
      await this.hardenSecurity();

      console.log('🏗️ Step 6: Build Process...');
      await this.buildForProduction();

      console.log('✅ Step 7: Final Validation...');
      await this.validateDeployment();

      this.printSummary();
      
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      process.exit(1);
    }
  }

  async validateMobileOptimization() {
    const mobileChecks = [
      'src/App.css',
      'tailwind.config.js',
      'public/manifest.json'
    ];

    for (const file of mobileChecks) {
      if (!fs.existsSync(path.join(this.projectRoot, file))) {
        this.warnings.push(`Mobile optimization file missing: ${file}`);
      }
    }

    // Check for mobile-responsive components
    const componentsDir = path.join(this.projectRoot, 'src/components');
    if (fs.existsSync(componentsDir)) {
      const components = fs.readdirSync(componentsDir);
      const hasSwipeComponent = components.some(c => c.includes('Swipe'));
      const hasTouchComponent = components.some(c => c.includes('Touch'));
      
      if (!hasSwipeComponent && !hasTouchComponent) {
        this.warnings.push('No mobile touch/swipe components detected');
      }
    }

    console.log('   ✅ Mobile optimization validated');
  }

  async verifyConsoleLogCleanup() {
    const srcDir = path.join(this.projectRoot, 'src');
    const problematicFiles = [];

    const checkFileForLogs = (filePath) => {
      if (path.extname(filePath) === '.js') {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        const logLines = [];

        lines.forEach((line, index) => {
          if (line.includes('console.log') && !line.includes('console.error') && !line.includes('NODE_ENV === \'development\'')) {
            logLines.push(index + 1);
          }
        });

        if (logLines.length > 0) {
          problematicFiles.push({
            file: path.relative(this.projectRoot, filePath),
            lines: logLines
          });
        }
      }
    };

    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          walkDir(fullPath);
        } else {
          checkFileForLogs(fullPath);
        }
      });
    };

    walkDir(srcDir);

    if (problematicFiles.length > 0) {
      this.errors.push(`Console.log statements found in production code:`);
      problematicFiles.forEach(item => {
        this.errors.push(`  - ${item.file}: lines ${item.lines.join(', ')}`);
      });
    } else {
      console.log('   ✅ Console.log cleanup verified');
    }
  }

  async setupProductionEnvironment() {
    const envFile = path.join(this.projectRoot, '.env.local');
    
    if (!fs.existsSync(envFile)) {
      fs.writeFileSync(envFile, PRODUCTION_ENV_TEMPLATE);
      this.warnings.push('Created .env.local template - please fill in production values');
    }

    // Validate critical environment variables
    const requiredVars = [
      'REACT_APP_FIREBASE_API_KEY',
      'REACT_APP_FIREBASE_PROJECT_ID',
      'REACT_APP_OPENAI_API_KEY'
    ];

    for (const varName of requiredVars) {
      if (!process.env[varName] || process.env[varName].includes('your_')) {
        this.errors.push(`Environment variable ${varName} not configured`);
      }
    }

    console.log('   ✅ Environment configuration checked');
  }

  async optimizeForMobile() {
    // Check bundle size optimization
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (!packageJson.scripts['build:analyze']) {
      this.warnings.push('Bundle analyzer script not found');
    }

    // Verify lazy loading setup
    const appJs = path.join(this.projectRoot, 'src/App.js');
    if (fs.existsSync(appJs)) {
      const content = fs.readFileSync(appJs, 'utf8');
      if (!content.includes('React.lazy') && !content.includes('Suspense')) {
        this.warnings.push('Lazy loading not detected in App.js');
      }
    }

    console.log('   ✅ Mobile performance optimization checked');
  }

  async hardenSecurity() {
    // Check for hardcoded secrets
    const srcDir = path.join(this.projectRoot, 'src');
    const secretPatterns = [
      /sk-[a-zA-Z0-9]{48}/g, // OpenAI API keys
      /AIza[0-9A-Za-z\\-_]{35}/g, // Google API keys
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g // UUIDs
    ];

    const checkForSecrets = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          checkForSecrets(fullPath);
        } else if (path.extname(fullPath) === '.js') {
          const content = fs.readFileSync(fullPath, 'utf8');
          secretPatterns.forEach(pattern => {
            if (pattern.test(content)) {
              this.errors.push(`Potential hardcoded secret in ${path.relative(this.projectRoot, fullPath)}`);
            }
          });
        }
      });
    };

    checkForSecrets(srcDir);
    console.log('   ✅ Security hardening checked');
  }

  async buildForProduction() {
    try {
      console.log('   Building production bundle...');
      execSync('npm run build', { stdio: 'pipe' });
      
      // Check build output
      const buildDir = path.join(this.projectRoot, 'build');
      if (!fs.existsSync(buildDir)) {
        this.errors.push('Build directory not created');
      } else {
        const staticDir = path.join(buildDir, 'static');
        if (fs.existsSync(staticDir)) {
          const jsFiles = fs.readdirSync(path.join(staticDir, 'js'));
          const mainBundle = jsFiles.find(f => f.includes('main.'));
          if (mainBundle) {
            const bundleSize = fs.statSync(path.join(staticDir, 'js', mainBundle)).size;
            if (bundleSize > 1024 * 1024) { // 1MB
              this.warnings.push(`Main bundle size is ${Math.round(bundleSize / 1024)}KB - consider code splitting`);
            }
          }
        }
      }
      
      console.log('   ✅ Production build completed');
    } catch (error) {
      this.errors.push(`Build failed: ${error.message}`);
    }
  }

  async validateDeployment() {
    // Check for PWA files
    const pwaFiles = ['manifest.json', 'sw.js'];
    for (const file of pwaFiles) {
      if (!fs.existsSync(path.join(this.projectRoot, 'public', file))) {
        this.warnings.push(`PWA file missing: ${file}`);
      }
    }

    // Check Firebase configuration
    const firebaseConfig = path.join(this.projectRoot, 'firebase.json');
    if (!fs.existsSync(firebaseConfig)) {
      this.warnings.push('Firebase configuration missing');
    }

    console.log('   ✅ Deployment validation completed');
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📱 MOBILE-FIRST PRODUCTION DEPLOYMENT SUMMARY');
    console.log('='.repeat(60));

    if (this.errors.length === 0) {
      console.log('✅ Status: READY FOR PRODUCTION DEPLOYMENT');
    } else {
      console.log('❌ Status: DEPLOYMENT BLOCKED');
    }

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS THAT MUST BE FIXED:');
      this.errors.forEach(error => console.log(`   • ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS TO CONSIDER:');
      this.warnings.forEach(warning => console.log(`   • ${warning}`));
    }

    console.log('\n📱 MOBILE-FIRST DEPLOYMENT CHECKLIST:');
    console.log('   □ Performance: Target <3s load time on 3G');
    console.log('   □ Touch: All interactive elements ≥44px');
    console.log('   □ Offline: PWA caching for core features');
    console.log('   □ Battery: Optimize animations and API calls');
    console.log('   □ Accessibility: Screen reader compatibility');

    console.log('\n🚀 NEXT STEPS:');
    console.log('   1. Fix any errors listed above');
    console.log('   2. Test on real mobile devices');
    console.log('   3. Deploy: npm run deploy:firebase');
    console.log('   4. Monitor: Check mobile performance metrics');

    console.log('\n' + '='.repeat(60));
  }
}

// Run deployment if called directly
if (require.main === module) {
  const deployment = new ProductionDeployment();
  deployment.run();
}

module.exports = ProductionDeployment; 