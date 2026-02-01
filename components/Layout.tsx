import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Gamepad2, 
  Settings, 
  LogOut, 
  Menu,
  X,
  ShieldAlert,
  GraduationCap,
  AlertTriangle,
  FileText,
  User as UserIcon,
  Map,
  Bot,
  MessageCircle,
  BookMarked
} from 'lucide-react';
import { GlassCard, Button } from './UI';
import { authService } from '../services/supabaseMock';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.signOut();
    onLogout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label, badge }: { to: string; icon: any; label: string; badge?: string }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
          isActive 
            ? 'bg-primary/20 text-white border border-primary/20' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`
      }
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <span>{label}</span>
      </div>
      {badge && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">{badge}</span>}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-dark-bg flex text-slate-200 selection:bg-primary selection:text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="secondary" 
          className="p-3 rounded-xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 glass border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-serif font-bold text-xl">Q</span>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-wide text-white">QUIZEON</h1>
              <p className="text-[10px] text-primary tracking-[0.2em] font-bold uppercase">N5 Mastery</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
            {user.role === 'admin' ? (
              <>
                <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Admin</div>
                <NavItem to="/admin" icon={ShieldAlert} label="Admin Dashboard" />
                <NavItem to="/admin/users" icon={GraduationCap} label="User Management" />
                <NavItem to="/admin/content" icon={BookOpen} label="Content CMS" />
                <NavItem to="/admin/settings" icon={Settings} label="System Settings" />
                <NavItem to="/profile" icon={UserIcon} label="My Profile" />
              </>
            ) : (
              <>
                <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">Core</div>
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/roadmap" icon={Map} label="N5 Roadmap" />
                
                <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">AI Dojo (Gemini)</div>
                <NavItem to="/sensei" icon={Bot} label="Sensei Chat" badge="AI" />
                <NavItem to="/reading" icon={BookMarked} label="Reading Room" badge="AI" />
                {/* <NavItem to="/conversation" icon={MessageCircle} label="Roleplay" badge="Live" /> */}

                <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Learning</div>
                <NavItem to="/learning" icon={BookOpen} label="Learning Hub" />
                <NavItem to="/practice" icon={GraduationCap} label="Practice Arena" />
                <NavItem to="/arcade" icon={Gamepad2} label="Arcade Games" />
                
                <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Review & Tools</div>
                <NavItem to="/mistakes" icon={AlertTriangle} label="Mistake Review" />
                <NavItem to="/documents" icon={FileText} label="Archives" />
                <NavItem to="/profile" icon={Settings} label="Settings" />
              </>
            )}
          </nav>

          {/* User Profile Footer */}
          <div className="mt-auto pt-6 border-t border-white/10">
            <GlassCard className="p-3 flex items-center gap-3 !bg-white/5 !border-0 cursor-pointer hover:bg-white/10" onClick={() => navigate('/profile')}>
              <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-slate-700 object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.username}</p>
                <div className="flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                className="text-slate-400 hover:text-red-400 transition-colors p-2"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </GlassCard>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 relative z-10 overflow-y-auto h-screen scroll-smooth p-4 lg:p-8">
        <div className="max-w-7xl mx-auto mt-16 lg:mt-0 animate-fade-in pb-10">
          {children}
        </div>
      </main>
    </div>
  );
};
