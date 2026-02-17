
import React, { useEffect, useState } from 'react';
import { Badge, GlassCard } from '../components/UI';
import { CheckCircle2, Circle, XCircle, ClipboardCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { progressService } from '../services/progressService';
import { useNavigate } from 'react-router-dom';

interface ChecklistItem {
    id: string;
    title: string;
    category: string;
    targetId: string; // The ID used for tracking score
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
    { id: '1', title: 'Hiragana Mastery', category: 'Kana', targetId: 'kana-hiragana' },
    { id: '2', title: 'Katakana Mastery', category: 'Kana', targetId: 'kana-katakana' },
    { id: '3', title: 'Lesson 1 Vocabulary', category: 'Vocab', targetId: 'vocab-lesson-1' },
    { id: '4', title: 'Lesson 1 Grammar', category: 'Grammar', targetId: 'grammar-lesson-1' },
    { id: '5', title: 'Lesson 2 Vocabulary', category: 'Vocab', targetId: 'vocab-lesson-2' },
    { id: '6', title: 'Lesson 2 Grammar', category: 'Grammar', targetId: 'grammar-lesson-2' },
    { id: '7', title: 'Lesson 3 Vocabulary', category: 'Vocab', targetId: 'vocab-lesson-3' },
    { id: '8', title: 'Lesson 3 Grammar', category: 'Grammar', targetId: 'grammar-lesson-3' },
    { id: '9', title: 'Lesson 4 Vocabulary', category: 'Vocab', targetId: 'vocab-lesson-4' },
    { id: '10', title: 'Lesson 4 Grammar', category: 'Grammar', targetId: 'grammar-lesson-4' },
    { id: '11', title: 'Lesson 5 Vocabulary', category: 'Vocab', targetId: 'vocab-lesson-5' },
    { id: '12', title: 'Lesson 5 Grammar', category: 'Grammar', targetId: 'grammar-lesson-5' },
    { id: '13', title: 'Counters Basics', category: 'Counters', targetId: 'counter-Things' }, // Example mapping
    { id: '14', title: 'Numbers (Time/Dates)', category: 'Numbers', targetId: 'number-Time' },
    { id: '15', title: 'Lesson 6 Vocabulary', category: 'Vocab', targetId: 'vocab-lesson-6' },
    // Add more as needed for Lessons 7-25
];

export const Checklist: React.FC = () => {
  const [scores, setScores] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
      setScores(progressService.getAllScores());
      
      const handleUpdate = () => {
          setScores(progressService.getAllScores());
      };
      window.addEventListener('user-update', handleUpdate);
      return () => window.removeEventListener('user-update', handleUpdate);
  }, []);

  const getStatus = (id: string) => {
      const score = scores[id];
      if (score === undefined) return 'empty';
      if (score >= 80) return 'completed';
      return 'failed';
  };

  const getStatusDisplay = (status: string, score: number) => {
      switch(status) {
          case 'completed':
              return (
                  <Badge color="bg-emerald-100 text-emerald-700 border-emerald-200">
                      <CheckCircle2 size={12} className="inline mr-1" /> Passed ({score}%)
                  </Badge>
              );
          case 'failed':
              return (
                  <Badge color="bg-rose-100 text-rose-700 border-rose-200">
                      <XCircle size={12} className="inline mr-1" /> Failed ({score}%)
                  </Badge>
              );
          default:
              return (
                  <Badge color="bg-gray-100 text-gray-400 border-gray-200">
                      <Circle size={12} className="inline mr-1" /> Not Started
                  </Badge>
              );
      }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <h1 className="text-3xl font-bold text-ink mb-2 flex items-center gap-3">
                <ClipboardCheck className="text-hanko" /> Progress Checklist
            </h1>
            <p className="text-bamboo">Complete quizzes with 80% or higher to check off items.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-bamboo/10 shadow-sm flex items-center gap-2">
            <span className="text-xs font-bold text-bamboo uppercase">Total Mastery</span>
            <span className="text-xl font-black text-hanko">
                {Math.round((Object.values(scores).filter((s: any) => s >= 80).length / CHECKLIST_ITEMS.length) * 100)}%
            </span>
        </div>
      </div>

      <GlassCard className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                      <tr className="bg-rice/50 border-b border-bamboo/10 text-xs font-bold text-bamboo uppercase tracking-wider">
                          <th className="p-4 pl-6">Topic</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right pr-6">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-bamboo/5">
                      {CHECKLIST_ITEMS.map((item) => {
                          const status = getStatus(item.targetId);
                          const score = scores[item.targetId] || 0;
                          
                          return (
                              <tr key={item.id} className="hover:bg-white/60 transition-colors group">
                                  <td className="p-4 pl-6">
                                      <span className={`font-bold ${status === 'completed' ? 'text-emerald-700 line-through opacity-70' : 'text-ink'}`}>
                                          {item.title}
                                      </span>
                                  </td>
                                  <td className="p-4">
                                      <span className="text-xs font-bold text-bamboo bg-white px-2 py-1 rounded border border-bamboo/10">
                                          {item.category}
                                      </span>
                                  </td>
                                  <td className="p-4">
                                      {getStatusDisplay(status, score)}
                                  </td>
                                  <td className="p-4 text-right pr-6">
                                      <button 
                                        onClick={() => navigate('/learning')}
                                        className={`p-2 rounded-lg transition-all ${status === 'completed' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-hanko hover:bg-orange-50'}`}
                                        title={status === 'completed' ? 'Review' : 'Start Quiz'}
                                      >
                                          {status === 'completed' ? <RefreshCw size={16} /> : <ArrowRight size={16} />}
                                      </button>
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
          </div>
          
          <div className="p-6 text-center border-t border-bamboo/10 bg-rice/30">
              <p className="text-sm text-bamboo">More lessons unlock as you progress through the Learning Hub.</p>
          </div>
      </GlassCard>
    </div>
  );
};
