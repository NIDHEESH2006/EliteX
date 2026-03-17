"use client";

import { useState } from 'react';
import { Play, X, Radio } from 'lucide-react';

export default function LiveMonitor() {
  const [isLive, setIsLive] = useState(false);
  const streamId = "30JpE_0vX2M"; // ABC News 24/7

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100]">
      {isLive && (
        <div className="absolute bottom-16 right-8 w-80 aspect-video bg-black border border-emerald-500/40 rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute top-2 left-2 z-10 bg-red-600 px-2 py-0.5 rounded text-[8px] font-black flex items-center gap-1">
             <Radio size={10} /> LIVE
          </div>
          <button onClick={() => setIsLive(false)} className="absolute top-2 right-2 z-10 text-white/50 hover:text-white"><X size={16}/></button>
          <iframe 
            width="100%" height="100%" 
            src={`https://www.youtube.com/embed/${streamId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`} 
            allow="autoplay; encrypted-media"
            className="w-full h-full"
          />
        </div>
      )}

      <div className="bg-slate-950 border-t border-white/5 h-12 flex items-center">
        <button 
          onClick={() => setIsLive(!isLive)}
          className="bg-emerald-500 h-full px-6 flex items-center gap-2 hover:bg-emerald-400 transition-colors"
        >
          <Play size={14} className="text-slate-950 fill-current" />
          <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Live Monitor</span>
        </button>
        <div className="flex-1 overflow-hidden">
          <div className="flex animate-scroll-text whitespace-nowrap py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="mx-12 text-[10px] font-mono text-slate-500">
                <span className="text-emerald-500">●</span> SATELLITE LINK ESTABLISHED... GLOBAL TEMP: +1.2C VARIANCE...
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}