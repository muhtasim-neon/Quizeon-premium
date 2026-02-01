import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Gamepad2, Settings, LogOut, Menu, X, ShieldAlert, 
  GraduationCap, AlertTriangle, FileText, User as UserIcon, Map, Bot, 
  BookMarked, Volume2, VolumeX, Sliders
} from 'lucide-react';
import { Button } from './UI';
import { authService } from '../services/supabaseMock';
import { User } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

// Generate random sakura petals
const SakuraBackground = () => {
  const [petals, setPetals] = useState<Array<{id: number, left: string, size: string, delay: string, duration: string}>>([]);

  useEffect(() => {
    // Generate fewer petals for better performance and subtler effect
    const generated = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`, // Avoid edges
      size: `${Math.random() * 8 + 6}px`,
      delay: `${Math.random() * 15}s`,
      duration: `${Math.random() * 10 + 10}s` // Slower fall
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map(p => (
        <div 
          key={p.id}
          className="sakura animate-sakura-fall opacity-0"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration
          }}
        />
      ))}
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showExtendedSettings, setShowExtendedSettings] = useState(false);
  const navigate = useNavigate();
  
  const { 
    audioSettings, updateAudioSettings
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
        `flex items-center justify-between px-4 py-3.5 mx-2 rounded-xl transition-all duration-300 font-medium text-sm group relative overflow-hidden ${
          isActive 
            ? 'bg-hanko/5 text-hanko shadow-sm' 
            : 'text-bamboo hover:bg-bamboo/5 hover:text-ink'
        }`
      }
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {({ isActive }) => (
        <>
          {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-hanko rounded-r-full"></div>}
          <div className="flex items-center gap-3 relative z-10">
            <Icon size={18} className={isActive ? 'text-hanko' : 'text-bamboo/70 group-hover:text-ink transition-colors'} />
            <span className={isActive ? 'font-bold' : ''}>{label}</span>
          </div>
          {badge && <span className="text-[10px] bg-hanko text-white px-2 py-0.5 rounded-full font-bold shadow-sm shadow-hanko/20">{badge}</span>}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="min-h-screen flex text-ink overflow-hidden font-jp bg-rice selection:bg-hanko/20 selection:text-hanko">
      
      {/* Background Animation */}
      <SakuraBackground />

      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="secondary" 
          className="p-2.5 rounded-lg shadow-lg bg-white/80 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar - Designed like a scroll/sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white/80 backdrop-blur-xl border-r border-bamboo/10 transform transition-transform duration-500 lg:translate-x-0 flex flex-col shadow-2xl shadow-ink/5 lg:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-4 pt-4">
            <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center shadow-lg shadow-ink/20 text-rice">
              {/* Torii Gate SVG Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6c0 0 5-3 9-3s9 3 9 3" />
                <path d="M5 10h14" />
                <path d="M8 6v14" />
                <path d="M16 6v14" />
              </svg>
            </div>
            <div>
              <h1 className="font-sans font-extrabold text-2xl tracking-tighter text-ink uppercase">QUIZEON</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
            {user.role === 'admin' ? (
              <>
                <div className="px-6 text-[10px] font-bold text-bamboo uppercase tracking-widest mb-2 mt-4 opacity-70">Admin</div>
                <NavItem to="/admin" icon={ShieldAlert} label="Dashboard" />
                <NavItem to="/admin/users" icon={GraduationCap} label="Users" />
                <NavItem to="/admin/content" icon={BookOpen} label="Content CMS" />
                <NavItem to="/admin/settings" icon={Settings} label="Settings" />
                <NavItem to="/profile" icon={UserIcon} label="My Profile" />
              </>
            ) : (
              <>
                <div className="px-6 text-[10px] font-bold text-bamboo uppercase tracking-widest mb-2 mt-2 opacity-70">Home</div>
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/roadmap" icon={Map} label="Roadmap" />
                
                <div className="px-6 text-[10px] font-bold text-bamboo uppercase tracking-widest mb-2 mt-6 opacity-70">Learn</div>
                <NavItem to="/learning" icon={BookOpen} label="Learning Hub" />
                
                <div className="px-6 text-[10px] font-bold text-bamboo uppercase tracking-widest mb-2 mt-6 opacity-70">Tools</div>
                <NavItem to="/mistakes" icon={AlertTriangle} label="Mistake Review" />
                <NavItem to="/documents" icon={FileText} label="Archives" />
                <NavItem to="/profile" icon={Settings} label="Settings" />
              </>
            )}
          </nav>

          {/* Control Bar */}
          <div className="mt-4 pt-4 border-t border-bamboo/10 px-2">
             
             {/* Profile Snippet */}
             <div className="flex items-center gap-3 p-3 rounded-xl bg-rice/80 mb-4 border border-bamboo/10 hover:border-bamboo/30 transition-colors cursor-pointer" onClick={() => navigate('/profile')}>
                <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-rice border-2 border-white shadow-sm object-cover" />
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-ink truncate group-hover:text-hanko transition-colors">{user.username}</p>
                   <p className="text-[10px] text-bamboo capitalize">{user.role}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="p-2 text-bamboo hover:text-hanko hover:bg-red-50 rounded-lg transition-colors" title="Logout">
                   <LogOut size={16} />
                </button>
             </div>

             <div className="grid grid-cols-2 gap-2">
                 <button 
                    onClick={() => updateAudioSettings({ muted: !audioSettings.muted })}
                    className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-bamboo/10 transition-colors group border border-transparent hover:border-bamboo/20 bg-white/50"
                 >
                    {audioSettings.muted 
                        ? <VolumeX size={18} className="text-hanko group-hover:scale-110 transition-transform" /> 
                        : <Volume2 size={18} className="text-green-600 group-hover:scale-110 transition-transform" />}
                 </button>

                 <button 
                    onClick={() => setShowExtendedSettings(!showExtendedSettings)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors group border border-transparent bg-white/50 ${showExtendedSettings ? 'bg-hanko/5 text-hanko border-hanko/10' : 'hover:bg-bamboo/10 text-bamboo hover:border-bamboo/20'}`}
                 >
                    <Sliders size={18} className="group-hover:scale-110 transition-transform" />
                 </button>
             </div>

             {/* Extended Mixer */}
             {showExtendedSettings && (
                 <div className="mt-3 p-4 bg-white/90 rounded-2xl border border-bamboo/10 space-y-4 animate-fade-in shadow-lg absolute bottom-24 left-4 right-4 backdrop-blur-md z-50">
                     <div className="space-y-2">
                         <div className="flex justify-between text-[10px] uppercase font-bold text-bamboo">
                             <span>Volume</span>
                             <span>{Math.round(audioSettings.volume * 100)}%</span>
                         </div>
                         <input 
                            type="range" min="0" max="1" step="0.1" 
                            value={audioSettings.volume}
                            onChange={(e) => updateAudioSettings({ volume: parseFloat(e.target.value) })}
                            className="w-full h-1.5 bg-bamboo/20 rounded-full appearance-none cursor-pointer accent-hanko"
                         />
                     </div>
                     <div className="space-y-2">
                         <div className="flex justify-between text-[10px] uppercase font-bold text-bamboo">
                             <span>Speed</span>
                             <span>{audioSettings.speed}x</span>
                         </div>
                         <input 
                            type="range" min="0.5" max="2" step="0.25" 
                            value={audioSettings.speed}
                            onChange={(e) => updateAudioSettings({ speed: parseFloat(e.target.value) })}
                            className="w-full h-1.5 bg-bamboo/20 rounded-full appearance-none cursor-pointer accent-hanko"
                         />
                     </div>
                 </div>
             )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 relative z-10 overflow-y-auto h-screen scroll-smooth p-4 lg:p-10">
        <div className="max-w-7xl mx-auto mt-16 lg:mt-0 animate-ink-bleed pb-12">
          {children}
        </div>
      </main>
    </div>
  );
};