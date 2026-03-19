import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Server, 
  Activity, 
  RefreshCw, 
  Zap, 
  Lock,
  Cpu,
  Eye
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { motion, AnimatePresence } from 'motion/react';
import SecurityScore from '../components/SecurityScore';
import ResourceCard from '../components/ResourceCard';
import CyberTerminal from '../components/CyberTerminal';
import { reportService, resourceService, scanService } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const fetchData = async () => {
    try {
      const [statsRes, resourcesRes] = await Promise.all([
        reportService.getStats(),
        resourceService.getAll()
      ]);
      setStats(statsRes.data);
      setResources(resourcesRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunScan = async () => {
    setScanning(true);
    setScanProgress(0);
    
    // Progress simulation
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    try {
      await scanService.runScan();
      setTimeout(async () => {
        await fetchData();
        setScanning(false);
      }, 2000);
    } catch (err) {
      console.error('Scan failed', err);
      setScanning(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="text-neon-cyan animate-spin" size={48} />
        <p className="text-neon-cyan font-mono text-sm animate-pulse">INITIALIZING SECURITY CORE...</p>
      </div>
    </div>
  );

  const chartData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Active Risks',
        data: [
          stats.riskDistribution.Critical,
          stats.riskDistribution.High,
          stats.riskDistribution.Medium,
          stats.riskDistribution.Low,
        ],
        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#3b82f6'],
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 cyber-grid min-h-screen relative">
      <AnimatePresence>
        {scanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md space-y-6 text-center">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-neon-cyan/20 rounded-full" />
                <div 
                  className="absolute inset-0 border-4 border-neon-cyan rounded-full border-t-transparent animate-spin" 
                  style={{ animationDuration: '1s' }}
                />
                <ShieldCheck className="absolute inset-0 m-auto text-neon-cyan" size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter neon-text uppercase italic">Deep Scan in Progress</h2>
                <p className="text-zinc-500 font-mono text-xs mt-2">Analyzing infrastructure for anomalies and misconfigurations...</p>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  className="h-full bg-neon-cyan shadow-[0_0_15px_rgba(0,255,204,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                />
              </div>
              <p className="text-neon-cyan font-mono text-[10px] tracking-widest">{scanProgress}% COMPLETE</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter neon-text uppercase italic">Security Overview</h1>
          <p className="text-zinc-500 font-mono text-sm mt-1">CloudSafe Intelligence Node: US-EAST-1</p>
        </div>
        <button
          onClick={handleRunScan}
          disabled={scanning}
          className="group relative px-8 py-3 bg-neon-cyan text-black font-black uppercase italic tracking-tighter rounded-sm overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]" />
          <span className="relative flex items-center gap-2">
            <RefreshCw size={18} className={scanning ? 'animate-spin' : ''} />
            {scanning ? 'Scanning...' : 'Initiate Deep Scan'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SecurityScore score={stats.securityScore} />
        
        <div className="glass-card p-6 flex flex-col justify-between group hover:neon-border transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-neon-cyan/10 rounded-lg group-hover:bg-neon-cyan/20 transition-colors">
              <Server className="text-neon-cyan" size={20} />
            </div>
            <Zap className="text-zinc-700 group-hover:text-neon-cyan transition-colors" size={16} />
          </div>
          <div>
            <p className="text-5xl font-black tracking-tighter">{stats.totalResources}</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Total Assets</p>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between group hover:border-red-500/30 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
              <AlertTriangle className="text-red-500" size={20} />
            </div>
            <Eye className="text-zinc-700 group-hover:text-red-500 transition-colors" size={16} />
          </div>
          <div>
            <p className="text-5xl font-black tracking-tighter text-red-500">{stats.activeAlerts}</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Active Threats</p>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between group hover:border-neon-blue/30 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-neon-blue/10 rounded-lg group-hover:bg-neon-blue/20 transition-colors">
              <Lock className="text-neon-blue" size={20} />
            </div>
            <Activity className="text-zinc-700 group-hover:text-neon-blue transition-colors" size={16} />
          </div>
          <div>
            <p className="text-5xl font-black tracking-tighter">ZERO</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Trust Breaches</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
              <Activity size={16} className="text-neon-cyan" />
              Risk Distribution Matrix
            </h3>
            <div className="h-64">
              <Bar 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } },
                    x: { grid: { display: false }, ticks: { color: '#71717a' } }
                  }
                }} 
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black tracking-tighter uppercase italic mb-6 flex items-center gap-2">
              <Cpu size={20} className="text-neon-cyan" />
              Infrastructure Nodes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((res) => (
                <ResourceCard key={res.resource_id} resource={res} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <CyberTerminal />
          
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">System Integrity</h3>
            <div className="space-y-3">
              {[
                { label: 'Zero Trust Engine', status: 'Active', color: 'text-neon-cyan' },
                { label: 'ML Anomaly Detection', status: 'Monitoring', color: 'text-neon-blue' },
                { label: 'Cloud API Sync', status: 'Stable', color: 'text-emerald-400' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-xs font-medium text-zinc-400">{item.label}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
