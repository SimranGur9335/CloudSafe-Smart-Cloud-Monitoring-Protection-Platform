import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { authService } from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register({ name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-white flex items-center justify-center p-6 cyber-grid relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(0,191,255,0.05),transparent_70%)]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-neon-blue/10 rounded-3xl flex items-center justify-center mb-6 border border-neon-blue/20 shadow-[0_0_30px_rgba(0,191,255,0.1)]">
            <Shield className="text-neon-blue w-12 h-12 drop-shadow-[0_0_8px_rgba(0,191,255,0.5)]" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-neon-blue drop-shadow-[0_0_8px_rgba(0,191,255,0.5)]">Node Enrollment</h1>
          <p className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-widest">Register New Security Operator</p>
        </div>

        <div className="glass-card p-8 border-neon-blue/20 shadow-[0_0_30px_rgba(0,191,255,0.05)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Operator Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-blue transition-colors" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-neon-blue transition-all text-sm font-medium"
                  placeholder="Agent 001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Communication Channel</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-blue transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-neon-blue transition-all text-sm font-medium"
                  placeholder="operator@cloudsafe.io"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Encryption Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-blue transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-neon-blue transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-blue hover:bg-white text-black font-black uppercase italic tracking-tighter py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-8 group"
            >
              {loading ? 'Enrolling...' : 'Initialize Enrollment'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 mt-8 text-[10px] font-bold uppercase tracking-widest">
          Already Enrolled?{' '}
          <Link to="/login" className="text-neon-blue hover:underline">
            Initiate Session
          </Link>
        </p>
      </div>
    </div>
  );
}
