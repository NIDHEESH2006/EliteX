import { ExternalLink } from 'lucide-react';

export default function NewsGrid({ news }: { news: any[] }) {
  if (!news || news.length === 0) {
    return (
      <div className="text-slate-600 italic text-sm py-10 border border-dashed border-white/10 rounded-2xl text-center">
        No climate reports currently streaming from the engine.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {news.map((item, i) => (
        <a 
          key={i} 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group bg-slate-900/40 rounded-3xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-300 shadow-lg"
        >
          <div className="h-44 overflow-hidden relative">
            <img 
              src={item.image || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05'} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
            <div className="absolute bottom-3 left-4">
              <span className="text-[9px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">
                {item.source.name}
              </span>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-medium text-white text-sm line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-1 mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Read Intelligence <ExternalLink size={10} />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}