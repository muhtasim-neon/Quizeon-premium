import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { Gamepad2, Brain, Zap, RotateCw, Heart, Timer, CheckCircle, XCircle, Bookmark } from 'lucide-react';
import { VOCAB_DATA, KANJI_DATA } from '../data/mockContent';
import { LearningItem, QuizQuestion } from '../types';
import { progressService } from '../services/progressService';

// --- Sub-components for Cleanliness ---

const QuizModule: React.FC<{ onExit: () => void }> = ({ onExit }) => {
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
      new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav').play().catch(()=>{}); // Placeholder sound
    } else {
      setLives(l => l - 1);
      setFeedback('wrong');
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
    useEffect(() => { progressService.addXP(score); }, []);
    
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
        setTimeout(() => setIdx((idx + 1) % cards.length), 150);
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

    return (
        <div className="max-w-md mx-auto text-center">
            <div className="flex justify-between items-center mb-6">
                <Button variant="ghost" onClick={onExit}>Exit</Button>
                <span className="text-slate-400">{idx + 1} / {cards.length}</span>
            </div>

            <div 
                className="relative w-full h-80 perspective-1000 cursor-pointer group"
                onClick={() => setFlipped(!flipped)}
            >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
                    {/* Front */}
                    <GlassCard className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center border-primary/30">
                        <button 
                            onClick={toggleSave}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-white/10 transition-colors z-20"
                            title={isSaved ? "Remove from saved" : "Save for later"}
                        >
                            <Bookmark size={24} className={isSaved ? "fill-primary text-primary" : "text-slate-400"} />
                        </button>
                        
                        <span className="text-xs uppercase tracking-widest text-primary mb-4">{current.type}</span>
                        <h2 className="text-6xl font-jp font-bold text-white mb-2">{current.ja}</h2>
                        <p className="text-slate-400">Click to flip</p>
                    </GlassCard>
                    
                    {/* Back */}
                    <GlassCard className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center border-green-500/30">
                        <button 
                            onClick={toggleSave}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-white/10 transition-colors z-20"
                            title={isSaved ? "Remove from saved" : "Save for later"}
                        >
                            <Bookmark size={24} className={isSaved ? "fill-primary text-primary" : "text-slate-400"} />
                        </button>

                        <h3 className="text-3xl font-bold text-white mb-2">{current.en}</h3>
                        <p className="text-xl text-primary mb-4">{current.romaji}</p>
                        {current.bn && <p className="text-slate-400 text-sm">🇧🇩 {current.bn}</p>}
                    </GlassCard>
                </div>
            </div>

            <div className="mt-8 flex gap-4 justify-center">
                <Button variant="secondary" onClick={() => setFlipped(!flipped)}>
                    <RotateCw size={18} /> Flip
                </Button>
                <Button onClick={nextCard}>
                    Next Card <Zap size={18} />
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
    <div className="space-y-8">
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