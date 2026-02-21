import React from 'react';
import { GlassCard } from '../UI';
import { Calendar, TrendingUp } from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell 
} from 'recharts';

export const ReviewPredictor: React.FC = () => {
  // Mock workload data for the next 7 days
  const data = [
    { day: 'Mon', reviews: 12 },
    { day: 'Tue', reviews: 18 },
    { day: 'Wed', reviews: 8 },
    { day: 'Thu', reviews: 25 },
    { day: 'Fri', reviews: 15 },
    { day: 'Sat', reviews: 30 },
    { day: 'Sun', reviews: 10 },
  ];

  return (
    <GlassCard className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-ink flex items-center gap-2">
          <Calendar size={18} className="text-blue-500" /> Review Predictor
        </h3>
        <TrendingUp size={18} className="text-bamboo opacity-50" />
      </div>
      
      <p className="text-xs text-bamboo mb-6">Predicted workload for the next 7 days based on your learning pace.</p>

      <div className="flex-1 w-full min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#8e9299', fontWeight: 'bold' }} 
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="reviews" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.reviews > 20 ? '#e11d48' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-[10px] text-blue-800 font-bold">
          Tip: Saturday looks busy! Try to finish some reviews early on Friday.
        </p>
      </div>
    </GlassCard>
  );
};
