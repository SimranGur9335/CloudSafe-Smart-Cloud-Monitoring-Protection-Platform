import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Server, 
  Lock, 
  Zap,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import axios from 'axios';
import io from 'socket.io-client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const socket = io(window.location.origin);

const Dashboard: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [securityScore, setSecurityScore] = useState(85);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetchData();
    socket.on('live-update', (payload: any) => {
      if (payload.type === 'log') {
        setLogs(prev => [payload.data, ...prev].slice(0, 10));
      } else if (payload.type === 'alert') {
        setAlerts(prev => [payload.data, ...prev].slice(0, 5));
      }
    });
    return () => {
      socket.off('live-update');
    };
  }, []);

  const fetchData = async () => {
    try {
      const [resData, alertData, logData] = await Promise.all([
        axios.get('/api/resources'),
        axios.get('/api/alerts'),
        axios.get('/api/logs')
      ]);
      setResources(resData.data);
      setAlerts(alertData.data);
      setLogs(logData.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const runScan = async () => {
    setIsScanning(true);
    try {
      await axios.post('/api/scan');
      setTimeout(() => setIsScanning(false), 2000);
    } catch (err) {
      setIsScanning(false);
    }
  };

  const lineData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Threat Activity',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#00ffcc',
        backgroundColor: 'rgba(0, 255, 204, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: [
          '#00ffcc',
          '#00bfff',
          '#ffaa00',
          '#ff0055',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)' } },
      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)' } },
    },
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold neon-glow">Security Command Center</h1>
          <p className="text-white/50">Real-time monitoring and threat detection active</p>
        </div>
        <button 
          onClick={runScan}
          disabled={isScanning}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            isScanning ? 'bg-white/10 text-white/50' : 'bg-cyber-neon text-black hover:scale-105 shadow-[0_0_15px_rgba(0,255,204,0.4)]'
          }`}
        >
          <RefreshCw className={isScanning ? 'animate-spin' : ''} size={20} />
          {isScanning ? 'Analyzing Infrastructure...' : 'Initiate Security Scan'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Security Score', value: `${securityScore}%`, icon: Shield, color: 'text-cyber-neon' },
          { label: 'Total Resources', value: resources.length, icon: Server, color: 'text-cyber-blue' },
          { label: 'Active Alerts', value: alerts.length, icon: AlertTriangle, color: 'text-cyber-red' },
          { label: 'System Uptime', value: '99.99%', icon: Activity, color: 'text-green-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-center gap-4 group hover:border-cyber-neon/50 transition-colors"
          >
            <div className={`p-4 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-white/50 text-sm uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <Zap className="text-cyber-neon" size={18} />
              Threat Activity Timeline
            </h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-cyber-neon" />
              <span className="text-xs text-white/50 uppercase">Live Feed</span>
            </div>
          </div>
          <div className="h-[300px]">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <AlertTriangle className="text-cyber-red" size={18} />
            Risk Distribution
          </h3>
          <div className="h-[250px] flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom', labels: { color: 'white' } } } }} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Alerts & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 overflow-hidden">
          <h3 className="font-bold mb-4 flex justify-between items-center">
            Recent Critical Alerts
            <button className="text-cyber-blue text-xs flex items-center gap-1 hover:underline">
              View All <ChevronRight size={14} />
            </button>
          </h3>
          <div className="space-y-4">
            {alerts.slice(0, 5).map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-xl border flex items-center gap-4 ${
                  alert.severity === 'high' || alert.severity === 'critical' 
                    ? 'bg-cyber-red/10 border-cyber-red/30 alert-pulse' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  alert.severity === 'high' || alert.severity === 'critical' ? 'bg-cyber-red text-white' : 'bg-white/10 text-white/50'
                }`}>
                  <AlertTriangle size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.description}</p>
                  <p className="text-[10px] text-white/50 uppercase">{new Date(alert.timestamp).toLocaleString()}</p>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                  alert.severity === 'high' || alert.severity === 'critical' ? 'bg-cyber-red/20 text-cyber-red' : 'bg-white/10 text-white/50'
                }`}>
                  {alert.severity}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-bold mb-4">System Activity Logs</h3>
          <div className="space-y-3 font-mono text-xs">
            {logs.slice(0, 8).map((log, i) => (
              <div key={i} className="flex items-center gap-3 p-2 border-b border-white/5 last:border-0">
                <span className="text-cyber-neon">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className={`uppercase font-bold ${
                  log.severity === 'high' ? 'text-cyber-red' : log.severity === 'medium' ? 'text-cyber-blue' : 'text-white/30'
                }`}>
                  {log.severity}
                </span>
                <span className="text-white/70">{log.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
