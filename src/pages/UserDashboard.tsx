
import React, { useEffect, useState, useMemo } from 'react';
import { 
  Clock, Trophy, Zap, Search, BookOpen, 
  Gamepad2, Star, ChevronRight, Hash,
  Cloud, Sun, Snowflake, Leaf, ExternalLink,
  Flower2, Wind, MapPin, TrendingUp, Activity,
  BarChart3, Sparkles, MessageSquare, ArrowRight, Brain
} from 'lucide-react';
import { User } from '@/types';
import { ALL_CONTENT, VOCAB_DATA, KANJI_DATA } from '@/data/mockContent';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, Button, Badge, Input, ProgressRing, Skeleton, GlowCard } from '@/components/UI';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const MOCK_CHART_DATA = [
  { name: 'Mon', xp: 400 },
  { name: 'Tue', xp: 300 },
  { name: 'Wed', xp: 600 },
  { name: 'Thu', xp: 800 },
  { name: 'Fri', xp: 500 },
  { name: 'Sat', xp: 900 },
  { name: 'Sun', xp: 1100 },
];

// --- HELPERS ---

const getJapanTime = () => {
  const now = new Date();
  // Japan is UTC+9
  const japanTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (9 * 3600000));
  return japanTime;
};

const getSeason = (date: Date) => {
  const month = date.getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return { 
    name: 'Spring', icon: Flower2, color: 'text-pink-500', bg: 'bg-pink-50', jp: '春', romaji: 'Haru',
    note: 'Sakura (Cherry Blossoms) are in full bloom across Japan.' 
  };
  if (month >= 6 && month <= 8) return { 
    name: 'Summer', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50', jp: '夏', romaji: 'Natsu',
    note: 'Matsuri festivals and fireworks light up the summer nights.'
  };
  if (month >= 9 && month <= 11) return { 
    name: 'Autumn', icon: Wind, color: 'text-amber-600', bg: 'bg-amber-50', jp: '秋', romaji: 'Aki',
    note: 'Momiji (Maple leaves) are turning vibrant red and gold.'
  };
  return { 
    name: 'Winter', icon: Snowflake, color: 'text-blue-400', bg: 'bg-blue-50', jp: '冬', romaji: 'Fuyu',
    note: 'Time for hot onsen baths and snowy mountain views.'
  };
};

const getEra = (date: Date) => {
  const year = date.getFullYear();
  const reiwaYear = year - 2018;
  return `Reiwa ${reiwaYear} (令和${reiwaYear}年)`;
};

const getGreeting = (date: Date) => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return { jp: 'おはよう', en: 'Good Morning' };
  if (hour >= 11 && hour < 18) return { jp: 'こんにちは', en: 'Good Afternoon' };
  return { jp: 'こんばんは', en: 'Good Evening' };
};

const getJpDay = (date: Date) => {
  const days = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
  return days[date.getDay()];
};

