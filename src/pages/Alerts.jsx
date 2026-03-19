import React, { useState, useEffect } from 'react';
import { AlertTriangle, Filter, Download, RefreshCw } from 'lucide-react';
import AlertTable from '../components/AlertTable';
import { alertService } from '../services/api';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchAlerts = async () => {
    try {
      const { data } = await alertService.getAll();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to fetch alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id) => {
    try {
      await alertService.resolve(id);
      fetchAlerts();
    } catch (err) {
      console.error('Failed to resolve alert', err);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'All') return true;
    if (filter === 'Active') return a.status === 'Active';
    if (filter === 'Resolved') return a.status === 'Resolved';
    return a.severity === filter;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg">
      <RefreshCw className="text-neon-cyan animate-spin" size={32} />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 cyber-grid min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter neon-text uppercase italic">Threat Ledger</h1>
          <p className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-widest">Active Incident Management & Remediation</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-cyan transition-colors" size={14} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-neon-cyan appearance-none transition-all"
            >
              <option value="All">All Incidents</option>
              <option value="Active">Active Threats</option>
              <option value="Resolved">Resolved Cases</option>
              <option value="Critical">Critical Only</option>
              <option value="High">High Severity</option>
            </select>
          </div>
          <button className="bg-white/5 border border-white/10 hover:bg-neon-cyan hover:text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
            <Download size={14} />
            Export Intelligence
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 border-red-500/20 bg-red-500/5 group hover:bg-red-500/10 transition-all">
          <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Critical Breaches</p>
          <p className="text-5xl font-black tracking-tighter italic">{alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length}</p>
        </div>
        <div className="glass-card p-8 border-orange-500/20 bg-orange-500/5 group hover:bg-orange-500/10 transition-all">
          <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">High Risk Alerts</p>
          <p className="text-5xl font-black tracking-tighter italic">{alerts.filter(a => a.severity === 'High' && a.status === 'Active').length}</p>
        </div>
        <div className="glass-card p-8 border-neon-cyan/20 bg-neon-cyan/5 group hover:bg-neon-cyan/10 transition-all">
          <p className="text-neon-cyan text-[10px] font-black uppercase tracking-[0.2em] mb-2">Remediated Cases</p>
          <p className="text-5xl font-black tracking-tighter italic">{alerts.filter(a => a.status === 'Resolved').length}</p>
        </div>
      </div>

      <AlertTable alerts={filteredAlerts} onResolve={handleResolve} />
    </div>
  );
}
