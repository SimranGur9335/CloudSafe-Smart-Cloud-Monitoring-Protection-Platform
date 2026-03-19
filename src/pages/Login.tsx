import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, User, ArrowRight, Loader2, Activity } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const res = await axios.post(endpoint, payload);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden cyber-grid">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyber-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 relative z-10 border-cyber-neon/20"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={{ 
              rotateY: [0, 360],
              filter: ['drop-shadow(0 0 10px #00ffcc)', 'drop-shadow(0 0 20px #00ffcc)', 'drop-shadow(0 0 10px #00ffcc)']
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-cyber-neon/10 rounded-2xl flex items-center justify-center mb-4 border border-cyber-neon/30"
          >
            <Shield size={40} className="text-cyber-neon" />
          </motion.div>
          <h1 className="text-3xl font-bold neon-glow tracking-tighter">CloudSafe</h1>
          <p className="text-white/50 text-sm mt-2 uppercase tracking-[0.2em]">Security Protocol v4.0</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-cyber-neon/50 outline-none transition-colors"
                  placeholder="Enter your name"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-cyber-neon/50 outline-none transition-colors"
                placeholder="admin@cloudsafe.io"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Access Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-cyber-neon/50 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-cyber-red text-xs font-bold text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyber-neon text-black font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,204,0.3)]"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <>
                {isLogin ? 'Initialize Session' : 'Create Security Profile'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white/50 text-sm hover:text-cyber-neon transition-colors"
          >
            {isLogin ? "Don't have an account? Register" : "Already have a profile? Login"}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex justify-center gap-6 opacity-30 grayscale">
          <Shield size={24} />
          <Lock size={24} />
          <Activity size={24} />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
