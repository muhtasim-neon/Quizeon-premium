
import React, { useEffect, useState, useMemo } from 'react';
import { 
  Clock, Trophy, Zap, BookOpen, 
  Gamepad2, ChevronRight, Hash,
  Cloud, Sun, Snowflake, Leaf,
  Flower2, Wind, MapPin, TrendingUp,
  Sparkles, MessageSquare, ArrowRight, Brain,
  RefreshCw
} from 'lucide-react';
import { User } from '@/types';
import { VOCAB_DATA, KANJI_DATA } from '@/data/mockContent';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, Button, Badge, Skeleton } from '@/components/UI';

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

// 1. Dashboard Header
const DashboardHeader = ({ user }: { user: User }) => {
  const [time, setTime] = useState(getJapanTime());

  useEffect(() => {
    const timer = setInterval(() => setTime(getJapanTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = getGreeting(time);
  const season = getSeason(time);
  const SeasonIcon = season.icon;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-hanko font-bold text-sm uppercase tracking-widest">{greeting.jp}</span>
          <div className="w-1 h-1 rounded-full bg-bamboo/20"></div>
          <span className="text-bamboo font-medium text-sm">{greeting.en}, {user.username}</span>
        </div>
        <h1 className="text-4xl font-black text-ink tracking-tight">Your Dojo Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md p-2 pl-4 rounded-2xl border border-bamboo/10 shadow-sm">
        <div className="text-right">
          <div className="text-[10px] font-black text-bamboo uppercase tracking-widest">Tokyo Time • {season.name}</div>
          <div className="text-lg font-black text-ink tabular-nums">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
        </div>
        <div className={`p-3 ${season.bg} ${season.color} rounded-xl border border-current/10`}>
          <SeasonIcon size={20} />
        </div>
      </div>
    </div>
  );
};

// 2. Stats Overview
const StatsOverview = ({ user }: { user: User }) => {
  const xp = user.xp || 0;
  const level = Math.floor(xp / 1000) + 1;
  const progress = (xp % 1000) / 10;

  const stats = [
    { label: 'Current Level', value: `Level ${level}`, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Daily Streak', value: `${user.streak || 0} Days`, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Words Mastered', value: '145', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total XP', value: `${xp.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <GlassCard key={i} className="p-4 border-b-2 border-bamboo/5 hover:border-bamboo/20 transition-all">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 ${stat.bg} ${stat.color} rounded-xl`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-bamboo uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg font-black text-ink">{stat.value}</p>
            </div>
          </div>
        </GlassCard>
      ))}
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
  const [vocab, setVocab] = useState<any[]>([]);
  const [kanji, setKanji] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshLists = () => {
    setIsRefreshing(true);
    setVocab([...VOCAB_DATA].sort(() => Math.random() - 0.5).slice(0, 10));
    setKanji([...KANJI_DATA].sort(() => Math.random() - 0.5).slice(0, 5));
    setTimeout(() => setIsRefreshing(false), 600);
  };

  useEffect(() => {
    refreshLists();
  }, []);

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
      <div className="bg-white rounded-[32px] p-6 border-2 border-b-4 border-bamboo/10 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="text-emerald-500" size={20} />
            <h3 className="font-bold text-lg text-ink">Daily Vocabulary</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={refreshLists}
              className="p-1.5 hover:bg-rice rounded-lg text-bamboo hover:text-hanko transition-all"
              title="Refresh List"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
            <Badge color="bg-emerald-50 text-emerald-600 border-emerald-100">10 Items</Badge>
          </div>
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
      <div className="bg-white rounded-[32px] p-6 border-2 border-b-4 border-bamboo/10 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Hash className="text-orange-500" size={20} />
            <h3 className="font-bold text-lg text-ink">Focus Kanji</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={refreshLists}
              className="p-1.5 hover:bg-rice rounded-lg text-bamboo hover:text-hanko transition-all"
              title="Refresh List"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
            <Badge color="bg-orange-50 text-orange-600 border-orange-100">5 Items</Badge>
          </div>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto pb-12 px-4 md:px-0"
    >
      <DashboardHeader user={user} />
      
      <div className="space-y-6">
        {/* Stats Overview */}
        <StatsOverview user={user} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Primary Actions & Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Lists */}
            <DailyLists />
          </div>

          {/* Right Column: Tools & Insights */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <SenseiSuggestions />
            </GlassCard>

            <LastGames />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

