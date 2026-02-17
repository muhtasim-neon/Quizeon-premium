
// ... existing imports ...
import React, { useEffect, useState } from 'react';
import { Button, Badge, WonderCard, GlassCard } from '../components/UI';
import { 
  Trophy, TrendingUp, Target, Zap, AlertCircle, 
  Gamepad2, CheckCircle2, Medal, Flame, 
  Brain, Timer, GraduationCap, Keyboard, RefreshCw,
  Landmark, Activity, Wifi, Database, BookOpen
} from 'lucide-react';
import { User, SkillStats } from '../types';
import { progressService } from '../services/progressService';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// ... existing helpers and sub-components ...

const getRank = (xp: number) => {
  if (xp < 1000) return { title: 'Initiate', icon: '🌱', next: 1000, color: 'text-matcha', border: 'border-matcha/20', bg: 'bg-matcha/5' };
  if (xp < 3000) return { title: 'Ronin', icon: '🗡️', next: 3000, color: 'text-indigo', border: 'border-indigo/20', bg: 'bg-indigo/5' };
  if (xp < 6000) return { title: 'Samurai', icon: '🎎', next: 6000, color: 'text-vermilion', border: 'border-vermilion/20', bg: 'bg-vermilion/5' };
  if (xp < 10000) return { title: 'Shogun', icon: '🏯', next: 10000, color: 'text-purple-600', border: 'border-purple-200', bg: 'bg-purple-50' };
  return { title: 'Grand Master', icon: '👑', next: 20000, color: 'text-gold', border: 'border-gold', bg: 'bg-gold/10' };
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
    <div className="flex flex-col items-center px-4 border-r border-white/10 last:border-0">
        <Icon size={16} className={`mb-1 ${color}`} />
        <span className="text-xl font-black text-rice leading-none">{value}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-rice/50 mt-1">{label}</span>
    </div>
);

const DailyTargetCard = ({ type, target, current, color, icon: Icon }: { type: string, target: number, current: number, color: string, icon: any }) => {
    const percent = Math.min(100, (current / target) * 100);
    return (
        <GlassCard className="flex items-center gap-4 relative overflow-hidden group">
            <div className={`absolute right-[-10px] top-[-10px] opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon size={80} />
            </div>
            
            {/* Circular Progress */}
            <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full rotate-[-90deg]">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className={color} strokeDasharray={175} strokeDashoffset={175 - (175 * percent) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-ink text-sm">
                    {Math.round(percent)}%
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded bg-white border ${color.replace('text-', 'border-')}`}>{type}</span>
                </div>
                <div className="text-2xl font-black text-ink">
                    <span className={color}>{current}</span> <span className="text-bamboo/40 text-lg">/ {target}</span>
                </div>
                <div className="text-[10px] font-bold text-bamboo uppercase tracking-wide">Daily Goal</div>
            </div>
        </GlassCard>
    );
};

