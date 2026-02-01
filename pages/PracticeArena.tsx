import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { Gamepad2, Brain, Zap, RotateCw, Heart, Timer, CheckCircle, XCircle, Bookmark, ArrowRight, ArrowLeft, Volume2, Keyboard } from 'lucide-react';
import { VOCAB_DATA, KANJI_DATA } from '../data/mockContent';
import { LearningItem, QuizQuestion } from '../types';
import { progressService } from '../services/progressService';
import { useSettings } from '../contexts/SettingsContext';

// --- Sub-components for Cleanliness ---

const QuizModule: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { playSound } = useSettings();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Init Quiz
  useEffect(() => {
    // Generate questions from VOCAB_DATA
    const generated: QuizQuestion[] = VOCAB_DATA.map(item => {
        // Create 3 wrong answers
        const wrong = VOCAB_DATA
            .filter(v => v.id !== item.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(v => v.en);
        
        const options = [...wrong, item.en].sort(() => 0.5 - Math.random());
        
        return {
            id: item.id,
            question: `What is "${item.ja}" (${item.romaji})?`,
            correctAnswer: item.en,
            options,
            type: 'text' as const
        };
    }).sort(() => 0.5 - Math.random()).slice(0, 10); // Take 10 random
    setQuestions(generated);
  }, []);

  // Timer
  useEffect(() => {
    if (gameOver || feedback) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(''); // Time out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver, feedback]);

  const handleAnswer = (answer: string) => {
    const currentQ = questions[currentIdx];
    const isCorrect = answer === currentQ.correctAnswer;

    if (isCorrect) {
      setScore(s => s + 10);
      setFeedback('correct');
      playSound('correct');
    } else {
      setLives(l => l - 1);
      setFeedback('wrong');
      playSound('wrong');
      // Find the original item to save mistake
      const item = VOCAB_DATA.find(v => v.en === currentQ.correctAnswer);
      if (item) progressService.addMistake(item);
      
      if (lives - 1 <= 0) {
        setTimeout(() => setGameOver(true), 1000);
        return;
      }
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1);
        setTimeLeft(15);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  if (gameOver) {
    // Save XP
    useEffect(() => { progressService.addXP(score); playSound('success'); }, []);
    
    return (
      <GlassCard className="max-w-md mx-auto text-center py-12">
        <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
        <div className="text-6xl mb-6">🎉</div>
        <p className="text-slate-400 mb-6">You scored</p>
        <div className="text-5xl font-bold text-primary mb-8">{score} XP</div>
        <Button onClick={onExit}>Back to Arena</Button>
      </GlassCard>
    );
  }

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto">
        {/* HUD */}
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-red-400">
                <Heart fill="currentColor" /> <span className="font-bold text-xl">{lives}</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
                <Timer /> <span className="font-bold text-xl">{timeLeft}s</span>
            </div>
            <div className="px-4 py-1 bg-white/10 rounded-full text-sm">
                Q: {currentIdx + 1} / {questions.length}
            </div>
        </div>

        {/* Question Card */}
        <GlassCard className={`min-h-[300px] flex flex-col justify-center text-center mb-6 transition-all duration-300 ${
            feedback === 'correct' ? 'border-green-500 bg-green-500/10' : 
            feedback === 'wrong' ? 'border-red-500 bg-red-500/10' : ''
        }`}>
            <h3 className="text-2xl text-slate-300 mb-4">{currentQ.question}</h3>
            
            {feedback === 'correct' && <CheckCircle className="mx-auto text-green-500 w-16 h-16 animate-bounce" />}
            {feedback === 'wrong' && <XCircle className="mx-auto text-red-500 w-16 h-16 animate-bounce" />}
        </GlassCard>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options.map((opt, i) => (
                <Button 
                    key={i} 
                    variant="secondary" 
                    className="py-6 text-lg"
                    onClick={() => !feedback && handleAnswer(opt)}
                    disabled={!!feedback}
                >
                    {opt}
                </Button>
            ))}
        </div>
    </div>
  );
};

const FlashcardModule: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const { speak, playSound } = useSettings();
    const [flipped, setFlipped] = useState(false);
    const [idx, setIdx] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const cards = [...VOCAB_DATA, ...KANJI_DATA]; // Mix content
    const SAVED_KEY = 'saved_flashcards';
    
    const current = cards[idx];

    // Check if current card is saved on load or index change
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
        setIsSaved(saved.some((item: LearningItem) => item.id === current.id));
    }, [current.id]);
    
    const nextCard = () => {
        setFlipped(false);
        setTimeout(() => setIdx((idx + 1) % cards.length), 200);
    };

    const prevCard = () => {
        setFlipped(false);
        setTimeout(() => setIdx((idx - 1 + cards.length) % cards.length), 200);
    };

    const toggleSave = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card flip
        const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
        
        if (isSaved) {
            // Remove
            const newSaved = saved.filter((item: LearningItem) => item.id !== current.id);
            localStorage.setItem(SAVED_KEY, JSON.stringify(newSaved));
            setIsSaved(false);
        } else {
            // Add
            saved.push(current);
            localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
            setIsSaved(true);
        }
    };

    const handleSpeak = (e: React.MouseEvent) => {
        e.stopPropagation();
        speak(current.ja);
    };

    const handleFlip = () => {
        if (!flipped) playSound('flip');
        setFlipped(!flipped);
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextCard();
            if (e.key === 'ArrowLeft') prevCard();
            if (e.key === ' ') {
                e.preventDefault();
                handleFlip();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [idx, cards.length, flipped]); // Dependencies needed for next/prev calculation inside effect or use prev state logic

    return (
        <div className="max-w-2xl mx-auto text-center animate-fade-in relative">
            <div className="flex justify-between items-center mb-6 px-2">
                <Button variant="ghost" onClick={onExit}><ArrowLeft size={18} className="mr-2" /> Exit</Button>
                <div className="flex items-center gap-2">
                     <span className="text-slate-400 text-sm font-mono">{idx + 1} / {cards.length}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">
                     <Keyboard size={12} /> Space to Flip
                </div>
            </div>

            {/* 3D CARD CONTAINER */}
            <div 
                className="relative w-full aspect-[4/3] md:aspect-[16/9] perspective-[1200px] cursor-pointer group mb-8"
                onClick={handleFlip}
            >
                <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
                    
                    {/* --- FRONT FACE --- */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-[32px] p-[1px] bg-gradient-to-br from-white/20 to-white/0 border border-white/10 shadow-2xl shadow-primary/5 hover:scale-[1.02] transition-transform duration-500">
                        <div className="w-full h-full rounded-[31px] bg-slate-900/40 backdrop-blur-2xl flex flex-col items-center justify-center relative overflow-hidden">
                             
                             {/* Ambient Effects */}
                             <div className="absolute -top-20 -right-20 w-56 h-56 bg-purple-500/20 rounded-full blur-[80px]"></div>

                             {/* Controls */}
                            <div className="absolute top-6 right-6 flex gap-3 z-20">
                                <button onClick={handleSpeak} className="p-3 rounded-full bg-white/5 hover:bg-white/20 text-slate-300 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:border-white/20 hover:scale-110 active:scale-95"><Volume2 size={20} /></button>
                                <button 
                                    onClick={toggleSave}
                                    className={`p-3 rounded-full transition-all backdrop-blur-md border hover:scale-110 active:scale-95 ${isSaved ? 'bg-primary text-white border-primary/50 shadow-lg shadow-primary/30' : 'bg-white/5 text-slate-400 hover:text-white border-white/10'}`}
                                >
                                    <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                                </button>
                            </div>

                            <div className="relative z-10 flex flex-col items-center">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80 mb-8 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">{current.type}</span>
                                <h2 className="text-7xl md:text-9xl font-jp font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tracking-tight">{current.ja}</h2>
                                <p className="text-slate-400 text-sm font-medium animate-pulse mt-4 flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full border border-white/5"><RotateCw size={14} /> Tap to flip</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* --- BACK FACE --- */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[32px] p-[1px] bg-gradient-to-br from-purple-500/20 to-blue-500/0 border border-white/10 shadow-2xl backdrop-blur-xl">
                        <div className="w-full h-full rounded-[31px] bg-slate-900/80 flex flex-col items-center justify-center relative overflow-hidden p-8">
                             
                             {/* Ambient Effects */}
                             <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-blue-500/10 rounded-full blur-[80px]"></div>

                             {/* Controls */}
                            <div className="absolute top-6 right-6 flex gap-3 z-20">
                                <button 
                                    onClick={toggleSave}
                                    className={`p-3 rounded-full transition-all backdrop-blur-md border hover:scale-110 active:scale-95 ${isSaved ? 'bg-primary text-white border-primary/50 shadow-lg shadow-primary/30' : 'bg-white/5 text-slate-400 hover:text-white border-white/5'}`}
                                >
                                    <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                                </button>
                            </div>
                            
                            <div className="text-center space-y-4 max-w-lg relative z-10">
                                <div>
                                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">{current.en}</h3>
                                    <p className="text-2xl text-primary font-medium tracking-wide">{current.romaji}</p>
                                </div>
                                <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto my-6"></div>
                                {current.bn && <p className="text-slate-300 text-lg">🇧🇩 {current.bn}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-4 justify-center">
                <Button variant="secondary" onClick={prevCard} className="w-32 group">
                   <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Prev
                </Button>
                <Button onClick={nextCard} className="w-32 group">
                    Next <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    );
};

// --- Main Arena Page ---

export const PracticeArena: React.FC = () => {
  const [mode, setMode] = useState<'menu' | 'quiz' | 'flashcards'>('menu');

  if (mode === 'quiz') return <QuizModule onExit={() => setMode('menu')} />;
  if (mode === 'flashcards') return <FlashcardModule onExit={() => setMode('menu')} />;

  return (
    <div className="space-y-8 animate-fade-in">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Practice Arena</h1>
           <p className="text-slate-400">Test your knowledge and strengthen your memory</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard 
                hoverEffect 
                className="group cursor-pointer relative overflow-hidden h-64 flex flex-col justify-end"
                onClick={() => setMode('quiz')}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="absolute top-4 right-4 bg-primary p-3 rounded-xl z-20 shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform">
                    <Gamepad2 size={32} className="text-white" />
                </div>
                <div className="relative z-20 p-2">
                    <h3 className="text-2xl font-bold text-white">Quiz Challenge</h3>
                    <p className="text-slate-300 text-sm mt-1">Time attack mode with score tracking.</p>
                </div>
            </GlassCard>

            <GlassCard 
                hoverEffect 
                className="group cursor-pointer relative overflow-hidden h-64 flex flex-col justify-end"
                onClick={() => setMode('flashcards')}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="absolute top-4 right-4 bg-green-500 p-3 rounded-xl z-20 shadow-lg shadow-green-500/40 group-hover:scale-110 transition-transform">
                    <Zap size={32} className="text-white" />
                </div>
                <div className="relative z-20 p-2">
                    <h3 className="text-2xl font-bold text-white">Flashcards</h3>
                    <p className="text-slate-300 text-sm mt-1">Review vocab and kanji at your own pace.</p>
                </div>
            </GlassCard>

            <GlassCard className="relative overflow-hidden h-64 flex flex-col justify-end opacity-60">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="absolute top-4 right-4 bg-purple-500 p-3 rounded-xl z-20">
                    <Brain size={32} className="text-white" />
                </div>
                <div className="relative z-20 p-2">
                    <h3 className="text-2xl font-bold text-white">Typing Game</h3>
                    <p className="text-slate-300 text-sm mt-1">Kana typing speed test. (Coming Soon)</p>
                </div>
            </GlassCard>
        </div>
    </div>
  );
};