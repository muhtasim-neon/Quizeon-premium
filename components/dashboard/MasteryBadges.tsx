import React from 'react';
import { GlassCard } from '../UI';
import { progressService } from '../../services/progressService';
import { Award } from 'lucide-react';

export const MasteryBadges: React.FC = () => {
  const badges = progressService.getMasteryBadges();

  return (
    <GlassCard className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-ink flex items-center gap-2">
          <Award size={18} className="text-yellow-500" /> Mastery Badges
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`flex flex-col items-center text-center group cursor-help transition-all
              ${badge.unlocked ? 'opacity-100' : 'opacity-30 grayscale'}
            `}
            title={badge.description}
          >
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 shadow-inner border-2
              ${badge.unlocked ? 'bg-yellow-50 border-yellow-200 group-hover:scale-110' : 'bg-gray-100 border-gray-200'}
            `}>
              {badge.icon}
            </div>
            <span className="text-[9px] font-black text-ink uppercase tracking-tighter leading-tight">
              {badge.name}
            </span>
          </div>
        ))}
      </div>
      
      <p className="text-[10px] text-bamboo mt-6 text-center italic">
        "নোম নিনজা" (খাবারের নাম সংক্রান্ত শব্দে পারদর্শী)
      </p>
    </GlassCard>
  );
};
