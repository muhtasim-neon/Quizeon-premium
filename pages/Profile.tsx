
import React, { useState } from 'react';
import { GlassCard, Button, Input, WonderCard } from '../components/UI';
import { User } from '../types';
import { authService } from '../services/supabaseMock';
import { User as UserIcon, Save, RefreshCw, Loader2, Shield, Calendar, Clock, RotateCcw } from 'lucide-react';

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
    setLoading(true);
    
    // Only update avatar if seed changed, otherwise keep existing
    const newAvatar = avatarSeed !== user.username ? getAvatarUrl() : user.avatar;

    // Simulate API update
    setTimeout(() => {
        onUpdate({
            ...user,
            username,
            avatar: newAvatar
        });
        setLoading(false);
    }, 500);
  };

  // Feature to toggle role in no-login mode
  const toggleRole = () => {
      const newRole = user.role === 'admin' ? 'student' : 'admin';
      onUpdate({ ...user, role: newRole });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-ink">Profile Settings</h1>
        <p className="text-bamboo">Manage your account information</p>
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
                    {/* Role Toggler */}
                    <div 
                        className="p-4 rounded-xl bg-white/40 border border-bamboo/10 relative group cursor-pointer hover:border-hanko/30 transition-colors hover:bg-white/60" 
                        onClick={toggleRole} 
                        title="Click to switch role (Dev Mode)"
                    >
                        <label className="block text-sm font-medium text-bamboo mb-1">Role</label>
                        <div className="flex items-center gap-2 text-ink font-mono">
                            <Shield size={16} className={user.role === 'admin' ? "text-hanko" : "text-bamboo"} />
                            <span className="capitalize font-bold">{user.role}</span>
                            <RotateCcw size={12} className="ml-auto opacity-0 group-hover:opacity-100 text-bamboo" />
                        </div>
                        <div className="absolute top-2 right-2 text-[10px] text-hanko opacity-0 group-hover:opacity-100 font-bold uppercase tracking-widest">Switch</div>
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

            <div className="pt-4 border-t border-bamboo/10 flex justify-end">
                <Button type="submit" disabled={loading} className="relative z-20">
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                </Button>
            </div>
        </form>
      </WonderCard>
    </div>
  );
};
