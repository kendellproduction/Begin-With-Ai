# Environment Setup for BeginningWithAi

## Required Environment Variables

Copy your `.env.local.example` to `.env.local` and add these values:

### Firebase Configuration
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### AI API Keys for Sandbox Functionality

#### Primary Provider (Recommended)
```
REACT_APP_XAI_API_KEY=your_xai_grok_api_key_here
```

#### Fallback Providers (Optional but Recommended)
```
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

#### Development Settings
```
REACT_APP_ENVIRONMENT=development
REACT_APP_ENABLE_DEV_TOOLS=true
```

## Getting API Keys

### xAI Grok API
1. Go to [https://console.x.ai/](https://console.x.ai/)
2. Sign up or log in
3. Create a new API key
4. Copy the key to `REACT_APP_XAI_API_KEY`

### OpenAI API (Fallback)
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Copy the key to `REACT_APP_OPENAI_API_KEY`

### Anthropic API (Fallback)
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Generate an API key
3. Copy the key to `REACT_APP_ANTHROPIC_API_KEY`

## Security Notes

- **Never commit API keys to version control**
- Use different keys for development and production
- Monitor API usage and set up billing alerts
- Rotate keys regularly
- The sandbox service includes rate limiting to prevent abuse

## Rate Limits

The sandbox service automatically enforces:
- 10 prompts per minute per user
- 100 prompts per hour per user
- 2000 character limit per prompt
- 4000 character limit per response

## Testing the Setup

1. Start the development server: `npm start`
2. Use the "Adaptive Database Seeder" in the bottom-right corner
3. Click "Seed Adaptive Lessons" to populate the database
4. Navigate to `/learning-path/adaptive-quiz` to test the new flow 