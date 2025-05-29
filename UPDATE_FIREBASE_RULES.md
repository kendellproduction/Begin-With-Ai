# 🔥 Firebase Rules Update Guide

## Step 1: Update Firebase Security Rules

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**: BeginningWithAi
3. **Navigate to Firestore Database** → **Rules** tab
4. **Replace the existing rules** with the updated rules from `firebase-security-rules.md`
5. **Click "Publish"** to save the changes

## Step 2: Seed the Database

1. **Refresh your app** (to ensure new rules are active)
2. **Click the blue seeder button** in bottom-right corner
3. **Click "Seed Adaptive Lessons"**
4. **Wait for success message** ✅

## Step 3: Secure for Production (IMPORTANT!)

After seeding is complete, update these specific rules to be read-only:

```rules
// Learning paths - read-only for production
match /learningPaths/{pathId} {
  allow read: if request.auth != null;
  allow write: if false; // ← Change this back to false
  
  match /modules/{moduleId} {
    allow read: if request.auth != null;
    allow write: if false; // ← Change this back to false
    
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if false; // ← Change this back to false
    }
  }
}
```

## Why This Process?

1. **Seeding Requires Write Access**: The seeder needs to create lesson documents
2. **Production Needs Read-Only**: After seeding, lessons should be protected
3. **Security First**: This ensures only you can seed, and users can't modify lessons

## Quick Copy-Paste Rules

### For Seeding (Temporary):
```
allow write: if request.auth != null;
```

### For Production (Permanent):
```
allow write: if false;
```

## Verification

After seeding, test that:
- ✅ Users can view lessons
- ✅ Users can complete lessons  
- ✅ Users cannot modify lesson content
- ✅ Seeding worked (10 lessons visible)

## Troubleshooting

**Error: "Permission denied"**
→ Make sure you updated ALL three `allow write` rules for learningPaths, modules, and lessons

**Error: "Still can't seed"**
→ Wait 1-2 minutes after publishing rules, then try again

**Error: "Rules not updating"**
→ Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R) 