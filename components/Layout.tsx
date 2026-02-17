
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Map, BookOpen, Mic, Bookmark, FolderOpen, 
  Gamepad2, LogOut, Crown, Menu, X, Brain
} from 'lucide-react';
import { authService } from '../services/supabaseMock';
import { User } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

// Custom Torii Gate Icon to match the Logo in SS
const ToriiGate = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 6h20" />
    <path d="M4 9h16" />
    <path d="M7 6v14" />
    <path d="M17 6v14" />
  </svg>
);

const WonderBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-rice">
    {/* Base Pattern */}
    <div className="absolute inset-0 bg-pattern"></div>
    {/* Washi Texture Overlay - Global Application */}
    <div className="absolute inset-0 washi-texture opacity-40"></div>
    
    {/* Decorative Elements - Neo-Traditional */}
    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] border border-[#8d6e63]/10 rounded-full blur-xl" />
    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] border border-[#d4a373]/10 rounded-full blur-xl" />
    
    {/* Vertical Text Decoration */}
    <div className="absolute top-20 right-6 writing-vertical text-6xl font-black text-[#8d6e63]/5 tracking-[0.5em] hidden lg:block select-none">
      未来学習
    </div>
    <div className="absolute bottom-20 left-10 writing-vertical text-4xl font-bold text-[#d4a373]/5 tracking-[0.5em] hidden lg:block select-none">
      日本語
    </div>
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-collapse sidebar on mobile/tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    authService.signOut();
    onLogout();
    navigate('/login');
  };

  // Sidebar Item Component
  const NavItem = ({ to, icon: Icon, label, special }: { to: string; icon: any; label: string; special?: boolean }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 font-black text-sm uppercase tracking-widest group mb-1 ${
          isActive 
            ? 'bg-[#3e2723] text-rice shadow-xl shadow-[#3e2723]/20 scale-[1.02]' // Active: Dark Ink BG, White Text (Matches SS Home)
            : special 
              ? 'bg-[#fdfaf1] text-[#bc2f32] border-2 border-[#bc2f32] hover:bg-[#bc2f32] hover:text-white' 
              : 'text-[#3e2723]/60 hover:text-[#3e2723] hover:bg-[#3e2723]/5' // Inactive: Dark Ink Text
        }`
      }
    >
      <Icon size={20} className="shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen flex text-ink font-sans relative bg-rice">
      <WonderBackground />

      {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed left-0 top-0 bottom-0 bg-rice z-40 transition-all duration-300 flex flex-col
          ${isSidebarOpen ? 'w-[280px] p-6' : 'w-0 overflow-hidden lg:w-[280px] lg:p-6'}
        `}
      >
        {/* Brand / Logo Section (Matches SS) */}
        <div className="flex items-center gap-4 mb-12 px-2 mt-4">
          <div className="w-14 h-14 rounded-2xl bg-[#3e2723] flex items-center justify-center text-white shadow-xl shadow-[#3e2723]/30">
            <ToriiGate size={28} />
          </div>
          <div className="font-black text-3xl tracking-tighter text-[#3e2723] uppercase font-jp">
            QUIZEON
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
          {/* Main Modules mapped to SS Labels */}
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Home" />
          <NavItem to="/checklist" icon={Map} label="Roadmap" />
          <NavItem to="/learning" icon={BookOpen} label="Library" />
          <NavItem to="/sensei" icon={Mic} label="Speaking" />
          <NavItem to="/mistakes" icon={Bookmark} label="Bookmarks" />
          <NavItem to="/documents" icon={FolderOpen} label="Archives" />
          
          {/* Extra Features */}
          <div className="my-6 h-px bg-[#795548]/10 mx-4"></div>
          
          <NavItem to="/games" icon={Gamepad2} label="Arcade" />
          <NavItem to="/srs-status" icon={Brain} label="SRS Status" />
          
          <div className="mt-6">
             <NavItem to="/subscription" icon={Crown} label="Go Premium" special />
          </div>
        </nav>

        {/* User Profile Snippet */}
        <div className="mt-6 pt-6 border-t border-[#795548]/10">
            <div 
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#3e2723]/5 cursor-pointer transition-colors"
                onClick={() => navigate('/profile')}
            >
                <img src={user.avatar} alt="User" className="w-10 h-10 rounded-xl object-cover bg-white shadow-sm border border-[#3e2723]/10" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-[#3e2723] truncate">{user.username}</p>
                    <p className="text-[10px] text-[#795548] font-bold uppercase tracking-wider">Level {Math.floor((user.xp || 0)/1000) + 1}</p>
                </div>
                <button onClick={(e) => {e.stopPropagation(); handleLogout();}} className="text-[#795548] hover:text-[#bc2f32] p-2">
                    <LogOut size={18} />
                </button>
            </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className={`flex-1 transition-all duration-300 relative z-10 ${isSidebarOpen ? 'lg:ml-[280px]' : ''}`}>
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 sticky top-0 bg-rice/90 backdrop-blur-md z-30 border-b border-[#3e2723]/10">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3e2723] flex items-center justify-center text-white">
                <ToriiGate size={16} />
              </div>
              <div className="font-black text-xl text-[#3e2723] uppercase tracking-tight">QUIZEON</div>
           </div>
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-[#fdfaf1] rounded-lg text-[#3e2723]">
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>

        {/* Standardized Content Container */}
        <div className="px-6 py-8 md:px-10 md:py-12 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
