import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { 
    BookOpen, ArrowLeft, ArrowRight, Hash, Scale, Copy, ArrowRightLeft, 
    Languages, Book, Layers, HelpCircle, Gamepad2, RotateCw, 
    CheckCircle, XCircle, Trophy, Grid, Bookmark, Volume2, Keyboard,
    Calculator, PenTool, Shuffle, Timer, Heart, Move, Zap, Wand2, RefreshCw, Square, MessageCircle,
    Smartphone, Globe, Wifi, ExternalLink, Frown, ThumbsDown, Play, SortAsc, X, Info, Rocket, Flame,
    Target, MousePointer, Search, LayoutGrid, ListOrdered, Skull, Crosshair, Eye, Music,
    Ear, Briefcase, Coffee, Pause, Pen, Loader2
} from 'lucide-react';
import { 
    VOCAB_DATA, KANA_DATA, KANJI_DATA, GRAMMAR_DATA, 
    COUNTER_DATA, NUMBER_DATA, SYNONYM_DATA, ANTONYM_DATA,
    COUNTER_CATEGORIES, NUMBER_CATEGORIES, CONVERSATION_DATA,
    LISTENING_DATA, FORMAL_INFORMAL_DATA
} from '../data/mockContent';
import { LearningItem, StoryContent, ConversationTopic, SongContent } from '../types';
import { progressService } from '../services/progressService';
import { aiService } from '../services/aiService';
import { useSettings } from '../contexts/SettingsContext';

// --- TYPES & UTILS ---

type Difficulty = 'easy' | 'medium' | 'hard';
type SectionType = 'kana' | 'vocab' | 'kanji' | 'grammar' | 'counter' | 'number' | 'synonym' | 'antonym' | 'conversation' | 'listening' | 'formal_informal';
type ViewMode = 'list' | 'flashcard' | 'quiz' | 'match' | 'typing' | 'matrix' | 'scramble' | 'builder' | 'particle' | 'math' | 'story' | 'song' | 'conversation' | 'listening_drill' | 'games';
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

// Equalizer Component for Music Mode
const Equalizer: React.FC = () => (
    <div className="flex items-end justify-center gap-1 h-12 mb-4">
        {[...Array(8)].map((_, i) => (
            <div 
                key={i} 
                className="w-2 bg-hanko rounded-t-sm animate-pulse"
                style={{ 
                    height: `${Math.random() * 100}%`,
                    animationDuration: `${0.4 + Math.random() * 0.4}s` 
                }}
            />
        ))}
    </div>
);

// --- KANJI ANIMATED CARD COMPONENT ---

