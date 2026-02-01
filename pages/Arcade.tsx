import React, { useState, useEffect, useRef } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { 
    Gamepad2, Rocket, Sword, ChefHat, Car, Mic2, Puzzle, 
    Heart, Timer, Trophy, RotateCcw, ArrowLeft, Keyboard, Zap, 
    AlertTriangle, Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KANA_DATA } from '../data/mockContent';
import { useSettings } from '../contexts/SettingsContext';

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
    easy: { timeMs: 5000, pool: 'Hiragana', scoreMult: 10 },
    medium: { timeMs: 3000, pool: 'Basic', scoreMult: 20 },
    hard: { timeMs: 2000, pool: 'All', scoreMult: 30 }
};

// --- KANA INVADERS GAME COMPONENT ---

const KanaInvadersGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const { playSound } = useSettings();
    const [gameState, setGameState] = useState<'setup' | 'playing' | 'gameover'>('setup');
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    
    // Game State
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [currentKana, setCurrentKana] = useState<typeof KANA_DATA[0] | null>(null);
    const [input, setInput] = useState('');
    const [progress, setProgress] = useState(100);
    
    // Refs for timer management
    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // --- GAME LOGIC ---

    const getPool = () => {
        if (difficulty === 'easy') return KANA_DATA.filter(k => k.category === 'Hiragana' && k.variation === 'basic');
        if (difficulty === 'medium') return KANA_DATA.filter(k => k.variation === 'basic'); // Hira + Kata basic
        return KANA_DATA; // All
    };

    const spawnEnemy = () => {
        const pool = getPool();
        const random = pool[Math.floor(Math.random() * pool.length)];
        setCurrentKana(random);
        setInput('');
        setProgress(100);
        startTimeRef.current = Date.now();
        
        // Clear existing loop
        if (timerRef.current) clearInterval(timerRef.current);
        
        // Start Timer Loop
        const duration = DIFFICULTY_CONFIG[difficulty].timeMs;
        const interval = 50; // Update freq
        
        timerRef.current = window.setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (remaining <= 0) {
                handleMiss();
            }
        }, interval);
    };

    const handleMiss = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        playSound('hit');
        
        setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
                setGameState('gameover');
                return 0;
            } else {
                // Shake effect logic could go here
                setTimeout(spawnEnemy, 1000); // Delay before next spawn
                return newLives;
            }
        });
        setCurrentKana(null); // Hide current temporarily
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);

        if (currentKana && val && val.trim().toLowerCase() === currentKana.romaji.toLowerCase()) {
            // Hit!
            if (timerRef.current) clearInterval(timerRef.current);
            playSound('laser');
            setScore(s => s + DIFFICULTY_CONFIG[difficulty].scoreMult);
            spawnEnemy();
        }
    };

    const startGame = () => {
        setScore(0);
        setLives(3);
        setGameState('playing');
        spawnEnemy();
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Focus keep-alive
    useEffect(() => {
        if (gameState === 'playing') inputRef.current?.focus();
    }, [currentKana, gameState]);

    // --- RENDER ---

    if (gameState === 'setup') {
        return (
            <div className="max-w-2xl mx-auto animate-fade-in">
                <Button variant="ghost" onClick={onExit} className="mb-4"><ArrowLeft size={18} /> Exit Arcade</Button>
                <GlassCard className="text-center py-12">
                    <Rocket size={64} className="mx-auto text-blue-400 mb-6 animate-bounce" />
                    <h2 className="text-4xl font-bold text-white mb-2">Kana Invaders</h2>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        Defend the base by typing the Romaji for the falling Kana characters. 
                        Don't let the timer run out!
                    </p>

                    <div className="flex justify-center gap-4 mb-8">
                        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                            <button
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={`px-6 py-4 rounded-xl border-2 transition-all font-bold capitalize flex flex-col items-center gap-2 ${
                                    difficulty === d 
                                    ? d === 'easy' ? 'bg-green-500/20 border-green-500 text-green-400 scale-105'
                                    : d === 'medium' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 scale-105'
                                    : 'bg-red-500/20 border-red-500 text-red-400 scale-105'
                                    : 'border-white/10 text-slate-500 hover:border-white/30'
                                }`}
                            >
                                {d === 'easy' ? '🌱' : d === 'medium' ? '⚔️' : '🔥'}
                                {d}
                            </button>
                        ))}
                    </div>

                    <Button onClick={startGame} className="px-8 py-4 text-lg bg-blue-500 hover:bg-blue-600 shadow-blue-500/30">
                        <Play fill="currentColor" className="mr-2" /> Start Mission
                    </Button>
                </GlassCard>
            </div>
        );
    }

    if (gameState === 'gameover') {
        return (
            <div className="max-w-md mx-auto animate-fade-in text-center pt-10">
                <GlassCard className="py-12 border-red-500/30">
                    <Trophy size={64} className="mx-auto text-yellow-400 mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">Game Over</h2>
                    <p className="text-slate-400 mb-6">Mission Report</p>
                    
                    <div className="text-5xl font-mono font-bold text-primary mb-8">{score} PTS</div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 p-3 rounded-lg">
                            <div className="text-xs text-slate-500 uppercase">Difficulty</div>
                            <div className="font-bold text-white capitalize">{difficulty}</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg">
                            <div className="text-xs text-slate-500 uppercase">Kana Defeated</div>
                            <div className="font-bold text-white">{Math.floor(score / DIFFICULTY_CONFIG[difficulty].scoreMult)}</div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Button variant="secondary" onClick={onExit}>Exit</Button>
                        <Button onClick={() => setGameState('setup')}><RotateCcw size={18} /> Play Again</Button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    // Playing State
    return (
        <div className="max-w-2xl mx-auto animate-fade-in relative h-[600px] flex flex-col">
            {/* Header HUD */}
            <div className="flex justify-between items-center mb-6 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2">
                    <div className="flex">
                        {[1, 2, 3].map(i => (
                            <Heart key={i} size={24} fill={i <= lives ? "#ef4444" : "none"} className={i <= lives ? "text-red-500" : "text-slate-700"} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Score</span>
                    <span className="text-2xl font-mono font-bold text-white">{score.toString().padStart(6, '0')}</span>
                </div>
                <div>
                    <Badge color={difficulty === 'hard' ? 'bg-red-500/20 text-red-400' : difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}>
                        {difficulty.toUpperCase()}
                    </Badge>
                </div>
            </div>

            {/* Game Area */}
            <GlassCard className="flex-1 relative flex flex-col items-center justify-center overflow-hidden border-blue-500/20">
                {/* Background Grid Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(58,134,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(58,134,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                
                {/* Enemy */}
                <div className="relative z-10 text-center transition-all duration-100">
                    {currentKana ? (
                        <>
                             {/* Timer Bar above enemy */}
                             <div className="w-48 h-2 bg-slate-700 rounded-full mb-6 mx-auto overflow-hidden">
                                 <div 
                                    className={`h-full transition-all duration-100 ease-linear ${progress < 30 ? 'bg-red-500' : 'bg-blue-500'}`} 
                                    style={{ width: `${progress}%` }}
                                 ></div>
                             </div>
                             
                             {/* The Kana */}
                             <div className={`text-9xl font-jp font-bold text-white drop-shadow-[0_0_15px_rgba(58,134,255,0.8)] ${progress < 30 ? 'animate-pulse text-red-100' : ''}`}>
                                 {currentKana.ja}
                             </div>
                             
                             {/* Hint for easy mode only */}
                             {difficulty === 'easy' && progress < 50 && (
                                 <div className="text-slate-500 mt-2 text-sm font-mono animate-pulse">
                                     Hint: {currentKana.romaji[0]}...
                                 </div>
                             )}
                        </>
                    ) : (
                        <div className="text-red-400 font-bold text-xl flex items-center gap-2">
                            <AlertTriangle /> Miss!
                        </div>
                    )}
                </div>
            </GlassCard>

            {/* Input Zone */}
            <div className="mt-6 relative">
                 <input 
                    ref={inputRef}
                    type="text" 
                    value={input}
                    onChange={handleInput}
                    className="w-full bg-white/10 border-2 border-white/20 rounded-2xl py-4 text-center text-3xl font-mono text-white focus:outline-none focus:border-blue-500 transition-all placeholder-white/20 uppercase"
                    placeholder="TYPE ROMAJI"
                    autoFocus
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                     <Keyboard />
                 </div>
            </div>
        </div>
    );
};


// --- MAIN ARCADE COMPONENT ---

export const Arcade: React.FC = () => {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    { id: 'invaders', title: 'Kana Invaders', desc: 'Shoot the correct Romaji', icon: Rocket, color: 'text-blue-400', bg: 'bg-blue-500/20', status: 'Playable', path: '#' },
    { id: 'memory', title: 'Hiragana Memory', desc: 'Match Kana pairs', icon: Puzzle, color: 'text-pink-400', bg: 'bg-pink-500/20', status: 'Playable', path: '/practice' },
    { id: 'quest', title: 'Hiragana Quest', desc: 'RPG Battle Game', icon: Sword, color: 'text-orange-400', bg: 'bg-orange-500/20', status: 'Coming Soon' },
    { id: 'chef', title: 'Sushi Chef', desc: 'Order words correctly', icon: ChefHat, color: 'text-green-400', bg: 'bg-green-500/20', status: 'Coming Soon' },
    { id: 'road', title: 'Tokyo Drift', desc: 'Speed reading race', icon: Car, color: 'text-red-400', bg: 'bg-red-500/20', status: 'Coming Soon' },
    { id: 'karaoke', title: 'Karaoke Pop', desc: 'Sing along challenge', icon: Mic2, color: 'text-purple-400', bg: 'bg-purple-500/20', status: 'Coming Soon' },
  ];

  if (activeGame === 'invaders') {
      return <KanaInvadersGame onExit={() => setActiveGame(null)} />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Gamepad2 className="text-primary" size={32} /> Game Arcade
        </h1>
        <p className="text-slate-400">Learn while you play! Earn XP and unlock new levels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
            <GlassCard key={game.id} hoverEffect className="relative overflow-hidden group">
                <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity scale-150`}>
                    <game.icon size={100} />
                </div>
                
                <div className={`w-14 h-14 rounded-2xl ${game.bg} ${game.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <game.icon size={32} />
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{game.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{game.desc}</p>

                <div className="flex justify-between items-center mt-4">
                    {game.status === 'Playable' ? (
                        <Button 
                            size="sm" 
                            onClick={() => {
                                if (game.id === 'invaders') setActiveGame('invaders');
                                else navigate(game.path || '#');
                            }}
                        >
                            Play Now
                        </Button>
                    ) : (
                        <span className="text-xs text-slate-500 border border-slate-700 px-3 py-1.5 rounded-full uppercase tracking-wider font-bold">In Development</span>
                    )}
                </div>
            </GlassCard>
        ))}
      </div>
    </div>
  );
};