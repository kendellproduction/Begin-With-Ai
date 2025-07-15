import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { AdminProvider } from './contexts/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import ServiceWorkerRegistration from './utils/serviceWorkerRegistration';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineStatus from './components/OfflineStatus';
import { analytics } from './utils/monitoring';

// Import gamification components (keep these as they're small and used globally)
import GamificationNotifications from './components/GamificationNotifications';
import LevelUpModal from './components/LevelUpModal';
import BadgeModal from './components/BadgeModal';
import AdaptiveDatabaseSeeder from './components/AdaptiveDatabaseSeeder';

// Import essential components that are used immediately (keep synchronous)
import LessonViewer from './components/LessonViewer';
import ModernLessonViewer from './components/ModernLessonViewer';
import SynchronizedLessonViewer from './components/SynchronizedLessonViewer';
import WelcomeLessonViewer from './components/WelcomeLessonViewer';
import AdaptiveWelcomeLesson from './components/AdaptiveWelcomeLesson';
import WelcomeRedirect from './components/WelcomeRedirect';
import AdaptiveLearningPathQuiz from './components/AdaptiveLearningPathQuiz';

// ===== LAZY LOADED PAGES FOR CODE SPLITTING =====
// High-impact lazy loading - these will significantly reduce initial bundle size

// Priority 1: Heavy/Admin components (highest impact)
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const UnifiedAdminPanel = React.lazy(() => import('./components/admin/UnifiedAdminPanel'));
const DraftBrowser = React.lazy(() => import('./pages/DraftBrowser'));
const AiNews = React.lazy(() => import('./pages/AiNews'));
const LessonsOverview = React.lazy(() => import('./pages/LessonsOverview'));
const PodcastDemo = React.lazy(() => import('./pages/PodcastDemo'));
const PodcastContent = React.lazy(() => import('./components/PodcastContent'));

