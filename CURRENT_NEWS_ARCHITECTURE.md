# 📰 Current News Architecture - IMPORTANT REFERENCE

## 🎯 **Current State (After Consolidation)**

### ✅ **Active News Implementation**
- **Primary Location**: `src/pages/Dashboard.js` (Dashboard)
- **News Section**: Lines ~950-1000 in Dashboard.js  
- **Route**: `/` (main dashboard) - users see news as part of dashboard
- **Service**: `src/services/newsService.js` (shared service)

### ❌ **Legacy Pages (DO NOT EDIT)**
- **`src/pages/AiNews.js`**: LEGACY - Admin-only route (/ai-news) for testing
- **`src/pages/Home.js`**: LEGACY - May be old dashboard version
- **Route `/ai-news`**: Admin-only testing route, not user-facing

## 🚨 **CRITICAL REMINDERS**

### For AI Assistant/Developer:
1. **ONLY edit news functionality in `src/pages/Dashboard.js`**
2. **DO NOT edit `src/pages/AiNews.js`** - it's legacy/admin-only
3. **News is part of the dashboard, not a separate page**
4. **Users access news via `/` (Dashboard.js), not `/ai-news`**

### News Flow:
```
User visits / → Dashboard.js → News section (lines ~950-1000) → newsService.js
```

### Admin Flow:
```
Admin visits /ai-news → AiNews.js (testing only, not user-facing)
```

## 📍 **Key Code Locations**

### News Display (User-Facing)
- **File**: `src/pages/Dashboard.js`
- **Section**: "Latest AI News" around line 950
- **Function**: Uses `getAINewsPage()` from newsService

### News Service (Shared)
- **File**: `src/services/newsService.js`
- **Purpose**: Fetches news from Firestore, handles pagination
- **Used by**: Dashboard.js (dashboard) and AiNews.js (admin testing)

### Backend (Cloud Functions)
- **File**: `functions/index.js`
- **Functions**: `updateAINewsScheduled`, `updateAINewsManual`
- **Purpose**: Fetches news from RSS feeds, saves to Firestore

## 🔧 **When Making News Changes**

### ✅ **DO**
- Edit news UI in `Dashboard.js`
- Modify news service in `newsService.js`
- Update Cloud Functions in `functions/index.js`
- Test changes on dashboard at `/`

### ❌ **DON'T**
- Edit `AiNews.js` for user-facing changes
- Create separate news pages
- Break the dashboard integration

## 📝 **Update History**
- **Before**: Separate news page at `/ai-news`
- **After**: News integrated into dashboard at `/`
- **Legacy**: `/ai-news` kept for admin testing only
- **Current**: All user news functionality in Dashboard.js dashboard

---

**Last Updated**: Current session
**Purpose**: Prevent confusion about which files to edit for news functionality
