
import React, { useEffect, useState } from 'react';
import { Button, Badge, WonderCard, GlassCard, FeatureCard } from '../components/UI';
import { 
  Trophy, TrendingUp, Target, Zap, AlertCircle, 
  Gamepad2, CheckCircle2, Medal, Flame, 
  Brain, Timer, GraduationCap, Keyboard, RefreshCw,
  Landmark, Activity, Wifi, Database, BookOpen, ArrowRight, Star, Play, Calendar, List
} from 'lucide-react';
import { User, SkillStats } from '../types';
import { progressService } from '../services/progressService';
import { VOCAB_DATA, KANJI_DATA, GRAMMAR_DATA } from '../data/mockContent';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const getRank = (xp: number) => {
  if (xp < 1000) return { title: 'Initiate', icon: '🌱', min: 0, next: 1000, color: 'text-green-400', border: 'border-green-400/20', bg: 'bg-green-400/10' };
  if (xp < 3000) return { title: 'Ronin', icon: '🗡️', min: 1000, next: 3000, color: 'text-blue-400', border: 'border-blue-400/20', bg: 'bg-blue-400/10' };
  if (xp < 6000) return { title: 'Samurai', icon: '🎎', min: 3000, next: 6000, color: 'text-red-400', border: 'border-red-400/20', bg: 'bg-red-400/10' };
  if (xp < 10000) return { title: 'Shogun', icon: '🏯', min: 6000, next: 10000, color: 'text-purple-400', border: 'border-purple-400/20', bg: 'bg-purple-400/10' };
  return { title: 'Grand Master', icon: '👑', min: 10000, next: 20000, color: 'text-yellow-400', border: 'border-yellow-400', bg: 'bg-yellow-400/10' };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 14 }
  }
};

// --- SUB-COMPONENTS ---

