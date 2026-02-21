import React, { useState } from 'react';
import { GlassCard, Input } from '../UI';
import { Search, Info } from 'lucide-react';

export const RadicalLookup: React.FC = () => {
  const [query, setQuery] = useState('');
  
  // Mock radical data
  const radicals: Record<string, { meaning: string, examples: string[] }> = {
    '日': { meaning: 'Sun/Day', examples: ['明', '曜', '時'] },
    '月': { meaning: 'Moon/Month', examples: ['明', '有', '朝'] },
    '木': { meaning: 'Tree/Wood', examples: ['本', '校', '森'] },
    '水': { meaning: 'Water', examples: ['海', '泳', '汁'] },
  };

  const result = radicals[query];

  return (
    <GlassCard className="h-full flex flex-col">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Search size={18} className="text-blue-500" /> Radical Lookup
      </h3>
      
      <div className="relative mb-4">
        <Input 
          placeholder="Enter Kanji (e.g. 日)" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-bamboo">
          <Info size={16} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {result ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-black text-ink font-jp">{query}</span>
              <div>
                <p className="text-[10px] font-bold text-bamboo uppercase">Meaning</p>
                <p className="text-sm font-bold text-ink">{result.meaning}</p>
              </div>
            </div>
            <p className="text-[10px] font-bold text-bamboo uppercase mb-1">Common Compounds</p>
            <div className="flex gap-2">
              {result.examples.map((ex, i) => (
                <span key={i} className="bg-rice px-2 py-1 rounded border border-bamboo/10 text-sm font-jp">{ex}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-bamboo italic">কাঞ্জির অর্থ এবং radicals দেখতে এখানে ক্লিক করুন।</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
