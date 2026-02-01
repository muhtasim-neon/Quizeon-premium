import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { 
    BookOpen, ArrowLeft, ArrowRight, Hash, Scale, Copy, ArrowRightLeft, 
    Languages, Book, Layers, HelpCircle, Gamepad2, RotateCw, 
    CheckCircle, XCircle, Trophy, Grid, Bookmark, Volume2, Keyboard,
    Calculator, PenTool, Shuffle, Timer, Heart, Eye, Move, Zap, Sparkles, Frown, ThumbsUp, ThumbsDown,
    SortAsc, SortDesc, Play, Wand2, RefreshCw, Square
} from 'lucide-react';
import { 
    VOCAB_DATA, KANA_DATA, KANJI_DATA, GRAMMAR_DATA, 
    COUNTER_DATA, NUMBER_DATA, SYNONYM_DATA, ANTONYM_DATA,
    COUNTER_CATEGORIES, NUMBER_CATEGORIES
} from '../data/mockContent';
import { LearningItem, StoryContent } from '../types';
import { progressService } from '../services/progressService';
import { aiService } from '../services/aiService';
import { useSettings } from '../contexts/SettingsContext';

// --- TYPES & UTILS ---

type Difficulty = 'easy' | 'medium' | 'hard';
type SectionType = 'kana' | 'vocab' | 'kanji' | 'grammar' | 'counter' | 'number' | 'synonym' | 'antonym';
type ViewMode = 'list' | 'flashcard' | 'quiz' | 'match' | 'typing' | 'matrix' | 'scramble' | 'builder' | 'particle' | 'math' | 'story';
type SortMethod = 'default' | 'az' | 'length' | 'random';

