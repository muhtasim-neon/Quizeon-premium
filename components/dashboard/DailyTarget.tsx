import React, { useState, useEffect } from 'react';
import { GlassCard, Badge } from '../UI';
import { Target, Sparkles, Loader2 } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { progressService } from '../../services/progressService';
import { User } from '../../types';

interface DailyTargetProps {
  user: User;
}

export const DailyTarget: React.FC<DailyTargetProps> = ({ user }) => {
  const [target, setTarget] = useState<{
    message: string;
    newItems: number;
    reviews: number;
    progress: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoal = async () => {
      setLoading(true);
      const mistakes = progressService.getMistakes();
      const srsDue = progressService.getSRSDueCount();
      
      const aiGoal = await aiService.generateDailyGoal({
        xp: user.xp || 0,
        streak: user.streak || 0,
        mistakesCount: mistakes.length,
        srsDueCount: srsDue
      });
      
      setTarget(aiGoal);
      setLoading(false);
    };

    fetchGoal();
  }, [user.xp, user.streak]);

  return (
    <GlassCard className="h-full relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-200/20 rounded-full blur-xl group-hover:bg-blue-300/30 transition-colors"></div>
      
      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-white/60 rounded-xl backdrop-blur-sm border border-white/50 shadow-sm">
            <Target size={20} className="text-blue-500" />
          </div>
          <Badge color="bg-blue-50 text-blue-600 border-blue-100 flex items-center gap-1">
            <Sparkles size={12} /> AI Target
          </Badge>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-bold text-ink mb-2">Daily Mokuhyou (আজকের লক্ষ্য)</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-blue-500" size={24} />
            </div>
          ) : target ? (
            <>
              <p className="text-xs text-bamboo leading-relaxed mb-4">{target.message}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-ink">
                  <span>Overall Progress</span>
                  <span>{target.progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden border border-blue-200/50">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${target.progress}%` }}
                  ></div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-bamboo italic">লক্ষ্য নির্ধারণ করা যাচ্ছে না।</p>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
