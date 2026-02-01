import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { 
  Flame, Trophy, ArrowRight, Brain, Zap, Swords, Crown, BookOpen, Clock, Target, Volume2, Play, Gamepad2, GraduationCap, Quote
} from 'lucide-react';
import { User, SkillStats, LearningItem } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { VOCAB_DATA } from '../data/mockContent';
import { useNavigate } from 'react-router-dom';

// --- DATA & HELPERS ---

const KOTOWAZA = [
    { jp: "千里の道も一歩から", romaji: "Senri no michi mo ippo kara", en: "A journey of a thousand miles begins with a single step." },
    { jp: "猿も木から落ちる", romaji: "Saru mo ki kara ochiru", en: "Even monkeys fall from trees (Everyone makes mistakes)." },
    { jp: "七転び八起き", romaji: "Nana korobi ya oki", en: "Fall seven times, stand up eight." }
];

const getRank = (xp: number) => {
  if (xp < 1000) return { title: 'Initiate', icon: '🌱', next: 1000, color: 'text-slate-400', border: 'border-slate-500' };
  if (xp < 3000) return { title: 'Ronin', icon: '🗡️', next: 3000, color: 'text-blue-400', border: 'border-blue-500' };
  if (xp < 6000) return { title: 'Samurai', icon: '🎎', next: 6000, color: 'text-purple-400', border: 'border-purple-500' };
  if (xp < 10000) return { title: 'Shogun', icon: '🏯', next: 10000, color: 'text-orange-400', border: 'border-orange-500' };
  return { title: 'Grand Master', icon: '👑', next: 20000, color: 'text-yellow-400', border: 'border-yellow-500' };
};

const ActivityGrid = () => {
  const days = Array.from({ length: 52 }, (_, i) => {
    const r = Math.random();
    return r > 0.8 ? 2 : r > 0.5 ? 1 : 0;
  });
  
  return (
    <div className="flex gap-1 flex-wrap w-full justify-end">
       {days.map((d, i) => (
         <div 
            key={i} 
            className={`w-2 h-2 lg:w-3 lg:h-3 rounded-sm transition-all hover:scale-125 ${
                d === 2 ? 'bg-primary shadow-sm' : d === 1 ? 'bg-primary/40' : 'bg-slate-200 dark:bg-white/5'
            }`} 
            title={`Day ${i}`}
         />
       ))}
    </div>
  );
};

const WordOfTheDayCard = () => {
    const [word, setWord] = useState<LearningItem | null>(null);

    useEffect(() => {
        setWord(VOCAB_DATA[Math.floor(Math.random() * VOCAB_DATA.length)]);
    }, []);

    const speak = (text: string) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ja-JP';
        window.speechSynthesis.speak(u);
    };

    if (!word) return <div className="animate-pulse h-40 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>;

    return (
        <GlassCard className="h-full flex flex-col justify-between relative overflow-hidden group border-pink-500/30 bg-gradient-to-br from-white to-pink-50 dark:from-slate-800 dark:to-slate-900">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BookOpen size={80} />
            </div>
            <div className="flex justify-between items-start z-10">
                <Badge color="bg-pink-500/10 text-pink-500 border-pink-200">Word of the Day</Badge>
                <button onClick={() => speak(word.ja)} className="p-2 rounded-full bg-pink-100 dark:bg-white/5 hover:bg-pink-500 hover:text-white text-pink-500 transition-colors">
                    <Volume2 size={18} />
                </button>
            </div>
            <div className="z-10 mt-4">
                <div className="text-4xl font-jp font-bold text-slate-800 dark:text-white mb-1">{word.ja}</div>
                <div className="text-pink-500 font-medium text-lg">{word.romaji}</div>
                <div className="text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{word.en}</div>
            </div>
        </GlassCard>
    );
};

// --- MAIN DASHBOARD ---

