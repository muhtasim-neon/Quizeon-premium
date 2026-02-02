
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
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [statsData, logsData, analyticsData, growthData] = await Promise.all([
        dataService.getSystemStats(),
        dataService.getRecentActivity(),
        dataService.getContentAnalytics(),
        dataService.getUserGrowthStats()
      ]);
      setStats(statsData);
      setLogs(logsData as ActivityLog[]);
      setContentAnalytics(analyticsData);
      setChartData(growthData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-hanko"><span className="animate-pulse">Loading Admin Data...</span></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">Admin Overview</h1>
          <p className="text-bamboo">Real-time system health and user metrics.</p>
        </div>
        <div className="flex gap-3">
            <Button variant="secondary" className="px-4"><Download size={18} /> Report</Button>
            <Button><Activity size={18} /> Live Monitor</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard hoverEffect className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={80} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-hanko/10 rounded-lg text-hanko"><Users size={20} /></div>
            <span className="text-bamboo text-sm font-medium">Total Users</span>
          </div>
          <div className="text-3xl font-bold text-ink">{stats.totalUsers}</div>
          <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <CheckCircle2 size={12} /> Live Count
          </div>
        </GlassCard>

        <GlassCard hoverEffect className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity size={80} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-600"><Activity size={20} /></div>
            <span className="text-bamboo text-sm font-medium">Active Today</span>
          </div>
          <div className="text-3xl font-bold text-ink">{stats.activeToday}</div>
          <div className="text-xs text-bamboo mt-2">Unique Logins</div>
        </GlassCard>

        <GlassCard hoverEffect className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BookOpen size={80} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-straw/20 rounded-lg text-straw"><BookOpen size={20} /></div>
            <span className="text-bamboo text-sm font-medium">Total Quizzes</span>
          </div>
          <div className="text-3xl font-bold text-ink">{stats.totalQuizzes}</div>
          <div className="text-xs text-straw mt-2 font-bold">Completed</div>
        </GlassCard>

        <GlassCard hoverEffect className="relative overflow-hidden group border-bamboo/20">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Server size={80} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-ink/5 rounded-lg text-ink"><Server size={20} /></div>
            <span className="text-bamboo text-sm font-medium">System Status</span>
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.serverStatus}</div>
          <div className="text-xs text-bamboo mt-2">Supabase Connected</div>
        </GlassCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Traffic Chart */}
        <GlassCard className="lg:col-span-2 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-ink mb-6">User Signups (Last 7 Days)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#8d6e63" 
                  tick={{ fill: '#8d6e63' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#8d6e63" 
                  tick={{ fill: '#8d6e63' }} 
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(141, 110, 99, 0.1)' }}
                  contentStyle={{ backgroundColor: '#fdfaf1', border: '1px solid rgba(141, 110, 99, 0.2)', borderRadius: '8px', color: '#3e2723' }}
                  itemStyle={{ color: '#3e2723' }}
                />
                <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 6 ? '#bc2f32' : '#8d6e63'} fillOpacity={index === 6 ? 1 : 0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Recent Activity Log */}
        <GlassCard className="lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-ink">Recent Activity</h3>
            <Button variant="ghost" className="p-2 h-auto text-xs">View All</Button>
          </div>
          <div className="space-y-4">
            {logs.length === 0 ? (
                <div className="text-center text-bamboo py-10">No recent activity found.</div>
            ) : (
                logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-rice/50 transition-colors border border-transparent hover:border-bamboo/10">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                    log.status === 'success' ? 'bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.5)]' :
                    log.status === 'warning' ? 'bg-orange-500 shadow-[0_0_8px_rgba(251,146,60,0.5)]' :
                    'bg-hanko shadow-[0_0_8px_rgba(188,47,50,0.5)]'
                    }`} />
                    <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{log.action}</p>
                    <p className="text-xs text-bamboo">by <span className="text-hanko font-bold">{log.user}</span></p>
                    </div>
                    <span className="text-[10px] text-bamboo/70 whitespace-nowrap">{log.time}</span>
                </div>
                ))
            )}
          </div>
        </GlassCard>
      </div>

      {/* NEW SECTION: Content Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <GlassCard>
            <h3 className="text-lg font-bold text-ink mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-hanko" /> Popular Content (Views)</h3>
            <div className="h-64 w-full">
                {contentAnalytics.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-bamboo">No analytics data available.</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={contentAnalytics} layout="vertical" margin={{ left: 40, right: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="category" type="category" width={100} tick={{fill: '#8d6e63', fontSize: 12}} axisLine={false} tickLine={false} />
                            <Tooltip 
                                cursor={{fill: 'rgba(141, 110, 99, 0.1)'}}
                                contentStyle={{ backgroundColor: '#fdfaf1', border: '1px solid rgba(141, 110, 99, 0.2)', borderRadius: '8px' }}
                            />
                            <Bar dataKey="views" radius={[0, 4, 4, 0]} barSize={20}>
                                {contentAnalytics.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={'#bc2f32'} fillOpacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
         </GlassCard>

         <GlassCard>
            <h3 className="text-lg font-bold text-ink mb-6 flex items-center gap-2"><Activity size={18} className="text-green-600" /> Engagement Metrics</h3>
            <div className="space-y-4">
                {contentAnalytics.length === 0 ? (
                    <div className="text-center text-bamboo py-10">No engagement data available.</div>
                ) : (
                    contentAnalytics.slice(0, 5).map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-bamboo/10">
                            <div className="flex-1">
                                <h4 className="font-bold text-ink text-sm">{item.category}</h4>
                                <div className="flex items-center gap-3 mt-1 text-xs text-bamboo">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {item.avgTimeSpent}</span>
                                    <span className="flex items-center gap-1"><ThumbsUp size={12} /> {item.likes}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-bamboo mb-1">Retention</div>
                                <div className={`font-bold ${item.userRetention > 80 ? 'text-green-600' : 'text-straw'}`}>
                                    {item.userRetention}%
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
         </GlassCard>
      </div>
    </div>
  );
};
