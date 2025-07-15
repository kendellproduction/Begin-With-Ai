# 🚀 BeginningWithAi Master Task List

This document is the single source of truth for all ongoing and planned tasks. It consolidates all previous to-do lists, plans, and checklists.

## 📋 Task Summary & Priority Assessment

This section provides a high-level overview of all tasks, categorized by priority. More detailed descriptions can be found in the sections below.

### 🔴 Priority 1: Critical Tasks (Immediate Focus)
- **Fix Project Stability:**
  - [x] Enforce exact dependency versions in `package.json`.
  - [x] Resolve all peer dependency conflicts.
  - [x] Perform a clean install of all `node_modules`.
- **Admin Panel Overhaul:**
  - [ ] Consolidate multiple admin builders into a single `UnifiedLessonBuilder.js`.
  - [x] Implement a manual save system with unsaved changes detection.
  - [ ] Update the lesson data model to support Free/Premium tiers.
- **Core Functionality:**
  - [ ] Re-enable all disabled core features (Admin Panel, AI News, Pricing pages).
  - [ ] Fix and re-enable Firebase Analytics integration.
  - [ ] Remove all `console.log` statements from production code.

**Pause here for review, testing, and potential GitHub push before proceeding to Priority 2.**

### 🟠 Priority 2: Merge Dashboard into Home Page
- **[CRITICAL] Eliminate Dashboard Page by Integrating Selected Features into Home Page:**
  - Review features in `src/pages/Dashboard.js` (e.g., personalized stats, recent activity, achievements, quick actions, daily tip) and identify which to keep (focus on essentials; skip redundancies or unimplemented mocks as they may not be needed).
  - Audit `src/pages/HomePage.js` for overlaps (e.g., existing stats, quick actions) and determine integration points.
  - Integrate selected dashboard features into `src/pages/HomePage.js`, using conditional rendering for logged-in users and maintaining a clean, dynamic layout.
  - Update routes in `src/App.js`: Remove the /dashboard route and add a redirect from /dashboard to /home.
  - Delete `src/pages/Dashboard.js` after verifying the merge is successful.
  - Test the combined home page for functionality, performance, user experience, and mobile responsiveness.

**Pause here for review, testing, and potential GitHub push before proceeding to Priority 3.**

### 🟠 Priority 3: Fix Quizzes in History of AI Lesson
- **[HIGH] Resolve Blank Quiz Display:**
  - Review quiz implementation in src/utils/historyOfAiLesson.js and src/components/ModernLessonViewer.js.
  - Ensure quiz sections are properly rendered with questions and options.
  - Fix any issues with isLastInGroup or section organization logic.
  - Test rendering of all quiz slides in the lesson.
  - Add fallback content if quiz data is missing.

**Pause here for review, testing, and potential GitHub push before proceeding to Priority 4.**

### 🟠 Priority 4: Fix Custom Learning Journey
- **[HIGH] Ensure New Users Take Questionnaire:**
  - Verify src/services/newUserOnboardingService.js redirect logic for new users to '/learning-path/adaptive-quiz'.
  - Fix any triggers that prevent pushing new users to the questionnaire.
- **[HIGH] Implement User-Specific Learning Paths:**
  - Audit database storage in user docs for activeLearningPath.
  - Ensure each user sees only their own path, not shared ones.
  - Update retrieval logic in components like HomePage.js to fetch user-specific data.

**Pause here for review, testing, and potential GitHub push before proceeding to Priority 5.**

### 🟠 Priority 5: Complete Lesson Review and Enhancements
- **[MEDIUM] Audit All Lessons:**
  - Review structure, content, and interactive elements in all lessons (e.g., src/utils/historyOfAiLesson.js, src/lessons/*).
  - Ensure quizzes, sandboxes, and adaptive content work across difficulties.
  - Add missing quizzes or fix rendering in other lessons if needed.
- **[MEDIUM] Add Useful Lesson Features:**
  - Implement progress checkpoints in long lessons.
  - Add more interactive elements like fill-in-blanks or checklists.

**Pause here for review, testing, and potential GitHub push before proceeding to Priority 6.**

### 🟠 Priority 6: High Priority Tasks (Existing + New)
- **Project Optimization:**
  - [ ] Migrate from Create React App (CRA) to Vite for better performance.
  - [ ] Implement route-based code splitting (`React.lazy()`) in `src/App.js`.
  - [ ] Set up and configure ESLint for consistent code quality.
  - [ ] Audit and remove unused npm packages.
- **Admin Panel UI/UX:**
  - [ ] Implement the full Webflow-inspired layout (Content, Settings, Preview).
  - [ ] Build the Free/Premium toggle system.
  - [ ] Implement all essential content blocks (Text, Image, Video, Quiz, Sandbox).
- **Error Handling & Security:**
  - [ ] Implement comprehensive error fallbacks for all API services.
  - [ ] Fix the bug reporting system (Gmail authentication).
  - [ ] Verify Firebase Security Rules are production-ready.
- **New Additions:**
  - [ ] Add comprehensive testing suite for core features.
  - [ ] Optimize for mobile devices and test PWA functionality.

**Pause here for review, testing, and potential GitHub push before proceeding to Priority 7.**

### 🟡 Priority 7: Medium Priority Tasks (Future Work)
- **Advanced Admin Features:**
  - [ ] Implement advanced content blocks (Podcast, Interactive Elements).
  - [ ] Build out all Settings Panel tabs (SEO, Analytics, Access Control).
  - [ ] Implement a full draft management system with version control.
- **User Experience & Monitoring:**
  - [ ] Complete comprehensive mobile experience testing.
  - [ ] Set up AI API cost monitoring and rate limiting.
  - [ ] Fully configure and enable Sentry error reporting and Google Analytics.
- **New Additions:**
  - [ ] Integrate GitHub push after major changes.
  - [ ] Add offline support enhancements for lessons.

**Pause here for review, testing, and potential GitHub push.**

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