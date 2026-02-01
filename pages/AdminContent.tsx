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
          <h1 className="text-3xl font-bold text-ink mb-2">Content CMS</h1>
          <p className="text-bamboo">Manage learning materials and analyze engagement.</p>
        </div>
        <Button>
            <Plus size={18} /> Add New Lesson
        </Button>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
              <h3 className="text-lg font-bold text-ink mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-hanko" /> Most Popular Categories
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="category" type="category" width={100} tick={{fill: '#8d6e63'}} axisLine={false} tickLine={false} />
                        <Tooltip 
                            cursor={{fill: 'rgba(141,110,99,0.1)'}}
                            contentStyle={{ backgroundColor: '#fdfaf1', border: '1px solid rgba(141,110,99,0.2)', borderRadius: '8px', color: '#3e2723' }}
                        />
                        <Bar dataKey="views" radius={[0, 4, 4, 0]} barSize={20}>
                            {analytics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#bc2f32' : index === 1 ? '#d4a373' : '#8d6e63'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </GlassCard>

          <GlassCard>
               <h3 className="text-lg font-bold text-ink mb-6 flex items-center gap-2">
                  <Users size={20} className="text-green-600" /> User Retention by Section
              </h3>
              <div className="space-y-6">
                  {analytics.map((item) => (
                      <div key={item.category}>
                          <div className="flex justify-between text-sm mb-1">
                              <span className="text-bamboo">{item.category}</span>
                              <span className={`font-bold ${item.userRetention > 80 ? 'text-green-600' : item.userRetention < 60 ? 'text-hanko' : 'text-straw'}`}>
                                  {item.userRetention}%
                              </span>
                          </div>
                          <div className="w-full bg-bamboo/10 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${item.userRetention > 80 ? 'bg-green-600' : item.userRetention < 60 ? 'bg-hanko' : 'bg-straw'}`} 
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
              <h3 className="text-xl font-bold text-ink">Manage Modules</h3>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="text-bamboo text-xs uppercase border-b border-bamboo/10">
                      <tr>
                          <th className="pb-3 pl-2">Module Name</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Items</th>
                          <th className="pb-3">Avg Time</th>
                          <th className="pb-3">Engagement</th>
                          <th className="pb-3 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-bamboo/5 text-sm">
                      {analytics.map((item, i) => (
                          <tr key={i} className="hover:bg-rice/50 transition-colors group">
                              <td className="py-4 pl-2 font-medium text-ink">{item.category}</td>
                              <td className="py-4 text-bamboo">Core Lesson</td>
                              <td className="py-4 text-bamboo">~50 items</td>
                              <td className="py-4 flex items-center gap-2 text-bamboo">
                                  <Clock size={14} className="text-bamboo" /> {item.avgTimeSpent}
                              </td>
                              <td className="py-4">
                                  <div className="flex items-center gap-4 text-xs">
                                      <span className="flex items-center gap-1 text-green-600"><Eye size={12} /> {item.views}</span>
                                      <span className="flex items-center gap-1 text-hanko"><TrendingUp size={12} /> {item.likes}</span>
                                  </div>
                              </td>
                              <td className="py-4 text-right">
                                  <Button variant="ghost" className="p-2 h-auto text-hanko hover:text-ink"><Edit size={16} /></Button>
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