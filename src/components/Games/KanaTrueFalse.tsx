
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Zap } from 'lucide-react';
import { GameEngine } from './GameEngine';
import { KANA_DATA } from '../../data/mockContent';

export const KanaTrueFalse: React.FC = () => {
  const [current, setCurrent] = useState<any>(null);
  const [isCorrectPair, setIsCorrectPair] = useState(true);
  const [streak, setStreak] = useState(0);

  const nextRound = useCallback(() => {
    const kana = KANA_DATA[Math.floor(Math.random() * KANA_DATA.length)];
    const shouldBeCorrect = Math.random() > 0.5;
    setIsCorrectPair(shouldBeCorrect);
    
    if (shouldBeCorrect) {
      setCurrent({ kana: kana.ja, romaji: kana.romaji });
    } else {
      const wrongRomaji = KANA_DATA.filter(k => k.id !== kana.id)[Math.floor(Math.random() * (KANA_DATA.length - 1))].romaji;
      setCurrent({ kana: kana.ja, romaji: wrongRomaji });
    }
  }, []);

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  return (
    <GameEngine
      title="Kana True / False ✅❌"
      rules="Decide if the Kana and Romaji pair is correct. Be quick!"
      onGameEnd={() => {}}
    >
      {({ onCorrect, onWrong, isPaused }) => (
        <div className="w-full flex flex-col items-center gap-12">
          <div className="relative w-full flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${current?.kana}-${current?.romaji}`}
                initial={{ scale: 0.8, opacity: 0, x: 50 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 1.2, opacity: 0, x: -50 }}
                className="glass-card p-10 flex flex-col items-center gap-4 border-4 border-indigo-jp/10 shadow-2xl min-w-[300px] washi-panel"
              >
                <div className="text-[10rem] font-bold text-hanko leading-none font-serif">{current?.kana}</div>
                <div className="h-1 w-24 bg-indigo-jp/10" />
                <div className="text-6xl font-black font-mono text-indigo-jp tracking-widest">{current?.romaji}</div>
              </motion.div>
            </AnimatePresence>
            
            {streak > 2 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-6 -right-6 bg-orange-500 text-white p-4 rounded-full shadow-xl flex items-center gap-2 font-black"
              >
                <Zap size={24} fill="white" /> {streak}
              </motion.div>
            )}
          </div>

          <div className="flex gap-8 w-full max-w-lg">
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isPaused) return;
                if (isCorrectPair) {
                  onCorrect(current.kana);
                  setStreak(prev => prev + 1);
                } else {
                  onWrong(current.kana);
                  setStreak(0);
                }
                nextRound();
              }}
              className="flex-1 p-10 rounded-3xl bg-bamboo text-white flex flex-col items-center gap-4 hover:bg-bamboo/90 transition-all shadow-[0_10px_0_rgb(90,101,80)] active:shadow-none active:translate-y-[10px]"
            >
              <Check size={64} strokeWidth={3} />
              <span className="text-2xl font-black tracking-widest">TRUE</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isPaused) return;
                if (!isCorrectPair) {
                  onCorrect(current.kana);
                  setStreak(prev => prev + 1);
                } else {
                  onWrong(current.kana);
                  setStreak(0);
                }
                nextRound();
              }}
              className="flex-1 p-10 rounded-3xl bg-hanko text-white flex flex-col items-center gap-4 hover:bg-hanko/90 transition-all shadow-[0_10px_0_rgb(140,28,45)] active:shadow-none active:translate-y-[10px]"
            >
              <X size={64} strokeWidth={3} />
              <span className="text-2xl font-black tracking-widest">FALSE</span>
            </motion.button>
          </div>

          <div className="text-indigo-jp/20 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <Zap size={14} /> Quick reflex training
          </div>
        </div>
      )}
    </GameEngine>
  );
};
