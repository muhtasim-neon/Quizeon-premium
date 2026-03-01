
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameEngine } from './GameEngine';
import { KANA_DATA } from '../../data/mockContent';
import { CloudRain, Zap, Droplets } from 'lucide-react';

interface FallingKana {
  id: string;
  kana: any;
  x: number;
  y: number;
  speed: number;
  rotation: number;
}

interface RainGameContentProps {
  onCorrect: (kana?: string) => void;
  onWrong: (kana?: string) => void;
  isPaused: boolean;
  falling: FallingKana[];
  setFalling: React.Dispatch<React.SetStateAction<FallingKana[]>>;
  input: string;
  setInput: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const RainGameContent: React.FC<RainGameContentProps> = ({
  onCorrect,
  onWrong,
  isPaused,
  falling,
  setFalling,
  input,
  setInput,
  inputRef
}) => {
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setFalling(prev => {
        const next = prev.map(k => ({ ...k, y: k.y + k.speed }));
        const missed = next.filter(k => k.y > 90);
        if (missed.length > 0) {
          missed.forEach(m => onWrong(m.kana.ja));
        }
        return next.filter(k => k.y <= 90);
      });
    }, 50);
    return () => clearInterval(timer);
  }, [onWrong, isPaused, setFalling]);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full h-[500px] relative overflow-hidden bg-gradient-to-b from-indigo-jp/10 to-transparent washi-panel border-2 border-indigo-jp/10 shadow-inner">
        {/* Background Elements */}
        <div className="absolute top-4 left-0 right-0 flex justify-around opacity-10 pointer-events-none">
          <CloudRain size={120} />
          <CloudRain size={80} />
          <CloudRain size={100} />
        </div>

        <AnimatePresence>
          {falling.map((k) => (
            <motion.div
              key={k.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                left: `${k.x}%`, 
                top: `${k.y}%`,
                rotate: k.rotation
              }}
              exit={{ opacity: 0, scale: 1.5, y: 20 }}
              className="absolute flex flex-col items-center"
            >
              <div className="text-5xl font-bold text-hanko drop-shadow-md washi-card backdrop-blur-sm p-3 border border-white/20">
                {k.kana.ja}
              </div>
              <div className="w-1 h-8 bg-gradient-to-b from-hanko/20 to-transparent mt-1 rounded-full" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Danger Zone */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-hanko/30 to-transparent" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-md relative">
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={input}
            disabled={isPaused}
            onChange={(e) => {
              if (isPaused) return;
              const val = e.target.value.toLowerCase().trim();
              setInput(val);
              const match = falling.find(f => f.kana.romaji === val);
              if (match) {
                onCorrect(match.kana.ja);
                setFalling(prev => prev.filter(f => f.id !== match.id));
                setInput('');
              }
            }}
            className="input-jp text-4xl text-center font-mono tracking-widest shadow-2xl"
            placeholder="Type Romaji..."
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-jp/20">
            <Droplets size={32} />
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-indigo-jp/40 font-bold uppercase tracking-widest text-xs">
          <Zap size={14} /> Clear the storm before it lands
        </div>
      </div>
    </div>
  );
};

export const KanaRain: React.FC = () => {
  const [falling, setFalling] = useState<FallingKana[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const spawnKana = useCallback(() => {
    const kana = KANA_DATA[Math.floor(Math.random() * KANA_DATA.length)];
    setFalling(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        kana,
        x: Math.random() * 80 + 10,
        y: -10,
        speed: Math.random() * 0.8 + 0.4,
        rotation: Math.random() * 20 - 10
      }
    ]);
  }, []);

  useEffect(() => {
    const interval = setInterval(spawnKana, 2000);
    return () => clearInterval(interval);
  }, [spawnKana]);

  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    focusInput();
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, []);

  return (
    <GameEngine
      title="Kana Rain 🌧"
      rules="Type the Romaji for falling Kana before they hit the bottom!"
      onGameEnd={() => {}}
    >
      {(gameProps) => (
        <RainGameContent 
          {...gameProps}
          falling={falling}
          setFalling={setFalling}
          input={input}
          setInput={setInput}
          inputRef={inputRef}
        />
      )}
    </GameEngine>
  );
};
