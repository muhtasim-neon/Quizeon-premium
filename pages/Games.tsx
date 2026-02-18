
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GlassCard, Button, Input, Badge, WonderCard } from '../components/UI';
import { 
    Gamepad2, Heart, Skull, Wind, Swords, ArrowRightLeft, Keyboard, 
    ZapOff, Flame, Zap, Trophy, Timer, Crosshair, RefreshCw,
    Eye, Hash, Link, Check, HelpCircle, Scale, Copy, AlignLeft, 
    Smile, Grid, Layers, Moon, Music, Divide, MousePointer
} from 'lucide-react';
import { 
    KANA_DATA, VOCAB_DATA, CONFUSING_PAIRS, NUMBER_DATA, 
    COUNTER_DATA, GRAMMAR_DATA, ANTONYM_DATA, SYNONYM_DATA,
    ALL_CONTENT
} from '../data/mockContent';
import { LearningItem } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { progressService } from '../services/progressService';

// --- EXISTING CUSTOM GAME ENGINES (1-6) ---

const KanaStorm: React.FC<{ items: LearningItem[]; onExit: () => void }> = ({ items, onExit }) => {
    const { playSound, speak } = useSettings();
    const [score, setScore] = useState(0);
    const [sessionXp, setSessionXp] = useState(0);
    const [lives, setLives] = useState(3);
    const [activeItems, setActiveItems] = useState<{ id: string; ja: string; romaji: string; top: number; left: number; speed: number }[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isConfusingMode, setIsConfusingMode] = useState(false);
    const gameLoopRef = useRef<number | null>(null);
    const lastSpawnRef = useRef(0);
    const confusingKana = useMemo(() => items.filter(i => ['シ', 'ツ', 'ぬ', 'め', 'ソ', 'ン', 'わ', 'れ', 'る', 'ろ'].includes(i.ja)), [items]);
    
    const spawnItem = useCallback(() => { 
        const sourcePool = isConfusingMode && confusingKana.length > 0 ? confusingKana : items; 
        if (sourcePool.length === 0) return; 
        const base = sourcePool[Math.floor(Math.random() * sourcePool.length)]; 
        const newItem = { id: Math.random().toString(), ja: base.ja, romaji: base.romaji, top: -20, left: 10 + Math.random() * 80, speed: 0.5 + (score / 200) + Math.random() * 0.3 }; 
        setActiveItems(prev => [...prev, newItem]); 
    }, [items, isConfusingMode, confusingKana, score]);
    
    useEffect(() => { 
        if (isGameOver) return; 
        const loop = (time: number) => { 
            if (time - lastSpawnRef.current > (isConfusingMode ? 1000 : 1500)) { 
                spawnItem(); 
                lastSpawnRef.current = time; 
            } 
            setActiveItems(prev => { 
                const updated = prev.map(item => ({ ...item, top: item.top + item.speed })); 
                const missed = updated.filter(item => item.top > 95); 
                if (missed.length > 0) { 
                    setLives(l => { if (l <= 1) setIsGameOver(true); return l - 1; }); 
                    playSound('wrong'); 
                } 
                return updated.filter(item => item.top <= 95); 
            }); 
            gameLoopRef.current = requestAnimationFrame(loop); 
        }; 
        gameLoopRef.current = requestAnimationFrame(loop); 
        return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); }; 
    }, [isGameOver, isConfusingMode, spawnItem, score, playSound]);
    
    const handleInput = (val: string) => { 
        const target = activeItems.find(i => i.romaji.toLowerCase() === val.toLowerCase()); 
        if (target) { 
            setActiveItems(prev => prev.filter(i => i.id !== target.id)); 
            setScore(s => s + 10); 
            const xp = 5;
            setSessionXp(s => s + xp);
            progressService.addXP(xp); 
            playSound('hit'); 
            speak(target.ja); 
        } 
    };
    
    if (isGameOver) return (
        <div className="text-center py-20 animate-pop">
            <Skull size={64} className="mx-auto text-hanko mb-6" />
            <h2 className="text-4xl font-bold text-ink mb-2">Storm Subsided</h2>
            <div className="text-6xl font-mono text-hanko font-bold mb-8">{score}</div>
            <div className="flex flex-col items-center gap-2 mb-8">
                <Badge color="bg-yellow-100 text-yellow-700 border-yellow-200 text-lg py-2 px-6">
                    +{sessionXp} XP Gained
                </Badge>
            </div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
    );
    
    return (
        <div className="relative h-[600px] bg-ink/5 rounded-3xl overflow-hidden border-2 border-bamboo/20">
            <div className="absolute top-4 left-6 z-20 flex flex-col">
                <span className="text-xs text-bamboo font-bold uppercase">Score</span>
                <span className="text-2xl font-mono font-bold text-ink">{score}</span>
            </div>
            <div className="absolute top-4 right-6 z-20 flex gap-2">
                {[...Array(3)].map((_, i) => <Heart key={i} size={24} className={i < lives ? "fill-hanko text-hanko" : "text-bamboo/20"} />)}
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-48">
                <Input autoFocus placeholder="Type Romaji..." className="text-center bg-white shadow-xl border-hanko/30" onChange={(e) => { handleInput(e.target.value); e.target.value = ''; }} />
            </div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <button onClick={() => setIsConfusingMode(!isConfusingMode)} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${isConfusingMode ? 'bg-hanko text-white border-hanko animate-pulse' : 'bg-white text-bamboo border-bamboo/20'}`}>
                    {isConfusingMode ? 'Confusing Mode On' : 'Standard Mode'}
                </button>
            </div>
            {activeItems.map(item => <div key={item.id} className="absolute text-4xl font-jp font-bold text-ink animate-float transition-all duration-100 ease-linear" style={{ top: `${item.top}%`, left: `${item.left}%` }}>{item.ja}</div>)}
        </div>
    );
};

const SamuraiSlash: React.FC<{ items: LearningItem[]; onExit: () => void }> = ({ items, onExit }) => {
    const { playSound, speak } = useSettings();
    const [current, setCurrent] = useState<LearningItem | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [lives, setLives] = useState(3);
    const [combo, setCombo] = useState(0);
    const [sessionXp, setSessionXp] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isBossRound, setIsBossRound] = useState(false);
    
    const nextRound = useCallback(() => { 
        if (items.length === 0) return; 
        const target = items[Math.floor(Math.random() * items.length)]; 
        const distractors = items.filter(i => i.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 3).map(i => i.romaji); 
        setCurrent(target); 
        setOptions([target.romaji, ...distractors].sort(() => 0.5 - Math.random())); 
    }, [items]);
    
    useEffect(() => { nextRound(); }, [nextRound]);
    
    const handleChoice = (choice: string) => { 
        if (!current) return; 
        if (choice === current.romaji) { 
            setCombo(c => c + 1); 
            playSound('hit'); 
            const xp = 10 + combo;
            setSessionXp(s => s + xp);
            progressService.addXP(xp); 
            speak(current.ja); 
            if (combo + 1 >= 10 && !isBossRound) setIsBossRound(true); 
            nextRound(); 
        } else { 
            setLives(l => { if (l <= 1) setIsGameOver(true); return l - 1; }); 
            setCombo(0); 
            playSound('wrong'); 
        } 
    };
    
    if (isGameOver) return (
        <div className="text-center py-20 bg-rice rounded-3xl">
            <Swords size={64} className="mx-auto text-hanko mb-4" />
            <h2 className="text-3xl font-bold">Your Blade Broke</h2>
            <div className="my-6">
                <Badge color="bg-indigo-100 text-indigo-700 border-indigo-200 text-lg py-2 px-6">
                    +{sessionXp} XP Gained
                </Badge>
            </div>
            <Button onClick={() => window.location.reload()} className="mt-8">Sharpen & Try Again</Button>
        </div>
    );
    
    return (
        <div className={`p-8 rounded-3xl border-4 transition-colors duration-500 min-h-[500px] flex flex-col items-center justify-center ${isBossRound ? 'border-hanko bg-red-50/50 shadow-2xl shadow-hanko/20' : 'border-bamboo/10 bg-white'}`}>
            <div className="w-full flex justify-between mb-10">
                <div className="flex gap-1">{[...Array(3)].map((_, i) => <Heart size={24} className={i < lives ? "fill-hanko text-hanko" : "text-bamboo/20"} />)}</div>
                <div className="text-right">
                    <span className="text-xs text-bamboo font-bold uppercase tracking-widest block">Combo</span>
                    <span className={`text-3xl font-mono font-bold ${combo > 5 ? 'text-hanko animate-pulse' : 'text-ink'}`}>{combo}x</span>
                </div>
            </div>
            {isBossRound && <div className="text-hanko font-black text-xl mb-4 animate-bounce tracking-tighter uppercase">Boss Round: 50 Kana Rapid Fire!</div>}
            {current && (
                <div className="text-center space-y-12 w-full">
                    <div className="text-9xl font-jp font-bold text-ink animate-pop drop-shadow-sm" key={current.id}>{current.ja}</div>
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                        {options.map(opt => <button key={opt} onClick={() => handleChoice(opt)} className="py-6 rounded-2xl bg-white border-2 border-bamboo/10 hover:border-hanko hover:text-hanko text-2xl font-bold transition-all active:scale-95 shadow-sm">{opt}</button>)}
                    </div>
                </div>
            )}
        </div>
    );
};

const MatchArena: React.FC<{ items: LearningItem[]; onExit: () => void }> = ({ items, onExit }) => {
    const { playSound, speak } = useSettings();
    const [level, setLevel] = useState(1);
    const [sessionXp, setSessionXp] = useState(0);
    interface Card { id: number; content: string; matchId: string; type: 'hiragana' | 'katakana' | 'romaji'; }
    const [cards, setCards] = useState<Card[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    
    useEffect(() => { 
        const setupLevel = () => { 
            const numPairs = Math.min(10, 2 + level); 
            const selection = items.sort(() => 0.5 - Math.random()).slice(0, numPairs); 
            const deck: Card[] = []; 
            selection.forEach((item, index) => { 
                const baseType = item.category === 'Katakana' ? 'katakana' : 'hiragana'; 
                const pairId = item.romaji; 
                deck.push({ id: index * 2, content: item.ja, matchId: pairId, type: baseType }); 
                const useRomaji = Math.random() > 0.5; 
                if (useRomaji) { 
                    deck.push({ id: index * 2 + 1, content: item.romaji, matchId: pairId, type: 'romaji' }); 
                } else { 
                    const counterpart = KANA_DATA.find(k => k.romaji === item.romaji && k.category !== item.category); 
                    if (counterpart) { 
                        deck.push({ id: index * 2 + 1, content: counterpart.ja, matchId: pairId, type: counterpart.category === 'Katakana' ? 'katakana' : 'hiragana' }); 
                    } else { 
                        deck.push({ id: index * 2 + 1, content: item.romaji, matchId: pairId, type: 'romaji' }); 
                    } 
                } 
            }); 
            setCards(deck.sort(() => 0.5 - Math.random())); 
            setMatched([]); 
            setFlipped([]); 
        }; 
        setupLevel(); 
    }, [level, items]);
    
    const handleCardClick = (index: number) => { 
        if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return; 
        const newFlipped = [...flipped, index]; 
        setFlipped(newFlipped); 
        playSound('flip'); 
        if (newFlipped.length === 2) { 
            const [f, s] = newFlipped; 
            if (cards[f].matchId === cards[s].matchId) { 
                setMatched(m => [...m, f, s]); 
                setFlipped([]); 
                playSound('correct'); 
                const xp = 15;
                setSessionXp(s => s + xp);
                progressService.addXP(xp); 
                const toSpeak = cards[f].type !== 'romaji' ? cards[f].content : cards[s].content; 
                speak(toSpeak); 
            } else { 
                setTimeout(() => setFlipped([]), 800); 
            } 
        } 
    };
    
    if (matched.length === cards.length && cards.length > 0) return (
        <div className="text-center py-20 bg-white rounded-3xl animate-pop">
            <Badge color="bg-green-100 text-green-700 mb-4 border-green-200">Level {level} Mastered</Badge>
            <Trophy size={64} className="mx-auto text-straw mb-6" />
            <h2 className="text-3xl font-bold mb-2 text-ink">Memory Sharpened!</h2>
            <div className="my-4 text-xl font-bold text-hanko">Total Session XP: {sessionXp}</div>
            <p className="text-bamboo mb-8">Ready for more cards?</p>
            <div className="flex gap-4 justify-center">
                <Button variant="secondary" onClick={onExit}>Exit</Button>
                <Button onClick={() => setLevel(l => l + 1)} className="shadow-lg"><RefreshCw size={18} className="mr-2" /> Next Level</Button>
            </div>
        </div>
    );
    
    const gridCols = cards.length <= 12 ? 'grid-cols-3 md:grid-cols-4' : 'grid-cols-4 md:grid-cols-5 lg:grid-cols-6';
    const getCardStyle = (type: string) => { switch(type) { case 'hiragana': return 'bg-gradient-to-br from-red-50 to-white border-red-200 text-hanko'; case 'katakana': return 'bg-gradient-to-br from-blue-50 to-white border-blue-200 text-blue-600'; case 'romaji': return 'bg-gradient-to-br from-green-50 to-white border-green-200 text-green-600 font-sans'; default: return 'bg-white border-gray-200'; } };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-4 bg-white/50 p-3 rounded-xl border border-bamboo/10">
                <div className="text-hanko font-bold text-lg flex items-center gap-2"><Gamepad2 size={20} /> Level {level}</div>
                <div className="text-bamboo text-sm font-bold bg-white px-3 py-1 rounded-lg border border-bamboo/10">{matched.length / 2} / {cards.length / 2} Pairs</div>
            </div>
            <div className={`grid ${gridCols} gap-3 md:gap-4`}>
                {cards.map((card, i) => { 
                    const isFaceUp = flipped.includes(i) || matched.includes(i); 
                    return <div key={i} onClick={() => handleCardClick(i)} className={`aspect-[3/4] md:aspect-square rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold transition-all duration-500 cursor-pointer shadow-sm hover:-translate-y-1 hover:shadow-md border-2 relative [transform-style:preserve-3d] ${isFaceUp ? `${getCardStyle(card.type)} [transform:rotateY(0deg)]` : 'bg-hanko border-hanko [transform:rotateY(180deg)]'}`}><div className={`absolute inset-0 flex items-center justify-center [backface-visibility:hidden] ${isFaceUp ? 'opacity-100' : 'opacity-0'}`}>{card.content}{card.type === 'romaji' && <span className="absolute bottom-1 right-2 text-[8px] uppercase tracking-widest text-green-400">RO</span>}{card.type === 'hiragana' && <span className="absolute bottom-1 right-2 text-[8px] uppercase tracking-widest text-red-300">HI</span>}{card.type === 'katakana' && <span className="absolute bottom-1 right-2 text-[8px] uppercase tracking-widest text-blue-300">KA</span>}</div><div className={`absolute inset-0 bg-hanko flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl`}><div className="w-8 h-8 rounded-full border-2 border-white/30 opacity-50"></div></div></div> 
                })}
            </div>
        </div>
    );
};

const TypingNinja: React.FC<{ items: LearningItem[]; onExit: () => void }> = ({ items, onExit }) => {
    const { speak, playSound } = useSettings();
    const [current, setCurrent] = useState<LearningItem | null>(null);
    const [input, setInput] = useState('');
    const [streak, setStreak] = useState(0);
    const [sessionXp, setSessionXp] = useState(0);
    const [isAdvanced, setIsAdvanced] = useState(false);
    
    const advancedPool = useMemo(() => items.filter(i => i.romaji.length > 2 || ['きゃ', 'きゅ', 'きょ', 'っ'].some(s => i.ja.includes(s))), [items]);
    const next = useCallback(() => { const pool = isAdvanced && advancedPool.length > 0 ? advancedPool : items; if(pool.length === 0) return; setCurrent(pool[Math.floor(Math.random() * pool.length)]); setInput(''); }, [isAdvanced, items, advancedPool]);
    useEffect(() => { next(); }, [next]);
    
    const check = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const val = e.target.value; 
        if (!current) return; 
        if (val.toLowerCase() === current.romaji.toLowerCase()) { 
            setStreak(s => s + 1); 
            const xp = 10;
            setSessionXp(s => s + xp);
            progressService.addXP(xp); 
            playSound('hit'); 
            speak(current.ja); 
            next(); 
        } else { 
            setInput(val); 
        } 
    };
    
    return (
        <div className="max-w-md mx-auto text-center py-10 space-y-10">
            <div className="flex justify-between items-center bg-white/40 p-4 rounded-2xl border border-bamboo/10">
                <div className="text-left">
                    <span className="text-[10px] text-bamboo font-bold uppercase block">Streak</span>
                    <span className="text-2xl font-mono font-bold text-hanko">{streak}🔥</span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-bamboo font-bold uppercase block">Session XP</span>
                    <span className="text-xl font-mono font-bold text-purple-600">+{sessionXp}</span>
                </div>
            </div>
            <div className="flex justify-center">
                <button onClick={() => { setIsAdvanced(!isAdvanced); setStreak(0); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isAdvanced ? 'bg-hanko text-white' : 'bg-rice text-bamboo'}`}>{isAdvanced ? 'Advanced Mode' : 'Beginner Mode'}</button>
            </div>
            {current && (
                <div className="space-y-8 animate-pop">
                    <div className="text-[10rem] font-jp font-bold text-ink drop-shadow-xl">{current.ja}</div>
                    <Input autoFocus value={input} onChange={check} className="text-center text-4xl py-6 font-mono tracking-widest border-2 border-hanko/20 focus:border-hanko" placeholder="..." />
                    <div className="text-bamboo text-xs font-bold uppercase tracking-widest animate-pulse">Type the Ninja Romaji</div>
                </div>
            )}
        </div>
    );
};

