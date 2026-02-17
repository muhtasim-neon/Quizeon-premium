
// ... existing imports ...
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GlassCard, Button, Input, Badge, WonderCard } from '../components/UI';
import { 
    Gamepad2, Heart, Skull, Wind, Swords, ArrowRightLeft, Keyboard, 
    ZapOff, Flame, Zap, Trophy, Timer, Crosshair, RefreshCw
} from 'lucide-react';
import { KANA_DATA, VOCAB_DATA, CONFUSING_PAIRS } from '../data/mockContent';
import { LearningItem } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { progressService } from '../services/progressService';

// ... sub components ... (KanaStorm, SamuraiSlash, etc. - keep existing logic)
const KanaStorm: React.FC<{ items: LearningItem[]; onExit: () => void }> = ({ items, onExit }) => {
    // ... existing implementation ...
    const { playSound, speak } = useSettings();
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [activeItems, setActiveItems] = useState<{ id: string; ja: string; romaji: string; top: number; left: number; speed: number }[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isConfusingMode, setIsConfusingMode] = useState(false);
    const gameLoopRef = useRef<number | null>(null);
    const lastSpawnRef = useRef(0);
    const confusingKana = useMemo(() => items.filter(i => ['シ', 'ツ', 'ぬ', 'め', 'ソ', 'ン', 'わ', 'れ', 'る', 'ろ'].includes(i.ja)), [items]);
    const spawnItem = useCallback(() => { const sourcePool = isConfusingMode && confusingKana.length > 0 ? confusingKana : items; if (sourcePool.length === 0) return; const base = sourcePool[Math.floor(Math.random() * sourcePool.length)]; const newItem = { id: Math.random().toString(), ja: base.ja, romaji: base.romaji, top: -20, left: 10 + Math.random() * 80, speed: 0.5 + (score / 200) + Math.random() * 0.3 }; setActiveItems(prev => [...prev, newItem]); }, [items, isConfusingMode, confusingKana, score]);
    useEffect(() => { if (isGameOver) return; const loop = (time: number) => { if (time - lastSpawnRef.current > (isConfusingMode ? 1000 : 1500)) { spawnItem(); lastSpawnRef.current = time; } setActiveItems(prev => { const updated = prev.map(item => ({ ...item, top: item.top + item.speed })); const missed = updated.filter(item => item.top > 95); if (missed.length > 0) { setLives(l => { if (l <= 1) setIsGameOver(true); return l - 1; }); playSound('wrong'); } return updated.filter(item => item.top <= 95); }); gameLoopRef.current = requestAnimationFrame(loop); }; gameLoopRef.current = requestAnimationFrame(loop); return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); }; }, [isGameOver, isConfusingMode, spawnItem, score, playSound]);
    const handleInput = (val: string) => { const target = activeItems.find(i => i.romaji.toLowerCase() === val.toLowerCase()); if (target) { setActiveItems(prev => prev.filter(i => i.id !== target.id)); setScore(s => s + 10); progressService.addXP(5); playSound('hit'); speak(target.ja); } };
    if (isGameOver) return <div className="text-center py-20 animate-pop"><Skull size={64} className="mx-auto text-hanko mb-6" /><h2 className="text-4xl font-bold text-ink mb-2">Storm Subsided</h2><div className="text-6xl font-mono text-hanko font-bold mb-8">{score}</div><p className="text-bamboo font-bold mb-6">XP Gained: {score / 2}</p><Button onClick={() => window.location.reload()}>Try Again</Button></div>;
    return <div className="relative h-[600px] bg-ink/5 rounded-3xl overflow-hidden border-2 border-bamboo/20"><div className="absolute top-4 left-6 z-20 flex flex-col"><span className="text-xs text-bamboo font-bold uppercase">Score</span><span className="text-2xl font-mono font-bold text-ink">{score}</span></div><div className="absolute top-4 right-6 z-20 flex gap-2">{[...Array(3)].map((_, i) => <Heart key={i} size={24} className={i < lives ? "fill-hanko text-hanko" : "text-bamboo/20"} />)}</div><div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-48"><Input autoFocus placeholder="Type Romaji..." className="text-center bg-white shadow-xl border-hanko/30" onChange={(e) => { handleInput(e.target.value); e.target.value = ''; }} /></div><div className="absolute top-4 left-1/2 -translate-x-1/2 z-20"><button onClick={() => setIsConfusingMode(!isConfusingMode)} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${isConfusingMode ? 'bg-hanko text-white border-hanko animate-pulse' : 'bg-white text-bamboo border-bamboo/20'}`}>{isConfusingMode ? 'Confusing Mode On' : 'Standard Mode'}</button></div>{activeItems.map(item => <div key={item.id} className="absolute text-4xl font-jp font-bold text-ink animate-float transition-all duration-100 ease-linear" style={{ top: `${item.top}%`, left: `${item.left}%` }}>{item.ja}</div>)}</div>;
};

