import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, AlertTriangle, Search, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/soc', icon: Shield, label: 'SOC Center' },
    { path: '/alerts', icon: AlertTriangle, label: 'Alerts' },
    { path: '/sandbox', icon: Search, label: 'AI Sandbox' },
  ];

  return (
    <nav className="bg-black/50 backdrop-blur-md border-b border-white/10 text-white px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Shield className="text-neon-cyan w-8 h-8 drop-shadow-[0_0_8px_rgba(0,255,204,0.5)]" />
        <span className="text-2xl font-black tracking-tighter uppercase italic">CloudSafe</span>
      </div>

      <div className="flex items-center gap-10">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all hover:text-neon-cyan ${
              location.pathname === item.path ? 'text-neon-cyan' : 'text-zinc-500'
            }`}
          >
            <item.icon size={14} />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right mr-2">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Operator</p>
          <p className="text-sm font-black tracking-tight neon-text">{user.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
