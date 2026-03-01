
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GlassCard, Button, Badge, Input, WonderCard, ProgressRing, Confetti } from '@/components/UI';
import { Explainer } from '@/components/Explainer';
import { 
    BookOpen, ArrowLeft, ArrowRight, Hash, Scale, Copy, ArrowRightLeft, 
    Languages, Book, Layers, HelpCircle, RotateCw, 
    CheckCircle, XCircle, Trophy, Grid, Bookmark, Volume2, Keyboard,
    PenTool, Timer, Heart, Zap, Wand2, RefreshCw, Square, MessageCircle,
    Frown, Play, SortAsc, X, ListOrdered, Crosshair, Eye, Music,
    Ear, Briefcase, Coffee, Pause, Loader2, Ghost, ThumbsDown, Flame, Sparkles,
    ChevronRight, Check, AlertTriangle, Circle, Swords
} from 'lucide-react';
import { 
    VOCAB_DATA, KANA_DATA, KANJI_DATA, GRAMMAR_DATA, 
    COUNTER_DATA, NUMBER_DATA, SYNONYM_DATA, ANTONYM_DATA,
    COUNTER_CATEGORIES, NUMBER_CATEGORIES, CONVERSATION_DATA,
    LISTENING_DATA, FORMAL_INFORMAL_DATA
} from '@/data/mockContent';
import { LearningItem, StoryContent, ConversationTopic, SongContent } from '@/types';
import { progressService } from '@/services/progressService';
import { aiService } from '@/services/aiService';
import { useSettings } from '@/contexts/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES & UTILS ---

type SectionType = 'kana' | 'vocab' | 'kanji' | 'grammar' | 'counter' | 'number' | 'synonym' | 'antonym' | 'conversation' | 'listening' | 'formal_informal';
type ViewMode = 'list' | 'flashcard' | 'quiz' | 'particle' | 'story' | 'song' | 'conversation' | 'listening_drill';
type SortMethod = 'default' | 'az' | 'length' | 'random' | 'serial';

interface ExtendedLearningItem extends LearningItem {
    kanaPair?: string;
}

interface QuizProps {
    items: LearningItem[];
    customMode?: 'particle' | 'normal';
    onComplete?: (score: number, total: number) => void;
}

const CelebrationOverlay: React.FC = () => (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 overflow-hidden bg-white/20 backdrop-blur-[2px]">
        <div className="absolute animate-blob text-8xl" style={{ top: '20%', left: '20%' }}>🎉</div>
        <div className="absolute animate-blob animation-delay-2000 text-8xl" style={{ top: '30%', right: '20%' }}>✨</div>
        <div className="absolute animate-bounce text-8xl" style={{ bottom: '20%', left: '50%' }}>🌟</div>
    </div>
);



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

const CircularProgress: React.FC<{ percentage: number; color: string }> = ({ percentage, color }) => {
    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
                <circle
                    stroke="#e5e7eb"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="absolute text-3xl font-black text-ink font-mono">
                {Math.round(percentage)}%
            </div>
        </div>
    );
};

// --- COMPONENT DEFINITIONS ---

