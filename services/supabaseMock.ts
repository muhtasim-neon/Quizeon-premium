
import { User, ContentAnalytics } from '../types';
import { supabase } from './supabaseClient';

// --- ADMIN AUTH BACKDOOR ONLY ---
// This user is strictly for the login bypass requested.
// It will NOT be merged into the user list unless it exists in the database.
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123', // Updated to admin123 as requested
  userObj: {
    id: 'admin-local-001',
    username: 'Admin',
    role: 'admin' as const,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Admin&backgroundColor=c93a40',
    subscription: 'premium' as const,
    xp: 0,
    email: 'admin@quizeon.com',
    joinedDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    provider: 'local',
    metadata: { source: 'Local Admin Access' }
  }
};

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
    
    // 1. Admin Backdoor (Requested Feature)
    if (loginInput.toLowerCase().trim() === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
         localStorage.setItem('quizeon_user', JSON.stringify(ADMIN_CREDENTIALS.userObj));
         return { user: ADMIN_CREDENTIALS.userObj, error: null };
    }

    // 2. Real Supabase Auth
    try {
        let emailToUse = loginInput;
        const isEmail = String(loginInput).toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

        if (!isEmail) {
            // Username lookup
            const { data: profiles } = await supabase
                .from('profiles')
                .select('email')
                .eq('username', loginInput)
                .single();
            
            if (profiles) emailToUse = profiles.email;
            else return { user: null, error: 'Username not found.' };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: emailToUse,
            password: password
        });

        if (error) throw error;
        
        if (data.user) {
            // Fetch profile to get full details
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
        return { user: null, error: err.message || 'Authentication failed' };
    }

    return { user: null, error: 'User not found' };
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
            // Ensure profile is created
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
        return { user: null, error: err.message };
    }
    return { user: null, error: 'Unknown registration error.' };
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<{ user: User | null; error: string | null }> => {
    try {
        // Update Supabase Auth Metadata
        await supabase.auth.updateUser({
            data: {
                username: updates.username,
                avatar_url: updates.avatar
            }
        });

        // Update Public Profile
        const { data, error } = await supabase
            .from('profiles')
            .update({ 
                username: updates.username, 
                avatar_url: updates.avatar 
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return { user: mapProfileToUser(data), error: null };
    } catch (err: any) {
        return { user: null, error: err.message };
    }
  },

  signOut: async () => {
    localStorage.removeItem('quizeon_user');
    await supabase.auth.signOut();
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('quizeon_user');
    return stored ? JSON.parse(stored) : null;
  },

  getSystemStats: async () => {
    return {
      totalUsers: 0, activeToday: 0, totalQuizzes: 0, serverStatus: 'Online'
    };
  }
};

export const dataService = {
  // 1. REAL SYSTEM STATS
  getSystemStats: async () => {
    try {
        // Count Profiles
        const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        
        // Count Active Today (based on last_sign_in_at if exists)
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const { count: activeToday } = await supabase.from('profiles')
            .select('*', { count: 'exact', head: true })
            .gte('last_sign_in_at', today.toISOString());

        // Count Quizzes
        const { count: totalQuizzes } = await supabase.from('quiz_results').select('*', { count: 'exact', head: true });

        return {
            totalUsers: totalUsers || 0,
            activeToday: activeToday || 0,
            totalQuizzes: totalQuizzes || 0,
            serverStatus: 'Online'
        };
    } catch (e) {
        console.warn("Error fetching system stats:", e);
        return { totalUsers: 0, activeToday: 0, totalQuizzes: 0, serverStatus: 'Error' };
    }
  },
  
  // 2. REAL RECENT ACTIVITY
  getRecentActivity: async () => {
     try {
         // Try fetching from an activity_logs table
         const { data, error } = await supabase
            .from('activity_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

         if (!error && data && data.length > 0) {
             return data.map((log: any) => ({
                 id: log.id,
                 user: log.username || 'User',
                 action: log.action,
                 time: new Date(log.created_at).toLocaleTimeString(),
                 status: log.status || 'success'
             }));
         }

         // Fallback: If no activity logs table, use 'New User Joined' from profiles
         const { data: newUsers } = await supabase
            .from('profiles')
            .select('username, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

         if (newUsers) {
             return newUsers.map((u: any, i: number) => ({
                 id: `new-${i}`,
                 user: u.username || 'Unknown',
                 action: 'Joined the platform',
                 time: new Date(u.created_at).toLocaleString(),
                 status: 'success'
             }));
         }
         
         return [];
     } catch (e) {
         return [];
     }
  },

  // 3. REAL ALL USERS FETCH
  getAllUsers: async (): Promise<User[]> => {
      try {
          // Fetch directly from database
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          if (!data) return [];

          return data.map(mapProfileToUser);
      } catch (e) {
          console.error("Failed to fetch real users:", e);
          return [];
      }
  },

  // 4. REAL CONTENT ANALYTICS
  getContentAnalytics: async (): Promise<ContentAnalytics[]> => {
      try {
          const { data, error } = await supabase.from('content_analytics').select('*');
          if (error || !data) return [];
          
          return data.map((d: any) => ({
              category: d.category,
              views: d.views,
              likes: d.likes,
              avgTimeSpent: d.avg_time,
              userRetention: d.retention
          }));
      } catch (e) {
          return [];
      }
  },

  // 5. REAL USER GROWTH STATS (Last 7 Days)
  getUserGrowthStats: async () => {
      try {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0,0,0,0);

        const { data } = await supabase
            .from('profiles')
            .select('created_at')
            .gte('created_at', sevenDaysAgo.toISOString());
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const chartData = [];

        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dayName = dayNames[d.getDay()];
            
            // Count matching records for this day
            const count = data ? data.filter((row: any) => {
                const rowDate = new Date(row.created_at);
                return rowDate.getDate() === d.getDate() && rowDate.getMonth() === d.getMonth();
            }).length : 0;
            
            chartData.push({ name: dayName, users: count });
        }
        
        return chartData;
      } catch (e) {
          console.error("Error fetching growth stats:", e);
          return [];
      }
  }
};
