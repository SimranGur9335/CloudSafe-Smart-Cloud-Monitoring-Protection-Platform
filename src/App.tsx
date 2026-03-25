import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Dashboard from './pages/Dashboard';
import SOCDashboard from './pages/SOCDashboard';
import Sandbox from './pages/Sandbox';
import Login from './pages/Login';
import Register from './pages/Register';

import CustomCursor from './components/Cursor';
import AIChatbot from './components/AIChatbot';

// 🔐 Firebase Auth Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <CustomCursor />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/soc"
          element={
            <ProtectedRoute>
              <SOCDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sandbox"
          element={
            <ProtectedRoute>
              <Sandbox />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      <AIChatbot />
    </Router>
  );
};

export default App;