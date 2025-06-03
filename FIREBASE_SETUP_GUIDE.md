# 🔥 Firebase Setup Guide - Fix Auth Domain Error

## Problem
Getting "Firebase: Error (auth/unauthorized-domain)" when trying to log in on mobile or web.

## Root Cause
The current domain is not authorized in Firebase Authentication settings.

## 🚀 Quick Fix Steps

### 1. Add Authorized Domains in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your BeginningWithAI project
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain** and add these domains one by one:

   **For Development:**
   - `localhost`
   - `localhost:3000`
   - `127.0.0.1`
   - `127.0.0.1:3000`

   **For Production:**
   - `beginningwithai.com`
   - `www.beginningwithai.com`
   - Your actual domain

5. Click **Save** after adding each domain

### 2. Environment Variables Setup

Create a `.env.local` file in your project root with:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Get Firebase Config Values

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click on your web app or **Add app** if none exists
4. Copy the config values from the Firebase SDK snippet

### 4. Restart Development Server

After adding domains and setting up environment variables:
```bash
npm start
```

## 🔧 Mobile-Specific Fixes

### Purple Line Issue - FIXED ✅
The purple line at the top of mobile pages has been fixed by:
- Updated `theme-color` meta tag
- Removed duplicate status bar meta tags  
- Added mobile-safe CSS for browser UI elements

### Mobile Auth Tips
- Make sure you're testing on the same domain that's authorized
- Clear browser cache if auth still fails
- Try signing in with Google on mobile

## 🚨 Common Issues & Solutions

### Issue: "Auth domain mismatch"
**Solution:** Double-check the `REACT_APP_FIREBASE_AUTH_DOMAIN` in your `.env.local` matches exactly what's in Firebase Console.

### Issue: "Network error" 
**Solution:** Check internet connection and Firebase project status.

### Issue: Still getting unauthorized domain
**Solution:** 
1. Wait 5-10 minutes after adding domains (Firebase can take time to propagate)
2. Hard refresh the browser (Cmd+Shift+R / Ctrl+Shift+R)
3. Check that you added the domain without `http://` or `https://` prefix

## ✅ Test Auth Working

After setup, test these features:
- [ ] Email/password sign in
- [ ] Google sign in  
- [ ] Sign up new account
- [ ] Password reset
- [ ] Mobile login (no purple line)

## 🆘 Still Having Issues?

1. Check Firebase Console → Authentication → Users (see if accounts are being created)
2. Check browser console for detailed error messages
3. Verify Firebase project is on Blaze plan if using external domains
4. Make sure Firebase Authentication is enabled in your project

---

**Need Help?** Check the Firebase Console error logs or contact support with your project ID and domain details. 