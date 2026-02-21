import React from 'react';
import { GlassCard } from '../UI';
import { Zap, Heart } from 'lucide-react';
import { progressService } from '../../services/progressService';

export const GamanMeter: React.FC = () => {
  const gaman = progressService.getGamanState();
  const progress = (gaman.points / (gaman.level * 100)) * 100;

  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-xs text-ink flex items-center gap-1">
          <Zap size={14} className="text-orange-500 fill-orange-500" /> Gaman (ধৈর্য্য)
        </h3>
        <span className="text-[10px] font-black text-orange-600">LVL {gaman.level}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-between text-[10px] font-bold text-ink mb-1">
          <span>Patience Points</span>
          <span>{gaman.points} / {gaman.level * 100}</span>
        </div>
        <div className="w-full h-3 bg-rice border border-bamboo/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <p className="text-[9px] text-bamboo mt-2 leading-tight">
        ধারাবাহিকতা এবং কঠিন বিষয় বারবার চেষ্টা করার উপর ভিত্তি করে এই পয়েন্ট দেওয়া হয়।
      </p>
    </GlassCard>
  );
};
