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
  - [ ] Implement a manual save system with unsaved changes detection.
  - [ ] Update the lesson data model to support Free/Premium tiers.
- **Core Functionality:**
  - [ ] Re-enable all disabled core features (Admin Panel, AI News, Pricing pages).
  - [ ] Fix and re-enable Firebase Analytics integration.
  - [ ] Remove all `console.log` statements from production code.

### 🟠 Priority 2: High Priority Tasks (Next Up)
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

### 🟡 Priority 3: Medium Priority Tasks (Future Work)
- **Advanced Admin Features:**
  - [ ] Implement advanced content blocks (Podcast, Interactive Elements).
  - [ ] Build out all Settings Panel tabs (SEO, Analytics, Access Control).
  - [ ] Implement a full draft management system with version control.
- **User Experience & Monitoring:**
  - [ ] Complete comprehensive mobile experience testing.
  - [ ] Set up AI API cost monitoring and rate limiting.
  - [ ] Fully configure and enable Sentry error reporting and Google Analytics.

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