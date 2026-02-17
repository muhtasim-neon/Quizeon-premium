
import React, { useState } from 'react';
import { GlassCard, Button, Badge, WonderCard } from '../components/UI';
import { BookOpen, RefreshCw, Wand2, HelpCircle } from 'lucide-react';
import { aiService } from '../services/aiService';
import { StoryContent } from '../types';

export const ReadingRoom: React.FC = () => {
  const [topic, setTopic] = useState('School Life');
  const [story, setStory] = useState<StoryContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);

  const topics = [
      { t: 'School Life', color: 'bg-blue-50 border-blue-200 text-blue-800' },
      { t: 'Shopping', color: 'bg-pink-50 border-pink-200 text-pink-800' },
      { t: 'Travel to Tokyo', color: 'bg-green-50 border-green-200 text-green-800' },
      { t: 'Cooking', color: 'bg-orange-50 border-orange-200 text-orange-800' },
      { t: 'Anime Club', color: 'bg-purple-50 border-purple-200 text-purple-800' },
      { t: 'Rainy Day', color: 'bg-slate-50 border-slate-200 text-slate-800' }
  ];

  const generate = async (selectedTopic: string) => {
    setLoading(true);
    setStory(null);
    setShowEnglish(false);
    try {
        const data = await aiService.generateStory(selectedTopic);
        setStory(data);
    } catch (e) {
        alert("Failed to generate story");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-ink mb-2">Reading Room</h1>
            <p className="text-bamboo">AI-generated N5 stories to boost comprehension.</p>
        </div>
      </div>

      {!story && !loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {topics.map(item => (
                <WonderCard 
                    key={item.t} 
                    colorClass={item.color}
                    onClick={() => { setTopic(item.t); generate(item.t); }}
                    className="flex flex-col items-center justify-center py-10 cursor-pointer group"
                >
                    <BookOpen size={32} className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-lg font-bold">{item.t}</h3>
                </WonderCard>
            ))}
          </div>
      )}

      {loading && (
          <GlassCard className="flex flex-col items-center justify-center py-20 text-center">
              <RefreshCw size={48} className="animate-spin text-hanko mb-6" />
              <h3 className="text-xl font-bold text-ink">Writing a story about {topic}...</h3>
              <p className="text-bamboo mt-2">Consulting the AI...</p>
          </GlassCard>
      )}

      {story && (
          <div className="animate-fade-in space-y-6">
              <div className="flex gap-2">
                 <Button variant="ghost" onClick={() => setStory(null)}>Back to Topics</Button>
                 <Button variant="secondary" onClick={() => generate(topic)}><RefreshCw size={16} /> Regenerate</Button>
              </div>

              {/* Story Card */}
              <GlassCard className="border-hanko/30">
                  <div className="flex justify-between items-start mb-6">
                      <h2 className="text-3xl font-bold text-ink font-jp">{story.title}</h2>
                      <Button variant="secondary" size="sm" onClick={() => setShowEnglish(!showEnglish)}>
                          {showEnglish ? 'Hide Translation' : 'Show Translation'}
                      </Button>
                  </div>
                  
                  <div className="text-2xl leading-loose font-jp mb-8 text-ink">
                      {story.japanese}
                  </div>

                  {showEnglish && (
                      <div className="p-4 bg-white/40 rounded-xl text-ink italic mb-8 animate-fade-in border-l-4 border-hanko">
                          {story.english}
                      </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-bamboo/10">
                      {/* Vocab */}
                      <div>
                          <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2"><BookOpen size={18} /> Key Vocabulary</h3>
                          <ul className="space-y-2">
                              {story.vocab.map((v, i) => (
                                  <li key={i} className="flex justify-between text-sm bg-rice p-2 rounded border border-bamboo/10">
                                      <span className="text-hanko font-bold">{v.word}</span>
                                      <span className="text-bamboo">{v.meaning}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>

                      {/* Comprehension Quiz */}
                      <div>
                          <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2"><HelpCircle size={18} /> Quick Quiz</h3>
                          <div className="space-y-4">
                              {story.quiz.map((q, i) => (
                                  <div key={i} className="bg-white/40 border border-bamboo/10 p-3 rounded-xl">
                                      <p className="text-sm text-ink mb-2 font-bold">{q.question}</p>
                                      <div className="flex gap-2 flex-wrap">
                                          {q.options.map((opt, oi) => (
                                              <button 
                                                key={oi} 
                                                className="px-3 py-1 rounded bg-white text-ink border border-bamboo/20 text-xs hover:bg-hanko hover:text-white transition-colors"
                                                onClick={(e) => {
                                                    if(opt === q.answer) {
                                                        e.currentTarget.classList.add('!bg-green-600', '!text-white');
                                                    } else {
                                                        e.currentTarget.classList.add('!bg-hanko', '!text-white');
                                                    }
                                                }}
                                              >
                                                  {opt}
                                              </button>
                                          ))}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </GlassCard>
          </div>
      )}
    </div>
  );
};
