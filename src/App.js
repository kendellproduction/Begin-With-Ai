import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GamificationProvider } from './contexts/GamificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Navigation from './components/Navigation';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineStatus from './components/OfflineStatus';

// Import pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LessonsOverview from './pages/LessonsOverview';
import LessonsExplore from './pages/LessonsExplore';
import LessonDetail from './pages/LessonDetail';
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
              <Route
                element={
                  <ProtectedRoute>
                    <Navigation />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home" element={<HomePage />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Profile />} />
                <Route path="lessons" element={<LessonsOverview />} />
                <Route path="lessons/explore" element={<LessonsExplore />} />
                <Route path="lessons/:lessonId" element={<LessonDetail />} />
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