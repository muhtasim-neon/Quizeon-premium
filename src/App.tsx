
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
        // User is signed in, fetch profile from Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as User;
            setUser(userData);
            localStorage.setItem('quizeon_user', JSON.stringify(userData));
          }
          setLoading(false);
        }, (error) => {
          console.error("Firestore Snapshot Error:", error.code, error.message);
          if (error.code === 'permission-denied') {
            // This often happens if the user document hasn't been created yet
            // or if Firestore Security Rules are too strict (e.g., requiring email verification)
            console.warn("Permission denied. If you just signed up, this is normal while your profile is being created.");
          }
          setLoading(false);
        });

        return () => {
          unsubDoc();
        };
      } else {
        // User is signed out from Firebase
        if (intervalId) clearInterval(intervalId);
        
        // Check if there's a guest user in localStorage
        const stored = localStorage.getItem('quizeon_user');
        if (stored) {
          const userData = JSON.parse(stored) as User;
          if (userData.isGuest) {
            setUser(userData);
            setLoading(false);
            return;
          }
        }

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
            <Route path="/learning" element={<LearningHub user={user} />} />
            <Route path="/games" element={<Games user={user} />} />
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
