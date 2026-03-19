import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { authService } from '../services/api';

export default function Login() {
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
      const { data } = await authService.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-white flex items-center justify-center p-6 cyber-grid relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,204,0.05),transparent_70%)]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-neon-cyan/10 rounded-3xl flex items-center justify-center mb-6 border border-neon-cyan/20 shadow-[0_0_30px_rgba(0,255,204,0.1)]">
            <Shield className="text-neon-cyan w-12 h-12 drop-shadow-[0_0_8px_rgba(0,255,204,0.5)]" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic neon-text">Access Protocol</h1>
          <p className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-widest">Secure Node Authentication Required</p>
        </div>

        <div className="glass-card p-8 neon-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Identity Provider</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-cyan transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-neon-cyan transition-all text-sm font-medium"
                  placeholder="operator@cloudsafe.io"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Secure Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-cyan transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-neon-cyan transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-cyan hover:bg-white text-black font-black uppercase italic tracking-tighter py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-8 group"
            >
              {loading ? 'Verifying...' : 'Initialize Session'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 mt-8 text-[10px] font-bold uppercase tracking-widest">
          New Operator?{' '}
          <Link to="/register" className="text-neon-cyan hover:underline">
            Request Credentials
          </Link>
        </p>
      </div>
    </div>
  );
}