const HeaderStat = ({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) => (
    <div className="flex flex-col items-center px-6 border-r border-white/10 last:border-0 min-w-[80px]">
        <Icon size={20} className={`mb-2 ${color}`} />
        <span className="text-2xl font-black text-rice leading-none">{value}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-rice/50 mt-1">{label}</span>
    </div>
);

const ReviewDueSection = ({ count }: { count: number }) => {
  const navigate = useNavigate();
  return (
    <FeatureCard 
      className="cursor-pointer h-full flex flex-col justify-center"
      onClick={() => navigate('/srs-status')}
    >
        <div className="absolute right-[-30px] top-[-30px] text-rice/5 transform rotate-12 group-hover:rotate-45 transition-transform duration-700 pointer-events-none">
            <RefreshCw size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-2">
            <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-hanko text-white rounded-2xl flex items-center justify-center shadow-lg shadow-hanko/30 group-hover:scale-110 transition-transform duration-300">
                    <Brain size={36} className={count > 0 ? "animate-pulse" : ""} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-rice">Review Due</h3>
                    <p className="text-rice/60 font-medium text-sm">Spaced Repetition System</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="flex h-2 w-2 relative">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${count > 0 ? 'bg-red-400' : 'bg-green-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${count > 0 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        </span>
                        <span className="text-xs text-rice/80 font-bold">{count > 0 ? 'Action Required' : 'All Caught Up'}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-rice">{count}</span>
                    <span className="text-sm font-bold text-rice/40 uppercase">Items</span>
                </div>
                <Button className="w-full md:w-auto mt-4 shadow-lg shadow-hanko/20 bg-hanko border-red-800 hover:bg-red-700 text-white" onClick={(e) => { e.stopPropagation(); navigate('/srs-status'); }}>
                    Start Session <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    </FeatureCard>
  );
};

const JumpBackInCard = () => {
    const navigate = useNavigate();
    return (
        <FeatureCard 
            onClick={() => navigate('/learning')}
            className="cursor-pointer h-full flex flex-col"
        >
            <div className="relative z-10 p-2 h-full flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <Badge color="bg-hanko text-white border-none shadow-sm animate-pulse">In Progress</Badge>
                        <Play size={40} className="text-rice/20 group-hover:text-rice/80 transition-colors" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-1 leading-tight text-shadow-sm">Lesson 3: Places</h3>
                    <p className="text-rice/60 text-sm font-medium">Where is the toilet? (Koko, Soko)</p>
                </div>

                <div className="space-y-3 mt-6">
                    <div className="flex justify-between text-xs font-bold text-rice/40 uppercase tracking-widest">
                        <span>Progress</span>
                        <span>75%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-hanko to-orange-500 w-3/4 shadow-[0_0_10px_rgba(255,100,100,0.5)]"></div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-rice/80 group-hover:translate-x-2 transition-transform pt-2">
                        Resume Session <ArrowRight size={14} />
                    </div>
                </div>
            </div>
        </FeatureCard>
    );
};

const ExamReadinessCard = () => {
    const readiness = 65; 
    const data = [
        { name: 'Ready', value: readiness },
        { name: 'Not Ready', value: 100 - readiness }
    ];
    const COLORS = ['#4338ca', '#e0e7ff']; // Indigo & Indigo-100

    return (
        <WonderCard colorClass="bg-white border-indigo/10" className="h-full flex flex-col relative overflow-hidden">
             <div className="absolute top-[-10px] right-[-10px] p-4 opacity-5 pointer-events-none transform rotate-12">
                <GraduationCap size={100} className="text-indigo" />
             </div>
             
             <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="font-bold text-lg flex items-center gap-2 text-ink">
                    <GraduationCap size={18} className="text-indigo" /> Exam Prep
                </h3>
                <Badge color="bg-indigo/10 text-indigo border-indigo/20">N5 Prediction</Badge>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4 relative z-10">
                <div className="flex items-center gap-4 lg:gap-6">
                    {/* Gauge Chart */}
                    <div className="w-24 h-24 relative flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%" cy="50%"
                                    innerRadius={30}
                                    outerRadius={40}
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
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo">
                            <span className="text-xl font-black">{readiness}%</span>
                        </div>
                    </div>
                    
                    {/* Breakdown Metrics */}
                    <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex justify-between text-xs">
                            <span className="text-ink/60 font-bold">Vocab</span>
                            <span className="text-indigo font-bold">80%</span>
                        </div>
                        <div className="w-full h-1.5 bg-rice rounded-full overflow-hidden border border-bamboo/10">
                            <div className="h-full bg-indigo w-[80%]"></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                            <span className="text-ink/60 font-bold">Kanji</span>
                            <span className="text-indigo font-bold">60%</span>
                        </div>
                        <div className="w-full h-1.5 bg-rice rounded-full overflow-hidden border border-bamboo/10">
                            <div className="h-full bg-indigo/60 w-[60%]"></div>
                        </div>

                        <div className="flex justify-between text-xs">
                            <span className="text-ink/60 font-bold">Grammar</span>
                            <span className="text-red-500 font-bold">45%</span>
                        </div>
                        <div className="w-full h-1.5 bg-rice rounded-full overflow-hidden border border-bamboo/10">
                            <div className="h-full bg-red-400 w-[45%]"></div>
                        </div>
                    </div>
                </div>
                
                <button className="w-full py-2.5 rounded-xl bg-indigo-50 text-indigo font-bold text-xs hover:bg-indigo-100 transition-colors border border-indigo-100 uppercase tracking-wide">
                    Take Mock Exam
                </button>
            </div>
        </WonderCard>
    );
};

const RecentVocabCard = () => {
    // Mocking last 5 learned
    const recent = VOCAB_DATA.slice(0, 3); 
    const navigate = useNavigate();

    return (
        <WonderCard colorClass="bg-white border-bamboo/10" className="h-full flex flex-col" onClick={() => navigate('/learning')}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-ink">
                    <Database size={18} className="text-indigo" /> Recent
                </h3>
                <Badge color="bg-indigo/5 text-indigo border-indigo/10">Last 3</Badge>
            </div>
            <div className="space-y-2 flex-1">
                {recent.map((v, i) => (
                    <div key={v.id} className="flex justify-between items-center p-2 rounded-xl bg-rice/30 hover:bg-indigo/5 transition-colors border border-transparent hover:border-indigo/10 group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-white border border-bamboo/10 flex items-center justify-center text-[10px] font-bold text-bamboo/50 group-hover:bg-indigo group-hover:text-white transition-colors">{i+1}</div>
                            <div>
                                <p className="font-bold text-ink text-sm">{v.ja}</p>
                                <p className="text-[10px] text-bamboo uppercase tracking-wide">{v.romaji}</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-indigo opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">{v.en}</span>
                    </div>
                ))}
            </div>
        </WonderCard>
    );
};

const NextKanjiCard = () => {
    const next = KANJI_DATA.slice(0, 3);
    const navigate = useNavigate();

    return (
        <WonderCard colorClass="bg-white border-bamboo/10" className="h-full flex flex-col" onClick={() => navigate('/learning')}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-ink">
                    <Landmark size={18} className="text-hanko" /> Kanji
                </h3>
                <Badge color="bg-hanko/5 text-hanko border-hanko/10">Focus</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 flex-1">
                {next.map(k => (
                    <div key={k.id} className="aspect-square rounded-2xl bg-rice border-2 border-dashed border-bamboo/10 flex flex-col items-center justify-center hover:border-hanko hover:bg-white hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                        <span className="text-3xl md:text-4xl font-jp font-black text-bamboo/20 group-hover:text-hanko transition-colors mb-1 z-10">{k.ja}</span>
                        <div className="absolute inset-0 bg-hanko/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
        </WonderCard>
    );
};

const GrammarFocusCard = () => {
    const grammar = GRAMMAR_DATA[0]; 
    const navigate = useNavigate();

    return (
        <WonderCard colorClass="bg-gradient-to-br from-emerald-50/50 to-white border-emerald-200" className="h-full flex flex-col justify-center cursor-pointer group" onClick={() => navigate('/learning')}>
            <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-ink">
                    <BookOpen size={18} className="text-emerald-600" /> Grammar
                </h3>
                <Badge color="bg-emerald-100 text-emerald-700 border-emerald-200">L{grammar.lesson}</Badge>
            </div>
            
            <div className="text-center py-2 flex-1 flex flex-col justify-center">
                <div className="text-xl font-black text-emerald-700 mb-2 bg-white/60 py-2 px-4 rounded-xl border border-emerald-100 shadow-sm inline-block mx-auto group-hover:scale-105 transition-transform">
                    {grammar.ja}
                </div>
                <div className="bg-white p-2 rounded-xl border border-emerald-100 text-xs text-left shadow-sm relative overflow-hidden group-hover:border-emerald-300 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400"></div>
                    <p className="text-ink font-jp pl-2 truncate">{grammar.usage || "Watashi wa gakusei desu."}</p>
                </div>
            </div>
        </WonderCard>
    );
};

const AchievementsCard = () => {
    const badges = [
        { id: 1, icon: "🌱", name: "First Step", unlocked: true },
        { id: 2, icon: "🔥", name: "7 Days", unlocked: true },
        { id: 3, icon: "📚", name: "Vocab", unlocked: false },
        { id: 4, icon: "⚡", name: "Whiz", unlocked: true },
        { id: 5, icon: "🎧", name: "Ear", unlocked: false },
        { id: 6, icon: "🗣️", name: "Speak", unlocked: false },
    ];

    return (
        <WonderCard colorClass="bg-white border-sakura/30" className="h-full">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4 text-ink">
                <Medal size={18} className="text-sakura" /> Badges
            </h3>
            <div className="grid grid-cols-3 gap-3">
                {badges.map(b => (
                    <div key={b.id} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${b.unlocked ? 'bg-sakura/10 border border-sakura/20 scale-105' : 'bg-linen/20 opacity-40 grayscale'}`}>
                        <div className="text-xl mb-1">{b.icon}</div>
                        <span className="text-[10px] font-bold text-center uppercase leading-none text-ink/70">{b.name}</span>
                    </div>
                ))}
            </div>
        </WonderCard>
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
        <WonderCard colorClass="bg-white border-linen" className="h-full flex flex-col">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2 text-ink">
                <TrendingUp size={18} className="text-indigo" /> Skill Radar
            </h3>
            <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#E4DAC7" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#7D756C', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="My Skills" dataKey="A" stroke="#1F3A5F" fill="#1F3A5F" fillOpacity={0.2} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </WonderCard>
    );
};

const GameCard = () => {
    const navigate = useNavigate();
    return (
        <WonderCard colorClass="bg-white border-purple-200" className="h-full flex flex-col">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4 text-ink">
                <Gamepad2 size={18} className="text-purple-600" /> Arcade
            </h3>
            <div className="flex-1 grid grid-cols-2 gap-3">
                <div onClick={() => navigate('/games')} className="bg-rice/50 rounded-xl p-3 text-center cursor-pointer hover:bg-purple-50 transition-colors border border-linen hover:border-purple-200 flex flex-col items-center justify-center gap-2 group">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                        <Timer size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase text-ink/70">Match</span>
                </div>
                <div onClick={() => navigate('/games')} className="bg-rice/50 rounded-xl p-3 text-center cursor-pointer hover:bg-purple-50 transition-colors border border-linen hover:border-purple-200 flex flex-col items-center justify-center gap-2 group">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                        <Keyboard size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase text-ink/70">Typing</span>
                </div>
            </div>
        </WonderCard>
    );
};

const ActivityHeatmap = () => {
    return (
        <WonderCard colorClass="bg-white border-bamboo/10" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-ink">
                    <Activity size={18} className="text-orange-500" /> Study Streak
                </h3>
                <div className="text-xs font-bold text-bamboo">Last 2 Weeks</div>
            </div>
            <div className="flex justify-between items-end flex-1 gap-1">
                {[...Array(14)].map((_, i) => {
                    const height = Math.floor(Math.random() * 80) + 20;
                    const active = Math.random() > 0.3;
                    return (
                        <div key={i} className="flex flex-col items-center gap-1 w-full">
                            <div 
                                className={`w-full rounded-t-sm transition-all hover:opacity-80 ${active ? 'bg-orange-400' : 'bg-rice'}`} 
                                style={{ height: active ? `${height}%` : '10%' }}
                            />
                        </div>
                    )
                })}
            </div>
        </WonderCard>
    );
};

export const UserDashboard: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [srsDue, setSrsDue] = useState(0);
  const rank = getRank(user.xp || 0);
  const hour = new Date().getHours();
  const greetingJA = hour < 12 ? 'おはよう' : hour < 18 ? 'こんにちは' : 'こんばんは';
  
  let timeMessage = "Let's continue your journey.";
  if (hour < 5) timeMessage = "Discipline is forged in silence.";
  else if (hour < 12) timeMessage = "A fresh start for your mind.";
  else if (hour < 17) timeMessage = "Keep your momentum flowing.";
  else if (hour < 22) timeMessage = "Reflect on your progress.";
  else timeMessage = "Rest is part of training.";

  useEffect(() => {
        const updateCount = () => setSrsDue(progressService.getSRSDueCount());
        updateCount();
        window.addEventListener('srs-update', updateCount);
        return () => window.removeEventListener('srs-update', updateCount);
  }, []);

  return (
    <motion.div 
        className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
      {/* --- Header Section --- */}
      <motion.div variants={itemVariants}>
          <div className="bg-ink rounded-[32px] p-4 lg:p-6 flex flex-col lg:flex-row justify-between items-center relative overflow-hidden shadow-2xl shadow-ink/20 border-2 border-bamboo/20">
              {/* Texture Overlay */}
              <div className="absolute inset-0 washi-texture opacity-10 pointer-events-none"></div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-hanko/20 rounded-full blur-3xl"></div>

              {/* Left: Identity */}
              <div className="flex items-center gap-6 z-10 w-full lg:w-auto mb-6 lg:mb-0">
                  <div className="relative">
                        <div className="w-20 h-20 bg-hanko rounded-3xl flex items-center justify-center text-white shadow-lg shadow-hanko/30 border-t border-white/20 shrink-0 relative z-10">
                            <Landmark size={40} />
                        </div>
                        {/* Level Badge */}
                        <div className="absolute -bottom-3 -right-3 z-20 bg-white text-hanko text-[10px] font-black px-2 py-1 rounded-lg border-2 border-hanko shadow-sm">
                            LVL {Math.floor((user.xp || 0) / 1000) + 1}
                        </div>
                  </div>
                  
                  <div>
                      <h1 className="text-3xl md:text-5xl font-black text-rice font-jp tracking-tight mb-1">
                          {greetingJA}, <br className="md:hidden" />
                          <span className={rank.color}>{rank.title}</span> {user.username}
                      </h1>
                      <div className="flex items-center gap-3">
                          <p className="text-bamboo font-bold text-xs uppercase tracking-[0.2em] hidden md:block">
                              {timeMessage}
                          </p>
                          {/* XP Progress Bar */}
                          <div className="flex flex-col w-48">
                                <div className="flex justify-between text-[9px] text-rice/60 font-mono mb-0.5">
                                    <span className="font-bold text-yellow-500">{user.xp} XP</span>
                                    <span>{rank.next - (user.xp || 0)} XP to LVL {Math.floor((user.xp || 0) / 1000) + 2}</span>
                                </div>
                                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden border border-white/10">
                                    <div 
                                        className="h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all duration-500 ease-out" 
                                        style={{ width: `${Math.min(100, Math.max(0, ((user.xp || 0) - rank.min) / (rank.next - rank.min) * 100))}%` }}
                                    />
                                </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Right: Stats Capsule */}
              <div className="flex bg-[#2d1b18] rounded-2xl p-2 z-10 border border-white/5 w-full lg:w-auto justify-between lg:justify-end overflow-x-auto shadow-inner">
                  <HeaderStat label="Points" value={user.xp || 0} icon={Zap} color="text-yellow-500" />
                  <HeaderStat label="Streak" value={user.streak || 0} icon={Flame} color="text-hanko" />
                  <HeaderStat label="Rank" value={rank.title} icon={Medal} color="text-emerald-400" />
                  <HeaderStat label="Sync" value="Ok" icon={Wifi} color="text-blue-400" />
              </div>
          </div>
      </motion.div>

      {/* --- Action Grid --- */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
              <ReviewDueSection count={srsDue} />
          </motion.div>
          <motion.div variants={itemVariants}>
              <JumpBackInCard />
          </motion.div>
      </motion.div>

      <div className="h-px w-full bg-bamboo/10 my-2"></div>

      {/* --- Content Focus Grid --- */}
      <div>
          <h2 className="text-xl font-bold text-ink mb-4 font-serif">Today's Focus</h2>
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={itemVariants}>
                  <NextKanjiCard />
              </motion.div>
              <motion.div variants={itemVariants}>
                  <GrammarFocusCard />
              </motion.div>
              <motion.div variants={itemVariants}>
                  <RecentVocabCard />
              </motion.div>
          </motion.div>
      </div>

      {/* --- Widgets Grid (Masonry-lite) --- */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Row 1 */}
          <motion.div variants={itemVariants} className="md:col-span-4 min-h-[250px]">
              <GameCard />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-4 min-h-[250px]">
              <ExamReadinessCard />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-4 min-h-[250px]">
              <ActivityHeatmap />
          </motion.div>

          {/* Row 2 */}
          <motion.div variants={itemVariants} className="md:col-span-6 h-72">
              <ProgressRadar />
          </motion.div>
          
          <motion.div variants={itemVariants} className="md:col-span-6 h-72">
              <AchievementsCard />
          </motion.div>
      </motion.div>
    </motion.div>
  );
};
