// This replicates a Supabase client behavior for the specific requested demo credentials.
// In a real app, this would use the @supabase/supabase-js library.

import { User } from '../types';

// Initial seed data
const DEFAULT_USERS = [
  {
    id: 'admin-001',
    username: 'admin',
    role: 'admin',
    avatar: 'https://picsum.photos/200',
    password: 'admin'
  },
  {
    id: 'student-001',
    username: 'student',
    role: 'student',
    streak: 12,
    xp: 4500,
    avatar: 'https://picsum.photos/201',
    password: 'user'
  }
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

    const users = getUsersDB();
    // Simple authentication check
    const userMatch = users.find((u: any) => u.username === username && u.password === password);

    if (userMatch) {
      // Remove password before returning/storing session
      const { password: _, ...safeUser } = userMatch;
      localStorage.setItem('quizeon_user', JSON.stringify(safeUser));
      return { user: safeUser as User, error: null };
    }

    return { user: null, error: 'Invalid username or password' };
  },

  signUp: async (username: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getUsersDB();
    
    // Check if username exists
    if (users.find((u: any) => u.username === username)) {
      return { user: null, error: 'Username already taken' };
    }

    // Create new student user
    const newUser = {
      id: `student-${Date.now()}`,
      username,
      password, // In real app, hash this!
      role: 'student',
      streak: 1,
      xp: 0,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}&backgroundColor=b6e3f4`
    };

    // Save to DB
    users.push(newUser);
    localStorage.setItem('quizeon_users_db', JSON.stringify(users));

    // Create session (Auto login)
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem('quizeon_user', JSON.stringify(safeUser));

    return { user: safeUser as User, error: null };
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<{ user: User | null; error: string | null }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = getUsersDB();
    const idx = users.findIndex((u: any) => u.id === userId);
    
    if (idx !== -1) {
      // Merge updates
      const updatedUser = { ...users[idx], ...updates };
      users[idx] = updatedUser;
      
      // Save to DB
      localStorage.setItem('quizeon_users_db', JSON.stringify(users));
      
      // If updating currently logged in user, update session storage
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

  // Admin helper
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
       { id: '1', user: 'SakuraFan99', action: 'Completed N5 Kanji Quiz', time: '2 mins ago', status: 'success' },
       { id: '2', user: 'KenjiT', action: 'Failed Login Attempt', time: '15 mins ago', status: 'warning' },
       { id: '3', user: 'Admin', action: 'Updated Lesson 4 Content', time: '1 hour ago', status: 'success' },
       { id: '4', user: 'NewUser01', action: 'Registered Account', time: '3 hours ago', status: 'success' },
     ];
  }
};
