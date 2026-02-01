import React from 'react';
import { GlassCard, Button } from '../components/UI';
import { Flame, Trophy, CalendarCheck, ArrowRight, Brain, Zap, Swords, Crown } from 'lucide-react';
import { User, SkillStats } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// Logic for Ranking System
const getRank = (xp: number) => {
  if (xp < 1000) return { title: 'Initiate', icon: '🌱', next: 1000, color: 'text-slate-400' };
  if (xp < 3000) return { title: 'Ronin', icon: '🗡️', next: 3000, color: 'text-blue-400' };
  if (xp < 6000) return { title: 'Samurai', icon: '🎎', next: 6000, color: 'text-purple-400' };
  if (xp < 10000) return { title: 'Shogun', icon: '🏯', next: 10000, color: 'text-orange-400' };
  return { title: 'Grand Samurai', icon: '👑', next: 20000, color: 'text-yellow-400' };
};

// Github-style Activity Grid
const ActivityGrid = () => {
  const days = Array.from({ length: 91 }, (_, i) => {
    const r = Math.random();
    return r > 0.8 ? 2 : r > 0.5 ? 1 : 0;
  });
  
  return (
    <div className="flex gap-1 flex-wrap w-full max-w-[300px]">
       {days.map((d, i) => (
         <div 
            key={i} 
            className={`w-3 h-3 rounded-sm ${
                d === 2 ? 'bg-primary' : d === 1 ? 'bg-primary/40' : 'bg-white/5'
            }`} 
            title={`Day ${i}`}
         />
       ))}
    </div>
  );
};

export const UserDashboard: React.FC<{ user: User }> = ({ user }) => {
  const rank = getRank(user.xp || 0);
  
  // Mock Data for Radar Chart
  const radarData: SkillStats[] = [
    { subject: 'Kanji', A: 65, fullMark: 100 },
    { subject: 'Vocab', A: 80, fullMark: 100 },
    { subject: 'Recall', A: 95, fullMark: 100 },
    { subject: 'Listen', A: 50, fullMark: 100 },
    { subject: 'Grammar', A: 70, fullMark: 100 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome & Rank Header */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-serif">Oha, {user.username}-san! 👋</h1>
          <div className="flex items-center gap-3">
             <div className={`text-2xl ${rank.color} font-bold flex items-center gap-2`}>
                {rank.icon} {rank.title}
             </div>
             <span className="text-slate-500 text-sm">| {user.xp} XP</span>
          </div>
          {/* XP Bar */}
          <div className="mt-3 w-64 h-2 bg-white/5 rounded-full overflow-hidden relative">
             <div 
                className="h-full bg-gradient-to-r from-primary to-purple-500" 
                style={{ width: `${((user.xp || 0) / rank.next) * 100}%` }}
             ></div>
          </div>
          <p className="text-xs text-slate-500 mt-1">{rank.next - (user.xp || 0)} XP to next rank</p>
        </div>
        
        <div className="flex gap-4">
            <GlassCard className="py-2 px-4 flex flex-col items-center justify-center border-orange-500/30 !bg-orange-500/10 min-w-[100px]">
                <Flame className="text-orange-500 mb-1" size={24} />
                <span className="font-mono text-xl font-bold text-white leading-none">{user.streak || 0}</span>
                <span className="text-[10px] text-orange-400 uppercase font-bold">Day Streak</span>
            </GlassCard>
            <GlassCard className="py-2 px-4 flex flex-col items-center justify-center border-yellow-500/30 !bg-yellow-500/10 min-w-[100px]">
                <Crown className="text-yellow-500 mb-1" size={24} />
                <span className="font-mono text-xl font-bold text-white leading-none">Top 5%</span>
                <span className="text-[10px] text-yellow-400 uppercase font-bold">Ranking</span>
            </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar Chart (Skills) */}
          <GlassCard className="lg:col-span-1 min-h-[300px] flex flex-col items-center justify-center relative">
             <h3 className="absolute top-4 left-4 text-sm font-bold text-slate-400 uppercase tracking-wider">Skill Radar</h3>
             <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="My Skills" dataKey="A" stroke="#3a86ff" fill="#3a86ff" fillOpacity={0.4} />
                    </RadarChart>
                </ResponsiveContainer>
             </div>
          </GlassCard>

          {/* Daily Missions */}
          <GlassCard className="lg:col-span-2 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><Swords size={20} /></div>
                <h2 className="text-xl font-bold text-white">Daily Missions</h2>
             </div>
             
             <div className="space-y-4">
                {[
                    { title: "Complete 1 Vocab Quiz", xp: 50, done: true },
                    { title: "Learn 5 New Kanji", xp: 100, done: false },
                    { title: "Chat with Sensei", xp: 75, done: false }
                ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${m.done ? 'bg-green-500 border-green-500' : 'border-slate-500'}`}>
                                {m.done && <Zap size={12} className="text-dark-bg fill-current" />}
                            </div>
                            <span className={m.done ? 'text-slate-500 line-through' : 'text-white'}>{m.title}</span>
                        </div>
                        <span className="text-xs font-bold text-primary">+{m.xp} XP</span>
                    </div>
                ))}
             </div>
             <div className="mt-6 flex justify-end">
                <Button className="text-sm py-2">Claim All Rewards</Button>
             </div>
          </GlassCard>
      </div>

      {/* Activity Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Study Consistency</h3>
              <div className="flex gap-4">
                  <div className="flex-1">
                      <ActivityGrid />
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <span>Less</span>
                          <div className="w-2 h-2 bg-white/5 rounded-sm"></div>
                          <div className="w-2 h-2 bg-primary/40 rounded-sm"></div>
                          <div className="w-2 h-2 bg-primary rounded-sm"></div>
                          <span>More</span>
                      </div>
                  </div>
                  <div className="text-right">
                      <div className="text-2xl font-bold text-white">142</div>
                      <div className="text-xs text-slate-400">Total Contributions</div>
                      <div className="text-xl font-bold text-white mt-4">12</div>
                      <div className="text-xs text-slate-400">Current Streak</div>
                  </div>
              </div>
          </GlassCard>

          <GlassCard className="relative group cursor-pointer overflow-hidden border-primary/20" hoverEffect>
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                    <h3 className="text-xl font-bold text-white mb-1">Start SRS Review</h3>
                    <p className="text-sm text-slate-400">You have 12 items due for review based on Spaced Repetition.</p>
                 </div>
                 <Button className="self-start mt-4">
                    Review Now <ArrowRight size={18} />
                 </Button>
              </div>
              <Brain className="absolute bottom-[-20px] right-[-20px] text-primary/20 w-32 h-32" />
          </GlassCard>
      </div>
    </div>
  );
};
