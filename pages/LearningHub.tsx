import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { 
    BookOpen, ArrowLeft, ArrowRight, Hash, Scale, Copy, ArrowRightLeft, 
    Languages, Book, Layers, HelpCircle, Gamepad2, RotateCw, 
    CheckCircle, XCircle, Trophy, Grid, Bookmark, Volume2, Keyboard,
    Calculator, PenTool, Shuffle, Timer, Heart, Move, Zap, Wand2, RefreshCw, Square, MessageCircle,
    Smartphone, Globe, Wifi, ExternalLink, Frown, ThumbsDown, Play, SortAsc, X, Info, Rocket, Flame,
    Target, MousePointer, Search, LayoutGrid, ListOrdered, Skull, Crosshair, Eye
} from 'lucide-react';
import { 
    VOCAB_DATA, KANA_DATA, KANJI_DATA, GRAMMAR_DATA, 
    COUNTER_DATA, NUMBER_DATA, SYNONYM_DATA, ANTONYM_DATA,
    COUNTER_CATEGORIES, NUMBER_CATEGORIES, CONVERSATION_DATA
} from '../data/mockContent';
import { LearningItem, StoryContent, ConversationTopic } from '../types';
import { progressService } from '../services/progressService';
import { aiService } from '../services/aiService';
import { useSettings } from '../contexts/SettingsContext';

// --- TYPES & UTILS ---

type Difficulty = 'easy' | 'medium' | 'hard';
type SectionType = 'kana' | 'vocab' | 'kanji' | 'grammar' | 'counter' | 'number' | 'synonym' | 'antonym' | 'conversation';
type ViewMode = 'list' | 'flashcard' | 'quiz' | 'match' | 'typing' | 'matrix' | 'scramble' | 'builder' | 'particle' | 'math' | 'story' | 'conversation' | 'games';
type SortMethod = 'default' | 'az' | 'length' | 'random' | 'serial';

const getDifficultyConfig = (diff: Difficulty) => {
    switch(diff) {
        case 'easy': return { time: 30, lives: 5, options: 3, hint: true };
        case 'medium': return { time: 15, lives: 3, options: 4, hint: false };
        case 'hard': return { time: 10, lives: 1, options: 4, hint: false };
    }
};

// Celebration Overlay Component
const CelebrationOverlay: React.FC = () => (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 overflow-hidden">
        <div className="absolute animate-blob text-6xl" style={{ top: '20%', left: '20%' }}>🎉</div>
        <div className="absolute animate-blob animation-delay-2000 text-6xl" style={{ top: '30%', right: '20%' }}>✨</div>
        <div className="absolute animate-bounce text-6xl" style={{ bottom: '20%', left: '50%' }}>🌟</div>
    </div>
);

// Sad Vibe Overlay Component
const SadOverlay: React.FC = () => (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 bg-red-500/10 backdrop-blur-[2px]">
        <Frown size={100} className="text-hanko animate-pulse" />
    </div>
);

// --- GAME COMPONENTS ---

const GameIntro: React.FC<{ title: string; desc: string; icon: any; onStart: () => void }> = ({ title, desc, icon: Icon, onStart }) => {
    const { playSound } = useSettings();
    
    const handleStart = () => {
        playSound('click');
        onStart();
    };

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-hanko/10 to-straw/20 rounded-full flex items-center justify-center mb-6 animate-float">
                <Icon size={48} className="text-hanko" />
            </div>
            <h2 className="text-3xl font-bold text-ink mb-2 font-serif">{title}</h2>
            <p className="text-bamboo mb-8 max-w-md text-lg leading-relaxed">{desc}</p>
            <Button onClick={handleStart} size="lg" className="px-10 py-4 text-xl shadow-xl shadow-hanko/20">
                <Play size={24} className="mr-2 fill-current" /> Play Now
            </Button>
        </div>
    );
};

// 1. Kana Memory Match (Reusable for other sections)
const MemoryMatchGame: React.FC<{ items: LearningItem[]; onExit: () => void }> = ({ items, onExit }) => {
    const { playSound } = useSettings();
    const [cards, setCards] = useState<any[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        const selection = items.sort(() => 0.5 - Math.random()).slice(0, 6);
        const deck = [...selection.map(k => ({ ...k, display: k.ja, matchId: k.id })), 
                      ...selection.map(k => ({ ...k, display: k.romaji, matchId: k.id }))]
                      .sort(() => 0.5 - Math.random());
        setCards(deck);
    }, [items]);

    const handleCardClick = (index: number) => {
        if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);
        playSound('flip');

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const [first, second] = newFlipped;
            if (cards[first].matchId === cards[second].matchId) {
                setMatched(m => [...m, first, second]);
                setFlipped([]);
                playSound('correct');
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    const isGameOver = matched.length === cards.length && cards.length > 0;

    if (isGameOver) {
        return (
            <div className="text-center py-10 animate-pop">
                <Trophy size={64} className="mx-auto text-straw mb-6 animate-bounce" />
                <h3 className="text-3xl font-bold text-ink mb-2">Stage Clear!</h3>
                <p className="text-bamboo mb-8">Completed in {moves} moves</p>
                <Button onClick={onExit}><RotateCw size={18} /> Finish</Button>
            </div>
        );
    }

    return (
        <div className="py-4">
            <div className="flex justify-between mb-6">
                <span className="text-bamboo font-bold bg-white/50 px-3 py-1 rounded-lg">Moves: {moves}</span>
                <Button variant="ghost" size="sm" onClick={onExit}><X size={16} /> Exit</Button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <div 
                        key={i}
                        onClick={() => handleCardClick(i)}
                        className={`aspect-square rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold transition-all duration-500 cursor-pointer shadow-sm border
                            ${flipped.includes(i) || matched.includes(i) 
                                ? 'bg-white text-ink border-hanko rotate-0' 
                                : 'bg-hanko text-transparent border-hanko/50 rotate-y-180 hover:bg-red-700'}
                        `}
                    >
                        {(flipped.includes(i) || matched.includes(i)) ? card.display : '?'}
                    </div>
                ))}
            </div>
        </div>
    );
};

