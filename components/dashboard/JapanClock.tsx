import React, { useState, useEffect } from 'react';
import { GlassCard } from '../UI';
import { MapPin, Sun, Moon, Calendar } from 'lucide-react';
import { progressService } from '../../services/progressService';

export const JapanClock: React.FC = () => {
  const [japanTime, setJapanTime] = useState(new Date());
  const seasonalEvent = progressService.getSeasonalEvent();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const jst = new Date(utc + (3600000 * 9));
      setJapanTime(jst);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getSeason = (date: Date) => {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return { name: 'Spring (বসন্ত)', icon: '🌸' };
    if (month >= 5 && month <= 7) return { name: 'Summer (গ্রীষ্ম)', icon: '☀️' };
    if (month >= 8 && month <= 10) return { name: 'Autumn (শরৎ)', icon: '🍁' };
    return { name: 'Winter (শীত)', icon: '❄️' };
  };

  const season = getSeason(japanTime);
  const hour = japanTime.getHours();
  const isDay = hour > 6 && hour < 18;

  return (
    <GlassCard className="h-full relative overflow-hidden group">
      <div className={`absolute inset-0 opacity-10 transition-colors duration-1000 ${isDay ? 'bg-blue-400' : 'bg-indigo-900'}`}></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-hanko" />
            <span className="text-[10px] font-bold text-ink uppercase tracking-wider">Tokyo, Japan</span>
          </div>
          {isDay ? <Sun className="text-yellow-500 animate-spin-slow" size={20} /> : <Moon className="text-blue-300 animate-pulse" size={20} />}
        </div>

        <div className="flex flex-col items-center text-center mb-4">
          <div className="text-2xl font-black text-ink font-mono">
            {japanTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
          </div>
          <p className="text-[8px] text-bamboo font-bold uppercase tracking-[0.2em]">JST</p>
        </div>

        <div className="space-y-3 pt-3 border-t border-bamboo/10">
          <div className="flex items-center gap-2">
            <span className="text-xl">{season.icon}</span>
            <div>
              <p className="text-[8px] font-bold text-bamboo uppercase">Season</p>
              <p className="text-[10px] font-bold text-ink leading-tight">{season.name}</p>
            </div>
          </div>

          {seasonalEvent && (
            <div className="bg-hanko/5 p-2 rounded-lg border border-hanko/10">
              <div className="flex items-center gap-1 mb-1">
                <Calendar size={10} className="text-hanko" />
                <span className="text-[9px] font-black text-hanko uppercase tracking-wider">{seasonalEvent.name}</span>
              </div>
              <p className="text-[9px] text-ink font-bold mb-1">{seasonalEvent.description}</p>
              <p className="text-[9px] text-hanko font-black">Word: {seasonalEvent.vocab}</p>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
