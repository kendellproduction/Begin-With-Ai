import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LessonDetail from './pages/LessonDetail';
import Lessons from './pages/Lessons';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Navigation />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="lessons/:lessonId" element={<LessonDetail />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App; 