import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  LayoutDashboard, 
  ShieldAlert, 
  Box, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import SOCDashboard from './pages/SOCDashboard';
import Sandbox from './pages/Sandbox';
import Login from './pages/Login';
import CustomCursor from './components/Cursor';
import AIChatbot from './components/AIChatbot';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/soc', label: 'SOC Center', icon: ShieldAlert },
    { path: '/sandbox', label: 'Sandbox', icon: Box },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="glass-card m-4 px-6 py-4 flex justify-between items-center sticky top-4 z-[1000] border-cyber-neon/20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-cyber-neon/10 rounded-lg group-hover:bg-cyber-neon/20 transition-colors">
            <Shield className="text-cyber-neon" size={24} />
          </div>
          <span className="text-xl font-bold neon-glow tracking-tighter">CloudSafe</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                location.pathname === item.path ? 'text-cyber-neon' : 'text-white/50 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-white/90">{user.name}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-tighter">{user.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-white/50 hover:text-cyber-red transition-colors"
          >
            <LogOut size={20} />
          </button>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <AIChatbot />
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Login />;
  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <Router>
      <CustomCursor />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/soc" element={<ProtectedRoute><SOCDashboard /></ProtectedRoute>} />
        <Route path="/sandbox" element={<ProtectedRoute><Sandbox /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