const SamuraiSlash: React.FC<{ items: LearningItem[]; onExit: () => void }> = ({ items, onExit }) => {
    // ... existing ...
    const { playSound, speak } = useSettings();
    const [current, setCurrent] = useState<LearningItem | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [lives, setLives] = useState(3);
    const [combo, setCombo] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isBossRound, setIsBossRound] = useState(false);
    const nextRound = useCallback(() => { if (items.length === 0) return; const target = items[Math.floor(Math.random() * items.length)]; const distractors = items.filter(i => i.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 3).map(i => i.romaji); setCurrent(target); setOptions([target.romaji, ...distractors].sort(() => 0.5 - Math.random())); }, [items]);
    useEffect(() => { nextRound(); }, [nextRound]);
    const handleChoice = (choice: string) => { if (!current) return; if (choice === current.romaji) { setCombo(c => c + 1); playSound('hit'); progressService.addXP(10 + combo); speak(current.ja); if (combo + 1 >= 10 && !isBossRound) setIsBossRound(true); nextRound(); } else { setLives(l => { if (l <= 1) setIsGameOver(true); return l - 1; }); setCombo(0); playSound('wrong'); } };
    if (isGameOver) return <div className="text-center py-20 bg-rice rounded-3xl"><Swords size={64} className="mx-auto text-hanko mb-4" /><h2 className="text-3xl font-bold">Your Blade Broke</h2><Button onClick={() => window.location.reload()} className="mt-8">Sharpen & Try Again</Button></div>;
    return <div className={`p-8 rounded-3xl border-4 transition-colors duration-500 min-h-[500px] flex flex-col items-center justify-center ${isBossRound ? 'border-hanko bg-red-50/50 shadow-2xl shadow-hanko/20' : 'border-bamboo/10 bg-white'}`}><div className="w-full flex justify-between mb-10"><div className="flex gap-1">{[...Array(3)].map((_, i) => <Heart size={24} className={i < lives ? "fill-hanko text-hanko" : "text-bamboo/20"} />)}</div><div className="text-right"><span className="text-xs text-bamboo font-bold uppercase tracking-widest block">Combo</span><span className={`text-3xl font-mono font-bold ${combo > 5 ? 'text-hanko animate-pulse' : 'text-ink'}`}>{combo}x</span></div></div>{isBossRound && <div className="text-hanko font-black text-xl mb-4 animate-bounce tracking-tighter uppercase">Boss Round: 50 Kana Rapid Fire!</div>}{current && <div className="text-center space-y-12 w-full"><div className="text-9xl font-jp font-bold text-ink animate-pop drop-shadow-sm" key={current.id}>{current.ja}</div><div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">{options.map(opt => <button key={opt} onClick={() => handleChoice(opt)} className="py-6 rounded-2xl bg-white border-2 border-bamboo/10 hover:border-hanko hover:text-hanko text-2xl font-bold transition-all active:scale-95 shadow-sm">{opt}</button>)}</div></div>}</div>;
};

