
import React, { useEffect, useState } from 'react';
import { GlassCard, Badge, Button } from '../components/UI';
import { Users, Activity, AlertCircle, Download, Clock, DollarSign, Bell } from 'lucide-react';
import { dataService } from '../services/supabaseMock';
import { ActivityLog } from '../types';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [adminStats, logsData, growthData] = await Promise.all([
        dataService.getAdminStats(),
        dataService.getRecentActivity(),
        dataService.getUserGrowthStats()
      ]);
      setStats(adminStats);
      setLogs(logsData as ActivityLog[]);
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
          <h1 className="text-3xl font-bold text-ink mb-2 font-serif">Admin Dashboard</h1>
          <p className="text-bamboo">Module 1: Overview & Metrics</p>
        </div>
        <div className="flex gap-3">
            <div className="relative">
                <Button variant="secondary" className="px-3"><Bell size={18} /></Button>
                <span className="absolute top-0 right-0 w-3 h-3 bg-hanko rounded-full animate-pulse border-2 border-white"></span>
            </div>
            <Button variant="primary" className="px-4"><Download size={18} /> Export Report</Button>
        </div>
      </div>

      <div className="bg-red-50 border border-hanko/20 rounded-xl p-4 flex items-center gap-4 animate-fade-in">
          <div className="p-2 bg-white rounded-full text-hanko shadow-sm"><AlertCircle size={20} /></div>
          <div className="flex-1">
              <h4 className="font-bold text-ink text-sm">System Alerts</h4>
              <p className="text-xs text-bamboo">3 Failed Payments (Bkash) detected in last hour. • 2 Potential Multi-device abuse flags.</p>
          </div>
          <Button variant="danger" size="sm">Review</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard hoverEffect className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-hanko/10 rounded-xl text-hanko"><Users size={24} /></div>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">+12%</span>
          </div>
          <div className="text-3xl font-bold text-ink mb-1">{stats.users.total}</div>
          <p className="text-xs text-bamboo">Total Users ({stats.users.activeToday} Active Today)</p>
        </GlassCard>

        <GlassCard hoverEffect className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl text-green-600"><DollarSign size={24} /></div>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Growth</span>
          </div>
          <div className="text-3xl font-bold text-ink mb-1">৳{stats.revenue.today.toLocaleString()}</div>
          <p className="text-xs text-bamboo">Today's Revenue</p>
        </GlassCard>

        <GlassCard hoverEffect className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><Clock size={24} /></div>
          </div>
          <div className="text-3xl font-bold text-ink mb-1">{stats.engagement.avgSession}</div>
          <p className="text-xs text-bamboo">Avg Session Time</p>
        </GlassCard>

        <GlassCard hoverEffect className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl text-purple-600"><Activity size={24} /></div>
          </div>
          <div className="text-3xl font-bold text-ink mb-1">{stats.engagement.gamePlaysToday}</div>
          <p className="text-xs text-bamboo">Game Plays Today</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-ink">User Growth & Conversion</h3>
              <select className="bg-rice border border-bamboo/20 rounded-lg text-xs px-2 py-1 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
              </select>
          </div>
          {/* Recharts fix: Explicit height parent */}
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c93a40" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#c93a40" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#8d6e63" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#8d6e63" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#c93a40" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-ink">Live Activity</h3>
            <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <div className="space-y-4">
            {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/40 border border-bamboo/5">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    log.status === 'success' ? 'bg-green-500' :
                    log.status === 'warning' ? 'bg-orange-500' :
                    'bg-hanko'
                    }`} />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-ink">{log.action}</p>
                        <p className="text-xs text-bamboo">by {log.user}</p>
                    </div>
                    <span className="text-[10px] text-bamboo/70 whitespace-nowrap bg-rice px-1.5 py-0.5 rounded">{log.time}</span>
                </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
