import React from 'react';
import { Server, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

export default function ResourceCard({ resource }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Secure': return <ShieldCheck className="text-emerald-500" />;
      case 'Medium': return <ShieldAlert className="text-yellow-500" />;
      case 'High': return <ShieldX className="text-orange-500 animate-pulse" />;
      case 'Critical': return <ShieldX className="text-red-500 animate-blink-red rounded-full p-1" />;
      default: return <ShieldCheck className="text-zinc-500" />;
    }
  };

  return (
    <div className="glass-card p-5 border-white/5 hover:border-neon-cyan/30 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-neon-cyan/10 transition-colors" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
          <Server className="text-zinc-400 group-hover:text-neon-cyan transition-colors" size={20} />
        </div>
        {getStatusIcon(resource.security_status)}
      </div>
      
      <div className="relative z-10">
        <h4 className="text-sm font-black tracking-tight text-zinc-200 group-hover:text-white transition-colors uppercase italic">{resource.type}</h4>
        <p className="text-[10px] text-zinc-500 font-mono mt-1 tracking-tighter">{resource.resource_id}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
        <span className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-600">{resource.provider}</span>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest ${
          resource.security_status === 'Secure' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-zinc-400'
        }`}>
          {resource.security_status}
        </span>
      </div>
    </div>
  );
}
