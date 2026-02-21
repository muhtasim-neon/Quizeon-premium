import React from 'react';
import { GlassCard, Badge } from '../UI';
import { Users, Trophy } from 'lucide-react';

export const LeaderboardWidget: React.FC = () => {
  // Mock batch leaderboard
  const batchData = [
    { name: 'You', xp: 2450, rank: 5, isUser: true },
    { name: 'Tanaka', xp: 3100, rank: 1 },
    { name: 'Sakura', xp: 2900, rank: 2 },
    { name: 'Kenji', xp: 2750, rank: 3 },
    { name: 'Yumi', xp: 2600, rank: 4 },
  ];

  return (
    <GlassCard className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-ink flex items-center gap-2">
          <Users size={18} className="text-blue-500" /> Batch Leaderboard
        </h3>
        <Badge color="bg-blue-50 text-blue-600 border-blue-100">Batch #42</Badge>
      </div>

      <p className="text-[10px] text-bamboo mb-4">আপনার ব্যাচে আপনি ৫ম স্থানে আছেন।</p>

      <div className="space-y-2">
        {batchData.map((player, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-2 rounded-xl border transition-all
              ${player.isUser ? 'bg-hanko/5 border-hanko/20 shadow-sm' : 'bg-rice/50 border-bamboo/5'}
            `}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xs font-black w-4 ${index === 0 ? 'text-yellow-500' : 'text-bamboo'}`}>
                {player.rank}
              </span>
              <span className={`text-xs font-bold ${player.isUser ? 'text-hanko' : 'text-ink'}`}>
                {player.name}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black text-ink">{player.xp}</span>
              <span className="text-[8px] font-bold text-bamboo uppercase">XP</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