const getDifficultyConfig = (diff: Difficulty) => {
    switch(diff) {
        case 'easy': return { time: 30, lives: 5, options: 3, hint: true };
        case 'medium': return { time: 15, lives: 3, options: 4, hint: false };
        case 'hard': return { time: 5, lives: 1, options: 4, hint: false };
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
        <Frown size={100} className="text-red-500 animate-pulse" />
    </div>
);

// --- SUB-COMPONENTS FOR GAMES ---

const DifficultySelector: React.FC<{ current: Difficulty; onChange: (d: Difficulty) => void }> = ({ current, onChange }) => (
    <div className="flex bg-white/5 p-1 rounded-lg gap-1 mb-6 max-w-sm mx-auto">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <button
                key={d}
                onClick={() => onChange(d)}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                    current === d 
                    ? d === 'easy' ? 'bg-green-500 text-white' : d === 'medium' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-white hover:bg-white/10'
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
                <Wand2 size={48} className="text-primary animate-pulse mb-4" />
                <h3 className="text-xl font-bold text-white">Weaving a story...</h3>
                <p className="text-slate-400">Using {items.length} vocabulary words.</p>
            </GlassCard>
        );
    }

    if (!story) {
        return (
            <GlassCard className="text-center py-12">
                <BookOpen size={64} className="mx-auto text-blue-400 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Lesson Story Generator</h2>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    Generate a unique story using the vocabulary from this lesson. 
                    Great for context-based learning!
                </p>
                <Button onClick={generateStory} className="px-8 py-3 text-lg">
                    <Wand2 size={20} /> Generate Story
                </Button>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <GlassCard className="border-primary/20">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-bold text-white font-jp">{story.title}</h2>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => speak(story.japanese)}><Volume2 size={16} /></Button>
                        <Button variant="secondary" size="sm" onClick={() => setStory(null)}><RefreshCw size={16} /></Button>
                    </div>
                </div>

                <div className="p-6 bg-white/5 rounded-xl border border-white/5 mb-6">
                    <p className="text-2xl leading-relaxed font-jp text-slate-100">{story.japanese}</p>
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
                    <div className="p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-xl text-slate-300 italic animate-fade-in">
                        {story.english}
                    </div>
                )}
                {showTranslation === 'bn' && (
                    <div className="p-4 bg-green-500/10 border-l-4 border-green-500 rounded-r-xl text-slate-300 animate-fade-in">
                        {story.bangla}
                    </div>
                )}
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <GlassCard>
                     <h3 className="font-bold text-white mb-4">Vocabulary Used</h3>
                     <ul className="space-y-2">
                         {story.vocab.map((v, i) => (
                             <li key={i} className="flex justify-between text-sm border-b border-white/5 pb-1">
                                 <span className="text-primary">{v.word}</span>
                                 <span className="text-slate-400">{v.meaning}</span>
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
        if (!flipped) playSound('flip');
        setFlipped(prev => !prev);
    }, [flipped, playSound]);

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

    if (!current) return <div className="text-slate-400 py-10">No items available for flashcards.</div>;

    return (
        <div className="max-w-2xl mx-auto text-center py-4 animate-fade-in relative">
            <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex items-center gap-2">
                     <span className="text-slate-500 dark:text-slate-400 text-sm font-mono">{idx + 1} / {items.length}</span>
                </div>
                <div className="flex gap-2">
                    <Badge className="bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-white/10">{current.category || 'General'}</Badge>
                </div>
            </div>

            <div className="hidden md:flex justify-center gap-4 mb-4 text-xs text-slate-500 bg-white/50 dark:bg-white/5 py-2 rounded-lg mx-auto max-w-sm">
                <span className="flex items-center gap-1"><Keyboard size={12} /> Space: Flip</span>
                <span className="w-px h-3 bg-slate-300 dark:bg-white/10"></span>
                <span className="flex items-center gap-1 text-red-500">Space (Back): Mistake</span>
            </div>

            {/* 3D CARD CONTAINER */}
            <div 
                className="relative w-full aspect-[4/3] md:aspect-[16/9] perspective-[1200px] cursor-pointer group mb-8" 
                onClick={toggleFlip}
            >
                <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
                    
                    {/* --- FRONT FACE --- */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-[32px] p-[1px] bg-gradient-to-br from-white to-slate-100 dark:from-white/20 dark:to-white/0 shadow-2xl shadow-primary/5 hover:scale-[1.02] transition-transform duration-500">
                        <div className="w-full h-full rounded-[31px] bg-white dark:bg-slate-900/40 backdrop-blur-2xl flex flex-col items-center justify-center relative overflow-hidden border border-slate-200 dark:border-white/10">
                            
                            {/* Controls */}
                            <div className="absolute top-6 right-6 flex gap-3 z-20">
                                <button onClick={playAudio} className="p-3 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-all backdrop-blur-md border border-slate-200 dark:border-white/10 hover:scale-110 active:scale-95"><Volume2 size={20} /></button>
                                <button onClick={toggleSave} className={`p-3 rounded-full transition-all backdrop-blur-md border hover:scale-110 active:scale-95 ${isSaved ? 'bg-primary text-white border-primary/50 shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white border-slate-200 dark:border-white/10'}`}><Bookmark size={20} fill={isSaved ? "currentColor" : "none"} /></button>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80 mb-8 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">{current.type}</span>
                                <h2 className="text-7xl md:text-9xl font-jp font-bold text-slate-900 dark:text-white mb-8 drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tracking-tight">
                                    {current.ja}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse flex items-center gap-2 bg-slate-100 dark:bg-black/20 px-4 py-2 rounded-full border border-slate-200 dark:border-white/5">
                                    <RotateCw size={14} /> Tap to flip
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* --- BACK FACE --- */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[32px] p-[1px] bg-gradient-to-br from-green-500/20 to-blue-500/0 shadow-2xl">
                         <div className="w-full h-full rounded-[31px] bg-white dark:bg-slate-900/80 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden p-8 border border-slate-200 dark:border-white/10">
                             
                             <div className="absolute top-6 right-6 flex gap-3 z-20">
                                <button onClick={toggleSave} className={`p-3 rounded-full transition-all backdrop-blur-md border ${isSaved ? 'bg-primary text-white border-primary/50 shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white border-slate-200 dark:border-white/5'}`}><Bookmark size={20} fill={isSaved ? "currentColor" : "none"} /></button>
                            </div>

                            <div className="text-center space-y-6 max-w-lg relative z-10">
                                <div>
                                    <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{current.en}</h3>
                                    <p className="text-2xl text-primary font-medium tracking-wide">{current.romaji}</p>
                                </div>
                                <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-300 dark:via-white/20 to-transparent mx-auto"></div>
                                <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    {current.bn && (
                                        <p className="flex items-center justify-center gap-2 text-lg">
                                            <span className="text-[10px] uppercase font-bold bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded tracking-wider text-slate-500 dark:text-slate-400">BN</span> 
                                            {current.bn}
                                        </p>
                                    )}
                                </div>
                                <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); markUnknown(); }} className="mt-4">
                                     <ThumbsDown size={16} /> Mark as Mistake
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-6">
                <Button variant="secondary" onClick={prevCard} className="w-32 group"> <ArrowLeft size={18} /> Prev </Button>
                <Button onClick={nextCard} className="w-32 group"> Next <ArrowRight size={18} /> </Button>
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
        
        // Use ALL items randomly
        const deck = [...items]; 
        
        const qs = deck.sort(() => 0.5 - Math.random()).map(item => {
            
            // Logic for Particle Master Mode (Grammar Specific)
            if (customMode === 'particle' && item.usage) {
                const particles = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'の', 'も'];
                // Find particles present in the usage example
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

            // Standard Quiz Logic: Mix of JA -> BN and BN/EN -> JA
            const useBanglaQuestion = Math.random() > 0.5;
            const hasBangla = !!item.bn;
            
            let questionText, correctText, optionsPool;
            
            if (useBanglaQuestion && hasBangla) {
                // Q: BN, Options: JA
                questionText = item.bn;
                correctText = item.ja;
                optionsPool = deck.filter(i => i.id !== item.id).map(i => i.ja);
            } else if (!useBanglaQuestion && hasBangla) {
                 // Q: JA, Options: BN
                 questionText = item.ja;
                 correctText = item.bn;
                 optionsPool = deck.filter(i => i.id !== item.id).map(i => i.bn || i.en);
            } else {
                // Fallback to English if no Bangla or random choice
                // Q: JA, Options: EN
                if (Math.random() > 0.5) {
                    questionText = item.ja;
                    correctText = item.en;
                    optionsPool = deck.filter(i => i.id !== item.id).map(i => i.en);
                } else {
                    // Q: EN, Options: JA
                    questionText = item.en;
                    correctText = item.ja;
                    optionsPool = deck.filter(i => i.id !== item.id).map(i => i.ja);
                }
            }

            const wrongOptions = optionsPool.sort(() => 0.5 - Math.random()).slice(0, config.options - 1);
            
            return {
                question: questionText,
                correct: correctText,
                options: [...wrongOptions, correctText].sort(() => 0.5 - Math.random())
            };
        }).filter(q => q); // Filter out nulls from particle mode if generation failed

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
            
            // Check if game should end due to completion or lives
            if (currentQIndex < questions.length - 1 && (lives > 1 || isCorrect)) {
                setCurrentQIndex(currentQIndex + 1);
                setTimeLeft(config.time);
            } else {
                setShowScore(true);
                // Trigger completion callback if finished all questions
                if (currentQIndex === questions.length - 1 && (lives > 0 || isCorrect)) {
                     // Calculate final score including the last one
                     const finalScore = score + (isCorrect ? 10 : 0);
                     if (onComplete) onComplete(finalScore, questions.length * 10);
                }
            }
        }, 1200);
    };

    if (items.length < 4) return <div className="text-center py-10 text-slate-400">Not enough items to generate a quiz.</div>;
    if (questions.length === 0) return <div className="text-center py-10">Loading Quiz...</div>;

    if (showScore) {
        const percentage = Math.round((score / (questions.length * 10)) * 100);
        const passed = percentage >= 80;

        return (
            <div className="text-center py-12 animate-fade-in relative">
                {passed && <CelebrationOverlay />}
                <Trophy size={64} className={`mx-auto mb-4 ${passed ? 'text-green-500 dark:text-green-400 animate-bounce' : 'text-yellow-400'}`} />
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{lives > 0 ? 'Quiz Completed!' : 'Game Over'}</h2>
                <div className="text-6xl font-bold mb-4 font-mono">
                    <span className={passed ? "text-green-500 dark:text-green-400" : "text-slate-900 dark:text-white"}>{percentage}%</span>
                </div>
                {passed && <div className="inline-block px-4 py-2 bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg mb-6 font-bold border border-green-500/50">Lesson Mastered!</div>}
                <p className="text-slate-500 dark:text-slate-400 mb-6">Score: {score} / {questions.length * 10}</p>
                <Button onClick={() => { setShowScore(false); setCurrentQIndex(0); setScore(0); setLives(config.lives); }}>Retry Quiz</Button>
            </div>
        );
    }

    const currentQ = questions[currentQIndex];

    return (
        <div className="max-w-xl mx-auto py-8 animate-fade-in relative">
            {feedback === 'correct' && <CelebrationOverlay />}
            {feedback === 'wrong' && <SadOverlay />}
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-red-500 dark:text-red-400"><Heart size={18} fill="currentColor" /> {lives}</span>
                    <span className="flex items-center gap-1 text-primary"><Timer size={18} /> {timeLeft}s</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400">Q {currentQIndex + 1}/{questions.length}</span>
            </div>
            
            <GlassCard className={`text-center py-12 mb-6 border-2 transition-all duration-300 ${feedback === 'correct' ? 'border-green-500 bg-green-500/10 scale-105' : feedback === 'wrong' ? 'border-red-500 bg-red-500/10 animate-pulse' : 'border-slate-200 dark:border-white/10'}`}>
                <h2 className="text-4xl font-jp font-bold text-slate-900 dark:text-white mb-4 whitespace-pre-line">{currentQ.question}</h2>
                {feedback === 'correct' && <CheckCircle className="mx-auto text-green-500 animate-bounce" />}
                {feedback === 'wrong' && <XCircle className="mx-auto text-red-500 animate-bounce" />}
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((opt: string, i: number) => (
                    <Button 
                        key={i} 
                        variant="secondary" 
                        onClick={() => handleAnswer(opt)}
                        disabled={!!feedback}
                        className="py-4 text-lg hover:bg-white/20 font-jp"
                    >
                        {opt}
                    </Button>
                ))}
            </div>
        </div>
    );
};

