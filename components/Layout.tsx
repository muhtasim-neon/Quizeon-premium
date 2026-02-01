import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Gamepad2, Settings, LogOut, Menu, X, ShieldAlert, 
  GraduationCap, AlertTriangle, FileText, User as UserIcon, Map, Bot, 
  BookMarked, Sun, Moon, Volume2, VolumeX, Pause, Play, Square,
  Sliders, ChevronRight
} from 'lucide-react';
import { Button, Badge } from './UI';
import { authService } from '../services/supabaseMock';
import { User } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showExtendedSettings, setShowExtendedSettings] = useState(false);
  const navigate = useNavigate();
  
  // Global Settings
  const { 
    theme, toggleTheme, audioSettings, updateAudioSettings, 
    stopAudio, pauseAudio, resumeAudio, isSpeaking 
  } = useSettings();

  const handleLogout = () => {
    authService.signOut();
    onLogout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label, badge }: { to: string; icon: any; label: string; badge?: string }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm group ${
          isActive 
            ? 'bg-primary text-white shadow-md shadow-primary/20' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
        }`
      }
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'} />
            <span>{label}</span>
          </div>
          {badge && <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-bold shadow-sm">{badge}</span>}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex text-slate-900 dark:text-slate-200 overflow-hidden transition-colors duration-300">
      
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="secondary" 
          className="p-2.5 rounded-xl shadow-lg border border-slate-200 dark:border-white/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 lg:translate-x-0 flex flex-col shadow-2xl lg:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-5">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-serif font-bold text-xl">Q</span>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">QUIZEON</h1>
              <p className="text-[10px] text-primary tracking-[0.2em] font-bold uppercase">N5 Mastery</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
            {user.role === 'admin' ? (
              <>
                <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-4">Admin</div>
                <NavItem to="/admin" icon={ShieldAlert} label="Dashboard" />
                <NavItem to="/admin/users" icon={GraduationCap} label="Users" />
                <NavItem to="/admin/content" icon={BookOpen} label="Content CMS" />
                <NavItem to="/admin/settings" icon={Settings} label="Settings" />
                <NavItem to="/profile" icon={UserIcon} label="My Profile" />
              </>
            ) : (
              <>
                <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">Home</div>
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/roadmap" icon={Map} label="Roadmap" />
                
                <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">AI Dojo</div>
                <NavItem to="/sensei" icon={Bot} label="Sensei Chat" badge="AI" />
                <NavItem to="/reading" icon={BookMarked} label="Reading Room" badge="AI" />

                <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Learn</div>
                <NavItem to="/learning" icon={BookOpen} label="Learning Hub" />
                <NavItem to="/practice" icon={GraduationCap} label="Practice Arena" />
                <NavItem to="/arcade" icon={Gamepad2} label="Arcade Games" />
                
                <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Tools</div>
                <NavItem to="/mistakes" icon={AlertTriangle} label="Mistake Review" />
                <NavItem to="/documents" icon={FileText} label="Archives" />
                <NavItem to="/profile" icon={Settings} label="Settings" />
              </>
            )}
          </nav>

          {/* Control Bar (Theme & Sound) */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
             
             {/* Profile Snippet */}
             <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-4 border border-slate-100 dark:border-slate-800">
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 object-cover" />
                <div className="flex-1 min-w-0" onClick={() => navigate('/profile')}>
                   <p className="text-sm font-bold text-slate-800 dark:text-white truncate cursor-pointer hover:text-primary">{user.username}</p>
                   <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                </div>
                <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Logout">
                   <LogOut size={16} />
                </button>
             </div>

             <div className="grid grid-cols-3 gap-2">
                 <button 
                    onClick={toggleTheme}
                    className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                 >
                    {theme === 'dark' 
                        ? <Moon size={18} className="text-purple-400 group-hover:scale-110 transition-transform" /> 
                        : <Sun size={18} className="text-orange-500 group-hover:scale-110 transition-transform" />}
                 </button>

                 <button 
                    onClick={() => updateAudioSettings({ muted: !audioSettings.muted })}
                    className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                 >
                    {audioSettings.muted 
                        ? <VolumeX size={18} className="text-red-400 group-hover:scale-110 transition-transform" /> 
                        : <Volume2 size={18} className="text-green-400 group-hover:scale-110 transition-transform" />}
                 </button>

                 <button 
                    onClick={() => setShowExtendedSettings(!showExtendedSettings)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors group ${showExtendedSettings ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'}`}
                 >
                    <Sliders size={18} className="group-hover:scale-110 transition-transform" />
                 </button>
             </div>

             {/* Extended Mixer */}
             {showExtendedSettings && (
                 <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in shadow-inner">
                     <div className="space-y-1">
                         <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                             <span>Volume</span>
                             <span>{Math.round(audioSettings.volume * 100)}%</span>
                         </div>
                         <input 
                            type="range" min="0" max="1" step="0.1" 
                            value={audioSettings.volume}
                            onChange={(e) => updateAudioSettings({ volume: parseFloat(e.target.value) })}
                            className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                         />
                     </div>
                     <div className="space-y-1">
                         <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                             <span>Speed</span>
                             <span>{audioSettings.speed}x</span>
                         </div>
                         <input 
                            type="range" min="0.5" max="2" step="0.25" 
                            value={audioSettings.speed}
                            onChange={(e) => updateAudioSettings({ speed: parseFloat(e.target.value) })}
                            className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                         />
                     </div>
                 </div>
             )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 relative z-10 overflow-y-auto h-screen scroll-smooth p-4 lg:p-8">
        <div className="max-w-7xl mx-auto mt-14 lg:mt-0 animate-fade-in pb-10">
          {children}
        </div>
      </main>
    </div>
  );
};