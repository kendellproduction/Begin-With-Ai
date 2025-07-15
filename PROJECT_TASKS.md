# 🚀 BeginningWithAi Master Task List

This document is the single source of truth for all ongoing and planned tasks. It consolidates all previous to-do lists, plans, and checklists.

## 📋 Task Summary & Priority Assessment

This section provides a high-level overview of all tasks, categorized by priority. More detailed descriptions can be found in the sections below.

### 🔴 Priority 1: Critical Stability Fixes
- [ ] Re-enable all disabled core features (Admin Panel, AI News, Pricing pages).
- [ ] Fix and re-enable Firebase Analytics integration.
- [ ] Remove all `console.log` statements from production code.

**Pause here for review, testing, and potential GitHub push before proceeding to Priority 2.**

### 🟠 Priority 2: UI and Page Consolidation
- [ ] Fix lessons page background color from baby blue to space black (likely in `src/pages/Lessons.js` or related styles).
- [ ] Eliminate Dashboard Page by Integrating Selected Features into Home Page:
  - Review and integrate key features from `src/pages/Dashboard.js` into `src/pages/HomePage.js`.
  - Update routes in `src/App.js` to remove /dashboard and redirect to /home.
  - Delete `src/pages/Dashboard.js` after verification.

**Pause here for review, testing, and potential GitHub push before proceeding to Priority 3.**

### 🟠 Priority 3: Lesson and Quiz Fixes
- [ ] Resolve blank quiz display in History of AI lesson (review `src/utils/historyOfAiLesson.js` and `src/components/ModernLessonViewer.js`).
- [ ] Audit structure, quizzes, sandboxes, and adaptive content in all lessons; add missing elements like progress checkpoints.

**Pause here for review, testing, and potential GitHub push before proceeding to Priority 4.**

### 🟠 Priority 4: Custom Learning Paths
- [ ] Ensure new users are redirected to the adaptive questionnaire (`src/services/newUserOnboardingService.js`).
- [ ] Implement user-specific learning path retrieval and display (audit user docs and update components like HomePage.js).

**Pause here for review, testing, and potential GitHub push.**

### 🟡 Backlog (Lower Priority/Future Tasks)
- Consolidate admin builders into `UnifiedLessonBuilder.js`.
- Update lesson data model for Free/Premium tiers.
- Migrate from CRA to Vite for performance.
- Implement route-based code splitting with `React.lazy()`.
- Set up ESLint and audit/remove unused npm packages.
- Implement comprehensive error handling and verify Firebase Security Rules.
- Add testing suite for core features and optimize for mobile/PWA.
- Advanced admin features (e.g., content blocks, draft management).
- User experience enhancements (e.g., cost monitoring, offline support).
- Additional TODOs: Implement Firebase auth in `Register.js`, zoom modal in `ImageBlock.js`, published lesson deletion in `UnifiedLessonManager.js`.
- Gamification (leaderboards), AR/VR integration, more lessons, Firestore optimizations.

---

## 📚 Detailed Task Breakdowns

### 1. Project Health & Optimization

#### 1.1. Dependency & Build System
- **[COMPLETED] Resolve Node Corruption:** The `package.json` has been updated to use exact versions for all dependencies, and all peer dependency conflicts have been resolved. A clean `npm install` has been successfully executed.
- **[HIGH] Migrate to Vite:** Replace `react-scripts` (Create React App) with Vite to gain significant performance improvements in development and production.
- **[HIGH] Implement Code Splitting:** Use `React.lazy()` for all page-level components in `src/App.js` to reduce initial bundle size and improve load times.
- **[HIGH] Configure ESLint:** Set up ESLint with a standard configuration (e.g., `eslint-config-react-app`) to enforce code quality and find errors.
- **[HIGH] Audit NPM Packages:** Use a tool like `depcheck` to identify and remove any dependencies that are no longer used in the project.

### 2. Admin Panel Overhaul (from `ADMIN_PANEL_OVERHAUL_PLAN.md`)

#### 2.1. Foundation (Critical)
- **[CRITICAL] Consolidate Builders:**
  - Audit all current admin components.
  - Remove `LessonBuilder.js`, `EnterpriseBuilder.js`, `LessonEditor.js`.
  - Refactor all logic into `UnifiedLessonBuilder.js`.
- **[CRITICAL] Data Architecture:**
  - Update lesson data model in Firestore to use Free/Premium tiers instead of difficulty levels.
  - Add `draft` and `published` states to lessons.
  - Create a dedicated `drafts` collection in Firestore.
- **[CRITICAL] Manual Save System:**
  - Implement `AdminContext` for state management during lesson editing.
  - Add robust unsaved changes detection.
  - Create prominent "Save" button and "Exit with unsaved changes?" prompts.

#### 2.2. UI/UX (High)
- **[HIGH] Webflow-Inspired Layout:** Implement the three-column layout (Content Blocks, Settings, Preview) with a glass-morphism aesthetic.
- **[HIGH] Free/Premium Toggle:** Create the UI toggle to switch between editing content for free vs. premium users.
- **[HIGH] Content Block Implementation:**
  - Build the base component for all drag-and-drop content blocks.
  - Fully implement the Text, Image (with uploads), Video, Quiz, and Sandbox blocks.
- **[MEDIUM] Advanced Blocks & Settings:**
  - Implement Podcast and other interactive block types.
  - Build out the full settings panel, including SEO, analytics, design, and media management.

### 3. V1 Launch & Optimization (from `OPTIMIZATION_CHECKLIST.md` and `V1_LAUNCH_TODO_LIST.md`)

#### 3.1. Core Features & Cleanup (Critical)
- **[CRITICAL] Re-enable Routes:**
  - Uncomment the routes for `AdminPanel`, `AiNews`, and `Pricing` in `src/App.js`.
- **[CRITICAL] Enable PWA:** Rename `public/manifest.json.disabled` to `public/manifest.json`.
- **[CRITICAL] Fix Analytics:** Resolve the "API issues" preventing Firebase Analytics from initializing in `src/firebase.js`.
- **[CRITICAL] Remove `console.log`s:** Systematically remove all debug logs from the production codebase, especially in `src/firebase.js` and `src/contexts/AuthContext.js`.

#### 3.2. Functional Fixes & Testing (High)
- **[HIGH] Error Handling:** Implement user-friendly fallbacks and error messages for all critical API calls and user flows.
- **[HIGH] Bug Reporting:** Fix the Gmail authentication issue in the bug report cloud function.
- **[HIGH] Data Persistence:** Audit all `localStorage` usage, add sync indicators, and handle cases where storage might be full or unavailable.
- **[MEDIUM] Mobile Experience:** Conduct end-to-end testing of all user flows on mobile devices, including touch interactions and PWA behavior.

#### 3.3. Security & Monitoring (High)
- **[HIGH] Firebase Security Rules:** Perform a full audit of your Firestore rules to ensure they are secure for production.
- **[MEDIUM] Sentry & Google Analytics:** Properly configure Sentry with a production DSN and set up detailed event tracking in Google Analytics.
- **[MEDIUM] Cost Monitoring:** Implement rate limiting and cost monitoring for all third-party AI services.

### Updated TODO List

- [ ] Implement leaderboards for gamification
- [ ] Add AR/VR integration for immersive lessons
- [ ] Optimize Firestore with composite indexes for queries
- [ ] Set up cost monitoring and alerts in Firebase
- [ ] Create 10+ more complete lessons to enable full paths