// 3. Typing Master (Enhanced)
const TypingMasterGame: React.FC<{ items: LearningItem[]; onExit: () => void }> = ({ items, onExit }) => {
    const { playSound } = useSettings();
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [current, setCurrent] = useState<LearningItem | null>(null);
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(100);
    const [isShaking, setIsShaking] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const timerRef = useRef<number | null>(null);

    const getDifficultyParams = () => {
        switch (difficulty) {
            case 'easy': return { timeMs: 15000, decay: 0.2 };
            case 'medium': return { timeMs: 8000, decay: 0.5 };
            case 'hard': return { timeMs: 4000, decay: 1.0 };
        }
    };

    const startGame = () => {
        setScore(0);
        setLives(3);
        setStreak(0);
        setGameState('playing');
        playSound('click');
        nextWord();
    };

    const nextWord = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        
        const item = items[Math.floor(Math.random() * items.length)];
        setCurrent(item);
        setInput('');
        setTimeLeft(100);
        setFeedback(null);

        const params = getDifficultyParams();
        const tickRate = 50; 
        const decrement = (100 / (params.timeMs / tickRate));

        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    handleTimeOut();
                    return 0;
                }
                return prev - decrement;
            });
        }, tickRate);
    };

    const handleTimeOut = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        playSound('wrong');
        setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
                endGame();
                return 0;
            }
            return newLives;
        });
        setStreak(0);
        setIsShaking(true);
        setTimeout(() => { setIsShaking(false); nextWord(); }, 500);
    };

    const endGame = () => {
        setGameState('gameover');
        playSound('gameover');
        if (timerRef.current) clearInterval(timerRef.current);
    };

    useEffect(() => {
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const check = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!current) return;

        // Visual feedback on mismatch
        if (!current.romaji.toLowerCase().startsWith(val.toLowerCase())) {
            setIsShaking(true);
            playSound('click'); // Or a distinct error thud
            setTimeout(() => setIsShaking(false), 200);
            return; // Block input or allow with shake? Blocking feels like "Typing Master"
        }

        setInput(val);

        if (val.toLowerCase() === current.romaji.toLowerCase()) {
            if (timerRef.current) clearInterval(timerRef.current);
            playSound('hit'); // Satisfying hit sound
            setScore(s => s + (10 * (streak + 1)));
            setStreak(s => s + 1);
            setFeedback(`+${10 * (streak + 1)}`);
            nextWord();
        }
    };

    if (gameState === 'menu') {
        return (
            <div className="text-center py-10 max-w-md mx-auto">
                <Keyboard size={64} className="mx-auto text-hanko mb-4 animate-pulse" />
                <h2 className="text-3xl font-bold text-ink mb-6 font-serif">Typing Master</h2>
                <div className="space-y-4 mb-8">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                        <button
                            key={d}
                            onClick={() => setDifficulty(d)}
                            className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest transition-all ${
                                difficulty === d 
                                ? 'bg-hanko text-white shadow-lg scale-105' 
                                : 'bg-white border border-bamboo/20 text-bamboo hover:bg-rice'
                            }`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
                <Button onClick={startGame} className="w-full py-4 text-xl shadow-xl">
                    Start Game <Play size={20} className="ml-2" />
                </Button>
            </div>
        );
    }

    if (gameState === 'gameover') {
        return (
            <div className="text-center py-10 animate-pop">
                <Skull size={64} className="mx-auto text-bamboo mb-6" />
                <h3 className="text-3xl font-bold text-ink mb-2">Game Over</h3>
                <div className="text-6xl font-mono font-bold text-hanko mb-4">{score}</div>
                <p className="text-bamboo mb-8 uppercase tracking-widest text-xs font-bold">Final Score</p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => { setGameState('menu'); }} variant="secondary">Menu</Button>
                    <Button onClick={startGame}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="text-center py-6 max-w-md mx-auto relative">
            <div className="flex justify-between items-center mb-8 px-4">
                <div className="flex flex-col items-start">
                    <span className="text-xs text-bamboo font-bold uppercase tracking-widest">Score</span>
                    <span className="text-2xl font-mono font-bold text-ink">{score}</span>
                </div>
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                        <Heart key={i} size={24} className={`${i < lives ? 'text-hanko fill-hanko' : 'text-bamboo/20 fill-bamboo/20'} transition-colors`} />
                    ))}
                </div>
            </div>

            {/* Timer Bar */}
            <div className="w-full h-2 bg-bamboo/10 rounded-full mb-8 overflow-hidden">
                <div 
                    className={`h-full transition-all duration-100 ease-linear ${timeLeft < 30 ? 'bg-hanko' : timeLeft < 60 ? 'bg-straw' : 'bg-green-500'}`} 
                    style={{ width: `${timeLeft}%` }}
                ></div>
            </div>

            {current && (
                <div className="relative mb-8">
                    {/* Floating Feedback */}
                    {feedback && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 text-3xl font-bold text-straw animate-float-slow opacity-0 z-20" style={{ animation: 'pop 0.5s forwards' }}>
                            {feedback}
                        </div>
                    )}
                    
                    <div className="text-xs text-bamboo font-bold uppercase tracking-widest mb-2 border border-bamboo/20 rounded-full px-3 py-1 inline-block">Type the Romaji</div>
                    <div className={`text-7xl md:text-8xl font-bold text-ink mb-4 font-jp transition-transform ${isShaking ? 'animate-shake text-hanko' : ''}`} key={current.id}>
                        {current.ja}
                    </div>
                    {difficulty === 'easy' && <div className="text-bamboo text-sm mb-4 font-medium">{current.en}</div>}
                    
                    <div className="relative">
                        <input 
                            autoFocus
                            value={input}
                            onChange={check}
                            className={`w-full text-center text-3xl p-4 border-b-2 bg-transparent focus:outline-none transition-colors font-mono tracking-widest
                                ${isShaking ? 'border-hanko text-hanko' : 'border-bamboo/30 text-ink focus:border-hanko'}
                            `}
                            placeholder="..."
                        />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-bamboo/20">
                            <Crosshair size={24} />
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flex justify-between items-center text-xs font-bold text-bamboo uppercase tracking-widest mt-8">
                <span>Streak: {streak} 🔥</span>
                <button onClick={onExit} className="hover:text-hanko transition-colors">Exit Game</button>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS FOR GAMES ---

const DifficultySelector: React.FC<{ current: Difficulty; onChange: (d: Difficulty) => void }> = ({ current, onChange }) => (
    <div className="flex bg-white/40 p-1.5 rounded-xl gap-2 mb-8 max-w-sm mx-auto border border-bamboo/20 shadow-inner">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <button
                key={d}
                onClick={() => onChange(d)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm ${
                    current === d 
                    ? d === 'easy' ? 'bg-green-600 text-white shadow-green-200' : d === 'medium' ? 'bg-straw text-white shadow-yellow-200' : 'bg-hanko text-white shadow-red-200'
                    : 'text-bamboo hover:bg-white/60 bg-transparent shadow-none'
                }`}
            >
                {d}
            </button>
        ))}
    </div>
);

