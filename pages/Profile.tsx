
import React, { useState } from 'react';
import { Button, Input, WonderCard, GlassCard, Badge } from '../components/UI';
import { User } from '../types';
import { 
  Save, RefreshCw, Loader2, Shield, Calendar, Clock, 
  RotateCcw, User as UserIcon, Mail, Trophy, Star, Zap 
} from 'lucide-react';
import { motion } from 'framer-motion';

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

  const getAvatarUrl = (seed: string) => `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const newAvatar = avatarSeed !== user.username ? getAvatarUrl(avatarSeed) : user.avatar;

    // Simulate API update
    setTimeout(() => {
        onUpdate({
            ...user,
            username,
            avatar: newAvatar
        });
        setLoading(false);
    }, 800);
  };

  const toggleRole = () => {
      const newRole = user.role === 'admin' ? 'student' : 'admin';
      onUpdate({ ...user, role: newRole });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-12"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-ink font-jp mb-2">Player Profile</h1>
          <p className="text-bamboo font-medium flex items-center gap-2">
            <UserIcon size={16} /> Manage your identity and settings
          </p>
        </div>
        <Badge color={user.role === 'admin' ? "bg-hanko text-white border-hanko" : "bg-blue-100 text-blue-700 border-blue-200"}>
          {user.role === 'admin' ? 'Administrator' : 'Student Account'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Identity */}
        <div className="lg:col-span-1 space-y-6">
            <WonderCard colorClass="bg-white border-bamboo/10 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50 to-transparent z-0"></div>
                
                <div className="relative z-10 mt-4 mb-6 group">
                    <div className="w-40 h-40 rounded-full border-8 border-white bg-rice shadow-xl relative overflow-hidden">
                        <img 
                            src={avatarSeed !== user.username ? getAvatarUrl(avatarSeed) : user.avatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <button 
                        onClick={handleRandomizeAvatar}
                        className="absolute bottom-2 right-2 bg-white text-ink p-3 rounded-full shadow-lg border border-bamboo/10 hover:scale-110 hover:text-blue-500 transition-all"
                        title="Randomize Avatar"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>

                <h2 className="text-2xl font-black text-ink mb-1">{username}</h2>
                <p className="text-xs font-bold text-bamboo uppercase tracking-widest mb-6">Level {Math.floor((user.xp || 0)/1000) + 1} Learner</p>

                <div className="grid grid-cols-3 gap-2 w-full border-t border-bamboo/10 pt-6">
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-ink">{user.streak || 0}</span>
                        <span className="text-[10px] text-bamboo uppercase font-bold">Streak</span>
                    </div>
                    <div className="flex flex-col items-center border-l border-r border-bamboo/10">
                        <span className="text-lg font-black text-ink">{Math.floor((user.xp || 0)/1000) + 1}</span>
                        <span className="text-[10px] text-bamboo uppercase font-bold">Level</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-ink">{(user.xp || 0).toLocaleString()}</span>
                        <span className="text-[10px] text-bamboo uppercase font-bold">XP</span>
                    </div>
                </div>
            </WonderCard>

            {/* Role Switcher (Dev Tool) */}
            <GlassCard 
                className="cursor-pointer hover:border-hanko/30 transition-all group relative overflow-hidden"
                onClick={toggleRole}
            >
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${user.role === 'admin' ? 'bg-hanko text-white' : 'bg-bamboo/10 text-bamboo'}`}>
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-bamboo uppercase">Current Role</p>
                            <p className="font-black text-ink capitalize">{user.role}</p>
                        </div>
                    </div>
                    <RotateCcw size={16} className="text-bamboo group-hover:rotate-180 transition-transform duration-500" />
                </div>
                <div className="absolute inset-0 bg-hanko/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </GlassCard>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-2">
            <WonderCard colorClass="bg-white border-bamboo/10 h-full">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-bamboo/10">
                    <div className="w-8 h-8 bg-rice rounded-lg flex items-center justify-center text-ink">
                        <UserIcon size={18} />
                    </div>
                    <h3 className="font-bold text-lg text-ink">Account Details</h3>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Input 
                                id="username"
                                label="Display Name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                            />
                            
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-bamboo mb-2 ml-1">
                                    Email Address
                                </label>
                                <div className="w-full bg-rice border-2 border-bamboo/10 rounded-2xl px-5 py-4 text-bamboo font-bold flex items-center justify-between cursor-not-allowed opacity-70">
                                    <span>{user.email || 'guest@quizeon.app'}</span>
                                    <Shield size={16} />
                                </div>
                                <p className="text-[10px] text-bamboo mt-1 ml-1">* Email cannot be changed in guest mode</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <div className="bg-rice/50 p-4 rounded-2xl border border-bamboo/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={18} className="text-blue-500" />
                                        <div>
                                            <p className="text-[10px] font-bold text-bamboo uppercase">Joined Date</p>
                                            <p className="text-sm font-bold text-ink font-mono">{new Date(user.joinedDate || Date.now()).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full h-px bg-bamboo/10"></div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Clock size={18} className="text-green-500" />
                                        <div>
                                            <p className="text-[10px] font-bold text-bamboo uppercase">Last Active</p>
                                            <p className="text-sm font-bold text-ink font-mono">{new Date(user.lastActive || Date.now()).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-bamboo/10 flex items-center justify-between">
                        <p className="text-xs text-bamboo">
                            <span className="text-hanko">*</span> Changes are auto-saved to local storage
                        </p>
                        <Button type="submit" disabled={loading} size="lg" className="min-w-[160px]">
                            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                        </Button>
                    </div>
                </form>
            </WonderCard>
        </div>
      </div>
    </motion.div>
  );
};
