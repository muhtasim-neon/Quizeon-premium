
import React, { useEffect, useState } from 'react';
import { Badge, GlassCard } from '../components/UI';
import { 
  Star, Calendar, Zap, BookOpen, Gamepad2
} from 'lucide-react';
import { User } from '../types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Core Dashboard Components
import { FocusZone } from '../components/dashboard/FocusZone';
import { WordOfTheDay } from '../components/dashboard/WordOfTheDay';
import { JapanClock } from '../components/dashboard/JapanClock';

// New Immersive Components
import { SenseiAvatar } from '../components/dashboard/SenseiAvatar';
import { GrowingSakura } from '../components/dashboard/GrowingSakura';
import { SamuraiRankCard } from '../components/dashboard/SamuraiRankCard';
import { WashiQuote } from '../components/dashboard/WashiQuote';
import { WeaknessDetector } from '../components/dashboard/WeaknessDetector';
import { PerformanceAnalytics } from '../components/dashboard/PerformanceAnalytics';
import { KanjiStrokeCard } from '../components/dashboard/KanjiStrokeCard';
import { SakuraPetals } from '../components/dashboard/SakuraPetals';
import { SoundToggle } from '../components/dashboard/SoundToggle';

import { progressService } from '../services/progressService';
import { useSettings } from '../contexts/SettingsContext';

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0.1
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  }
};

// --- MAIN DASHBOARD COMPONENT ---

export const UserDashboard: React.FC<{ user: User }> = ({ user }) => {
  const xp = user.xp || 0;
  const level = Math.floor(xp / 1000) + 1;
  const currentLevelProgress = xp % 1000;
  const progressPercent = (currentLevelProgress / 1000) * 100;

  const sakuraState = progressService.getSakuraState();
  const samuraiRank = progressService.getSamuraiRank(xp);
  const analytics = progressService.getPerformanceAnalytics();
  const quote = progressService.getDailyQuote();
  
  const { playSound } = useSettings();

  return (
    <div className="min-h-screen bg-[#FAF9F6] relative overflow-hidden">
      {/* 1. Background Layers */}
      <SakuraPetals />
      
      {/* Washi Texture Overlay */}
      <div className="fixed inset-0 washi-texture opacity-40 pointer-events-none z-50"></div>

      {/* Subtle Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-hanko/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>
      
      <motion.div 
          className="max-w-7xl mx-auto pb-20 px-6 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
      >
        {/* 1. Header Section - Refined */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 py-12 mb-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                <SenseiAvatar 
                  isStudyingLong={false} 
                  hasMissedDays={false} 
                  justMastered={xp > 500} 
                />
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-ink font-jp tracking-tight">
                        Oha, {user.username}!
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                      <p className="text-bamboo font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                          <Calendar size={16} className="text-hanko" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                      <div className="h-4 w-px bg-bamboo/20 hidden md:block"></div>
                      <SoundToggle />
                    </div>
                </div>
            </div>
            
            {/* Level Progress Pill - Enhanced with Rank & Sakura */}
            <div className="w-full md:w-auto min-w-[380px] bg-white/80 backdrop-blur-md p-6 rounded-[32px] border border-bamboo/10 shadow-xl shadow-black/[0.02] relative overflow-hidden group hover:shadow-2xl hover:shadow-hanko/5 transition-all duration-500">
                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Star size={64} className="text-hanko" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-bamboo/5">
                  <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <p className="text-[8px] font-black text-bamboo uppercase tracking-widest mb-1">Current Rank</p>
                    <p className="text-sm font-black text-hanko uppercase tracking-wider">{samuraiRank}</p>
                  </motion.div>
                  <motion.div whileHover={{ x: -5 }} transition={{ type: 'spring', stiffness: 300 }} className="text-right">
                    <p className="text-[8px] font-black text-bamboo uppercase tracking-widest mb-1">Sakura Stage</p>
                    <p className="text-sm font-black text-emerald-600 uppercase tracking-wider">{sakuraState.stage}</p>
                  </motion.div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                    <span className="flex items-center gap-2 text-hanko">
                      <div className="w-2 h-2 rounded-full bg-hanko animate-pulse"></div>
                      Level {level}
                    </span>
                    <span className="text-bamboo font-black">Total XP: {xp.toLocaleString()}</span>
                </div>
                <div className="w-full h-4 bg-rice border border-bamboo/10 rounded-full overflow-hidden p-0.5 mb-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-hanko via-orange-500 to-hanko bg-[length:200%_100%] animate-shimmer rounded-full"
                    ></motion.div>
                </div>
                <div className="flex justify-between items-center text-[8px] font-bold text-bamboo uppercase tracking-widest">
                  <span>{currentLevelProgress} / 1000 XP</span>
                  <span className="text-hanko">{1000 - currentLevelProgress} XP to Next Level</span>
                </div>
            </div>
        </motion.div>

        {/* 2. Bento Grid Layout - Clean & Balanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Main Progress Column */}
            <div className="lg:col-span-2 space-y-8">
                {/* Visual Centerpiece */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  onMouseEnter={() => playSound('click')}
                >
                    <GrowingSakura state={sakuraState} />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Performance & Analytics */}
                    <motion.div 
                      variants={itemVariants} 
                      className="h-full"
                      whileHover={{ y: -5 }}
                    >
                        <PerformanceAnalytics data={analytics} />
                    </motion.div>

                    {/* AI Insights */}
                    <motion.div 
                      variants={itemVariants} 
                      className="h-full"
                      whileHover={{ y: -5 }}
                    >
                        <WeaknessDetector />
                    </motion.div>
                </div>

                {/* Daily Inspiration */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, rotate: 0.5 }}
                >
                    <WashiQuote quote={quote} />
                </motion.div>
            </div>

            {/* Sidebar Column - Status & Daily Bites */}
            <div className="space-y-8">
                {/* Status Group */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-2 gap-6">
                        <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
                            <JapanClock />
                        </motion.div>
                        <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
                            <div className="bg-hanko rounded-[32px] p-6 text-white flex flex-col justify-center items-center text-center h-full shadow-lg shadow-hanko/20 group cursor-default">
                                <motion.div
                                  whileHover={{ rotate: 15, scale: 1.2 }}
                                >
                                  <Zap size={24} className="mb-2 fill-white" />
                                </motion.div>
                                <div className="text-2xl font-black">{(user.streak || 0)}</div>
                                <div className="text-[8px] font-black uppercase tracking-widest opacity-70">Streak</div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Daily Learning */}
                <motion.div variants={itemVariants} whileHover={{ x: 5 }}>
                    <KanjiStrokeCard />
                </motion.div>

                <motion.div variants={itemVariants} whileHover={{ x: 5 }}>
                    <WordOfTheDay />
                </motion.div>

                <motion.div variants={itemVariants} whileHover={{ x: 5 }}>
                    <FocusZone />
                </motion.div>
            </div>

        </div>
      </motion.div>
    </div>
  );
};
