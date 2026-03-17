"use client";

import { motion } from 'framer-motion';
import { Globe, AlertCircle } from 'lucide-react';

export default function NewsTicker({ news }: { news: any[] }) {
  if (!news || news.length === 0) return null;

  // Duplicate items for a seamless loop
  const tickerItems = [...news, ...news, ...news];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-emerald-500/20 z-[100] h-12 flex items-center overflow-hidden">
      {/* Static Label */}
      <div className="flex items-center bg-emerald-500 px-4 h-full z-20 shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
        <Globe size={16} className="text-slate-950 animate-spin-slow" />
        <span className="ml-2 text-[10px] font-black text-slate-950 uppercase tracking-tighter whitespace-nowrap">
          EliteX Live Feed
        </span>
      </div>

      {/* Scrolling Content */}
      <motion.div 
        className="flex whitespace-nowrap items-center"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
      >
        {tickerItems.map((article, index) => (
          <div key={index} className="flex items-center px-10 border-r border-white/5">
            <AlertCircle size={12} className="text-emerald-500 mr-3 opacity-50" />
            <span className="text-[10px] text-slate-500 font-mono mr-3">[{article.source.name.toUpperCase()}]</span>
            <a 
              href={article.url} 
              target="_blank" 
              className="text-[11px] text-slate-300 hover:text-emerald-400 transition-colors tracking-wide font-medium"
            >
              {article.title}
            </a>
          </div>
        ))}
      </motion.div>
    </div>
  );
}