const ConfusionKiller: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const { speak, playSound } = useSettings();
    const [currentPair, setCurrentPair] = useState(CONFUSING_PAIRS[0]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [sessionXp, setSessionXp] = useState(0);
    
    const next = () => { setCurrentPair(CONFUSING_PAIRS[Math.floor(Math.random() * CONFUSING_PAIRS.length)]); setIsCorrect(null); };
    
    const handleSelect = (choice: string) => { 
        if (choice === currentPair.correct) { 
            setIsCorrect(true); 
            playSound('correct'); 
            const xp = 15;
            setSessionXp(s => s + xp);
            progressService.addXP(xp); 
            speak(choice); 
            setTimeout(next, 1000); 
        } else { 
            setIsCorrect(false); 
            playSound('wrong'); 
        } 
    };
    
    return (
        <div className="max-w-lg mx-auto text-center py-10 space-y-12">
            <div className="flex justify-between items-center bg-white/40 px-6 py-2 rounded-xl border border-bamboo/10">
                <Badge color="bg-hanko/10 text-hanko border-hanko/20 py-2 px-6 text-sm">Target: {currentPair.label}</Badge>
                <div className="text-sm font-bold text-purple-600">XP: {sessionXp}</div>
            </div>
            <p className="text-bamboo italic text-lg">{currentPair.hint}</p>
            <div className="flex justify-center gap-8">
                {[currentPair.correct, currentPair.wrong].sort(() => 0.5 - Math.random()).map(ja => (
                    <button key={ja} onClick={() => handleSelect(ja)} className={`w-40 h-40 rounded-3xl text-7xl font-jp font-bold border-4 transition-all ${isCorrect === true && ja === currentPair.correct ? 'border-green-500 bg-green-50' : isCorrect === false && ja === currentPair.wrong ? 'border-hanko bg-red-50' : 'border-bamboo/10 bg-white hover:border-hanko hover:scale-105'}`}>{ja}</button>
                ))}
            </div>
            {isCorrect === false && <p className="text-hanko font-bold animate-shake">Incorrect! Remember the hint.</p>}
        </div>
    );
};

