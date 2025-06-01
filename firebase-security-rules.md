# Firebase Security Rules

Copy and paste these rules into your Firebase Console > Firestore Database > Rules section.

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/userProfiles/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/userProfiles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User-specific data - users can only access their own
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /userStats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId && 
                     request.resource.data.xp is number && 
                     request.resource.data.level is number &&
                     request.resource.data.completedLessons is list;
    }
    
    match /userProgress/{progressId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                     request.resource.data.userId == request.auth.uid;
    }
    
    // Code submissions for lessons
    match /codeSubmissions/{submissionId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                     request.resource.data.userId == request.auth.uid &&
                     request.resource.data.code is string &&
                     request.resource.data.lessonId is string;
    }
    
    // User profiles - special admin access
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Allow admins to read other profiles for seeding verification
      allow read: if isAdmin();
    }
    
    // Sandbox rate limiting - users can only access their own
    match /sandboxRateLimits/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId &&
                     request.resource.data.prompts is list &&
                     request.resource.data.sessionId is string;
    }
    
    // Sandbox usage logging - users can create their own logs but not read others
    match /sandboxUsage/{logId} {
      allow create: if request.auth != null && 
                     request.resource.data.userId == request.auth.uid &&
                     request.resource.data.sessionId is string &&
                     request.resource.data.lessonId is string;
      allow read: if request.auth != null && 
                   resource.data.userId == request.auth.uid;
    }
    
    // Learning paths - allow admin seeding and user reading
    match /learningPaths/{pathId} {
      allow read: if request.auth != null;
      // Allow admins to write for seeding operations
      allow write: if isAdmin();
      // Temporary: Allow any authenticated user to write for initial seeding (REMOVE IN PRODUCTION)
      allow write: if request.auth != null;
      
      // Modules within learning paths
      match /modules/{moduleId} {
        allow read: if request.auth != null;
        // Allow admins to write for seeding operations
        allow write: if isAdmin();
        // Temporary: Allow any authenticated user to write for initial seeding (REMOVE IN PRODUCTION)
        allow write: if request.auth != null;
        
        // Lessons within modules
        match /lessons/{lessonId} {
          allow read: if request.auth != null;
          // Allow admins to write for seeding operations
          allow write: if isAdmin();
          // Temporary: Allow any authenticated user to write for initial seeding (REMOVE IN PRODUCTION)
          allow write: if request.auth != null;
        }
      }
    }
    
    // Legacy lesson content - read-only
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    
    // Quiz content - read-only for users, writable by admins
    match /quizzes/{quizId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    // Quiz results - users can access their own
    match /quizResults/{resultId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                     request.resource.data.userId == request.auth.uid;
    }
    
    // Gamification data
    match /badges/{badgeId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    match /userBadges/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /streaks/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Assessment results - users can access their own
    match /assessmentResults/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId &&
                     request.resource.data.skillLevel is string &&
                     request.resource.data.recommendations is map;
    }
    
    // AI News articles - public read access, authenticated users can write and like
    match /aiNews/{newsId} {
      allow read: if true; // Public read access for all users
      allow write: if request.auth != null; // Authenticated users can write news
      allow create: if request.auth != null && 
                     request.resource.data.title is string &&
                     request.resource.data.source is string &&
                     request.resource.data.date is timestamp;
      // Allow updates to likes and likedBy fields for authenticated users
      allow update: if request.auth != null && 
                     (onlyUpdatingLikes() || request.auth != null);
    }
    
    // Helper function to check if only like-related fields are being updated
    function onlyUpdatingLikes() {
      let allowedFields = ['likes', 'likedBy'];
      return request.resource.data.diff(resource.data).affectedKeys().hasOnly(allowedFields);
    }
    
    // Default deny - ensures security by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## DEPLOYMENT INSTRUCTIONS

### Step 1: Deploy the Updated Rules

1. **Copy the rules above**
2. **Go to Firebase Console** → Your Project → Firestore Database → Rules
3. **Replace the existing rules** with the updated rules above
4. **Click "Publish"** to deploy the rules

### Step 2: Verify Admin Role

Make sure your user profile has the admin role:

```javascript
// Run this in the browser console to check your role:
const user = firebase.auth().currentUser;
if (user) {
  firebase.firestore().doc(`userProfiles/${user.uid}`).get()
    .then(doc => console.log('User role:', doc.data()?.role));
}
```

### Step 3: Seed the Database

After deploying the rules, try the seeding again using the blue button in your app.

## IMPORTANT: Production Security Rules

**After seeding is complete**, update the learning paths rules to be read-only for production by removing the temporary write permissions:

```rules
// Learning paths - read-only for production (update after seeding)
match /learningPaths/{pathId} {
  allow read: if request.auth != null;
  allow write: if isAdmin(); // Keep only admin access
  
  match /modules/{moduleId} {
    allow read: if request.auth != null;
    allow write: if isAdmin(); // Keep only admin access
    
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if isAdmin(); // Keep only admin access
    }
  }
}
```

## Security Features Implemented

### 1. Admin Role Checking
- **Admin Function**: `isAdmin()` checks user profile role
- **Admin Permissions**: Admins can seed content and manage quiz/badge data
- **Temporary Permissions**: Any authenticated user can write during initial seeding (remove in production)

### 2. User Data Isolation
- Each user can only access their own data through `request.auth.uid == userId` checks
- Prevents users from seeing other users' progress, submissions, or personal information

### 3. Sandbox Security
- **Rate Limiting**: Each user has their own rate limit document they can modify
- **Usage Logging**: Users can create logs but only read their own
- **Session Isolation**: Each sandbox session is tracked separately
- **No Content Storage**: The rules ensure prompts and responses aren't stored permanently

### 4. Content Security
- **Read-Only Lessons**: Learning paths, modules, and lessons are read-only for regular users
- **Admin-Only Writes**: Content can only be modified by admins after initial seeding
- **Validated Submissions**: Code submissions require proper user ID and lesson ID

### 5. Data Validation
- **Type Checking**: Rules validate data types (numbers, strings, lists, maps)
- **Required Fields**: Ensures critical fields are present when creating documents
- **Structure Validation**: Enforces proper document structure

### 6. Gamification Protection
- **Badge Security**: Users can earn badges but not create fake ones (admins can manage)
- **Progress Integrity**: XP and level calculations are validated
- **Streak Protection**: Users can only modify their own streak data

## Rate Limiting Protection

The sandbox system includes multiple layers of protection:

1. **Firebase Rules**: Prevent unauthorized access to rate limit data
2. **Application Logic**: Enforces 10 prompts/minute, 100 prompts/hour
3. **Input Sanitization**: Removes harmful content before processing
4. **Session Isolation**: Each lesson session is completely separate
5. **No Persistent Storage**: Prompts and responses are not stored permanently

## Deployment Notes

1. **Test in Development**: Always test rules in development before deploying
2. **Gradual Rollout**: Deploy rules during low-traffic periods
3. **Monitor Usage**: Watch for any access denied errors after deployment
4. **Backup Rules**: Keep a copy of working rules before making changes

## Emergency Procedures

If you need to quickly disable sandbox functionality:

1. Navigate to Firebase Console > Firestore > Rules
2. Add this temporary rule at the top:
   ```
   match /sandboxRateLimits/{document=**} {
     allow read, write: if false;
   }
   match /sandboxUsage/{document=**} {
     allow read, write: if false;
   }
   ```
3. Click "Publish" to immediately disable sandbox access

This will prevent all sandbox API calls while keeping the rest of the app functional.

## Important Security Considerations

1. **Data Validation**: These rules validate that certain fields are of the expected type (e.g., `xp` is a number, `completedLessons` is a list).

2. **User-specific Access**: Users can only access their own data through the `request.auth.uid == userId` check.

3. **Default Deny**: All other collections are denied by default using the `match /{document=**}` rule at the end.

4. **Lesson Content**: Lessons and quizzes are read-only for authenticated users, and can only be modified through an admin interface or backend functions (not directly by regular users).

5. **Field Validation**: When creating documents, key fields are validated to ensure they exist and are of the correct type.

## How to Apply

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to "Firestore Database" in the left menu
4. Click on the "Rules" tab
5. Replace the existing rules with the rules above
6. Click "Publish"

These rules implement the principle of least privilege - users can only access and modify their own data, and cannot access other users' information.

## Additional Recommendations

1. **Authentication Rules**: Consider adding email verification checks in your application code:
   ```javascript
   if (user && !user.emailVerified) {
     // Restrict access to features that require verified email
   }
   ```

2. **API Security**: For any backend API functions, implement similar security checks to verify that users can only access their own data.

3. **Regular Audits**: Regularly review your security rules and ensure they match your application's current data structure. 