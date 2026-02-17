
import React, { useEffect, useState } from 'react';
import { GlassCard, Button, Input } from '../components/UI';
import { dataService } from '../services/supabaseMock';
import { BookOpen, Edit, Plus, Trash2, Volume2, Search, FileText, Type } from 'lucide-react';

export const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vocab' | 'kanji' | 'grammar'>('vocab');

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">Content Manager</h1>
          <p className="text-bamboo">Module 3: Manage App Database</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" className="text-sm">Bulk Import (CSV)</Button>
            <Button className="text-sm"><Plus size={16} /> Add New</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-bamboo/10 pb-1">
          {['vocab', 'kanji', 'grammar'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab ? 'border-hanko text-hanko' : 'border-transparent text-bamboo hover:text-ink'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* Search Filter */}
      <div className="flex gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-bamboo w-4 h-4" />
              <Input placeholder={`Search ${activeTab}...`} className="pl-10 py-2.5 text-sm" />
          </div>
          <select className="bg-white border border-bamboo/20 rounded-xl px-4 text-sm text-ink outline-none">
              <option>All Lessons</option>
              <option>Lesson 1</option>
              <option>Lesson 2</option>
          </select>
      </div>

      {/* Content Table Placeholder */}
      <GlassCard className="!p-0 min-h-[400px]">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-bamboo/10 bg-rice/50 text-xs font-bold text-bamboo uppercase">
              <div className="col-span-3">{activeTab === 'grammar' ? 'Pattern' : 'Word / Kanji'}</div>
              <div className="col-span-3">Reading</div>
              <div className="col-span-3">Meaning (Bangla)</div>
              <div className="col-span-2">Audio</div>
              <div className="col-span-1 text-right">Actions</div>
          </div>
          
          <div className="p-10 text-center text-bamboo">
              <p>Content list for <strong>{activeTab}</strong> will appear here.</p>
              <p className="text-xs mt-2">Connected to Supabase Table: <code>{activeTab}_bank</code></p>
          </div>
      </GlassCard>
    </div>
  );
};
