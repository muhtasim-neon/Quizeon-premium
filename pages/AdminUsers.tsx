
import React, { useEffect, useState } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { User } from '../types';
import { dataService } from '../services/supabaseMock';
import { Search, Crown, User as UserIcon, Filter, Mail, Calendar, BarChart2, RefreshCw, X, Shield, Zap, Hash, Clock, Database, ChevronRight, Code, Fingerprint, Lock, Globe } from 'lucide-react';

// Helper for Modal Details
const DetailItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number | undefined }) => (
    <div className="p-3 bg-white/50 rounded-xl border border-bamboo/10">
        <div className="flex items-center gap-2 text-xs font-bold text-bamboo uppercase tracking-wider mb-1">
            <Icon size={12} /> {label}
        </div>
        <div className="text-ink font-medium truncate" title={String(value)}>
            {value || 'N/A'}
        </div>
    </div>
);

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'premium' | 'free'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRawData, setShowRawData] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await dataService.getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset raw data view when user changes
  useEffect(() => {
      setShowRawData(false);
  }, [selectedUser]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ? true : user.subscription === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 relative">
      
      {/* --- DETAILS MODAL --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedUser(null)}>
            <GlassCard className="w-full max-w-2xl relative bg-rice shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors z-10"
                >
                    <X size={20} className="text-ink" />
                </button>
                
                <div className="flex flex-col items-center mb-8 relative">
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bamboo/10 to-transparent -mt-6 -mx-6"></div>
                    <div className="relative">
                        <img src={selectedUser.avatar} alt={selectedUser.username} className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-rice mb-4 object-cover" />
                        <div className="absolute bottom-4 right-0 bg-white rounded-full p-1 shadow-sm border border-bamboo/10">
                             {selectedUser.role === 'admin' ? <Shield size={16} className="text-hanko" /> : <UserIcon size={16} className="text-bamboo" />}
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-ink mb-1">{selectedUser.username}</h2>
                    <div className="flex items-center gap-2">
                        <Badge color={selectedUser.role === 'admin' ? 'bg-hanko text-white' : 'bg-bamboo/10 text-ink'}>
                            {selectedUser.role.toUpperCase()}
                        </Badge>
                        <span className="text-bamboo text-xs">•</span>
                        <span className="text-bamboo text-sm">{selectedUser.email}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                            <Fingerprint size={16} className="text-hanko" /> Auth Details
                        </h3>
                        <div className="bg-ink/5 p-4 rounded-xl border border-bamboo/10 font-mono text-xs text-ink break-all mb-3">
                            <span className="text-bamboo block mb-1">UUID</span>
                            {selectedUser.id}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <DetailItem icon={Globe} label="Provider" value={selectedUser.provider || 'email'} />
                            <DetailItem icon={Calendar} label="Created At" value={selectedUser.joinedDate} />
                            <DetailItem icon={Clock} label="Last Sign In" value={selectedUser.lastActive} />
                            <DetailItem icon={Crown} label="Plan" value={selectedUser.subscription.toUpperCase()} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                            <BarChart2 size={16} className="text-green-600" /> Performance Metrics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <DetailItem icon={Zap} label="Current Streak" value={`${selectedUser.streak || 0} Days`} />
                            <DetailItem icon={Crown} label="Total XP" value={selectedUser.xp?.toLocaleString()} />
                            <DetailItem icon={Database} label="Most Used" value={selectedUser.mostUsedSection || 'N/A'} />
                        </div>
                    </div>

                    {/* RAW DATA TOGGLE */}
                    <div className="pt-4 border-t border-bamboo/10">
                        <button 
                            onClick={() => setShowRawData(!showRawData)}
                            className="flex items-center gap-2 text-sm font-bold text-bamboo hover:text-ink transition-colors w-full"
                        >
                            <Code size={16} /> 
                            {showRawData ? 'Hide' : 'View'} Raw Supabase Data
                        </button>
                        
                        {showRawData && (
                            <div className="mt-4 p-4 bg-ink/5 rounded-xl border border-bamboo/10 overflow-hidden animate-fade-in">
                                <pre className="text-xs font-mono text-ink/80 overflow-x-auto whitespace-pre-wrap">
                                    {JSON.stringify(selectedUser.metadata || selectedUser, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-bamboo/10">
                    <Button variant="ghost" className="text-hanko hover:bg-red-50" onClick={() => alert('Feature coming soon')}>Reset Password</Button>
                    <Button onClick={() => setSelectedUser(null)}>Close Details</Button>
                </div>
            </GlassCard>
        </div>
      )}

      {/* --- MAIN HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">User Management</h1>
          <p className="text-bamboo">Supabase Auth & Profile Database.</p>
        </div>
        <div className="flex gap-2">
            <Button 
                variant="secondary"
                onClick={fetchUsers}
                disabled={loading}
                className="text-sm px-4 py-2"
                title="Refresh User List"
            >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button 
                variant="primary" 
                onClick={() => alert('Feature not available in mock mode')}
                className="text-sm px-4 py-2"
            >
                Add User
            </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-bamboo w-5 h-5" />
        <input 
            type="text"
            placeholder="Search by username, email or UID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/40 border border-bamboo/20 rounded-xl pl-12 pr-4 py-3 text-ink focus:outline-none focus:border-hanko transition-all shadow-sm"
        />
      </div>

      {/* Users List - Table Style for Detail Density */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map(user => (
            <GlassCard key={user.id} className="flex flex-col md:flex-row items-center gap-6 p-4 group hover:border-hanko/30 transition-all hover:shadow-md cursor-pointer" onClick={() => setSelectedUser(user)}>
                
                {/* 1. Identity */}
                <div className="flex items-center gap-4 w-full md:w-1/4">
                    <div className="relative shrink-0">
                        <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full bg-rice object-cover border-2 border-white shadow-sm" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                             <h3 className="text-sm font-bold text-ink truncate">{user.email}</h3>
                        </div>
                        <div className="text-[10px] text-bamboo font-mono truncate" title={user.id}>
                            UID: {user.id.substring(0, 12)}...
                        </div>
                    </div>
                </div>

                {/* 2. Provider & Plan */}
                <div className="w-full md:w-1/6 flex flex-row md:flex-col justify-between md:justify-center gap-1 border-t md:border-t-0 md:border-l border-bamboo/10 pt-2 md:pt-0 md:pl-4">
                    <div className="flex items-center gap-2">
                         <Mail size={12} className="text-bamboo" />
                         <span className="text-xs font-medium text-ink capitalize">{user.provider || 'email'}</span>
                    </div>
                    <Badge color={user.subscription === 'premium' ? 'bg-straw/20 text-straw border-straw/30' : 'bg-bamboo/10 text-bamboo border-bamboo/20'}>
                        {user.subscription.toUpperCase()}
                    </Badge>
                </div>

                {/* 3. Timestamps (The specific data requested) */}
                <div className="flex-1 w-full grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-bamboo/10 pt-2 md:pt-0 md:pl-4">
                     <div>
                         <div className="text-[10px] text-bamboo uppercase font-bold tracking-wider mb-0.5">Created At</div>
                         <div className="text-xs text-ink font-mono">{user.joinedDate}</div>
                     </div>
                     <div>
                         <div className="text-[10px] text-bamboo uppercase font-bold tracking-wider mb-0.5">Last Sign In</div>
                         <div className="text-xs text-ink font-mono">{user.lastActive}</div>
                     </div>
                </div>

                {/* Arrow Action */}
                <div className="hidden md:flex items-center text-bamboo/30 group-hover:text-hanko transition-colors group-hover:translate-x-1">
                    <ChevronRight size={20} />
                </div>
            </GlassCard>
        ))}

        {filteredUsers.length === 0 && (
            <div className="text-center py-16 text-bamboo bg-white/20 rounded-2xl border border-dashed border-bamboo/20">
                {loading ? <span className="flex items-center justify-center gap-2"><RefreshCw className="animate-spin" size={20} /> Loading database...</span> : 'No users found.'}
            </div>
        )}
      </div>
    </div>
  );
};
