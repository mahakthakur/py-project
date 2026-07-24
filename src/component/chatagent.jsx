import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ChatAgent() {
  const [messages, setMessages] = useState([
    { role: 'system', text: 'Hello! I am your RAG core agent. Ask me anything explicitly located inside your parsed PDF layers.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simulated fetch connection pointing right into your Python server framework endpoint
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'system', 
        text: `Vector storage response lookup completed. Based on the document context, your system allocates data across contiguous segments avoiding heap overhead.` 
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="w-full h-[580px] rounded-xl glass-panel bg-slate-900/40 flex flex-col overflow-hidden border-slate-800">
      <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white tracking-wide">Llama-3.3 Core Assessor</h4>
          <span className="text-[11px] font-mono text-emerald-400 block flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Connected to Index Cache
          </span>
        </div>
      </div>

      {/* Messages Array */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3.5 py-2 rounded-xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none' : 'bg-slate-950/80 border border-slate-800 text-slate-300 rounded-tl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-950/80 border border-slate-800 text-slate-500 px-4 py-2 rounded-xl rounded-tl-none text-xs flex gap-1 items-center animate-pulse">
              Running semantic mapping search...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Frame */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950/60 border-t border-slate-800 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Query document context layers..."
          className="flex-1 bg-slate-900/90 border border-slate-800 text-xs rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold px-4 rounded-lg transition-colors">
          Query
        </button>
      </form>
    </div>
  );
}