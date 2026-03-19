import React, { useState } from 'react';
import { Search, ShieldAlert, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { scanService } from '../services/api';

export default function Sandbox() {
  const [config, setConfig] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!config.trim()) return;
    
    setLoading(true);
    try {
      const { data } = await scanService.analyze(config);
      setResult(data);
    } catch (err) {
      console.error('Analysis failed', err);
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "AWS S3 bucket with public read access",
    "Azure VM with port 22 open to 0.0.0.0/0",
    "GCP Cloud SQL instance without SSL/TLS encryption",
    "IAM policy with AdministratorAccess assigned to guest user"
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto cyber-grid min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black tracking-tighter neon-text uppercase italic">AI Security Sandbox</h1>
        <p className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-widest">Simulate cloud configurations to detect potential risks using neural analysis</p>
      </div>

      <div className="glass-card p-8 neon-border mb-10">
        <form onSubmit={handleAnalyze}>
          <div className="space-y-6">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Cloud Configuration Description</label>
            <div className="relative">
              <textarea
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                placeholder="Describe your cloud resource configuration here..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-6 px-6 min-h-[160px] focus:outline-none focus:border-neon-cyan transition-all text-zinc-200 font-mono text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setConfig(ex)}
                  className="text-[9px] font-bold bg-white/5 hover:bg-neon-cyan/10 hover:text-neon-cyan text-zinc-500 px-4 py-1.5 rounded-sm transition-all border border-white/5 hover:border-neon-cyan/20 uppercase tracking-widest"
                >
                  {ex}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading || !config.trim()}
              className="w-full bg-neon-cyan hover:bg-white text-black font-black uppercase italic tracking-tighter py-5 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 mt-4 group"
            >
              {loading ? (
                <>
                  <Cpu size={20} className="animate-spin" />
                  Processing Neural Analysis...
                </>
              ) : (
                <>
                  <Search size={20} className="group-hover:scale-110 transition-transform" />
                  Execute Risk Assessment
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="glass-card rounded-3xl overflow-hidden neon-border">
            <div className={`p-8 flex items-center justify-between ${
              result.severity === 'Critical' ? 'bg-red-500/10' : 
              result.severity === 'High' ? 'bg-orange-500/10' : 
              'bg-neon-cyan/10'
            }`}>
              <div className="flex items-center gap-4">
                <ShieldAlert className={
                  result.severity === 'Critical' ? 'text-red-500' : 
                  result.severity === 'High' ? 'text-orange-500' : 
                  'text-neon-cyan'
                } size={28} />
                <div>
                  <h3 className="font-black text-xl uppercase italic tracking-tighter">Analysis Report</h3>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Scan ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] border ${
                result.severity === 'Critical' ? 'border-red-500/30 text-red-500' : 
                result.severity === 'High' ? 'border-orange-500/30 text-orange-500' : 
                'border-neon-cyan/30 text-neon-cyan'
              }`}>
                {result.severity} Severity
              </span>
            </div>
            
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Threat Probability Index</p>
                <div className="flex items-end gap-3">
                  <span className="text-8xl font-black tracking-tighter leading-none neon-text italic">{result.risk_score}</span>
                  <span className="text-zinc-600 font-black text-xl mb-2 tracking-tighter italic">/ 100</span>
                </div>
                <div className="w-full bg-white/5 h-3 rounded-full mt-8 overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.risk_score}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full shadow-[0_0_15px_rgba(0,255,204,0.5)] ${
                      result.risk_score > 80 ? 'bg-red-500' : 
                      result.risk_score > 50 ? 'bg-orange-500' : 
                      'bg-neon-cyan'
                    }`}
                  />
                </div>
              </div>

              <div className="bg-black/40 p-8 rounded-2xl border border-white/5 flex flex-col justify-center">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-neon-cyan" />
                  Remediation Protocol
                </p>
                <p className="text-zinc-300 leading-relaxed italic font-medium text-lg">
                  "{result.recommended_fix}"
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
