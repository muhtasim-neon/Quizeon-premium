
import React, { useState, useRef, useEffect } from 'react';
import { GlassCard, Button, Input, WonderCard } from '@/components/UI';
import { Bot, Send, User as UserIcon, Loader2, Sparkles, Volume2, Sliders, X } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { ChatMessage } from '@/types';
import { useSettings } from '@/contexts/SettingsContext';

export const SenseiDojo: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Konnichiwa! I am your AI Sensei. Ask me anything about Japanese grammar, vocab, or culture! 🌸', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const { speak, audioSettings, updateAudioSettings, voices, stopAudio } = useSettings();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || !input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await aiService.chatWithSensei(userMsg.text, messages);
      const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
      // Optional: Auto-speak response if enabled? For now, we'll let user click.
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
      // Basic language detection hack: if it contains kana/kanji, default to JP voice preference in settings context
      // But speak() now uses the selected voiceURI from settings regardless of lang param if set.
      // We pass 'ja-JP' as default fallback.
      stopAudio();
      speak(text);
  };

  return (
    <div className="h-[calc(100vh-100px)] max-w-5xl mx-auto flex flex-col animate-fade-in relative">
      <div className="mb-4 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-ink flex items-center gap-3">
                <Bot className="text-hanko" /> Sensei Dojo <span className="text-xs bg-hanko/10 text-hanko px-2 py-1 rounded border border-hanko/20">Gemini Powered</span>
            </h1>
            <p className="text-bamboo">Your personal AI tutor available 24/7.</p>
        </div>
        <Button variant="secondary" onClick={() => setShowSettings(!showSettings)} className={showSettings ? 'bg-hanko text-white' : ''}>
            <Sliders size={18} className="mr-2" /> Voice Settings
        </Button>
      </div>

      {showSettings && (
          <GlassCard className="mb-4 animate-fade-in border-hanko/20">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-ink">Sensei Voice Configuration</h3>
                  <button onClick={() => setShowSettings(false)}><X size={18} className="text-bamboo hover:text-hanko" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                      <label className="block text-xs font-bold text-bamboo mb-2 uppercase">Voice Persona</label>
                      <select 
                        className="w-full p-2 rounded-xl bg-rice border border-bamboo/20 text-sm font-bold text-ink outline-none"
                        value={audioSettings.voiceURI || ''}
                        onChange={(e) => updateAudioSettings({ voiceURI: e.target.value || null })}
                      >
                          <option value="">Default System Voice</option>
                          {voices.map(v => (
                              <option key={v.voiceURI} value={v.voiceURI}>
                                  {v.name} ({v.lang})
                              </option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-bamboo mb-2 uppercase">Speaking Rate ({audioSettings.speed}x)</label>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="2" 
                        step="0.1" 
                        value={audioSettings.speed}
                        onChange={(e) => updateAudioSettings({ speed: parseFloat(e.target.value) })}
                        className="w-full accent-hanko cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-bamboo mt-1"><span>0.5x</span><span>Normal</span><span>2.0x</span></div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-bamboo mb-2 uppercase">Pitch ({audioSettings.pitch})</label>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="2" 
                        step="0.1" 
                        value={audioSettings.pitch}
                        onChange={(e) => updateAudioSettings({ pitch: parseFloat(e.target.value) })}
                        className="w-full accent-hanko cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-bamboo mt-1"><span>Low</span><span>Normal</span><span>High</span></div>
                  </div>
              </div>
          </GlassCard>
      )}

      <WonderCard colorClass="bg-white border-purple-200" className="flex-1 flex flex-col overflow-hidden !p-0">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'model' ? 'bg-purple-100 border border-purple-200 text-purple-700' : 'bg-hanko text-white'}`}>
                        {msg.role === 'model' ? <Bot size={20} /> : <UserIcon size={20} />}
                    </div>
                    <div className={`max-w-[80%] group relative rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-hanko text-white' : 'bg-white border border-bamboo/10 text-ink'}`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        {msg.role === 'model' && (
                            <button 
                                onClick={() => handleSpeak(msg.text)} 
                                className="absolute -right-10 top-2 p-2 bg-white rounded-full shadow-sm text-bamboo hover:text-hanko opacity-0 group-hover:opacity-100 transition-all border border-bamboo/10"
                                title="Listen"
                            >
                                <Volume2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center">
                        <Bot size={20} />
                    </div>
                    <div className="bg-white rounded-2xl p-4 flex items-center gap-2 text-bamboo border border-bamboo/10">
                        <Sparkles size={16} className="animate-pulse" /> Sensei is thinking...
                    </div>
                </div>
            )}
            <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-bamboo/10 bg-white/40 relative z-10">
            <form onSubmit={handleSend} className="flex gap-2">
                <input 
                    className="flex-1 bg-white border border-bamboo/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-hanko transition-colors placeholder-bamboo/50"
                    placeholder="Ask about 'Te-form', 'Particles', or 'Japan'..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                />
                <Button type="submit" disabled={loading || !input || !input.trim()} className="px-6">
                    {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                </Button>
            </form>
        </div>
      </WonderCard>
    </div>
  );
};
