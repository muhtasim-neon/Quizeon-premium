import React from 'react';
import { GlassCard } from '../UI';
import { progressService } from '../../services/progressService';
import { Brain } from 'lucide-react';

export const SRSHealth: React.FC = () => {
  const srsHealth = progressService.getSRSHealth();

  return (
    <GlassCard className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="text-hanko" size={20} />
        <h3 className="text-lg font-bold">SRS Health (স্মরণশক্তি)</h3>
      </div>
      <div className="space-y-4">
        {srsHealth.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>{item.category}</span>
              <span className={item.health > 80 ? "text-green-600" : item.health > 50 ? "text-yellow-600" : "text-red-600"}>
                {item.health}%
              </span>
            </div>
            <div className="w-full h-2 bg-rice rounded-full overflow-hidden border border-black/5">
              <div 
                className={`h-full transition-all duration-1000 ${
                  item.health > 80 ? "bg-green-500" : item.health > 50 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${item.health}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-bamboo mt-1">
              <span>Due: {item.dueCount} items</span>
              <span>Next: {item.nextReviewDate}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