const KanjiCard: React.FC<{ item: LearningItem }> = ({ item }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [paths, setPaths] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentStroke, setCurrentStroke] = useState(-1);
    const { speak } = useSettings();
    const timerRef = useRef<number | null>(null);

    const stopAnimation = () => {
        setIsAnimating(false);
        setCurrentStroke(-1);
        if (timerRef.current) window.clearTimeout(timerRef.current);
    };

    const startAnimation = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAnimating) {
            stopAnimation();
            return;
        }

        setLoading(true);
        setIsAnimating(true);
        try {
            // Convert character to Unicode hex code for KanjiVG
            const hex = item.ja.charCodeAt(0).toString(16).toLowerCase().padStart(5, '0');
            const response = await fetch(`https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`);
            if (!response.ok) throw new Error("Character not found in KanjiVG");
            const text = await response.text();
            
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "image/svg+xml");
            const pathElements = Array.from(xmlDoc.querySelectorAll('path'));
            const dPaths = pathElements.map(p => p.getAttribute('d') || '');
            setPaths(dPaths);
            
            // Start the stroke sequence
            let step = 0;
            const play = () => {
                if (step >= dPaths.length) {
                    // Loop animation after a delay
                    timerRef.current = window.setTimeout(() => {
                        setCurrentStroke(-1);
                        step = 0;
                        play();
                    }, 1500);
                    return;
                }
                setCurrentStroke(step);
                step++;
                timerRef.current = window.setTimeout(play, 800); // Wait for path animation to finish
            };
            play();
        } catch (e) {
            console.error("Stroke data error:", e);
            setIsAnimating(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
    }, []);

    return (
        <GlassCard 
            className="relative group hover:border-hanko/30 transition-all cursor-pointer overflow-hidden hover:-translate-y-1 h-full flex flex-col"
            onClick={() => speak(item.ja)}
        >
            {/* Stroke Icon Overlay */}
            <div className="absolute top-3 right-3 flex gap-2 z-20">
                <button 
                    onClick={startAnimation}
                    className={`p-2 rounded-lg transition-all shadow-sm ${isAnimating ? 'bg-hanko text-white' : 'bg-white/80 text-bamboo hover:text-hanko'}`}
                    title="Play Stroke Order"
                >
                    {isAnimating ? <X size={14} /> : <Pen size={14} />}
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-6 min-h-[160px]">
                {isAnimating ? (
                    <div className="w-24 h-24 relative flex items-center justify-center bg-rice/50 rounded-2xl border border-bamboo/10 shadow-inner">
                        {loading ? (
                            <RefreshCw size={24} className="text-hanko animate-spin" />
                        ) : (
                            <svg viewBox="0 0 109 109" className="w-full h-full p-2">
                                {/* Ghost character (faded reference) */}
                                {paths.map((d, i) => (
                                    <path key={`g-${i}`} d={d} fill="none" stroke="#e0c097" strokeWidth="3" strokeLinecap="round" opacity="0.1" />
                                ))}
                                {/* Active drawing strokes */}
                                {paths.map((d, i) => (
                                    <path
                                        key={`s-${i}`}
                                        d={d}
                                        fill="none"
                                        stroke={i === currentStroke ? '#c93a40' : '#2c2421'}
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        style={{
                                            display: i <= currentStroke ? 'block' : 'none',
                                            strokeDasharray: '1000',
                                            strokeDashoffset: i === currentStroke ? '1000' : '0',
                                            animation: i === currentStroke ? 'draw-stroke 0.8s forwards linear' : 'none',
                                            opacity: i < currentStroke ? 0.6 : 1
                                        }}
                                    />
                                ))}
                            </svg>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="text-7xl font-jp font-bold text-ink mb-2 drop-shadow-sm transition-transform group-hover:scale-110">{item.ja}</div>
                        <div className="text-xs font-bold text-hanko uppercase tracking-widest bg-hanko/5 px-2 py-0.5 rounded-full">{item.romaji}</div>
                    </>
                )}
            </div>

            <div className="pt-3 border-t border-bamboo/10 mt-auto text-center pb-1">
                <p className="text-sm font-bold text-ink/80">{item.en}</p>
                {item.bn && <p className="text-[10px] text-bamboo mt-1 font-medium italic">🇧🇩 {item.bn}</p>}
            </div>

            <style>{`
                @keyframes draw-stroke {
                    from { stroke-dashoffset: 1000; }
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </GlassCard>
    );
};

// --- VOCAB PRACTICE CARD COMPONENT ---

const VocabPracticeCard: React.FC<{ item: LearningItem }> = ({ item }) => {
    const [isPracticing, setIsPracticing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sentences, setSentences] = useState<{ja: string, ro: string, en: string}[]>([]);
    const { speak } = useSettings();

    const startPractice = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPracticing(true);
        setLoading(true);
        try {
            const data = await aiService.generateSentences(item.ja);
            setSentences(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const stopPractice = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPracticing(false);
        setSentences([]);
    };

    return (
        <GlassCard 
            key={item.id} 
            className={`relative group border-white transition-all duration-300 cursor-pointer overflow-hidden transform active:scale-95 ${isPracticing ? 'col-span-full md:col-span-1 lg:col-span-2 min-h-[300px]' : 'hover:-translate-y-1.5 shadow-sm hover:shadow-xl'}`}
            onClick={(e) => !isPracticing ? startPractice(e) : speak(item.ja)}
        >
            {isPracticing ? (
                <div className="flex flex-col h-full animate-fade-in">
                    <div className="flex justify-between items-center mb-6 border-b border-bamboo/10 pb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-jp font-bold text-hanko">{item.ja}</span>
                            <Badge color="bg-hanko/10 text-hanko border-hanko/20">Practice Mode</Badge>
                        </div>
                        <button 
                            onClick={stopPractice}
                            className="p-2 bg-rice hover:bg-white text-bamboo hover:text-hanko rounded-full border border-bamboo/10 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-10">
                            <Loader2 className="animate-spin text-hanko mb-4" size={48} />
                            <p className="text-bamboo font-medium">Creating 5 easy sentences for you...</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {sentences.map((s, i) => (
                                <div key={i} className="p-4 bg-white/60 rounded-2xl border border-bamboo/10 hover:border-hanko/20 transition-colors group/sentence">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-xl font-jp font-bold text-ink mb-1">{s.ja}</p>
                                            <p className="text-xs text-hanko font-medium mb-1">{s.ro}</p>
                                            <p className="text-sm text-bamboo italic">{s.en}</p>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); speak(s.ja); }}
                                            className="p-2 text-bamboo hover:text-hanko opacity-0 group-hover/sentence:opacity-100 transition-opacity"
                                        >
                                            <Volume2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all pointer-events-none bg-hanko/10 text-hanko px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Practice sentences</div>
                    <div className="pt-2">
                        <div className="text-4xl font-jp font-bold text-ink mb-2 relative z-10">{item.ja}</div>
                        <div className="font-mono text-lg mb-3 relative z-10 text-bamboo/60 uppercase tracking-widest">{item.romaji}</div>
                    </div>
                    
                    <div className="pt-4 border-t border-bamboo/5 relative z-10">
                        <p className="text-ink/80 font-medium leading-tight">{item.en}</p>
                        {item.bn && <p className="text-xs text-bamboo mt-2 italic font-serif">🇧🇩 {item.bn}</p>}
                        {item.usage && <p className="text-[11px] text-bamboo mt-3 bg-rice/50 p-2.5 rounded-lg border border-bamboo/5 leading-relaxed">Ex: <span className="text-ink/70 font-jp">{item.usage}</span></p>}
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-hanko/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </>
            )}
        </GlassCard>
    );
};

// --- GAME COMPONENTS ---

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

    if (matched.length === cards.length && cards.length > 0) {
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
            if (newLives <= 0) { endGame(); return 0; }
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

    useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

    const check = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!current) return;
        if (!current.romaji.toLowerCase().startsWith(val.toLowerCase())) {
            setIsShaking(true);
            playSound('click');
            setTimeout(() => setIsShaking(false), 200);
            return;
        }
        setInput(val);
        if (val.toLowerCase() === current.romaji.toLowerCase()) {
            if (timerRef.current) clearInterval(timerRef.current);
            playSound('hit');
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
                        <button key={d} onClick={() => setDifficulty(d)} className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest transition-all ${difficulty === d ? 'bg-hanko text-white shadow-lg scale-105' : 'bg-white border border-bamboo/20 text-bamboo hover:bg-rice'}`}>{d}</button>
                    ))}
                </div>
                <Button onClick={startGame} className="w-full py-4 text-xl shadow-xl">Start Game <Play size={20} className="ml-2" /></Button>
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
                <div className="flex flex-col items-start"><span className="text-xs text-bamboo font-bold uppercase tracking-widest">Score</span><span className="text-2xl font-mono font-bold text-ink">{score}</span></div>
                <div className="flex gap-1">{[...Array(3)].map((_, i) => (<Heart key={i} size={24} className={`${i < lives ? 'text-hanko fill-hanko' : 'text-bamboo/20 fill-bamboo/20'} transition-colors`} />))}</div>
            </div>
            <div className="w-full h-2 bg-bamboo/10 rounded-full mb-8 overflow-hidden"><div className={`h-full transition-all duration-100 ease-linear ${timeLeft < 30 ? 'bg-hanko' : timeLeft < 60 ? 'bg-straw' : 'bg-green-50'}`} style={{ width: `${timeLeft}%` }}></div></div>
            {current && (
                <div className="relative mb-8">
                    {feedback && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 text-3xl font-bold text-straw animate-float-slow opacity-0 z-20" style={{ animation: 'pop 0.5s forwards' }}>{feedback}</div>}
                    <div className="text-xs text-bamboo font-bold uppercase tracking-widest mb-2 border border-bamboo/20 rounded-full px-3 py-1 inline-block">Type the Romaji</div>
                    <div className={`text-7xl md:text-8xl font-bold text-ink mb-4 font-jp transition-transform ${isShaking ? 'animate-shake text-hanko' : ''}`} key={current.id}>{current.ja}</div>
                    {difficulty === 'easy' && <div className="text-bamboo text-sm mb-4 font-medium">{current.en}</div>}
                    <div className="relative"><input autoFocus value={input} onChange={check} className={`w-full text-center text-3xl p-4 border-b-2 bg-transparent focus:outline-none transition-colors font-mono tracking-widest ${isShaking ? 'border-hanko text-hanko' : 'border-bamboo/30 text-ink focus:border-hanko'}`} placeholder="..." /><div className="absolute right-0 top-1/2 -translate-y-1/2 text-bamboo/20"><Crosshair size={24} /></div></div>
                </div>
            )}
            <div className="flex justify-between items-center text-xs font-bold text-bamboo uppercase tracking-widest mt-8"><span>Streak: {streak} 🔥</span><button onClick={onExit} className="hover:text-hanko transition-colors">Exit Game</button></div>
        </div>
    );
};

