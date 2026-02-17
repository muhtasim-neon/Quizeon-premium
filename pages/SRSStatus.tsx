
import React, { useEffect, useState } from 'react';
import { GlassCard, Badge } from '../components/UI';
import { progressService } from '../services/progressService';
import { SRSItemState, LearningItem } from '../types';
import { ALL_CONTENT } from '../data/mockContent';
import { Brain, Zap, Clock, Calendar } from 'lucide-react';

export const SRSStatus: React.FC = () => {
    const [srsItems, setSrsItems] = useState<(SRSItemState & { content?: LearningItem })[]>([]);

    useEffect(() => {
        const stats = progressService.getSRSStats();
        const combined = Object.values(stats).map(stat => {
            const content = ALL_CONTENT.find(c => c.id === stat.id);
            return { ...stat, content };
        }).sort((a, b) => a.nextReview - b.nextReview); // Sort by due date: Due first
        setSrsItems(combined);
    }, []);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString(undefined, { 
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
    };

    const getStatus = (timestamp: number) => {
        return timestamp <= Date.now() ? 'Due Now' : 'Review Later';
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-ink mb-2 flex items-center gap-3">
                        <Brain className="text-hanko" /> SRS Knowledge Base
                    </h1>
                    <p className="text-bamboo">Detailed tracking of your spaced repetition progress.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-bamboo/10 shadow-sm flex items-center gap-2">
                    <span className="text-xs font-bold text-bamboo uppercase">Total Items</span>
                    <span className="text-xl font-black text-hanko">{srsItems.length}</span>
                </div>
            </div>

            <GlassCard className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-rice/50 border-b border-bamboo/10 text-xs font-bold text-bamboo uppercase tracking-wider">
                                <th className="p-4 pl-6">Item</th>
                                <th className="p-4">Meaning</th>
                                <th className="p-4">Status & Time</th>
                                <th className="p-4">Interval</th>
                                <th className="p-4">Ease</th>
                                <th className="p-4 pr-6">Streak</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-bamboo/5">
                            {srsItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-bamboo">
                                        <p className="mb-2">No items in SRS system yet.</p>
                                        <p className="text-sm">Complete some lessons or flashcards to start tracking.</p>
                                    </td>
                                </tr>
                            ) : (
                                srsItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/60 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="font-jp font-bold text-xl text-ink">
                                                {item.content?.ja || item.id}
                                            </div>
                                            <div className="text-xs text-bamboo font-sans font-medium uppercase tracking-wide">
                                                {item.content?.romaji}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-ink font-medium max-w-[200px] truncate" title={item.content?.en}>
                                            {item.content?.en || 'Unknown Item'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <Badge color={getStatus(item.nextReview) === 'Due Now' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}>
                                                    {getStatus(item.nextReview)}
                                                </Badge>
                                                <span className="text-[10px] text-bamboo flex items-center gap-1">
                                                    <Clock size={10} /> {formatDate(item.nextReview)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-bold text-ink flex items-center gap-1">
                                                <Calendar size={14} className="text-blue-500" /> {item.interval} <span className="text-xs font-normal text-bamboo">days</span>
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-mono text-bamboo">
                                            x{item.easeFactor.toFixed(2)}
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center gap-1 text-orange-500 font-bold">
                                                <Zap size={16} fill="currentColor" /> {item.streak}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};