const LessonStoryView: React.FC<{ items: LearningItem[] }> = ({ items }) => {
    const { speak } = useSettings();
    const [story, setStory] = useState<StoryContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [showTranslation, setShowTranslation] = useState<'none' | 'en' | 'bn'>('none');

    const generateStory = async () => {
        setLoading(true);
        try {
            const result = await aiService.generateStory(items);
            setStory(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
                <Wand2 size={48} className="text-hanko animate-pulse mb-4" />
                <h3 className="text-xl font-bold text-ink">Weaving a story...</h3>
                <p className="text-bamboo">Using {items.length} vocabulary words.</p>
            </GlassCard>
        );
    }

    if (!story) {
        return (
            <GlassCard className="text-center py-16">
                <BookOpen size={64} className="mx-auto text-bamboo mb-6" />
                <h2 className="text-3xl font-bold text-ink mb-2 font-serif">Story Generator</h2>
                <p className="text-bamboo mb-8 max-w-md mx-auto">
                    Generate a unique story using the vocabulary from this lesson. 
                    Great for context-based learning!
                </p>
                <Button onClick={generateStory} size="lg">
                    <Wand2 size={20} className="mr-2" /> Generate Story
                </Button>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <GlassCard className="border-hanko/10">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold text-ink font-serif">{story.title}</h2>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => speak(story.japanese)}><Volume2 size={16} /></Button>
                        <Button variant="secondary" size="sm" onClick={() => setStory(null)}><RefreshCw size={16} /></Button>
                    </div>
                </div>

                <div className="p-8 bg-white/60 rounded-2xl border border-bamboo/10 mb-6 shadow-inner">
                    <p className="text-2xl leading-loose font-jp text-ink">{story.japanese}</p>
                </div>

                <div className="flex gap-2 mb-4">
                    <Button 
                        variant={showTranslation === 'en' ? 'primary' : 'secondary'} 
                        size="sm" 
                        onClick={() => setShowTranslation(showTranslation === 'en' ? 'none' : 'en')}
                    >
                        🇬🇧 English
                    </Button>
                    <Button 
                        variant={showTranslation === 'bn' ? 'primary' : 'secondary'} 
                        size="sm" 
                        onClick={() => setShowTranslation(showTranslation === 'bn' ? 'none' : 'bn')}
                    >
                        🇧🇩 Bangla
                    </Button>
                </div>

                {showTranslation === 'en' && (
                    <div className="p-6 bg-blue-50 border-l-4 border-blue-400 rounded-r-xl text-ink italic animate-fade-in font-serif">
                        {story.english}
                    </div>
                )}
                {showTranslation === 'bn' && (
                    <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-r-xl text-ink animate-fade-in">
                        {story.bangla}
                    </div>
                )}
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <GlassCard>
                     <h3 className="font-bold text-ink mb-4 flex items-center gap-2"><BookOpen size={18} /> Vocabulary Used</h3>
                     <ul className="space-y-2">
                         {story.vocab.map((v, i) => (
                             <li key={i} className="flex justify-between text-sm border-b border-bamboo/20 pb-2 last:border-0">
                                 <span className="text-hanko font-bold">{v.word}</span>
                                 <span className="text-bamboo">{v.meaning}</span>
                             </li>
                         ))}
                     </ul>
                 </GlassCard>
            </div>
        </div>
    );
};

const FlashcardView: React.FC<{ items: LearningItem[] }> = ({ items: initialItems }) => {
    const [items, setItems] = useState(initialItems);
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const SAVED_KEY = 'saved_flashcards';
    
    // Use Global Settings
    const { speak: systemSpeak, playSound } = useSettings();

    useEffect(() => {
        setItems(initialItems);
        setIdx(0);
        setFlipped(false);
    }, [initialItems]);

    const current = items[idx];

    useEffect(() => {
        if (!current) return;
        const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
        setIsSaved(saved.some((item: LearningItem) => item.id === current.id));
    }, [current, idx]);

    const nextCard = useCallback(() => {
        setFlipped(false);
        setTimeout(() => setIdx((prev) => (prev + 1) % items.length), 200);
    }, [items.length]);

    const prevCard = useCallback(() => {
        setFlipped(false);
        setTimeout(() => setIdx((prev) => (prev - 1 + items.length) % items.length), 200);
    }, [items.length]);

    const toggleFlip = useCallback(() => {
        if (!flipped) {
            playSound('flip');
            // Play audio when flipping to reveal
            setTimeout(() => systemSpeak(current.ja), 300);
        }
        setFlipped(prev => !prev);
    }, [flipped, playSound, systemSpeak, current]);

    const markUnknown = useCallback(() => {
        if (current) {
            playSound('wrong');
            progressService.addMistake(current);
            nextCard();
        }
    }, [current, nextCard, playSound]);

    const toggleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
        if (isSaved) {
            const newSaved = saved.filter((item: LearningItem) => item.id !== current.id);
            localStorage.setItem(SAVED_KEY, JSON.stringify(newSaved));
            setIsSaved(false);
        } else {
            saved.push(current);
            localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
            setIsSaved(true);
        }
    };
    
    const playAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        systemSpeak(current.ja);
    };

    // Specific requested logic: Space to Flip. If already flipped, Space to Mistake & Next.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!flipped) {
                    toggleFlip();
                } else {
                    markUnknown(); // Space on back -> Mistake & Next
                }
            }
            if (e.key === 'ArrowRight') nextCard();
            if (e.key === 'ArrowLeft') prevCard();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextCard, prevCard, toggleFlip, markUnknown, flipped]);

    if (!current) return <div className="text-bamboo py-10">No items available for flashcards.</div>;

    return (
        <div className="max-w-3xl mx-auto text-center py-4 animate-fade-in relative">
            <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex items-center gap-2">
                     <span className="text-bamboo text-sm font-mono font-bold bg-white/50 px-3 py-1 rounded-full border border-bamboo/10">
                        Card {idx + 1} / {items.length}
                     </span>
                </div>
                <Badge>{current.category || 'General'}</Badge>
            </div>

            {/* 3D CARD CONTAINER */}
            <div 
                className="relative w-full aspect-[4/3] md:aspect-[16/9] perspective-[1200px] cursor-pointer group mb-10" 
                onClick={toggleFlip}
            >
                <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
                    
                    {/* --- FRONT FACE --- */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-[32px] bg-white border border-bamboo/20 shadow-xl shadow-ink/5 hover:scale-[1.02] transition-transform duration-500 overflow-hidden">
                        <div className="absolute inset-0 washi-texture opacity-40"></div>
                        
                        {/* Controls */}
                        <div className="absolute top-6 right-6 flex gap-3 z-20">
                            <button onClick={toggleSave} className={`p-3 rounded-full transition-all backdrop-blur-md border hover:scale-110 active:scale-95 shadow-sm ${isSaved ? 'bg-hanko text-white border-hanko' : 'bg-white/80 text-bamboo hover:text-hanko border-bamboo/20'}`}><Bookmark size={20} fill={isSaved ? "currentColor" : "none"} /></button>
                        </div>

                        <div className="relative z-10 flex flex-col items-center justify-center h-full">
                            <h2 className="text-7xl md:text-9xl font-jp font-bold text-ink mb-8 tracking-tight drop-shadow-sm">
                                {current.ja}
                            </h2>
                            <p className="text-bamboo text-sm font-medium animate-pulse flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-bamboo/20">
                                <RotateCw size={14} /> Tap or Space to flip
                            </p>
                        </div>
                    </div>
                    
                    {/* --- BACK FACE --- */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[32px] bg-white border border-bamboo/20 shadow-xl overflow-hidden">
                         <div className="absolute inset-0 washi-texture opacity-40"></div>
                         
                         <div className="absolute top-6 right-6 flex gap-3 z-20">
                            <button onClick={playAudio} className="p-3 rounded-full bg-white/80 hover:bg-white text-bamboo hover:text-ink transition-all backdrop-blur-md border border-bamboo/20 hover:scale-110 active:scale-95 shadow-sm"><Volume2 size={20} /></button>
                            <button onClick={toggleSave} className={`p-3 rounded-full transition-all backdrop-blur-md border hover:scale-110 active:scale-95 shadow-sm ${isSaved ? 'bg-hanko text-white border-hanko' : 'bg-white/80 text-bamboo hover:text-hanko border-bamboo/20'}`}><Bookmark size={20} fill={isSaved ? "currentColor" : "none"} /></button>
                        </div>

                        <div className="text-center space-y-6 max-w-lg mx-auto relative z-10 flex flex-col items-center justify-center h-full p-8">
                            <div>
                                <h3 className="text-4xl md:text-5xl font-bold text-ink mb-3 leading-tight font-serif">{current.en}</h3>
                                <p className="text-2xl text-hanko font-medium tracking-wide">{current.romaji}</p>
                            </div>
                            <div className="h-px w-24 bg-bamboo/20"></div>
                            
                            {current.bn && (
                                <p className="flex items-center justify-center gap-2 text-xl text-ink/80">
                                    <span className="text-[10px] uppercase font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded tracking-wider border border-green-200">BN</span> 
                                    {current.bn}
                                </p>
                            )}
                            
                            <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); markUnknown(); }} className="mt-6 shadow-red-100">
                                 <ThumbsDown size={16} /> Mark as Mistake (Space)
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-6">
                <Button variant="secondary" onClick={prevCard} className="w-32 group"> <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Prev </Button>
                <Button onClick={nextCard} className="w-32 group"> Next <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> </Button>
            </div>
        </div>
    );
};

