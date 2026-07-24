import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ completed, total, title }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-slate-900/45 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
      <div className="w-full md:w-3/4">
        <h2 className="text-xl font-bold text-slate-100 mb-2 truncate">{title}</h2>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
      <div className="text-right min-w-[120px]">
        <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Total Progress</span>
        <span className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {percentage}%
        </span>
      </div>
    </div>
  );
}