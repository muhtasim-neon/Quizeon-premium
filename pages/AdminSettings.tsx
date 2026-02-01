import React, { useState } from 'react';
import { GlassCard, Button, Input } from '../components/UI';
import { Save, ShieldAlert, Bell, Globe, Database, ToggleLeft, ToggleRight } from 'lucide-react';

const Toggle: React.FC<{ label: string; desc: string; checked: boolean; onChange: () => void }> = ({ label, desc, checked, onChange }) => (
    <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
        <div>
            <h4 className="text-white font-medium">{label}</h4>
            <p className="text-sm text-slate-400">{desc}</p>
        </div>
        <button onClick={onChange} className={`transition-colors ${checked ? 'text-primary' : 'text-slate-600'}`}>
            {checked ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
        </button>
    </div>
);

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    maintenance: false,
    registrations: true,
    aiFeatures: true,
    publicLeaderboard: true
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-slate-400">Configure global application parameters.</p>
      </div>

      <GlassCard>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <ShieldAlert className="text-primary" />
              <h3 className="text-xl font-bold text-white">General Configuration</h3>
          </div>
          
          <Toggle 
             label="Maintenance Mode" 
             desc="Disable access for all non-admin users." 
             checked={settings.maintenance} 
             onChange={() => setSettings(s => ({...s, maintenance: !s.maintenance}))}
          />
          <Toggle 
             label="Allow New Registrations" 
             desc="If disabled, sign-up page will be hidden." 
             checked={settings.registrations} 
             onChange={() => setSettings(s => ({...s, registrations: !s.registrations}))}
          />
           <Toggle 
             label="AI Sensei (Gemini)" 
             desc="Enable AI chat features for students." 
             checked={settings.aiFeatures} 
             onChange={() => setSettings(s => ({...s, aiFeatures: !s.aiFeatures}))}
          />
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                  <Bell className="text-orange-400" />
                  <h3 className="text-lg font-bold text-white">Notifications</h3>
              </div>
              <div className="space-y-4">
                  <Input label="System Announcement" placeholder="Enter message for all users..." />
                  <div className="flex justify-end">
                      <Button variant="secondary" className="text-sm">Broadcast</Button>
                  </div>
              </div>
          </GlassCard>

          <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                  <Database className="text-green-400" />
                  <h3 className="text-lg font-bold text-white">Data Retention</h3>
              </div>
              <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                       <span className="text-slate-300">Log Retention</span>
                       <select className="bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm">
                           <option>30 Days</option>
                           <option>60 Days</option>
                           <option>90 Days</option>
                       </select>
                  </div>
                  <Button variant="danger" className="w-full">Purge Old Logs</Button>
              </div>
          </GlassCard>
      </div>

      <div className="flex justify-end">
          <Button className="px-8"><Save size={18} /> Save All Changes</Button>
      </div>
    </div>
  );
};
