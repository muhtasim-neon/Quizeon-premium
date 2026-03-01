
import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Badge } from '@/components/UI';
import { RefreshCw, CheckCircle, XCircle, RotateCw, Calendar, Brain, Clock, Zap, ThumbsUp, ThumbsDown } from 'lucide-react';
import { LearningItem, SRSItemState } from '@/types';
import { progressService } from '@/services/progressService';
import { useSettings } from '@/contexts/SettingsContext';
import { AnimatePresence, motion } from 'framer-motion';

interface SRSViewProps {
    allItems: LearningItem[];
    onExit: () => void;
}

export const SRSView: React.FC<SRSViewProps> = ({ allItems, onExit }) => {
    const { speak, playSound } = useSettings();
    const [reviewQueue, setReviewQueue] = useState<LearningItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ new: 0, review: 0, future: 0 });
    const [feedbackStatus, setFeedbackStatus] = useState<'correct' | 'wrong' | null>(null);

    useEffect(() => {
        loadSRSQueue();
    }, []);

    const loadSRSQueue = () => {
        setLoading(true);
        const srsData = progressService.getSRSStats();
        const now = Date.now();

        // 1. Identify items due for review
        const dueItems = allItems.filter(item => {
            const stat = srsData[item.id];
            // If it has a stat and nextReview is in the past, it's due
            return stat && stat.nextReview <= now;
        });

        // 2. Identify new items (limit to 5 per session if queue is small, or fill up to 10 total)
        // If an item is NOT in srsData, it is considered 'new'
        const newItems = allItems.filter(item => !srsData[item.id]);
        
        // Simple logic: Prioritize reviews. If reviews < 10, add new items until 10.
        let queue = [...dueItems];
        const slotsRemaining = 15 - queue.length;
        
        if (slotsRemaining > 0) {
            // Shuffle new items and pick
            const randomNew = newItems.sort(() => 0.5 - Math.random()).slice(0, slotsRemaining);
            queue = [...queue, ...randomNew];
        }

        // Stats calculation
        const totalTracked = Object.keys(srsData).length;
        const totalDue = dueItems.length;
        
        setStats({
            review: totalDue,
            new: newItems.length,
            future: totalTracked - totalDue
        });

        setReviewQueue(queue);
        setCurrentIndex(0);
        setIsComplete(queue.length === 0);
        setLoading(false);
    };

    const handleFlip = () => {
        if (feedbackStatus) return; // Prevent flip during feedback animation
        setIsFlipped(!isFlipped);
        if (!isFlipped) {
            playSound('flip');
            // Speak Japanese when revealing answer (back of card)
            if (reviewQueue[currentIndex]) {
                speak(reviewQueue[currentIndex].ja);
            }
        }
    };

    const handleResult = (success: boolean) => {
        if (feedbackStatus) return; // Prevent double clicks

        const item = reviewQueue[currentIndex];
        
        // 1. Visual Feedback
        setFeedbackStatus(success ? 'correct' : 'wrong');
        if (success) playSound('correct');
        else playSound('wrong');

        // 2. Logic Update & Transition
        setTimeout(() => {
            progressService.updateSRSItem(item.id, success);
            
            if (success) {
                progressService.addXP(15);
            }

            if (currentIndex < reviewQueue.length - 1) {
                // Prepare for next card
                setIsFlipped(false);
                setFeedbackStatus(null);
                setTimeout(() => {
                    setCurrentIndex(prev => prev + 1);
                }, 300); // Wait for flip back
            } else {
                setIsComplete(true);
                playSound('success');
            }
        }, 800); // Wait for feedback animation
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-hanko">
                <RefreshCw className="animate-spin mb-4" size={48} />
                <p>Consulting the Oracle...</p>
            </div>
        );
    }

    if (isComplete && reviewQueue.length === 0) {
        return (
            <div className="max-w-xl mx-auto text-center py-12 animate-fade-in">
                <GlassCard className="bg-white/80 backdrop-blur-xl border border-bamboo/10">
                    <div className="absolute inset-0 washi-texture opacity-30 pointer-events-none"></div>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-inner relative z-10">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-ink mb-2 font-serif relative z-10">All Caught Up!</h2>
                    <p className="text-bamboo mb-8 relative z-10">
                        There are no cards due for review right now. <br/>
                        Check back later or explore other lessons!
                    </p>
                    <div className="flex gap-4 justify-center relative z-10">
                        <Button variant="secondary" onClick={onExit}>Return to Hub</Button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    if (isComplete) {
        return (
            <div className="max-w-xl mx-auto text-center py-12 animate-fade-in">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 animate-pop">🎉</div>
                    <div className="absolute top-1/3 right-1/4 animate-pop" style={{animationDelay: '0.2s'}}>⭐</div>
                </div>
                <GlassCard className="bg-white border-t-4 border-hanko relative overflow-hidden">
                    <div className="absolute inset-0 washi-texture opacity-30 pointer-events-none"></div>
                    <div className="w-20 h-20 bg-hanko/10 rounded-full flex items-center justify-center mx-auto mb-6 text-hanko shadow-lg shadow-hanko/20 relative z-10">
                        <Brain size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-ink mb-2 font-serif relative z-10">Session Complete!</h2>
                    <p className="text-bamboo mb-6 relative z-10">
                        You reviewed <span className="font-bold text-ink">{reviewQueue.length}</span> items.
                        Your memory is getting stronger!
                    </p>
                    <div className="bg-rice p-4 rounded-2xl mb-8 flex justify-around relative z-10 border border-bamboo/10">
                        <div className="text-center">
                            <div className="text-xs text-bamboo font-bold uppercase">Reviewed</div>
                            <div className="text-xl font-bold text-ink">{stats.review + Math.min(15, stats.new)}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-bamboo font-bold uppercase">Up Next</div>
                            <div className="text-xl font-bold text-blue-600">Tomorrow</div>
                        </div>
                    </div>
                    <div className="flex gap-4 justify-center relative z-10">
                        <Button variant="secondary" onClick={onExit}>Finish</Button>
                        <Button onClick={loadSRSQueue}><RefreshCw size={18} className="mr-2" /> Study More</Button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    const currentItem = reviewQueue[currentIndex];
    const progress = ((currentIndex) / reviewQueue.length) * 100;

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onExit} size="sm">← Exit</Button>
                <div className="flex items-center gap-4 text-xs font-bold text-bamboo uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Clock size={14} /> Due: {reviewQueue.length - currentIndex}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-white/50">
                <div 
                    className="h-full bg-hanko transition-all duration-300 ease-out" 
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Flashcard Area */}
            <div className="perspective-1000 w-full aspect-[4/3] md:aspect-[16/9] relative group cursor-pointer" onClick={handleFlip}>
                <motion.div 
                    className="w-full h-full relative transition-all duration-500 transform-style-3d"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rounded-[32px] overflow-hidden shadow-xl shadow-ink/5 bg-white border border-bamboo/10">
                        <div className="absolute inset-0 washi-texture opacity-40 pointer-events-none"></div>
                        <div className="h-full flex flex-col items-center justify-center relative z-10">
                            <div className="absolute top-6 left-6">
                                <Badge color="bg-rice text-bamboo border-bamboo/20">
                                    {currentItem.type === 'kanji' ? 'Kanji' : 'Vocab'}
                                </Badge>
                            </div>
                            <div className="text-center">
                                <h2 className="text-7xl md:text-9xl font-jp font-bold text-ink mb-6 drop-shadow-sm">
                                    {currentItem.ja}
                                </h2>
                                <p className="text-sm text-bamboo font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-rice/50 px-4 py-2 rounded-full border border-bamboo/10">
                                    <RotateCw size={12} className={isFlipped ? "" : "animate-spin-slow"} /> Tap to Flip
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Back */}
                    <div 
                        className="absolute inset-0 w-full h-full backface-hidden rounded-[32px] overflow-hidden shadow-xl shadow-ink/5 bg-white border border-bamboo/10" 
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <div className="absolute inset-0 washi-texture opacity-40 pointer-events-none"></div>
                        
                        {/* Feedback Overlay */}
                        <AnimatePresence>
                            {feedbackStatus && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-sm ${
                                        feedbackStatus === 'correct' ? 'bg-green-500/10' : 'bg-red-500/10'
                                    }`}
                                >
                                    <motion.div 
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1.2, opacity: 1 }}
                                        className={`p-6 rounded-full ${feedbackStatus === 'correct' ? 'bg-green-500 text-white' : 'bg-hanko text-white'}`}
                                    >
                                        {feedbackStatus === 'correct' ? <ThumbsUp size={48} /> : <ThumbsDown size={48} />}
                                    </motion.div>
                                    <motion.p 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className={`mt-4 text-2xl font-black uppercase tracking-widest ${feedbackStatus === 'correct' ? 'text-green-600' : 'text-hanko'}`}
                                    >
                                        {feedbackStatus === 'correct' ? 'Mastered!' : 'Reviewing...'}
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="h-full flex flex-col items-center justify-center relative z-10 p-8 text-center">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs text-bamboo font-bold uppercase tracking-widest mb-2">Reading</p>
                                    <p className="text-4xl text-hanko font-medium font-sans">{currentItem.romaji}</p>
                                </div>
                                <div className="w-16 h-1 bg-bamboo/10 mx-auto rounded-full"></div>
                                <div>
                                    <p className="text-xs text-bamboo font-bold uppercase tracking-widest mb-2">Meaning</p>
                                    <p className="text-5xl font-bold text-ink font-serif">{currentItem.en}</p>
                                    {currentItem.bn && <p className="text-xl text-bamboo mt-3 font-serif opacity-80">🇧🇩 {currentItem.bn}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="h-24 flex items-center justify-center">
                {!isFlipped ? (
                    <Button onClick={handleFlip} className="w-full py-4 text-lg shadow-xl shadow-wood/20 border-b-4 border-wood/50">
                        Show Answer
                    </Button>
                ) : (
                    <div className="grid grid-cols-2 gap-4 w-full animate-fade-in">
                        <Button 
                            variant="danger" 
                            className="py-4 text-lg border-b-4 border-red-800 bg-hanko hover:bg-red-700 shadow-lg shadow-red-200"
                            onClick={(e) => { e.stopPropagation(); handleResult(false); }}
                            disabled={feedbackStatus !== null}
                        >
                            <XCircle size={20} className="mr-2" /> Hard
                        </Button>
                        <Button 
                            className="py-4 text-lg border-b-4 border-emerald-700 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                            onClick={(e) => { e.stopPropagation(); handleResult(true); }}
                            disabled={feedbackStatus !== null}
                        >
                            <CheckCircle size={20} className="mr-2" /> Easy
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
