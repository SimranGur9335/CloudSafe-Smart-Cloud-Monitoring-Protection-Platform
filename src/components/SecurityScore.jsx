import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SecurityScore({ score }) {
  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [
          score > 80 ? '#00ffcc' : score > 50 ? '#f59e0b' : '#ef4444',
          'rgba(255, 255, 255, 0.05)',
        ],
        borderWidth: 0,
        circumference: 270,
        rotation: 225,
      },
    ],
  };

  const options = {
    cutout: '85%',
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center relative h-64 overflow-hidden group">
      <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl" />
      <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 absolute top-6">Security Integrity</h3>
      <div className="w-48 h-48 relative z-10">
        <Doughnut data={data} options={options} />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4 z-10">
        <span className="text-6xl font-black tracking-tighter neon-text italic">{score}</span>
        <span className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1 font-bold">Health Index</span>
      </div>
    </div>
  );
}
