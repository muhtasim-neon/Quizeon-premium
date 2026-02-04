
import React from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { 
  Trophy, TrendingUp, Target, Zap, AlertCircle, 
  Gamepad2, CheckCircle2, Medal, Flame, 
  Brain, Timer, GraduationCap, Keyboard
} from 'lucide-react';
import { User, SkillStats } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useNavigate } from 'react-router-dom';

// --- HELPERS ---

const getRank = (xp: number) => {
  if (xp < 1000) return { title: 'Initiate', icon: '🌱', next: 1000, color: 'text-green-600', border: 'border-green-200', bg: 'bg-green-50' };
  if (xp < 3000) return { title: 'Ronin', icon: '🗡️', next: 3000, color: 'text-ink', border: 'border-ink/20', bg: 'bg-ink/5' };
  if (xp < 6000) return { title: 'Samurai', icon: '🎎', next: 6000, color: 'text-straw', border: 'border-straw', bg: 'bg-straw/10' };
  if (xp < 10000) return { title: 'Shogun', icon: '🏯', next: 10000, color: 'text-hanko', border: 'border-hanko', bg: 'bg-hanko/10' };
  return { title: 'Grand Master', icon: '👑', next: 20000, color: 'text-yellow-600', border: 'border-yellow-400', bg: 'bg-yellow-50' };
};

// --- SUB-COMPONENTS ---

const PowerMetrics = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <GlassCard className="p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:-translate-y-1 transition-transform border-purple-100 hover:border-purple-300">
                <div className="absolute top-[-10px] right-[-10px] text-purple-50 group-hover:text-purple-100 transition-colors pointer-events-none">
                    <Brain size={70} />
                </div>
                <div className="text-3xl font-black text-purple-600 mb-1 relative z-10">68%</div>
                <div className="text-[10px] text-bamboo font-bold uppercase tracking-widest flex items-center gap-1 relative z-10 bg-white/50 px-2 py-0.5 rounded-full">
                    <Brain size={12} /> Mastery Score
                </div>
            </GlassCard>
            
            <GlassCard className="p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:-translate-y-1 transition-transform border-yellow-100 hover:border-yellow-300">
                 <div className="absolute top-[-10px] right-[-10px] text-yellow-50 group-hover:text-yellow-100 transition-colors pointer-events-none">
                    <Zap size={70} />
                </div>
                <div className="text-3xl font-black text-yellow-600 mb-1 relative z-10">85%</div>
                <div className="text-[10px] text-bamboo font-bold uppercase tracking-widest flex items-center gap-1 relative z-10 bg-white/50 px-2 py-0.5 rounded-full">
                    <Zap size={12} /> Avg Accuracy
                </div>
            </GlassCard>

            <GlassCard className="p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:-translate-y-1 transition-transform border-green-100 hover:border-green-300">
                 <div className="absolute top-[-10px] right-[-10px] text-green-50 group-hover:text-green-100 transition-colors pointer-events-none">
                    <Timer size={70} />
                </div>
                <div className="text-3xl font-black text-green-600 mb-1 relative z-10">1.2s</div>
                <div className="text-[10px] text-bamboo font-bold uppercase tracking-widest flex items-center gap-1 relative z-10 bg-white/50 px-2 py-0.5 rounded-full">
                    <Timer size={12} /> Fastest Answer
                </div>
            </GlassCard>

            <GlassCard className="p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:-translate-y-1 transition-transform border-hanko/10 hover:border-hanko/30">
                 <div className="absolute top-[-10px] right-[-10px] text-red-50 group-hover:text-red-100 transition-colors pointer-events-none">
                    <Target size={70} />
                </div>
                <div className="text-lg font-black text-hanko mb-1 mt-1 truncate w-full px-1 relative z-10">Memory Match</div>
                <div className="text-[10px] text-bamboo font-bold uppercase tracking-widest flex items-center gap-1 relative z-10 bg-white/50 px-2 py-0.5 rounded-full">
                    <Target size={12} /> Best Game
                </div>
            </GlassCard>
        </div>
    );
};

