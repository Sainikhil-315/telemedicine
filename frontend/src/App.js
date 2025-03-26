import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// bootstrap 
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import DoctorsPage from './pages/DoctorsPage';
import ProfilePage from './pages/ProfilePage';
import AppointmentForm from './components/AppointmentForm';
import AppointmentsPage from './pages/AppointmentsPage'
import RecommendationBot from './pages/recommendationBot';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const [ doctorId, setDoctorId ] = useState(null);
  const handleDoctorId = (doctorId) => {
    setDoctorId(doctorId);
    console.log("Doctor Id in app.js: ",doctorId);
  }
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="main-content flex-grow-1">
          <Routes>
            <Route path="/" element={<><HomePage /><Footer /></>} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
                <Footer />
              </ProtectedRoute>
            } />

            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />
            <Route path="/appointment/:doctorId" element={
              <ProtectedRoute>
                <AppointmentForm doctorId={doctorId}/>
              </ProtectedRoute>
            } />
            <Route path="/doctors" element={
              <ProtectedRoute>
                <DoctorsPage handleDoctorId={handleDoctorId}/>
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <AppointmentsPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/recommend-bot" element={
              <ProtectedRoute>
                <RecommendationBot />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;