
import React, { useState } from 'react';
import { Button, Input, WonderCard } from '@/components/UI';
import { User } from '@/types';
import { Save, RefreshCw, Loader2, Shield, Calendar, Clock, RotateCcw, LogOut } from 'lucide-react';
import { auth, db } from '@/services/firebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [username, setUsername] = useState(user.username);
  const [loading, setLoading] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState(user.username);

  const handleRandomizeAvatar = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const getAvatarUrl = () => `https://api.dicebear.com/9.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=b6e3f4`;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.isGuest) {
      const newAvatar = avatarSeed !== user.username ? getAvatarUrl() : user.avatar;
      const updatedUser = { ...user, username, avatar: newAvatar };
      localStorage.setItem('quizeon_user', JSON.stringify(updatedUser));
      onUpdate(updatedUser);
      return;
    }
    setLoading(true);
    
    const newAvatar = avatarSeed !== user.username ? getAvatarUrl() : user.avatar;

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        username,
        avatar: newAvatar
      });
      // onUpdate is called by the onSnapshot listener in App.tsx
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async () => {
      if (user.isGuest) return;
      const newRole = user.role === 'admin' ? 'student' : 'admin';
      try {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, { role: newRole });
      } catch (err) {
        console.error("Error toggling role:", err);
      }
  };

  const handleLogout = async () => {
    if (user.isGuest) {
      localStorage.removeItem('quizeon_user');
      window.location.href = '/#/login';
      window.location.reload();
      return;
    }
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-ink">Profile Settings</h1>
        <p className="text-bamboo">Manage your account information</p>
        {user.isGuest && (
          <div className="mt-4 p-4 bg-hanko/10 border border-hanko/20 rounded-2xl flex items-center gap-3">
            <Shield className="text-hanko shrink-0" size={24} />
            <div>
              <p className="text-sm font-black text-hanko uppercase tracking-widest">Guest Mode Active</p>
              <p className="text-xs text-bamboo font-medium">Your progress is only saved locally on this device. Create an account to sync your data across devices.</p>
            </div>
          </div>
        )}
      </div>

      <WonderCard colorClass="bg-white border-bamboo/10">
        <form onSubmit={handleSave} className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative group">
                    <img 
                        src={avatarSeed !== user.username ? getAvatarUrl() : user.avatar} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full border-4 border-white bg-rice object-cover shadow-lg" 
                    />
                    <div className="absolute bottom-0 right-0 bg-hanko rounded-full p-2 border-4 border-rice cursor-pointer hover:bg-red-700 transition-colors z-20" onClick={handleRandomizeAvatar} title="Randomize Avatar">
                        <RefreshCw size={16} className="text-white" />
                    </div>
                </div>
                <p className="text-xs text-bamboo">Click the refresh icon to generate a new avatar</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                <Input 
                    id="username"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                />

                <div className="grid grid-cols-2 gap-4">
                    {/* Role Toggler - Explicit for Demo */}
                    <div 
                        className="p-4 rounded-xl bg-white/40 border border-bamboo/10 relative group cursor-pointer hover:border-hanko/30 transition-colors hover:bg-white/60 hover:shadow-md" 
                        onClick={toggleRole} 
                        title="Click to switch role (Dev Mode)"
                    >
                        <label className="block text-sm font-bold text-bamboo mb-1 uppercase tracking-wide">Account Type (Demo)</label>
                        <div className="flex items-center gap-2 text-ink font-mono mt-1">
                            <Shield size={20} className={user.role === 'admin' ? "text-hanko" : "text-bamboo"} />
                            <span className="capitalize font-black text-lg">{user.role}</span>
                            <div className="ml-auto flex items-center gap-1 text-xs text-hanko font-bold bg-hanko/10 px-2 py-1 rounded">
                                <RotateCcw size={12} /> Switch
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/40 border border-bamboo/10">
                        <label className="block text-sm font-medium text-bamboo mb-1">User ID</label>
                        <div className="text-ink font-mono text-xs truncate opacity-70">
                            {user.id}
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/40 border border-bamboo/10">
                        <label className="block text-sm font-medium text-bamboo mb-1">Joined Date</label>
                        <div className="flex items-center gap-2 text-ink font-mono text-sm">
                            <Calendar size={16} className="text-blue-500" />
                            <span>{user.joinedDate || 'N/A'}</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/40 border border-bamboo/10">
                        <label className="block text-sm font-medium text-bamboo mb-1">Last Active</label>
                        <div className="flex items-center gap-2 text-ink font-mono text-sm">
                            <Clock size={16} className="text-green-600" />
                            <span>{user.lastActive || 'Now'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-bamboo/10 flex justify-between items-center">
                <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-100 hover:bg-red-50">
                    <LogOut size={18} className="mr-2" /> Logout
                </Button>
                <Button type="submit" disabled={loading} className="relative z-20">
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                </Button>
            </div>
        </form>
      </WonderCard>
    </div>
  );
};
