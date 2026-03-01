
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameEngine } from './GameEngine';
import { KANA_DATA } from '../../data/mockContent';
import { Music, Play, Volume2, Zap } from 'lucide-react';

export const KanaRhythmTap: React.FC = () => {
  const [sequence, setSequence] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userIndex, setUserIndex] = useState(0);
  const [options, setOptions] = useState<any[]>([]);

  const startRound = useCallback(async () => {
    const newSeq = Array(4).fill(0).map(() => KANA_DATA[Math.floor(Math.random() * KANA_DATA.length)]);
    setSequence(newSeq);
    setUserIndex(0);
    
    // Generate options including all sequence items plus some distractors
    const distractors = KANA_DATA.filter(k => !newSeq.find(s => s.id === k.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    setOptions([...new Set([...newSeq, ...distractors])].sort(() => Math.random() - 0.5));

    await playSequence(newSeq);
  }, []);

  const playSequence = async (seq: any[]) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      setActiveIndex(i);
      await new Promise(r => setTimeout(r, 800));
    }
    setActiveIndex(-1);
    setIsPlaying(false);
  };

  return (
    <GameEngine
      title="Kana Rhythm Tap 🎵"
      rules="Watch the rhythm and tap the Kana in the correct order!"
      onGameEnd={() => {}}
    >
      {({ onCorrect, onWrong, isPaused }) => (
        <div className="w-full flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex gap-6 h-32 items-center justify-center w-full">
              <AnimatePresence mode="popLayout">
                {sequence.length > 0 ? (
                  sequence.map((kana, i) => (
                    <motion.div
                      key={`seq-${i}-${kana.id}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: activeIndex === i ? 1.4 : 1,
                        opacity: 1,
                        backgroundColor: activeIndex === i ? '#BC243C' : '#ffffff',
                        color: activeIndex === i ? '#ffffff' : '#1A1A1B',
                        borderColor: i < userIndex ? '#78866B' : 'rgba(38, 67, 72, 0.1)'
                      }}
                      className="w-20 h-20 washi-card flex items-center justify-center text-4xl font-bold rounded-2xl shadow-xl border-4 transition-colors relative"
                    >
                      {activeIndex === i ? kana.ja : (i < userIndex ? kana.ja : '?')}
                      {i < userIndex && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-bamboo text-white rounded-full p-1"
                        >
                          <Zap size={12} fill="white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startRound} 
                    className="hanko-button text-2xl px-12 py-6 flex items-center gap-3"
                  >
                    <Play size={32} /> Start Rhythm
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            {isPlaying && (
              <div className="flex items-center gap-3 text-hanko font-bold animate-pulse text-lg">
                <Volume2 /> Memorizing Beats...
              </div>
            )}
          </div>

          {!isPlaying && sequence.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full max-w-lg">
              {options.map((kana, i) => (
                <motion.button
                  key={`btn-${i}-${kana.id}`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isPaused) return;
                    if (kana.id === sequence[userIndex].id) {
                      const nextUserIndex = userIndex + 1;
                      setUserIndex(nextUserIndex);
                      if (nextUserIndex === sequence.length) {
                        onCorrect(kana.ja);
                        setTimeout(startRound, 1000);
                      }
                    } else {
                      onWrong(sequence[userIndex].ja);
                    }
                  }}
                  className="p-8 washi-card hover:bg-bamboo hover:text-white transition-all text-4xl font-bold border-2 border-indigo-jp/5 shadow-lg"
                >
                  {kana.ja}
                </motion.button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-indigo-jp/20">
            <Music size={24} />
            <div className="flex gap-1">
              {[0, 1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ 
                    height: activeIndex === i ? [10, 30, 10] : 10,
                    backgroundColor: activeIndex === i ? '#BC243C' : '#E5E7EB'
                  }}
                  transition={{ repeat: activeIndex === i ? Infinity : 0, duration: 0.4 }}
                  className="w-2 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </GameEngine>
  );
};
