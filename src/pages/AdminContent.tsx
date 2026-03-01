
import React, { useEffect, useState, useMemo } from 'react';
import { GlassCard, Button, Input, Badge } from '@/components/UI';
import { dataService } from '@/services/dataService';
import { VOCAB_DATA, KANJI_DATA } from '@/data/mockContent';
import { BookOpen, Edit, Plus, Trash2, Volume2, Search, FileText, Type, ChevronRight } from 'lucide-react';

export const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vocab' | 'kanji' | 'grammar'>('vocab');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    const data = activeTab === 'vocab' ? VOCAB_DATA : activeTab === 'kanji' ? KANJI_DATA : [];
    if (!searchTerm) return data;
    return data.filter(item => 
      item.ja.includes(searchTerm) || 
      item.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item as any).romaji?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeTab, searchTerm]);

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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bamboo w-4 h-4" />
              <Input 
                placeholder={`Search ${activeTab}...`} 
                className="pl-10 py-2.5 text-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          <select className="bg-white border border-bamboo/20 rounded-xl px-4 text-sm text-ink outline-none">
              <option>All Lessons</option>
              <option>Lesson 1</option>
              <option>Lesson 2</option>
          </select>
      </div>

      {/* Content Table */}
      <GlassCard className="!p-0 min-h-[400px] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-bamboo/10 bg-rice/50 text-xs font-bold text-bamboo uppercase">
              <div className="col-span-3">{activeTab === 'grammar' ? 'Pattern' : 'Word / Kanji'}</div>
              <div className="col-span-3">Reading</div>
              <div className="col-span-3">Meaning (English)</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Actions</div>
          </div>
          
          <div className="divide-y divide-bamboo/5">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/60 transition-colors group">
                      <div className="col-span-3 font-bold text-ink text-lg">{item.ja}</div>
                      <div className="col-span-3 text-sm text-bamboo">{(item as any).romaji || (item as any).reading || '-'}</div>
                      <div className="col-span-3 text-sm text-ink">{item.en}</div>
                      <div className="col-span-2">
                          <Badge color="bg-green-50 text-green-600 border-green-100">Active</Badge>
                      </div>
                      <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-blue-100 text-blue-600 rounded"><Edit size={14} /></button>
                          <button className="p-1.5 hover:bg-red-100 text-hanko rounded"><Trash2 size={14} /></button>
                      </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center text-bamboo">
                    <p>No content found for <strong>{searchTerm}</strong> in {activeTab}.</p>
                    <p className="text-xs mt-2">Connected to Supabase Table: <code>{activeTab}_bank</code></p>
                </div>
              )}
          </div>
      </GlassCard>
    </div>
  );
};