const SurvivalMode: React.FC<{ items: LearningItem[]; onExit: () => void }> = ({ items, onExit }) => {
    const { playSound, speak } = useSettings();
    const [score, setScore] = useState(0);
    const [sessionXp, setSessionXp] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [lives, setLives] = useState(3);
    const [current, setCurrent] = useState<LearningItem | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [combo, setCombo] = useState(0);
    
    const next = useCallback(() => { if(items.length === 0) return; const target = items[Math.floor(Math.random() * items.length)]; const distractors = items.filter(i => i.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 3).map(i => i.romaji); setCurrent(target); setOptions([target.romaji, ...distractors].sort(() => 0.5 - Math.random())); }, [items]);
    
    useEffect(() => { next(); }, [next]);
    useEffect(() => { const timer = setInterval(() => { setTimeLeft(t => { if (t <= 1) { clearInterval(timer); return 0; } return t - 1; }); }, 1000); return () => clearInterval(timer); }, []);
    
    const handleAns = (ans: string) => { 
        if (!current) return; 
        if (ans === current.romaji) { 
            setScore(s => s + 10 + (combo * 2)); 
            setCombo(c => c + 1); 
            playSound('hit'); 
            const xp = 5 + combo;
            setSessionXp(s => s + xp);
            progressService.addXP(xp); 
            speak(current.ja); 
            next(); 
        } else { 
            setLives(l => l - 1); 
            setCombo(0); 
            playSound('wrong'); 
            if (lives <= 1) setTimeLeft(0); 
        } 
    };
    
    if (timeLeft === 0) return (
        <div className="text-center py-20 bg-rice rounded-3xl animate-pop">
            <Badge color="bg-hanko text-white mb-6">Survival Result</Badge>
            <div className="text-8xl font-black text-ink mb-2">{score}</div>
            <div className="my-6 text-xl font-bold text-purple-600">+{sessionXp} Total XP</div>
            <Button onClick={() => window.location.reload()}>Re-spawn</Button>
        </div>
    );
    
    return (
        <div className="relative p-8 rounded-3xl bg-white border-2 border-bamboo/10 shadow-inner min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
            {combo > 5 && <div className="absolute inset-0 bg-yellow-400/5 animate-pulse pointer-events-none" />}
            <div className="w-full flex justify-between mb-8 z-10">
                <div className="flex items-center gap-2 text-hanko font-bold text-2xl"><Timer size={28} /> {timeLeft}s</div>
                <div className="text-right">
                    <span className="text-3xl font-mono font-bold text-ink">{score}</span>
                    <span className="text-[10px] text-bamboo font-bold block uppercase">Points</span>
                </div>
            </div>
            {current && (
                <div className="text-center space-y-12 z-10 w-full animate-pop" key={current.id}>
                    <div className="relative inline-block">
                        <div className={`text-9xl font-jp font-bold text-ink ${combo > 3 ? 'animate-bounce text-hanko glow-hanko' : ''}`}>{current.ja}</div>
                        {combo > 0 && <div className="absolute -top-4 -right-12 text-hanko font-black text-2xl animate-pop">x{combo}</div>}
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                        {options.map(o => <button key={o} onClick={() => handleAns(o)} className="py-5 rounded-2xl bg-white border border-bamboo/20 hover:border-hanko hover:text-hanko text-2xl font-bold transition-all active:scale-90">{o}</button>)}
                    </div>
                </div>
            )}
            <div className="mt-12 flex gap-2 z-10">
                {[...Array(3)].map((_, i) => <div key={i} className={`w-3 h-3 rounded-full ${i < lives ? 'bg-hanko shadow-[0_0_8px_rgba(201,58,64,0.5)]' : 'bg-bamboo/20'}`} />)}
            </div>
        </div>
    );
};

