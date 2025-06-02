# Deploy BeginningWithAi to beginningwithai.com

## Hosting Options (Recommended: Firebase Hosting)

Since you're already using Firebase for backend services, **Firebase Hosting** is the best choice for seamless integration.

## Option 1: Firebase Hosting (Recommended) 🚀

### Step 1: Install Firebase Tools
```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Initialize Firebase Hosting
```bash
# In your project directory
firebase init hosting

# Select:
# ✓ Use an existing project
# ✓ Select your Firebase project (beginai1)
# ✓ Public directory: build
# ✓ Configure as single-page app: Yes
# ✓ Set up automatic builds with GitHub: Yes (optional)
# ✓ Overwrite build/index.html: No
```

### Step 3: Update firebase.json
```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/static/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public,max-age=31536000,immutable"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control", 
            "value": "public,max-age=31536000,immutable"
          }
        ]
      }
    ]
  }
}
```

### Step 4: Build and Deploy
```bash
# Build your React app
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Your app will be live at: https://your-project-id.web.app
```

### Step 5: Connect Custom Domain
```bash
# Add your custom domain
firebase hosting:sites:create beginningwithai

# Connect domain
firebase target:apply hosting production beginningwithai
firebase hosting:channel:deploy live --only hosting:production
```

**Or via Firebase Console:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Hosting
3. Click "Add custom domain"
4. Enter: `beginningwithai.com`
5. Follow DNS setup instructions

### Step 6: DNS Configuration

You'll need to add these DNS records to your domain registrar:

```
Type: A
Name: @ (or leave blank for root domain)
Value: 151.101.1.195
Value: 151.101.65.195

Type: CNAME  
Name: www
Value: beginningwithai.com
```

**For subdomains (optional):**
```
Type: CNAME
Name: app
Value: beginningwithai.com
```

### Step 7: SSL Certificate (Automatic)
Firebase automatically provisions SSL certificates for custom domains. It may take 24-48 hours to become active.

## Option 2: Vercel (Alternative) ⚡

Vercel offers excellent React deployment with zero configuration.

### Setup Vercel:
```bash
npm install -g vercel
vercel login
vercel

# Follow prompts:
# ✓ Link to existing project or create new
# ✓ Project name: beginningwithai
# ✓ Build command: npm run build
# ✓ Output directory: build
```

### Add Custom Domain:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → Settings → Domains
3. Add `beginningwithai.com`
4. Configure DNS as instructed

## Option 3: Netlify (Alternative) 🌐

### Deploy to Netlify:
```bash
npm install -g netlify-cli
netlify login
netlify init

# Or drag and drop your build folder to netlify.com
npm run build
# Upload the build/ folder
```

### Add Custom Domain:
1. Go to Netlify Dashboard → Site Settings → Domain Management
2. Add custom domain: `beginningwithai.com`
3. Configure DNS records as instructed

## Production Environment Setup

### Step 1: Create Production Environment Variables
```bash
# .env.production (create this file)
REACT_APP_FIREBASE_API_KEY=your_production_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=beginai1.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=beginai1
REACT_APP_FIREBASE_STORAGE_BUCKET=beginai1.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=943264382873
REACT_APP_FIREBASE_APP_ID=1:943264382873:web:4a0de8c0a84c6f39f2dd08
REACT_APP_FIREBASE_MEASUREMENT_ID=G-VMDG2D4EY2

# Production AI API Keys
REACT_APP_XAI_API_KEY=your_production_xai_key
REACT_APP_OPENAI_API_KEY=your_production_openai_key
REACT_APP_ANTHROPIC_API_KEY=your_production_anthropic_key

# Production settings
REACT_APP_ENVIRONMENT=production
REACT_APP_APP_URL=https://beginningwithai.com
```

### Step 2: Update package.json Scripts
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "build:production": "REACT_APP_ENV=production npm run build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "deploy": "npm run build && firebase deploy --only hosting",
    "deploy:production": "npm run build:production && firebase deploy --only hosting"
  }
}
```

## Security Checklist for Production

### Step 1: Update Firebase Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Learning paths are public read
    match /learningPaths/{pathId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.role == 'admin';
    }
    
    // User progress is private
    match /userProgress/{progressId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // AI News is public read, admin write
    match /aiNews/{newsId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.role == 'admin';
    }
  }
}
```

### Step 2: Content Security Policy
Add to your `public/index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' 
    https://www.googletagmanager.com 
    https://www.google-analytics.com
    https://pyodide-cdn2.iodide.io;
  style-src 'self' 'unsafe-inline' 
    https://fonts.googleapis.com;
  font-src 'self' 
    https://fonts.gstatic.com;
  connect-src 'self' 
    https://*.firebaseapp.com 
    https://*.googleapis.com
    https://api.x.ai
    https://api.openai.com
    https://api.anthropic.com;
  img-src 'self' data: https:;
  media-src 'self';
