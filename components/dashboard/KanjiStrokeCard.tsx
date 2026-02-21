import React from 'react';
import { GlassCard } from '../UI';
import { RefreshCw } from 'lucide-react';

export const KanjiStrokeCard: React.FC = () => {
  // Mock data for a random Kanji/Vocab
  const item = {
    ja: '学',
    meaning: 'Study / Learn',
    reading: 'Gaku / Mana-bu',
    strokes: 8,
    order: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/%E5%AD%A6-bw.png/100px-%E5%AD%A6-bw.png'
  };

  return (
    <GlassCard className="h-full flex flex-col justify-between group">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[10px] font-black text-bamboo uppercase tracking-widest">Daily Kanji</h3>
        <button onClick={() => window.location.reload()} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <RefreshCw size={12} className="text-bamboo group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      <div className="flex-1 flex items-center gap-4">
        <div className="text-5xl font-jp font-black text-ink">{item.ja}</div>
        <div>
          <p className="text-sm font-black text-ink">{item.meaning}</p>
          <p className="text-[10px] font-bold text-bamboo">{item.reading}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-bamboo/10 flex items-center justify-between">
        <div className="text-[10px] font-bold text-bamboo">Strokes: {item.strokes}</div>
        <img src={item.order} alt="Stroke Order" className="w-10 h-10 opacity-60 grayscale hover:grayscale-0 transition-all" />
      </div>
    </GlassCard>
  );
};
