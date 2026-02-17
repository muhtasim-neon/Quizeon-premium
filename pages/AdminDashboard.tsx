
import React, { useEffect, useState } from 'react';
import { GlassCard, Badge, Button, WonderCard } from '../components/UI';
import { Users, Activity, AlertCircle, Download, Clock, DollarSign, Bell } from 'lucide-react';
import { dataService } from '../services/supabaseMock';
import { ActivityLog } from '../types';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } }
};

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

  if (loading) return <div className="flex items-center justify-center h-96 text-hanko"><span className="animate-pulse">Loading Admin Data...</span></div>;

  return (
    <motion.div className="max-w-7xl mx-auto space-y-8 animate-fade-in" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div><h1 className="text-3xl font-bold text-ink mb-2 font-serif">Admin Dashboard</h1><p className="text-bamboo">Module 1: Overview & Metrics</p></div>
        <div className="flex gap-3"><div className="relative"><Button variant="secondary" className="px-3"><Bell size={18} /></Button><span className="absolute top-0 right-0 w-3 h-3 bg-hanko rounded-full animate-pulse border-2 border-white"></span></div><Button variant="primary" className="px-4"><Download size={18} /> Export Report</Button></div>
      </div>

      <motion.div variants={itemVariants} className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4">
          <div className="p-2 bg-white rounded-full text-red-600 shadow-sm"><AlertCircle size={20} /></div>
          <div className="flex-1"><h4 className="font-bold text-red-900 text-sm">System Alerts</h4><p className="text-xs text-red-700">3 Failed Payments (Bkash) detected in last hour. • 2 Potential Multi-device abuse flags.</p></div>
          <Button variant="danger" size="sm">Review</Button>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
          <WonderCard colorClass="bg-blue-50 border-blue-200 text-blue-900" className="h-full">
            <div className="flex items-center justify-between mb-4"><div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm"><Users size={24} /></div><span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">+12%</span></div>
            <div className="text-3xl font-bold mb-1">{stats.users.total}</div><p className="text-xs opacity-70 font-bold">Total Users ({stats.users.activeToday} Active Today)</p>
          </WonderCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <WonderCard colorClass="bg-green-50 border-green-200 text-green-900" className="h-full">
            <div className="flex items-center justify-between mb-4"><div className="p-3 bg-white rounded-xl text-green-600 shadow-sm"><DollarSign size={24} /></div><span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Growth</span></div>
            <div className="text-3xl font-bold mb-1">৳{stats.revenue.today.toLocaleString()}</div><p className="text-xs opacity-70 font-bold">Today's Revenue</p>
          </WonderCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <WonderCard colorClass="bg-orange-50 border-orange-200 text-orange-900" className="h-full">
            <div className="flex items-center justify-between mb-4"><div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm"><Clock size={24} /></div></div>
            <div className="text-3xl font-bold mb-1">{stats.engagement.avgSession}</div><p className="text-xs opacity-70 font-bold">Avg Session Time</p>
          </WonderCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <WonderCard colorClass="bg-purple-50 border-purple-200 text-purple-900" className="h-full">
            <div className="flex items-center justify-between mb-4"><div className="p-3 bg-white rounded-xl text-purple-600 shadow-sm"><Activity size={24} /></div></div>
            <div className="text-3xl font-bold mb-1">{stats.engagement.gamePlaysToday}</div><p className="text-xs opacity-70 font-bold">Game Plays Today</p>
          </WonderCard>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <WonderCard colorClass="bg-white border-bamboo/10" className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-ink">User Growth & Conversion</h3><select className="bg-rice border border-bamboo/20 rounded-lg text-xs px-2 py-1 outline-none"><option>Last 7 Days</option><option>Last 30 Days</option></select></div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs><linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c93a40" stopOpacity={0.1}/><stop offset="95%" stopColor="#c93a40" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="name" stroke="#8d6e63" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#8d6e63" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="#c93a40" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </WonderCard>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-1">
          <WonderCard colorClass="bg-white border-bamboo/10" className="h-full">
            <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-ink">Live Activity</h3><span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span></div>
            <div className="space-y-4">
              {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-rice border border-bamboo/5">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${log.status === 'success' ? 'bg-green-500' : log.status === 'warning' ? 'bg-orange-500' : 'bg-hanko'}`} />
                      <div className="flex-1 min-w-0"><p className="text-sm font-bold text-ink">{log.action}</p><p className="text-xs text-bamboo">by {log.user}</p></div>
                      <span className="text-[10px] text-bamboo/70 whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-bamboo/5">{log.time}</span>
                  </div>
              ))}
            </div>
          </WonderCard>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