interface QuizProps {
    items: LearningItem[];
    difficulty: Difficulty;
    customMode?: 'particle' | 'normal';
    onComplete?: (score: number, total: number) => void;
}

const QuizView: React.FC<QuizProps> = ({ items, difficulty, customMode = 'normal', onComplete }) => {
    const { playSound } = useSettings();
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [showScore, setShowScore] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [timeLeft, setTimeLeft] = useState(10);
    const config = getDifficultyConfig(difficulty);

    useEffect(() => {
        if (items.length < 2) return;
        setLives(config.lives);
        
        // Use ALL items from the selected lesson and randomize them
        const deck = [...items].sort(() => 0.5 - Math.random()); 
        
        const qs = deck.map(item => {
            // Logic for Particle Master Mode (Grammar Specific)
            if (customMode === 'particle' && item.usage) {
                const particles = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'の', 'も'];
                const foundParticles = particles.filter(p => item.usage!.includes(p));
                
                if (foundParticles.length > 0) {
                    const targetP = foundParticles[Math.floor(Math.random() * foundParticles.length)];
                    const questionText = item.usage!.replace(targetP, '___');
                    const distractors = particles.filter(p => p !== targetP).sort(() => 0.5 - Math.random()).slice(0, config.options - 1);
                    return {
                        question: questionText + (item.en ? `\n(${item.en})` : ''),
                        correct: targetP,
                        options: [targetP, ...distractors].sort(() => 0.5 - Math.random())
                    };
                }
            }

            // Enhanced Mixed Language Logic
            // 4 Possible modes: JA->EN, EN->JA, JA->BN, BN->JA (if BN exists)
            
            const hasBangla = !!item.bn;
            const modes = ['ja_en', 'en_ja'];
            if (hasBangla) {
                modes.push('ja_bn', 'bn_ja');
            }
            
            const mode = modes[Math.floor(Math.random() * modes.length)];
            
            let questionText, correctText, optionsPool;

            if (mode === 'ja_bn') {
                // Q: Japanese -> A: Bangla
                questionText = item.ja;
                correctText = item.bn!;
                optionsPool = deck.filter(i => i.id !== item.id && i.bn).map(i => i.bn!);
            } else if (mode === 'bn_ja') {
                 // Q: Bangla -> A: Japanese
                questionText = item.bn!;
                correctText = item.ja;
                optionsPool = deck.filter(i => i.id !== item.id).map(i => i.ja);
            } else if (mode === 'en_ja') {
                // Q: English -> A: Japanese
                questionText = item.en;
                correctText = item.ja;
                optionsPool = deck.filter(i => i.id !== item.id).map(i => i.ja);
            } else {
                // Q: Japanese -> A: English (Default)
                questionText = item.ja;
                correctText = item.en;
                optionsPool = deck.filter(i => i.id !== item.id).map(i => i.en);
            }

            // Ensure we have enough options, if not, fill with dummy if really needed (unlikely with decent dataset)
            const wrongOptions = optionsPool.sort(() => 0.5 - Math.random()).slice(0, config.options - 1);
            
            return {
                question: questionText,
                correct: correctText,
                options: [...wrongOptions, correctText].sort(() => 0.5 - Math.random())
            };
        }).filter(q => q);

        setQuestions(qs);
        setScore(0);
        setCurrentQIndex(0);
        setShowScore(false);
        setTimeLeft(config.time);
    }, [items, difficulty, customMode]);

    useEffect(() => {
        if (showScore || feedback) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleAnswer('__TIMEOUT__');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, showScore, feedback]);

    const handleAnswer = (option: string) => {
        if (feedback) return;
        const isCorrect = option === questions[currentQIndex].correct;
        
        if (isCorrect) {
            playSound('correct');
            setScore(score + 10);
            progressService.addXP(10); // Add XP per correct answer
            setFeedback('correct');
        } else {
            playSound('wrong');
            setLives(prev => prev - 1);
            setFeedback('wrong');
        }

        setTimeout(() => {
            setFeedback(null);
            
            if (currentQIndex < questions.length - 1 && (lives > 1 || isCorrect)) {
                setCurrentQIndex(currentQIndex + 1);
                setTimeLeft(config.time);
            } else {
                setShowScore(true);
                if (currentQIndex === questions.length - 1 && (lives > 0 || isCorrect)) {
                     const finalScore = score + (isCorrect ? 10 : 0);
                     if (onComplete) onComplete(finalScore, questions.length * 10);
                }
            }
        }, 1200);
    };

    if (items.length < 4) return <div className="text-center py-10 text-bamboo">Not enough items to generate a quiz.</div>;
    if (questions.length === 0) return <div className="text-center py-10">Loading Quiz...</div>;

    if (showScore) {
        const percentage = Math.round((score / (questions.length * 10)) * 100);
        const passed = percentage >= 80;

        return (
            <div className="text-center py-12 animate-fade-in relative max-w-md mx-auto">
                {passed && <CelebrationOverlay />}
                <GlassCard className="border-t-4 border-t-hanko">
                    <Trophy size={64} className={`mx-auto mb-4 ${passed ? 'text-straw animate-bounce' : 'text-bamboo'}`} />
                    <h2 className="text-3xl font-bold text-ink mb-2 font-serif">{lives > 0 ? 'Quiz Completed!' : 'Game Over'}</h2>
                    <div className="text-7xl font-bold mb-4 font-mono tracking-tighter">
                        <span className={passed ? "text-green-600" : "text-hanko"}>{percentage}%</span>
                    </div>
                    {passed && <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg mb-6 font-bold border border-green-200">Lesson Mastered!</div>}
                    <p className="text-bamboo mb-8">Score: {score} / {questions.length * 10}</p>
                    <Button onClick={() => { setShowScore(false); setCurrentQIndex(0); setScore(0); setLives(config.lives); }} className="w-full">
                        <RotateCw size={18} /> Retry Quiz
                    </Button>
                </GlassCard>
            </div>
        );
    }

    const currentQ = questions[currentQIndex];

    return (
        <div className="max-w-xl mx-auto py-4 animate-fade-in relative">
            {feedback === 'correct' && <CelebrationOverlay />}
            {feedback === 'wrong' && <SadOverlay />}
            
            <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-hanko bg-white/60 px-3 py-1 rounded-lg border border-hanko/10 shadow-sm"><Heart size={18} fill="currentColor" /> {lives}</span>
                    <span className="flex items-center gap-1 text-straw bg-white/60 px-3 py-1 rounded-lg border border-straw/10 shadow-sm"><Timer size={18} /> {timeLeft}s</span>
                </div>
                <span className="text-bamboo font-bold text-sm bg-white/60 px-3 py-1 rounded-lg border border-bamboo/10">Q {currentQIndex + 1}/{questions.length}</span>
            </div>
            
            <GlassCard className={`text-center py-16 mb-6 border-2 transition-all duration-300 ${feedback === 'correct' ? 'border-green-500 bg-green-50 scale-105' : feedback === 'wrong' ? 'border-hanko bg-red-50 animate-pulse' : 'border-bamboo/20'}`}>
                <h2 className="text-3xl md:text-4xl font-jp font-bold text-ink mb-4 whitespace-pre-line leading-relaxed">{currentQ.question}</h2>
                {feedback === 'correct' && <CheckCircle className="mx-auto text-green-500 animate-bounce" size={40} />}
                {feedback === 'wrong' && <XCircle className="mx-auto text-hanko animate-bounce" size={40} />}
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((opt: string, i: number) => (
                    <Button 
                        key={i} 
                        variant="secondary" 
                        onClick={() => handleAnswer(opt)}
                        disabled={!!feedback}
                        className="py-5 text-lg hover:bg-rice font-jp shadow-sm"
                    >
                        {opt}
                    </Button>
                ))}
            </div>
        </div>
    );
};

