import React from 'react';
import { GlassCard } from '../UI';
import { Map, MapPin, CheckCircle2 } from 'lucide-react';
import { progressService } from '../../services/progressService';

export const JapanJourney: React.FC = () => {
  const journey = progressService.getJourneyState();
  const cities = [
    { name: 'Tokyo', jp: '東京', desc: 'Starting point' },
    { name: 'Osaka', jp: '大阪', desc: 'Katakana Master' },
    { name: 'Kyoto', jp: '京都', desc: 'N5 Kanji Master' },
    { name: 'Hiroshima', jp: '広島', desc: 'Grammar Master' },
    { name: 'Sapporo', jp: '札幌', desc: 'JLPT N5 Ready' }
  ];

  const currentIndex = cities.findIndex(c => c.name === journey.currentCity);

  return (
    <GlassCard className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-ink flex items-center gap-2">
          <Map size={18} className="text-emerald-500" /> Journey Across Japan
        </h3>
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          {journey.currentCity}
        </span>
      </div>

      <div className="flex-1 relative mt-4">
        {/* Path Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-emerald-100"></div>
        
        <div className="space-y-6 relative z-10">
          {cities.map((city, index) => {
            const isUnlocked = journey.unlockedCities.includes(city.name);
            const isCurrent = city.name === journey.currentCity;
            
            return (
              <div key={city.name} className="flex items-start gap-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                  ${isCurrent ? 'bg-emerald-500 border-emerald-600 text-white animate-pulse' : 
                    isUnlocked ? 'bg-emerald-100 border-emerald-500 text-emerald-600' : 
                    'bg-gray-50 border-gray-200 text-gray-300'}
                `}>
                  {isUnlocked && !isCurrent ? <CheckCircle2 size={16} /> : <MapPin size={16} />}
                </div>
                
                <div className={`flex-1 ${isUnlocked ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xs font-black text-ink">{city.name} <span className="font-jp ml-1">{city.jp}</span></h4>
                    {isCurrent && <span className="text-[10px] font-bold text-emerald-600">{journey.progress}%</span>}
                  </div>
                  <p className="text-[10px] text-bamboo">{city.desc}</p>
                  
                  {isCurrent && (
                    <div className="w-full h-1 bg-emerald-100 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000" 
                        style={{ width: `${journey.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <p className="text-[9px] text-bamboo mt-4 italic text-center">
        "নতুন শহরে পৌঁছালে সেই শহরের সংস্কৃতি ও খাবার সংক্রান্ত কুইজ আনলক হবে।"
      </p>
    </GlassCard>
  );
};