// 6. Sensei Smart Suggestions
const SenseiSuggestions = () => {
  const suggestions = [
    { text: "You're struggling with 'Taberu' conjugation. Review Lesson 4?", type: "review", icon: Brain },
    { text: "Morning is the best time for Kanji. Ready for a quick 5-min session?", type: "tip", icon: Sun },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-hanko animate-pulse" size={18} />
        <h3 className="font-bold text-sm text-ink uppercase tracking-widest">Sensei's Insight</h3>
      </div>
      {suggestions.map((s, i) => (
        <motion.div 
          key={i}
          whileHover={{ x: 5 }}
          className="p-4 bg-rice/50 rounded-2xl border border-bamboo/5 flex items-start gap-3 group cursor-pointer hover:bg-white hover:shadow-md transition-all"
        >
          <div className="p-2 bg-white rounded-xl text-hanko shadow-sm group-hover:scale-110 transition-transform">
            <s.icon size={16} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-ink leading-relaxed">{s.text}</p>
            <div className="mt-2 flex items-center text-[10px] font-black text-hanko uppercase tracking-widest">
              Take Action <ArrowRight size={10} className="ml-1" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- COMPONENTS ---

// 1. Japan Status (Time & Season)
const JapanStatus = () => {
  const [time, setTime] = useState(getJapanTime());

  useEffect(() => {
    const timer = setInterval(() => setTime(getJapanTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const season = getSeason(time);
  const greeting = getGreeting(time);
  const jpDay = getJpDay(time);
  const era = getEra(time);
  const SeasonIcon = season.icon;

  return (
    <GlassCard className="p-0 overflow-hidden bg-white/95 border-b-4 border-bamboo/10 shadow-lg group">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-bamboo/10">
        {/* Time Section */}
        <div className="flex-1 p-6 flex items-center gap-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-[0.03] rotate-12 group-hover:rotate-45 transition-transform duration-1000">
            <Clock size={120} />
          </div>
          <div className="p-4 bg-rice rounded-3xl border-2 border-bamboo/5 shadow-inner relative z-10">
            <Clock className="text-hanko animate-pulse" size={32} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-hanko font-black text-lg">{greeting.jp}</span>
              <span className="text-bamboo/40 text-[10px] uppercase font-bold tracking-tighter">({greeting.en})</span>
            </div>
            <h2 className="text-4xl font-black text-ink tabular-nums tracking-tighter leading-none mb-2">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[10px] font-bold text-bamboo uppercase tracking-widest flex items-center gap-1.5">
                <MapPin size={10} className="text-hanko" /> Tokyo, Japan
              </p>
              <div className="w-1 h-1 rounded-full bg-bamboo/20"></div>
              <p className="text-[10px] font-bold text-hanko uppercase tracking-widest">{jpDay}</p>
              <div className="w-1 h-1 rounded-full bg-bamboo/20"></div>
              <p className="text-[10px] font-bold text-bamboo/60 uppercase tracking-widest">{era}</p>
            </div>
          </div>
        </div>

        {/* Season Section */}
        <div className="flex-1 p-6 flex items-center gap-6 relative overflow-hidden">
          <div className={`absolute -right-4 -bottom-4 opacity-[0.05] rotate-12 group-hover:-rotate-12 transition-transform duration-1000 ${season.color}`}>
            <SeasonIcon size={120} />
          </div>
          <div className={`p-4 ${season.bg} rounded-3xl border-2 border-bamboo/5 shadow-inner relative z-10 ${season.color}`}>
            <SeasonIcon size={32} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-ink font-black text-2xl">{season.jp}</span>
              <span className="text-bamboo/40 text-[10px] uppercase font-bold tracking-tighter">({season.romaji})</span>
              <Badge color={`${season.bg} ${season.color} border-current/10 ml-1`}>{season.name}</Badge>
            </div>
            <p className="text-xs font-bold text-ink/80 leading-relaxed max-w-[240px]">
              {season.note}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? season.color.replace('text-', 'bg-') : 'bg-bamboo/10'}`}></div>
                ))}
              </div>
              <span className="text-[9px] font-black text-bamboo/40 uppercase tracking-widest">Seasonal Insight</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

// 2. User Progress & Stats
const UserProgress = ({ user }: { user: User }) => {
  const xp = user.xp || 0;
  const level = Math.floor(xp / 1000) + 1;
  const progress = (xp % 1000) / 10; // Percentage

  return (
    <GlassCard hoverEffect className="p-6 bg-white/95 border-b-4 border-bamboo/10 shadow-lg h-full flex flex-col justify-center relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-hanko/5 rounded-full blur-2xl group-hover:bg-hanko/10 transition-colors"></div>
      
      <div className="flex items-center gap-6 mb-6">
        <ProgressRing progress={progress} size={100} strokeWidth={8} />
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="text-yellow-500" size={18} />
            <h3 className="font-black text-2xl text-ink">Level {level}</h3>
          </div>
          <p className="text-[10px] font-black text-bamboo uppercase tracking-widest">Apprentice Rank</p>
          <div className="mt-2 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-bold text-emerald-600 uppercase">Online Now</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-rice/50 p-3 rounded-2xl border border-bamboo/5">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="text-orange-500" size={14} />
            <span className="text-[10px] font-black text-bamboo uppercase tracking-tighter">Streak</span>
          </div>
          <span className="text-xl font-black text-ink">{user.streak || 0} Days</span>
        </div>
        <div className="bg-rice/50 p-3 rounded-2xl border border-bamboo/5">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="text-blue-500" size={14} />
            <span className="text-[10px] font-black text-bamboo uppercase tracking-tighter">Words</span>
          </div>
          <span className="text-xl font-black text-ink">145</span>
        </div>
      </div>
    </GlassCard>
  );
};

// 3. Dictionary
const Dictionary = () => {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    if (!query) return [];
    return ALL_CONTENT.filter(item => 
      item.ja.includes(query) || 
      item.romaji.toLowerCase().includes(query.toLowerCase()) || 
      item.en.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, [query]);

  return (
    <div className="bg-white rounded-[32px] p-6 border-2 border-b-4 border-bamboo/10 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Search className="text-blue-500" size={20} />
        <h3 className="font-bold text-lg text-ink">Japanese Dictionary</h3>
      </div>
      <div className="relative mb-4">
        <Input 
          placeholder="Search Kanji, Vocab, or English..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          className="bg-rice border-bamboo/10 focus:border-blue-400"
        />
      </div>
      <div className="space-y-2 min-h-[120px]">
        <AnimatePresence mode="popLayout">
          {query === '' ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-bamboo/40 text-sm italic"
            >
              Type to search the database...
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-bamboo/40 text-sm"
            >
              No results found.
            </motion.div>
          ) : (
            results.map(item => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex justify-between items-center p-3 bg-rice rounded-xl border border-bamboo/5 hover:border-blue-200 transition-colors group cursor-pointer"
              >
                <div>
                  <span className="text-lg font-bold text-ink group-hover:text-blue-600 transition-colors">{item.ja}</span>
                  <span className="text-xs text-bamboo ml-2">({item.romaji})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-blue-600">{item.en}</span>
                  <ExternalLink size={14} className="text-bamboo/30 group-hover:text-blue-400" />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// 4. Last Games
const LastGames = () => {
  const games = [
    { name: 'Kana Invaders', score: 1250, date: 'Today', icon: Zap, color: 'bg-orange-100 text-orange-600' },
    { name: 'Kanji Match', score: 850, date: 'Yesterday', icon: Gamepad2, color: 'bg-blue-100 text-blue-600' },
    { name: 'Speed Review', score: 95, date: '2 days ago', icon: Clock, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 border-2 border-b-4 border-bamboo/10 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Gamepad2 className="text-purple-500" size={20} />
        <h3 className="font-bold text-lg text-ink">Recent Activity</h3>
      </div>
      <div className="space-y-3">
        {games.map((game, i) => (
          <div key={i} className="flex items-center gap-4 p-3 bg-rice rounded-2xl border border-bamboo/5 hover:border-purple-200 transition-all cursor-pointer group">
            <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${game.color}`}>
              <game.icon size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-ink">{game.name}</h4>
              <p className="text-[10px] text-bamboo font-bold uppercase tracking-tighter">{game.date}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-ink">{game.score}</span>
              <span className="text-[10px] text-bamboo block">pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Daily Lists (Vocab & Kanji)
const DailyLists = () => {
  const vocab = useMemo(() => VOCAB_DATA.slice(0, 10), []);
  const kanji = useMemo(() => KANJI_DATA.slice(0, 5), []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Vocabulary */}
      <div className="bg-white rounded-[32px] p-6 border-2 border-b-4 border-bamboo/10 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="text-emerald-500" size={20} />
            <h3 className="font-bold text-lg text-ink">Daily Vocabulary</h3>
          </div>
          <Badge color="bg-emerald-50 text-emerald-600 border-emerald-100">10 Items</Badge>
        </div>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-1"
        >
          {vocab.map((item) => (
            <motion.div 
              key={item.id}
              variants={itemAnim}
              className="flex justify-between items-center p-2.5 hover:bg-rice rounded-xl transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-ink group-hover:text-hanko transition-colors">{item.ja}</span>
                <span className="text-[10px] text-bamboo font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{item.romaji}</span>
              </div>
              <span className="text-xs font-bold text-bamboo/70">{item.en}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Kanji */}
      <div className="bg-white rounded-[32px] p-6 border-2 border-b-4 border-bamboo/10 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Hash className="text-orange-500" size={20} />
            <h3 className="font-bold text-lg text-ink">Focus Kanji</h3>
          </div>
          <Badge color="bg-orange-50 text-orange-600 border-orange-100">5 Items</Badge>
        </div>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4"
        >
          {kanji.map((item) => (
            <motion.div 
              key={item.id}
              variants={itemAnim}
              className="flex items-center gap-4 p-4 bg-rice rounded-2xl border border-bamboo/5 group hover:border-orange-200 transition-all cursor-pointer"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl border border-bamboo/10 shadow-sm text-3xl font-black text-ink group-hover:scale-110 group-hover:text-hanko transition-all">
                {item.ja}
              </div>
              <div>
                <h4 className="font-bold text-base text-ink">{item.en}</h4>
                <p className="text-xs text-bamboo font-bold uppercase tracking-widest">{item.romaji}</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={20} className="text-orange-400" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD ---

export const UserDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12 px-4 md:px-0">
        <Skeleton className="h-48 w-full rounded-[32px]" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-64 md:col-span-3 rounded-[32px]" />
          <Skeleton className="h-64 rounded-[32px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-[32px]" />
          <Skeleton className="h-96 rounded-[32px]" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8 pb-12 px-4 md:px-0"
    >
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Row 1: Status & Progress */}
        <div className="md:col-span-2 lg:col-span-2">
          <JapanStatus />
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <UserProgress user={user} />
        </div>

        {/* Row 2: Daily Challenge & Sensei */}
        <div className="md:col-span-2 lg:col-span-2">
          <GlowCard className="h-full bg-gradient-to-br from-hanko to-orange-600 text-white border-none min-h-[240px]">
            <div className="relative z-10 flex flex-col h-full justify-center p-4">
              <div className="flex items-center gap-2 mb-4">
                <Star className="text-yellow-300 fill-yellow-300" size={24} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Daily Challenge</span>
              </div>
              <h3 className="text-4xl font-black mb-3 leading-tight">Master N5 Kanji</h3>
              <p className="text-base text-white/80 mb-8 leading-relaxed max-w-md">
                You're only 25 Kanji away from your next milestone! Ready to push your limits today?
              </p>
              <div className="mt-auto max-w-xs">
                <Button magnetic className="w-full bg-white text-hanko border-none hover:bg-rice font-black py-5 shadow-2xl text-lg">
                  START SESSION <ChevronRight className="ml-2" size={24} />
                </Button>
              </div>
            </div>
          </GlowCard>
        </div>
        <div className="md:col-span-1 lg:col-span-1">
          <GlassCard className="h-full">
            <SenseiSuggestions />
          </GlassCard>
        </div>
        <div className="md:col-span-1 lg:col-span-1">
          <Dictionary />
        </div>

        {/* Row 3: Progress Chart & Lists */}
        <div className="md:col-span-2 lg:col-span-2">
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-hanko" size={20} />
                <h3 className="font-bold text-lg text-ink">Weekly XP Progress</h3>
              </div>
              <Badge color="bg-hanko/10 text-hanko border-hanko/20">Live Stats</Badge>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#bc2f32" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#bc2f32" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#795548' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: '#fff',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="#bc2f32" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorXp)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <DailyLists />
        </div>

        {/* Row 4: Recent Activity */}
        <div className="md:col-span-2 lg:col-span-4">
          <LastGames />
        </div>
      </div>
    </motion.div>
  );
};

