// This replicates a Supabase client behavior for the specific requested demo credentials.
// In a real app, this would use the @supabase/supabase-js library.

import { User, ContentAnalytics } from '../types';

// Initial seed data with Subscription and Usage details
const DEFAULT_USERS: User[] = [
  {
    id: 'admin-001',
    username: 'admin',
    role: 'admin',
    avatar: 'https://picsum.photos/200',
    subscription: 'premium',
    xp: 99999,
    email: 'admin@quizeon.com',
    joinedDate: '2023-01-01',
    lastActive: 'Now'
  },
  {
    id: 'student-001',
    username: 'TanakaSan',
    role: 'student',
    streak: 12,
    xp: 4500,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Tanaka',
    subscription: 'free',
    email: 'tanaka@test.com',
    joinedDate: '2023-09-15',
    lastActive: '2 hours ago',
    mostUsedSection: 'Kanji Practice'
  },
  {
    id: 'student-002',
    username: 'SakuraFlower',
    role: 'student',
    streak: 45,
    xp: 12000,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sakura',
    subscription: 'premium',
    email: 'sakura@vip.com',
    joinedDate: '2023-08-20',
    lastActive: '5 mins ago',
    mostUsedSection: 'Arcade Games'
  },
  {
    id: 'student-003',
    username: 'KenjiRider',
    role: 'student',
    streak: 2,
    xp: 800,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Kenji',
    subscription: 'free',
    email: 'kenji@gmail.com',
    joinedDate: '2023-10-01',
    lastActive: '1 day ago',
    mostUsedSection: 'Conversation Dojo'
  },
  {
    id: 'student-004',
    username: 'MikaChan',
    role: 'student',
    streak: 80,
    xp: 25000,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Mika',
    subscription: 'premium',
    email: 'mika@premium.jp',
    joinedDate: '2023-05-10',
    lastActive: 'Now',
    mostUsedSection: 'Conversation Dojo'
  }
];

// Content Analytics Mock Data
const CONTENT_STATS: ContentAnalytics[] = [
  { category: 'N5 Kanji', views: 12500, likes: 450, avgTimeSpent: '12m', userRetention: 85 },
  { category: 'Arcade Games', views: 8900, likes: 1200, avgTimeSpent: '25m', userRetention: 92 },
  { category: 'Grammar Rules', views: 6200, likes: 230, avgTimeSpent: '8m', userRetention: 60 },
  { category: 'Vocabulary', views: 15000, likes: 300, avgTimeSpent: '5m', userRetention: 55 },
];

// Helper to access the "database" in localStorage
const getUsersDB = () => {
  const stored = localStorage.getItem('quizeon_users_db');
  if (!stored) {
    localStorage.setItem('quizeon_users_db', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  return JSON.parse(stored);
};

export const authService = {
  signIn: async (username: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Admin Override for prompt request
    if (username === 'admin' && password === 'admin') {
         const adminUser = DEFAULT_USERS[0];
         localStorage.setItem('quizeon_user', JSON.stringify(adminUser));
         return { user: adminUser, error: null };
    }

    // Default Student Credential Override (Requested: 1234/1234)
    if (username === '1234' && password === '1234') {
         const studentUser = DEFAULT_USERS[1]; // TanakaSan
         localStorage.setItem('quizeon_user', JSON.stringify(studentUser));
         return { user: studentUser, error: null };
    }

    const users = getUsersDB();
    const userMatch = users.find((u: any) => u.username === username && (u.password === password || password === 'user')); // Simple mock pass check

    if (userMatch) {
      const { password: _, ...safeUser } = userMatch;
      localStorage.setItem('quizeon_user', JSON.stringify(safeUser));
      return { user: safeUser as User, error: null };
    }

    return { user: null, error: 'Invalid username or password' };
  },

  signUp: async (username: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getUsersDB();
    if (users.find((u: any) => u.username === username)) {
      return { user: null, error: 'Username already taken' };
    }

    const newUser = {
      id: `student-${Date.now()}`,
      username,
      password, 
      role: 'student',
      streak: 1,
      xp: 0,
      subscription: 'free',
      joinedDate: new Date().toISOString().split('T')[0],
      mostUsedSection: 'Dashboard',
      email: `${username}@example.com`,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}&backgroundColor=b6e3f4`
    };

    users.push(newUser);
    localStorage.setItem('quizeon_users_db', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem('quizeon_user', JSON.stringify(safeUser));

    return { user: safeUser as User, error: null };
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<{ user: User | null; error: string | null }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = getUsersDB();
    const idx = users.findIndex((u: any) => u.id === userId);
    
    if (idx !== -1) {
      const updatedUser = { ...users[idx], ...updates };
      users[idx] = updatedUser;
      localStorage.setItem('quizeon_users_db', JSON.stringify(users));
      
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
         const { password, ...safeUser } = updatedUser;
         localStorage.setItem('quizeon_user', JSON.stringify(safeUser));
         return { user: safeUser as User, error: null };
      }
      
      const { password, ...safeUser } = updatedUser;
      return { user: safeUser, error: null };
    }
    return { user: null, error: 'User not found' };
  },

  signOut: async () => {
    localStorage.removeItem('quizeon_user');
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('quizeon_user');
    return stored ? JSON.parse(stored) : null;
  },

  getSystemStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsersDB();
    return {
      totalUsers: users.length,
      activeToday: Math.floor(users.length * 0.4),
      totalQuizzes: 8902,
      serverStatus: 'Healthy'
    };
  }
};

export const dataService = {
  getSystemStats: authService.getSystemStats,
  
  getRecentActivity: async () => {
     await new Promise(resolve => setTimeout(resolve, 500));
     return [
       { id: '1', user: 'SakuraFlower', action: 'Completed N5 Kanji Quiz', time: '2 mins ago', status: 'success' },
       { id: '2', user: 'KenjiRider', action: 'Failed Login Attempt', time: '15 mins ago', status: 'warning' },
       { id: '3', user: 'Admin', action: 'Updated Lesson 4 Content', time: '1 hour ago', status: 'success' },
       { id: '4', user: 'MikaChan', action: 'Upgraded to Premium', time: '3 hours ago', status: 'success' },
     ];
  },

  // New Admin Methods
  getAllUsers: async (): Promise<User[]> => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return getUsersDB();
  },

  getContentAnalytics: async (): Promise<ContentAnalytics[]> => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return CONTENT_STATS;
  }
};