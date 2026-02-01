import React, { useState } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { BookOpen, Volume2, ArrowLeft, Filter } from 'lucide-react';
import { ALL_CONTENT, VOCAB_DATA, KANA_DATA, KANJI_DATA, GRAMMAR_DATA } from '../data/mockContent';
import { LearningItem } from '../types';

export const LearningHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'vocab' | 'kanji' | 'grammar' | 'kana'>('all');

  const categories = [
    { id: 'kana', title: 'Hiragana & Katakana', count: KANA_DATA.length, color: 'text-pink-400', bg: 'bg-pink-500/20' },
    { id: 'vocab', title: 'Vocabulary (Minna)', count: VOCAB_DATA.length, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { id: 'kanji', title: 'N5 Kanji', count: KANJI_DATA.length, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    { id: 'grammar', title: 'Grammar Rules', count: GRAMMAR_DATA.length, color: 'text-green-400', bg: 'bg-green-500/20' },
  ];

  const filteredContent = ALL_CONTENT.filter(item => {
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    if (selectedCategory && item.type !== selectedCategory && activeTab === 'all') return false; // Basic filter logic
    return true;
  });

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {selectedCategory && (
            <Button variant="ghost" onClick={() => { setSelectedCategory(null); setActiveTab('all'); }} className="p-2 h-auto">
                <ArrowLeft size={20} />
            </Button>
        )}
        <div>
           <h1 className="text-3xl font-bold text-white">Learning Hub</h1>
           <p className="text-slate-400">Master Japanese basics with categorized lessons</p>
        </div>
      </div>

      {!selectedCategory ? (
        /* Categories Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <GlassCard 
              key={cat.id} 
              hoverEffect 
              onClick={() => { setSelectedCategory(cat.id); setActiveTab(cat.id as any); }}
              className="cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{cat.title}</h3>
              <p className="text-sm text-slate-400">{cat.count} items available</p>
            </GlassCard>
          ))}
        </div>
      ) : (
        /* Content List View */
        <div className="animate-fade-in">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['all', 'kana', 'vocab', 'kanji', 'grammar'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                  activeTab === tab 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.map((item) => (
              <GlassCard key={item.id} className="relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{item.category || item.type}</span>
                    <div className="text-3xl font-jp font-bold text-white mt-1 mb-2">{item.ja}</div>
                    <div className="text-primary font-medium">{item.romaji}</div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); speak(item.ja); }}
                    className="p-2 rounded-full bg-white/5 hover:bg-primary hover:text-white text-slate-400 transition-colors"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-lg text-slate-200">{item.en}</p>
                  {item.bn && <p className="text-sm text-slate-500 mt-1">{item.bn}</p>}
                </div>
              </GlassCard>
            ))}
            
            {filteredContent.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500">
                    No content found for this category.
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
