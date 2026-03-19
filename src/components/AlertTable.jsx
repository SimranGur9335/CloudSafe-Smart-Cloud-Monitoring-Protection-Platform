import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function AlertTable({ alerts, onResolve }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20 animate-pulse';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-neon-blue bg-neon-blue/10 border-neon-blue/20';
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black">
            <th className="px-8 py-5">Severity</th>
            <th className="px-8 py-5">Incident Description</th>
            <th className="px-8 py-5">Node ID</th>
            <th className="px-8 py-5">Status</th>
            <th className="px-8 py-5 text-right">Protocol</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {alerts.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-8 py-20 text-center text-zinc-600 font-mono text-xs italic">
                NO ACTIVE THREATS DETECTED IN LOCAL CLUSTER
              </td>
            </tr>
          ) : (
            alerts.map((alert) => (
              <tr key={alert.alert_id} className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-5">
                  <span className={`px-2 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <p className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">{alert.description}</p>
                  <p className="text-[9px] text-zinc-600 mt-1 flex items-center gap-1 font-mono uppercase tracking-tighter">
                    <Clock size={10} /> {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </td>
                <td className="px-8 py-5 text-[10px] text-zinc-500 font-mono tracking-tighter">
                  {alert.resource_id}
                </td>
                <td className="px-8 py-5">
                  <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${alert.status === 'Active' ? 'text-orange-400' : 'text-neon-cyan'}`}>
                    {alert.status === 'Active' ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                    {alert.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  {alert.status === 'Active' && (
                    <button
                      onClick={() => onResolve(alert.alert_id)}
                      className="text-[10px] font-black uppercase tracking-widest text-neon-cyan hover:text-white transition-colors underline underline-offset-4"
                    >
                      Remediate
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
