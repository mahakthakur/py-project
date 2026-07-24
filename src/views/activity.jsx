import React from 'react';
import { motion } from 'framer-motion';

export default function Activity({ completedLessons }) {
  const mockActivityLog = [
    { timestamp: "Just now", action: "Completed lesson module 'SQLite Buffer Pool Synchronization'" },
    { timestamp: "2 hours ago", action: "Passed diagnostic evaluation quiz for Module 01 with 100% accuracy" },
    { timestamp: "1 day ago", action: "Ingested reference manuscript 'learning-python.pdf' into vector core" }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <span className="text-xs font-semibold text-indigo-400 tracking-widest uppercase">Telemetry Analytics</span>
        <h2 className="text-3xl font-black text-white tracking-tight mt-1">Operational Performance Hub</h2>
      </div>

      {/* Metrics Row Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl glass-panel bg-slate-900/20">
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Metrics Tracked</span>
          <span className="text-4xl font-black text-white block mt-2">{completedLessons.length}</span>
          <span className="text-xs text-cyan-400 mt-1 block">Completed lesson blocks</span>
        </div>
        <div className="p-5 rounded-xl glass-panel bg-slate-900/20">
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Active Vector Clusters</span>
          <span className="text-4xl font-black text-white block mt-2">1,409</span>
          <span className="text-xs text-indigo-400 mt-1 block">Tokenized embeddings synchronized</span>
        </div>
        <div className="p-5 rounded-xl glass-panel bg-slate-900/20">
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">LLM Latency Floor</span>
          <span className="text-4xl font-black text-white block mt-2">0.12s</span>
          <span className="text-xs text-emerald-400 mt-1 block">Groq telemetry inference target</span>
        </div>
      </div>

      {/* Chronological Action Logs */}
      <div className="p-6 rounded-xl glass-panel bg-slate-900/40">
        <h3 className="text-lg font-bold text-slate-200 mb-6 border-b border-slate-800 pb-3">Historical Engine Logs</h3>
        <div className="space-y-6">
          {mockActivityLog.map((log, index) => (
            <div key={index} className="flex gap-4 relative">
              {index !== mockActivityLog.length - 1 && (
                <div className="absolute top-6 bottom-[-24px] left-[7px] w-[2px] bg-slate-800" />
              )}
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-500/20 border-2 border-cyan-500 flex-shrink-0 mt-1 relative z-10" />
              <div>
                <span className="text-xs font-mono text-slate-500 block">{log.timestamp}</span>
                <p className="text-sm text-slate-300 mt-0.5">{log.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}