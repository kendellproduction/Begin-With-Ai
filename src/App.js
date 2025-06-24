import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GamificationProvider } from './contexts/GamificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

import OfflineStatus from './components/OfflineStatus';
import ErrorBoundary from './components/ErrorBoundary';

// Import gamification components (keep these as they're small and used globally)
import GamificationNotifications from './components/GamificationNotifications';
import LevelUpModal from './components/LevelUpModal';
import BadgeModal from './components/BadgeModal';
import AdaptiveDatabaseSeeder from './components/AdaptiveDatabaseSeeder';

// Import essential components that are used immediately (keep synchronous)
import LessonViewer from './components/LessonViewer';
import WelcomeLessonViewer from './components/WelcomeLessonViewer';
import AdaptiveWelcomeLesson from './components/AdaptiveWelcomeLesson';
import WelcomeRedirect from './components/WelcomeRedirect';
import AdaptiveLearningPathQuiz from './components/AdaptiveLearningPathQuiz';

// ===== LAZY LOADED PAGES FOR CODE SPLITTING =====
// High-impact lazy loading - these will significantly reduce initial bundle size

// Priority 1: Heavy/Admin components (highest impact)
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
// const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
// const AiNews = React.lazy(() => import('./pages/AiNews'));
const LessonsOverview = React.lazy(() => import('./pages/LessonsOverview'));

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
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
// const Pricing = React.lazy(() => import('./pages/Pricing'));

// Learning flow pages
const LessonDetail = React.lazy(() => import('./pages/LessonDetail'));
const LessonStart = React.lazy(() => import('./pages/LessonStart'));
const LearningPathQuiz = React.lazy(() => import('./pages/LearningPathQuiz'));
const LearningPathResults = React.lazy(() => import('./pages/LearningPathResults'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const QuizResults = React.lazy(() => import('./pages/QuizResults'));

function App() {
  // Simple inline component for testing
  const SimpleHomeTest = () => (
    <div style={{ padding: "100px", textAlign: "center", fontSize: "30px", background: "orange", color: "black" }}>
      <h1>RAW APP.JS /home TEST</h1>
      <p>If you see this, App.js can render a component at /home.</p>
    </div>
  );

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

                  {/* Other protected routes - REFACTORED */}
                  <Route path="/dashboard" element={<ProtectedRoute requireEmailVerification={false} />}>
                    <Route index element={<Dashboard />} />
                  </Route>

                  <Route path="/profile" element={<ProtectedRoute />}>
                    <Route index element={<Profile />} />
                  </Route>

                  <Route path="/settings" element={<ProtectedRoute />}>
                    <Route index element={<Settings />} />
                  </Route>

                  <Route path="/lessons" element={<ProtectedRoute />}>
                    <Route path="" element={<LessonsOverview />} />
                  </Route>

                  {/* <Route path="/pricing" element={<ProtectedRoute />}>
                    <Route index element={<Pricing />} />
                  </Route> */}

                  {/* Lesson start page with difficulty selection */}
                  <Route path="/lessons/start/:lessonId" element={<ProtectedRoute />}>
                    <Route index element={<LessonStart />} />
                  </Route>

                  <Route path="/lessons/:lessonId" element={<ProtectedRoute />}>
                    <Route index element={<LessonDetail />} />
                  </Route>

                  {/* New slide-based lesson viewer - full screen, no layout */}
                  <Route path="/lesson-viewer/:lessonId" element={<ProtectedRoute />}>
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

                  {/* <Route path="/ai-news" element={<ProtectedRoute />}>
                    <Route index element={<AiNews />} />
                  </Route> */}

                  <Route path="/lesson/:lessonId/quiz" element={<ProtectedRoute />}>
                    <Route index element={<Quiz />} />
                  </Route>

                  <Route path="/lesson/:lessonId/results" element={<ProtectedRoute />}>
                    <Route index element={<QuizResults />} />
                  </Route>

                  {/* Admin Panel - Only accessible by admin/dev users */}
                  {/* <Route path="/admin" element={<ProtectedRoute />}>
                    <Route index element={<AdminPanel />} />
                  </Route> */}

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