"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { 
  Shield, Search, X, Radio, Tv, Plus, Minus, 
  Navigation, Eye, EyeOff, User, Lock,
  Wind, Thermometer, Droplets, Gauge, Activity, RefreshCw, AlertTriangle,
  Volume2, VolumeX, Music
} from 'lucide-react';

const Globe = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => <div className="h-screen flex items-center justify-center text-emerald-500 font-mono animate-pulse uppercase tracking-[0.5em]">Establishing Orbital Link...</div>
});

const INITIAL_ZONES = [
  { lat: 25.27, lng: 55.29, city: "Dubai", type: "HEAT_ANOMALY" },
  { lat: 40.71, lng: -74.00, city: "New York", type: "FLOOD_RISK" },
  { lat: 19.07, lng: 72.87, city: "Mumbai", type: "STORM_SYNC" },
  { lat: 35.67, lng: 139.65, city: "Tokyo", type: "SEISMIC_GRID" },
  { lat: 28.61, lng: 77.20, city: "Delhi", type: "AIR_QUALITY" }
];

const VIDEOS = ["QaWWdg5qrdg", "KNUKou0gFxE", "9yOfV6Eh464", "tN5v5eiL2zY", "M7lc1UVf-VE"];

export default function Home() {
  const globeRef = useRef<any>(null);
  const playerRef = useRef<any>(null); // Ref for YouTube Player
  const [details, setDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [activeZones, setActiveZones] = useState<any[]>(INITIAL_ZONES);
  
  // Auth & Audio States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const API_KEY = "73a55a8803d65934551e3d5552156b1d";

  useEffect(() => {
    if (isAuthenticated && globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, [isAuthenticated]);

  // Handle YouTube Background Music
  const toggleAudio = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        playerRef.current.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
        setIsMuted(false);
      } else {
        playerRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        setIsMuted(true);
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "ELITE" && password === "1234") {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 1000);
    }
  };

  const triggerAlert = async (zone: any) => {
    globeRef.current.pointOfView({ lat: zone.lat, lng: zone.lng, altitude: 0.6 }, 1400);
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${zone.lat}&lon=${zone.lng}&appid=${API_KEY}&units=metric`);
      const data = await res.json();
      setDetails({
        city: zone.city, temp: Math.round(data.main.temp),
        wind: data.wind.speed, humidity: data.main.humidity,
        press: data.main.pressure, vis: data.visibility / 1000,
        lat: zone.lat, lng: zone.lng
      });
    } catch (e) { console.error("Signal Lost"); }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${API_KEY}&units=metric`);
      const data = await res.json();
      if (data.cod === 200) {
        const target = { lat: data.coord.lat, lng: data.coord.lon, city: data.name, type: "SEARCH_TARGET" };
        setActiveZones([target]); 
        triggerAlert(target);
        setSearchQuery("");
      }
    } catch (e) { alert("COORDINATES NOT RECOGNIZED"); }
  };

  const resetGrid = () => {
    setActiveZones(INITIAL_ZONES);
    setDetails(null);
    globeRef.current.pointOfView({ altitude: 2.2 }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full bg-[#020617] flex items-center justify-center font-mono relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <form onSubmit={handleLogin} className={`w-full max-w-md p-10 bg-slate-950/80 backdrop-blur-xl border ${authError ? 'border-red-500 animate-shake' : 'border-emerald-500/20'} rounded-[3rem] shadow-2xl z-50`}>
          <div className="text-center">
            <Shield className={`${authError ? 'text-red-500' : 'text-emerald-500'} mx-auto mb-6 ${!authError && 'animate-pulse'}`} size={48} />
            <h2 className="text-xl font-black text-white uppercase tracking-[0.3em] mb-2">Secure Uplink</h2>
            <p className="text-[10px] text-slate-500 mb-8 uppercase tracking-widest">Awaiting Authorization...</p>
          </div>
          <div className="space-y-4">
            <input required type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="OPERATOR_ID" className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white outline-none focus:border-emerald-500 uppercase" />
            <div className="relative">
              <input required type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="ACCESS_KEY" className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white outline-none focus:border-emerald-500" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 text-slate-500">{showPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.4em] hover:bg-emerald-400">Establish Connection</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <main className="h-screen bg-black text-slate-300 font-mono flex flex-col overflow-hidden">
      
      {/* HIDDEN TACTICAL AUDIO PLAYER (YouTube k39oVsZqyDQ) */}
      <iframe
        ref={playerRef}
        className="hidden"
        src="https://youtu.be/5gO0xpY_Y3E?si=y6wNlEy15gtmcr-t"
        allow="autoplay"
      />

      <nav className="z-[100] h-20 flex items-center justify-between px-10 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Shield className="text-emerald-500" size={24} />
          <h1 className="text-xs font-black uppercase tracking-[0.5em]">Elite X Monitor <span className="text-[8px] bg-emerald-500/10 px-2 py-1 rounded ml-2 text-emerald-400">OP: {username}</span></h1>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full max-w-lg">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="SEARCH PLANETARY GRID..." className="w-full bg-white/[0.05] border border-white/10 rounded-full py-3 px-12 text-[10px] uppercase tracking-widest outline-none focus:border-emerald-500 transition-all" />
          <Search className="absolute left-4 top-3 text-slate-500" size={16} />
        </form>

        <div className="flex gap-4 items-center">
          {/* AUDIO CONTROLLER */}
          <button 
            onClick={toggleAudio} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${!isMuted ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 animate-pulse' : 'bg-white/5 border-white/10 text-slate-500'}`}
          >
            {!isMuted ? <Volume2 size={14}/> : <VolumeX size={14}/>} 
            {!isMuted ? 'Uplink Live' : 'Uplink Muted'}
          </button>

          <button onClick={resetGrid} className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all text-[10px] font-black uppercase tracking-widest"><RefreshCw size={14}/></button>
          <button onClick={() => { setIsAuthenticated(false); setUsername(""); setPassword(""); setIsMuted(true); }} className="p-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white"><X size={18}/></button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className="w-[300px] flex flex-col border-r border-white/5 bg-black/40 backdrop-blur-md z-50">
          <div className="p-8 border-b border-white/5 text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-3">
            <Music size={16} className={!isMuted ? 'animate-spin' : ''} /> Operation Audio
          </div>
          <div className="p-6 text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter">
            Target audio synced: "k39oVsZqyDQ". Background frequency loop active for mission immersion.
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {activeZones.map((z, i) => (
              <button key={i} onClick={() => triggerAlert(z)} className="w-full text-left p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/40 transition-all group">
                <div className="text-sm font-black text-white group-hover:text-emerald-400 uppercase">{z.city}</div>
                <div className="text-[8px] text-slate-600 mt-1 uppercase">{z.type}</div>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />
          <Globe
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundColor="rgba(0,0,0,0)"
            htmlElementsData={activeZones}
            htmlElement={(d: any) => {
              const el = document.createElement('div');
              const isSelected = details?.city === d.city;
              el.innerHTML = `
                <div class="pointer-wrapper">
                  <div class="radar-ripple"></div>
                  <div class="bouncing-pin">
                    <svg viewBox="0 0 24 24" width="38" height="38" fill="#10b981" stroke="black" stroke-width="1.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3" fill="black"></circle>
                    </svg>
                  </div>
                  ${isSelected ? `
                    <div class="globe-popup-card">
                      <div class="scan-bar"></div>
                      <div class="card-content">
                        <div class="card-head"><span class="city">${d.city.toUpperCase()}</span></div>
                        <div class="card-grid">
                          <div class="grid-item"><span>TEMP</span><p>${details.temp}°C</p></div>
                          <div class="grid-item"><span>WIND</span><p>${details.wind}m/s</p></div>
                          <div class="grid-item"><span>HUMD</span><p>${details.humidity}%</p></div>
                          <div class="grid-item"><span>VISB</span><p>${details.vis}km</p></div>
                        </div>
                      </div>
                    </div>
                  ` : `<div class="mini-label">${d.city.toUpperCase()}</div>`}
                </div>
              `;
              el.onclick = () => triggerAlert(d);
              return el;
            }}
          />

          <div className="absolute bottom-6 left-0 right-0 h-48 z-[60] group/video-container">
            <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />
            
            <div className="overflow-x-auto flex h-full items-center px-10 custom-scrollbar-h scroll-smooth pointer-events-auto">
              <div className="flex animate-infinite-scroll hover:pause-scroll gap-6 w-max">
                {[...VIDEOS, ...VIDEOS, ...VIDEOS, ...VIDEOS].map((id, idx) => (
                  <div key={idx} className="w-72 aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-white/10 relative shrink-0 transition-all duration-500 hover:scale-105 hover:border-emerald-500">
                    <iframe src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}`} 
                      className="w-full h-full opacity-40 grayscale group-hover/video-container:opacity-50 hover:!opacity-100 hover:!grayscale-0 transition-all duration-700 pointer-events-none" 
                    />
                    <div className="absolute bottom-3 left-4 text-[8px] font-black text-emerald-500/80 bg-black/60 px-2 py-1 rounded">CAM_${idx % 5}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* PIN & UI ANIMATIONS */
        .pointer-wrapper { position: relative; display: flex; align-items: center; justify-content: center; width: 150px; height: 150px; cursor: pointer; }
        .bouncing-pin { z-index: 10; filter: drop-shadow(0 0 15px #10b981); animation: pinBounce 1.5s infinite ease-in-out; }
        .radar-ripple { position: absolute; width: 60px; height: 60px; border-radius: 50%; border: 2px solid #10b981; opacity: 0; animation: radarExpand 3s infinite; }
        
        .globe-popup-card {
          position: absolute; left: 50px; top: -50px; width: 180px; background: rgba(0,0,0,0.95);
          border: 1px solid rgba(16, 185, 129, 0.5); border-radius: 12px; padding: 12px;
          backdrop-blur: 15px; animation: cardFade 0.4s ease-out forwards;
        }
        .scan-bar { position: absolute; width: 100%; height: 1px; background: #10b981; top: 0; left: 0; animation: scanMove 2.5s linear infinite; }
        .card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 5px; }
        .grid-item span { font-size: 7px; color: #475569; display: block; font-weight: 800; }
        .grid-item p { font-size: 11px; font-weight: 900; color: #10b981; }
        .city { font-size: 13px; font-weight: 900; color: #fff; margin-bottom: 5px; display: block; letter-spacing: 0.1em; }

        /* VIDEO SCROLL */
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(calc(-100% / 4)); } }
        .animate-infinite-scroll { animation: scroll 60s linear infinite; }
        .pause-scroll:hover { animation-play-state: paused; }
        
        .bg-radial-vignette { background: radial-gradient(circle, transparent 30%, black 100%); }

        @keyframes pinBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes radarExpand { 0% { transform: scale(0.1); opacity: 1; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes cardFade { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes scanMove { 0% { top: 0; } 100% { top: 100%; } }

        .custom-scrollbar-h::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar-h::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </main>
  );
}