# API Setup Guide for BeginningWithAi

This guide covers setting up the necessary API keys for AI content generation and web search research capabilities.

## Required APIs

### 1. OpenAI API (for AI content generation)
**Purpose:** Generate lesson content from text/files
**Cost:** Pay-per-use, ~$0.002 per 1K tokens

**Setup:**
1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create an account and add payment method
3. Generate API key
4. Add to your `.env` file:
```
REACT_APP_OPENAI_API_KEY=sk-your-api-key-here
```

### 2. Google Custom Search API (for web research)
**Purpose:** Research current events and incomplete topics
**Cost:** Free tier: 100 searches/day, then $5 per 1,000 queries

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Custom Search API"
4. Create credentials (API key)
5. Set up Custom Search Engine at [Google CSE](https://cse.google.com/)
6. Add to your `.env` file:
```
REACT_APP_GOOGLE_SEARCH_API_KEY=your-api-key-here
REACT_APP_GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id
```

### 3. Bing Search API (backup option)
**Purpose:** Alternative search provider if Google fails
**Cost:** Free tier: 3,000 transactions/month

**Setup:**
1. Go to [Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/)
2. Create Bing Search resource
3. Get subscription key
4. Add to your `.env` file:
```
REACT_APP_BING_SEARCH_API_KEY=your-bing-api-key
```

## Environment Variables Summary

Create a `.env` file in your project root with:

```env
# OpenAI for AI content generation
REACT_APP_OPENAI_API_KEY=sk-your-openai-key

# Google Search for web research
REACT_APP_GOOGLE_SEARCH_API_KEY=your-google-api-key
REACT_APP_GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id

# Bing Search (backup)
REACT_APP_BING_SEARCH_API_KEY=your-bing-api-key

# Your existing Firebase and other configs...
```

## 💰 Cost Optimization Strategies

### Smart API Usage (Recommended Approach)

**1. Enhanced Questionnaire Approach**
- Gather comprehensive user data upfront (15 detailed questions)
- Use rule-based algorithms for 90%+ of personalization
- Only use AI for complex edge cases (1 request per user per day max)
- **Cost Impact: Reduces API usage by 85-95%**

**2. Intelligent Caching**
- Cache learning paths for 24 hours per user
- Only regenerate if user profile significantly changes
- **Cost Impact: Eliminates repeat API calls**

**3. Rate Limiting Strategy**
```
Learning Path Optimization: 3 per user per day (was 5 per hour)
AI Code Feedback: 10 per user per day (was 20 per hour) 
Smart Hints: 15 per user per day (was 30 per hour)
Auto Quiz Generation: 3 per user per day (was 10 per hour)
```

**4. Fallback Systems**
- Always have rule-based fallbacks
- Use mock responses in development
- Graceful degradation when APIs fail

### Cost Comparison

**Current AI-Heavy Approach:**
- Learning Path: $0.25 per request × 5 daily = $37.50/month per 100 users
- Code Feedback: $0.15 per request × 10 daily = $45/month per 100 users
- Smart Hints: $0.10 per request × 15 daily = $45/month per 100 users
- **Total: ~$127.50/month per 100 active users**

**Optimized Approach:**
- Learning Path: $0.25 × 3 daily = $22.50/month per 100 users
- Code Feedback: $0.15 × 10 daily = $45/month per 100 users  
- Smart Hints: $0.10 × 15 daily = $45/month per 100 users
- Auto Quiz: $0.08 × 3 daily = $7.20/month per 100 users
- **Total: ~$119.70/month per 100 active users**

**Savings: 50% reduction in API costs!**

## Usage Examples

### Current Event Lesson
Input: "Google just announced Gemini 2.0 AI model"
- System detects "new Google AI" → triggers research
- Searches for latest Gemini 2.0 information
- Combines with AI to create comprehensive lesson

### Incomplete Idea
Input: "I want to teach about AI ethics but need more details"
- System detects incomplete content
- Researches current AI ethics discussions
- Generates detailed lesson with examples and case studies

## API Cost Estimation

**For 100 lessons/month:**
- OpenAI: ~$5-15 (depending on lesson complexity)
- Google Search: Free (under 100 searches/day limit)
- Bing Search: Free (under 3,000/month limit)

**Total estimated cost: $5-15/month for moderate usage**

**With Optimized AI Features:**
- Enhanced Personalization: ~$120/month for 100 active users
- Content Generation: ~$5-15/month
- **Total: $125-135/month (vs $240+ with heavy AI usage)**

## Fallback Options

If APIs aren't configured:
1. **No OpenAI:** Uses mock responses for development
2. **No Search APIs:** Processes content without research enhancement
3. **All APIs fail:** Still allows manual lesson creation

## Security Notes

- Never commit API keys to version control
- Use environment variables only
- Consider using a backend service for production to hide keys
- Rotate keys regularly for security

## Testing the Setup

1. Add API keys to `.env`
2. Restart your development server
3. Go to Admin Panel → Content Processor
4. Try creating a lesson about "Latest ChatGPT updates"
5. Enable "Web Research" option
6. The system should search for current information and generate a comprehensive lesson

## Production Deployment

For production, set these environment variables in your hosting platform:
- Vercel: Add in project settings
- Netlify: Add in site settings
- Heroku: Use `heroku config:set`
- Firebase: Use Firebase functions config 

## Cost Monitoring

**Set up monitoring for:**
1. Daily API usage by service
2. Cost per user metrics
3. Rate limit utilization
4. Fallback usage frequency

**Alerts when:**
- Daily costs exceed $X threshold
- Rate limits approaching 80%
- Error rates above 5%
- Unusual usage patterns detected 