const MatchArena: React.FC<{ items: LearningItem[]; onExit: () => void }> = ({ items, onExit }) => {
    // ... existing ...
    const { playSound, speak } = useSettings();
    const [level, setLevel] = useState(1);
    interface Card { id: number; content: string; matchId: string; type: 'hiragana' | 'katakana' | 'romaji'; }
    const [cards, setCards] = useState<Card[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    useEffect(() => { const setupLevel = () => { const numPairs = Math.min(10, 2 + level); const selection = items.sort(() => 0.5 - Math.random()).slice(0, numPairs); const deck: Card[] = []; selection.forEach((item, index) => { const baseType = item.category === 'Katakana' ? 'katakana' : 'hiragana'; const pairId = item.romaji; deck.push({ id: index * 2, content: item.ja, matchId: pairId, type: baseType }); const useRomaji = Math.random() > 0.5; if (useRomaji) { deck.push({ id: index * 2 + 1, content: item.romaji, matchId: pairId, type: 'romaji' }); } else { const counterpart = KANA_DATA.find(k => k.romaji === item.romaji && k.category !== item.category); if (counterpart) { deck.push({ id: index * 2 + 1, content: counterpart.ja, matchId: pairId, type: counterpart.category === 'Katakana' ? 'katakana' : 'hiragana' }); } else { deck.push({ id: index * 2 + 1, content: item.romaji, matchId: pairId, type: 'romaji' }); } } }); setCards(deck.sort(() => 0.5 - Math.random())); setMatched([]); setFlipped([]); }; setupLevel(); }, [level, items]);
    const handleCardClick = (index: number) => { if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return; const newFlipped = [...flipped, index]; setFlipped(newFlipped); playSound('flip'); if (newFlipped.length === 2) { const [f, s] = newFlipped; if (cards[f].matchId === cards[s].matchId) { setMatched(m => [...m, f, s]); setFlipped([]); playSound('correct'); progressService.addXP(15); const toSpeak = cards[f].type !== 'romaji' ? cards[f].content : cards[s].content; speak(toSpeak); } else { setTimeout(() => setFlipped([]), 800); } } };
    if (matched.length === cards.length && cards.length > 0) return <div className="text-center py-20 bg-white rounded-3xl animate-pop"><Badge color="bg-green-100 text-green-700 mb-4 border-green-200">Level {level} Mastered</Badge><Trophy size={64} className="mx-auto text-straw mb-6" /><h2 className="text-3xl font-bold mb-2 text-ink">Memory Sharpened!</h2><p className="text-bamboo mb-8">Ready for more cards?</p><div className="flex gap-4 justify-center"><Button variant="secondary" onClick={onExit}>Exit</Button><Button onClick={() => setLevel(l => l + 1)} className="shadow-lg"><RefreshCw size={18} className="mr-2" /> Next Level</Button></div></div>;
    const gridCols = cards.length <= 12 ? 'grid-cols-3 md:grid-cols-4' : 'grid-cols-4 md:grid-cols-5 lg:grid-cols-6';
    const getCardStyle = (type: string) => { switch(type) { case 'hiragana': return 'bg-gradient-to-br from-red-50 to-white border-red-200 text-hanko'; case 'katakana': return 'bg-gradient-to-br from-blue-50 to-white border-blue-200 text-blue-600'; case 'romaji': return 'bg-gradient-to-br from-green-50 to-white border-green-200 text-green-600 font-sans'; default: return 'bg-white border-gray-200'; } };
    return <div className="space-y-6"><div className="flex justify-between items-center px-4 bg-white/50 p-3 rounded-xl border border-bamboo/10"><div className="text-hanko font-bold text-lg flex items-center gap-2"><Gamepad2 size={20} /> Level {level}</div><div className="text-bamboo text-sm font-bold bg-white px-3 py-1 rounded-lg border border-bamboo/10">{matched.length / 2} / {cards.length / 2} Pairs</div></div><div className={`grid ${gridCols} gap-3 md:gap-4`}>{cards.map((card, i) => { const isFaceUp = flipped.includes(i) || matched.includes(i); return <div key={i} onClick={() => handleCardClick(i)} className={`aspect-[3/4] md:aspect-square rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold transition-all duration-500 cursor-pointer shadow-sm hover:-translate-y-1 hover:shadow-md border-2 relative [transform-style:preserve-3d] ${isFaceUp ? `${getCardStyle(card.type)} [transform:rotateY(0deg)]` : 'bg-hanko border-hanko [transform:rotateY(180deg)]'}`}><div className={`absolute inset-0 flex items-center justify-center [backface-visibility:hidden] ${isFaceUp ? 'opacity-100' : 'opacity-0'}`}>{card.content}{card.type === 'romaji' && <span className="absolute bottom-1 right-2 text-[8px] uppercase tracking-widest text-green-400">RO</span>}{card.type === 'hiragana' && <span className="absolute bottom-1 right-2 text-[8px] uppercase tracking-widest text-red-300">HI</span>}{card.type === 'katakana' && <span className="absolute bottom-1 right-2 text-[8px] uppercase tracking-widest text-blue-300">KA</span>}</div><div className={`absolute inset-0 bg-hanko flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl`}><div className="w-8 h-8 rounded-full border-2 border-white/30 opacity-50"></div></div></div> })}</div></div>;
};

const TypingNinja: React.FC<{ items: LearningItem[]; onExit: () => void }> = ({ items, onExit }) => {
    // ... existing ...
    const { speak, playSound } = useSettings();
    const [current, setCurrent] = useState<LearningItem | null>(null);
    const [input, setInput] = useState('');
    const [streak, setStreak] = useState(0);
    const [isAdvanced, setIsAdvanced] = useState(false);
    const advancedPool = useMemo(() => items.filter(i => i.romaji.length > 2 || ['きゃ', 'きゅ', 'きょ', 'っ'].some(s => i.ja.includes(s))), [items]);
    const next = useCallback(() => { const pool = isAdvanced && advancedPool.length > 0 ? advancedPool : items; if(pool.length === 0) return; setCurrent(pool[Math.floor(Math.random() * pool.length)]); setInput(''); }, [isAdvanced, items, advancedPool]);
    useEffect(() => { next(); }, [next]);
    const check = (e: React.ChangeEvent<HTMLInputElement>) => { const val = e.target.value; if (!current) return; if (val.toLowerCase() === current.romaji.toLowerCase()) { setStreak(s => s + 1); progressService.addXP(10); playSound('hit'); speak(current.ja); next(); } else { setInput(val); } };
    return <div className="max-w-md mx-auto text-center py-10 space-y-10"><div className="flex justify-between items-center bg-white/40 p-4 rounded-2xl border border-bamboo/10"><div className="text-left"><span className="text-[10px] text-bamboo font-bold uppercase block">Streak</span><span className="text-2xl font-mono font-bold text-hanko">{streak}🔥</span></div><button onClick={() => { setIsAdvanced(!isAdvanced); setStreak(0); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isAdvanced ? 'bg-hanko text-white' : 'bg-rice text-bamboo'}`}>{isAdvanced ? 'Advanced Mode' : 'Beginner Mode'}</button></div>{current && <div className="space-y-8 animate-pop"><div className="text-[10rem] font-jp font-bold text-ink drop-shadow-xl">{current.ja}</div><Input autoFocus value={input} onChange={check} className="text-center text-4xl py-6 font-mono tracking-widest border-2 border-hanko/20 focus:border-hanko" placeholder="..." /><div className="text-bamboo text-xs font-bold uppercase tracking-widest animate-pulse">Type the Ninja Romaji</div></div>}</div>;
};

const ConfusionKiller: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    // ... existing ...
    const { speak, playSound } = useSettings();
    const [currentPair, setCurrentPair] = useState(CONFUSING_PAIRS[0]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const next = () => { setCurrentPair(CONFUSING_PAIRS[Math.floor(Math.random() * CONFUSING_PAIRS.length)]); setIsCorrect(null); };
    const handleSelect = (choice: string) => { if (choice === currentPair.correct) { setIsCorrect(true); playSound('correct'); progressService.addXP(15); speak(choice); setTimeout(next, 1000); } else { setIsCorrect(false); playSound('wrong'); } };
    return <div className="max-w-lg mx-auto text-center py-10 space-y-12"><div className="space-y-4"><Badge color="bg-hanko/10 text-hanko border-hanko/20 py-2 px-6 text-sm">Target: {currentPair.label}</Badge><p className="text-bamboo italic">{currentPair.hint}</p></div><div className="flex justify-center gap-8">{[currentPair.correct, currentPair.wrong].sort(() => 0.5 - Math.random()).map(ja => <button key={ja} onClick={() => handleSelect(ja)} className={`w-40 h-40 rounded-3xl text-7xl font-jp font-bold border-4 transition-all ${isCorrect === true && ja === currentPair.correct ? 'border-green-500 bg-green-50' : isCorrect === false && ja === currentPair.wrong ? 'border-hanko bg-red-50' : 'border-bamboo/10 bg-white hover:border-hanko hover:scale-105'}`}>{ja}</button>)}</div>{isCorrect === false && <p className="text-hanko font-bold animate-shake">Incorrect! Remember the hint.</p>}</div>;
};

const SurvivalMode: React.FC<{ items: LearningItem[]; onExit: () => void }> = ({ items, onExit }) => {
    // ... existing ...
    const { playSound, speak } = useSettings();
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [lives, setLives] = useState(3);
    const [current, setCurrent] = useState<LearningItem | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [combo, setCombo] = useState(0);
    const next = useCallback(() => { if(items.length === 0) return; const target = items[Math.floor(Math.random() * items.length)]; const distractors = items.filter(i => i.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 3).map(i => i.romaji); setCurrent(target); setOptions([target.romaji, ...distractors].sort(() => 0.5 - Math.random())); }, [items]);
    useEffect(() => { next(); }, [next]);
    useEffect(() => { const timer = setInterval(() => { setTimeLeft(t => { if (t <= 1) { clearInterval(timer); return 0; } return t - 1; }); }, 1000); return () => clearInterval(timer); }, []);
    const handleAns = (ans: string) => { if (!current) return; if (ans === current.romaji) { setScore(s => s + 10 + (combo * 2)); setCombo(c => c + 1); playSound('hit'); progressService.addXP(5 + combo); speak(current.ja); next(); } else { setLives(l => l - 1); setCombo(0); playSound('wrong'); if (lives <= 1) setTimeLeft(0); } };
    if (timeLeft === 0) return <div className="text-center py-20 bg-rice rounded-3xl animate-pop"><Badge color="bg-hanko text-white mb-6">Survival Result</Badge><div className="text-8xl font-black text-ink mb-2">{score}</div><p className="text-bamboo font-bold mb-10">Total Experience Gained</p><Button onClick={() => window.location.reload()}>Re-spawn</Button></div>;
    return <div className="relative p-8 rounded-3xl bg-white border-2 border-bamboo/10 shadow-inner min-h-[500px] flex flex-col items-center justify-center overflow-hidden">{combo > 5 && <div className="absolute inset-0 bg-yellow-400/5 animate-pulse pointer-events-none" />}<div className="w-full flex justify-between mb-8 z-10"><div className="flex items-center gap-2 text-hanko font-bold text-2xl"><Timer size={28} /> {timeLeft}s</div><div className="text-right"><span className="text-3xl font-mono font-bold text-ink">{score}</span><span className="text-[10px] text-bamboo font-bold block uppercase">Points</span></div></div>{current && <div className="text-center space-y-12 z-10 w-full animate-pop" key={current.id}><div className="relative inline-block"><div className={`text-9xl font-jp font-bold text-ink ${combo > 3 ? 'animate-bounce text-hanko glow-hanko' : ''}`}>{current.ja}</div>{combo > 0 && <div className="absolute -top-4 -right-12 text-hanko font-black text-2xl animate-pop">x{combo}</div>}</div><div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">{options.map(o => <button key={o} onClick={() => handleAns(o)} className="py-5 rounded-2xl bg-white border border-bamboo/20 hover:border-hanko hover:text-hanko text-2xl font-bold transition-all active:scale-90">{o}</button>)}</div></div>}<div className="mt-12 flex gap-2 z-10">{[...Array(3)].map((_, i) => <div key={i} className={`w-3 h-3 rounded-full ${i < lives ? 'bg-hanko shadow-[0_0_8px_rgba(201,58,64,0.5)]' : 'bg-bamboo/20'}`} />)}</div></div>;
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
                {selectedGame === 'kana_storm' && <KanaStorm items={gameItems} onExit={() => setSelectedGame(null)} />}
                {selectedGame === 'samurai_slash' && <SamuraiSlash items={gameItems} onExit={() => setSelectedGame(null)} />}
                {selectedGame === 'match_arena' && <MatchArena items={gameItems} onExit={() => setSelectedGame(null)} />}
                {selectedGame === 'typing_ninja' && <TypingNinja items={gameItems} onExit={() => setSelectedGame(null)} />}
                {selectedGame === 'confusion_killer' && <ConfusionKiller onExit={() => setSelectedGame(null)} />}
                {selectedGame === 'survival_mode' && <SurvivalMode items={gameItems} onExit={() => setSelectedGame(null)} />}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-ink font-serif">Game Arcade</h1>
                <p className="text-bamboo">Challenge yourself and test your reflexes.</p>
                <div className="inline-flex bg-white/50 p-1 rounded-xl border border-bamboo/10 shadow-sm">
                    {['Hiragana', 'Katakana', 'Vocab'].map(c => <button key={c} onClick={() => setCategory(c as any)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${category === c ? 'bg-hanko text-white shadow-md' : 'text-bamboo hover:text-hanko'}`}>{c}</button>)}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <WonderCard colorClass="bg-blue-50 border-blue-200 text-blue-900" onClick={() => setSelectedGame('kana_storm')} className="p-8 text-center group cursor-pointer">
                    <Wind size={48} className="mx-auto mb-4 text-blue-600 group-hover:animate-spin" />
                    <h3 className="text-2xl font-bold mb-2">1️⃣ Kana Storm</h3>
                    <p className="text-sm opacity-70 font-bold">Falling items! Catch them before they hit the ground.</p>
                </WonderCard>
                <WonderCard colorClass="bg-red-50 border-red-200 text-red-900" onClick={() => setSelectedGame('samurai_slash')} className="p-8 text-center group cursor-pointer">
                    <Swords size={48} className="mx-auto mb-4 text-red-600 group-hover:animate-bounce" />
                    <h3 className="text-2xl font-bold mb-2">2️⃣ Samurai Slash</h3>
                    <p className="text-sm opacity-70 font-bold">Swift visual recognition. Slash the correct answers.</p>
                </WonderCard>
                <WonderCard colorClass="bg-green-50 border-green-200 text-green-900" onClick={() => setSelectedGame('match_arena')} className="p-8 text-center group cursor-pointer">
                    <ArrowRightLeft size={48} className="mx-auto mb-4 text-green-600 group-hover:scale-110" />
                    <h3 className="text-2xl font-bold mb-2">3️⃣ Match Arena</h3>
                    <p className="text-sm opacity-70 font-bold">Find matching pairs. Memory and association training.</p>
                </WonderCard>
                <WonderCard colorClass="bg-purple-50 border-purple-200 text-purple-900" onClick={() => setSelectedGame('typing_ninja')} className="p-8 text-center group cursor-pointer">
                    <Keyboard size={48} className="mx-auto mb-4 text-purple-600 group-hover:animate-pulse" />
                    <h3 className="text-2xl font-bold mb-2">4️⃣ Typing Ninja</h3>
                    <p className="text-sm opacity-70 font-bold">Speed typing challenge. Master the keystrokes.</p>
                </WonderCard>
                <WonderCard colorClass="bg-orange-50 border-orange-200 text-orange-900" onClick={() => setSelectedGame('confusion_killer')} className="p-8 text-center group cursor-pointer">
                    <ZapOff size={48} className="mx-auto mb-4 text-orange-600" />
                    <h3 className="text-2xl font-bold mb-2">5️⃣ Confusion Killer</h3>
                    <p className="text-sm opacity-70 font-bold">Target specific confusing pairs (Shi/Tsu, etc).</p>
                </WonderCard>
                <WonderCard colorClass="bg-slate-50 border-slate-200 text-slate-900" onClick={() => setSelectedGame('survival_mode')} className="p-8 text-center group cursor-pointer">
                    <Flame size={48} className="mx-auto mb-4 text-slate-800 group-hover:text-red-500" />
                    <h3 className="text-2xl font-bold mb-2">6️⃣ Survival Mode</h3>
                    <p className="text-sm opacity-70 font-bold">60 seconds. High speed. How long can you last?</p>
                </WonderCard>
            </div>
        </div>
    );
};
