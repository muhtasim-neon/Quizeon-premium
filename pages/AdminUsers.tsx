import React, { useEffect, useState } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { User } from '../types';
import { dataService } from '../services/supabaseMock';
import { Search, Crown, User as UserIcon, Filter, Mail, Calendar, BarChart2 } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'premium' | 'free'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dataService.getAllUsers().then(setUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ? true : user.subscription === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">User Management</h1>
          <p className="text-bamboo">Monitor student progress, subscriptions, and behavior.</p>
        </div>
        <div className="flex gap-2">
            <Button 
                variant={filter === 'all' ? 'primary' : 'secondary'} 
                onClick={() => setFilter('all')}
                className="text-sm px-4 py-2"
            >
                All
            </Button>
            <Button 
                variant={filter === 'premium' ? 'primary' : 'secondary'} 
                onClick={() => setFilter('premium')}
                className="text-sm px-4 py-2"
            >
                <Crown size={14} className="mr-2" /> Premium
            </Button>
            <Button 
                variant={filter === 'free' ? 'primary' : 'secondary'} 
                onClick={() => setFilter('free')}
                className="text-sm px-4 py-2"
            >
                <UserIcon size={14} className="mr-2" /> Free
            </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-bamboo w-5 h-5" />
        <input 
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/40 border border-bamboo/20 rounded-xl pl-12 pr-4 py-3 text-ink focus:outline-none focus:border-hanko transition-all"
        />
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map(user => (
            <GlassCard key={user.id} className="flex flex-col md:flex-row items-center gap-6 p-6 group hover:border-hanko/30 transition-all">
                {/* Avatar & Basic Info */}
                <div className="flex items-center gap-4 w-full md:w-1/3">
                    <div className="relative">
                        <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full bg-rice object-cover border-2 border-bamboo/20" />
                        {user.subscription === 'premium' && (
                            <div className="absolute -top-1 -right-1 bg-straw text-white p-1 rounded-full shadow-lg">
                                <Crown size={12} fill="currentColor" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-ink">{user.username}</h3>
                        <div className="flex items-center gap-2 text-bamboo text-sm">
                            <Mail size={12} /> {user.email || 'No email'}
                        </div>
                        <div className="flex items-center gap-2 text-bamboo/70 text-xs mt-1">
                            <Calendar size={12} /> Joined: {user.joinedDate || 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Stats & Behavior */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 w-full border-t md:border-t-0 md:border-l border-bamboo/10 md:pl-6 pt-4 md:pt-0">
                    <div>
                        <div className="text-xs text-bamboo uppercase font-bold tracking-wider">Plan</div>
                        <Badge color={user.subscription === 'premium' ? 'bg-straw/20 text-straw border-straw/30' : 'bg-bamboo/10 text-bamboo border-bamboo/20'}>
                            {user.subscription.toUpperCase()}
                        </Badge>
                    </div>
                    <div>
                        <div className="text-xs text-bamboo uppercase font-bold tracking-wider">XP</div>
                        <div className="text-lg font-mono font-bold text-hanko">{user.xp?.toLocaleString()}</div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                         <div className="text-xs text-bamboo uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                             <BarChart2 size={12} /> Most Used
                         </div>
                         <div className="text-sm font-medium text-ink bg-white/40 border border-bamboo/10 px-2 py-1 rounded inline-block">
                             {user.mostUsedSection || 'Dashboard'}
                         </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="w-full md:w-auto flex justify-end">
                    <Button variant="ghost" className="text-sm">Edit</Button>
                    <Button variant="secondary" className="text-sm ml-2">Details</Button>
                </div>
            </GlassCard>
        ))}

        {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-bamboo">
                No users found matching your criteria.
            </div>
        )}
      </div>
    </div>
  );
};