import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Globe, 
  Zap, 
  Crosshair, 
  AlertCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { alertService } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SOCDashboard() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockThreats = [
      { id: 1, type: 'Brute Force', target: 'Auth-API', origin: '192.168.1.45', severity: 'High', time: '2m ago' },
      { id: 2, type: 'SQL Injection', target: 'User-DB', origin: '45.23.11.90', severity: 'Critical', time: '5m ago' },
      { id: 3, type: 'DDoS Attempt', target: 'Edge-Gateway', origin: 'Multiple', severity: 'Medium', time: '12m ago' },
      { id: 4, type: 'Unauthorized Access', target: 'S3-Bucket-Prod', origin: '10.0.0.5', severity: 'High', time: '15m ago' },
    ];
    setThreats(mockThreats);
    setLoading(false);
  }, []);

  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'now'],
    datasets: [
      {
        fill: true,
        label: 'Threat Intensity',
        data: [12, 19, 15, 25, 22, 30, 45],
        borderColor: '#00ffcc',
        backgroundColor: 'rgba(0, 255, 204, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { display: false },
      x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 10 } } },
    },
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 cyber-grid min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter neon-text uppercase italic">SOC Command Center</h1>
          <p className="text-zinc-500 font-mono text-sm mt-1">Live Security Operations & Threat Intelligence</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-3 border-neon-cyan/20">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Live Feed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Threat Intensity Chart */}
        <div className="lg:col-span-2 glass-card p-6 min-h-[300px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <TrendingUp size={16} className="text-neon-cyan" />
              Attack Timeline
            </h3>
            <span className="text-[10px] font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded">Real-time</span>
          </div>
          <div className="flex-1">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-red-500/20 bg-red-500/5">
            <div className="flex justify-between items-start">
              <ShieldAlert className="text-red-500" size={24} />
              <span className="text-[10px] font-bold text-red-500 uppercase">Critical</span>
            </div>
            <p className="text-4xl font-black mt-4">04</p>
            <p className="text-xs text-zinc-500 font-bold uppercase mt-1">Active Breaches</p>
          </div>
          <div className="glass-card p-6 border-neon-blue/20 bg-neon-blue/5">
            <div className="flex justify-between items-start">
              <Globe className="text-neon-blue" size={24} />
              <span className="text-[10px] font-bold text-neon-blue uppercase">Global</span>
            </div>
            <p className="text-4xl font-black mt-4">128</p>
            <p className="text-xs text-zinc-500 font-bold uppercase mt-1">Blocked IPs (24h)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Threat Feed */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              Live Threat Feed
            </h3>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {threats.map((threat) => (
              <div key={threat.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    threat.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    <Crosshair size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-200">{threat.type}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">Target: {threat.target} • Origin: {threat.origin}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                    threat.severity === 'Critical' ? 'border-red-500/30 text-red-500' : 'border-orange-500/30 text-orange-500'
                  }`}>
                    {threat.severity}
                  </span>
                  <p className="text-[10px] text-zinc-600 mt-1 flex items-center justify-end gap-1">
                    <Clock size={10} /> {threat.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap Simulation */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
            <Activity size={16} className="text-neon-cyan" />
            Regional Risk Heatmap
          </h3>
          <div className="flex-1 grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, i) => (
              <div 
                key={i} 
                className={`rounded-sm transition-all duration-500 ${
                  Math.random() > 0.8 ? 'bg-red-500 animate-pulse' : 
                  Math.random() > 0.6 ? 'bg-orange-500/50' : 
                  'bg-emerald-500/20'
                }`}
                style={{ opacity: Math.random() * 0.5 + 0.5 }}
              />
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span>Low Risk</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-emerald-500/20 rounded-sm" />
              <div className="w-3 h-3 bg-orange-500/50 rounded-sm" />
              <div className="w-3 h-3 bg-red-500 rounded-sm" />
            </div>
            <span>High Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
