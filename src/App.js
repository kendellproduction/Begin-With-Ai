import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GamificationProvider } from './contexts/GamificationContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LessonDetail from './pages/LessonDetail';
import Lessons from './pages/Lessons';
import HomePage from './pages/HomePage';
import AiNews from './pages/AiNews';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';
import Quiz from './components/Quiz';
import QuizResults from './components/QuizResults';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GamificationProvider>
          <Layout>
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
                <Route path="lessons" element={<Lessons />} />
                <Route path="lessons/:lessonId" element={<LessonDetail />} />
                <Route path="ai-news" element={<AiNews />} />
                <Route path="lesson/:lessonId/quiz" element={<Quiz />} />
                <Route path="lesson/:lessonId/results" element={<QuizResults />} />
              </Route>
            </Routes>
          </Layout>
        </GamificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 