export const UserDashboard: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const rank = getRank(user.xp || 0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Ohayou' : hour < 18 ? 'Konnichiwa' : 'Konbanwa';
  
  const [todaysKotowaza] = useState(KOTOWAZA[Math.floor(Math.random() * KOTOWAZA.length)]);

  const radarData: SkillStats[] = [
    { subject: 'Kanji', A: 65, fullMark: 100 },
    { subject: 'Vocab', A: 80, fullMark: 100 },
    { subject: 'Recall', A: 95, fullMark: 100 },
    { subject: 'Listen', A: 50, fullMark: 100 },
    { subject: 'Grammar', A: 70, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Welcome Header & Kotowaza */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 font-serif tracking-tight">
                  {greeting}, <span className="text-primary">{user.username}-san</span>! 👋
              </h1>
              <div className="flex items-center gap-4 text-sm mb-4">
                  <div className={`px-3 py-1 rounded-full border ${rank.border} bg-white dark:bg-transparent flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 shadow-sm`}>
                      {rank.icon} <span className={rank.color}>{rank.title}</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">Level 5 • {rank.next - (user.xp || 0)} XP to next rank</div>
              </div>
              
              {/* XP Progress */}
              <div className="w-full max-w-md h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative group">
                  <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(58,134,255,0.4)]" 
                      style={{ width: `${((user.xp || 0) / rank.next) * 100}%` }}
                  ></div>
              </div>
          </div>

          <GlassCard className="lg:col-span-1 border-l-4 border-l-primary bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
             <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-wider">
                 <Quote size={14} /> Japanese Proverb
             </div>
             <p className="text-xl font-jp font-bold text-slate-800 dark:text-white mb-1">{todaysKotowaza.jp}</p>
             <p className="text-sm text-primary mb-2 font-medium">{todaysKotowaza.romaji}</p>
             <p className="text-sm text-slate-500 dark:text-slate-400 italic">"{todaysKotowaza.en}"</p>
          </GlassCard>
      </div>

      {/* 2. Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: 'Streak', val: user.streak || 0, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { label: 'Words', val: 142, icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Hours', val: '12h', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Rank', val: '#42', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        ].map((stat, i) => (
            <GlassCard key={i} className="flex items-center gap-4 p-4 hover-effect">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                </div>
                <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{stat.val}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mt-1">{stat.label}</div>
                </div>
            </GlassCard>
        ))}
      </div>

      {/* 3. Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Core Actions (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
              
              {/* Featured Lesson Card - Ticket Style */}
              <div className="relative group cursor-pointer" onClick={() => navigate('/roadmap')}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <GlassCard className="relative overflow-hidden border-none !bg-gradient-to-br !from-slate-900 !to-slate-800 !text-white">
                      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-2">
                          <div className="flex-1">
                              <Badge color="bg-white/20 text-white border-none mb-3">Continue Learning</Badge>
                              <h2 className="text-3xl font-bold mb-2">Introduction & Greetings</h2>
                              <p className="text-slate-300 mb-6 max-w-md">Lesson 3 • Master the basics of self-introduction. You are 60% through this module.</p>
                              
                              <div className="flex items-center gap-4">
                                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-400 w-[60%] shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
                                  </div>
                                  <span className="font-mono font-bold">60%</span>
                              </div>
                          </div>
                          <div className="shrink-0 bg-white/10 p-4 rounded-full border border-white/10 group-hover:scale-110 transition-transform">
                              <Play size={32} fill="currentColor" />
                          </div>
                      </div>
                  </GlassCard>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassCard>
                      <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                          <Swords size={18} className="text-green-500" /> Daily Missions
                      </h3>
                      <div className="space-y-3">
                        {[
                            { title: "Complete 1 Vocab Quiz", xp: 50, done: true },
                            { title: "Learn 5 New Kanji", xp: 100, done: false },
                            { title: "Chat with Sensei", xp: 75, done: false }
                        ].map((m, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${m.done ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                        {m.done && <Zap size={12} className="text-white fill-current" />}
                                    </div>
                                    <span className={`text-sm font-medium ${m.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{m.title}</span>
                                </div>
                                <span className="text-xs font-bold text-primary">+{m.xp} XP</span>
                            </div>
                        ))}
                      </div>
                  </GlassCard>

                  <div className="grid grid-cols-2 gap-4">
                      <GlassCard 
                          hoverEffect 
                          className="flex flex-col items-center justify-center gap-3 text-center cursor-pointer border-t-4 border-t-purple-500"
                          onClick={() => navigate('/arcade')}
                      >
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-500">
                              <Gamepad2 size={24} />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-white text-sm">Arcade</span>
                      </GlassCard>

                      <GlassCard 
                          hoverEffect 
                          className="flex flex-col items-center justify-center gap-3 text-center cursor-pointer border-t-4 border-t-blue-500"
                          onClick={() => navigate('/practice')}
                      >
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-500">
                              <GraduationCap size={24} />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-white text-sm">Practice</span>
                      </GlassCard>

                      <GlassCard 
                          hoverEffect 
                          className="flex flex-col items-center justify-center gap-3 text-center cursor-pointer border-t-4 border-t-green-500"
                          onClick={() => navigate('/sensei')}
                      >
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full text-green-500">
                              <Brain size={24} />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-white text-sm">Sensei</span>
                      </GlassCard>

                      <GlassCard 
                          hoverEffect 
                          className="flex flex-col items-center justify-center gap-3 text-center cursor-pointer border-t-4 border-t-red-500"
                          onClick={() => navigate('/mistakes')}
                      >
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full text-red-500">
                              <Zap size={24} />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-white text-sm">Review</span>
                      </GlassCard>
                  </div>
              </div>
          </div>

          {/* Right Column: Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
              <div className="h-48">
                  <WordOfTheDayCard />
              </div>

              <GlassCard className="min-h-[250px] flex flex-col relative overflow-hidden">
                 <div className="flex items-center gap-2 mb-4 relative z-10">
                     <Target size={18} className="text-primary" />
                     <span className="font-bold text-slate-900 dark:text-white">Skill Analysis</span>
                 </div>
                 <div className="flex-1 w-full -ml-4">
                    <ResponsiveContainer width="110%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="#94a3b8" strokeOpacity={0.2} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="My Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                        </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </GlassCard>
              
              <GlassCard>
                  <div className="flex justify-between items-end mb-4">
                      <div>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Consistency</h3>
                          <div className="text-xl font-bold text-slate-900 dark:text-white">142 Contributions</div>
                      </div>
                  </div>
                  <ActivityGrid />
              </GlassCard>
          </div>
      </div>
    </div>
  );
};