// ... Rest of the components remain similar, assuming standard components follow the pattern above.
// The key update was connecting playSound and speak from useSettings

// --- PLACEHOLDER COMPONENTS FOR MISSING VIEWS ---

const MemoryMatchView: React.FC<{ items: LearningItem[]; difficulty: Difficulty }> = ({ items }) => (
  <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
    <Gamepad2 size={64} className="text-purple-400 mb-4" />
    <h2 className="text-2xl font-bold text-white mb-2">Memory Match</h2>
    <p className="text-slate-400">Feature coming soon...</p>
  </GlassCard>
);

const TypingPracticeView: React.FC<{ items: LearningItem[]; difficulty: Difficulty }> = ({ items }) => (
  <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
    <Keyboard size={64} className="text-blue-400 mb-4" />
    <h2 className="text-2xl font-bold text-white mb-2">Typing Practice</h2>
    <p className="text-slate-400">Feature coming soon...</p>
  </GlassCard>
);

const SentenceBuilderView: React.FC<{ items: LearningItem[]; difficulty: Difficulty }> = ({ items }) => (
  <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
    <PenTool size={64} className="text-green-400 mb-4" />
    <h2 className="text-2xl font-bold text-white mb-2">Sentence Builder</h2>
    <p className="text-slate-400">Feature coming soon...</p>
  </GlassCard>
);

