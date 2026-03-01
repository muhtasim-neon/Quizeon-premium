
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Map, BookOpen, Mic, Bookmark, FolderOpen, 
  Gamepad2, Crown, Menu, X, Brain, ChevronRight, Plus, Bell
} from 'lucide-react';
import { User } from '@/types';
import { AnimatePresence, motion, useScroll, useSpring as useSpringMotion } from 'framer-motion';
import { Button, cn } from '@/components/UI';

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
    
    {/* Floating Particles */}
    <div className="absolute inset-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-hanko/10 rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: 0 
          }}
          animate={{ 
            y: [null, "-100px"],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 5 + Math.random() * 10, 
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
        />
      ))}
    </div>

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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpringMotion(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Cursor Glow Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      document.documentElement.style.setProperty('--x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  // Enhanced Sidebar Item Component
  const NavItem = ({ to, icon: Icon, label, special }: { to: string; icon: any; label: string; special?: boolean }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm group mb-1 overflow-hidden
        ${isActive 
            ? 'bg-ink text-rice shadow-lg shadow-ink/20 translate-x-2' // Active: Shifted, Dark
            : special 
              ? 'bg-gradient-to-r from-hanko/5 to-hanko/10 text-hanko border border-hanko/20 hover:border-hanko hover:shadow-md' 
              : 'text-bamboo hover:bg-white/60 hover:text-ink hover:translate-x-1' 
        }`
      }
    >
      {({ isActive }) => (
        <>
            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-hanko animate-fade-in" />}
            <Icon size={18} className={`shrink-0 z-10 transition-transform duration-300 ${isActive ? 'text-hanko' : ''} ${special ? 'group-hover:rotate-12' : 'group-hover:scale-110'}`} />
            <span className={`z-10 tracking-wide ${isActive ? 'font-black' : ''}`}>{label}</span>
            {special && <Crown size={14} className="ml-auto text-hanko animate-pulse" />}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="min-h-screen flex text-ink font-sans relative bg-rice">
      <div className="washi-overlay" />
      <WonderBackground />
      <div className="cursor-glow" />
      
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-hanko z-50 origin-left" style={{ scaleX }} />

      {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 flex flex-col
          ${isSidebarOpen ? 'w-[280px]' : 'w-0 overflow-hidden lg:w-[280px]'}
        `}
      >
        {/* Sidebar Background Layer - distinct paper feel */}
        <div className="absolute inset-4 bg-white/60 backdrop-blur-xl rounded-[32px] border-2 border-white/50 shadow-2xl shadow-ink/5 z-0 overflow-hidden hidden lg:block">
            <div className="absolute inset-0 washi-texture opacity-50"></div>
        </div>
        {/* Mobile Sidebar BG */}
        <div className="absolute inset-0 bg-rice/95 backdrop-blur-xl z-0 lg:hidden border-r border-bamboo/10"></div>

        {/* Sidebar Content */}
        <div className="relative z-10 flex flex-col h-full p-6 lg:p-8">
            {/* Brand */}
            <div className="flex items-center gap-4 mb-8 pl-1">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-ink to-[#5d4037] flex items-center justify-center text-rice shadow-lg shadow-ink/20 ring-4 ring-white">
                    <ToriiGate size={24} />
                </div>
                <div>
                    <h1 className="font-black text-2xl tracking-tighter text-ink uppercase font-jp leading-none">Quizeon</h1>
                    <span className="text-[10px] font-bold text-bamboo uppercase tracking-widest">Learn Japanese</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2 lg:-mr-2">
                
                <div className="mb-6">
                    <p className="px-4 text-[10px] font-black text-bamboo/40 uppercase tracking-[0.2em] mb-2">Main</p>
                    <NavItem to="/dashboard" icon={LayoutDashboard} label="Home" />
                    <NavItem to="/checklist" icon={Map} label="Roadmap" />
                    <NavItem to="/learning" icon={BookOpen} label="Library" />
                </div>

                {user.role === 'admin' && (
                    <div className="mb-6">
                        <p className="px-4 text-[10px] font-black text-hanko/60 uppercase tracking-[0.2em] mb-2">Admin</p>
                        <NavItem to="/admin" icon={LayoutDashboard} label="Admin Panel" />
                        <NavItem to="/admin/users" icon={Plus} label="User Control" />
                        <NavItem to="/admin/content" icon={FolderOpen} label="Content Bank" />
                    </div>
                )}

                <div className="mb-6">
                    <p className="px-4 text-[10px] font-black text-bamboo/40 uppercase tracking-[0.2em] mb-2">Practice</p>
                    <NavItem to="/sensei" icon={Mic} label="Speaking" />
                    <NavItem to="/games" icon={Gamepad2} label="Arcade" />
                    <NavItem to="/srs-status" icon={Brain} label="SRS Stats" />
                </div>

                <div>
                    <p className="px-4 text-[10px] font-black text-bamboo/40 uppercase tracking-[0.2em] mb-2">Personal</p>
                    <NavItem to="/mistakes" icon={Bookmark} label="Mistakes" />
                    <NavItem to="/documents" icon={FolderOpen} label="Archives" />
                </div>

                <div className="mt-4">
                    <NavItem to="/subscription" icon={Crown} label="Premium" special />
                </div>
            </nav>

            {/* User Profile - Bottom Card */}
            <div className="mt-4 pt-4 border-t border-bamboo/10">
                <div 
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 border border-white hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => navigate('/profile')}
                >
                    <div className="relative">
                        <img src={user.avatar} alt="User" className="w-10 h-10 rounded-xl object-cover bg-rice shadow-sm ring-2 ring-white" />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-ink truncate group-hover:text-hanko transition-colors">{user.username}</p>
                        <p className="text-[10px] text-bamboo font-bold uppercase tracking-wider">Level {Math.floor((user.xp || 0)/1000) + 1}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-bamboo">
                        <ChevronRight size={16} />
                    </div>
                </div>
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
           <div className="flex items-center gap-2">
              <button className="p-2 text-ink/60 hover:text-hanko transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-hanko rounded-full border-2 border-rice"></span>
              </button>
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="p-2 bg-[#fdfaf1] rounded-lg text-[#3e2723] relative w-10 h-10 flex items-center justify-center overflow-hidden"
              >
                 <motion.div
                   animate={isSidebarOpen ? "open" : "closed"}
                   className="flex flex-col gap-1.5 items-center justify-center"
                 >
                   <motion.span 
                     variants={{
                       closed: { rotate: 0, y: 0 },
                       open: { rotate: 45, y: 6 }
                     }}
                     className="w-6 h-0.5 bg-ink block" 
                   />
                   <motion.span 
                     variants={{
                       closed: { opacity: 1 },
                       open: { opacity: 0 }
                     }}
                     className="w-6 h-0.5 bg-ink block" 
                   />
                   <motion.span 
                     variants={{
                       closed: { rotate: 0, y: 0 },
                       open: { rotate: -45, y: -6 }
                     }}
                     className="w-6 h-0.5 bg-ink block" 
                   />
                 </motion.div>
              </button>
           </div>
        </div>

        {/* Standardized Content Container */}
        <div className="px-6 py-8 md:px-10 md:py-12 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] pb-24 lg:pb-12">
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

        {/* Floating Action Button */}
        <div className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-40">
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/learning')}
                className="w-14 h-14 bg-hanko text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white ring-4 ring-hanko/20"
            >
                <Plus size={28} />
            </motion.button>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-6 left-6 right-6 h-16 glass-effect rounded-2xl z-40 flex items-center justify-around px-2">
            <NavLink to="/dashboard" className={({isActive}) => cn("p-3 rounded-xl transition-all", isActive ? "bg-hanko text-white" : "text-bamboo")}>
                <LayoutDashboard size={20} />
            </NavLink>
            <NavLink to="/learning" className={({isActive}) => cn("p-3 rounded-xl transition-all", isActive ? "bg-hanko text-white" : "text-bamboo")}>
                <BookOpen size={20} />
            </NavLink>
            <NavLink to="/sensei" className={({isActive}) => cn("p-3 rounded-xl transition-all", isActive ? "bg-hanko text-white" : "text-bamboo")}>
                <Mic size={20} />
            </NavLink>
            <NavLink to="/profile" className={({isActive}) => cn("p-3 rounded-xl transition-all", isActive ? "bg-hanko text-white" : "text-bamboo")}>
                <img src={user.avatar} className="w-5 h-5 rounded-full" alt="User" />
            </NavLink>
        </div>
      </main>
    </div>
  );
};
