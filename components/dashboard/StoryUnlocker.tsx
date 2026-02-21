import React from 'react';
import { GlassCard, Button } from '../UI';
import { BookOpen, Lock, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StoryUnlocker: React.FC = () => {
  const navigate = useNavigate();
  // Mock unlocked stories
  const stories = [
    { id: '1', title: 'The Little Tanuki', jp: '小さなタヌキ', unlocked: true, progress: 100 },
    { id: '2', title: 'Summer Festival', jp: '夏祭り', unlocked: true, progress: 100 },
    { id: '3', title: 'Kyoto Trip', jp: '京都旅行', unlocked: false, progress: 65 },
  ];

  return (
    <GlassCard className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-ink flex items-center gap-2">
          <BookOpen size={18} className="text-purple-500" /> Adventure Mode
        </h3>
      </div>

      <div className="flex-1 space-y-3">
        {stories.map(story => (
          <div 
            key={story.id}
            className={`
              p-3 rounded-xl border transition-all flex items-center justify-between
              ${story.unlocked ? 'bg-purple-50 border-purple-100 hover:border-purple-300 cursor-pointer' : 'bg-gray-50 border-gray-100 opacity-60'}
            `}
            onClick={() => story.unlocked && navigate('/stories')}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${story.unlocked ? 'bg-white text-purple-500 shadow-sm' : 'bg-gray-200 text-gray-400'}`}>
                {story.unlocked ? <Play size={14} fill="currentColor" /> : <Lock size={14} />}
              </div>
              <div>
                <p className="text-xs font-black text-ink">{story.title}</p>
                <p className="text-[10px] text-bamboo font-jp">{story.jp}</p>
              </div>
            </div>
            
            {!story.unlocked && (
              <div className="text-right">
                <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400" style={{ width: `${story.progress}%` }}></div>
                </div>
                <span className="text-[8px] font-bold text-bamboo">{story.progress}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <p className="text-[9px] text-bamboo mt-4 italic">
        "নির্দিষ্ট সংখ্যক শব্দ বা কাঞ্জি শিখলে নতুন অ্যাডভেঞ্চার আনলক হবে।"
      </p>
    </GlassCard>
  );
};
