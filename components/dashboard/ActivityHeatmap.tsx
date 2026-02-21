import React from 'react';
import { GlassCard } from '../UI';
import { progressService } from '../../services/progressService';

export const ActivityHeatmap: React.FC = () => {
  const data = progressService.getHeatmapData();
  
  // Group data into weeks for display
  const weeks: any[][] = [];
  let currentWeek: any[] = [];
  
  data.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getColor = (count: number) => {
    if (count === 0) return 'bg-rice border-bamboo/5';
    if (count === 1) return 'bg-green-100 border-green-200';
    if (count === 2) return 'bg-green-300 border-green-400';
    if (count === 3) return 'bg-green-500 border-green-600';
    return 'bg-green-700 border-green-800';
  };

  return (
    <GlassCard className="h-full">
      <h3 className="text-lg font-bold mb-4">Activity Heatmap (ধারাবাহিকতা)</h3>
      <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar">
        {weeks.map((week, wIndex) => (
          <div key={wIndex} className="flex flex-col gap-1">
            {week.map((day, dIndex) => (
              <div 
                key={dIndex}
                className={`w-3 h-3 rounded-sm border ${getColor(day.count)}`}
                title={`${day.date}: ${day.count} activities`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-2 text-[10px] text-bamboo">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-rice border border-bamboo/5"></div>
          <div className="w-2 h-2 bg-green-100 border border-green-200"></div>
          <div className="w-2 h-2 bg-green-300 border border-green-400"></div>
          <div className="w-2 h-2 bg-green-500 border border-green-600"></div>
          <div className="w-2 h-2 bg-green-700 border border-green-800"></div>
        </div>
        <span>More</span>
      </div>
    </GlassCard>
  );
};
