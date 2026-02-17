
import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Badge } from './UI';
import { RefreshCw, CheckCircle, XCircle, RotateCw, Calendar, Brain, Clock, Zap } from 'lucide-react';
import { LearningItem, SRSItemState } from '../types';
import { progressService } from '../services/progressService';
import { useSettings } from '../contexts/SettingsContext';
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
        const item = reviewQueue[currentIndex];
        
        // 1. Update Logic
        progressService.updateSRSItem(item.id, success);
        
        // 2. XP & Sounds
        if (success) {
            playSound('correct');
            progressService.addXP(15);
        } else {
            playSound('wrong');
        }

        // 3. Advance
        if (currentIndex < reviewQueue.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
        } else {
            setIsComplete(true);
            playSound('success');
        }
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
                <GlassCard className="bg-white/80 backdrop-blur-xl">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-inner">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-ink mb-2 font-serif">All Caught Up!</h2>
                    <p className="text-bamboo mb-8">
                        There are no cards due for review right now. <br/>
                        Check back later or explore other lessons!
                    </p>
                    <div className="flex gap-4 justify-center">
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
                <GlassCard className="bg-white border-t-4 border-hanko">
                    <div className="w-20 h-20 bg-hanko/10 rounded-full flex items-center justify-center mx-auto mb-6 text-hanko shadow-lg shadow-hanko/20">
                        <Brain size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-ink mb-2 font-serif">Session Complete!</h2>
                    <p className="text-bamboo mb-6">
                        You reviewed <span className="font-bold text-ink">{reviewQueue.length}</span> items.
                        Your memory is getting stronger!
                    </p>
                    <div className="bg-rice p-4 rounded-2xl mb-8 flex justify-around">
                        <div className="text-center">
                            <div className="text-xs text-bamboo font-bold uppercase">Reviewed</div>
                            <div className="text-xl font-bold text-ink">{stats.review + Math.min(15, stats.new)}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-bamboo font-bold uppercase">Up Next</div>
                            <div className="text-xl font-bold text-blue-600">Tomorrow</div>
                        </div>
                    </div>
                    <div className="flex gap-4 justify-center">
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
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
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
                    transition={{ duration: 0.4, animationDirection: "normal" }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                        <GlassCard className="h-full flex flex-col items-center justify-center border-b-8 border-bamboo/10 shadow-xl">
                            <div className="absolute top-4 left-4">
                                <Badge color="bg-rice text-bamboo border-bamboo/20">
                                    {currentItem.type === 'kanji' ? 'Kanji' : 'Vocab'}
                                </Badge>
                            </div>
                            <div className="text-center">
                                <h2 className="text-6xl md:text-8xl font-jp font-bold text-ink mb-4 drop-shadow-sm">
                                    {currentItem.ja}
                                </h2>
                                <p className="text-sm text-bamboo/50 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                    <RotateCw size={12} /> Tap to Flip
                                </p>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180" style={{ transform: 'rotateY(180deg)' }}>
                        <GlassCard className="h-full flex flex-col items-center justify-center border-b-8 border-hanko/20 shadow-xl bg-white/95">
                            <div className="text-center space-y-4 p-4">
                                <div>
                                    <p className="text-sm text-bamboo font-bold uppercase tracking-widest mb-1">Reading</p>
                                    <p className="text-3xl text-hanko font-medium">{currentItem.romaji}</p>
                                </div>
                                <div className="w-16 h-1 bg-rice mx-auto rounded-full"></div>
                                <div>
                                    <p className="text-sm text-bamboo font-bold uppercase tracking-widest mb-1">Meaning</p>
                                    <p className="text-4xl font-bold text-ink">{currentItem.en}</p>
                                    {currentItem.bn && <p className="text-lg text-bamboo mt-1 font-serif">🇧🇩 {currentItem.bn}</p>}
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="h-24 flex items-center justify-center">
                {!isFlipped ? (
                    <Button onClick={handleFlip} className="w-full py-4 text-lg shadow-xl shadow-purple-200">
                        Show Answer
                    </Button>
                ) : (
                    <div className="grid grid-cols-2 gap-4 w-full animate-fade-in">
                        <Button 
                            variant="danger" 
                            className="py-4 text-lg border-b-4 border-red-700 bg-red-500 hover:bg-red-600"
                            onClick={(e) => { e.stopPropagation(); handleResult(false); }}
                        >
                            <XCircle size={20} className="mr-2" /> Hard
                        </Button>
                        <Button 
                            className="py-4 text-lg border-b-4 border-green-700 bg-green-500 hover:bg-green-600 shadow-green-200"
                            onClick={(e) => { e.stopPropagation(); handleResult(true); }}
                        >
                            <CheckCircle size={20} className="mr-2" /> Easy
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
