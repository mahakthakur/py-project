import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim() || (!isLogin && !formData.name.trim())) return;
    
    // Pass combined state object back to parent handler
    onLoginSuccess({ 
      email: formData.email, 
      name: isLogin ? (formData.email.split('@')[0] || 'Developer') : formData.name 
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#070A13] font-sans text-slate-100 p-6">
      {/* Background Animated Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-2xl glass-panel relative z-10 mx-4 border border-slate-900 bg-slate-950/40 backdrop-blur-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500 tracking-tight mb-2">
            AuraCurriculum
          </h1>
          <p className="text-xs text-slate-400 mt-2">Initialize your user telemetry profile to access the engine.</p>
        </div>

        <div className="flex bg-slate-950/60 p-1 rounded-lg mb-6 border border-slate-800">
          <button 
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all duration-300 uppercase tracking-wider ${isLogin ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all duration-300 uppercase tracking-wider ${!isLogin ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">User Identity</label>
                <input 
                  type="text" 
                  required={!isLogin}
                  className="w-full bg-slate-900/60 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-slate-200 placeholder:text-slate-600 transition-colors"
                  placeholder="Enter your name..."
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full bg-slate-900/60 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-slate-200 placeholder:text-slate-600 transition-colors"
              placeholder="Enter your email..."
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required 
              className="w-full bg-slate-900/60 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-slate-200 placeholder:text-slate-600 transition-colors"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/10"
          >
            {isLogin ? 'Launch System Session' : 'Initialize Profile'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}