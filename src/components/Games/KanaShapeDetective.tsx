
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameEngine } from './GameEngine';
import { Search, ZoomIn } from 'lucide-react';

const CONFUSING_PAIRS = [
  { a: 'さ', b: 'ち', hint: 'Sa points right, Chi points left' },
  { a: 'シ', b: 'ツ', hint: 'Shi looks up, Tsu looks down' },
  { a: 'ソ', b: 'ン', hint: 'So looks down, N looks up' },
  { a: 'わ', b: 'れ', hint: 'Wa is round, Re kicks out' },
  { a: 'ぬ', b: 'め', hint: 'Nu has a loop, Me does not' },
  { a: 'ろ', b: 'る', hint: 'Ru has a loop, Ro does not' },
  { a: 'あ', b: 'お', hint: 'A has a cross, O has a dot' },
  { a: 'い', b: 'り', hint: 'I is short/long, Ri is long/long' },
  { a: 'は', b: 'ほ', hint: 'Ha has one line, Ho has two' },
  { a: 'ま', b: 'も', hint: 'Ma has a loop, Mo has hooks' }
];

export const KanaShapeDetective: React.FC = () => {
  const [grid, setGrid] = useState<any[]>([]);
  const [targetChar, setTargetChar] = useState('');
  const [hint, setHint] = useState('');
  const [foundCount, setFoundCount] = useState(0);
  const [totalToFind, setTotalToFind] = useState(0);

  const nextRound = useCallback(() => {
    const pair = CONFUSING_PAIRS[Math.floor(Math.random() * CONFUSING_PAIRS.length)];
    const isA = Math.random() > 0.5;
    const target = isA ? pair.a : pair.b;
    const distractor = isA ? pair.b : pair.a;
    
    const gridSize = 16;
    const newGrid = Array(gridSize).fill(distractor);
    const targetCount = Math.floor(Math.random() * 3) + 2;
    const indices = new Set<number>();
    while(indices.size < targetCount) {
      indices.add(Math.floor(Math.random() * gridSize));
    }
    indices.forEach(i => newGrid[i] = target);
    
    setGrid(newGrid.map((char, i) => ({ char, id: i, isTarget: char === target, found: false })));
    setTargetChar(target);
    setHint(pair.hint);
    setTotalToFind(targetCount);
    setFoundCount(0);
  }, []);

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  return (
    <GameEngine
      title="Kana Shape Detective 🕵️"
      rules="Find all instances of the target Kana among confusingly similar ones!"
      onGameEnd={() => {}}
    >
      {({ onCorrect, onWrong, isPaused }) => (
        <div className="w-full flex flex-col items-center gap-10">
          <div className="flex items-center gap-8 washi-card p-6 border-2 border-indigo-jp/10 w-full max-w-md justify-between">
            <div className="flex flex-col items-center">
              <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Target</p>
              <motion.div 
                key={targetChar}
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-6xl font-bold text-hanko drop-shadow-md"
              >
                {targetChar}
              </motion.div>
            </div>
            
            <div className="h-12 w-px bg-indigo-jp/10" />
            
            <div className="flex flex-col items-center">
              <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Progress</p>
              <div className="text-3xl font-black text-indigo-jp">
                {foundCount} <span className="text-lg opacity-30">/ {totalToFind}</span>
              </div>
            </div>

            <div className="h-12 w-px bg-indigo-jp/10" />

            <div className="flex flex-col items-center">
              <Search size={24} className="text-indigo-jp/40 mb-1" />
              <p className="text-[10px] font-bold uppercase tracking-tighter opacity-40">Scan Grid</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 w-full max-w-md">
            <AnimatePresence mode="popLayout">
              {grid.map((item) => (
                <motion.button
                  key={`${targetChar}-${item.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={!item.found ? { scale: 1.05, backgroundColor: 'rgba(38, 67, 72, 0.05)' } : {}}
                  whileTap={!item.found ? { scale: 0.95 } : {}}
                  onClick={() => {
                    if (isPaused || item.found) return;
                    if (item.isTarget) {
                      onCorrect(targetChar);
                      const newFoundCount = foundCount + 1;
                      setFoundCount(newFoundCount);
                      setGrid(prev => prev.map(g => g.id === item.id ? { ...g, found: true } : g));
                      if (newFoundCount === totalToFind) {
                        setTimeout(nextRound, 800);
                      }
                    } else {
                      onWrong(targetChar);
                    }
                  }}
                  className={cn(
                    "aspect-square washi-card text-4xl font-bold transition-all border-2 flex items-center justify-center relative overflow-hidden",
                    item.found ? "bg-bamboo/20 border-bamboo/30 text-bamboo scale-90" : "border-indigo-jp/5 text-indigo-jp",
                    !item.isTarget && "hover:border-hanko/20"
                  )}
                >
                  {item.found ? <ZoomIn size={32} /> : item.char}
                  {item.found && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-bamboo/10"
                    />
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <div className="text-center max-w-xs">
            <p className="text-sm font-medium text-indigo-jp/40 italic">
              " {hint} "
            </p>
          </div>
        </div>
      )}
    </GameEngine>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
