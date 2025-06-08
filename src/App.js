import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GamificationProvider } from './contexts/GamificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Navigation from './components/Navigation';
import SwipeNavigationWrapper from './components/SwipeNavigationWrapper';

import OfflineStatus from './components/OfflineStatus';
import ErrorBoundary from './components/ErrorBoundary';

// Import gamification components
import GamificationNotifications from './components/GamificationNotifications';
import LevelUpModal from './components/LevelUpModal';
import BadgeModal from './components/BadgeModal';
import AdaptiveDatabaseSeeder from './components/AdaptiveDatabaseSeeder';

// Import pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage'; // Simplified version
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LessonsOverview from './pages/LessonsOverview';
import LessonDetail from './pages/LessonDetail';
import LessonStart from './pages/LessonStart';
import LessonViewer from './components/LessonViewer';
import WelcomeLessonViewer from './components/WelcomeLessonViewer';
import AdaptiveWelcomeLesson from './components/AdaptiveWelcomeLesson';
import WelcomeRedirect from './components/WelcomeRedirect';
import LearningPathQuiz from './pages/LearningPathQuiz';
import AdaptiveLearningPathQuiz from './components/AdaptiveLearningPathQuiz';
import LearningPathResults from './pages/LearningPathResults';
import AiNews from './pages/AiNews';
import Quiz from './pages/Quiz';
import QuizResults from './pages/QuizResults';
import ForgotPassword from './pages/ForgotPassword';
import Pricing from './pages/Pricing';

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
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
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
                  {/* <Navigation /> and <SwipeNavigationWrapper /> would need to be inside Profile or a new layout */}
                  <Route index element={<Profile />} />
                </Route>

                <Route path="/settings" element={<ProtectedRoute />}>
                  {/* <Navigation /> and <SwipeNavigationWrapper /> would need to be inside Profile (or a new SettingsPage) or a new layout */}
                  <Route index element={<Profile />} /> {/* Assuming settings uses Profile page for now */}
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
                  {/* <Navigation /> would need to be inside LessonDetail or a new layout */}
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
                  {/* <Navigation /> would need to be inside LearningPathQuiz or a new layout */}
                  <Route index element={<LearningPathQuiz />} />
                </Route>

                <Route path="/learning-path/adaptive-quiz" element={<ProtectedRoute />}>
                  {/* New adaptive quiz for better skill assessment */}
                  <Route index element={<AdaptiveLearningPathQuiz />} />
                </Route>

                <Route path="/learning-path/results" element={<ProtectedRoute />}>
                  {/* <Navigation /> would need to be inside LearningPathResults or a new layout */}
                  <Route index element={<LearningPathResults />} />
                </Route>

                <Route path="/ai-news" element={<ProtectedRoute />}>
                  {/* <Navigation /> would need to be inside AiNews or a new layout */}
                  <Route index element={<AiNews />} />
                </Route>

                <Route path="/lesson/:lessonId/quiz" element={<ProtectedRoute />}>
                  {/* <Navigation /> would need to be inside Quiz or a new layout */}
                  <Route index element={<Quiz />} />
                </Route>

                <Route path="/lesson/:lessonId/results" element={<ProtectedRoute />}>
                  {/* <Navigation /> would need to be inside QuizResults or a new layout */}
                  <Route index element={<QuizResults />} />
                </Route>

              </Routes>
              
              {/* Gamification Components - Available throughout the app */}
              <GamificationNotifications />
              <LevelUpModal />
              <BadgeModal />
              
              {/* Development Tools */}
              {process.env.NODE_ENV === 'development' && <AdaptiveDatabaseSeeder />}
            </Layout>
          </ErrorBoundary>
        </GamificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 