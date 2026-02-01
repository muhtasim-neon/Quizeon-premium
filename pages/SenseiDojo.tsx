import React, { useState, useRef, useEffect } from 'react';
import { GlassCard, Button, Input } from '../components/UI';
import { Bot, Send, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { aiService } from '../services/aiService';
import { ChatMessage } from '../types';

export const SenseiDojo: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Konnichiwa! I am your AI Sensei. Ask me anything about Japanese grammar, vocab, or culture! 🌸', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-ink flex items-center gap-3">
            <Bot className="text-hanko" /> Sensei Dojo <span className="text-xs bg-hanko/10 text-hanko px-2 py-1 rounded border border-hanko/20">Gemini Powered</span>
        </h1>
        <p className="text-bamboo">Your personal AI tutor available 24/7.</p>
      </div>

      <GlassCard className="flex-1 flex flex-col overflow-hidden !p-0 border-bamboo/20">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'model' ? 'bg-rice border border-bamboo/20 text-hanko' : 'bg-hanko text-white'}`}>
                        {msg.role === 'model' ? <Bot size={20} /> : <UserIcon size={20} />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-hanko text-white' : 'bg-white border border-bamboo/10 text-ink'}`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-rice border border-bamboo/20 text-hanko flex items-center justify-center">
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
        <div className="p-4 border-t border-bamboo/10 bg-white/40">
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
      </GlassCard>
    </div>
  );
};