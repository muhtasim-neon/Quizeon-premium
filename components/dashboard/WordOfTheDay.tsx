import React from 'react';
import { GlassCard, Badge } from '../UI';
import { Book, Volume2, Quote } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export const WordOfTheDay: React.FC = () => {
  const { speak } = useSettings();
  
  // Mock Word of the Day
  const word = {
    ja: "冒険",
    romaji: "Bouken",
    en: "Adventure",
    bn: "অভিযান",
    context: "俺の冒険はここからだ！",
    contextEn: "My adventure starts here!",
    contextSource: "Anime Dialogue Line"
  };

  return (
    <GlassCard className="h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote size={80} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-ink flex items-center gap-2">
            <Book size={18} className="text-purple-500" /> Word of the Day
          </h3>
          <Badge color="bg-purple-50 text-purple-600 border-purple-100">N5 Level</Badge>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-4xl font-black text-ink font-jp">{word.ja}</h2>
            <button 
              onClick={() => speak(word.ja)}
              className="p-2 bg-rice rounded-full text-hanko hover:bg-hanko hover:text-white transition-all"
            >
              <Volume2 size={20} />
            </button>
          </div>
          <p className="text-sm font-bold text-bamboo mb-1">{word.romaji} • {word.en}</p>
          <p className="text-xs text-bamboo mb-4">Bengali: {word.bn}</p>

          <div className="bg-rice/50 p-3 rounded-xl border border-bamboo/10 italic">
            <p className="text-sm text-ink font-jp mb-1">"{word.context}"</p>
            <p className="text-[10px] text-bamboo">{word.contextEn}</p>
            <p className="text-[9px] text-hanko font-bold mt-1 uppercase tracking-wider">— {word.contextSource}</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
