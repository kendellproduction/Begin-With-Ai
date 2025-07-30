# 🚀 BeginningWithAi Current Tasks

This is the focused task list for immediate priorities.

## 🔴 Current Priority: Phase 2 - UI/UX Improvements

### Priority 4: Fix Lesson Viewer Display Issues
- [ ] **Header text display**: Fix the lesson title and description not showing properly
- [ ] **Top button cutoff**: Identify and fix the partially cut-off button at the top
- [ ] **Content rendering**: Ensure H1 headers and other content blocks display correctly
- [ ] **Layout spacing**: Improve spacing between elements for better readability

### Priority 5: Enhanced Podcast Block Design
- [ ] **Podcast block styling**: Create colorful shadow effects and glowing appearance
- [ ] **Color customization**: Add color picker for podcast block backgrounds
- [ ] **Visual effects**: Implement CSS for vibrant, glowing shadows
- [ ] **Admin controls**: Add podcast block color editing in UnifiedLessonBuilder

### Priority 6: Publish/Unpublish Workflow
- [ ] **Publish toggle**: Ensure publish/unpublish button works correctly
- [ ] **Status indicators**: Add clear visual indicators for draft vs published status
- [ ] **Instant updates**: When toggling publication, lesson cards should appear/disappear immediately
- [ ] **Admin feedback**: Provide clear success/error messages for publication actions

## 🟠 Previous Priority: Lesson System Fixes (Phase 1)

### Fix Static vs Dynamic Lesson Loading Issue
The main issue is that lessons are showing static hardcoded content instead of loading from the database where admin edits are made. We need to remove all static content and make the lesson workflow work properly.

- [ ] **Remove All Static Lesson Content**
  - Delete/clean out static lesson data from files like `src/utils/historyOfAiLesson.js` and `src/utils/adaptiveLessonData.js`
  - Remove all static lesson imports and references

- [ ] **Update Lesson Viewers to Only Use Database**
  - In `LessonViewer.js`, `ModernLessonViewer.js`, `SynchronizedLessonViewer.js` remove all static fallback code
  - Ensure viewers only load from Firestore, with proper "lesson not found" error handling
  - No more fallbacks to static content

- [ ] **Fix Lesson Cards Dynamic Updates**
  - Ensure lessons page automatically shows new lesson cards when lessons are created in admin
  - Make lesson title/description updates in admin immediately reflect on lesson cards
  - Test that lesson cards load from Firestore, not static data

- [ ] **Test Complete Lesson Workflow**
  - Create lesson in admin panel → Should see new card on lessons page immediately
  - Edit lesson title/content in admin → Should see updates on lesson cards immediately  
  - Click lesson card → Should open lesson with current database content
  - This entire workflow should work like you'd expect it to

- [ ] **Fix Preview Functionality**
  - Make preview buttons in admin panel actually open and display current lesson data
  - Add preview mode flag to viewers to show draft/unpublished content

- [ ] **Implement Podcast Audio Handling**
  - Add 'podcast' block type in UnifiedLessonBuilder.js with Firebase Storage upload
  - Update lesson viewers to load and play audio from Storage URLs
  - Document the upload process for future use

## 🟡 Next Priority: Core Stability

- [ ] **Remove Console Logs**
  - Clean up debug console.log statements from production code
  - Focus on `src/firebase.js` and `src/contexts/AuthContext.js`

- [ ] **Error Handling**
  - Add user-friendly error messages for lesson loading failures
  - Handle cases where Firestore is unavailable

## 🟢 Future Tasks (Lower Priority)

- [ ] Migrate from CRA to Vite for better performance
- [ ] Set up ESLint for code quality
- [ ] Implement route-based code splitting with React.lazy()
- [ ] Add comprehensive testing suite
- [ ] Mobile optimization and PWA enhancements
- [ ] Create more complete lessons for full learning paths
- [ ] Implement cost monitoring for AI services
- [ ] Add gamification features (leaderboards, achievements)

---

## 📝 Notes

- **Current Focus**: UI/UX improvements for lesson viewer display, podcast blocks, and publish workflow
- **Previous**: Lesson system loading from database (should be working)
- **Next**: Core stability improvements
- **Future**: Performance and feature enhancements come after core functionality is solid