">
```

### Step 3: Environment Variable Security
```javascript
// src/config/environment.js
export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // ... other config
  },
  
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'https://beginningwithai.com',
    xaiKey: process.env.REACT_APP_XAI_API_KEY,
    // Note: Never expose private keys in frontend
  },
  
  features: {
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    debugging: process.env.NODE_ENV === 'development',
  }
};
```

## Continuous Deployment Setup

### GitHub Actions for Firebase Hosting:
```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage --watchAll=false
      
      - name: Build project
        run: npm run build
        env:
          REACT_APP_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          REACT_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          REACT_APP_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
          REACT_APP_FIREBASE_MEASUREMENT_ID: ${{ secrets.FIREBASE_MEASUREMENT_ID }}
          REACT_APP_XAI_API_KEY: ${{ secrets.XAI_API_KEY }}
      
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: beginai1
```

### Environment Secrets Setup:
1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`
   - `XAI_API_KEY`
   - `FIREBASE_SERVICE_ACCOUNT` (download from Firebase Console)

## Custom Domain Configuration

### DNS Records for beginningwithai.com:

#### At your domain registrar (GoDaddy, Namecheap, etc.):

**For Firebase Hosting:**
```
Type: A
Name: @
Value: 151.101.1.195

Type: A  
Name: @
Value: 151.101.65.195

Type: CNAME
Name: www
Value: beginningwithai.com
```

**For Vercel:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME
Name: www  
Value: cname.vercel-dns.com
```

**For Netlify:**
```
Type: CNAME
Name: @
Value: your-site-name.netlify.app

Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

## Performance Optimization

### Step 1: Build Optimizations
```json
// package.json
{
  "scripts": {
    "build": "react-scripts build && npm run build:analyze",
    "build:analyze": "npx webpack-bundle-analyzer build/static/js/*.js",
    "build:gzip": "gzip-size build/static/js/*.js build/static/css/*.css"
  }
}
```

### Step 2: Caching Strategy
```javascript
// src/sw.js (Service Worker)
const CACHE_NAME = 'beginningwithai-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

## Monitoring and Analytics

### Step 1: Google Analytics 4
```javascript
// src/utils/analytics.js
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

export const trackEvent = (eventName, parameters = {}) => {
  if (process.env.NODE_ENV === 'production') {
    logEvent(analytics, eventName, parameters);
  }
};

export const trackPageView = (pageName) => {
  trackEvent('page_view', {
    page_title: pageName,
    page_location: window.location.href
  });
};

export const trackLessonComplete = (lessonId) => {
  trackEvent('lesson_complete', {
    lesson_id: lessonId,
    timestamp: Date.now()
  });
};
```

### Step 2: Error Tracking (Optional - Sentry)
```bash
npm install @sentry/react

# Add to src/index.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Quick Deployment Commands

```bash
# One-time setup
git checkout -b production-deploy
npm install -g firebase-tools
firebase login
firebase init hosting

# Regular deployment
npm run build
firebase deploy --only hosting

# Or with GitHub Actions (automatic on push to main)
git add .
git commit -m "Deploy to production"
git push origin main
```

## Domain Verification

After DNS setup, verify your domain:

1. **Check DNS propagation**: https://dnschecker.org
2. **Test SSL certificate**: https://www.ssllabs.com/ssltest/
3. **Verify site**: https://search.google.com/search-console

## Success! 🎉

Once deployed, your BeginningWithAi app will be live at:
- **https://beginningwithai.com**
- **https://www.beginningwithai.com**

The deployment typically takes 5-15 minutes after DNS propagation (which can take up to 48 hours for new domains).

## Troubleshooting

### Common Issues:
1. **DNS not propagated**: Wait 24-48 hours
2. **SSL certificate pending**: Firebase automatically provisions SSL
3. **404 errors**: Check your rewrite rules in firebase.json
4. **Environment variables**: Ensure all REACT_APP_ prefixes are correct
5. **Build failures**: Check console logs and fix any linter errors

Your domain `beginningwithai.com` is perfect for this project! 🚀 