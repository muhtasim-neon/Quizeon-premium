
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, RefreshCw, Home, Zap, Timer as TimerIcon, Pause, Play, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../../contexts/GameContext';

interface GameEngineProps {
  title: string;
  rules: string;
  onGameEnd: (score: number, accuracy: number) => void;
  children: (props: {
    lives: number;
    score: number;
    level: number;
    onCorrect: (kana?: string) => void;
    onWrong: (kana?: string) => void;
    isGameOver: boolean;
    isPaused: boolean;
  }) => React.ReactNode;
  initialLives?: number;
  timeLimit?: number; // in seconds
}

export const GameEngine: React.FC<GameEngineProps> = ({
  title,
  rules,
  onGameEnd,
  children,
  initialLives = 3,
  timeLimit = 60
}) => {
  const { addXP, recordMistake, recordSuccess } = useGame();
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'paused' | 'result'>('intro');
  const [lives, setLives] = useState(initialLives);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startGame = () => {
    setGameState('playing');
    setLives(initialLives);
    setScore(0);
    setLevel(1);
    setCombo(0);
    setTimeLeft(timeLimit);
    setCorrectCount(0);
    setTotalAttempts(0);
    setFeedback(null);
  };

  const endGame = useCallback(() => {
    setGameState('result');
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    onGameEnd(score, accuracy);
    addXP(Math.floor(score / 10));
    
    if (accuracy === 100 && score > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#BC243C', '#78866B', '#264348', '#D4AF37']
      });
    }
  }, [score, correctCount, totalAttempts, onGameEnd, addXP]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      endGame();
    }
  }, [gameState, timeLeft, endGame]);

  useEffect(() => {
    if (lives <= 0 && gameState === 'playing') {
      endGame();
    }
  }, [lives, gameState, endGame]);

  const handleCorrect = useCallback((kana?: string) => {
    const comboBonus = Math.floor(combo / 5);
    setScore(prev => prev + (10 * level) + (comboBonus * 5));
    setCombo(prev => prev + 1);
    setCorrectCount(prev => prev + 1);
    setTotalAttempts(prev => prev + 1);
    setFeedback('correct');
    setTimeout(() => setFeedback(null), 500);
    if (kana) recordSuccess(kana);
    if (correctCount > 0 && (correctCount + 1) % 5 === 0) {
      setLevel(prev => prev + 1);
    }
  }, [level, correctCount, combo, recordSuccess]);

  const handleWrong = useCallback((kana?: string) => {
    setLives(prev => prev - 1);
    setCombo(0);
    setTotalAttempts(prev => prev + 1);
    setFeedback('wrong');
    setTimeout(() => setFeedback(null), 500);
    if (kana) recordMistake(kana);
  }, [recordMistake]);

  const togglePause = () => {
    if (gameState === 'playing') setGameState('paused');
    else if (gameState === 'paused') setGameState('playing');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 relative">
      <AnimatePresence mode="wait">
        {gameState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="washi-panel p-12 text-center border-2 border-indigo-jp/10"
          >
            <div className="mb-6 inline-block p-4 rounded-full bg-hanko/10 text-hanko">
              <Zap size={48} className="animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-hanko font-serif">{title}</h2>
            <div className="w-24 h-1 bg-hanko/20 mx-auto mb-6" />
            <p className="text-xl mb-10 opacity-80 max-w-lg mx-auto leading-relaxed">{rules}</p>
            <button
              onClick={startGame}
              className="hanko-button text-2xl px-12 py-4"
            >
              Enter the Dojo
            </button>
          </motion.div>
        )}

        {(gameState === 'playing' || gameState === 'paused') && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              x: feedback === 'wrong' ? [0, -10, 10, -10, 10, 0] : 0,
              backgroundColor: feedback === 'correct' ? 'rgba(120, 134, 107, 0.1)' : 'transparent'
            }}
            transition={{ duration: feedback === 'wrong' ? 0.4 : 0.2 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center glass-card p-4 border-2 border-indigo-jp/10">
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(initialLives)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.3 }}
                    >
                      <Heart
                        size={24}
                        className={i < lives ? "text-hanko fill-hanko" : "text-gray-300"}
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="h-8 w-px bg-indigo-jp/10" />
                <div className="flex items-center gap-2 text-indigo-jp font-bold">
                  <Trophy size={20} className="text-gold-jp" />
                  <span className="text-xl">{score}</span>
                </div>
                <AnimatePresence>
                  {combo > 1 && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0, x: -20 }}
                      animate={{ scale: 1.2, opacity: 1, x: 0 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="text-orange-500 font-black italic text-lg"
                    >
                      x{combo} Combo!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-bamboo font-bold">
                  <Zap size={20} />
                  <span>Level {level}</span>
                </div>
                <div className={`flex items-center gap-2 font-mono text-xl ${timeLeft < 10 ? 'text-hanko animate-pulse' : ''}`}>
                  <TimerIcon size={20} />
                  <span>{timeLeft}s</span>
                </div>
                <button 
                  onClick={togglePause}
                  className="p-2 hover:bg-indigo-jp/5 rounded-full transition-colors text-indigo-jp"
                >
                  {gameState === 'paused' ? <Play size={24} /> : <Pause size={24} />}
                </button>
              </div>
            </div>

            <div className="relative">
              <div className={cn(
                "washi-panel p-8 min-h-[450px] flex flex-col items-center justify-center border-2 border-indigo-jp/5 transition-all",
                gameState === 'paused' && "blur-md pointer-events-none"
              )}>
                {children({
                  lives,
                  score,
                  level,
                  onCorrect: handleCorrect,
                  onWrong: handleWrong,
                  isGameOver: false,
                  isPaused: gameState === 'paused'
                })}
              </div>

              <AnimatePresence>
                {gameState === 'paused' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 flex flex-col items-center justify-center z-50"
                  >
                    <div className="glass-panel p-10 text-center border-2 border-indigo-jp/20">
                      <h3 className="text-3xl font-bold mb-6 text-indigo-jp">Dojo Paused</h3>
                      <button
                        onClick={togglePause}
                        className="bamboo-button flex items-center gap-2 px-8 py-3 text-xl"
                      >
                        <Play size={24} /> Resume
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="washi-panel p-12 text-center border-2 border-indigo-jp/20"
          >
            <div className="relative mb-8">
              <Trophy size={80} className="mx-auto text-gold-jp" />
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -top-2 -right-2 bg-hanko text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
              >
                +{Math.floor(score / 10)} XP
              </motion.div>
            </div>
            
            <h2 className="text-4xl font-bold mb-2 font-serif text-hanko">Training Complete</h2>
            <p className="text-indigo-jp opacity-60 mb-8">Your skills are growing stronger.</p>

            <div className="grid grid-cols-3 gap-6 my-10">
              <div className="p-6 washi-card border-indigo-jp/10">
                <p className="text-xs opacity-50 uppercase tracking-widest font-bold mb-1">Score</p>
                <p className="text-4xl font-black text-hanko">{score}</p>
              </div>
              <div className="p-6 washi-card border-indigo-jp/10">
                <p className="text-xs opacity-50 uppercase tracking-widest font-bold mb-1">Accuracy</p>
                <p className="text-4xl font-black text-indigo-jp">
                  {totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0}%
                </p>
              </div>
              <div className="p-6 washi-card border-indigo-jp/10">
                <p className="text-xs opacity-50 uppercase tracking-widest font-bold mb-1">Attempts</p>
                <p className="text-4xl font-black text-bamboo">{totalAttempts}</p>
              </div>
            </div>
            
            <div className="flex gap-6 justify-center">
              <button
                onClick={startGame}
                className="hanko-button flex items-center gap-3 px-8 py-4 text-xl"
              >
                <RefreshCw size={24} /> Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="indigo-button flex items-center gap-3 px-8 py-4 text-xl"
              >
                <Home size={24} /> Exit Dojo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper for class names
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
