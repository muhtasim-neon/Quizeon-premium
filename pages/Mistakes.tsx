import React, { useState, useEffect } from 'react';
import { GlassCard, Button } from '../components/UI';
import { AlertTriangle, Trash2, RefreshCcw } from 'lucide-react';
import { progressService } from '../services/progressService';
import { MistakeRecord } from '../types';

export const Mistakes: React.FC = () => {
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);

  const loadMistakes = () => {
    setMistakes(progressService.getMistakes());
  };

  useEffect(() => {
    loadMistakes();
  }, []);

  const handleClear = () => {
    if(window.confirm('Clear all mistake history?')) {
        progressService.clearMistakes();
        loadMistakes();
    }
  };

  const handleRemove = (id: string) => {
    progressService.removeMistake(id);
    loadMistakes();
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-ink">Mistake Review</h1>
                <p className="text-bamboo">Focus on what needs improvement</p>
            </div>
            {mistakes.length > 0 && (
                <Button variant="danger" onClick={handleClear} className="px-4 text-sm">
                    <Trash2 size={16} /> Clear All
                </Button>
            )}
       </div>

       {mistakes.length === 0 ? (
         <div className="text-center py-20 bg-white/40 rounded-2xl border border-dashed border-bamboo/20">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">No Mistakes Found!</h3>
            <p className="text-bamboo">Great job! Keep practicing to maintain your streak.</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mistakes.map((record) => (
                <GlassCard key={record.itemId} className="flex justify-between items-center group">
                    <div>
                        <div className="text-xs text-hanko font-bold mb-1">Failed {record.count} times</div>
                        <div className="text-2xl font-bold text-ink">{record.item.ja}</div>
                        <div className="text-sm text-bamboo">{record.item.en} ({record.item.romaji})</div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="secondary" className="p-2 h-auto text-hanko hover:bg-red-50" onClick={() => handleRemove(record.itemId)}>
                             <Trash2 size={16} />
                         </Button>
                    </div>
                </GlassCard>
            ))}
         </div>
       )}
    </div>
  );
};