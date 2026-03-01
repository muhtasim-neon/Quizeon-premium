
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameEngine } from './GameEngine';
import { KANA_DATA } from '../../data/mockContent';
import { Ghost, Zap } from 'lucide-react';

export const KanaShadowFlash: React.FC = () => {
  const [target, setTarget] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashCount, setFlashCount] = useState(0);

  const nextRound = useCallback(() => {
    const newTarget = KANA_DATA[Math.floor(Math.random() * KANA_DATA.length)];
    const others = KANA_DATA.filter(k => k.id !== newTarget.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    setTarget(newTarget);
    setOptions([...others, newTarget].sort(() => Math.random() - 0.5));
    setIsFlashing(true);
    setFlashCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (isFlashing) {
      const duration = Math.max(100, 800 - (flashCount * 20));
      const timer = setTimeout(() => setIsFlashing(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isFlashing, flashCount]);

  return (
    <GameEngine
      title="Kana Shadow Flash 👻"
      rules="A Kana will flash briefly. Identify it as fast as you can!"
      onGameEnd={() => {}}
    >
      {({ onCorrect, onWrong, isPaused }) => (
        <div className="w-full flex flex-col items-center gap-12">
          <div className="h-64 flex items-center justify-center relative w-full max-w-md">
            <div className="absolute inset-0 bg-indigo-jp/5 rounded-3xl border-2 border-dashed border-indigo-jp/20 flex items-center justify-center">
              <Ghost size={120} className="text-indigo-jp/10" />
            </div>
            
            <AnimatePresence mode="wait">
              {isFlashing ? (
                <motion.div
                  key={target?.id}
                  initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1.2, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
                  className="text-9xl font-bold text-hanko z-10 drop-shadow-[0_0_15px_rgba(188,36,60,0.5)]"
                >
                  {target?.ja}
                </motion.div>
              ) : !target ? (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextRound} 
                  className="hanko-button z-10 text-xl px-8 py-4"
                >
                  Begin Training
                </motion.button>
              ) : (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-32 h-32 border-4 border-dashed border-indigo-jp/20 rounded-2xl flex items-center justify-center text-6xl text-indigo-jp/20 font-bold"
                >
                  ?
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!isFlashing && target && (
            <div className="grid grid-cols-2 gap-6 w-full max-w-md">
              {options.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isPaused) return;
                    if (opt.id === target.id) {
                      onCorrect(target.ja);
                      nextRound();
                    } else {
                      onWrong(target.ja);
                    }
                  }}
                  className="p-8 washi-card hover:bg-indigo-jp hover:text-white transition-all text-4xl font-bold border-2 border-indigo-jp/5 shadow-lg flex items-center justify-center"
                >
                  {opt.ja}
                </motion.button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-indigo-jp/40 font-bold uppercase tracking-widest text-xs">
            <Zap size={14} /> Flash Speed: {Math.max(100, 800 - (flashCount * 20))}ms
          </div>
        </div>
      )}
    </GameEngine>
  );
};
