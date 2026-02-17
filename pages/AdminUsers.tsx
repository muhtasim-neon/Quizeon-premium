
import React, { useEffect, useState } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { User } from '../types';
import { dataService } from '../services/supabaseMock';
import { Search, Crown, User as UserIcon, Smartphone, Mail, Calendar, MoreVertical, RefreshCw, X, Shield, Lock, Trash2, LogOut } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]); // Using any to accommodate new mock fields
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const data = await dataService.getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = (action: string, userName: string) => {
      alert(`${action} for ${userName} triggered.`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">User Management</h1>
          <p className="text-bamboo">Module 2: Users, Plans & Security</p>
        </div>
        <Button onClick={fetchUsers} variant="secondary"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></Button>
      </div>

      <GlassCard className="!p-0 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-bamboo/10 bg-rice/50 text-xs font-bold text-bamboo uppercase tracking-wider">
              <div className="col-span-3">User / Email</div>
              <div className="col-span-2">Plan</div>
              <div className="col-span-2">Progress</div>
              <div className="col-span-2">Devices</div>
              <div className="col-span-2">Last Active</div>
              <div className="col-span-1 text-right">Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-bamboo/5">
              {users.map((user) => (
                  <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/60 transition-colors group">
                      
                      {/* Identity */}
                      <div className="col-span-3 flex items-center gap-3">
                          <img src={user.avatar} className="w-8 h-8 rounded-full bg-rice border border-bamboo/10" />
                          <div className="min-w-0">
                              <div className="font-bold text-ink text-sm truncate">{user.username}</div>
                              <div className="text-[10px] text-bamboo truncate">{user.email}</div>
                          </div>
                      </div>

                      {/* Plan */}
                      <div className="col-span-2">
                          <Badge color={user.subscription === 'premium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-500'}>
                              {user.planType || 'Free'}
                          </Badge>
                      </div>

                      {/* Level */}
                      <div className="col-span-2 text-sm text-ink">
                          <span className="font-bold">{user.jlptLevel || 'N5'}</span>
                          <span className="text-[10px] text-bamboo ml-2">XP: {user.xp}</span>
                      </div>

                      {/* Devices (Security) */}
                      <div className="col-span-2 flex items-center gap-2">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded border ${user.devices > 2 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-bamboo border-bamboo/20'}`}>
                              <Smartphone size={14} />
                              <span className="text-xs font-bold">{user.devices || 1} / 2</span>
                          </div>
                      </div>

                      {/* Active */}
                      <div className="col-span-2 text-xs text-bamboo">
                          {user.lastActive}
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleAction('Block', user.username)} className="p-1.5 hover:bg-red-100 text-hanko rounded"><Lock size={14} /></button>
                          <button onClick={() => handleAction('Reset Devices', user.username)} className="p-1.5 hover:bg-blue-100 text-blue-600 rounded"><LogOut size={14} /></button>
                      </div>
                  </div>
              ))}
          </div>
      </GlassCard>
    </div>
  );
};