// --- GENERIC ARCADE ENGINE FOR NEW GAMES (7-20) ---

type GameMode = 
    'flash_recall' | 'number_ninja' | 'particle_power' | 'true_false' | 
    'odd_one_out' | 'counter_strike' | 'antonym_assault' | 'synonym_sniper' | 
    'emoji_match' | 'audio_grid' | 'category_chaos' | 'reflex_dojo' | 'sentence_scramble' | 'zen_focus';

interface Question {
    id: string;
    type: 'text' | 'audio' | 'flash' | 'image';
    question: string;
    options: string[];
    correct: string;
    hint?: string;
    data?: any;
}

const GenericArcadeGame: React.FC<{ mode: GameMode; onExit: () => void }> = ({ mode, onExit }) => {
    const { playSound, speak } = useSettings();
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentQ, setCurrentQ] = useState<Question | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    // --- GAME LOGIC GENERATORS ---
    const generateQuestion = useCallback((): Question | null => {
        const r = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
        const shuffle = (arr: any[]) => [...arr].sort(() => 0.5 - Math.random());

        switch(mode) {
            case 'flash_recall': {
                const item = r(VOCAB_DATA);
                const distractors = shuffle(VOCAB_DATA.filter(i => i.id !== item.id)).slice(0, 3).map(i => i.en);
                return { id: item.id, type: 'flash', question: item.ja, correct: item.en, options: shuffle([item.en, ...distractors]) };
            }
            case 'number_ninja': {
                const item = r(NUMBER_DATA);
                const distractors = shuffle(NUMBER_DATA.filter(i => i.id !== item.id)).slice(0, 3).map(i => i.en);
                return { id: item.id, type: 'audio', question: item.ja, correct: item.en, options: shuffle([item.en, ...distractors]) };
            }
            case 'particle_power': {
                const item = r(GRAMMAR_DATA);
                if (!item.usage) return null;
                const particles = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'の'];
                const usedP = particles.find(p => item.usage!.includes(p));
                if (!usedP) return null;
                const qText = item.usage!.replace(usedP, '___');
                const distractors = shuffle(particles.filter(p => p !== usedP)).slice(0, 3);
                return { id: item.id, type: 'text', question: qText, correct: usedP, options: shuffle([usedP, ...distractors]) };
            }
            case 'true_false': {
                const isTrue = Math.random() > 0.5;
                const item = r(VOCAB_DATA);
                const qText = isTrue ? `${item.ja} means ${item.en}` : `${item.ja} means ${r(VOCAB_DATA.filter(v => v.id !== item.id)).en}`;
                return { id: Math.random().toString(), type: 'text', question: qText, correct: isTrue ? 'True' : 'False', options: ['True', 'False'] };
            }
            case 'odd_one_out': {
                const catA = r(['People', 'Food', 'Nature', 'Vehicle']);
                const itemsA = shuffle(VOCAB_DATA.filter(v => v.category === catA)).slice(0, 3);
                const itemB = r(VOCAB_DATA.filter(v => v.category !== catA));
                if (itemsA.length < 3 || !itemB) return null;
                return { id: Math.random().toString(), type: 'text', question: `Which one is NOT ${catA}?`, correct: itemB.ja, options: shuffle([...itemsA.map(i => i.ja), itemB.ja]) };
            }
            case 'counter_strike': {
                const item = r(COUNTER_DATA);
                const distractors = shuffle(COUNTER_DATA.filter(i => i.id !== item.id)).slice(0, 3).map(i => i.ja);
                return { id: item.id, type: 'text', question: `Counter for: ${item.en}`, correct: item.ja, options: shuffle([item.ja, ...distractors]) };
            }
            case 'antonym_assault': {
                const item = r(ANTONYM_DATA);
                const distractors = shuffle(ANTONYM_DATA.filter(i => i.id !== item.id)).slice(0, 3).map(i => i.romaji);
                return { id: item.id, type: 'text', question: `Opposite of ${item.ja}?`, correct: item.romaji, options: shuffle([item.romaji, ...distractors]) };
            }
            case 'synonym_sniper': {
                const item = r(SYNONYM_DATA);
                const distractors = shuffle(SYNONYM_DATA.filter(i => i.id !== item.id)).slice(0, 3).map(i => i.romaji);
                return { id: item.id, type: 'text', question: `Similar to ${item.ja}?`, correct: item.romaji, options: shuffle([item.romaji, ...distractors]) };
            }
            case 'emoji_match': {
                const emojis = [{e:'🍎',w:'ringo'}, {e:'🐶',w:'inu'}, {e:'🐱',w:'neko'}, {e:'🚗',w:'kuruma'}, {e:'✈️',w:'hikouki'}, {e:'🏠',w:'uchi'}, {e:'🌧️',w:'ame'}, {e:'🗻',w:'yama'}];
                const target = r(emojis);
                const distractors = shuffle(emojis.filter(e => e.w !== target.w)).slice(0, 3).map(e => e.w);
                return { id: Math.random().toString(), type: 'text', question: target.e, correct: target.w, options: shuffle([target.w, ...distractors]) };
            }
            case 'audio_grid': {
                const pool = shuffle(VOCAB_DATA).slice(0, 4);
                const target = pool[0];
                return { id: target.id, type: 'audio', question: target.ja, correct: target.en, options: shuffle(pool.map(p => p.en)) };
            }
            case 'category_chaos': {
                const item = r(VOCAB_DATA);
                if (!item.category) return null;
                const cats = ['People', 'Food', 'Nature', 'Vehicle', 'Time', 'Place'];
                const correctCat = cats.find(c => item.category?.includes(c)) || 'General';
                const distractors = shuffle(cats.filter(c => c !== correctCat)).slice(0, 3);
                return { id: item.id, type: 'text', question: `Category of: ${item.ja}?`, correct: correctCat, options: shuffle([correctCat, ...distractors]) };
            }
            case 'reflex_dojo': {
                // Simplified reflex: Wait for color change logic handled in UI, but here we just do rapid text match
                const item = r(KANA_DATA);
                return { id: item.id, type: 'text', question: item.ja, correct: item.romaji, options: shuffle(KANA_DATA.filter(k => k.id !== item.id).map(k => k.romaji).slice(0,3).concat(item.romaji)) };
            }
            case 'sentence_scramble': {
               const s = { ja: 'わたし は がくせい です', parts: ['わたし', 'は', 'がくせい', 'です'] };
               const shuffled = shuffle(s.parts);
               // Simple version: Pick the correct full sentence from options
               const correct = s.ja;
               const wrong1 = 'がくせい は わたし です';
               const wrong2 = 'わたし です は がくせい';
               const wrong3 = 'です わたし がくせい は';
               return { id: 'scramble', type: 'text', question: 'I am a student', correct: correct, options: shuffle([correct, wrong1, wrong2, wrong3]) };
            }
            case 'zen_focus': {
                // Placeholder logic for Zen
                return { id: 'zen', type: 'text', question: 'Breathe In...', correct: 'Exhale', options: ['Exhale'] };
            }
            default: return null;
        }
    }, [mode]);

    const nextQ = useCallback(() => {
        let q = generateQuestion();
        let tries = 0;
        while (!q && tries < 10) { q = generateQuestion(); tries++; }
        if (q) {
            setCurrentQ(q);
            setFeedback(null);
            if (q.type === 'flash') {
                setShowFlash(true);
                setTimeout(() => setShowFlash(false), 1000);
            }
            if (q.type === 'audio') {
                speak(q.question);
            }
        }
    }, [generateQuestion, speak]);

    useEffect(() => { nextQ(); }, [nextQ]);

    useEffect(() => {
        if (isGameOver) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setIsGameOver(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isGameOver]);

    const handleAnswer = (ans: string) => {
        if (!currentQ || feedback) return;
        
        if (ans === currentQ.correct) {
            setScore(s => s + 100 + (streak * 10));
            setStreak(s => s + 1);
            setFeedback('correct');
            playSound('correct');
            progressService.addXP(5);
            setTimeout(nextQ, 500);
        } else {
            setStreak(0);
            setFeedback('wrong');
            playSound('wrong');
            setTimeout(nextQ, 800);
        }
    };

    if (isGameOver) return (
        <div className="text-center py-20 bg-rice rounded-3xl animate-pop">
            <Trophy size={64} className="mx-auto text-hanko mb-6" />
            <h2 className="text-4xl font-bold text-ink mb-2">Game Over</h2>
            <div className="text-6xl font-mono text-hanko font-bold mb-8">{score}</div>
            <Button onClick={() => window.location.reload()}>Play Again</Button>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto py-10 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2 text-2xl font-bold text-hanko"><Timer /> {timeLeft}</div>
                <div className="text-xl font-mono font-bold text-ink">{score}</div>
            </div>

            <GlassCard className="text-center min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
                {feedback === 'correct' && <div className="absolute inset-0 bg-green-500/20 z-10 animate-pulse" />}
                {feedback === 'wrong' && <div className="absolute inset-0 bg-red-500/20 z-10 animate-shake" />}
                
                {currentQ?.type === 'flash' && !showFlash && <div className="text-bamboo font-bold animate-pulse">Recall the word!</div>}
                
                <div className={`text-5xl font-bold text-ink mb-8 transition-opacity duration-300 ${(currentQ?.type === 'flash' && !showFlash) ? 'opacity-0' : 'opacity-100'}`}>
                    {currentQ?.type === 'audio' ? <button onClick={() => speak(currentQ!.question)} className="p-6 bg-hanko rounded-full text-white shadow-lg animate-bounce"><Music size={40} /></button> : currentQ?.question}
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                    {currentQ?.options.map((opt, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleAnswer(opt)}
                            className="py-4 bg-white border-2 border-bamboo/10 rounded-xl hover:border-hanko hover:text-hanko font-bold transition-all active:scale-95 shadow-sm"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};

export const Games: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [category, setCategory] = useState<'Hiragana' | 'Katakana' | 'Vocab'>('Hiragana');

    const gameItems = useMemo(() => {
        if (category === 'Hiragana') return KANA_DATA.filter(k => k.category === 'Hiragana');
        if (category === 'Katakana') return KANA_DATA.filter(k => k.category === 'Katakana');
        if (category === 'Vocab') return VOCAB_DATA;
        return [];
    }, [category]);

    if (selectedGame) {
        return (
            <div className="max-w-4xl mx-auto py-6 animate-fade-in">
                <Button variant="ghost" onClick={() => setSelectedGame(null)} className="mb-6">
                    ← Back to Arcade
                </Button>
                {/* Legacy Custom Engines */}
                {selectedGame === 'kana_storm' && <KanaStorm items={gameItems} onExit={() => setSelectedGame(null)} />}
                {selectedGame === 'samurai_slash' && <SamuraiSlash items={gameItems} onExit={() => setSelectedGame(null)} />}
                {selectedGame === 'match_arena' && <MatchArena items={gameItems} onExit={() => setSelectedGame(null)} />}
                {selectedGame === 'typing_ninja' && <TypingNinja items={gameItems} onExit={() => setSelectedGame(null)} />}
                {selectedGame === 'confusion_killer' && <ConfusionKiller onExit={() => setSelectedGame(null)} />}
                {selectedGame === 'survival_mode' && <SurvivalMode items={gameItems} onExit={() => setSelectedGame(null)} />}
                
                {/* New Generic Engine Games */}
                {['flash_recall', 'number_ninja', 'particle_power', 'true_false', 'odd_one_out', 'counter_strike', 'antonym_assault', 'synonym_sniper', 'emoji_match', 'audio_grid', 'category_chaos', 'reflex_dojo', 'sentence_scramble', 'zen_focus'].includes(selectedGame) && (
                    <GenericArcadeGame mode={selectedGame as GameMode} onExit={() => setSelectedGame(null)} />
                )}
            </div>
        );
    }

    const GAME_LIST = [
        // Original 6
        { id: 'kana_storm', name: 'Kana Storm', icon: Wind, color: 'blue', desc: 'Catch falling kana.' },
        { id: 'samurai_slash', name: 'Samurai Slash', icon: Swords, color: 'red', desc: 'Slice correct answers.' },
        { id: 'match_arena', name: 'Match Arena', icon: ArrowRightLeft, color: 'green', desc: 'Find matching pairs.' },
        { id: 'typing_ninja', name: 'Typing Ninja', icon: Keyboard, color: 'purple', desc: 'Speed typing drill.' },
        { id: 'confusion_killer', name: 'Confusion Killer', icon: ZapOff, color: 'orange', desc: 'Master similar kana.' },
        { id: 'survival_mode', name: 'Survival Mode', icon: Flame, color: 'slate', desc: '60s Time Attack.' },
        
        // New 14
        { id: 'flash_recall', name: 'Flash Recall', icon: Eye, color: 'amber', desc: 'Visual memory test.' },
        { id: 'number_ninja', name: 'Number Ninja', icon: Hash, color: 'indigo', desc: 'Audio number drill.' },
        { id: 'particle_power', name: 'Particle Power', icon: Link, color: 'pink', desc: 'Grammar particles.' },
        { id: 'true_false', name: 'True or False', icon: Check, color: 'cyan', desc: 'Rapid verification.' },
        { id: 'odd_one_out', name: 'Odd One Out', icon: HelpCircle, color: 'rose', desc: 'Logic puzzle.' },
        { id: 'counter_strike', name: 'Counter Strike', icon: Scale, color: 'emerald', desc: 'Counting items.' },
        { id: 'antonym_assault', name: 'Antonym Assault', icon: ArrowRightLeft, color: 'fuchsia', desc: 'Opposites attract.' },
        { id: 'synonym_sniper', name: 'Synonym Sniper', icon: Copy, color: 'violet', desc: 'Find similarities.' },
        { id: 'emoji_match', name: 'Emoji Match', icon: Smile, color: 'yellow', desc: 'Visual vocab.' },
        { id: 'audio_grid', name: 'Audio Grid', icon: Grid, color: 'sky', desc: 'Listening matrix.' },
        { id: 'category_chaos', name: 'Category Chaos', icon: Layers, color: 'lime', desc: 'Sort words fast.' },
        { id: 'reflex_dojo', name: 'Reflex Dojo', icon: Zap, color: 'zinc', desc: 'Reaction training.' },
        { id: 'sentence_scramble', name: 'Sentence Scramble', icon: AlignLeft, color: 'teal', desc: 'Order the words.' },
        { id: 'zen_focus', name: 'Zen Focus', icon: Moon, color: 'stone', desc: 'Relax and breathe.' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-ink font-serif">Game Arcade</h1>
                <p className="text-bamboo">Challenge yourself with {GAME_LIST.length} different modes.</p>
                <div className="inline-flex bg-white/50 p-1 rounded-xl border border-bamboo/10 shadow-sm">
                    {['Hiragana', 'Katakana', 'Vocab'].map(c => <button key={c} onClick={() => setCategory(c as any)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${category === c ? 'bg-hanko text-white shadow-md' : 'text-bamboo hover:text-hanko'}`}>{c}</button>)}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto pb-10">
                {GAME_LIST.map((game, i) => (
                    <WonderCard 
                        key={game.id} 
                        colorClass={`bg-${game.color}-50 border-${game.color}-200 text-${game.color}-900`} 
                        onClick={() => setSelectedGame(game.id)} 
                        className="p-6 text-center group cursor-pointer hover:shadow-xl transition-all"
                    >
                        <game.icon size={32} className={`mx-auto mb-3 text-${game.color}-600 group-hover:scale-110 transition-transform`} />
                        <h3 className="text-lg font-bold mb-1 truncate">{i+1}. {game.name}</h3>
                        <p className="text-xs opacity-70 font-bold">{game.desc}</p>
                    </WonderCard>
                ))}
            </div>
        </div>
    );
};
