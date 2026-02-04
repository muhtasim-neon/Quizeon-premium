
import { User, ContentAnalytics } from '../types';
import { supabase } from './supabaseClient';

// --- ADMIN AUTH BACKDOOR ONLY ---
// Load password from LocalStorage if available, otherwise default to 'admin'
let adminPassword = localStorage.getItem('quizeon_admin_pass') || 'admin';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  // Getter ensures we always check against the current variable state
  get password() { return adminPassword; },
  userObj: {
    id: 'admin-local-001',
    username: 'Admin',
    role: 'admin' as const,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Admin&backgroundColor=c93a40',
    subscription: 'premium' as const,
    xp: 99999,
    email: 'admin@quizeon.com',
    joinedDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    provider: 'local',
    metadata: { source: 'Local Admin Access' }
  }
};

// Key for storing mock users (created via Forgot Password or Sign Up)
const MOCK_USERS_KEY = 'quizeon_mock_users';

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

export const authService = {
  // Login with Username OR Email
  signIn: async (loginInput: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    const lowerInput = loginInput.toLowerCase().trim();
    
    // 1. Admin Backdoor (Checks both username 'admin' and email 'admin@quizeon.com')
    if ((lowerInput === ADMIN_CREDENTIALS.username || lowerInput === ADMIN_CREDENTIALS.userObj.email.toLowerCase()) && password === 'admin') {
         localStorage.setItem('quizeon_user', JSON.stringify(ADMIN_CREDENTIALS.userObj));
         return { user: ADMIN_CREDENTIALS.userObj, error: null };
    }

    // 2. Resolve Username to Email for Mock Lookup
    let lookupKey = lowerInput;
    const isEmail = String(lowerInput).match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (!isEmail) {
        try {
            const { data } = await supabase.from('profiles').select('email').eq('username', loginInput).single();
            if (data?.email) {
                lookupKey = data.email.toLowerCase();
            }
        } catch (e) {
            // Ignore error
        }
    }

    // 3. Mock Users Check
    const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '{}');
    if (mockUsers[lookupKey] && mockUsers[lookupKey] === password) {
        const mockUser: User = {
            id: `mock-${lookupKey.replace(/[^a-z0-9]/g, '')}`,
            username: isEmail ? lookupKey.split('@')[0] : loginInput,
            role: 'student',
            email: lookupKey,
            avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${lookupKey}`,
            xp: 0,
            streak: 0,
            subscription: 'free',
            joinedDate: new Date().toISOString(),
            lastActive: new Date().toISOString()
        };
        localStorage.setItem('quizeon_user', JSON.stringify(mockUser));
        return { user: mockUser, error: null };
    }

    // 4. Real Supabase Auth
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: lookupKey,
            password: password
        });

        if (error) throw error;
        
        if (data.user) {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
            const user = profile ? mapProfileToUser(profile) : {
                id: data.user.id,
                username: data.user.email?.split('@')[0] || 'User',
                role: 'student',
                email: data.user.email,
                subscription: 'free'
            } as User;

            localStorage.removeItem('quizeon_user');
            return { user, error: null };
        }
    } catch (err: any) {
        console.warn("Supabase Auth Error:", err.message);
        return { user: null, error: 'Invalid login credentials' };
    }

    return { user: null, error: 'Invalid login credentials' };
  },

  signInWithGoogle: async (): Promise<{ user?: User | null, error: string | null }> => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
        if (error) throw error;
        return { user: null, error: null };
    } catch (err: any) {
        return { user: null, error: err.message };
    }
  },

  signUp: async (email: string, username: string, password: string): Promise<{ user: User | null; error: string | null; message?: string }> => {
    const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '{}');
    mockUsers[email.toLowerCase()] = password;
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                    role: 'student',
                    subscription: 'free',
                    avatar_url: `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`
                }
            }
        });

        if (error) return { user: null, error: error.message };

        if (data.user) {
            await supabase.from('profiles').insert([{
                id: data.user.id,
                username: username,
                email: email,
                role: 'student',
                created_at: new Date().toISOString()
            }]);
            
            if (data.session) await supabase.auth.signOut();
            return { user: null, error: null, message: "Registration successful! Please log in." };
        }
    } catch (err: any) {
        return { user: null, error: null, message: "Registration successful! (Demo Mode)" };
    }
    return { user: null, error: 'Unknown registration error.' };
  },

  resetPassword: async (email: string): Promise<{ error: string | null; message?: string }> => {
    if (email.toLowerCase() === ADMIN_CREDENTIALS.userObj.email.toLowerCase()) {
        return { error: null, message: "Admin email verified. Please set new password." };
    }
    try {
        await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/#/profile',
        });
    } catch (e) {
        console.warn("Supabase reset email failed:", e);
    }
    return { error: null, message: "Email accepted. Proceed to set new password." };
  },

  updateUserPassword: async (newPassword: string, email?: string): Promise<{ error: string | null; message?: string }> => {
      if (email && email.toLowerCase() === ADMIN_CREDENTIALS.userObj.email.toLowerCase()) {
          adminPassword = newPassword;
          localStorage.setItem('quizeon_admin_pass', newPassword);
          return { error: null, message: "Admin password updated successfully. Please log in." };
      }
      if (email) {
          const lowerEmail = email.toLowerCase().trim();
          const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '{}');
          mockUsers[lowerEmail] = newPassword;
          localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));
          
          try {
              const { error } = await supabase.auth.updateUser({ password: newPassword });
              if (error) console.warn("Supabase update skipped (Session missing).");
          } catch (e) { /* ignore */ }

          return { error: null, message: "Password updated successfully. You can now log in." };
      }
      return { error: "Email required for password update.", message: null };
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<{ user: User | null; error: string | null }> => {
    try {
        await supabase.auth.updateUser({
            data: {
                username: updates.username,
                avatar_url: updates.avatar
            }
        });
        const { data, error } = await supabase
            .from('profiles')
            .update({ username: updates.username, avatar_url: updates.avatar })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return { user: mapProfileToUser(data), error: null };
    } catch (err: any) {
        const stored = localStorage.getItem('quizeon_user');
        if (stored) {
            const user = JSON.parse(stored);
            const updatedUser = { ...user, ...updates };
            localStorage.setItem('quizeon_user', JSON.stringify(updatedUser));
            return { user: updatedUser, error: null };
        }
        return { user: null, error: err.message };
    }
  },

  upgradeSubscription: async (): Promise<{ user: User | null }> => {
      // 1. Try Supabase update
      try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
              await supabase.auth.updateUser({
                  data: { subscription: 'premium' }
              });
              // Return optimistic update, listener in App.tsx will handle the rest
              return { user: null };
          }
      } catch(e) { console.log(e); }

      // 2. Local Update
      const stored = localStorage.getItem('quizeon_user');
      if (stored) {
          const user = JSON.parse(stored);
          const updatedUser = { ...user, subscription: 'premium' };
          localStorage.setItem('quizeon_user', JSON.stringify(updatedUser));
          return { user: updatedUser };
      }
      return { user: null };
  },

  signOut: async () => {
    localStorage.removeItem('quizeon_user');
    await supabase.auth.signOut();
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('quizeon_user');
    return stored ? JSON.parse(stored) : null;
  }
};

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
