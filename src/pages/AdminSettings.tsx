
import React, { useState } from 'react';
import { GlassCard, Button, Input, Toggle } from '@/components/UI';
import { Save, ShieldAlert, Cpu, Sliders, DollarSign } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    maintenance: false,
    freeUserLimit: true,
    aiHints: true
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-ink mb-2">Settings & Config</h1>
        <p className="text-bamboo">Module 4, 7, 11: Game Engine, Finance & System</p>
      </div>

      {/* Game Engine Control */}
      <GlassCard>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-bamboo/10">
              <Cpu className="text-purple-600" />
              <h3 className="text-xl font-bold text-ink">Game Engine Control</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                  <h4 className="font-bold text-bamboo text-sm uppercase">Gameplay Balance</h4>
                  <div>
                      <label className="block text-xs font-bold text-bamboo mb-1">Time Limit (Quiz)</label>
                      <input type="range" className="w-full h-2 bg-bamboo/20 rounded-lg appearance-none cursor-pointer" />
                      <div className="flex justify-between text-xs text-ink mt-1"><span>10s</span><span>60s</span></div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-bamboo mb-1">XP Multiplier</label>
                      <input type="number" className="w-full border border-bamboo/20 rounded p-2 text-sm" defaultValue="1.5" />
                  </div>
              </div>
              <div className="space-y-4 divide-y divide-bamboo/10">
                  <h4 className="font-bold text-bamboo text-sm uppercase pb-2">Rules</h4>
                  <div className="py-2">
                    <Toggle 
                      label="Daily Limit (Free Users)" 
                      description="Restrict free users to 5 games/day." 
                      checked={settings.freeUserLimit} 
                      onChange={() => setSettings(s => ({...s, freeUserLimit: !s.freeUserLimit}))}
                    />
                  </div>
                  <div className="py-2">
                    <Toggle 
                      label="AI Hints" 
                      description="Enable generative hints for hard questions." 
                      checked={settings.aiHints} 
                      onChange={() => setSettings(s => ({...s, aiHints: !s.aiHints}))}
                    />
                  </div>
              </div>
          </div>
      </GlassCard>

      {/* Finance & Plans */}
      <GlassCard>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-bamboo/10">
              <DollarSign className="text-green-600" />
              <h3 className="text-xl font-bold text-ink">Subscription Plans</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Monthly', 'Yearly', 'Lifetime'].map(plan => (
                  <div key={plan} className="p-4 rounded-xl border border-bamboo/20 bg-white/40">
                      <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-ink">{plan}</h4>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Active</span>
                      </div>
                      <input type="number" className="w-full border border-bamboo/20 rounded p-2 text-sm mb-2" placeholder="Price (BDT)" />
                      <div className="text-xs text-bamboo">Includes all premium features.</div>
                  </div>
              ))}
          </div>
      </GlassCard>

      <div className="flex justify-end gap-4">
          <Button variant="danger" className="text-sm">Reset Defaults</Button>
          <Button className="px-8"><Save size={18} /> Publish Changes</Button>
      </div>
    </div>
  );
};
