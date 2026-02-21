import React from 'react';
import { GlassCard } from '../UI';
import { BarChart3, Timer, Target, TrendingUp } from 'lucide-react';

interface PerformanceAnalyticsProps {
  data: {
    accuracy: number;
    avgResponseTime: string;
    weakCategory: string;
    studyTimeData: { day: string; hours: number }[];
  };
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ data }) => {
  return (
    <GlassCard className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-sm text-ink flex items-center gap-2">
          <BarChart3 size={16} className="text-blue-500" /> Performance Analytics
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <Target size={12} className="text-blue-600" />
            <span className="text-[10px] font-black text-blue-900 uppercase">Accuracy</span>
          </div>
          <p className="text-xl font-black text-blue-900">{data.accuracy}%</p>
        </div>
        
        <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
          <div className="flex items-center gap-2 mb-1">
            <Timer size={12} className="text-indigo-600" />
            <span className="text-[10px] font-black text-indigo-900 uppercase">Avg Time</span>
          </div>
          <p className="text-xl font-black text-indigo-900">{data.avgResponseTime}</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-end h-24 gap-2">
          {data.studyTimeData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-blue-500 rounded-t-lg transition-all duration-1000" 
                style={{ height: `${(d.hours / 3) * 100}%` }}
              ></div>
              <span className="text-[8px] font-bold text-bamboo uppercase">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-bamboo/10 flex items-center gap-2">
        <TrendingUp size={14} className="text-emerald-500" />
        <p className="text-[10px] font-bold text-ink">Weak: <span className="text-hanko">{data.weakCategory}</span></p>
      </div>
    </GlassCard>
  );
};
