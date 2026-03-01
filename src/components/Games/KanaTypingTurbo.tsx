
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameEngine } from './GameEngine';
import { KANA_DATA } from '../../data/mockContent';
import { Keyboard, Zap } from 'lucide-react';

export const KanaTypingTurbo: React.FC = () => {
  const [target, setTarget] = useState<any>(null);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [streak, setStreak] = useState(0);

  const nextRound = useCallback(() => {
    setTarget(KANA_DATA[Math.floor(Math.random() * KANA_DATA.length)]);
    setInput('');
  }, []);

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    focusInput();
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, [target]);

  return (
    <GameEngine
      title="Kana Typing Turbo ⌨️"
      rules="Type the correct Romaji for the displayed Kana as fast as you can!"
      onGameEnd={() => {}}
    >
      {({ onCorrect, onWrong, isPaused }) => (
        <div className="w-full flex flex-col items-center gap-10">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={target?.id}
                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.5, opacity: 0, y: -20 }}
                className="text-[12rem] font-bold text-hanko drop-shadow-2xl font-serif"
              >
                {target?.ja}
              </motion.div>
            </AnimatePresence>
            
            {streak > 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute -right-16 top-0 text-orange-500 font-black flex items-center gap-1"
              >
                <Zap size={20} fill="currentColor" /> {streak}
              </motion.div>
            )}
          </div>

          <div className="w-full max-w-md relative">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                autoFocus
                value={input}
                disabled={isPaused}
                onChange={(e) => {
                  if (isPaused) return;
                  const val = e.target.value.toLowerCase().trim();
                  setInput(val);
                  
                  if (val === target.romaji) {
                    onCorrect(target.ja);
                    setStreak(prev => prev + 1);
                    nextRound();
                  } else if (val.length >= target.romaji.length && val !== target.romaji) {
                    onWrong(target.ja);
                    setStreak(0);
                    setInput('');
                  }
                }}
                className="input-jp text-5xl text-center font-mono tracking-widest bg-white/80 shadow-2xl"
                placeholder="..."
              />
              
              {/* Ghost Text */}
              {!input && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-indigo-jp/10 text-5xl font-mono tracking-widest">
                  {target?.romaji}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 text-indigo-jp/40 font-bold uppercase tracking-widest text-xs">
              <Keyboard size={16} /> Focus active • Start typing
            </div>
          </div>

          <div className="flex gap-2">
            {target?.romaji.split('').map((char: string, i: number) => (
              <div 
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  input[i] === char ? "bg-bamboo scale-125" : (input[i] ? "bg-hanko" : "bg-indigo-jp/10")
                )}
              />
            ))}
          </div>
        </div>
      )}
    </GameEngine>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