// Priority 2: User flow pages
const Settings = React.lazy(() => import('./pages/Settings'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Features = React.lazy(() => import('./pages/Features'));
const Contact = React.lazy(() => import('./pages/Contact'));
const About = React.lazy(() => import('./pages/About'));

// Priority 3: Auth and core pages
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const Pricing = React.lazy(() => import('./pages/Pricing'));

// Learning flow pages
const LessonDetail = React.lazy(() => import('./pages/LessonDetail'));
const LessonStart = React.lazy(() => import('./pages/LessonStart'));
const LearningPathQuiz = React.lazy(() => import('./pages/LearningPathQuiz'));
const LearningPathResults = React.lazy(() => import('./pages/LearningPathResults'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const QuizResults = React.lazy(() => import('./pages/QuizResults'));

// import LessonBuilder from './components/LessonBuilder'; // Removed due to file not existing

import ContentBlockDemo from './pages/ContentBlockDemo';
import EnterpriseBuilderTest from './components/admin/EnterpriseBuilderTest';
import UnifiedLessonBuilder from './components/admin/UnifiedLessonBuilder';

// Import admin utilities for development
import './utils/setAdminRole';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GamificationProvider>
          <ErrorBoundary>
            <Layout>
              <OfflineStatus />
              <Suspense fallback={<LoadingSpinner message="Loading page..." variant="page" />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  
                  {/* Protected /home path */}
                  <Route path="/home" element={<ProtectedRoute />}>
                    <Route index element={<HomePage />} />
                  </Route>

                  {/* Redirect dashboard to home - Dashboard functionality integrated into HomePage */}
                  <Route path="/dashboard" element={<Navigate to="/home" replace />} />

                  <Route path="/profile" element={<ProtectedRoute />}>
                    <Route index element={<Profile />} />
                  </Route>

                  <Route path="/settings" element={<ProtectedRoute />}>
                    <Route index element={<Settings />} />
                  </Route>

                  <Route path="/lessons" element={<ProtectedRoute />}>
                    <Route path="" element={<LessonsOverview />} />
                  </Route>

                  <Route path="/pricing" element={<ProtectedRoute />}>
                    <Route index element={<Pricing />} />
                  </Route>

                  {/* Lesson start page with difficulty selection */}
                  <Route path="/lessons/start/:lessonId" element={<ProtectedRoute />}>
                    <Route index element={<LessonStart />} />
                  </Route>

                  <Route path="/lessons/:lessonId" element={<ProtectedRoute />}>
                    <Route index element={<LessonDetail />} />
                  </Route>

                  {/* Modern scroll-based lesson viewer - full screen, no layout */}
                  <Route path="/lesson-viewer/:lessonId" element={<ProtectedRoute />}>
                    <Route index element={<ModernLessonViewer />} />
                  </Route>

                  {/* Synchronized audio lesson viewer - for lessons with audio/video content */}
                  <Route path="/lesson-sync/:lessonId" element={<ProtectedRoute />}>
                    <Route index element={<SynchronizedLessonViewer />} />
                  </Route>

                  {/* Legacy slide-based lesson viewer - keeping for compatibility */}
                  <Route path="/lesson-viewer-legacy/:lessonId" element={<ProtectedRoute />}>
                    <Route index element={<LessonViewer />} />
                  </Route>

                  {/* Welcome lesson for first-time users - full screen, no layout */}
                  <Route path="/lessons/first-time-welcome" element={<ProtectedRoute />}>
                    <Route index element={<WelcomeLessonViewer />} />
                  </Route>

                  {/* Redirect old welcome route to new adaptive quiz */}
                  <Route path="/welcome" element={<ProtectedRoute />}>
                    <Route index element={<WelcomeRedirect />} />
                  </Route>

                  <Route path="/learning-path/quiz" element={<ProtectedRoute />}>
                    <Route index element={<LearningPathQuiz />} />
                  </Route>

                  <Route path="/learning-path/adaptive-quiz" element={<ProtectedRoute />}>
                    {/* New adaptive quiz for better skill assessment */}
                    <Route index element={<AdaptiveLearningPathQuiz />} />
                  </Route>

                  <Route path="/learning-path/results" element={<ProtectedRoute />}>
                    <Route index element={<LearningPathResults />} />
                  </Route>

                  <Route path="/ai-news" element={<ProtectedRoute />}>
                    <Route index element={<AiNews />} />
                  </Route>



  {/* Podcast Content Generator */}
  <Route path="/lesson/:lessonId/podcast" element={<ProtectedRoute />}>
    <Route index element={<PodcastContent />} />
  </Route>

                  {/* ===== CONSOLIDATED ADMIN INTERFACE ===== */}
                  {/* PRIMARY: Unified Admin Panel - Modern consolidated interface */}
                  <Route path="/admin" element={<ProtectedRoute requireAdminRole={true} />}>
                    <Route index element={
                      <AdminProvider>
                        <UnifiedAdminPanel />
                      </AdminProvider>
                    } />
                  </Route>

                  {/* LEGACY: Legacy admin interfaces - redirecting to unified panel */}
                  <Route path="/admin-unified" element={<Navigate to="/admin" replace />} />
                  <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
                  <Route path="/admin-panel" element={<Navigate to="/admin" replace />} />

                  {/* Draft Browser - Integrated into unified admin */}
                  <Route path="/drafts" element={<Navigate to="/admin" replace />} />

                  {/* Demo: Podcast Player Testing */}
                  <Route path="/podcast-demo" element={<ProtectedRoute />}>
                    <Route index element={<PodcastDemo />} />
                  </Route>

                  {/* Demo: Synchronized Lesson Testing */}
                  <Route path="/sync-demo" element={<ProtectedRoute />}>
                    <Route index element={<SynchronizedLessonViewer />} />
                  </Route>

                  <Route path="/content-blocks-demo" element={<ProtectedRoute />}>
                    <Route index element={<ContentBlockDemo />} />
                  </Route>

                  {/* Legacy lesson builders - keeping for compatibility */}
                  {/* <Route path="/lesson-builder" element={<LessonBuilder />} /> */}
                  <Route path="/enterprise-builder-test" element={<EnterpriseBuilderTest />} />
                  <Route path="/enterprise-builder" element={<Navigate to="/unified-lesson-builder" replace />} />
                  <Route path="/enterprise-builder-full" element={<Navigate to="/unified-lesson-builder" replace />} />

                  {/* NEW: Unified Lesson Builder - Combines best of both builders */}
                  <Route path="/unified-lesson-builder" element={<ProtectedRoute requireAdminRole={true} />}>
                    <Route index element={
                      <AdminProvider>
                        <UnifiedLessonBuilder />
                      </AdminProvider>
                    } />
                  </Route>

                </Routes>
              </Suspense>
              
              {/* Gamification Components - Available throughout the app */}
              <GamificationNotifications />
              <LevelUpModal />
              <BadgeModal />
              
              {/* AdaptiveDatabaseSeeder for development */}
              <AdaptiveDatabaseSeeder />
            </Layout>
          </ErrorBoundary>
        </GamificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 