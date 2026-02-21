
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Map, BookOpen, Mic, Bookmark, FolderOpen, 
  Gamepad2, Crown, Menu, X, Brain, ChevronRight
} from 'lucide-react';
import { User } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
}

// Custom Torii Gate Icon - Enhanced Version
const ToriiGate = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Top curved lintel (Kasagi/Shimaki) */}
    <path d="M2 7C2 7 5 5 12 5C19 5 22 7 22 7" />
    {/* Lower straight lintel (Nuki) */}
    <path d="M4 11H20" />
    {/* Pillars (Hashira) - slight inward tilt for aesthetics */}
    <path d="M7 7V21" />
    <path d="M17 7V21" />
    {/* Center vertical strut (Gakuzuka) */}
    <path d="M12 7V11" />
    {/* Base stones (Kamebara) */}
    <path d="M6 21H8" />
    <path d="M16 21H18" />
  </svg>
);

const WonderBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-rice">
    {/* Base Pattern */}
    <div className="absolute inset-0 bg-pattern opacity-60"></div>
    {/* Washi Texture Overlay - Global Application */}
    <div className="absolute inset-0 washi-texture opacity-50"></div>
    
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

export const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-collapse sidebar on mobile/tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const NavItem = ({ to, icon: Icon, label, special }: { to: string; icon: any; label: string; special?: boolean }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm group mb-1 overflow-hidden
        ${isActive 
            ? 'bg-ink text-rice shadow-xl shadow-ink/20 translate-x-1 lg:translate-x-2' 
            : special 
              ? 'bg-hanko/5 text-hanko border border-hanko/10 hover:border-hanko/30 hover:bg-hanko/10' 
              : 'text-bamboo hover:bg-white/40 hover:text-ink hover:translate-x-1' 
        }`
      }
    >
      {({ isActive }) => (
        <>
            {isActive && <motion.div layoutId="activeNav" className="absolute left-0 top-0 bottom-0 w-1.5 bg-hanko" />}
            <Icon size={18} className={`shrink-0 z-10 transition-transform duration-300 ${isActive ? 'text-hanko' : ''} ${special ? 'group-hover:rotate-12' : 'group-hover:scale-110'}`} />
            <span className={`z-10 tracking-wide ${isActive ? 'font-black' : ''}`}>{label}</span>
            {special && <Crown size={14} className="ml-auto text-hanko animate-pulse" />}
        </>
      )}
    </NavLink>
  );

  const BottomNavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300
        ${isActive ? 'text-hanko' : 'text-bamboo opacity-60'}`
      }
    >
      <Icon size={20} className="mb-1" />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row text-ink font-sans relative bg-rice overflow-x-hidden">
      <WonderBackground />

      {/* --- MOBILE TOP HEADER --- */}
      <header className="lg:hidden flex items-center justify-between p-4 sticky top-0 bg-white/60 backdrop-blur-xl z-50 border-b border-bamboo/10">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-rice shadow-lg shadow-ink/20">
              <ToriiGate size={16} />
            </div>
            <div className="font-black text-lg text-ink uppercase tracking-tighter font-jp">QUIZEON</div>
         </div>
         <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/profile')}
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden"
            >
              <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-2 bg-white/40 rounded-xl text-ink border border-white/50"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
         </div>
      </header>

      {/* --- MOBILE DRAWER MENU --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-rice z-[70] lg:hidden shadow-2xl flex flex-col p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-black text-xl uppercase tracking-widest text-ink">Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full bg-white/50">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 space-y-2 overflow-y-auto">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Home" />
                <NavItem to="/checklist" icon={Map} label="Roadmap" />
                <NavItem to="/learning" icon={BookOpen} label="Library" />
                <NavItem to="/sensei" icon={Mic} label="Speaking" />
                <NavItem to="/games" icon={Gamepad2} label="Arcade" />
                <NavItem to="/srs-status" icon={Brain} label="SRS Stats" />
                <NavItem to="/mistakes" icon={Bookmark} label="Mistakes" />
                <NavItem to="/documents" icon={FolderOpen} label="Archives" />
                <NavItem to="/subscription" icon={Crown} label="Premium" special />
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside 
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 z-40 transition-all duration-500 flex-col
          ${isSidebarOpen ? 'w-[280px]' : 'w-[88px]'}
        `}
      >
        <div className="absolute inset-4 bg-white/40 backdrop-blur-2xl rounded-[40px] border border-white/40 shadow-2xl shadow-ink/5 z-0 overflow-hidden">
            <div className="absolute inset-0 washi-texture opacity-30"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full p-8">
            {/* Brand */}
            <div className={`flex items-center gap-4 mb-10 transition-all duration-500 ${!isSidebarOpen ? 'justify-center' : ''}`}>
                <div 
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ink to-[#5d4037] flex items-center justify-center text-rice shadow-xl shadow-ink/20 ring-4 ring-white/50 cursor-pointer shrink-0"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <ToriiGate size={24} />
                </div>
                {isSidebarOpen && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      <h1 className="font-black text-2xl tracking-tighter text-ink uppercase font-jp leading-none">Quizeon</h1>
                      <span className="text-[10px] font-bold text-bamboo uppercase tracking-widest">Learn Japanese</span>
                  </motion.div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
                <div className="mb-8">
                    {isSidebarOpen && <p className="px-4 text-[10px] font-black text-bamboo/40 uppercase tracking-[0.2em] mb-3">Main</p>}
                    <NavItem to="/dashboard" icon={LayoutDashboard} label={isSidebarOpen ? "Home" : ""} />
                    <NavItem to="/checklist" icon={Map} label={isSidebarOpen ? "Roadmap" : ""} />
                    <NavItem to="/learning" icon={BookOpen} label={isSidebarOpen ? "Library" : ""} />
                </div>

                <div className="mb-8">
                    {isSidebarOpen && <p className="px-4 text-[10px] font-black text-bamboo/40 uppercase tracking-[0.2em] mb-3">Practice</p>}
                    <NavItem to="/sensei" icon={Mic} label={isSidebarOpen ? "Speaking" : ""} />
                    <NavItem to="/games" icon={Gamepad2} label={isSidebarOpen ? "Arcade" : ""} />
                    <NavItem to="/srs-status" icon={Brain} label={isSidebarOpen ? "SRS Stats" : ""} />
                </div>

                <div className="mb-8">
                    {isSidebarOpen && <p className="px-4 text-[10px] font-black text-bamboo/40 uppercase tracking-[0.2em] mb-3">Personal</p>}
                    <NavItem to="/mistakes" icon={Bookmark} label={isSidebarOpen ? "Mistakes" : ""} />
                    <NavItem to="/documents" icon={FolderOpen} label={isSidebarOpen ? "Archives" : ""} />
                </div>

                <div className="mt-auto">
                    <NavItem to="/subscription" icon={Crown} label={isSidebarOpen ? "Premium" : ""} special />
                </div>
            </nav>

            {/* User Profile */}
            <div className={`mt-6 pt-6 border-t border-bamboo/10 ${!isSidebarOpen ? 'flex justify-center' : ''}`}>
                <div 
                    className={`flex items-center gap-3 p-3 rounded-3xl bg-white/40 border border-white/50 hover:bg-white/80 hover:shadow-xl transition-all cursor-pointer group overflow-hidden
                      ${!isSidebarOpen ? 'w-12 h-12 p-0 justify-center' : ''}
                    `}
                    onClick={() => navigate('/profile')}
                >
                    <div className="relative shrink-0">
                        <img src={user.avatar} alt="User" className="w-10 h-10 rounded-2xl object-cover bg-rice shadow-sm ring-2 ring-white" />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    {isSidebarOpen && (
                      <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-ink truncate group-hover:text-hanko transition-colors">{user.username}</p>
                          <p className="text-[10px] text-bamboo font-bold uppercase tracking-wider">Level {Math.floor((user.xp || 0)/1000) + 1}</p>
                      </div>
                    )}
                </div>
            </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className={`flex-1 transition-all duration-500 relative z-10 
        ${isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[88px]'}
        pb-20 lg:pb-0
      `}>
        
        {/* Desktop Topbar */}
        <div className="hidden lg:flex items-center justify-between px-10 py-6 sticky top-0 bg-rice/40 backdrop-blur-md z-30 border-b border-bamboo/5">
           <div className="flex items-center gap-4">
              <div className="text-xs font-black text-bamboo uppercase tracking-[0.3em]">JLPT N5 Mastery</div>
              <div className="h-4 w-px bg-bamboo/20"></div>
              <div className="text-xs font-bold text-hanko uppercase tracking-widest animate-pulse">Live Session Active</div>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-rice shadow-sm overflow-hidden">
                    <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=User${i}`} alt="User" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-ink text-rice flex items-center justify-center text-[10px] font-black">+12</div>
              </div>
              <button className="bg-ink text-rice px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-hanko transition-colors shadow-lg shadow-ink/20">
                Join Dojo
              </button>
           </div>
        </div>

        {/* Content Container - Responsive Padding & Max Width */}
        <div className="px-4 py-8 md:px-10 md:py-12 lg:px-12 lg:py-16 max-w-screen-2xl mx-auto min-h-[calc(100vh-80px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* --- MOBILE STICKY BOTTOM NAV --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-bamboo/10 z-[100] flex items-center justify-around px-2 pb-safe-area-inset-bottom">
        <BottomNavItem to="/dashboard" icon={LayoutDashboard} label="Home" />
        <BottomNavItem to="/checklist" icon={Map} label="Roadmap" />
        <BottomNavItem to="/learning" icon={BookOpen} label="Library" />
        <BottomNavItem to="/sensei" icon={Mic} label="Speaking" />
        <BottomNavItem to="/profile" icon={Crown} label="Profile" />
      </nav>
    </div>
  );
};
