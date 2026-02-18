
import { User, ContentAnalytics } from '../types';
import { supabase } from './supabaseClient';

// Helper to map Supabase DB profile to App User
const mapProfileToUser = (p: any): User => ({
    id: p.id,
    username: p.username || p.full_name || 'Unknown User',
    role: p.role || 'student',
    email: p.email,
    avatar: p.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${p.id}&backgroundColor=b6e3f4`,
    xp: p.xp || 0,
    streak: p.streak || 0,
    subscription: p.subscription || 'free',
    joinedDate: p.created_at ? new Date(p.created_at).toLocaleString() : undefined,
    lastActive: p.last_sign_in_at ? new Date(p.last_sign_in_at).toLocaleString() : undefined,
    mostUsedSection: p.most_used_section,
    provider: p.provider || 'email',
    metadata: p // Store full raw data for inspection
});

export const dataService = {
  // 1. EXTENDED ADMIN STATS (Module 1)
  getAdminStats: async () => {
    return {
        users: { total: 1240, activeToday: 342, active7Days: 890, premium: 156 },
        revenue: { today: 12000, month: 345000, growth: 12 }, // BDT
        engagement: { avgSession: '18m', gamePlaysToday: 2100 },
        system: { status: 'Healthy', latency: '45ms' }
    };
  },
  
  // 2. RECENT ACTIVITY
  getRecentActivity: async () => {
     // Mocking detailed logs
     return [
         { id: '1', user: 'Karim', action: 'Purchased Monthly Plan', time: '2m ago', status: 'success' },
         { id: '2', user: 'Rahim', action: 'Failed Payment (Bkash)', time: '15m ago', status: 'error' },
         { id: '3', user: 'System', action: 'Daily Backup Completed', time: '1h ago', status: 'success' },
         { id: '4', user: 'Tanvir', action: 'Log in from new device', time: '2h ago', status: 'warning' },
         { id: '5', user: 'Sarah', action: 'Completed N5 Kanji Quiz', time: '3h ago', status: 'success' }
     ];
  },

  // 3. ENHANCED USER FETCH (Module 2)
  getAllUsers: async (): Promise<User[]> => {
      try {
          // Fetch directly from database if available
          const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
          if (!error && data) return data.map(mapProfileToUser);
          
          // MOCK USERS for visual display if DB empty
          return Array.from({ length: 15 }).map((_, i) => ({
              id: `u-${i}`,
              username: ['Tanvir', 'Sarah', 'Karim', 'Rahim', 'Nadia'][i % 5] + `_${i}`,
              email: `user${i}@example.com`,
              role: i === 0 ? 'admin' : 'student',
              subscription: i % 3 === 0 ? 'premium' : 'free',
              xp: Math.floor(Math.random() * 10000),
              streak: Math.floor(Math.random() * 50),
              joinedDate: '2023-10-01',
              lastActive: '2h ago',
              // New fields for admin
              devices: Math.floor(Math.random() * 3) + 1,
              jlptLevel: 'N5',
              planType: i % 3 === 0 ? 'Monthly' : 'Free'
          })) as any;
      } catch (e) {
          return [];
      }
  },

  // 4. CONTENT ANALYTICS
  getContentAnalytics: async (): Promise<ContentAnalytics[]> => {
      // Mock data aligned with Module 9
      return [
          { category: 'N5 Kanji', views: 4500, likes: 320, avgTimeSpent: '12m', userRetention: 85 },
          { category: 'Greetings', views: 3200, likes: 210, avgTimeSpent: '5m', userRetention: 92 },
          { category: 'Particles', views: 2800, likes: 150, avgTimeSpent: '15m', userRetention: 60 }, // Low retention, needs attention
          { category: 'Counters', views: 1500, likes: 90, avgTimeSpent: '8m', userRetention: 75 }
      ];
  },

  // 5. USER GROWTH
  getUserGrowthStats: async () => {
      return [
          { name: 'Mon', users: 45, premium: 2 },
          { name: 'Tue', users: 52, premium: 5 },
          { name: 'Wed', users: 48, premium: 3 },
          { name: 'Thu', users: 70, premium: 8 },
          { name: 'Fri', users: 65, premium: 6 },
          { name: 'Sat', users: 90, premium: 12 },
          { name: 'Sun', users: 85, premium: 10 },
      ];
  }
};
