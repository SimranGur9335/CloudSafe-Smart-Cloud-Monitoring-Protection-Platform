import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

export default function CyberTerminal() {
  const [logs, setLogs] = useState([]);
  const containerRef = useRef(null);

  const messages = [
    "Initializing CloudSafe Security Core...",
    "Establishing encrypted connection to AWS-US-EAST-1...",
    "Scanning S3 buckets for public access...",
    "WARNING: Potential misconfiguration detected in 'prod-data-backup'.",
    "Analyzing IAM policies for privilege escalation paths...",
    "Anomaly detection engine: ONLINE",
    "Monitoring real-time API traffic...",
    "Threat level: STABLE",
    "Running Zero Trust verification on incoming requests...",
    "System integrity check: 100%",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        setLogs(prev => [...prev, { id: Date.now(), text: messages[index] }]);
        index++;
      } else {
        index = 0;
        setLogs([]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-card neon-border overflow-hidden flex flex-col h-full min-h-[300px]">
      <div className="bg-white/10 px-4 py-2 flex items-center gap-2 border-b border-white/10">
        <TerminalIcon size={14} className="text-neon-cyan" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Security Terminal</span>
        <div className="flex gap-1.5 ml-auto">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
      </div>
      <div 
        ref={containerRef}
        className="p-4 font-mono text-xs space-y-1 overflow-y-auto flex-1 scrollbar-hide"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-neon-cyan shrink-0">[{new Date().toLocaleTimeString()}]</span>
            <span className={log.text.includes('WARNING') ? 'text-red-400' : 'text-zinc-300'}>
              {log.text}
            </span>
          </div>
        ))}
        <div className="w-2 h-4 bg-neon-cyan animate-pulse inline-block ml-1" />
      </div>
    </div>
  );
}
