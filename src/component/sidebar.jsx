import React from 'react';
import AnimatedWrapper from "../component/animatedwrapper.jsx";

export default function Sidebar({ user, currentView, setView, onFileUpload, isUploading }) {
  return (
    <div className="w-80 h-screen fixed left-0 top-0 bg-slate-950/45 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between text-slate-200 z-50">
      <div className="space-y-8">
        {/* User Identity Segment */}
        <AnimatedWrapper delay={0.05}>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              ⚡ Welcome, {user?.name || 'Academic'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 truncate">{user?.email}</p>
          </div>
        </AnimatedWrapper>

        {/* Navigation Core Matrix */}
        <nav className="space-y-2">
          <button
            onClick={() => setView('Dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentView === 'Dashboard'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📖</span> <span>Curriculum Workspace</span>
          </button>
          
          <button
            onClick={() => setView('Activity')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentView === 'Activity'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📊</span> <span>Telemetry Analytics</span>
          </button>
        </nav>

        {/* RAG Document Ingestion Hub */}
        <div className="pt-6 border-t border-white/10">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            📥 Document Ingestion Core
          </h4>
          <label className="group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 hover:border-cyan-500/50 rounded-2xl cursor-pointer bg-white/[0.02] hover:bg-cyan-500/[0.02] transition-all duration-300">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📄</span>
              <p className="text-xs text-slate-400 group-hover:text-slate-200">
                {isUploading ? 'Ingesting Pipeline...' : 'Upload target technical PDF'}
              </p>
            </div>
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              disabled={isUploading}
              onChange={onFileUpload} 
            />
          </label>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500">
        AuraCurriculum Engine • v2.6
      </div>
    </div>
  );
}