const ExamReadinessCard = () => {
    const readiness = 65; 
    const data = [
        { name: 'Ready', value: readiness },
        { name: 'Not Ready', value: 100 - readiness }
    ];
    const COLORS = ['#c93a40', '#e0e0e0']; 

    return (
        <GlassCard className="flex flex-col justify-between h-full relative overflow-hidden">
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div>
                    <h3 className="font-bold text-ink text-lg flex items-center gap-2">
                        <GraduationCap size={20} className="text-hanko" /> Exam Readiness
                    </h3>
                    <p className="text-xs text-bamboo font-medium">JLPT N5 Prediction</p>
                </div>
                <Badge color="bg-hanko/10 text-hanko border-hanko/20">N5</Badge>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
                <div className="w-24 h-24 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={35}
                                outerRadius={45}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-ink text-lg">
                        {readiness}%
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    <div className="text-sm text-bamboo leading-tight">
                        You are on track! Focus on <span className="font-bold text-ink">Particles</span> to reach 80%.
                    </div>
                    <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                        Take Mock Exam
                    </Button>
                </div>
            </div>
        </GlassCard>
    );
};

const TodayGoalCard = () => {
    const goals = [
        { id: 1, text: "Complete 1 Grammar Lesson", done: true },
        { id: 2, text: "Score 100% on Vocab Quiz", done: false },
        { id: 3, text: "Play 'Memory Match' once", done: false },
    ];

    return (
        <GlassCard className="h-full flex flex-col">
            <h3 className="font-bold text-ink text-lg flex items-center gap-2 mb-4">
                <Target size={20} className="text-straw" /> Today's Goal
            </h3>
            <div className="space-y-3 flex-1">
                {goals.map((goal) => (
                    <div key={goal.id} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${goal.done ? 'bg-green-50 border-green-200' : 'bg-white/40 border-bamboo/10'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${goal.done ? 'bg-green-500 border-green-500 text-white' : 'border-bamboo/30'}`}>
                            {goal.done && <CheckCircle2 size={12} />}
                        </div>
                        <span className={`text-sm font-medium ${goal.done ? 'text-green-800 line-through opacity-70' : 'text-ink'}`}>
                            {goal.text}
                        </span>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
};

const WeakAreaCard = () => {
    return (
        <GlassCard className="bg-red-50/50 border-hanko/20 flex flex-col h-full relative overflow-hidden group cursor-pointer hover:border-hanko/40 transition-colors">
            <div className="absolute right-[-10px] top-[-10px] text-hanko/10 group-hover:scale-110 transition-transform">
                <AlertCircle size={80} />
            </div>
            <h3 className="font-bold text-hanko text-lg flex items-center gap-2 mb-2 relative z-10">
                <AlertCircle size={20} /> Weak Area Detected
            </h3>
            <div className="flex-1 relative z-10">
                <div className="text-3xl font-bold text-ink mb-1">Particles (は vs が)</div>
                <div className="text-xs font-bold text-red-600 bg-red-100 inline-block px-2 py-0.5 rounded mb-3">Accuracy: 42%</div>
                <p className="text-sm text-bamboo leading-relaxed">
                    You often confuse the topic marker and subject marker. 
                </p>
            </div>
            <div className="mt-4 relative z-10">
                <Button size="sm" variant="danger" className="w-full">
                    <Zap size={14} className="mr-1" /> Practice Now
                </Button>
            </div>
        </GlassCard>
    );
};

const AchievementsCard = () => {
    const badges = [
        { id: 1, icon: "🌱", name: "First Step", unlocked: true },
        { id: 2, icon: "🔥", name: "7 Day Streak", unlocked: true },
        { id: 3, icon: "📚", name: "Vocab Master", unlocked: false },
        { id: 4, icon: "⚡", name: "Quiz Whiz", unlocked: true },
        { id: 5, icon: "🎧", name: "Good Ear", unlocked: false },
        { id: 6, icon: "🗣️", name: "Speaker", unlocked: false },
    ];

    return (
        <GlassCard>
            <h3 className="font-bold text-ink text-lg flex items-center gap-2 mb-4">
                <Medal size={20} className="text-yellow-600" /> Achievements
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {badges.map(b => (
                    <div key={b.id} className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${b.unlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                        <div className={`w-12 h-12 flex items-center justify-center text-2xl bg-white rounded-full border shadow-sm ${b.unlocked ? 'border-yellow-200' : 'border-gray-200'}`}>
                            {b.icon}
                        </div>
                        <span className="text-[10px] font-bold text-center text-bamboo uppercase tracking-tight">{b.name}</span>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
};

const ProgressRadar = () => {
    const radarData: SkillStats[] = [
        { subject: 'Kanji', A: 65, fullMark: 100 },
        { subject: 'Vocab', A: 80, fullMark: 100 },
        { subject: 'Recall', A: 95, fullMark: 100 },
        { subject: 'Listen', A: 50, fullMark: 100 },
        { subject: 'Grammar', A: 70, fullMark: 100 },
    ];

    return (
        <GlassCard className="h-full flex flex-col">
            <h3 className="font-bold text-ink text-lg flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-blue-600" /> Progress Overview
            </h3>
            <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#8d6e63" strokeOpacity={0.2} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#8d6e63', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="My Skills" dataKey="A" stroke="#bc2f32" fill="#bc2f32" fillOpacity={0.4} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};

export const UserDashboard: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const rank = getRank(user.xp || 0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Ohayou' : hour < 18 ? 'Konnichiwa' : 'Konbanwa';

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-hanko/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="flex items-center gap-6 z-10 w-full md:w-auto">
              <div className="relative">
                  <img src={user.avatar} alt="User" className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-rice object-cover" />
                  <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm">
                      <div className="bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                  </div>
              </div>
              <div>
                  <h1 className="text-3xl font-bold text-ink font-serif mb-1">
                      {greeting}, <span className="text-hanko">{user.username}</span>
                  </h1>
                  <div className="flex gap-2">
                      <Badge color={`${rank.bg} ${rank.color} ${rank.border} border`}>
                          {rank.icon} {rank.title}
                      </Badge>
                      <Badge color="bg-rice text-bamboo border-bamboo/20">
                          Level {Math.floor((user.xp || 0) / 1000) + 1}
                      </Badge>
                  </div>
              </div>
          </div>

          <div className="flex-1 w-full z-10 px-0 md:px-8">
              <div className="flex justify-between text-xs font-bold text-bamboo mb-2 uppercase tracking-widest">
                  <span>Current XP: {user.xp}</span>
                  <span>Next Rank: {rank.next}</span>
              </div>
              <div className="h-4 bg-white border border-bamboo/10 rounded-full overflow-hidden shadow-inner">
                  <div 
                      className="h-full bg-gradient-to-r from-straw to-yellow-500 relative" 
                      style={{ width: `${Math.min(100, ((user.xp || 0) / rank.next) * 100)}%` }}
                  >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
              </div>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-white/50 rounded-2xl border border-bamboo/10 min-w-[80px]">
              <Flame size={24} className="text-hanko mb-1" />
              <span className="text-xl font-bold text-ink">{user.streak || 0}</span>
              <span className="text-[10px] text-bamboo font-bold uppercase">Days</span>
          </div>
      </div>

      <PowerMetrics />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 h-64">
              <TodayGoalCard />
          </div>

          <div className="md:col-span-4 h-64">
              <GlassCard className="h-full flex flex-col">
                  <h3 className="font-bold text-ink text-lg flex items-center gap-2 mb-4">
                      <Gamepad2 size={20} className="text-purple-600" /> Today's Games
                  </h3>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                      <div onClick={() => navigate('/learning')} className="bg-rice/50 rounded-xl p-2 text-center cursor-pointer hover:bg-white transition-colors border border-bamboo/5">
                        <Timer className="mx-auto mb-1 text-purple-500" size={20} />
                        <span className="text-[10px] font-bold uppercase">Match</span>
                      </div>
                      <div onClick={() => navigate('/learning')} className="bg-rice/50 rounded-xl p-2 text-center cursor-pointer hover:bg-white transition-colors border border-bamboo/5">
                        <Keyboard className="mx-auto mb-1 text-blue-500" size={20} />
                        <span className="text-[10px] font-bold uppercase">Typing</span>
                      </div>
                  </div>
              </GlassCard>
          </div>

          <div className="md:col-span-4 h-64">
              <ExamReadinessCard />
          </div>

          <div className="md:col-span-4 h-72">
              <ProgressRadar />
          </div>

          <div className="md:col-span-4 h-72">
              <WeakAreaCard />
          </div>

          <div className="md:col-span-4 h-72">
              <AchievementsCard />
          </div>
      </div>
    </div>
  );
};
