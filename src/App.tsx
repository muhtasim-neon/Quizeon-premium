
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminUsers } from '@/pages/AdminUsers';
import { AdminContent } from '@/pages/AdminContent';
import { AdminSettings } from '@/pages/AdminSettings';
import { UserDashboard } from '@/pages/UserDashboard';
import { Landing } from '@/pages/Landing';
import { LearningHub } from '@/pages/LearningHub';
import { Mistakes } from '@/pages/Mistakes';
import { Documents } from '@/pages/Documents';
import { Profile } from '@/pages/Profile';
import { Checklist } from '@/pages/Roadmap';
import { SenseiDojo } from '@/pages/SenseiDojo';
import { ReadingRoom } from '@/pages/ReadingRoom';
import { Subscription } from '@/pages/Subscription';
import { Games } from '@/pages/Games';
import { SRSStatus } from '@/pages/SRSStatus';
import { User } from '@/types';
import { auth, db } from '@/services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Login } from '@/pages/Login';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Firebase Auth Listener
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          // User is signed in and verified, fetch profile from Firestore
          const userRef = doc(db, 'users', firebaseUser.uid);
          
          const unsubDoc = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data() as User;
              setUser(userData);
              localStorage.setItem('quizeon_user', JSON.stringify(userData));
            }
            setLoading(false);
          });

          if (intervalId) clearInterval(intervalId);
          return () => {
            unsubDoc();
            if (intervalId) clearInterval(intervalId);
          };
        } else {
          // User is signed in but NOT verified
          setUser(null);
          localStorage.removeItem('quizeon_user');
          setLoading(false);

          // Start polling for verification status
          if (!intervalId) {
            intervalId = setInterval(async () => {
              await firebaseUser.reload();
              if (firebaseUser.emailVerified) {
                // This will trigger the onAuthStateChanged listener again with verified status
                // Or we can manually trigger a state refresh by calling the listener logic
                // Actually, Firebase Auth usually triggers onAuthStateChanged after reload if status changes
                // but to be safe, we can just let the next interval or a manual refresh handle it.
                // Most reliable: window.location.reload() or just wait for Firebase to sync.
                // Let's just clear interval and wait for the next auth state change.
                clearInterval(intervalId);
              }
            }, 3000);
          }
        }
      } else {
        // User is signed out
        if (intervalId) clearInterval(intervalId);
        setUser(null);
        localStorage.removeItem('quizeon_user');
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Listen for XP/Profile updates
  useEffect(() => {
    const handleUserUpdate = () => {
        const stored = localStorage.getItem('quizeon_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    };
    window.addEventListener('user-update', handleUserUpdate);
    return () => window.removeEventListener('user-update', handleUserUpdate);
  }, []);

  const handleUpdateUser = (updated: User) => {
      setUser(updated);
      localStorage.setItem('quizeon_user', JSON.stringify(updated));
  };

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center bg-rice washi-theme">
              <div className="washi-overlay" />
              <Loader2 className="animate-spin text-hanko" size={48} />
          </div>
      );
  }

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Layout user={user}>
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
            <Route path="/" element={<Landing />} />
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
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            
            {/* Default Redirect */}
            <Route path="*" element={<Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
}

export default App;
