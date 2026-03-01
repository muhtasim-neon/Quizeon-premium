
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameEngine } from './GameEngine';
import { KANA_DATA } from '../../data/mockContent';
import { Play, Repeat } from 'lucide-react';

export const KanaMemoryChain: React.FC = () => {
  const [sequence, setSequence] = useState<any[]>([]);
  const [userSequence, setUserSequence] = useState<any[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<any[]>([]);

  const generateNext = (currentSeq: any[]) => {
    const next = KANA_DATA[Math.floor(Math.random() * KANA_DATA.length)];
    return [...currentSeq, next];
  };

  const startRound = (prevSeq: any[]) => {
    const nextSeq = generateNext(prevSeq);
    setSequence(nextSeq);
    setUserSequence([]);
    setCurrentIndex(0);
    setIsShowing(true);
    
    // Generate new options including the correct one
    const lastAdded = nextSeq[nextSeq.length - 1];
    const others = KANA_DATA.filter(k => k.id !== lastAdded.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 11);
    setOptions([...others, lastAdded].sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    if (isShowing) {
      const timer = setTimeout(() => {
        if (currentIndex < sequence.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setTimeout(() => {
            setIsShowing(false);
            setCurrentIndex(0);
          }, 1000);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isShowing, currentIndex, sequence]);

  return (
    <GameEngine
      title="Kana Memory Chain 🔗"
      rules="Repeat the growing sequence of Kana. One mistake and it's game over!"
      initialLives={1}
      onGameEnd={() => {}}
    >
      {({ onCorrect, onWrong, level, isPaused }) => (
        <div className="w-full flex flex-col items-center gap-12">
          <div className="h-48 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {isShowing ? (
                <motion.div
                  key={sequence[currentIndex]?.id}
                  initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1.5, opacity: 1, rotate: 0 }}
                  exit={{ scale: 2, opacity: 0, rotate: 10 }}
                  className="text-9xl font-bold text-hanko drop-shadow-2xl"
                >
                  {sequence[currentIndex]?.ja}
                </motion.div>
              ) : sequence.length === 0 ? (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startRound([])}
                  className="bamboo-button text-2xl px-12 py-6 flex items-center gap-3"
                >
                  <Play size={32} /> Begin Training
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="text-3xl font-bold text-indigo-jp flex items-center gap-3">
                    <Repeat className="animate-spin-slow" /> Your Turn!
                  </div>
                  <p className="text-indigo-jp/60 font-medium">Repeat the sequence in order</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full max-w-2xl">
            <div className="flex justify-center gap-3 mb-8 h-4">
              {sequence.map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    backgroundColor: i < userSequence.length ? '#78866B' : '#E5E7EB',
                    width: i === userSequence.length && !isShowing ? '24px' : '12px'
                  }}
                  className="h-3 rounded-full transition-all duration-300"
                />
              ))}
            </div>

            {!isShowing && sequence.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {options.map((kana) => (
                  <motion.button
                    key={kana.id}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (isPaused) return;
                      const expected = sequence[userSequence.length];
                      if (kana.id === expected.id) {
                        const newSeq = [...userSequence, kana];
                        setUserSequence(newSeq);
                        if (newSeq.length === sequence.length) {
                          onCorrect(kana.ja);
                          setTimeout(() => startRound(sequence), 800);
                        }
                      } else {
                        onWrong(expected.ja);
                      }
                    }}
                    className="aspect-square washi-card flex items-center justify-center text-4xl font-bold hover:bg-hanko hover:text-white transition-all border-2 border-indigo-jp/5 shadow-md"
                  >
                    {kana.ja}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </GameEngine>
  );
};
