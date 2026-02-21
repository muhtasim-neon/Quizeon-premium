import React from 'react';
import { GlassCard } from '../UI';
import { progressService } from '../../services/progressService';
import { Lock, CheckCircle2, PlayCircle } from 'lucide-react';

export const SkillTree: React.FC = () => {
  const tree = progressService.getSkillTree();

  return (
    <GlassCard className="h-full">
      <h3 className="text-lg font-bold mb-6">Skill Tree (দক্ষতা গাছ)</h3>
      <div className="flex flex-col items-center gap-4">
        {tree.map((node, index) => (
          <React.Fragment key={node.id}>
            <div 
              className={`
                relative w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-lg transition-all
                ${node.status === 'completed' ? 'bg-green-100 border-green-500 text-green-600' : 
                  node.status === 'unlocked' ? 'bg-blue-100 border-blue-500 text-blue-600 animate-pulse' : 
                  'bg-gray-100 border-gray-300 text-gray-400'}
              `}
              title={node.title}
            >
              <span className="text-2xl font-bold">{node.icon}</span>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border border-bamboo/10 shadow-sm">
                {node.status === 'completed' ? <CheckCircle2 size={16} /> : 
                 node.status === 'unlocked' ? <PlayCircle size={16} /> : 
                 <Lock size={16} />}
              </div>
              
              {/* Label */}
              <div className="absolute left-20 w-32 text-left">
                <p className="text-xs font-bold text-ink">{node.jpTitle}</p>
                <p className="text-[10px] text-bamboo uppercase tracking-wider">{node.title}</p>
                {node.status === 'locked' && node.requiredXP && (
                  <p className="text-[9px] text-hanko font-bold">Requires {node.requiredXP} XP</p>
                )}
              </div>
            </div>
            
            {/* Connector */}
            {index < tree.length - 1 && (
              <div className={`w-1 h-8 ${node.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </GlassCard>
  );
};
