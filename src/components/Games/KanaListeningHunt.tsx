
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Play, Music } from 'lucide-react';
import { GameEngine } from './GameEngine';
import { KANA_DATA } from '../../data/mockContent';

export const KanaListeningHunt: React.FC = () => {
  const [target, setTarget] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (!text) return;
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const nextRound = useCallback(() => {
    const newTarget = KANA_DATA[Math.floor(Math.random() * KANA_DATA.length)];
    const others = KANA_DATA.filter(k => k.id !== newTarget.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setTarget(newTarget);
    setOptions([...others, newTarget].sort(() => Math.random() - 0.5));
    setTimeout(() => speak(newTarget.ja), 500);
  }, [speak]);

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  return (
    <GameEngine
      title="Kana Listening Hunt 🎧"
      rules="Listen to the pronunciation and select the correct Kana!"
      onGameEnd={() => {}}
    >
      {({ onCorrect, onWrong, isPaused }) => (
        <div className="w-full flex flex-col items-center gap-12">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => speak(target?.ja)}
              className="w-40 h-40 rounded-full bg-indigo-jp text-white flex items-center justify-center shadow-2xl transition-all group relative z-10 border-8 border-white/20"
            >
              <Volume2 size={64} className={isSpeaking ? "animate-pulse" : ""} />
            </motion.button>
            
            {/* Sound Wave Animation */}
            <AnimatePresence>
              {isSpeaking && (
                <>
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                      className="absolute inset-0 rounded-full bg-indigo-jp/30 -z-0"
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
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
                className="p-10 washi-card hover:bg-hanko hover:text-white transition-all text-6xl font-bold border-2 border-indigo-jp/5 shadow-xl flex items-center justify-center"
              >
                {opt.ja}
              </motion.button>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  animate={{ 
                    height: isSpeaking ? [10, 25, 10] : 10,
                    backgroundColor: isSpeaking ? '#264348' : '#E5E7EB'
                  }}
                  transition={{ repeat: isSpeaking ? Infinity : 0, duration: 0.5, delay: i * 0.1 }}
                  className="w-1.5 rounded-full"
                />
              ))}
            </div>
            <p className="text-sm font-bold text-indigo-jp/30 uppercase tracking-widest">Click to Replay Audio</p>
          </div>
        </div>
      )}
    </GameEngine>
  );
};
