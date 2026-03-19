import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ShieldAlert, 
  Globe, 
  Terminal as TerminalIcon,
  Clock,
  MapPin,
  Flame,
  Zap
} from 'lucide-react';
import AttackMap from '../components/AttackMap';
import CyberTerminal from '../components/Terminal';
import axios from 'axios';

const SOCDashboard: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([
    'Initializing SOC monitoring protocols...',
    'Connecting to global threat intelligence feeds...',
    'System ready. Monitoring active.'
  ]);
  const [threats, setThreats] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newThreat = {
        id: Date.now(),
        type: ['SQL Injection', 'Brute Force', 'DDoS', 'Malware'][Math.floor(Math.random() * 4)],
        source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.x.x`,
        location: ['China', 'Russia', 'USA', 'Brazil', 'Germany'][Math.floor(Math.random() * 5)],
        severity: ['high', 'critical', 'medium'][Math.floor(Math.random() * 3)],
        timestamp: new Date().toLocaleTimeString()
      };
      setThreats(prev => [newThreat, ...prev].slice(0, 10));
      setLogs(prev => [...prev, `Detected ${newThreat.type} attempt from ${newThreat.source} (${newThreat.location})`]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold neon-glow flex items-center gap-3">
            <ShieldAlert className="text-cyber-red" />
            Security Operations Center
          </h1>
          <p className="text-white/50">Global threat intelligence and incident response</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2 border-cyber-neon/30">
            <div className="w-2 h-2 rounded-full bg-cyber-neon animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest">Live Monitoring</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Map & Terminal */}
        <div className="lg:col-span-2 space-y-8">
          <AttackMap />
          <CyberTerminal logs={logs} />
        </div>

        {/* Right Column: Incident Feed & Timeline */}
        <div className="space-y-8">
          {/* Live Incident Feed */}
          <div className="glass-card p-6 h-[400px] flex flex-col">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-cyber-red">
              <Flame size={18} />
              Live Incident Feed
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
              {threats.map((threat) => (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    threat.severity === 'critical' ? 'bg-cyber-red' : threat.severity === 'high' ? 'bg-orange-500' : 'bg-cyber-blue'
                  }`} />
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">{threat.type}</span>
                    <span className="text-[10px] text-white/50">{threat.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <MapPin size={12} className="text-cyber-neon" />
                    <span>{threat.source} ({threat.location})</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Attack Timeline */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-cyber-blue">
              <Clock size={18} />
              Attack Timeline
            </h3>
            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
              {[
                { time: '14:20', event: 'DDoS Mitigation Triggered', status: 'Active' },
                { time: '14:05', event: 'Firewall Breach Attempt', status: 'Blocked' },
                { time: '13:45', event: 'System Integrity Check', status: 'Passed' },
              ].map((item, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-cyber-bg border-2 border-cyber-blue" />
                  <p className="text-xs font-bold text-cyber-blue">{item.time}</p>
                  <p className="text-sm">{item.event}</p>
                  <p className="text-[10px] uppercase text-white/30">{item.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Simulation */}
      <div className="glass-card p-8">
        <h3 className="font-bold mb-6 flex items-center gap-2">
          <Globe className="text-cyber-neon" size={18} />
          Regional Risk Heatmap
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'].map((region, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-white/50 uppercase mb-2">{region}</p>
              <div className="text-xl font-bold flex items-center justify-center gap-2">
                <Zap className={i % 2 === 0 ? 'text-cyber-neon' : 'text-cyber-red'} size={16} />
                {Math.floor(Math.random() * 100)}%
              </div>
              <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${i % 2 === 0 ? 'bg-cyber-neon' : 'bg-cyber-red'}`} 
                  style={{ width: `${Math.floor(Math.random() * 100)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SOCDashboard;
