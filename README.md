# BeginningWithAi - AI Learning Platform

BeginningWithAi is an interactive learning platform that teaches users about AI through adaptive lessons, hands-on coding exercises, and real-time AI-powered feedback. Users learn by building projects like Pac-Man games and data analyzers while receiving personalized guidance.

## 🚀 Features

- **Adaptive Learning System**: Skill assessment that personalizes lesson difficulty
- **Interactive AI Sandbox**: Real-time code execution with AI feedback
- **10+ Comprehensive Lessons**: From AI fundamentals to practical applications
- **Gamification**: XP, levels, badges, and streaks to keep users engaged
- **Secure Authentication**: Google, Apple, and email/password options
- **Progress Tracking**: Complete learning path management
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, React Router
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **AI Integration**: OpenAI API, xAI Grok API
- **Payment Processing**: Stripe (ready for premium features)
- **Security**: Firebase Security Rules, input sanitization

## 📋 Prerequisites

- Node.js 16+ and npm
- Firebase project with Firestore enabled
- OpenAI API key
- (Optional) xAI and Anthropic API keys for enhanced features

## 🔧 Environment Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd BeginningWithAi
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Firebase Configuration
# Get these from Firebase Console > Project Settings > General
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# OpenAI API Configuration
# Get from https://platform.openai.com/api-keys
REACT_APP_OPENAI_API_KEY=sk-your_openai_api_key_here

# Optional: Additional AI Providers
REACT_APP_XAI_API_KEY=your_xai_api_key_here
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 3. Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project with Analytics enabled

2. **Enable Services**:
   - Authentication: Google, Apple, Email/Password
   - Firestore Database: Start in test mode
   - Hosting: Enable for deployment

3. **Deploy Security Rules**:
   ```bash
   # Copy rules from firebase-security-rules.md
   # Deploy via Firebase Console > Firestore > Rules
   ```

### 4. Database Seeding

```bash
npm start
# Navigate to the app
# Use the blue "Adaptive Database Seeder" button
# Click "Seed Database" to populate lessons
```

## 🚀 Development

### Available Scripts

- **`npm start`**: Development server (http://localhost:3000)
- **`npm test`**: Run test suite
- **`npm run build`**: Production build
- **`npm run analyze`**: Bundle size analysis

### Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── slides/       # Lesson slide components
│   └── ProtectedRoute.js
├── contexts/         # React contexts (Auth, Gamification)
├── data/            # Static data and lesson content
├── hooks/           # Custom React hooks
├── lessons/         # Lesson-specific components
├── pages/           # Main page components
├── services/        # API and business logic
├── scripts/         # Utility scripts
└── utils/           # Helper functions
```

## 🔒 Security Features

- **Firebase Security Rules**: User data isolation and validation
- **API Rate Limiting**: 10 prompts/minute, 100/hour per user
- **Input Sanitization**: Prevents XSS and injection attacks
- **Secure Authentication**: Email verification required
- **Environment Variables**: No secrets in client code

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication Flow**:
   ```bash
   # Test each auth method
   - Google Sign-In
   - Apple Sign-In  
   - Email/Password Registration
   - Email Verification
   ```

2. **Core User Journey**:
   ```bash
   # Complete user flow
   - Sign up → Email verification
   - Take adaptive assessment
   - Complete a full lesson
   - Verify XP/level progression
   - Test AI sandbox functionality
   ```

3. **Mobile Testing**:
   ```bash
   # Test responsive design
   - iPhone/Android Chrome
   - Tablet layouts
   - Touch interactions
   ```

### Automated Testing

```bash
# Run unit tests
npm test

# Run specific test suite
npm test -- --testNamePattern="Auth"

# Generate coverage report
npm test -- --coverage
```

## 📊 Monitoring & Analytics

### Error Tracking (Sentry)

```bash
npm install @sentry/react @sentry/tracing
```

Add to `src/index.js`:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### User Analytics

```bash
npm install @google-analytics/gtag
```

### Performance Monitoring

- Firebase Performance SDK already integrated
- Use Chrome DevTools Lighthouse for audits
- Monitor Core Web Vitals

## 🚀 Deployment

### Firebase Hosting

```bash
# Build and deploy
npm run build
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
```

### Environment-Specific Deploys

```bash
# Staging
firebase use staging
firebase deploy

# Production  
firebase use production
firebase deploy
```

### Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test authentication flows
- [ ] Confirm AI sandbox functionality
- [ ] Check Firebase security rules
- [ ] Monitor error rates and performance

## 🔧 Troubleshooting

### Common Issues

1. **Firebase Auth Errors**:
   ```bash
   # Check domain configuration in Firebase Console
   # Ensure authorized domains include your deployment URL
   ```

2. **API Rate Limits**:
   ```bash
   # Monitor usage in Firebase Console
   # Check OpenAI API usage dashboard
   ```

3. **Build Failures**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Mode

```bash
# Enable debug logging
REACT_APP_DEBUG=true npm start
```

## 📝 API Documentation

### Sandbox API

The AI sandbox supports multiple providers with automatic failover:

```javascript
// Primary: OpenAI GPT-4
// Fallback: xAI Grok, Anthropic Claude

Rate Limits:
- 10 prompts per minute per user
- 100 prompts per hour per user
- 1000 character limit per prompt
```

### Firestore Data Structure

```
users/{userId}
├── profile: { email, displayName, emailVerified }
├── stats: { xp, level, completedLessons }
├── progress: { lessonId: { completed, score, timeSpent } }
└── badges: { badgeId: { earned, earnedAt } }

learningPaths/{pathId}
├── modules/{moduleId}
└── lessons/{lessonId}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: Check `/docs` directory for detailed guides
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discord**: [Community Discord Server](your-discord-link)
- **Email**: support@beginningwithai.com

---

**Ready to launch!** 🚀 This platform provides everything needed for users to learn AI through hands-on, interactive experiences.
