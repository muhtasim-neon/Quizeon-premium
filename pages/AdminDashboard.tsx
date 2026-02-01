import React, { useEffect, useState } from 'react';
import { GlassCard, Badge, Button } from '../components/UI';
import { Users, Server, BookOpen, Activity, AlertCircle, CheckCircle2, Search, Download, TrendingUp, Clock, ThumbsUp } from 'lucide-react';
import { dataService } from '../services/supabaseMock';
import { ActivityLog, ContentAnalytics } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [contentAnalytics, setContentAnalytics] = useState<ContentAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [statsData, logsData, analyticsData] = await Promise.all([
        dataService.getSystemStats(),
        dataService.getRecentActivity(),
        dataService.getContentAnalytics()
      ]);
      setStats(statsData);
      setLogs(logsData as ActivityLog[]);
      setContentAnalytics(analyticsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const chartData = [
    { name: 'Mon', users: 400 },
    { name: 'Tue', users: 300 },
    { name: 'Wed', users: 500 },
    { name: 'Thu', users: 280 },
    { name: 'Fri', users: 590 },
    { name: 'Sat', users: 320 },
    { name: 'Sun', users: 450 },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-primary"><span className="animate-pulse">Loading Admin Data...</span></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Overview</h1>
          <p className="text-slate-400">System health, user metrics, and content status.</p>
        </div>
        <div className="flex gap-3">
            <Button variant="secondary" className="px-4"><Download size={18} /> Report</Button>
            <Button><Activity size={18} /> Live Monitor</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard hoverEffect className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={80} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg text-primary"><Users size={20} /></div>
            <span className="text-slate-400 text-sm font-medium">Total Users</span>
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
          <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
            <CheckCircle2 size={12} /> +12% from last month
          </div>
        </GlassCard>

        <GlassCard hoverEffect className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={80} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><Activity size={20} /></div>
            <span className="text-slate-400 text-sm font-medium">Active Today</span>
          </div>
          <div className="text-3xl font-bold text-white">{stats.activeToday}</div>
          <div className="text-xs text-slate-400 mt-2">Currently online: 42</div>
        </GlassCard>

        <GlassCard hoverEffect className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookOpen size={80} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><BookOpen size={20} /></div>
            <span className="text-slate-400 text-sm font-medium">Total Quizzes</span>
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalQuizzes}</div>
          <div className="text-xs text-purple-400 mt-2">+540 this week</div>
        </GlassCard>

        <GlassCard hoverEffect className="relative overflow-hidden group border-green-500/20">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Server size={80} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300"><Server size={20} /></div>
            <span className="text-slate-400 text-sm font-medium">System Status</span>
          </div>
          <div className="text-3xl font-bold text-green-400">{stats.serverStatus}</div>
          <div className="text-xs text-slate-400 mt-2">Latency: 24ms</div>
        </GlassCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Traffic Chart */}
        <GlassCard className="lg:col-span-2 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">User Traffic (Last 7 Days)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  tick={{ fill: '#64748b' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fill: '#64748b' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#3a86ff' : 'rgba(58, 134, 255, 0.3)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Recent Activity Log */}
        <GlassCard className="lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            <Button variant="ghost" className="p-2 h-auto text-xs">View All</Button>
          </div>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  log.status === 'success' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' :
                  log.status === 'warning' ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]' :
                  'bg-red-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{log.action}</p>
                  <p className="text-xs text-slate-400">by <span className="text-primary">{log.user}</span></p>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">{log.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* NEW SECTION: Content Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <GlassCard>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-primary" /> Popular Content (Views)</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contentAnalytics} layout="vertical" margin={{ left: 40, right: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="category" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                        <Tooltip 
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        />
                        <Bar dataKey="views" radius={[0, 4, 4, 0]} barSize={20}>
                            {contentAnalytics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={'#3a86ff'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
         </GlassCard>

         <GlassCard>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Activity size={18} className="text-green-400" /> Engagement Metrics</h3>
            <div className="space-y-4">
                {contentAnalytics.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex-1">
                            <h4 className="font-bold text-white text-sm">{item.category}</h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Clock size={12} /> {item.avgTimeSpent}</span>
                                <span className="flex items-center gap-1"><ThumbsUp size={12} /> {item.likes}</span>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-xs text-slate-500 mb-1">Retention</div>
                             <div className={`font-bold ${item.userRetention > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                 {item.userRetention}%
                             </div>
                        </div>
                    </div>
                ))}
            </div>
         </GlassCard>
      </div>

      {/* User Management Table Preview */}
      <GlassCard>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Registered Users</h3>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search user..." 
              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-primary focus:outline-none w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-3 pl-2">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Last Login</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[1,2,3].map(i => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pl-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                    <span className="font-medium text-white">User {i}</span>
                  </td>
                  <td className="py-3 text-slate-300">Student</td>
                  <td className="py-3"><Badge color="bg-green-500/20 text-green-400">Active</Badge></td>
                  <td className="py-3 text-slate-500">2 hours ago</td>
                  <td className="py-3">
                    <button className="text-primary hover:text-primary-light font-medium">Edit</button>
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
