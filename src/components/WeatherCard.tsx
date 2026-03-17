import { Sun, Wind, Droplets, Cloud, CloudRain, Thermometer } from 'lucide-react';

export default function WeatherCard({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-8 rounded-[2rem] text-white shadow-2xl">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Thermometer size={16} className="text-emerald-500" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Ambient Temp</span>
          </div>
          <h2 className="text-7xl font-light tracking-tighter">
            {Math.round(data.main.temp)}°C
          </h2>
          <p className="text-slate-400 mt-2 text-xl font-medium">{data.name}</p>
          <p className="text-emerald-400 capitalize text-sm font-mono mt-1">{data.weather[0].description}</p>
        </div>
        <div className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
          <Sun className="text-emerald-400 w-12 h-12 animate-pulse" />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
        <div className="flex flex-col items-center gap-2">
          <Wind className="text-slate-500" size={20}/>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Wind Speed</span>
          <span className="font-bold">{data.wind.speed} m/s</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Droplets className="text-slate-500" size={20}/>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Humidity</span>
          <span className="font-bold">{data.main.humidity}%</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Cloud className="text-slate-500" size={20}/>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Pressure</span>
          <span className="font-bold">{data.main.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
}