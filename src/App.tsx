import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PlantProvider } from './context/PlantContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

import './index.css';
import './styles/animations.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <PlantProvider>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <DashboardPage />
                  </RequireAuth>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PlantProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

// Protected Route Component
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default App;