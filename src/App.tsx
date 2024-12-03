import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import AuthForm from './components/auth/AuthForm';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Weather = React.lazy(() => import('./pages/Weather'));
const Soil = React.lazy(() => import('./pages/Soil'));
const History = React.lazy(() => import('./pages/History'));

function App() {
  const { initialize, user, loading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" /> : <AuthForm mode="login" />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/dashboard" /> : <AuthForm mode="signup" />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/weather"
              element={user ? <Weather /> : <Navigate to="/login" />}
            />
            <Route
              path="/soil"
              element={user ? <Soil /> : <Navigate to="/login" />}
            />
            <Route
              path="/history"
              element={user ? <History /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Suspense>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;