import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TerminalProps {
  logs: string[];
}

const CyberTerminal: React.FC<TerminalProps> = ({ logs }) => {
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logs.length > displayedLogs.length) {
      const nextLog = logs[displayedLogs.length];
      const timer = setTimeout(() => {
        setDisplayedLogs(prev => [...prev, nextLog]);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [logs, displayedLogs]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLogs]);

  return (
    <div className="glass-card p-4 font-mono text-sm h-64 overflow-hidden flex flex-col border-cyber-neon/30">
      <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-xs text-white/50 ml-2 uppercase tracking-widest">CloudSafe System Terminal</span>
      </div>
      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
        {displayedLogs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2"
          >
            <span className="text-cyber-neon font-bold">[{new Date().toLocaleTimeString()}]</span>
            <span className="text-cyber-blue">$</span>
            <span className="text-white/90">{log}</span>
          </motion.div>
        ))}
        <motion.div
          animate={{ opacity: [0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-4 bg-cyber-neon inline-block ml-1"
        />
      </div>
    </div>
  );
};

export default CyberTerminal;
