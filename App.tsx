
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminContent } from './pages/AdminContent';
import { AdminSettings } from './pages/AdminSettings';
import { UserDashboard } from './pages/UserDashboard';
import { LearningHub } from './pages/LearningHub';
import { Mistakes } from './pages/Mistakes';
import { Documents } from './pages/Documents';
import { Profile } from './pages/Profile';
import { Roadmap } from './pages/Roadmap';
import { authService } from './services/supabaseMock';
import { supabase } from './services/supabaseClient';
import { User } from './types';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
        // 1. Check for Mock Session (LocalStorage)
        const mockUser = authService.getCurrentUser();
        if (mockUser) {
            setUser(mockUser);
            setLoading(false);
            return;
        }

        // 2. Check for Supabase Session
        if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const newUser: User = {
                    id: session.user.id,
                    username: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                    role: 'student',
                    avatar: session.user.user_metadata.avatar_url,
                    email: session.user.email,
                    xp: 0,
                    streak: 0,
                    subscription: 'free' // Default for Supabase logins
                };
                setUser(newUser);
            }

            // Listen for changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                // Prevent auto-login flash during signup flow
                if (sessionStorage.getItem('quizeon_signup_lock') === 'true') {
                    return;
                }

                if (session?.user) {
                    const newUser: User = {
                        id: session.user.id,
                        username: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                        role: 'student',
                        avatar: session.user.user_metadata.avatar_url,
                        email: session.user.email,
                        xp: 0,
                        streak: 0,
                        subscription: 'free'
                    };
                    setUser(newUser);
                } else {
                    // Only clear if not using mock user (to avoid conflict during logout)
                    if (!authService.getCurrentUser()) {
                        setUser(null);
                    }
                }
            });
            
            setLoading(false);
            return () => subscription.unsubscribe();
        } else {
            setLoading(false);
        }
    };

    initAuth();
  }, []);

  const handleLogout = async () => {
    // Sign out from both
    authService.signOut();
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return <div className="min-h-screen bg-rice flex items-center justify-center text-ink">Loading...</div>;

  return (
    <SettingsProvider>
        <Router>
        <Routes>
            <Route 
            path="/login" 
            element={!user ? <Login onLogin={setUser} /> : <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} />} 
            />
            
            {/* Protected Admin Routes */}
            <Route 
            path="/admin/*" 
            element={
                user && user.role === 'admin' ? (
                <Layout user={user} onLogout={handleLogout}>
                    <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/users" element={<AdminUsers />} />
                    <Route path="/content" element={<AdminContent />} />
                    <Route path="/settings" element={<AdminSettings />} />
                    <Route path="*" element={<Navigate to="/admin" />} />
                    </Routes>
                </Layout>
                ) : (
                <Navigate to="/login" />
                )
            } 
            />

            {/* Protected User Routes */}
            <Route 
            path="/*" 
            element={
                user ? (
                user.role === 'admin' ? <Navigate to="/admin" /> : (
                    <Layout user={user} onLogout={handleLogout}>
                    <Routes>
                        <Route path="/dashboard" element={<UserDashboard user={user} />} />
                        <Route path="/roadmap" element={<Roadmap />} />
                        <Route path="/learning" element={<LearningHub />} />
                        <Route path="/mistakes" element={<Mistakes />} />
                        <Route path="/documents" element={<Documents />} />
                        <Route path="/profile" element={<Profile user={user} onUpdate={setUser} />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                    </Layout>
                )
                ) : (
                <Navigate to="/login" />
                )
            } 
            />
        </Routes>
        </Router>
    </SettingsProvider>
  );
}

export default App;
