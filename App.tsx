import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { LearningHub } from './pages/LearningHub';
import { PracticeArena } from './pages/PracticeArena';
import { Mistakes } from './pages/Mistakes';
import { Documents } from './pages/Documents';
import { Profile } from './pages/Profile';
import { Roadmap } from './pages/Roadmap';
import { SenseiDojo } from './pages/SenseiDojo';
import { ReadingRoom } from './pages/ReadingRoom';
import { Arcade } from './pages/Arcade';
import { authService } from './services/supabaseMock';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for persisted session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) return null;

  return (
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
                  <Route path="*" element={<div className="p-8 text-center text-slate-500">Coming Soon</div>} />
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
                    <Route path="/sensei" element={<SenseiDojo />} />
                    <Route path="/reading" element={<ReadingRoom />} />
                    <Route path="/arcade" element={<Arcade />} />
                    <Route path="/learning" element={<LearningHub />} />
                    <Route path="/practice" element={<PracticeArena />} />
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
  );
}

export default App;
