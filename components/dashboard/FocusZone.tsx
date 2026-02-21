import React from 'react';
import { GlassCard, Badge, Button } from '../UI';
import { progressService } from '../../services/progressService';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FocusZone: React.FC = () => {
  const mistakes = progressService.getMistakes().slice(0, 3);
  const navigate = useNavigate();

  return (
    <GlassCard className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-ink flex items-center gap-2">
          <AlertTriangle size={18} className="text-hanko" /> Focus Zone (ফোকাস জোন)
        </h3>
        <Badge color="bg-red-50 text-red-600 border-red-100">AI Spotted</Badge>
      </div>
      
      <p className="text-xs text-bamboo mb-4">You've been struggling with these lately. Want a quick challenge?</p>

      <div className="flex-1 space-y-2">
        {mistakes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-4">
            <p className="text-sm font-bold text-ink">No weaknesses detected!</p>
            <p className="text-xs text-bamboo">Keep up the great work.</p>
          </div>
        ) : (
          mistakes.map((m, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center bg-rice p-3 rounded-xl border border-bamboo/10 group hover:border-hanko/30 transition-colors cursor-pointer"
              onClick={() => navigate('/mistakes')}
            >
              <div>
                <span className="font-bold text-ink block group-hover:text-hanko transition-colors">{m.item.ja}</span>
                <span className="text-[10px] text-bamboo">{m.item.en}</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-hanko/10 flex items-center justify-center text-hanko">
                <ArrowRight size={12} />
              </div>
            </div>
          ))
        )}
      </div>
      
      {mistakes.length > 0 && (
        <Button variant="secondary" size="sm" className="w-full mt-4" onClick={() => navigate('/mistakes')}>
          Start Focus Challenge
        </Button>
      )}
    </GlassCard>
  );
};
