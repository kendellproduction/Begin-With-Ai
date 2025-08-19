# 🚀 BeginningWithAi Current Tasks

This is the focused task list for immediate priorities.

## 🔒 Backend Critical Issues & Easy Wins (Safe Batches)

These batches are ordered to minimize risk. Each batch ends with a verification pause before proceeding.

### Batch 1: Critical security hotfixes (stop-the-bleed)
- [x] Remove committed email credentials from `functions/index.js`
  - Acceptance: No secrets in repo; email creds loaded via secrets/config only; exposed Gmail App Password rotated
- [x] Lock down Firestore rules for `aiNews`
  - Acceptance: Admin-only create/update/delete of articles; users can only update `likes` and `likedBy`; deletes admin-only
- [x] Standardize admin role source across code and rules
  - Acceptance: Both Functions and Rules check the same path (choose `users/{uid}.role` or `userProfiles/{uid}.role`) and work for existing admins
- [x] Replace `require('node-fetch')` with global `fetch` in Functions (Node 18)
  - Acceptance: Functions deploy without module errors; news fetching still works

Verification pause: Deploy to staging, run `npm run health-check`, confirm app loads, news still reads, and likes still work.

### Batch 2: Secure endpoints and scheduling
- [ ] Require Firebase auth + admin role for `updateAINewsManual` and `initializeNewsData`
  - Acceptance: Unauthenticated/unauthorized requests get 401/403; admins succeed
- [ ] Restrict CORS to prod/staging origins only for Functions
  - Acceptance: Requests from unknown origins are blocked
- [ ] Re-enable scheduled news updater with region and timezone
  - Acceptance: Daily run logs visible; manual trigger retained for admins
- [ ] Add basic rate limiting to `sendContactEmail` and `sendBugReport`
  - Acceptance: Max 1 request/min per user/IP; returns friendly throttle message

Verification pause: Hit endpoints from client and curl; confirm auth/roles enforced and throttling works.

### Batch 3: Client/service boundary hardening (minimal UI impact)
- [ ] Make `src/services/newsService.js` read-only for `aiNews` (no client create/update/delete)
  - Acceptance: Only reads from client; any mutations happen via secured Functions
- [ ] Keep user likes functional with tight rules
  - Acceptance: Users can like/unlike via allowed fields update or via a small Function; totals update correctly
- [ ] Remove or replace `src/firebase-node.js` with Admin SDK in Node-only scripts
  - Acceptance: No Node context uses client SDK; scripts still function

Verification pause: Smoke test news list and like/unlike in UI; confirm no client write attempts.

### Batch 4: Stability and observability
- [ ] Add retry/backoff and per-source isolation to RSS fetching in Functions
  - Acceptance: Temporary feed failures don’t fail the whole batch; logs show granular errors
- [ ] Switch email from Gmail SMTP to a transactional provider (SendGrid/SES) with secrets
  - Acceptance: Emails send reliably in staging; no secrets in code
- [ ] Add minimal unit tests (firebase-functions-test) for YouTube endpoints, news update trigger, and rate limiting
  - Acceptance: Tests run in CI and pass locally

Verification pause: Run tests; verify logs and metrics for scheduled jobs.

### Batch 5: Functions runtime configuration
- [ ] Set region, memory/timeout, concurrency, and min instances where appropriate
  - Acceptance: Hot paths have explicit runtime options; cold starts acceptable for others
- [ ] Document per-env config/secrets and deployment steps
  - Acceptance: README updated; deploy scripts reference config; `npm run production-deploy` validates

## 🧭 Top Priorities (Quick Wins for Production)
- [x] **COMPLETED: Direct users to Lessons page on open/login**
  - ✅ Acceptance: Visiting `/` or completing login lands on `/lessons` (protected route).
  - ✅ Implementation: `navigateAfterAuth()` in utils/navigationUtils.js redirects to `/lessons`
- [x] **COMPLETED: Hide in‑progress/placeholder lessons from public list**
  - ✅ Acceptance: Lessons with `hidden: true` or `status: 'under_development'` do not render on `/lessons`.
  - ✅ Implementation: LessonsOverview.js filters for published lessons only (lines 225-228)
- [x] **COMPLETED: Confirm published‑only visibility**
  - ✅ Acceptance: Only lessons with `status: 'published'` (or explicit published flag) appear.
  - ✅ Implementation: Consistent filtering applied across LessonsOverview and admin panels
- [x] **COMPLETED: Clear empty state CTA on Lessons page (admin only)**
  - ✅ Acceptance: Admins see a "Create Your First Lesson" link to `/unified-lesson-builder` when no lessons exist.
  - ✅ Implementation: DashboardOverview.js shows create button for empty state
- [ ] **REMAINING: Clean database of placeholder lessons**
  - Acceptance: No legacy placeholder cards; empty state appears until new content is published.
  - Next: Run database cleanup script or manually remove placeholder content
- [ ] **REMAINING: Improve admin navigation UX**
  - Acceptance: Admins can reach `/admin` and the builder in 1–2 clicks from the app.
  - Current: Routes exist but could use better navigation links in main UI
- [ ] **REMAINING: Card visual control (optional)**
  - Acceptance: `icon` and optional `paletteIndex` fields on lesson documents override card visuals.
  - Next: Implement visual customization fields in lesson cards
- [ ] **REMAINING: Smoke tests for routing and visibility**
  - Acceptance: Tests cover login redirect to `/lessons`, hidden/published filtering, and empty states.
  - Next: Write test coverage for completed functionality

## 🔶 Bigger Items To Complete
- [ ] Finish lesson content updates to new format
  - Acceptance: Published lessons open in modern viewers without errors; no static fallbacks.
- [ ] Make the admin lesson editor fully functional
  - Acceptance: Create/edit/publish flows succeed; changes reflect immediately on `/lessons`.
- [ ] Pre‑production checks
  - Acceptance: Health check, security audit, and env validation pass per repo rules.
- [ ] Production build and serve test
  - Acceptance: `npm run build` + `npm run serve` run cleanly; no runtime errors.
- [ ] Firebase security rules sanity
  - Acceptance: Public can read published lessons; only admins can write/publish.
- [ ] Monitoring and error boundaries
  - Acceptance: Viewers wrapped with error boundaries; client errors logged.

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