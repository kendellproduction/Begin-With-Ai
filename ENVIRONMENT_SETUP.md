# Environment Setup Guide - BeginningWithAi

## Production Environment Configuration Template

Copy the following to your `.env.production` file and fill in your actual values:

```bash
# ==============================================
# BeginningWithAi Production Environment Template
# ==============================================
# NEVER commit actual API keys to version control!

# ==============================================
# FIREBASE CONFIGURATION (Required)
# ==============================================
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id_here
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# ==============================================
# AI SERVICE APIS (Choose at least one)
# ==============================================
# OpenAI API (Recommended - used for code feedback, quiz generation, smart hints)
REACT_APP_OPENAI_API_KEY=sk-your_openai_api_key_here

# Alternative AI APIs (Optional)
REACT_APP_XAI_API_KEY=your_xai_api_key_here
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# ==============================================
# SEARCH APIS (Optional - for AI news features)  
# ==============================================
# Google Custom Search (Optional - for news aggregation)
REACT_APP_GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
REACT_APP_GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

# Bing Search API (Alternative to Google Search)
REACT_APP_BING_SEARCH_API_KEY=your_bing_search_api_key_here

# ==============================================
# PAYMENT PROCESSING (Optional - for premium features)
# ==============================================
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here

# ==============================================
# MONITORING & ANALYTICS (Optional but recommended)
# ==============================================
REACT_APP_SENTRY_DSN=https://your_sentry_dsn_here
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ==============================================
# ENVIRONMENT SPECIFIC SETTINGS
# ==============================================
NODE_ENV=production
REACT_APP_RATE_LIMIT_PER_MINUTE=10
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_ERROR_REPORTING=true
REACT_APP_ENABLE_PREMIUM_FEATURES=false

# ==============================================
# ADMIN PANEL CONFIGURATION
# ==============================================
REACT_APP_ADMIN_EMAILS=admin@yourcompany.com,dev@yourcompany.com

# ==============================================
# SECURITY CONFIGURATION
# ==============================================
REACT_APP_CSP_ENABLED=true
REACT_APP_CORS_ORIGINS=https://yourproductiondomain.com

# ==============================================
# PERFORMANCE SETTINGS
# ==============================================
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false
```

## Feature-Specific Setup Requirements

### 1. Admin Panel Access
- **Route**: `/admin`
- **Requirements**: User must have `role: 'admin'` or `role: 'developer'` in Firestore
- **Security**: Protected by enhanced ProtectedRoute component
- **Access Denied**: Users without admin role are redirected to dashboard with error message

### 2. AI News Feature
- **Route**: `/ai-news`
- **Requirements**: 
  - At least one Search API (Google Custom Search or Bing)
  - OpenAI API for content processing
- **Optional**: Works with fallback static news if APIs unavailable
- **Performance**: Cached results to minimize API calls

### 3. Pricing Page
- **Route**: `/pricing`
- **Requirements**: 
  - Stripe configuration for payment processing
  - Premium feature flags properly configured
- **Integration**: Ready for Stripe payment integration

### 4. PWA Functionality
- **File**: `public/manifest.json` (now enabled)
- **Features**: 
  - Offline capabilities via service worker
  - App-like installation on mobile/desktop
  - Push notifications (when implemented)
- **Testing**: Use Chrome DevTools > Application > Manifest

### 5. Firebase Analytics
- **Status**: Re-enabled with proper error handling
- **Fallback**: App continues to work if analytics fails
- **Environment**: Only initializes in production by default
- **Development**: Can be enabled with proper measurement ID

## Critical Setup Steps

### 1. Firebase Security Rules
Ensure your Firestore rules include admin role checking:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin-only access
    match /adminData/{document=**} {
      allow read, write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'developer'];
    }
    
    // User profiles with role protection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'developer'];
    }
  }
}
```

### 2. Admin User Setup
To make a user an admin, manually update their Firestore document:

```javascript
// In Firestore console or via admin SDK
db.collection('users').doc('user_uid_here').update({
  role: 'admin'  // or 'developer'
});
```

### 3. API Rate Limiting
All AI services include built-in rate limiting:
- OpenAI: 10 requests per minute default
- Graceful degradation when limits exceeded
- User-friendly error messages

### 4. Error Monitoring
- **Development**: Console warnings and errors
- **Production**: Sentry integration recommended
- **User Experience**: Non-blocking error handling

## Testing Checklist

### Pre-Production Testing
- [ ] Test admin panel access with admin/non-admin users
- [ ] Verify AI News loads with and without API keys
- [ ] Test pricing page navigation and display
- [ ] Confirm PWA installation works on mobile
- [ ] Validate Firebase Analytics initialization
- [ ] Test error handling with missing environment variables
- [ ] Verify rate limiting doesn't break user experience

### Production Deployment
- [ ] All environment variables configured
- [ ] Firebase security rules deployed
- [ ] Admin users properly configured
- [ ] CDN and caching configured
- [ ] Error monitoring active
- [ ] Performance monitoring enabled

## Troubleshooting

### Common Issues

1. **Admin Panel Access Denied**
   - Check user's Firestore document for `role` field
   - Verify user is authenticated
   - Check Firebase security rules

2. **AI Features Not Working**
   - Verify API keys are correctly set
   - Check rate limiting status
   - Examine browser console for specific errors

3. **PWA Not Installing**
   - Ensure manifest.json is properly served
   - Check HTTPS requirement
   - Verify service worker registration

4. **Analytics Not Tracking**
   - Confirm REACT_APP_FIREBASE_MEASUREMENT_ID is set
   - Check that analytics initialization succeeded
   - Verify Firebase project analytics is enabled

For additional help, see the specific setup guides:
- FIREBASE_SETUP_GUIDE.md
- API_SETUP_GUIDE.md  
- SECURITY.md 