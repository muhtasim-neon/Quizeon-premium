import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { 
  Flame, Trophy, ArrowRight, Brain, Zap, Swords, Crown, BookOpen, Clock, Target, Volume2, Play, Gamepad2, GraduationCap, Quote, Map
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
  if (xp < 1000) return { title: 'Initiate', icon: '🌱', next: 1000, color: 'text-bamboo', border: 'border-bamboo' };
  if (xp < 3000) return { title: 'Ronin', icon: '🗡️', next: 3000, color: 'text-ink', border: 'border-ink' };
  if (xp < 6000) return { title: 'Samurai', icon: '🎎', next: 6000, color: 'text-straw', border: 'border-straw' };
  if (xp < 10000) return { title: 'Shogun', icon: '🏯', next: 10000, color: 'text-hanko', border: 'border-hanko' };
  return { title: 'Grand Master', icon: '👑', next: 20000, color: 'text-straw', border: 'border-straw' };
};

const ActivityGrid = () => {
  const days = Array.from({ length: 52 }, (_, i) => {
    const r = Math.random();
    return r > 0.8 ? 2 : r > 0.5 ? 1 : 0;
  });
  
  return (
    <div className="flex gap-1.5 flex-wrap w-full justify-end">
       {days.map((d, i) => (
         <div 
            key={i} 
            className={`w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 rounded-sm transition-all hover:scale-125 ${
                d === 2 ? 'bg-hanko shadow-sm shadow-hanko/30' : d === 1 ? 'bg-hanko/40' : 'bg-bamboo/10'
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

    if (!word) return <div className="animate-pulse h-40 bg-white/20 rounded-2xl border border-bamboo/10"></div>;

    return (
        <GlassCard className="h-full flex flex-col justify-between relative overflow-hidden group border-straw/30 bg-white/60">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-ink scale-150">
                <BookOpen size={80} />
            </div>
            <div className="flex justify-between items-start z-10">
                <Badge color="bg-straw/20 text-straw border-straw/30">Word of the Day</Badge>
                <button onClick={() => speak(word.ja)} className="p-2.5 rounded-full bg-white border border-bamboo/10 hover:bg-straw/10 text-straw transition-colors shadow-sm">
                    <Volume2 size={18} />
                </button>
            </div>
            <div className="z-10 mt-6">
                <div className="text-5xl font-jp font-bold text-ink mb-2 tracking-tight">{word.ja}</div>
                <div className="text-hanko font-medium text-lg tracking-wide">{word.romaji}</div>
                <div className="text-bamboo mt-2 line-clamp-2 font-serif italic text-sm">{word.en}</div>
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
    <div className="space-y-10 animate-fade-in">
      
      {/* 1. Welcome Header & Kotowaza */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col justify-center">
              <h1 className="text-5xl font-bold text-ink mb-4 font-serif tracking-tight leading-tight">
                  {greeting}, <span className="text-hanko inline-block animate-ink-bleed">{user.username}-san</span>.
              </h1>
              <div className="flex items-center gap-6 text-sm mb-6">
                  <div className={`px-4 py-1.5 rounded-full border ${rank.border} bg-white/60 backdrop-blur-sm flex items-center gap-2 font-bold text-ink shadow-sm`}>
                      {rank.icon} <span className={rank.color}>{rank.title}</span>
                  </div>
                  <div className="text-bamboo font-medium bg-rice/50 px-3 py-1 rounded-full border border-bamboo/10">Level 5 • {rank.next - (user.xp || 0)} XP to next rank</div>
              </div>
              
              {/* XP Progress (Gold Straw) */}
              <div className="w-full max-w-md h-3 bg-white/50 border border-bamboo/10 rounded-full overflow-hidden relative group shadow-inner">
                  <div 
                      className="h-full bg-gradient-to-r from-straw to-yellow-600 shadow-[0_0_15px_rgba(212,163,115,0.6)] relative overflow-hidden" 
                      style={{ width: `${((user.xp || 0) / rank.next) * 100}%` }}
                  >
                      <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
              </div>
          </div>

          <GlassCard className="lg:col-span-1 border-l-4 border-l-hanko bg-white/60 flex flex-col justify-center">
             <div className="flex items-center gap-2 mb-3 text-hanko font-bold text-xs uppercase tracking-widest">
                 <Quote size={14} /> Japanese Proverb
             </div>
             <p className="text-2xl font-jp font-bold text-ink mb-2 leading-relaxed">{todaysKotowaza.jp}</p>
             <p className="text-sm text-hanko mb-2 font-medium tracking-wide">{todaysKotowaza.romaji}</p>
             <p className="text-sm text-bamboo italic font-serif">"{todaysKotowaza.en}"</p>
          </GlassCard>
      </div>

      {/* 2. Quick Stats (Earth & Ink Palette) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
            { label: 'Streak', val: user.streak || 0, icon: Flame, color: 'text-hanko', bg: 'bg-hanko/10', border: 'border-hanko/20' },
            { label: 'Words', val: 142, icon: Target, color: 'text-ink', bg: 'bg-ink/10', border: 'border-ink/20' },
            { label: 'Hours', val: '12h', icon: Clock, color: 'text-bamboo', bg: 'bg-bamboo/10', border: 'border-bamboo/20' },
            { label: 'Rank', val: '#42', icon: Trophy, color: 'text-straw', bg: 'bg-straw/10', border: 'border-straw/20' },
        ].map((stat, i) => (
            <GlassCard key={i} className="flex items-center gap-5 p-5 hover-effect border border-white/50">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} ${stat.border} border shadow-inner`}>
                    <stat.icon size={28} />
                </div>
                <div>
                    <div className="text-3xl font-bold text-ink leading-none font-serif">{stat.val}</div>
                    <div className="text-xs text-bamboo uppercase font-bold mt-2 tracking-widest opacity-80">{stat.label}</div>
                </div>
            </GlassCard>
        ))}
      </div>

      {/* 3. Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Core Actions (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
              
              {/* Featured Lesson Card - Ticket Style */}
              <div className="relative group cursor-pointer" onClick={() => navigate('/roadmap')}>
                  <div className="absolute inset-0 bg-ink rounded-2xl transform translate-y-2 translate-x-2 opacity-10 group-hover:translate-y-3 group-hover:translate-x-3 transition-transform duration-300"></div>
                  <GlassCard className="relative overflow-hidden border-none !bg-ink !text-rice shadow-2xl">
                      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                      <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12">
                          <BookOpen size={240} />
                      </div>
                      
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-4">
                          <div className="flex-1">
                              <Badge color="bg-rice/10 text-rice border border-rice/20 mb-4 backdrop-blur-sm">Continue Learning</Badge>
                              <h2 className="text-4xl font-bold mb-3 font-serif">Introduction & Greetings</h2>
                              <p className="text-rice/70 mb-8 max-w-md leading-relaxed">Lesson 3 • Master the basics of self-introduction. You are 60% through this module.</p>
                              
                              <div className="flex items-center gap-4">
                                  <div className="flex-1 h-3 bg-rice/10 rounded-full overflow-hidden border border-rice/5">
                                      <div className="h-full bg-straw w-[60%] shadow-[0_0_15px_rgba(212,163,115,0.8)] relative">
                                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                      </div>
                                  </div>
                                  <span className="font-mono font-bold text-straw text-lg">60%</span>
                              </div>
                          </div>
                          <div className="shrink-0 bg-rice/10 p-6 rounded-full border border-rice/10 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                              <Play size={40} fill="currentColor" />
                          </div>
                      </div>
                  </GlassCard>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <GlassCard>
                      <h3 className="font-bold text-ink flex items-center gap-2 mb-6 text-lg">
                          <Swords size={20} className="text-hanko" /> Daily Missions
                      </h3>
                      <div className="space-y-4">
                        {[
                            { title: "Complete 1 Vocab Quiz", xp: 50, done: true },
                            { title: "Learn 5 New Kanji", xp: 100, done: false },
                            { title: "Review 5 Mistakes", xp: 75, done: false }
                        ].map((m, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/40 rounded-xl border border-bamboo/10 hover:bg-white/60 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${m.done ? 'bg-hanko border-hanko' : 'border-bamboo/30'}`}>
                                        {m.done && <Zap size={14} className="text-white fill-current" />}
                                    </div>
                                    <span className={`text-sm font-bold ${m.done ? 'text-bamboo line-through decoration-hanko/50' : 'text-ink'}`}>{m.title}</span>
                                </div>
                                <span className="text-xs font-bold text-straw bg-straw/10 px-2 py-1 rounded">+{m.xp} XP</span>
                            </div>
                        ))}
                      </div>
                  </GlassCard>

                  <div className="grid grid-cols-2 gap-4">
                      {[
                          { label: 'Roadmap', icon: Map, color: 'text-ink', path: '/roadmap', border: 'border-t-ink' },
                          { label: 'Review', icon: Zap, color: 'text-straw', path: '/mistakes', border: 'border-t-straw' },
                          { label: 'Learning', icon: BookOpen, color: 'text-bamboo', path: '/learning', border: 'border-t-bamboo' },
                          { label: 'Profile', icon: Target, color: 'text-hanko', path: '/profile', border: 'border-t-hanko' },
                      ].map((item, i) => (
                          <GlassCard 
                              key={i}
                              hoverEffect 
                              className={`flex flex-col items-center justify-center gap-4 text-center cursor-pointer border-t-4 ${item.border}`}
                              onClick={() => navigate(item.path)}
                          >
                              <div className={`p-4 rounded-full ${item.color.replace('text-', 'bg-')}/10 ${item.color}`}>
                                  <item.icon size={28} />
                              </div>
                              <span className="font-bold text-ink text-sm uppercase tracking-wide">{item.label}</span>
                          </GlassCard>
                      ))}
                  </div>
              </div>
          </div>

          {/* Right Column: Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
              <div className="h-56">
                  <WordOfTheDayCard />
              </div>

              <GlassCard className="min-h-[280px] flex flex-col relative overflow-hidden bg-white/70">
                 <div className="flex items-center gap-2 mb-6 relative z-10">
                     <Target size={20} className="text-hanko" />
                     <span className="font-bold text-ink text-lg">Skill Analysis</span>
                 </div>
                 <div className="flex-1 w-full h-full -ml-4">
                    <ResponsiveContainer width="115%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                            <PolarGrid stroke="#8d6e63" strokeOpacity={0.2} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#8d6e63', fontSize: 11, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="My Skills" dataKey="A" stroke="#bc2f32" fill="#bc2f32" fillOpacity={0.4} />
                        </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </GlassCard>
              
              <GlassCard>
                  <div className="flex justify-between items-end mb-6">
                      <div>
                          <h3 className="text-xs font-bold text-bamboo uppercase tracking-widest mb-1">Consistency</h3>
                          <div className="text-2xl font-bold text-ink font-serif">142 Contributions</div>
                      </div>
                  </div>
                  <ActivityGrid />
              </GlassCard>
          </div>
      </div>
    </div>
  );
};