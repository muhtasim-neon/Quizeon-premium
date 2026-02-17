
import React, { useState, useEffect } from 'react';
import { GlassCard, Button, WonderCard } from '../components/UI';
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
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
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
         <WonderCard colorClass="bg-green-50 border-green-200" className="text-center py-20">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">No Mistakes Found!</h3>
            <p className="text-green-600">Great job! Keep practicing to maintain your streak.</p>
         </WonderCard>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mistakes.map((record) => (
                <WonderCard key={record.itemId} colorClass="bg-red-50 border-red-200" className="flex justify-between items-center group">
                    <div>
                        <div className="text-xs text-red-600 font-bold mb-1">Failed {record.count} times</div>
                        <div className="text-2xl font-bold text-red-900">{record.item.ja}</div>
                        <div className="text-sm text-red-700">{record.item.en} ({record.item.romaji})</div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-20">
                         <Button variant="secondary" className="p-2 h-auto text-red-600 hover:bg-white" onClick={() => handleRemove(record.itemId)}>
                             <Trash2 size={16} />
                         </Button>
                    </div>
                </WonderCard>
            ))}
         </div>
       )}
    </div>
  );
};
