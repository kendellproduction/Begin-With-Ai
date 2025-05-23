# Firebase Security Rules

Copy and paste these rules into your Firebase Console > Firestore Database > Rules section.

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write only their own data
    match /userStats/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId && 
                     request.resource.data.xp is number && 
                     request.resource.data.level is number &&
                     request.resource.data.completedLessons is list;
    }
    
    // For code submissions, similar rules apply
    match /codeSubmissions/{submissionId} {
      allow read, update, delete: if request.auth != null && 
                                   request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                     request.resource.data.userId == request.auth.uid &&
                     request.resource.data.code is string &&
                     request.resource.data.lessonId is string;
    }
    
    // For user profiles
    match /userProfiles/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Lesson content could be publicly readable but only admins can modify
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if false; // Only via admin console or backend
    }
    
    // Quiz content similar to lessons
    match /quizzes/{quizId} {
      allow read: if request.auth != null;
      allow write: if false; // Only via admin console or backend
    }
    
    // Quiz results for users
    match /quizResults/{resultId} {
      allow read, update, delete: if request.auth != null && 
                                   request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                     request.resource.data.userId == request.auth.uid;
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

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