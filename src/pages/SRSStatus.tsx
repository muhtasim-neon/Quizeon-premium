
import React, { useEffect, useState } from 'react';
import { GlassCard, Badge, WonderCard } from '@/components/UI';
import { progressService } from '@/services/progressService';
import { SRSItemState, LearningItem } from '@/types';
import { ALL_CONTENT } from '@/data/mockContent';
import { Brain, Zap, Clock, Calendar, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend 
} from 'recharts';

export const SRSStatus: React.FC = () => {
    const [srsItems, setSrsItems] = useState<(SRSItemState & { content?: LearningItem })[]>([]);
    const [reviewStats, setReviewStats] = useState<any[]>([]);
    const [masteryStats, setMasteryStats] = useState<any[]>([]);

    useEffect(() => {
        const stats = progressService.getSRSStats();
        const combined = Object.values(stats).map(stat => {
            const content = ALL_CONTENT.find(c => c.id === stat.id);
            return { ...stat, content };
        }).sort((a, b) => a.nextReview - b.nextReview); // Sort by due date: Due first
        setSrsItems(combined);

        // Calculate Chart Data
        processChartData(combined);
    }, []);

    const processChartData = (items: (SRSItemState & { content?: LearningItem })[]) => {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        // 1. Review Forecast (Bar Chart)
        let overdue = 0;
        let today = 0; // Remainder of today
        let tomorrow = 0;
        let day3 = 0;
        let later = 0;

        items.forEach(item => {
            if (item.nextReview < now) {
                overdue++;
            } else if (item.nextReview < now + oneDay) {
                today++;
            } else if (item.nextReview < now + 2 * oneDay) {
                tomorrow++;
            } else if (item.nextReview < now + 3 * oneDay) {
                day3++;
            } else {
                later++;
            }
        });

        setReviewStats([
            { name: 'Overdue', count: overdue, fill: '#bc2f32' }, // Hanko Red
            { name: 'Today', count: today, fill: '#f59e0b' }, // Amber
            { name: 'Tmrw', count: tomorrow, fill: '#10b981' }, // Emerald
            { name: '+2 Days', count: day3, fill: '#3b82f6' }, // Blue
        ]);

        // 2. Mastery Distribution (Pie Chart)
        let learning = 0; // Interval < 3 days
        let young = 0;    // Interval 3 - 21 days
        let mature = 0;   // Interval > 21 days

        items.forEach(item => {
            if (item.interval < 3) learning++;
            else if (item.interval <= 21) young++;
            else mature++;
        });

        setMasteryStats([
            { name: 'Apprentice', value: learning },
            { name: 'Guru', value: young },
            { name: 'Master', value: mature },
        ]);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString(undefined, { 
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
    };

    const getStatus = (timestamp: number) => {
        return timestamp <= Date.now() ? 'Due Now' : 'Review Later';
    };

    const MASTERY_COLORS = ['#fbbf24', '#34d399', '#818cf8']; // Amber, Emerald, Indigo

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10">
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

            {/* Analytics Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WonderCard colorClass="bg-white border-bamboo/10" className="flex flex-col h-[300px]">
                    <h3 className="font-bold text-lg text-ink mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-500" /> Review Forecast
                    </h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reviewStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#795548', fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#795548' }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#fdfaf1' }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </WonderCard>

                <WonderCard colorClass="bg-white border-bamboo/10" className="flex flex-col h-[300px]">
                    <h3 className="font-bold text-lg text-ink mb-4 flex items-center gap-2">
                        <PieIcon size={18} className="text-purple-500" /> Mastery Levels
                    </h3>
                    <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                        {srsItems.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={masteryStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {masteryStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={MASTERY_COLORS[index % MASTERY_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36} 
                                        iconType="circle"
                                        formatter={(value, entry: any) => <span className="text-xs font-bold text-ink ml-1">{value} ({entry.payload.value})</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-bamboo text-sm">
                                No data available yet.<br/>Start learning to see stats!
                            </div>
                        )}
                    </div>
                </WonderCard>
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
