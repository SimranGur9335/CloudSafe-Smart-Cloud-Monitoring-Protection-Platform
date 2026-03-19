import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Fingerprint, 
  Globe, 
  Smartphone,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const Sandbox: React.FC = () => {
  const [config, setConfig] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [identity, setIdentity] = useState('admin@cloudsafe.io');
  const [ip, setIp] = useState('192.168.1.1');
  const [deviceId, setDeviceId] = useState('DEV-X900-SECURE');
  const [ztResult, setZtResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const analyzeConfig = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const risks = [
        'S3 Bucket "public-assets" has read access for all users.',
        'Security Group "web-sg" allows SSH from 0.0.0.0/0.',
        'IAM User "dev-deploy" has AdministratorAccess policy attached.'
      ];
      setResult({
        score: 45,
        risks: risks,
        recommendation: 'Apply principle of least privilege and restrict network access.'
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const verifyTrust = async () => {
    setIsVerifying(true);
    try {
      const res = await axios.post('/api/verify-trust', { identity, ip, deviceId });
      setZtResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cloud Sandbox */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-cyber-neon" size={32} />
            <div>
              <h2 className="text-2xl font-bold">Cloud Risk Sandbox</h2>
              <p className="text-white/50 text-sm">Analyze infrastructure configurations for vulnerabilities</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest text-white/50 font-bold">Infrastructure Config (JSON/YAML)</label>
            <textarea
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              placeholder='{"Resource": "AWS::S3::Bucket", "Properties": {"AccessControl": "PublicRead"}}'
              className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-sm focus:border-cyber-neon/50 outline-none transition-colors"
            />
            <button
              onClick={analyzeConfig}
              disabled={isAnalyzing}
              className="w-full bg-cyber-neon text-black font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" /> : 'Analyze Risk Profile'}
            </button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold uppercase">Risk Score</span>
                  <span className={`text-2xl font-bold ${result.score < 50 ? 'text-cyber-red' : 'text-cyber-neon'}`}>
                    {result.score}/100
                  </span>
                </div>
                <div className="space-y-2">
                  {result.risks.map((risk: string, i: number) => (
                    <div key={i} className="flex gap-2 text-sm text-white/70">
                      <ShieldAlert className="text-cyber-red shrink-0" size={16} />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Zero Trust Simulation */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Fingerprint className="text-cyber-blue" size={32} />
            <div>
              <h2 className="text-2xl font-bold">Zero Trust Engine</h2>
              <p className="text-white/50 text-sm">Identity and device trust verification simulation</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-white/50 font-bold">Identity</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    type="text"
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-cyber-blue/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-white/50 font-bold">Source IP</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    type="text"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-cyber-blue/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-white/50 font-bold">Device ID</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    type="text"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-cyber-blue/50"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={verifyTrust}
              disabled={isVerifying}
              className="w-full bg-cyber-blue text-black font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isVerifying ? <Loader2 className="animate-spin" /> : 'Verify Access Request'}
            </button>
          </div>

          <AnimatePresence>
            {ztResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-6 rounded-xl border flex flex-col items-center text-center gap-4 ${
                  ztResult.decision === 'ALLOW' ? 'bg-cyber-neon/10 border-cyber-neon/30' : 'bg-cyber-red/10 border-cyber-red/30'
                }`}
              >
                {ztResult.decision === 'ALLOW' ? (
                  <CheckCircle2 className="text-cyber-neon" size={48} />
                ) : (
                  <XCircle className="text-cyber-red" size={48} />
                )}
                <div>
                  <h3 className={`text-xl font-bold ${ztResult.decision === 'ALLOW' ? 'text-cyber-neon' : 'text-cyber-red'}`}>
                    ACCESS {ztResult.decision}ED
                  </h3>
                  <p className="text-sm text-white/70 mt-1">{ztResult.reason}</p>
                </div>
                <div className="text-[10px] uppercase text-white/30 font-mono">
                  Trace ID: {Math.random().toString(36).substring(7).toUpperCase()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Sandbox;