// --- PLACEHOLDER COMPONENTS ---

const SentenceBuilderView: React.FC<{ items: LearningItem[]; difficulty: Difficulty }> = ({ items }) => (
  <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
    <PenTool size={64} className="text-green-600 mb-4" />
    <h2 className="text-2xl font-bold text-ink mb-2">Sentence Builder</h2>
    <p className="text-bamboo">Arrange words to form sentences. Coming soon...</p>
  </GlassCard>
);

const MathChallengeView: React.FC<{ difficulty: Difficulty }> = () => (
  <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
    <Calculator size={64} className="text-straw mb-4" />
    <h2 className="text-2xl font-bold text-ink mb-2">Math Challenge</h2>
    <p className="text-bamboo">Japanese numbers math test. Coming soon...</p>
  </GlassCard>
);

const MatrixSearchView: React.FC<{ items: LearningItem[]; difficulty: Difficulty }> = ({ items }) => (
  <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
    <Grid size={64} className="text-hanko mb-4" />
    <h2 className="text-2xl font-bold text-ink mb-2">Matrix Search</h2>
    <p className="text-bamboo">Find words in the grid. Coming soon...</p>
  </GlassCard>
);

const WordScrambleView: React.FC<{ items: LearningItem[]; difficulty: Difficulty }> = ({ items }) => (
  <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
    <Move size={64} className="text-straw mb-4" />
    <h2 className="text-2xl font-bold text-ink mb-2">Word Scramble</h2>
    <p className="text-bamboo">Unscramble the letters. Coming soon...</p>
  </GlassCard>
);