const MathChallengeView: React.FC<{ difficulty: Difficulty }> = () => (
  <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
    <Calculator size={64} className="text-yellow-400 mb-4" />
    <h2 className="text-2xl font-bold text-white mb-2">Math Challenge</h2>
    <p className="text-slate-400">Feature coming soon...</p>
  </GlassCard>
);

const MatrixSearchView: React.FC<{ items: LearningItem[]; difficulty: Difficulty }> = ({ items }) => (
  <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
    <Grid size={64} className="text-pink-400 mb-4" />
    <h2 className="text-2xl font-bold text-white mb-2">Matrix Search</h2>
    <p className="text-slate-400">Feature coming soon...</p>
  </GlassCard>
);

const WordScrambleView: React.FC<{ items: LearningItem[]; difficulty: Difficulty }> = ({ items }) => (
  <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
    <Move size={64} className="text-orange-400 mb-4" />
    <h2 className="text-2xl font-bold text-white mb-2">Word Scramble</h2>
    <p className="text-slate-400">Feature coming soon...</p>
  </GlassCard>
);

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
    
    return sorted; // Default
  };

  const currentContent = getContent();

  useEffect(() => { setViewMode('list'); }, [activeSection]);

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

  // Define 5 games per section
  const getAvailableModes = () => {
      const base = [
          { id: 'list', label: 'List', icon: BookOpen },
          { id: 'flashcard', label: 'Flashcards', icon: Layers },
      ];

      // Add Story Generator for Vocab/Kanji
      if (['vocab', 'kanji'].includes(activeSection || '')) {
          base.push({ id: 'story', label: 'Story Generator', icon: Wand2 });
      }

      if (activeSection === 'kana') {
          return [
              ...base,
              { id: 'quiz', label: 'Quiz', icon: HelpCircle },
              { id: 'match', label: 'Memory Match', icon: Gamepad2 },
              { id: 'typing', label: 'Typing Dojo', icon: Keyboard },
              { id: 'matrix', label: 'Matrix Search', icon: Grid } // 5th game
          ];
      }
      if (['vocab', 'kanji', 'synonym', 'antonym'].includes(activeSection || '')) {
          return [
              ...base,
              { id: 'quiz', label: 'Quiz', icon: HelpCircle },
              { id: 'match', label: 'Memory Match', icon: Gamepad2 },
              { id: 'scramble', label: 'Word Scramble', icon: Move }, // 4th
              { id: 'typing', label: 'Typing Blitz', icon: Keyboard } // 5th
          ];
      }
      if (activeSection === 'grammar') {
          return [
              ...base,
              { id: 'builder', label: 'Sentence Builder', icon: PenTool },
              { id: 'particle', label: 'Particle Master', icon: Zap }, // Uses QuizView with particle mode
              { id: 'quiz', label: 'Grammar Quiz', icon: HelpCircle },
              { id: 'match', label: 'Rule Match', icon: ArrowRightLeft }
          ];
      }
      if (activeSection === 'number' || activeSection === 'counter') {
          return [
              ...base,
              { id: 'math', label: 'Math Dojo', icon: Calculator },
              { id: 'quiz', label: 'Number Quiz', icon: HelpCircle },
              { id: 'match', label: 'Value Match', icon: Gamepad2 },
              { id: 'typing', label: 'Number Type', icon: Keyboard }
          ];
      }
      return base;
  };

  const uniqueLessons = Array.from(new Set(VOCAB_DATA.map(v => v.lesson))).sort((a,b) => (a||0) - (b||0));
  const uniqueVocabCats = Array.from(new Set(VOCAB_DATA.map(v => v.category))).filter(Boolean) as string[];
  const uniqueKanjiCats = Array.from(new Set(KANJI_DATA.map(v => v.category))).filter(Boolean) as string[];

  // --- RENDER ---
  if (!activeSection) {
      const menus = [
          { id: 'kana', title: 'Hiragana & Katakana', desc: 'Basic, Dakuten, Youon', icon: Languages, color: 'text-pink-400', bg: 'bg-pink-500/20' },
          { id: 'vocab', title: 'Vocabulary', desc: 'Minna no Nihongo (Lesson/Category)', icon: Book, color: 'text-blue-400', bg: 'bg-blue-500/20' },
          { id: 'kanji', title: 'Kanji', desc: 'Minna no Nihongo (Lesson/Category)', icon: BookOpen, color: 'text-orange-400', bg: 'bg-orange-500/20' },
          { id: 'grammar', title: 'Grammar', desc: 'Minna no Nihongo (Lesson Wise)', icon: BookOpen, color: 'text-green-400', bg: 'bg-green-500/20' },
          { id: 'counter', title: 'Counters', desc: 'Things, Persons, Age...', icon: Scale, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
          { id: 'number', title: 'Numbers', desc: 'Counting, Month, Time...', icon: Hash, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
          { id: 'synonym', title: 'Synonyms', desc: 'Similar words', icon: Copy, color: 'text-purple-400', bg: 'bg-purple-500/20' },
          { id: 'antonym', title: 'Antonyms', desc: 'Opposite words', icon: ArrowRightLeft, color: 'text-red-400', bg: 'bg-red-500/20' },
      ];

      return (
          <div className="space-y-6">
              <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Learning Hub</h1>
                  <p className="text-slate-500 dark:text-slate-400">Select a category to start studying</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {menus.map(m => (
                      <GlassCard key={m.id} hoverEffect onClick={() => setActiveSection(m.id as SectionType)} className="cursor-pointer group">
                          <div className={`w-12 h-12 rounded-xl ${m.bg} ${m.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}><m.icon size={24} /></div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{m.title}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{m.desc}</p>
                      </GlassCard>
                  ))}
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-4 justify-between">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setActiveSection(null)} className="p-2 h-auto"><ArrowLeft size={20} /></Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{activeSection === 'kana' ? 'Kana Systems' : activeSection}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Select a game mode</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-1 bg-white/50 dark:bg-white/5 p-1 rounded-xl">
                 {getAvailableModes().map(m => (
                     <button key={m.id} onClick={() => setViewMode(m.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === m.id ? 'bg-primary text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'}`}>
                        <m.icon size={16} /> {m.label}
                     </button>
                 ))}
            </div>
        </div>

        {viewMode !== 'list' && viewMode !== 'flashcard' && viewMode !== 'story' && (
            <DifficultySelector current={difficulty} onChange={setDifficulty} />
        )}

        <GlassCard className="py-4">
            {/* Filters UI */}
            {activeSection === 'kana' && (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                        {['Hiragana', 'Katakana', 'Mixed'].map(sys => <button key={sys} onClick={() => setKanaSystem(sys as any)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${kanaSystem === sys ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}>{sys}</button>)}
                    </div>
                    <div className="flex items-center gap-3">
                         <span className="text-slate-500 dark:text-slate-400 font-bold text-sm hidden md:block">Variation:</span>
                         <div className="flex gap-2">{['basic', 'dakuten', 'youon'].map(v => <Button key={v} variant={kanaVar === v ? 'primary' : 'secondary'} size="sm" onClick={() => setKanaVar(v as any)} className="capitalize">{v}</Button>)}</div>
                    </div>
                </div>
            )}
            
            {(activeSection === 'vocab' || activeSection === 'kanji') && (
                <div className="flex flex-col md:flex-row gap-6 items-center flex-wrap">
                    <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                        <button onClick={() => setLessonMode('lesson')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${lessonMode === 'lesson' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}>Lesson Wise</button>
                        <button onClick={() => setLessonMode('category')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${lessonMode === 'category' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}>Category Wise</button>
                    </div>
                    <select 
                        className="bg-white/50 dark:bg-black/40 text-slate-800 dark:text-white border border-slate-200 dark:border-white/20 rounded-xl px-4 py-2 outline-none focus:border-primary" 
                        value={lessonMode === 'lesson' ? selectedLesson : selectedCategory} 
                        onChange={(e) => lessonMode === 'lesson' ? setSelectedLesson(Number(e.target.value)) : setSelectedCategory(e.target.value)}
                    >
                        {lessonMode === 'lesson' ? uniqueLessons.map(l => (
                            <option key={l} value={l}>
                                Lesson {l} {completedLessons.includes(`${activeSection}-lesson-${l}`) ? '✅' : ''}
                            </option>
                        )) : (activeSection === 'vocab' ? uniqueVocabCats : uniqueKanjiCats).map(c => (
                            <option key={c} value={c}>
                                {c} {completedLessons.includes(`${activeSection}-cat-${c}`) ? '✅' : ''}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            
            {/* Sorting Controls for List View */}
            {viewMode === 'list' && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold uppercase text-slate-400 mr-2">Sort:</span>
                    <Button size="sm" variant={sortMethod === 'az' ? 'primary' : 'secondary'} onClick={() => setSortMethod(sortMethod === 'az' ? 'default' : 'az')}>
                        <SortAsc size={14} /> A-Z
                    </Button>
                    <Button size="sm" variant={sortMethod === 'length' ? 'primary' : 'secondary'} onClick={() => setSortMethod(sortMethod === 'length' ? 'default' : 'length')}>
                        <Scale size={14} /> Shortest
                    </Button>
                    <Button size="sm" variant={sortMethod === 'random' ? 'primary' : 'secondary'} onClick={() => setSortMethod(sortMethod === 'random' ? 'default' : 'random')}>
                        <Shuffle size={14} /> Random
                    </Button>
                    <div className="h-6 w-px bg-slate-300 dark:bg-white/10 mx-2"></div>
                    <Button size="sm" variant={isPlayingAll ? 'danger' : 'secondary'} onClick={handlePlayAll}>
                         {isPlayingAll ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                         {isPlayingAll ? 'Stop Lesson' : 'Listen All'}
                    </Button>
                </div>
            )}
            
            {activeSection === 'grammar' && (
                <div className="flex items-center gap-4">
                    <span className="text-slate-500 dark:text-slate-400 font-bold">Select Lesson:</span>
                    <select 
                        className="bg-white/50 dark:bg-black/40 text-slate-800 dark:text-white border border-slate-200 dark:border-white/20 rounded-xl px-4 py-2 outline-none focus:border-primary" 
                        value={selectedLesson} 
                        onChange={(e) => setSelectedLesson(Number(e.target.value))}
                    >
                        {uniqueLessons.map(l => (
                            <option key={l} value={l}>
                                Lesson {l} {completedLessons.includes(`grammar-lesson-${l}`) ? '✅' : ''}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {activeSection === 'counter' && (
                <div className="flex items-center gap-4">
                     <span className="text-slate-500 dark:text-slate-400 font-bold">Category:</span>
                     <select className="bg-white/50 dark:bg-black/40 text-slate-800 dark:text-white border border-slate-200 dark:border-white/20 rounded-xl px-4 py-2 outline-none focus:border-primary w-full md:w-64" value={selectedCounterGroup} onChange={(e) => setSelectedCounterGroup(e.target.value)}>{COUNTER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
            )}
            {activeSection === 'number' && (
                <div className="flex items-center gap-4">
                     <span className="text-slate-500 dark:text-slate-400 font-bold">Category:</span>
                     <select className="bg-white/50 dark:bg-black/40 text-slate-800 dark:text-white border border-slate-200 dark:border-white/20 rounded-xl px-4 py-2 outline-none focus:border-primary w-full md:w-64" value={selectedNumberGroup} onChange={(e) => setSelectedNumberGroup(e.target.value)}>{NUMBER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
            )}
        </GlassCard>

        {viewMode === 'list' && (
            <div className={`grid gap-4 ${activeSection === 'kana' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {currentContent.map((item) => (
                    <GlassCard key={item.id} className="relative group hover:border-primary/30 transition-all cursor-pointer" onClick={() => speak(item.ja)}>
                        <div className="absolute top-4 right-4 text-xs text-slate-400 uppercase tracking-widest font-bold">{item.type}</div>
                        <div className="text-3xl font-jp font-bold text-slate-900 dark:text-white mb-2">{item.ja}</div>
                        <div className={`font-medium mb-3 ${activeSection === 'synonym' || activeSection === 'antonym' ? 'text-xl text-yellow-500 dark:text-yellow-400 font-jp' : 'text-primary'}`}>{item.romaji}</div>
                        <div className="pt-3 border-t border-slate-200 dark:border-white/10">
                            <p className="text-slate-600 dark:text-slate-200">{item.en}</p>
                            {item.bn && <p className="text-xs text-slate-500 mt-1">🇧🇩 {item.bn}</p>}
                            {item.usage && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 bg-black/5 dark:bg-white/5 p-2 rounded">Ex: {item.usage}</p>}
                        </div>
                    </GlassCard>
                ))}
                {currentContent.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">No content found for this selection.</div>}
            </div>
        )}

        {viewMode === 'flashcard' && <FlashcardView items={currentContent} />}
        {viewMode === 'quiz' && <QuizView items={currentContent} difficulty={difficulty} onComplete={handleLessonComplete} />}
        {viewMode === 'particle' && <QuizView items={currentContent} difficulty={difficulty} customMode="particle" onComplete={handleLessonComplete} />}
        {viewMode === 'match' && <MemoryMatchView items={currentContent} difficulty={difficulty} />}
        {viewMode === 'typing' && <TypingPracticeView items={currentContent} difficulty={difficulty} />}
        {viewMode === 'builder' && <SentenceBuilderView items={currentContent} difficulty={difficulty} />}
        {viewMode === 'math' && <MathChallengeView difficulty={difficulty} />}
        {viewMode === 'matrix' && <MatrixSearchView items={currentContent} difficulty={difficulty} />}
        {viewMode === 'scramble' && <WordScrambleView items={currentContent} difficulty={difficulty} />}
        {viewMode === 'story' && <LessonStoryView items={currentContent} />}
    </div>
  );
};