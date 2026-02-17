
import React, { useState, useEffect } from 'react';
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
import { Checklist } from './pages/Roadmap';
import { SenseiDojo } from './pages/SenseiDojo';
import { ReadingRoom } from './pages/ReadingRoom';
import { Subscription } from './pages/Subscription';
import { Games } from './pages/Games';
import { SRSStatus } from './pages/SRSStatus';
import { User } from './types';
import { SettingsProvider } from './contexts/SettingsContext';
import { authService } from './services/supabaseMock';
import { Loader2 } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for authenticated user on mount or create guest
  useEffect(() => {
    const checkAuth = async () => {
      const stored = authService.getCurrentUser();
      if (stored) {
        setUser(stored);
      } else {
        // No Login System: Auto-create guest user
        const guestUser: User = {
            id: 'guest-' + Math.random().toString(36).substr(2, 9),
            username: 'WonderStudent',
            role: 'student',
            avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Wonder',
            streak: 1,
            xp: 100,
            email: 'student@wonderkids.app',
            subscription: 'free',
            joinedDate: new Date().toISOString(),
            lastActive: new Date().toISOString()
        };
        setUser(guestUser);
        localStorage.setItem('quizeon_user', JSON.stringify(guestUser));
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Listen for XP/Profile updates
  useEffect(() => {
    const handleUserUpdate = () => {
        const stored = authService.getCurrentUser();
        if (stored) {
            setUser({ ...stored });
        }
    };
    window.addEventListener('user-update', handleUserUpdate);
    return () => window.removeEventListener('user-update', handleUserUpdate);
  }, []);

  const handleUpdateUser = (updated: User) => {
      setUser(updated);
      localStorage.setItem('quizeon_user', JSON.stringify(updated));
  };

  const handleLogout = () => {
      authService.signOut();
      // Instead of forcing login, just reload which will create a new guest
      window.location.reload();
  };

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center bg-rice">
              <Loader2 className="animate-spin text-hanko" size={48} />
          </div>
      );
  }

  // Fallback if something goes wrong with guest creation
  if (!user) return null;

  return (
    <SettingsProvider>
        <Router>
            <Layout user={user} onLogout={handleLogout}>
                <Routes>
                    {/* Admin Routes */}
                    {user.role === 'admin' && (
                        <>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/admin/content" element={<AdminContent />} />
                            <Route path="/admin/settings" element={<AdminSettings />} />
                        </>
                    )}

                    {/* User Routes */}
                    <Route path="/dashboard" element={<UserDashboard user={user} />} />
                    <Route path="/checklist" element={<Checklist />} />
                    <Route path="/learning" element={<LearningHub />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/sensei" element={<SenseiDojo />} />
                    <Route path="/reading" element={<ReadingRoom />} />
                    <Route path="/mistakes" element={<Mistakes />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/srs-status" element={<SRSStatus />} />
                    <Route path="/profile" element={<Profile user={user} onUpdate={handleUpdateUser} />} />
                    <Route path="/subscription" element={<Subscription />} />
                    
                    {/* Explicit Login Route for admin backdoor if needed, though Profile toggle exists */}
                    <Route path="/login" element={<Login onLogin={setUser} />} />

                    {/* Default Redirect */}
                    <Route path="*" element={<Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace />} />
                </Routes>
            </Layout>
        </Router>
    </SettingsProvider>
  );
}

export default App;