const PowerMetrics = () => {
    const [srsDue, setSrsDue] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const updateCount = () => setSrsDue(progressService.getSRSDueCount());
        updateCount();
        window.addEventListener('srs-update', updateCount);
        return () => window.removeEventListener('srs-update', updateCount);
    }, []);

    return (
        <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div variants={itemVariants}>
                <GlassCard className="flex flex-col items-center justify-center text-center !p-4 bg-white/70">
                    <div className="w-10 h-10 bg-indigo/10 rounded-xl flex items-center justify-center mb-2 text-indigo">
                        <Brain size={20} />
                    </div>
                    <div className="text-2xl font-bold text-ink mb-0.5">68%</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Mastery</div>
                </GlassCard>
            </motion.div>
            
            <motion.div variants={itemVariants}>
                <GlassCard className="flex flex-col items-center justify-center text-center !p-4 bg-white/70">
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center mb-2 text-yellow-700">
                        <Zap size={20} />
                    </div>
                    <div className="text-2xl font-bold text-ink mb-0.5">85%</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Accuracy</div>
                </GlassCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <GlassCard className="flex flex-col items-center justify-center text-center !p-4 bg-white/70">
                    <div className="w-10 h-10 bg-matcha/10 rounded-xl flex items-center justify-center mb-2 text-matcha">
                        <Timer size={20} />
                    </div>
                    <div className="text-2xl font-bold text-ink mb-0.5">1.2s</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Speed</div>
                </GlassCard>
            </motion.div>

            <motion.div variants={itemVariants} onClick={() => navigate('/learning')} className="cursor-pointer hover:scale-105 transition-transform">
                <GlassCard className="flex flex-col items-center justify-center text-center !p-4 border-vermilion/20 bg-vermilion/5">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-2 text-vermilion relative shadow-sm">
                        <RefreshCw size={20} className={srsDue > 0 ? "animate-spin-slow" : ""} />
                        {srsDue > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-vermilion rounded-full border-2 border-white"></span>}
                    </div>
                    <div className="text-2xl font-bold text-ink mb-0.5">{srsDue}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-vermilion">Reviews</div>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
};

const ExamReadinessCard = () => {
    const readiness = 65; 
    const data = [
        { name: 'Ready', value: readiness },
        { name: 'Not Ready', value: 100 - readiness }
    ];
    const COLORS = ['#1F3A5F', '#E4DAC7']; // Indigo & Linen

    return (
        <WonderCard colorClass="bg-white border-indigo/10" className="flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2 text-ink">
                        <GraduationCap size={18} className="text-indigo" /> Exam Prep
                    </h3>
                    <p className="text-xs font-medium text-ink/50">JLPT N5 Prediction</p>
                </div>
                <Badge color="bg-indigo/5 text-indigo border-indigo/10">N5</Badge>
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
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-ink">
                        {readiness}%
                    </div>
                </div>
                <div className="flex-1 space-y-3">
                    <div className="text-sm leading-tight text-ink/70">
                        You're almost there! Review <span className="font-bold text-indigo">Particles</span>.
                    </div>
                    <button className="w-full py-2 rounded-lg bg-indigo text-washi text-xs font-bold shadow-md hover:bg-indigo/90 transition-colors">
                        Mock Exam
                    </button>
                </div>
            </div>
        </WonderCard>
    );
};

const WeakAreaCard = () => {
    return (
        <WonderCard colorClass="bg-gradient-to-br from-vermilion/5 to-white border-vermilion/20" className="flex flex-col h-full group cursor-pointer hover:shadow-lg transition-all">
            <div className="absolute right-[-20px] top-[-20px] text-vermilion/10 group-hover:rotate-12 transition-transform">
                <AlertCircle size={100} />
            </div>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2 relative z-10 text-ink">
                <AlertCircle size={18} className="text-vermilion" /> Needs Focus
            </h3>
            <div className="flex-1 relative z-10 flex flex-col justify-center">
                <div className="text-2xl font-serif font-black mb-2 text-ink">Particles (は vs が)</div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-md shadow-sm border border-vermilion/20 text-vermilion">Accuracy: 42%</span>
                </div>
                <p className="text-sm text-ink/60 leading-relaxed mb-4">
                    Confusing topic and subject markers.
                </p>
                <button className="w-full py-2.5 rounded-xl bg-vermilion text-white text-sm font-bold shadow-md hover:bg-vermilion/90 transition-colors">
                    Practice Now
                </button>
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
                    <div key={b.id} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${b.unlocked ? 'bg-sakura/10 border border-sakura/20' : 'bg-linen/20 opacity-40 grayscale'}`}>
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
                <div onClick={() => navigate('/games')} className="bg-rice/50 rounded-xl p-3 text-center cursor-pointer hover:bg-purple-50 transition-colors border border-linen hover:border-purple-200 flex flex-col items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <Timer size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase text-ink/70">Match</span>
                </div>
                <div onClick={() => navigate('/games')} className="bg-rice/50 rounded-xl p-3 text-center cursor-pointer hover:bg-purple-50 transition-colors border border-linen hover:border-purple-200 flex flex-col items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <Keyboard size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase text-ink/70">Typing</span>
                </div>
            </div>
        </WonderCard>
    );
};

export const UserDashboard: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const rank = getRank(user.xp || 0);
  const hour = new Date().getHours();
  const greetingJA = hour < 12 ? 'おはよう' : hour < 18 ? 'こんにちは' : 'こんばんは';
  const greetingEN = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <motion.div 
        className="max-w-7xl mx-auto space-y-8 animate-fade-in"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
      {/* --- SS-Style Header --- */}
      <motion.div variants={itemVariants}>
          <div className="bg-ink rounded-[32px] p-4 lg:p-6 flex flex-col lg:flex-row justify-between items-center relative overflow-hidden shadow-2xl shadow-ink/20 border-2 border-bamboo/20">
              {/* Texture Overlay */}
              <div className="absolute inset-0 washi-texture opacity-10 pointer-events-none"></div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-hanko/20 rounded-full blur-3xl"></div>

              {/* Left: Identity */}
              <div className="flex items-center gap-6 z-10 w-full lg:w-auto mb-6 lg:mb-0">
                  <div className="w-20 h-20 bg-hanko rounded-3xl flex items-center justify-center text-white shadow-lg shadow-hanko/30 border-t border-white/20 shrink-0">
                      <Landmark size={40} />
                  </div>
                  <div>
                      <h1 className="text-4xl md:text-5xl font-black text-rice font-jp tracking-tight mb-1">
                          {greetingJA}, {user.username}
                      </h1>
                      <p className="text-bamboo font-bold text-xs uppercase tracking-[0.2em]">
                          {greetingEN}
                      </p>
                  </div>
              </div>

              {/* Right: Stats Capsule */}
              <div className="flex bg-[#2d1b18] rounded-2xl p-2 z-10 border border-white/5 w-full lg:w-auto justify-between lg:justify-end overflow-x-auto">
                  <HeaderStat label="Points" value={user.xp || 0} icon={Zap} color="text-yellow-500" />
                  <HeaderStat label="Streak" value={user.streak || 0} icon={Flame} color="text-hanko" />
                  <HeaderStat label="Rank" value={rank.title} icon={Medal} color="text-emerald-400" />
                  <HeaderStat label="Sync" value="44m" icon={Wifi} color="text-blue-400" />
                  <HeaderStat label="Load" value="0" icon={Activity} color="text-purple-400" />
              </div>
          </div>
      </motion.div>

      {/* --- Daily Targets Section (New) --- */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants}>
              <DailyTargetCard 
                  type="Vocab" 
                  target={10} 
                  current={Math.min(10, Math.floor((user.xp || 0) / 100))} // Simulated progress based on XP
                  color="text-indigo-600" 
                  icon={Database} 
              />
          </motion.div>
          <motion.div variants={itemVariants}>
              <DailyTargetCard 
                  type="Kanji" 
                  target={5} 
                  current={Math.min(5, Math.floor((user.xp || 0) / 300))} // Simulated progress
                  color="text-hanko" 
                  icon={Landmark} 
              />
          </motion.div>
          <motion.div variants={itemVariants}>
              <DailyTargetCard 
                  type="Grammar" 
                  target={1} 
                  current={Math.min(1, Math.floor((user.xp || 0) / 500))} // Simulated progress
                  color="text-emerald-600" 
                  icon={BookOpen} // Fallback to BookOpen if Grammar icon not ideal
              />
          </motion.div>
      </motion.div>

      <div className="h-px w-full bg-bamboo/10 my-4"></div>

      {/* Functional Metrics */}
      <PowerMetrics />

      {/* Main Widgets Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div variants={itemVariants} className="md:col-span-4 h-64">
              <GameCard />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-4 h-64">
              <ExamReadinessCard />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-4 h-64">
              {/* Replaced TodayGoalCard with AchievementsCard here to balance layout since Goals are now at top */}
              <AchievementsCard />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-6 h-72">
              <ProgressRadar />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-6 h-72">
              <WeakAreaCard />
          </motion.div>
      </motion.div>
    </motion.div>
  );
};
