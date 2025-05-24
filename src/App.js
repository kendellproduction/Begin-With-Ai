import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GamificationProvider } from './contexts/GamificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Navigation from './components/Navigation';
import SwipeNavigationWrapper from './components/SwipeNavigationWrapper';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineStatus from './components/OfflineStatus';

// Import pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LessonsOverview from './pages/LessonsOverview';
import LessonsExplore from './pages/LessonsExplore';
import LessonDetail from './pages/LessonDetail';
import LearningPathQuiz from './pages/LearningPathQuiz';
import LearningPathResults from './pages/LearningPathResults';
import AiNews from './pages/AiNews';
import Quiz from './pages/Quiz';
import QuizResults from './pages/QuizResults';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GamificationProvider>
          <Layout>
            <OfflineStatus />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                element={
                  <ProtectedRoute>
                    <Navigation />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home" element={
                  <SwipeNavigationWrapper>
                    <HomePage />
                  </SwipeNavigationWrapper>
                } />
                <Route path="dashboard" element={
                  <SwipeNavigationWrapper>
                    <Dashboard />
                  </SwipeNavigationWrapper>
                } />
                <Route path="profile" element={
                  <SwipeNavigationWrapper>
                    <Profile />
                  </SwipeNavigationWrapper>
                } />
                <Route path="settings" element={
                  <SwipeNavigationWrapper>
                    <Profile />
                  </SwipeNavigationWrapper>
                } />
                <Route path="lessons" element={
                  <SwipeNavigationWrapper>
                    <LessonsOverview />
                  </SwipeNavigationWrapper>
                } />
                <Route path="lessons/explore" element={<LessonsExplore />} />
                <Route path="lessons/:lessonId" element={<LessonDetail />} />
                <Route path="learning-path/quiz" element={<LearningPathQuiz />} />
                <Route path="learning-path/results" element={<LearningPathResults />} />
                <Route path="ai-news" element={<AiNews />} />
                <Route path="lesson/:lessonId/quiz" element={<Quiz />} />
                <Route path="lesson/:lessonId/results" element={<QuizResults />} />
              </Route>
            </Routes>
            <PWAInstallPrompt />
          </Layout>
        </GamificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 