const QuizView: React.FC<QuizProps> = ({ items, customMode = 'normal', onComplete }) => {
    const { playSound, speak } = useSettings();
    
    // Game State
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [mistakes, setMistakes] = useState<any[]>([]);
    const [showResult, setShowResult] = useState(false);
    
    // Question State
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [slashed, setSlashed] = useState(false);
    
    const timerRef = useRef<number | null>(null);

    // Initialize Quiz
    useEffect(() => {
        if (items.length < 2) return;

        // 1. Shuffle all items to create a random order
        const shuffledItems = [...items].sort(() => 0.5 - Math.random());

        // 2. Generate Question Objects
        const qs = shuffledItems.map(item => {
            // Logic for Particle Mode
            if (customMode === 'particle' && item.usage) {
                const particles = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'の', 'も'];
                const foundParticles = particles.filter(p => item.usage!.includes(p));
                if (foundParticles.length > 0) {
                    const targetP = foundParticles[Math.floor(Math.random() * foundParticles.length)];
                    const questionText = item.usage!.replace(targetP, '___');
                    const distractors = particles.filter(p => p !== targetP).sort(() => 0.5 - Math.random()).slice(0, 3);
                    return {
                        id: item.id,
                        type: 'text',
                        question: questionText + (item.en ? `\n(${item.en})` : ''),
                        correct: targetP,
                        options: [targetP, ...distractors].sort(() => 0.5 - Math.random()),
                        original: item
                    };
                }
            }

            // Logic for Standard Mode
            // Decide Question Type: Text JA->EN (40%), Text EN->JA (40%), Audio->EN (20%)
            const rand = Math.random();
            let type = 'ja_en';
            if (rand > 0.4) type = 'en_ja';
            if (rand > 0.8 && item.ja) type = 'audio';

            let questionText, correctText, optionsPool;

            if (type === 'audio') {
                questionText = item.ja; // Used for audio source
                correctText = item.en;
                optionsPool = shuffledItems.filter(i => i.id !== item.id).map(i => i.en);
            } else if (type === 'ja_en') {
                questionText = item.ja;
                correctText = item.en;
                optionsPool = shuffledItems.filter(i => i.id !== item.id).map(i => i.en);
            } else {
                questionText = item.en;
                correctText = item.ja;
                optionsPool = shuffledItems.filter(i => i.id !== item.id).map(i => i.ja);
            }

            // Ensure unique options
            const uniqueOptions = [...new Set(optionsPool)];
            const wrongOptions = uniqueOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
            
            return {
                id: item.id,
                type: type,
                question: questionText,
                correct: correctText,
                options: [...wrongOptions, correctText].sort(() => 0.5 - Math.random()),
                original: item
            };
        }).filter(q => q);

        setQuestions(qs);
        setScore(0);
        setStreak(0);
        setMaxStreak(0);
        setMistakes([]);
        setCurrentQIndex(0);
        setShowResult(false);
        setIsAnswered(false);
        setSelectedOption(null);
        setFeedback(null);
        setSlashed(false);
        setTimeLeft(15);

    }, [items, customMode]);

    // Timer Logic
    useEffect(() => {
        if (!isAnswered && !showResult && questions.length > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleTimeOut();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isAnswered, showResult, questions.length, currentQIndex]);

    const handleTimeOut = () => {
        if (isAnswered) return;
        setIsAnswered(true);
        setFeedback('wrong');
        playSound('wrong');
        setStreak(0);
        
        // Save Mistake on Timeout
        const currentQ = questions[currentQIndex];
        if (currentQ) {
            setMistakes(prev => [...prev, currentQ]);
            if (currentQ.original) progressService.addMistake(currentQ.original);
        }

        // Auto Advance
        setTimeout(proceedToNext, 2000);
    };

    const handleAnswer = (option: string) => {
        if (isAnswered) return;
        
        setIsAnswered(true);
        setSelectedOption(option);
        
        const currentQ = questions[currentQIndex];
        const isCorrect = option === currentQ.correct;

        if (isCorrect) {
            setFeedback('correct');
            setSlashed(true);
            playSound('correct');
            playSound('hit');
            setScore(prev => prev + 1);
            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak > maxStreak) setMaxStreak(newStreak);
            progressService.addXP(10 + (streak * 2)); // Streak bonus
            
            // Speak if text based Japanese answer
            if (currentQ.type === 'en_ja') {
               speak(currentQ.correct);
            }
        } else {
            setFeedback('wrong');
            playSound('wrong');
            setStreak(0);
            setMistakes(prev => [...prev, currentQ]);
            // Save Mistake on Wrong Answer
            progressService.addMistake(currentQ.original);
        }

        // Auto Advance
        setTimeout(proceedToNext, 1200); 
    };

    const proceedToNext = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            setIsAnswered(false);
            setSelectedOption(null);
            setFeedback(null);
            setSlashed(false);
            setTimeLeft(15);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        setShowResult(true);
        const total = questions.length;
    };

    if (items.length < 4) return <div className="text-center py-10 text-bamboo">Not enough items to generate a quiz. (Need 4+)</div>;
    if (questions.length === 0) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-hanko" /></div>;

    // --- RESULTS SCREEN ---
    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 80;
        const resultColor = passed ? '#10B981' : '#EF4444'; // Emerald or Red

        return (
            <div className="max-w-2xl mx-auto py-8 animate-fade-in relative">
                {passed && <CelebrationOverlay />}
                {passed && <Confetti />}
                
                <GlassCard className={`text-center py-10 border-t-4 ${passed ? 'border-t-emerald-500 shadow-emerald-100' : 'border-t-red-500 shadow-red-100'}`}>
                    
                    <div className="mb-8 flex justify-center">
                        <ProgressRing progress={percentage} size={120} strokeWidth={12} color={resultColor === '#10B981' ? 'text-emerald-500' : 'text-hanko'} />
                    </div>

                    <h2 className="text-4xl font-bold text-ink mb-2 font-serif">
                        {passed ? 'Assessment Passed!' : 'Needs Practice'}
                    </h2>
                    
                    <p className="text-bamboo mb-4 text-lg">
                        You scored {score} out of {questions.length}
                    </p>

                    <div className="flex justify-center gap-4 mb-8">
                        <div className="bg-rice px-4 py-2 rounded-xl border border-bamboo/10">
                            <span className="block text-xs font-bold text-bamboo uppercase">Max Streak</span>
                            <span className="text-xl font-black text-hanko flex items-center justify-center gap-1">
                                <Zap size={16} fill="currentColor" /> {maxStreak}
                            </span>
                        </div>
                        <div className="bg-rice px-4 py-2 rounded-xl border border-bamboo/10">
                            <span className="block text-xs font-bold text-bamboo uppercase">XP Earned</span>
                            <span className="text-xl font-black text-purple-600">+{score * 10 + maxStreak * 5}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center mb-10">
                        <Button variant="secondary" onClick={() => { 
                            // Reset
                            setScore(0);
                            setStreak(0);
                            setMaxStreak(0);
                            setMistakes([]);
                            setCurrentQIndex(0);
                            setShowResult(false);
                            setIsAnswered(false);
                            setSelectedOption(null);
                            setFeedback(null);
                            setSlashed(false);
                            setTimeLeft(15);
                        }}>
                            <RefreshCw size={18} className="mr-2" /> Retry
                        </Button>
                        
                        {passed && (
                            <Button onClick={() => {
                                if(onComplete) onComplete(score, questions.length);
                            }}>
                                Continue <ArrowRight size={18} className="ml-2" />
                            </Button>
                        )}
                    </div>

                    {mistakes.length > 0 && (
                        <div className="text-left bg-red-50/50 rounded-2xl p-6 border border-red-100">
                            <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                                <AlertTriangle size={18} /> Review Mistakes ({mistakes.length})
                            </h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {mistakes.map((m, i) => (
                                    <div key={i} className="bg-white p-3 rounded-xl border border-red-100 flex justify-between items-center shadow-sm">
                                        <div>
                                            <div className="text-sm font-bold text-ink">{m.type === 'audio' ? '(Audio Question)' : m.question}</div>
                                            <div className="text-xs text-bamboo">{m.original.ja} • {m.original.romaji}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded inline-block mb-1">
                                                {m.correct}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </GlassCard>
            </div>
        );
    }

    const currentQ = questions[currentQIndex];
    const progress = ((currentQIndex + 1) / questions.length) * 100;

    return (
        <div className="max-w-3xl mx-auto py-6 animate-fade-in relative bg-rice rounded-[32px] border-2 border-b-4 border-bamboo/10 min-h-[600px] flex flex-col overflow-hidden shadow-2xl">
            {/* Slash Visual Overlay - Motion Enhanced */}
            <AnimatePresence>
                {slashed && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <motion.div 
                            initial={{ scaleX: 0, rotate: 45 }} 
                            animate={{ scaleX: 1, rotate: 45 }} 
                            transition={{ duration: 0.1 }}
                            className="w-[140%] h-2 bg-white absolute shadow-[0_0_20px_rgba(255,255,255,0.8)]" 
                        />
                        <motion.div 
                            initial={{ scaleX: 0, rotate: 45 }} 
                            animate={{ scaleX: 1, rotate: 45 }} 
                            transition={{ duration: 0.1, delay: 0.05 }}
                            className="w-[140%] h-1 bg-hanko absolute" 
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Texture */}
            <div className="absolute inset-0 bg-pattern opacity-30 pointer-events-none"></div>

            {/* Progress Bar (Combined with Header Stats) */}
            <div className="relative z-30 bg-white/80 backdrop-blur-sm border-b border-bamboo/10 px-4 py-4 md:px-8 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-rice px-3 py-1 rounded-xl border border-bamboo/10">
                        <Swords size={16} className="text-hanko" />
                        <span className="text-xs font-black text-ink uppercase tracking-widest">
                            Q {currentQIndex + 1}/{questions.length}
                        </span>
                    </div>
                    {/* Visual Progress Bar Segment */}
                    <div className="hidden sm:block w-32 h-2 bg-bamboo/10 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-hanko" 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-bamboo uppercase tracking-widest hidden sm:inline">Streak</span>
                        <div className="flex items-center text-orange-500 font-black text-xl">
                            <Zap size={20} fill="currentColor" className={streak > 2 ? "animate-bounce" : ""} />
                            <span>{streak}</span>
                        </div>
                    </div>

                    <div className="w-px h-6 bg-bamboo/20"></div>

                    <div className="flex items-center gap-2">
                        <Timer size={20} className={timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-bamboo"} />
                        <span className={`font-mono font-bold text-xl ${timeLeft <= 5 ? "text-red-500" : "text-ink"}`}>{timeLeft}s</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 space-y-8 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQ.id}
                        className="w-full flex flex-col items-center flex-1 h-full"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                        {/* Question Area */}
                        <div className={`flex-1 flex flex-col justify-center items-center w-full text-center mb-4 transition-transform duration-200 ${slashed ? 'scale-110 text-hanko blur-[1px]' : ''}`}>
                            {currentQ.type === 'audio' ? (
                                <div className="animate-pop flex flex-col items-center">
                                    <button 
                                        onClick={() => speak(currentQ.question)} 
                                        className="w-32 h-32 bg-hanko rounded-full flex items-center justify-center text-white shadow-xl shadow-hanko/30 hover:scale-110 transition-transform mb-6 animate-pulse border-4 border-white/20"
                                    >
                                        <Volume2 size={56} />
                                    </button>
                                    <p className="text-bamboo font-bold uppercase tracking-[0.3em] text-sm bg-white/50 px-4 py-2 rounded-full">Listen Carefully</p>
                                </div>
                            ) : (
                                <div className="relative z-10">
                                    <h2 className="text-6xl md:text-8xl font-black text-ink font-jp mb-6 leading-tight drop-shadow-md select-none">
                                        {currentQ.question}
                                    </h2>
                                    {isAnswered && feedback === 'wrong' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-100 text-red-800 px-6 py-3 rounded-xl inline-block border-2 border-red-200 font-bold shadow-lg"
                                        >
                                            Correct: {currentQ.correct}
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-2 gap-4 w-full mt-auto px-2 md:px-8">
                            {currentQ.options.map((opt: string, i: number) => {
                                const isSelected = selectedOption === opt;
                                const isCorrect = opt === currentQ.correct;
                                
                                let btnClass = "bg-white border-2 border-b-4 border-bamboo/10 text-ink shadow-sm";
                                let icon = null;

                                if (isAnswered) {
                                    if (isCorrect) {
                                        // Correct Style
                                        btnClass = "bg-green-500 border-green-700 text-white border-b-2 translate-y-[2px] shadow-none";
                                        icon = <CheckCircle size={24} className="text-white ml-auto shrink-0 animate-bounce" />;
                                    } else if (isSelected) {
                                        // Wrong Style
                                        btnClass = "bg-red-500 border-red-700 text-white border-b-2 translate-y-[2px] shadow-none";
                                        icon = <XCircle size={24} className="text-white ml-auto shrink-0" />;
                                    } else {
                                        // Dim others
                                        btnClass = "bg-gray-100 text-gray-400 border-gray-200 border-b-2 translate-y-[2px] shadow-none opacity-50 scale-95";
                                    }
                                }

                                return (
                                    <motion.button 
                                        key={`${currentQ.id}-${i}`} 
                                        onClick={() => handleAnswer(opt)} 
                                        disabled={isAnswered} 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ 
                                            opacity: 1, 
                                            y: 0,
                                            scale: isAnswered && isCorrect ? 1.02 : 1,
                                            x: isAnswered && isSelected && !isCorrect ? [0, -5, 5, -5, 5, 0] : 0
                                        }}
                                        transition={{ 
                                            delay: i * 0.1, 
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 20
                                        }}
                                        whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                                            relative w-full text-left py-6 px-4 md:px-8 rounded-2xl text-lg md:text-2xl font-black 
                                            flex items-center h-full min-h-[100px] justify-center text-center
                                            ${btnClass}
                                        `}
                                    >
                                        <span className="flex-1 font-jp leading-tight">{opt}</span>
                                        {icon}
                                    </motion.button>
                                )
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const KanaQuizView: React.FC<{ items: LearningItem[]; onExit: () => void }> = ({ items, onExit }) => {
    return (
        <div className="w-full">
            <Button variant="ghost" onClick={onExit} className="mb-4">← Exit Quiz</Button>
            <QuizView items={items} />
        </div>
    );
};

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
        }
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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!flipped) {
                    toggleFlip();
                } else {
                    markUnknown();
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

const KanjiCard: React.FC<{ item: LearningItem; isActive?: boolean }> = ({ item, isActive }) => {
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
            const hex = item.ja.charCodeAt(0).toString(16).toLowerCase().padStart(5, '0');
            const response = await fetch(`https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`);
            if (!response.ok) throw new Error("Character not found in KanjiVG");
            const text = await response.text();
            
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "image/svg+xml");
            const pathElements = Array.from(xmlDoc.querySelectorAll('path'));
            const dPaths = pathElements.map(p => p.getAttribute('d') || '');
            setPaths(dPaths);
            
            let step = 0;
            const play = () => {
                if (step >= dPaths.length) {
                    timerRef.current = window.setTimeout(() => {
                        setCurrentStroke(-1);
                        step = 0;
                        play();
                    }, 1500);
                    return;
                }
                setCurrentStroke(step);
                step++;
                timerRef.current = window.setTimeout(play, 800);
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
            id={`card-${item.id}`}
            className={`relative group hover:border-hanko/30 transition-all cursor-pointer overflow-hidden h-full flex flex-col shadow-sm bg-white/60 
            ${isActive ? '!border-hanko !bg-white !scale-105 !shadow-2xl !z-30 !ring-4 !ring-hanko/20 -translate-y-2' : 'hover:-translate-y-1 hover:shadow-lg'}`}
            onClick={() => speak(item.ja)}
        >
            <div className="absolute top-3 right-3 flex gap-2 z-20">
                <button 
                    onClick={startAnimation}
                    className={`p-2 rounded-lg transition-all shadow-sm ${isAnimating ? 'bg-hanko text-white' : 'bg-white/80 text-bamboo hover:text-hanko'}`}
                    title="Play Stroke Order"
                >
                    {isAnimating ? <X size={14} /> : <PenTool size={14} />}
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-6 min-h-[160px]">
                {isAnimating ? (
                    <div className="w-24 h-24 relative flex items-center justify-center bg-rice/50 rounded-2xl border border-bamboo/10 shadow-inner">
                        {loading ? (
                            <RefreshCw size={24} className="text-hanko animate-spin" />
                        ) : (
                            <svg viewBox="0 0 109 109" className="w-full h-full p-2">
                                {paths.map((d, i) => (
                                    <path key={`g-${i}`} d={d} fill="none" stroke="#e0c097" strokeWidth="3" strokeLinecap="round" opacity="0.1" />
                                ))}
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

const VocabPracticeCard: React.FC<{ item: LearningItem; isActive?: boolean; isPlayingAll?: boolean }> = ({ item, isActive, isPlayingAll }) => {
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
            id={`card-${item.id}`}
            className={`relative group border-white transition-all duration-300 cursor-pointer overflow-hidden transform active:scale-95 bg-white/60 h-full flex flex-col 
            ${isPracticing ? 'col-span-full md:col-span-2 lg:col-span-3 min-h-[400px] z-10' : 
              isActive ? '!border-hanko !bg-white !scale-105 !shadow-2xl !z-30 !ring-4 !ring-hanko/20 -translate-y-2' : 'hover:-translate-y-1.5 shadow-sm hover:shadow-xl'}`}
            onClick={(e) => !isPracticing ? startPractice(e) : speak(item.ja)}
            onMouseEnter={() => { if (!isPracticing && !isPlayingAll) speak(item.ja); }}
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
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all pointer-events-none bg-hanko/10 text-hanko px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                        Context
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
                        <div className="text-4xl font-jp font-bold text-ink mb-2 relative z-10 transition-transform group-hover:scale-100">{item.ja}</div>
                        <div className="font-mono text-sm mb-3 relative z-10 text-hanko font-bold uppercase tracking-widest bg-hanko/5 px-3 py-1 rounded-full">{item.romaji}</div>
                    </div>
                    
                    <div className="pt-4 border-t border-bamboo/10 relative z-10 bg-rice/30 -mx-6 -mb-6 p-6 mt-auto">
                        <p className="text-ink font-bold text-center text-lg">{item.en}</p>
                        {item.bn && <p className="text-xs text-bamboo mt-1 text-center font-medium opacity-80">🇧🇩 {item.bn}</p>}
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-hanko/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </>
            )}
        </GlassCard>
    );
};

const ConversationDetailView: React.FC<{ topic: ConversationTopic; onBack: () => void }> = ({ topic, onBack }) => {
    const { speak } = useSettings();
    return (
        <div className="space-y-6 animate-fade-in bg-[#f5f2ed] -mx-6 -my-8 md:-mx-10 md:-my-12 px-6 py-8 md:px-10 md:py-12 min-h-screen">
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

// --- MAIN LEARNING HUB ---

export const LearningHub: React.FC = () => {
    const uniqueVocabCats = Array.from(new Set(VOCAB_DATA.map(v => v.category))).filter(Boolean) as string[];
    const uniqueKanjiCats = Array.from(new Set(KANJI_DATA.map(v => v.category))).filter(Boolean) as string[];
    const uniqueLessons = Array.from(new Set(VOCAB_DATA.map(v => v.lesson)))
        .filter((l): l is number => typeof l === 'number')
        .sort((a,b) => a - b);

    const [activeSection, setActiveSection] = useState<SectionType | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    
    const [kanaSystem, setKanaSystem] = useState<string>('Hiragana');
    const [kanaVar, setKanaVar] = useState<'basic' | 'dakuten' | 'youon'>('basic');
    const [lessonMode, setLessonMode] = useState<'lesson' | 'category'>('lesson');
    const [selectedLesson, setSelectedLesson] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(uniqueVocabCats[0] || 'People');
    const [selectedCounterGroup, setSelectedCounterGroup] = useState(COUNTER_CATEGORIES[0]);
    const [selectedNumberGroup, setSelectedNumberGroup] = useState(NUMBER_CATEGORIES[0]);
    
    const [sortMethod, setSortMethod] = useState<SortMethod>('default');
    const [isPlayingAll, setIsPlayingAll] = useState(false);
    const [activeCardId, setActiveCardId] = useState<string | null>(null); 
    
    const [selectedConversation, setSelectedConversation] = useState<ConversationTopic | null>(null);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [scrollY, setScrollY] = useState(0);

    const { speak, isPaused, pauseAudio, resumeAudio, stopAudio } = useSettings();

    useEffect(() => {
        setCompletedLessons(progressService.getCompletedLessons());
        const handleScroll = () => {
            requestAnimationFrame(() => setScrollY(window.scrollY));
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        return () => {
            if (isPlayingAll) {
                stopAudio();
                setIsPlayingAll(false);
                setActiveCardId(null);
            }
        };
    }, [viewMode, activeSection, isPlayingAll, stopAudio]);

    const handleLessonComplete = (score: number, total: number) => {
        if (score / total >= 0.8) {
             if (activeSection === 'grammar') progressService.markLessonComplete(`grammar-lesson-${selectedLesson}`);
             if (activeSection === 'vocab' && lessonMode === 'lesson') progressService.markLessonComplete(`vocab-lesson-${selectedLesson}`);
             setCompletedLessons(progressService.getCompletedLessons());
        }
    };

    const currentContent = useMemo(() => {
        let items: (LearningItem | ExtendedLearningItem)[] = [];
        switch(activeSection) {
            case 'kana':
                if (kanaSystem === 'Mixed') {
                    const hItems = KANA_DATA.filter(k => k.category === 'Hiragana' && k.variation === kanaVar);
                    items = hItems.map(h => {
                        const kItem = KANA_DATA.find(k => k.category === 'Katakana' && k.variation === kanaVar && k.romaji === h.romaji);
                        return { ...h, kanaPair: kItem ? kItem.ja : '', type: 'kana' } as ExtendedLearningItem;
                    });
                } else {
                    items = KANA_DATA.filter(k => k.category === kanaSystem && k.variation === kanaVar);
                }
                break;
            case 'vocab': items = VOCAB_DATA.filter(v => lessonMode === 'lesson' ? v.lesson === selectedLesson : v.category === selectedCategory); break;
            case 'kanji': items = KANJI_DATA.filter(k => lessonMode === 'lesson' ? k.lesson === selectedLesson : k.category === selectedCategory); break;
            case 'grammar': items = GRAMMAR_DATA.filter(g => g.lesson === selectedLesson); break;
            case 'counter': items = COUNTER_DATA.filter(c => c.group === selectedCounterGroup); break;
            case 'number': items = NUMBER_DATA.filter(n => n.group === selectedNumberGroup); break;
            case 'synonym': items = SYNONYM_DATA; break;
            case 'antonym': items = ANTONYM_DATA; break;
            case 'listening': items = LISTENING_DATA; break;
            case 'formal_informal': items = FORMAL_INFORMAL_DATA; break;
            default: items = [];
        }
    
        const sorted = [...items];
        if (sortMethod === 'az') return sorted.sort((a,b) => a.romaji.localeCompare(b.romaji));
        if (sortMethod === 'length') return sorted.sort((a,b) => a.ja.length - b.ja.length);
        if (sortMethod === 'random') return sorted.sort(() => 0.5 - Math.random());
        if (sortMethod === 'serial') return items; 
        return sorted; 
    }, [activeSection, kanaSystem, kanaVar, lessonMode, selectedLesson, selectedCategory, selectedCounterGroup, selectedNumberGroup, sortMethod]);

    useEffect(() => { 
        if (activeSection === 'conversation') setViewMode('conversation'); 
        else if (activeSection === 'listening') setViewMode('listening_drill');
        else setViewMode('list'); 
    }, [activeSection]);
  
    const isPlayingRef = useRef(false);
    const isPausedRef = useRef(false);
    useEffect(() => { isPlayingRef.current = isPlayingAll; }, [isPlayingAll]);
    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

    const handlePlayAll = async () => {
        if (isPlayingAll) {
            stopAudio();
            setIsPlayingAll(false);
            isPlayingRef.current = false;
            setActiveCardId(null);
            return;
        }
        setIsPlayingAll(true);
        isPlayingRef.current = true;
        
        // Use a local copy to avoid closure issues
        const contentToPlay = [...currentContent];
        
        for (const item of contentToPlay) {
            if (!isPlayingRef.current) break;
            
            // Wait if paused
            while (isPausedRef.current && isPlayingRef.current) {
                await new Promise(r => setTimeout(r, 200));
            }
            
            if (!isPlayingRef.current) break;
            
            setActiveCardId(item.id);
            
            // Scroll to item
            const element = document.getElementById(`card-${item.id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Small delay before speaking for visual sync
            await new Promise(r => setTimeout(r, 400));
            
            if (!isPlayingRef.current) break;
            
            try {
                await speak(item.ja);
            } catch (e) {
                console.error("Speech failed", e);
            }
            
            // Wait a bit after speaking before next item
            if (isPlayingRef.current) {
                await new Promise(r => setTimeout(r, 800));
            }
        }
        
        setIsPlayingAll(false);
        isPlayingRef.current = false;
        setActiveCardId(null);
    };
    
    const getAvailableModes = () => {
        if (activeSection === 'conversation') return []; 
        if (activeSection === 'listening') return []; 
        
        const modes = [
            { id: 'list', label: 'List', icon: ListOrdered },
            { id: 'flashcard', label: 'Flashcard', icon: Layers },
            { id: 'quiz', label: 'Quiz', icon: HelpCircle }
        ];

        if (['vocab', 'kanji'].includes(activeSection || '')) {
            modes.push({ id: 'story', label: 'Story', icon: Wand2 });
            modes.push({ id: 'song', label: 'Song', icon: Music });
        }

        return modes;
    };
    
    const isComplete = (id: string) => completedLessons.includes(id);

    if (!activeSection) {
        const menus = [
            { id: 'kana', title: 'Hiragana & Katakana', desc: 'Master the native Japanese syllabary (Basic, Dakuten, Youon).', icon: Languages, color: 'text-hanko', bg: 'bg-hanko/10', border: 'border-hanko/20' },
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
            <div className="space-y-10 relative bg-[#f5f2ed] -mx-6 -my-8 md:-mx-10 md:-my-12 px-6 py-8 md:px-10 md:py-12 min-h-screen">
                <div className="fixed top-32 left-[5%] text-9xl text-bamboo/5 font-jp font-bold pointer-events-none z-0" style={{ transform: `translateY(${scrollY * 0.15}px) rotate(15deg)` }}>あ</div>
                <div className="fixed bottom-32 right-[8%] text-9xl text-hanko/5 font-jp font-bold pointer-events-none z-0" style={{ transform: `translateY(${scrollY * -0.1}px) rotate(-10deg)` }}>カ</div>
                <div className="text-center max-w-2xl mx-auto relative z-10">
                    <h1 className="text-4xl font-bold text-ink mb-3 font-serif">Learning Hub</h1>
                    <p className="text-lg text-bamboo">Choose a category to begin your training.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
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
  
    if (activeSection === 'conversation') {
        if (selectedConversation) {
            return <ConversationDetailView topic={selectedConversation} onBack={() => setSelectedConversation(null)} />;
        }
  
        return (
            <div className="space-y-8 animate-fade-in bg-[#f5f2ed] -mx-6 -my-8 md:-mx-10 md:-my-12 px-6 py-8 md:px-10 md:py-12 min-h-screen">
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
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in relative px-4 md:px-0 bg-[#f5f2ed] -mx-6 -my-8 md:-mx-10 md:-my-12 px-6 py-8 md:px-10 md:py-12 min-h-screen">
          <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 border-b border-bamboo/10 pb-4 justify-between relative z-10">
              <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={() => { setActiveSection(null); setViewMode('list'); }} className="p-2 h-auto text-bamboo hover:bg-white/50"><ArrowLeft size={20} /></Button>
                  <div>
                      <h1 className="text-2xl font-bold text-ink capitalize font-serif">{activeSection === 'kana' ? 'Kana Systems' : activeSection?.replace('_', ' ')}</h1>
                      <p className="text-sm text-bamboo">Current Mode: {viewMode.replace('_', ' ')}</p>
                  </div>
              </div>
              {activeSection !== 'listening' && activeSection !== 'conversation' && (
                  <div className="flex flex-wrap gap-2 bg-white/40 p-1.5 rounded-xl border border-bamboo/10">
                       {getAvailableModes().map(m => (
                           <button key={m.id} onClick={() => setViewMode(m.id as any)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === m.id ? 'bg-hanko text-white shadow-lg' : 'text-bamboo hover:text-hanko hover:bg-white/60'}`}>
                              <m.icon size={16} /> {m.label}
                           </button>
                       ))}
                  </div>
              )}
          </div>
  
          {activeSection === 'kana' && (
              <>
                {viewMode === 'list' && (
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-4 p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-bamboo/10 relative z-10 shadow-sm">
                            <div className="flex gap-1 p-1 bg-rice/50 rounded-xl border border-bamboo/5 shadow-inner">
                                {['Hiragana', 'Katakana', 'Mixed'].map(sys => (
                                    <button 
                                        key={sys} 
                                        onClick={() => setKanaSystem(sys as any)} 
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${kanaSystem === sys ? 'bg-hanko text-white shadow-md' : 'text-bamboo hover:text-hanko hover:bg-white/60'}`}
                                    >
                                        {sys}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-1 p-1 bg-rice/50 rounded-xl border border-bamboo/5 shadow-inner">
                                {['basic', 'dakuten', 'youon'].map(v => (
                                    <button 
                                        key={v} 
                                        onClick={() => setKanaVar(v as any)} 
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${kanaVar === v ? 'bg-hanko text-white shadow-sm' : 'text-bamboo hover:bg-white/50'}`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                {isPlayingAll ? (
                                    <Button size="sm" variant="danger" onClick={handlePlayAll} className="rounded-xl shadow-lg animate-pulse">
                                        <Square size={14} fill="currentColor" className="mr-2" /> Stop
                                    </Button>
                                ) : (
                                    <Button size="sm" variant="secondary" onClick={handlePlayAll} className="rounded-xl shadow-sm hover:shadow-md">
                                        <Volume2 size={14} className="mr-2" /> Listen All
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className={`grid gap-4 ${kanaSystem === 'Mixed' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6'}`}>
                            {currentContent.map((item) => {
                                const extendedItem = item as ExtendedLearningItem;
                                const isMixed = !!extendedItem.kanaPair;
                                // Check if item is a combination sound (Youon) like 'kya', 'shu' which has length > 1
                                const isYouon = item.ja.length > 1; 
                                
                                return (
                                    <GlassCard 
                                        key={item.id} 
                                        id={`card-${item.id}`}
                                        className={`group relative flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden 
                                            ${isMixed ? 'aspect-[2/1] py-4' : 'aspect-square'}
                                            ${activeCardId === item.id 
                                                ? '!border-hanko !border-2 !bg-white !scale-105 !shadow-2xl !z-50 !ring-4 !ring-hanko/20 -translate-y-2' 
                                                : 'hover:-translate-y-1 hover:shadow-lg hover:border-hanko/30 bg-white/60'}
                                        `}
                                        onClick={() => speak(item.ja)}
                                    >
                                        <div className="absolute inset-0 washi-texture opacity-30 pointer-events-none" />
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-bamboo/50">
                                            <Volume2 size={16} />
                                        </div>

                                        {isMixed ? (
                                            <div className="flex items-center justify-around w-full px-4 relative z-10">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] font-black text-bamboo/40 uppercase tracking-widest mb-1">Hiragana</span>
                                                    <div className={`${isYouon ? 'text-4xl md:text-5xl tracking-tighter' : 'text-5xl md:text-6xl'} font-jp font-bold text-ink drop-shadow-sm transition-transform group-hover:scale-110`}>{item.ja}</div>
                                                </div>
                                                <div className="h-12 w-px bg-gradient-to-b from-transparent via-bamboo/20 to-transparent mx-2"></div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-1">Katakana</span>
                                                    <div className={`${isYouon ? 'text-4xl md:text-5xl tracking-tighter' : 'text-5xl md:text-6xl'} font-jp font-bold text-blue-600 drop-shadow-sm transition-transform group-hover:scale-110`}>{extendedItem.kanaPair}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`relative z-10 ${isYouon ? 'text-5xl md:text-6xl tracking-tighter' : 'text-6xl md:text-7xl'} font-jp font-bold mb-2 drop-shadow-sm transition-transform duration-300 group-hover:scale-110 ${item.category === 'Katakana' ? 'text-blue-600' : 'text-ink'}`}>
                                                {item.ja}
                                            </div>
                                        )}
                                        
                                        <div className={`relative z-10 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mt-2 shadow-sm border ${item.category === 'Katakana' ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-hanko bg-orange-50 border-orange-100'}`}>
                                            {item.romaji}
                                        </div>
                                    </GlassCard>
                                );
                            })}
                        </div>
                    </div>
                )}

                {viewMode === 'quiz' && (
                    <div className="space-y-8 max-w-4xl mx-auto">
                        <KanaQuizView items={currentContent} onExit={() => setViewMode('list')} />
                    </div>
                )}

                {viewMode === 'flashcard' && <FlashcardView items={currentContent} />}
                
                {viewMode === 'particle' && <QuizView items={currentContent} customMode="particle" onComplete={handleLessonComplete} />}
                
                {viewMode === 'story' && <LessonStoryView items={currentContent} />}
                
                {viewMode === 'song' && <LessonSongView items={currentContent} />}
              </>
          )}

          {activeSection !== 'kana' && (
              <>
                {viewMode === 'list' && (
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-4 p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-bamboo/10 relative z-10 shadow-sm">
                            {(activeSection === 'vocab' || activeSection === 'kanji') && (
                                <>
                                    <div className="flex p-1 bg-rice/50 rounded-xl border border-bamboo/5 shadow-inner">
                                        <button onClick={() => setLessonMode('lesson')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${lessonMode === 'lesson' ? 'bg-hanko text-white shadow-md' : 'text-bamboo hover:text-hanko'}`}>By Lesson</button>
                                        <button onClick={() => setLessonMode('category')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${lessonMode === 'category' ? 'bg-hanko text-white shadow-md' : 'text-bamboo hover:text-hanko'}`}>By Category</button>
                                    </div>
                                    
                                    {lessonMode === 'lesson' ? (
                                        <select value={selectedLesson} onChange={(e) => setSelectedLesson(Number(e.target.value))} className="bg-white border border-bamboo/20 rounded-lg px-3 py-1.5 text-sm font-bold text-ink outline-none focus:ring-2 focus:ring-hanko/20">
                                            {uniqueLessons.map(l => (
                                                <option key={l} value={l}>Lesson {l} {isComplete(`${activeSection}-lesson-${l}`) ? '✓' : ''}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-white border border-bamboo/20 rounded-lg px-3 py-1.5 text-sm font-bold text-ink outline-none focus:ring-2 focus:ring-hanko/20">
                                            {Array.from(new Set((activeSection === 'vocab' ? VOCAB_DATA : KANJI_DATA).map(v => v.category))).filter(Boolean).sort().map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    )}
                                </>
                            )}

                            {activeSection === 'grammar' && (
                                <select value={selectedLesson} onChange={(e) => setSelectedLesson(Number(e.target.value))} className="bg-white border border-bamboo/20 rounded-lg px-3 py-1.5 text-sm font-bold text-ink outline-none focus:ring-2 focus:ring-hanko/20">
                                    {Array.from(new Set(GRAMMAR_DATA.map(g => g.lesson))).sort((a,b) => a-b).map(l => (
                                        <option key={l} value={l}>Grammar Lesson {l} {isComplete(`grammar-lesson-${l}`) ? '✓' : ''}</option>
                                    ))}
                                </select>
                            )}

                            {activeSection === 'counter' && (
                                <select value={selectedCounterGroup} onChange={(e) => setSelectedCounterGroup(e.target.value)} className="bg-white border border-bamboo/20 rounded-lg px-3 py-1.5 text-sm font-bold text-ink outline-none focus:ring-2 focus:ring-hanko/20">
                                    {COUNTER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            )}

                            {activeSection === 'number' && (
                                <select value={selectedNumberGroup} onChange={(e) => setSelectedNumberGroup(e.target.value)} className="bg-white border border-bamboo/20 rounded-lg px-3 py-1.5 text-sm font-bold text-ink outline-none focus:ring-2 focus:ring-hanko/20">
                                    {NUMBER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            )}
                            
                            <div className="ml-auto flex gap-2">
                                 <button 
                                    onClick={() => setSortMethod(sortMethod === 'az' ? 'default' : 'az')} 
                                    className={`p-2.5 rounded-xl transition-all border shadow-sm ${sortMethod === 'az' ? 'bg-hanko text-white border-hanko' : 'bg-white text-bamboo border-bamboo/10 hover:text-hanko hover:border-hanko/30'}`} 
                                    title="Sort A-Z"
                                 >
                                    <SortAsc size={18} />
                                 </button>
                                 <button 
                                    onClick={handlePlayAll} 
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border shadow-sm font-bold text-sm ${isPlayingAll ? 'bg-red-500 text-white border-red-600 animate-pulse' : 'bg-white text-bamboo border-bamboo/10 hover:text-hanko hover:border-hanko/30'}`} 
                                    title="Play All"
                                 >
                                    {isPlayingAll ? <Square size={16} fill="currentColor" /> : <Volume2 size={16} />}
                                    {isPlayingAll ? 'Stop' : 'Listen All'}
                                 </button>
                            </div>
                        </div>

                        <div className={`grid gap-4 ${activeSection === 'kanji' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                            {currentContent.map((item) => (
                                activeSection === 'kanji' ? <KanjiCard key={item.id} item={item} isActive={activeCardId === item.id} /> :
                                activeSection === 'vocab' ? <VocabPracticeCard key={item.id} item={item} isActive={activeCardId === item.id} /> :
                                <GlassCard key={item.id} id={`card-${item.id}`} className={`relative group transition-all cursor-pointer ${activeCardId === item.id ? 'border-hanko scale-105 shadow-xl z-10' : 'hover:border-hanko/30'}`} onClick={() => speak(item.ja)}>
                                    <div className="text-3xl font-jp font-bold text-ink mb-2">{item.ja}</div>
                                    <div className="text-hanko font-medium mb-3">{item.romaji}</div>
                                    <div className="pt-3 border-t border-bamboo/10"><p className="text-ink/80">{item.en}</p></div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>
                )}
                
                {viewMode === 'flashcard' && <FlashcardView items={currentContent} />}
                
                {viewMode === 'quiz' && <QuizView items={currentContent} onComplete={handleLessonComplete} />}
                
                {viewMode === 'particle' && <QuizView items={currentContent} customMode="particle" onComplete={handleLessonComplete} />}
                
                {viewMode === 'story' && <LessonStoryView items={currentContent} />}
                
                {viewMode === 'song' && <LessonSongView items={currentContent} />}
              </>
          )}
      </div>
    );
};