// ... (LessonStoryView, LessonSongView, ListeningDrillView, FlashcardView remain same)

const LessonStoryView: React.FC<{ items: LearningItem[] }> = ({ items }) => {
    const { speak, isSpeaking, isPaused, pauseAudio, resumeAudio, stopAudio } = useSettings();
    const [story, setStory] = useState<StoryContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [showTranslation, setShowTranslation] = useState<'none' | 'en' | 'bn'>('none');
    const [readingActive, setReadingActive] = useState(false);

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

    const handleRead = async () => {
        if (!story) return;
        setReadingActive(true);
        await speak(story.japanese);
        setReadingActive(false);
    };

    const handleStop = () => {
        stopAudio();
        setReadingActive(false);
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
                    <div className="flex gap-2 items-center">
                        {readingActive ? (
                            <>
                                {isPaused ? (
                                    <Button variant="secondary" size="sm" onClick={resumeAudio} title="Resume">
                                        <Play size={16} fill="currentColor" />
                                    </Button>
                                ) : (
                                    <Button variant="secondary" size="sm" onClick={pauseAudio} title="Pause">
                                        <Pause size={16} fill="currentColor" />
                                    </Button>
                                )}
                                <Button variant="danger" size="sm" onClick={handleStop} title="Stop">
                                    <Square size={16} fill="currentColor" />
                                </Button>
                            </>
                        ) : (
                            <Button variant="secondary" size="sm" onClick={handleRead} title="Read Aloud">
                                <Volume2 size={16} />
                            </Button>
                        )}
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

const LessonSongView: React.FC<{ items: LearningItem[] }> = ({ items }) => {
    const { speak, stopAudio, pauseAudio, resumeAudio, isPaused } = useSettings();
    const [song, setSong] = useState<SongContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    
    // Refs for playback control
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isPlayingRef = useRef(false);

    // Clean up on unmount
    useEffect(() => {
        return () => stopSong();
    }, []);

    const generateSong = async () => {
        setLoading(true);
        try {
            const result = await aiService.generateSong(items);
            setSong(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const stopSong = () => {
        setIsPlaying(false);
        isPlayingRef.current = false;
        setCurrentLineIndex(-1);
        
        // Stop Speech
        stopAudio();
        
        // Stop Music
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    const handlePause = () => {
        pauseAudio();
        if (audioRef.current) audioRef.current.pause();
    };

    const handleResume = () => {
        resumeAudio();
        if (audioRef.current) audioRef.current.play();
    };

    const singSong = async () => {
        if (!song || isPlaying) return;
        setIsPlaying(true);
        isPlayingRef.current = true;

        // 1. Initialize & Start Music (Instrumental Track)
        if (!audioRef.current) {
            // Using a royalty-free upbeat instrumental track for the "Song" feel
            audioRef.current = new Audio('https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.ogg'); 
            audioRef.current.volume = 0.2; // Keep background music lower than voice
            audioRef.current.loop = true;
        }

        try {
            await audioRef.current.play();
        } catch (e) {
            console.warn("Audio play blocked (needs interaction)", e);
        }
        
        // 2. Iterate Lyrics with proper synchronization
        for (let i = 0; i < song.lyrics.length; i++) {
            if (!isPlayingRef.current) break; // Check cancel flag
            
            setCurrentLineIndex(i);
            const line = song.lyrics[i];
            
            // Speak the line - wait for it to finish
            // The speech system now supports pausing natively via context
            await speak(line.kana);
            
            // Brief pause between lines
            await new Promise(r => setTimeout(r, 600));
        }

        // 3. Finish
        stopSong();
    };

    if (loading) {
        return (
            <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
                <Music size={48} className="text-hanko animate-bounce mb-4" />
                <h3 className="text-xl font-bold text-ink">Composing a masterpiece...</h3>
                <p className="text-bamboo">Finding the rhythm for {items.length} words.</p>
            </GlassCard>
        );
    }

    if (!song) {
        return (
            <GlassCard className="text-center py-16">
                <Music size={64} className="mx-auto text-bamboo mb-6" />
                <h2 className="text-3xl font-bold text-ink mb-2 font-serif">AI Song Generator</h2>
                <p className="text-bamboo mb-8 max-w-md mx-auto">
                    Turn your vocabulary list into a catchy song! 
                    Lyrics will be in Hiragana/Katakana to help you practice reading.
                </p>
                <Button onClick={generateSong} size="lg">
                    <Wand2 size={20} className="mr-2" /> Create Song
                </Button>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
            <GlassCard className="border-hanko/10 bg-white/70 backdrop-blur-xl relative overflow-hidden">
                {/* Visualizer Background */}
                {isPlaying && !isPaused && (
                    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-end justify-around px-10 pb-10">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="w-4 bg-hanko animate-pulse" style={{ height: `${Math.random() * 80 + 20}%`, animationDuration: `${0.2 + Math.random()}s` }} />
                        ))}
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-bamboo/10 pb-6 gap-4 relative z-10">
                    <div className="text-center md:text-left">
                        <Badge color="bg-purple-100 text-purple-700 border-purple-200 mb-2 inline-block">{song.genre}</Badge>
                        <h2 className="text-4xl font-bold text-ink font-jp">{song.title}</h2>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                        {isPlaying && !isPaused && <Equalizer />}
                        <div className="flex gap-3">
                            {isPlaying ? (
                                <>
                                    {isPaused ? (
                                        <Button onClick={handleResume} className="shadow-hanko/30"><Play size={18} fill="currentColor" /> Resume</Button>
                                    ) : (
                                        <Button variant="secondary" onClick={handlePause} className="animate-pulse"><Pause size={18} fill="currentColor" /> Pause</Button>
                                    )}
                                    <Button variant="danger" onClick={stopSong} className="shadow-red-200"><Square size={18} fill="currentColor" /> Stop</Button>
                                </>
                            ) : (
                                <Button onClick={singSong} className="shadow-hanko/30"><Play size={18} fill="currentColor" /> Play Song</Button>
                            )}
                            <Button variant="secondary" onClick={() => setSong(null)}><RefreshCw size={18} /></Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 relative z-10 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {song.lyrics.map((line, i) => (
                        <div 
                            key={i} 
                            className={`text-center p-4 rounded-xl transition-all duration-500 
                                ${currentLineIndex === i 
                                    ? 'bg-hanko/10 scale-105 border border-hanko/20 shadow-lg' 
                                    : 'hover:bg-white/40 opacity-70 hover:opacity-100'}
                            `}
                        >
                            <p className={`text-3xl md:text-4xl font-jp font-bold mb-2 leading-relaxed text-shadow-sm transition-colors ${currentLineIndex === i ? 'text-hanko' : 'text-ink'}`}>
                                {line.kana}
                            </p>
                            <p className="text-bamboo/80 font-medium text-lg mb-2">{line.romaji}</p>
                            <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 text-sm text-bamboo/60">
                                <span className="italic">🇬🇧 {line.en}</span>
                                <span className="hidden md:inline text-bamboo/30">•</span>
                                <span>🇧🇩 {line.bn}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};

const ListeningDrillView: React.FC<{ items: LearningItem[] }> = ({ items }) => {
    const { speak, playSound } = useSettings();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setIsRevealed(false);
    }, [currentIndex]);

    const handlePlay = () => {
        setIsPlaying(true);
        speak(items[currentIndex].ja);
        setTimeout(() => setIsPlaying(false), 2000); // Reset state after approx speech
    };

    const handleNext = () => {
        if (currentIndex < items.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Loop back or finish
            setCurrentIndex(0);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" onClick={handlePrev} disabled={currentIndex === 0}><ArrowLeft size={18} /></Button>
                <div className="text-sm font-bold text-bamboo">Item {currentIndex + 1} / {items.length}</div>
                <Button variant="ghost" onClick={handleNext}><ArrowRight size={18} /></Button>
            </div>

            <GlassCard className="py-16 text-center flex flex-col items-center justify-center relative overflow-hidden">
                <div className={`p-8 rounded-full bg-hanko/10 text-hanko mb-8 cursor-pointer hover:scale-110 transition-transform ${isPlaying ? 'animate-pulse' : ''}`} onClick={handlePlay}>
                    <Ear size={64} />
                </div>
                
                <p className="text-bamboo mb-8 text-sm">Click the ear icon to listen</p>

                {isRevealed ? (
                    <div className="animate-pop space-y-4">
                        <h2 className="text-4xl font-bold text-ink font-jp">{items[currentIndex].ja}</h2>
                        <p className="text-xl text-hanko">{items[currentIndex].romaji}</p>
                        <p className="text-bamboo italic">{items[currentIndex].en}</p>
                    </div>
                ) : (
                    <Button onClick={() => setIsRevealed(true)} variant="secondary" className="px-8">
                        <Eye size={18} /> Reveal Answer
                    </Button>
                )}
            </GlassCard>
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
            // Auto-sound removed per request
            // setTimeout(() => systemSpeak(current.ja), 300);
        }
        setFlipped(prev => !prev);
    }, [flipped, playSound, current]);

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
        const deck = [...items].sort(() => 0.5 - Math.random()); 
        const qs = deck.map(item => {
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
            const hasBangla = !!item.bn;
            const modes = ['ja_en', 'en_ja'];
            if (hasBangla) { modes.push('ja_bn', 'bn_ja'); }
            const mode = modes[Math.floor(Math.random() * modes.length)];
            let questionText, correctText, optionsPool;
            if (mode === 'ja_bn') {
                questionText = item.ja;
                correctText = item.bn!;
                optionsPool = deck.filter(i => i.id !== item.id && i.bn).map(i => i.bn!);
            } else if (mode === 'bn_ja') {
                questionText = item.bn!;
                correctText = item.ja;
                optionsPool = deck.filter(i => i.id !== item.id).map(i => i.ja);
            } else if (mode === 'en_ja') {
                questionText = item.en;
                correctText = item.ja;
                optionsPool = deck.filter(i => i.id !== item.id).map(i => i.ja);
            } else {
                questionText = item.ja;
                correctText = item.en;
                optionsPool = deck.filter(i => i.id !== item.id).map(i => i.en);
            }
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
                if (prev <= 1) { handleAnswer('__TIMEOUT__'); return 0; }
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
            progressService.addXP(10);
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
                    <Button key={i} variant="secondary" onClick={() => handleAnswer(opt)} disabled={!!feedback} className="py-5 text-lg hover:bg-rice font-jp shadow-sm">{opt}</Button>
                ))}
            </div>
        </div>
    );
};

// ... (Rest of missing components stubs remain same)

const SentenceBuilderView: React.FC<{ items: LearningItem[]; difficulty: Difficulty }> = () => <div className="p-8 text-center text-bamboo">Sentence Builder Game - Coming Soon!</div>;
const MathChallengeView: React.FC<{ difficulty: Difficulty }> = () => <div className="p-8 text-center text-bamboo">Math Challenge - Coming Soon!</div>;
const MatrixSearchView: React.FC<{ items: LearningItem[]; difficulty: Difficulty }> = () => <div className="p-8 text-center text-bamboo">Matrix Search - Coming Soon!</div>;
const WordScrambleView: React.FC<{ items: LearningItem[]; difficulty: Difficulty }> = () => <div className="p-8 text-center text-bamboo">Word Scramble - Coming Soon!</div>;
const GameArcade: React.FC<{ section: SectionType | null; onSelectGame: (mode: ViewMode) => void }> = ({ onSelectGame }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard hoverEffect onClick={() => onSelectGame('match')} className="cursor-pointer">
            <h3 className="text-xl font-bold text-ink">Memory Match</h3>
            <p className="text-bamboo">Find the matching pairs.</p>
        </GlassCard>
        <GlassCard hoverEffect onClick={() => onSelectGame('typing')} className="cursor-pointer">
            <h3 className="text-xl font-bold text-ink">Typing Master</h3>
            <p className="text-bamboo">Type the Romaji quickly.</p>
        </GlassCard>
    </div>
);
const ConversationDetailView: React.FC<{ topic: ConversationTopic; onBack: () => void }> = ({ topic, onBack }) => {
    const { speak } = useSettings();
    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={onBack}><ArrowLeft size={18} /> Back to Topics</Button>
            <div className="border-b border-bamboo/10 pb-4">
                <h2 className="text-3xl font-bold text-ink">{topic.title}</h2>
                <p className="text-xl text-hanko">{topic.jpTitle}</p>
            </div>
            <div className="space-y-4">
                {topic.lines.map((line, i) => (
                    <div key={i} className={`flex gap-4 ${line.speaker === 'B' ? 'flex-row-reverse' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-rice flex items-center justify-center font-bold text-ink border border-bamboo/20 shrink-0">
                            {line.speaker}
                        </div>
                        <div className={`p-4 rounded-2xl max-w-[80%] ${line.speaker === 'B' ? 'bg-hanko/10 border-hanko/20' : 'bg-white border-bamboo/10'} border cursor-pointer hover:shadow-md transition-shadow`} onClick={() => speak(line.ja)}>
                            <p className="text-lg font-bold text-ink mb-1">{line.ja}</p>
                            <p className="text-sm text-hanko mb-1">{line.romaji}</p>
                            <p className="text-sm text-bamboo italic">{line.en}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const LearningHub: React.FC = () => {
    // Helper Data
    const uniqueVocabCats = Array.from(new Set(VOCAB_DATA.map(v => v.category))).filter(Boolean) as string[];
    const uniqueKanjiCats = Array.from(new Set(KANJI_DATA.map(v => v.category))).filter(Boolean) as string[];
    // FIX: Filter out undefined lessons and ensure type safety for sorting
    const uniqueLessons = Array.from(new Set(VOCAB_DATA.map(v => v.lesson)))
        .filter((l): l is number => typeof l === 'number')
        .sort((a,b) => a - b);

    // State
    const [activeSection, setActiveSection] = useState<SectionType | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    
    // Filters
    const [kanaSystem, setKanaSystem] = useState<'Hiragana' | 'Katakana' | 'Mixed'>('Hiragana');
    const [kanaVar, setKanaVar] = useState<'basic' | 'dakuten' | 'youon'>('basic');
    const [lessonMode, setLessonMode] = useState<'lesson' | 'category'>('lesson');
    const [selectedLesson, setSelectedLesson] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(uniqueVocabCats[0] || 'People');
    const [selectedCounterGroup, setSelectedCounterGroup] = useState(COUNTER_CATEGORIES[0]);
    const [selectedNumberGroup, setSelectedNumberGroup] = useState(NUMBER_CATEGORIES[0]);
    
    // Playback
    const [sortMethod, setSortMethod] = useState<SortMethod>('default');
    const [isPlayingAll, setIsPlayingAll] = useState(false);
    
    // Conversation
    const [selectedConversation, setSelectedConversation] = useState<ConversationTopic | null>(null);

    // Data
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    
    // Context
    const { speak, isPaused, pauseAudio, resumeAudio, stopAudio } = useSettings();

    useEffect(() => {
        setCompletedLessons(progressService.getCompletedLessons());
    }, []);

    // Cleanup playback on unmount or mode switch
    useEffect(() => {
        return () => {
            if (isPlayingAll) {
                stopAudio();
                setIsPlayingAll(false);
            }
        };
    }, [viewMode, activeSection]);

    const handleLessonComplete = (score: number, total: number) => {
        if (score / total >= 0.8) {
             // Mark lesson complete
             if (activeSection === 'grammar') progressService.markLessonComplete(`grammar-lesson-${selectedLesson}`);
             if (activeSection === 'vocab' && lessonMode === 'lesson') progressService.markLessonComplete(`vocab-lesson-${selectedLesson}`);
             setCompletedLessons(progressService.getCompletedLessons());
        }
    };

    const getContent = () => {
        let items: LearningItem[] = [];
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
            case 'listening': items = LISTENING_DATA; break;
            case 'formal_informal': items = FORMAL_INFORMAL_DATA; break;
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
        } else if (activeSection === 'listening') {
            setViewMode('listening_drill');
        } else {
            setViewMode('list'); 
        }
    }, [activeSection]);
  
    // Playback Logic
    const isPlayingRef = useRef(false);
    const isPausedRef = useRef(false);

    useEffect(() => { isPlayingRef.current = isPlayingAll; }, [isPlayingAll]);
    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

    const handlePlayAll = async () => {
        if (isPlayingAll) {
            stopAudio();
            setIsPlayingAll(false);
            return;
        }
  
        setIsPlayingAll(true);
        
        for (const item of currentContent) {
            if (!isPlayingRef.current) break;
            
            // Wait while paused
            while (isPausedRef.current && isPlayingRef.current) {
                await new Promise(r => setTimeout(r, 200));
            }
            if (!isPlayingRef.current) break;

            await speak(item.ja);
            
            // Wait while paused (check again after speaking)
            while (isPausedRef.current && isPlayingRef.current) {
                await new Promise(r => setTimeout(r, 200));
            }
            if (!isPlayingRef.current) break;

            // Gap between words
            await new Promise(r => setTimeout(r, 1500)); 
        }
        setIsPlayingAll(false);
    };
    
    // Define games per section
    const getAvailableModes = () => {
        const base = [
            { id: 'list', label: 'List', icon: BookOpen },
            { id: 'flashcard', label: 'Flashcards', icon: Layers },
            { id: 'quiz', label: 'Quiz', icon: HelpCircle },
        ];
  
        if (activeSection === 'conversation') return []; // Handled separately
        if (activeSection === 'listening') return []; // Dedicated view
  
        // Add Story & Song Generator for Vocab/Kanji
        if (['vocab', 'kanji'].includes(activeSection || '')) {
            base.push({ id: 'story', label: 'Story Generator', icon: Wand2 });
            base.push({ id: 'song', label: 'AI Song Generator', icon: Music });
        }
  
        // Add Universal Games Tab to ALL sections
        return [
            ...base,
            { id: 'games', label: 'Games Arcade', icon: Gamepad2 }
        ];
    };
    
    // Helper to check completion
    const isComplete = (id: string) => completedLessons.includes(id);

    // --- MAIN MENU RENDER ---
    if (!activeSection) {
        const menus = [
            { id: 'kana', title: 'Hiragana & Katakana', desc: 'The foundation of Japanese writing.', icon: Languages, color: 'text-hanko', bg: 'bg-hanko/10', border: 'border-hanko/20' },
            { id: 'listening', title: 'Listening Practice', desc: 'Train your ears with native audio.', icon: Ear, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' },
            { id: 'conversation', title: 'Conversation Dojo', desc: 'Real-life scenarios & dialogues.', icon: MessageCircle, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
            { id: 'formal_informal', title: 'Formal vs Informal', desc: 'Polite (Desu/Masu) vs Casual forms.', icon: Scale, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' },
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
  
    return (
      <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 border-b border-bamboo/10 pb-4 justify-between">
              <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={() => setActiveSection(null)} className="p-2 h-auto"><ArrowLeft size={20} /></Button>
                  <div>
                      <h1 className="text-2xl font-bold text-ink capitalize font-serif">{activeSection === 'kana' ? 'Kana Systems' : activeSection?.replace('_', ' ')}</h1>
                      <p className="text-sm text-bamboo">Select a game mode</p>
                  </div>
              </div>
              
              {/* Mode Selectors (Hidden for Listening/Conversation) */}
              {activeSection !== 'listening' && (
                  <div className="flex flex-wrap gap-2 bg-white/40 p-1.5 rounded-xl border border-bamboo/10">
                       {getAvailableModes().map(m => (
                           <button key={m.id} onClick={() => setViewMode(m.id as any)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === m.id ? 'bg-hanko text-white shadow-lg' : 'text-bamboo hover:text-hanko hover:bg-white/60'}`}>
                              <m.icon size={16} /> {m.label}
                           </button>
                       ))}
                  </div>
              )}
          </div>
  
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
              
              {/* Sorting & Action Controls */}
              {viewMode === 'list' && activeSection !== 'formal_informal' && (
                  <div className="mt-6 pt-4 border-t border-bamboo/10 flex flex-wrap gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-bamboo/60 tracking-widest mr-2">Sort</span>
                        <div className="flex gap-1.5 p-1 bg-white/40 border border-bamboo/10 rounded-xl">
                            <button 
                                onClick={() => setSortMethod(sortMethod === 'az' ? 'default' : 'az')}
                                className={`p-2 rounded-lg transition-all ${sortMethod === 'az' ? 'bg-hanko text-white shadow-sm' : 'text-bamboo hover:bg-white'}`}
                                title="Sort A-Z"
                            >
                                <SortAsc size={16} />
                            </button>
                            <button 
                                onClick={() => setSortMethod(sortMethod === 'length' ? 'default' : 'length')}
                                className={`p-2 rounded-lg transition-all ${sortMethod === 'length' ? 'bg-hanko text-white shadow-sm' : 'text-bamboo hover:bg-white'}`}
                                title="Sort by Length"
                            >
                                <Scale size={16} />
                            </button>
                            <button 
                                onClick={() => setSortMethod(sortMethod === 'random' ? 'default' : 'random')}
                                className={`p-2 rounded-lg transition-all ${sortMethod === 'random' ? 'bg-hanko text-white shadow-sm' : 'text-bamboo hover:bg-white'}`}
                                title="Randomize"
                            >
                                <Shuffle size={16} />
                            </button>
                            <button 
                                onClick={() => setSortMethod(sortMethod === 'serial' ? 'default' : 'serial')}
                                className={`p-2 rounded-lg transition-all ${sortMethod === 'serial' ? 'bg-hanko text-white shadow-sm' : 'text-bamboo hover:bg-white'}`}
                                title="Serial Order"
                            >
                                <ListOrdered size={16} />
                            </button>
                        </div>
                      </div>
                      
                      <div className="h-8 w-px bg-bamboo/20 hidden md:block"></div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase text-bamboo/60 tracking-widest mr-1">Playback</span>
                        {isPlayingAll ? (
                            <div className="flex gap-2">
                                <Button size="sm" variant="secondary" onClick={() => { pauseAudio(); }}>
                                    <Pause size={14} fill="currentColor" /> Pause
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => { stopAudio(); setIsPlayingAll(false); }}>
                                    <Square size={14} fill="currentColor" /> Stop
                                </Button>
                            </div>
                        ) : (
                            <Button 
                                size="sm" 
                                variant="secondary" 
                                onClick={() => { handlePlayAll(); }}
                                className="group hover:bg-hanko hover:text-white transition-all shadow-sm"
                            >
                                <Volume2 size={16} className="group-hover:animate-pulse" /> Listen All Sequence
                            </Button>
                        )}
                      </div>
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
              {activeSection === 'listening' && (
                  <div className="text-bamboo">
                      Listen to the phrase and guess the meaning.
                  </div>
              )}
              {activeSection === 'formal_informal' && (
                  <div className="text-bamboo">
                      Compare Polite (Desu/Masu) and Casual forms.
                  </div>
              )}
          </GlassCard>
  
          {viewMode === 'listening_drill' && <ListeningDrillView items={currentContent} />}
  
          {viewMode === 'list' && (
              <div className={`grid gap-5 ${activeSection === 'kana' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                  {currentContent.map((item) => (
                      activeSection === 'kanji' ? (
                          <KanjiCard key={item.id} item={item} />
                      ) : activeSection === 'vocab' ? (
                          <VocabPracticeCard key={item.id} item={item} />
                      ) : (
                          <GlassCard 
                            key={item.id} 
                            className={`relative group border-white transition-all duration-300 cursor-pointer overflow-hidden transform active:scale-95 ${activeSection === 'kana' ? 'aspect-square flex flex-col items-center justify-center p-0' : 'hover:-translate-y-1.5 shadow-sm hover:shadow-xl'}`}
                            onClick={() => { speak(item.ja); }}
                          >
                              
                              {/* Pronunciation Guide */}
                              {activeSection === 'kana' && (
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                      <div className="bg-hanko text-white p-1 rounded-lg shadow-sm">
                                          <Volume2 size={12} />
                                      </div>
                                  </div>
                              )}
      
                              {activeSection !== 'kana' && <div className="absolute top-4 right-4 text-[10px] text-bamboo/40 uppercase tracking-widest font-black border border-bamboo/10 px-1.5 py-0.5 rounded pointer-events-none">{item.type.replace('_', ' ')}</div>}
                              
                              {activeSection === 'formal_informal' ? (
                                  <div className="flex gap-4">
                                      <div className="flex-1 border-r border-bamboo/10 pr-4">
                                          <div className="text-xs text-hanko uppercase font-bold mb-1"><Briefcase size={10} className="inline mr-1"/> Polite</div>
                                          <div className="text-xl font-jp font-bold text-ink">{item.ja}</div>
                                      </div>
                                      <div className="flex-1 pl-1">
                                          <div className="text-xs text-bamboo uppercase font-bold mb-1"><Coffee size={10} className="inline mr-1"/> Casual</div>
                                          <div className="text-xl font-jp font-bold text-ink/80">{item.romaji}</div>
                                      </div>
                                  </div>
                              ) : activeSection === 'kana' && kanaSystem === 'Mixed' ? (
                                  <div className="flex flex-col items-center justify-center relative z-10">
                                      <div className="flex items-center justify-center gap-6 transition-transform duration-300 group-hover:scale-110">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-bold text-bamboo uppercase tracking-tighter mb-1 opacity-60">Hiragana</span>
                                            <span className="text-5xl font-jp font-bold text-ink drop-shadow-sm" title="Hiragana">{item.ja.split('　')[0]}</span>
                                        </div>
                                        <div className="w-px h-12 bg-bamboo/20"></div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-bold text-hanko uppercase tracking-tighter mb-1 opacity-60">Katakana</span>
                                            <span className="text-5xl font-jp font-bold text-ink drop-shadow-sm" title="Katakana">{item.ja.split('　')[1]}</span>
                                        </div>
                                      </div>
                                      <div className="mt-4 font-mono text-sm font-bold text-bamboo/40 uppercase tracking-widest">{item.romaji}</div>
                                  </div>
                              ) : activeSection === 'kana' ? (
                                  <div className="relative z-10 flex flex-col items-center">
                                      <div className="text-6xl font-jp font-bold text-ink transition-transform duration-300 group-hover:scale-110 group-hover:text-hanko">{item.ja}</div>
                                      <div className="mt-2 font-mono text-sm font-bold text-bamboo/40 group-hover:text-bamboo/70 uppercase tracking-widest">{item.romaji}</div>
                                  </div>
                              ) : (
                                  <div className="pt-2">
                                      <div className="text-4xl font-jp font-bold text-ink mb-2 relative z-10">{item.ja}</div>
                                      <div className={`font-mono text-lg mb-3 relative z-10 uppercase tracking-widest ${activeSection === 'synonym' || activeSection === 'antonym' ? 'text-xl text-straw font-jp' : 'text-bamboo/60'}`}>{item.romaji}</div>
                                  </div>
                              )}
                              
                              {activeSection !== 'kana' && (
                                  <div className="pt-4 border-t border-bamboo/5 relative z-10">
                                      <p className="text-ink/80 font-medium leading-tight">{item.en}</p>
                                      {item.bn && <p className="text-xs text-bamboo mt-2 italic font-serif">🇧🇩 {item.bn}</p>}
                                      {item.usage && <p className="text-[11px] text-bamboo mt-3 bg-rice/50 p-2.5 rounded-lg border border-bamboo/5 leading-relaxed">Ex: <span className="text-ink/70 font-jp">{item.usage}</span></p>}
                                  </div>
                              )}
    
                              {/* Hover Sheen */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-hanko/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                          </GlassCard>
                      )
                  ))}
                  {currentContent.length === 0 && <div className="col-span-full text-center py-20 text-bamboo bg-white/40 border-2 border-dashed border-bamboo/10 rounded-3xl">No content found for this selection.</div>}
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
          {viewMode === 'song' && <LessonSongView items={currentContent} />}
          {viewMode === 'games' && <GameArcade section={activeSection} onSelectGame={setViewMode} />}
      </div>
    );
};
