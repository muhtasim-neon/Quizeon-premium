import React from 'react';
import { GlassCard } from '../UI';
import { Trophy } from 'lucide-react';

export const JLPTMeter: React.FC<{ xp: number }> = ({ xp }) => {
  const levels = [
    { name: 'N5', required: 5000 },
    { name: 'N4', required: 15000 },
    { name: 'N3', required: 40000 },
    { name: 'N2', required: 100000 },
    { name: 'N1', required: 250000 },
  ];

  const currentLevel = levels.find(l => xp < l.required) || levels[levels.length - 1];
  const prevLevel = levels[levels.indexOf(currentLevel) - 1] || { required: 0 };
  const progress = Math.min(100, ((xp - prevLevel.required) / (currentLevel.required - prevLevel.required)) * 100);

  return (
    <GlassCard className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-ink flex items-center gap-2">
          <Trophy size={18} className="text-yellow-500" /> JLPT Progress
        </h3>
        <span className="text-xs font-black text-hanko bg-hanko/10 px-2 py-1 rounded-lg">Target: {currentLevel.name}</span>
      </div>

      <div className="space-y-6 mt-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-hanko bg-hanko/10">
                Overall Mastery
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-hanko">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-rice border border-bamboo/10">
            <div 
              style={{ width: `${progress}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-hanko transition-all duration-1000"
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1">
          {levels.map((l, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 mb-1
                ${xp >= l.required ? 'bg-green-100 border-green-500 text-green-600' : 
                  currentLevel.name === l.name ? 'bg-blue-100 border-blue-500 text-blue-600 animate-pulse' : 
                  'bg-gray-50 border-gray-200 text-gray-400'}
              `}>
                {l.name}
              </div>
              <div className={`h-1 w-full rounded ${xp >= l.required ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
