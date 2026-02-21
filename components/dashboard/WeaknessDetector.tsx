import React from 'react';
import { GlassCard } from '../UI';
import { AlertCircle, Brain } from 'lucide-react';

export const WeaknessDetector: React.FC = () => {
  const weaknesses = [
    { type: 'Kana', message: 'You struggle with きゃ / ぎゃ sounds', severity: 'medium' },
    { type: 'Kanji', message: '日 vs 目 confusion detected', severity: 'high' },
    { type: 'Vocab', message: 'Common mistake: 食べる vs 飲む', severity: 'low' }
  ];

  return (
    <GlassCard className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm text-ink flex items-center gap-2">
          <Brain size={16} className="text-hanko" /> AI Weakness Detector
        </h3>
      </div>

      <div className="space-y-3">
        {weaknesses.map((w, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-bamboo/10">
            <AlertCircle size={14} className={w.severity === 'high' ? 'text-red-500' : 'text-orange-500'} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-bamboo">{w.type}</p>
              <p className="text-xs font-bold text-ink leading-tight">{w.message}</p>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-[9px] text-bamboo mt-4 italic">
        "System automatically detects repeating patterns in your mistakes."
      </p>
    </GlassCard>
  );
};
