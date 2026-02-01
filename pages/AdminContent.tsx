import React, { useEffect, useState } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { dataService } from '../services/supabaseMock';
import { ContentAnalytics } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BookOpen, Edit, Plus, TrendingUp, Clock, Users, Eye } from 'lucide-react';

export const AdminContent: React.FC = () => {
  const [analytics, setAnalytics] = useState<ContentAnalytics[]>([]);

  useEffect(() => {
    dataService.getContentAnalytics().then(setAnalytics);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content CMS</h1>
          <p className="text-slate-400">Manage learning materials and analyze engagement.</p>
        </div>
        <Button>
            <Plus size={18} /> Add New Lesson
        </Button>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-primary" /> Most Popular Categories
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="category" type="category" width={100} tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                        <Tooltip 
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        />
                        <Bar dataKey="views" radius={[0, 4, 4, 0]} barSize={20}>
                            {analytics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#3a86ff' : index === 1 ? '#a855f7' : '#64748b'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </GlassCard>

          <GlassCard>
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Users size={20} className="text-green-400" /> User Retention by Section
              </h3>
              <div className="space-y-6">
                  {analytics.map((item) => (
                      <div key={item.category}>
                          <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-300">{item.category}</span>
                              <span className={`font-bold ${item.userRetention > 80 ? 'text-green-400' : item.userRetention < 60 ? 'text-red-400' : 'text-yellow-400'}`}>
                                  {item.userRetention}%
                              </span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${item.userRetention > 80 ? 'bg-green-500' : item.userRetention < 60 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                                style={{ width: `${item.userRetention}%` }}
                              ></div>
                          </div>
                      </div>
                  ))}
              </div>
          </GlassCard>
      </div>

      {/* Content Management List */}
      <GlassCard>
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Manage Modules</h3>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="text-slate-500 text-xs uppercase border-b border-white/10">
                      <tr>
                          <th className="pb-3 pl-2">Module Name</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Items</th>
                          <th className="pb-3">Avg Time</th>
                          <th className="pb-3">Engagement</th>
                          <th className="pb-3 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                      {analytics.map((item, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors group">
                              <td className="py-4 pl-2 font-medium text-white">{item.category}</td>
                              <td className="py-4 text-slate-400">Core Lesson</td>
                              <td className="py-4 text-slate-400">~50 items</td>
                              <td className="py-4 flex items-center gap-2 text-slate-300">
                                  <Clock size={14} className="text-slate-500" /> {item.avgTimeSpent}
                              </td>
                              <td className="py-4">
                                  <div className="flex items-center gap-4 text-xs">
                                      <span className="flex items-center gap-1 text-blue-400"><Eye size={12} /> {item.views}</span>
                                      <span className="flex items-center gap-1 text-pink-400"><TrendingUp size={12} /> {item.likes}</span>
                                  </div>
                              </td>
                              <td className="py-4 text-right">
                                  <Button variant="ghost" className="p-2 h-auto text-primary hover:text-white"><Edit size={16} /></Button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </GlassCard>
    </div>
  );
};