const ConversationDetailView: React.FC<{ topic: ConversationTopic; onBack: () => void }> = ({ topic, onBack }) => {
    const { speak } = useSettings();
    const [reveal, setReveal] = useState<boolean[]>(new Array(topic.lines.length).fill(false));

    const toggleReveal = (index: number) => {
        const newReveal = [...reveal];
        newReveal[index] = !newReveal[index];
        setReveal(newReveal);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack}><ArrowLeft size={24} /></Button>
                <div>
                    <h2 className="text-2xl font-bold text-ink">{topic.title}</h2>
                    <p className="text-bamboo font-jp">{topic.jpTitle}</p>
                </div>
            </div>

            <div className="space-y-4">
                {topic.lines.map((line, i) => (
                    <GlassCard key={i} className={`flex gap-4 ${line.speaker === 'B' ? 'flex-row-reverse bg-hanko/5' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold ${line.speaker === 'A' ? 'bg-ink text-white' : 'bg-hanko text-white'}`}>
                            {line.speaker}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <p className="text-xl font-bold font-jp text-ink">{line.ja}</p>
                                <Button variant="ghost" size="sm" onClick={() => speak(line.ja)}><Volume2 size={16} /></Button>
                            </div>
                            <p className="text-hanko font-medium text-sm">{line.romaji}</p>
                            
                            <div className="pt-2 border-t border-bamboo/10 cursor-pointer" onClick={() => toggleReveal(i)}>
                                {reveal[i] ? (
                                    <div className="animate-fade-in">
                                        <p className="text-ink text-sm">{line.en}</p>
                                        <p className="text-bamboo text-xs mt-1">🇧🇩 {line.bn}</p>
                                    </div>
                                ) : (
                                    <p className="text-bamboo/50 text-xs italic flex items-center gap-1"><Eye size={12} /> Click to reveal translation</p>
                                )}
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

const GameArcade: React.FC<{ section: SectionType | null; onSelectGame: (mode: ViewMode) => void }> = ({ section, onSelectGame }) => {
    
    const games = [
        { id: 'match', label: 'Memory Match', desc: 'Find the matching pairs.', icon: Layers, color: 'text-blue-500' },
        { id: 'typing', label: 'Typing Master', desc: 'Type the Romaji quickly.', icon: Keyboard, color: 'text-hanko' },
        { id: 'quiz', label: 'Speed Quiz', desc: 'Classic multiple choice.', icon: HelpCircle, color: 'text-green-600' },
    ];

    if (section === 'grammar') {
        games.push({ id: 'builder', label: 'Sentence Builder', desc: 'Arrange the words correctly.', icon: PenTool, color: 'text-purple-600' });
        games.push({ id: 'particle', label: 'Particle Master', desc: 'Choose the correct particle.', icon: Crosshair, color: 'text-orange-500' });
    } else if (['vocab', 'kanji'].includes(section || '')) {
         games.push({ id: 'scramble', label: 'Word Scramble', desc: 'Unscramble the characters.', icon: Move, color: 'text-pink-500' });
         games.push({ id: 'matrix', label: 'Matrix Search', desc: 'Find words in the grid.', icon: Grid, color: 'text-indigo-500' });
    } else if (section === 'number') {
        games.push({ id: 'math', label: 'Math Challenge', desc: 'Solve math problems in Japanese.', icon: Calculator, color: 'text-yellow-600' });
    }

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-ink mb-2 flex items-center justify-center gap-3">
                    <Gamepad2 size={32} className="text-hanko" /> Game Arcade
                </h2>
                <p className="text-bamboo">Select a challenge to test your skills.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map(game => (
                    <GlassCard 
                        key={game.id} 
                        hoverEffect 
                        onClick={() => onSelectGame(game.id as ViewMode)}
                        className="cursor-pointer group flex flex-col items-center text-center py-8 border-t-4 border-t-transparent hover:border-t-hanko transition-all"
                    >
                        <div className={`p-4 rounded-2xl bg-rice mb-4 group-hover:scale-110 transition-transform ${game.color} shadow-sm`}>
                            <game.icon size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-ink mb-2">{game.label}</h3>
                        <p className="text-sm text-bamboo">{game.desc}</p>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export const LearningHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  // Sorting & List State
  const [sortMethod, setSortMethod] = useState<SortMethod>('default');
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  // Filters State
  const [kanaSystem, setKanaSystem] = useState<'Hiragana' | 'Katakana' | 'Mixed'>('Hiragana');
  const [kanaVar, setKanaVar] = useState<'basic' | 'dakuten' | 'youon'>('basic');
  const [lessonMode, setLessonMode] = useState<'lesson' | 'category'>('lesson');
  const [selectedLesson, setSelectedLesson] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('People');
  const [selectedCounterGroup, setSelectedCounterGroup] = useState<string>(COUNTER_CATEGORIES[0]);
  const [selectedNumberGroup, setSelectedNumberGroup] = useState<string>(NUMBER_CATEGORIES[0]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationTopic | null>(null);
  
  // Use global speak & sound
  const { speak, playSound } = useSettings();

  useEffect(() => {
    setCompletedLessons(progressService.getCompletedLessons());
  }, []);

  // Stop Play All if switching views
  useEffect(() => {
      setIsPlayingAll(false);
      window.speechSynthesis.cancel();
  }, [viewMode, activeSection]);

  const handleLessonComplete = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80 && activeSection) {
        let id = '';
        if (lessonMode === 'lesson') id = `${activeSection}-lesson-${selectedLesson}`;
        else if (lessonMode === 'category') id = `${activeSection}-cat-${selectedCategory}`;
        
        progressService.markLessonComplete(id);
        playSound('success');
        setCompletedLessons(progressService.getCompletedLessons());
    }
  };

  const getContent = () => {
    let items = [];
    switch(activeSection) {
        case 'kana':
            if (kanaSystem === 'Mixed') items = KANA_DATA.filter(k => k.variation === kanaVar);
            else items = KANA_DATA.filter(k => k.category === kanaSystem && k.variation === kanaVar);
            break;
        case 'vocab':
            items = VOCAB_DATA.filter(v => lessonMode === 'lesson' ? v.lesson === selectedLesson : v.category === selectedCategory);
            break;
        case 'kanji':
            items = KANJI_DATA.filter(k => lessonMode === 'lesson' ? k.lesson === selectedLesson : k.category === selectedCategory);
            break;
        case 'grammar':
            items = GRAMMAR_DATA.filter(g => g.lesson === selectedLesson);
            break;
        case 'counter':
            items = COUNTER_DATA.filter(c => c.group === selectedCounterGroup);
            break;
        case 'number':
            items = NUMBER_DATA.filter(n => n.group === selectedNumberGroup);
            break;
        case 'synonym': items = SYNONYM_DATA; break;
        case 'antonym': items = ANTONYM_DATA; break;
        default: items = [];
    }

    // Apply Sorting
    const sorted = [...items];
    if (sortMethod === 'az') return sorted.sort((a,b) => a.romaji.localeCompare(b.romaji));
    if (sortMethod === 'length') return sorted.sort((a,b) => a.ja.length - b.ja.length);
    if (sortMethod === 'random') return sorted.sort(() => 0.5 - Math.random());
    if (sortMethod === 'serial') return items; // Default array order
    
    return sorted; // Default
  };

  const currentContent = getContent();

  useEffect(() => { 
      if (activeSection === 'conversation') {
          setViewMode('conversation'); 
      } else {
          setViewMode('list'); 
      }
  }, [activeSection]);

  const handlePlayAll = async () => {
      if (isPlayingAll) {
          setIsPlayingAll(false);
          window.speechSynthesis.cancel();
          return;
      }

      setIsPlayingAll(true);
      for (const item of currentContent) {
          if (!window.speechSynthesis.speaking && !isPlayingAll) break; // Check cancel
          
          speak(item.ja);
          // Simple delay simulation to wait for speech (rough approx since API doesn't have reliable promise)
          await new Promise(r => setTimeout(r, 1500)); 
          
          if (!isPlayingAll) break;
      }
      setIsPlayingAll(false);
  };

  // Define games per section
  const getAvailableModes = () => {
      const base = [
          { id: 'list', label: 'List', icon: BookOpen },
          { id: 'flashcard', label: 'Flashcards', icon: Layers },
      ];

      if (activeSection === 'conversation') return []; // Handled separately

      // Add Story Generator for Vocab/Kanji
      if (['vocab', 'kanji'].includes(activeSection || '')) {
          base.push({ id: 'story', label: 'Story Generator', icon: Wand2 });
      }

      // Add Universal Games Tab to ALL sections
      return [
          ...base,
          { id: 'games', label: 'Games Arcade', icon: Gamepad2 }
      ];
  };

  const uniqueLessons = Array.from(new Set(VOCAB_DATA.map(v => v.lesson))).sort((a,b) => (a||0) - (b||0));
  const uniqueVocabCats = Array.from(new Set(VOCAB_DATA.map(v => v.category))).filter(Boolean) as string[];
  const uniqueKanjiCats = Array.from(new Set(KANJI_DATA.map(v => v.category))).filter(Boolean) as string[];

  // Helper to check completion
  const isComplete = (id: string) => completedLessons.includes(id);

  // --- CONVERSATION VIEW RENDER ---
  if (activeSection === 'conversation') {
      if (selectedConversation) {
          return <ConversationDetailView topic={selectedConversation} onBack={() => setSelectedConversation(null)} />;
      }

      return (
          <div className="space-y-8 animate-fade-in">
              <div className="flex items-center gap-4 border-b border-bamboo/10 pb-6">
                  <Button variant="ghost" onClick={() => setActiveSection(null)} className="p-2 h-auto"><ArrowLeft size={24} /></Button>
                  <div>
                      <h1 className="text-4xl font-bold text-ink font-serif mb-1">Conversation Dojo</h1>
                      <p className="text-bamboo font-medium">Master real-life scenarios through interactive dialogue.</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CONVERSATION_DATA.map(topic => (
                      <GlassCard 
                          key={topic.id} 
                          hoverEffect 
                          className="cursor-pointer group flex flex-col justify-between border-t-4 border-t-purple-400 min-h-[200px]"
                          onClick={() => setSelectedConversation(topic)}
                      >
                          <div>
                              <div className="flex justify-between items-start mb-4">
                                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                                      <MessageCircle size={24} />
                                  </div>
                                  <Badge color="bg-purple-50 text-purple-600 border-purple-100">N5</Badge>
                              </div>
                              <h3 className="text-xl font-bold text-ink mb-1 group-hover:text-purple-700 transition-colors">{topic.title}</h3>
                              <p className="text-sm text-bamboo font-jp font-bold mb-4">{topic.jpTitle}</p>
                          </div>
                          <div className="flex items-center justify-between text-xs text-bamboo border-t border-bamboo/10 pt-4 mt-auto">
                              <span className="flex items-center gap-1 font-mono"><Hash size={12} /> {topic.lines.length} Lines</span>
                              <div className="flex items-center gap-1 text-purple-600 font-bold group-hover:translate-x-1 transition-transform">
                                  Start <ArrowRight size={14} />
                              </div>
                          </div>
                      </GlassCard>
                  ))}
              </div>
          </div>
      );
  }

  // --- MAIN MENU RENDER ---
  if (!activeSection) {
      const menus = [
          { id: 'kana', title: 'Hiragana & Katakana', desc: 'The foundation of Japanese writing.', icon: Languages, color: 'text-hanko', bg: 'bg-hanko/10', border: 'border-hanko/20' },
          { id: 'conversation', title: 'Conversation Dojo', desc: 'Real-life scenarios & dialogues.', icon: MessageCircle, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
          { id: 'vocab', title: 'Vocabulary', desc: 'Minna no Nihongo essential words.', icon: Book, color: 'text-ink', bg: 'bg-ink/10', border: 'border-ink/20' },
          { id: 'kanji', title: 'Kanji', desc: 'Characters and meanings.', icon: BookOpen, color: 'text-straw', bg: 'bg-straw/20', border: 'border-straw/30' },
          { id: 'grammar', title: 'Grammar', desc: 'Sentence structures and rules.', icon: PenTool, color: 'text-bamboo', bg: 'bg-bamboo/20', border: 'border-bamboo/30' },
          { id: 'counter', title: 'Counters', desc: 'Counting things, people, dates.', icon: Scale, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' },
          { id: 'number', title: 'Numbers', desc: 'Time, prices, and math.', icon: Hash, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
          { id: 'synonym', title: 'Synonyms', desc: 'Similar words expansion.', icon: Copy, color: 'text-pink-500', bg: 'bg-pink-100', border: 'border-pink-200' },
          { id: 'antonym', title: 'Antonyms', desc: 'Opposites and pairs.', icon: ArrowRightLeft, color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-200' },
      ];

      return (
          <div className="space-y-10">
              <div className="text-center max-w-2xl mx-auto">
                  <h1 className="text-4xl font-bold text-ink mb-3 font-serif">Learning Hub</h1>
                  <p className="text-lg text-bamboo">Choose a category to begin your training.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menus.map(m => (
                      <GlassCard key={m.id} hoverEffect onClick={() => setActiveSection(m.id as SectionType)} className={`cursor-pointer group border-t-4 ${m.border.replace('border-', 'border-t-')}`}>
                          <div className={`w-14 h-14 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center mb-5 transition-transform group-hover:scale-110 shadow-sm`}>
                              <m.icon size={28} />
                          </div>
                          <h3 className="text-2xl font-bold text-ink mb-2 group-hover:text-hanko transition-colors">{m.title}</h3>
                          <p className="text-sm text-bamboo leading-relaxed">{m.desc}</p>
                      </GlassCard>
                  ))}
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 border-b border-bamboo/10 pb-4 justify-between">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setActiveSection(null)} className="p-2 h-auto"><ArrowLeft size={20} /></Button>
                <div>
                    <h1 className="text-2xl font-bold text-ink capitalize font-serif">{activeSection === 'kana' ? 'Kana Systems' : activeSection}</h1>
                    <p className="text-sm text-bamboo">Select a game mode</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 bg-white/40 p-1.5 rounded-xl border border-bamboo/10">
                 {getAvailableModes().map(m => (
                     <button key={m.id} onClick={() => setViewMode(m.id as any)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === m.id ? 'bg-hanko text-white shadow-lg' : 'text-bamboo hover:text-hanko hover:bg-white/60'}`}>
                        <m.icon size={16} /> {m.label}
                     </button>
                 ))}
            </div>
        </div>

        {viewMode !== 'list' && viewMode !== 'flashcard' && viewMode !== 'story' && viewMode !== 'games' && (
            <DifficultySelector current={difficulty} onChange={setDifficulty} />
        )}

        <GlassCard className="py-6 border-t-4 border-t-bamboo/20">
            {/* Filters UI */}
            {activeSection === 'kana' && viewMode !== 'games' && (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex gap-2 bg-white/40 p-1 rounded-xl border border-bamboo/10">
                        {['Hiragana', 'Katakana', 'Mixed'].map(sys => <button key={sys} onClick={() => setKanaSystem(sys as any)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${kanaSystem === sys ? 'bg-hanko text-white shadow-sm' : 'text-bamboo hover:text-hanko'}`}>{sys}</button>)}
                    </div>
                    <div className="flex items-center gap-3">
                         <span className="text-bamboo font-bold text-sm hidden md:block uppercase tracking-widest">Variation</span>
                         <div className="flex gap-2">{['basic', 'dakuten', 'youon'].map(v => <Button key={v} variant={kanaVar === v ? 'primary' : 'secondary'} size="sm" onClick={() => setKanaVar(v as any)} className="capitalize">{v}</Button>)}</div>
                    </div>
                </div>
            )}
            
            {(activeSection === 'vocab' || activeSection === 'kanji') && (
                <div className="flex flex-col md:flex-row gap-6 items-center flex-wrap">
                    <div className="flex gap-2 bg-white/40 p-1 rounded-xl border border-bamboo/10">
                        <button onClick={() => setLessonMode('lesson')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${lessonMode === 'lesson' ? 'bg-hanko text-white shadow-sm' : 'text-bamboo hover:text-hanko'}`}>Lesson Wise</button>
                        <button onClick={() => setLessonMode('category')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${lessonMode === 'category' ? 'bg-hanko text-white shadow-sm' : 'text-bamboo hover:text-hanko'}`}>Category Wise</button>
                    </div>
                    <select 
                        className="bg-white/60 text-ink border border-bamboo/20 rounded-xl px-4 py-2 outline-none focus:border-hanko focus:ring-2 focus:ring-hanko/10 transition-all font-medium" 
                        value={lessonMode === 'lesson' ? selectedLesson : selectedCategory} 
                        onChange={(e) => lessonMode === 'lesson' ? setSelectedLesson(Number(e.target.value)) : setSelectedCategory(e.target.value)}
                    >
                        {lessonMode === 'lesson' ? uniqueLessons.map(l => (
                            <option key={l} value={l} className={isComplete(`${activeSection}-lesson-${l}`) ? "bg-green-100 font-bold text-green-700" : ""}>
                                Lesson {l} {isComplete(`${activeSection}-lesson-${l}`) ? '✅' : ''}
                            </option>
                        )) : (activeSection === 'vocab' ? uniqueVocabCats : uniqueKanjiCats).map(c => (
                            <option key={c} value={c} className={isComplete(`${activeSection}-cat-${c}`) ? "bg-green-100 font-bold text-green-700" : ""}>
                                {c} {isComplete(`${activeSection}-cat-${c}`) ? '✅' : ''}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            
            {/* Sorting Controls for List View */}
            {viewMode === 'list' && (
                <div className="mt-6 pt-4 border-t border-bamboo/10 flex flex-wrap gap-3 items-center">
                    <span className="text-xs font-bold uppercase text-bamboo/60 mr-2 tracking-widest">Sort By</span>
                    <Button size="sm" variant={sortMethod === 'az' ? 'primary' : 'secondary'} onClick={() => setSortMethod(sortMethod === 'az' ? 'default' : 'az')}>
                        <SortAsc size={14} /> A-Z
                    </Button>
                    <Button size="sm" variant={sortMethod === 'length' ? 'primary' : 'secondary'} onClick={() => setSortMethod(sortMethod === 'length' ? 'default' : 'length')}>
                        <Scale size={14} /> Shortest
                    </Button>
                    <Button size="sm" variant={sortMethod === 'random' ? 'primary' : 'secondary'} onClick={() => setSortMethod(sortMethod === 'random' ? 'default' : 'random')}>
                        <Shuffle size={14} /> Random
                    </Button>
                    {/* Added Serial Option */}
                    <Button size="sm" variant={sortMethod === 'serial' ? 'primary' : 'secondary'} onClick={() => setSortMethod(sortMethod === 'serial' ? 'default' : 'serial')}>
                        <ListOrdered size={14} /> Serial
                    </Button>
                    
                    <div className="h-6 w-px bg-bamboo/20 mx-2"></div>
                    <Button size="sm" variant={isPlayingAll ? 'danger' : 'secondary'} onClick={handlePlayAll}>
                         {isPlayingAll ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                         {isPlayingAll ? 'Stop Lesson' : 'Listen All'}
                    </Button>
                </div>
            )}
            
            {activeSection === 'grammar' && (
                <div className="flex items-center gap-4">
                    <span className="text-bamboo font-bold uppercase tracking-widest text-sm">Select Lesson</span>
                    <select 
                        className="bg-white/60 text-ink border border-bamboo/20 rounded-xl px-4 py-2 outline-none focus:border-hanko transition-all font-medium" 
                        value={selectedLesson} 
                        onChange={(e) => setSelectedLesson(Number(e.target.value))}
                    >
                        {uniqueLessons.map(l => (
                            <option key={l} value={l} className={isComplete(`grammar-lesson-${l}`) ? "bg-green-100 font-bold text-green-700" : ""}>
                                Lesson {l} {isComplete(`grammar-lesson-${l}`) ? '✅' : ''}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {activeSection === 'counter' && (
                <div className="flex items-center gap-4">
                     <span className="text-bamboo font-bold uppercase tracking-widest text-sm">Category</span>
                     <select className="bg-white/60 text-ink border border-bamboo/20 rounded-xl px-4 py-2 outline-none focus:border-hanko w-full md:w-64" value={selectedCounterGroup} onChange={(e) => setSelectedCounterGroup(e.target.value)}>{COUNTER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
            )}
            {activeSection === 'number' && (
                <div className="flex items-center gap-4">
                     <span className="text-bamboo font-bold uppercase tracking-widest text-sm">Category</span>
                     <select className="bg-white/60 text-ink border border-bamboo/20 rounded-xl px-4 py-2 outline-none focus:border-hanko w-full md:w-64" value={selectedNumberGroup} onChange={(e) => setSelectedNumberGroup(e.target.value)}>{NUMBER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
            )}
        </GlassCard>

        {viewMode === 'list' && (
            <div className={`grid gap-4 ${activeSection === 'kana' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {currentContent.map((item) => (
                    <GlassCard key={item.id} className="relative group hover:border-hanko/30 transition-all cursor-pointer overflow-hidden hover:-translate-y-1" onClick={() => speak(item.ja)}>
                        
                        {/* Pronunciation Guide Overlay for Kana */}
                        {activeSection === 'kana' && (
                            <div className="absolute inset-0 bg-ink/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 backdrop-blur-[2px]">
                                <Volume2 className="text-straw mb-2 animate-bounce" size={24} />
                                <p className="text-white font-bold text-lg capitalize">{item.romaji}</p>
                                <p className="text-[10px] text-bamboo uppercase tracking-widest mt-1">Pronunciation</p>
                            </div>
                        )}

                        <div className="absolute top-4 right-4 text-xs text-bamboo/60 uppercase tracking-widest font-bold border border-bamboo/10 px-2 py-0.5 rounded">{item.type}</div>
                        <div className="text-3xl font-jp font-bold text-ink mb-2 relative z-10">{item.ja}</div>
                        <div className={`font-medium mb-3 relative z-10 ${activeSection === 'synonym' || activeSection === 'antonym' ? 'text-xl text-straw font-jp' : 'text-hanko'}`}>{item.romaji}</div>
                        <div className="pt-3 border-t border-bamboo/10 relative z-10">
                            <p className="text-ink/80">{item.en}</p>
                            {item.bn && <p className="text-xs text-bamboo mt-1">🇧🇩 {item.bn}</p>}
                            {item.usage && <p className="text-xs text-bamboo mt-2 bg-bamboo/5 p-2 rounded italic">Ex: {item.usage}</p>}
                        </div>
                    </GlassCard>
                ))}
                {currentContent.length === 0 && <div className="col-span-full text-center py-12 text-bamboo">No content found for this selection.</div>}
            </div>
        )}

        {viewMode === 'flashcard' && <FlashcardView items={currentContent} />}
        {viewMode === 'quiz' && <QuizView items={currentContent} difficulty={difficulty} onComplete={handleLessonComplete} />}
        {viewMode === 'particle' && <QuizView items={currentContent} difficulty={difficulty} customMode="particle" onComplete={handleLessonComplete} />}
        {viewMode === 'match' && <MemoryMatchGame items={currentContent} onExit={() => setViewMode('games')} />}
        {viewMode === 'typing' && <TypingMasterGame items={currentContent} onExit={() => setViewMode('games')} />}
        {viewMode === 'builder' && <SentenceBuilderView items={currentContent} difficulty={difficulty} />}
        {viewMode === 'math' && <MathChallengeView difficulty={difficulty} />}
        {viewMode === 'matrix' && <MatrixSearchView items={currentContent} difficulty={difficulty} />}
        {viewMode === 'scramble' && <WordScrambleView items={currentContent} difficulty={difficulty} />}
        {viewMode === 'story' && <LessonStoryView items={currentContent} />}
        {viewMode === 'games' && <GameArcade section={activeSection} onSelectGame={setViewMode} />}
    </div>
  );
};