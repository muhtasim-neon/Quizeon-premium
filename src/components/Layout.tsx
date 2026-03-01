
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Map, BookOpen, Mic, Bookmark, FolderOpen, 
  Gamepad2, Crown, Menu, X, Brain, ChevronRight, Plus, Bell,
  UserPlus, AlertTriangle
} from 'lucide-react';
import { User } from '@/types';
import { AnimatePresence, motion, useScroll, useSpring as useSpringMotion } from 'framer-motion';
import { Button, cn } from '@/components/UI';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
}

// Custom Torii Gate Icon - Enhanced Neo-Traditional Version
const ToriiGate = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="toriiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bc2f32" />
        <stop offset="100%" stopColor="#8d2426" />
      </linearGradient>
    </defs>
    {/* Top curved lintel (Kasagi/Shimaki) */}
    <path 
      d="M2 7.5C2 7.5 5 5 12 5C19 5 22 7.5 22 7.5" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
    {/* Lower straight lintel (Nuki) */}
    <path 
      d="M4 11.5H20" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
    {/* Pillars (Hashira) */}
    <path 
      d="M8 7.5V21" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
    <path 
      d="M16 7.5V21" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
    {/* Center vertical strut (Gakuzuka) */}
    <path 
      d="M12 7.5V11.5" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
    />
    {/* Base stones (Kamebara) */}
    <path d="M7 21H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 21H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

// Custom Hanko Stamp Component
const HankoStamp = ({ text = "学習", className = "" }) => (
  <div className={`relative inline-flex items-center justify-center p-1 border-2 border-hanko rounded-sm rotate-[-8deg] opacity-80 ${className}`}>
    <div className="absolute inset-0 bg-hanko/5"></div>
    <span className="text-[10px] font-black text-hanko font-jp leading-none tracking-tighter select-none">{text}</span>
    {/* Texture overlay for stamp feel */}
    <div className="absolute inset-0 washi-texture opacity-40 mix-blend-multiply"></div>
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
        `relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-500 font-bold text-sm group mb-1.5 overflow-hidden
        ${isActive 
            ? 'bg-ink text-rice shadow-xl shadow-ink/20 translate-x-2' 
            : special 
              ? 'bg-gradient-to-r from-hanko/10 to-hanko/5 text-hanko border border-hanko/20 hover:border-hanko/40 hover:shadow-lg' 
              : 'text-bamboo hover:bg-white/80 hover:text-ink hover:translate-x-1' 
        }`
      }
    >
      {({ isActive }) => (
        <>
            {isActive && (
              <motion.div 
                layoutId="activeNav"
                className="absolute left-0 top-0 bottom-0 w-1.5 bg-hanko z-20"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div className={`relative z-10 transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
              <Icon size={20} className={`${isActive ? 'text-hanko' : 'text-current opacity-70 group-hover:opacity-100'}`} />
              {isActive && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.2 }}
                  className="absolute inset-0 bg-hanko rounded-full blur-md"
                />
              )}
            </div>
            <span className={`z-10 tracking-wide transition-all duration-300 ${isActive ? 'font-black' : 'font-bold opacity-80 group-hover:opacity-100'}`}>{label}</span>
            {special && (
              <div className="ml-auto flex items-center gap-1">
                <Crown size={14} className="text-hanko animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-hanko animate-ping" />
              </div>
            )}
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
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
        {/* Guest Mode Banner */}
        {user.isGuest && (
          <div className="absolute top-0 left-0 right-0 z-50 bg-hanko text-rice py-1 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2">
            <AlertTriangle size={10} />
            Guest Mode: Progress Not Saved
          </div>
        )}
        {/* Sidebar Background Layer - distinct paper feel */}
        <div className="absolute inset-4 bg-white/40 backdrop-blur-2xl rounded-[40px] border border-white/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] z-0 overflow-hidden hidden lg:block">
            <div className="absolute inset-0 washi-texture opacity-30"></div>
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
            {/* Decorative Circle */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-hanko/5 rounded-full blur-3xl"></div>
            {/* Ink Splash Decoration */}
            <div className="absolute top-1/2 -right-10 w-40 h-40 bg-ink/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/4 -left-10 w-20 h-20 bg-gold/5 rounded-full blur-2xl"></div>
        </div>
        {/* Mobile Sidebar BG */}
        <div className="absolute inset-0 bg-rice/95 backdrop-blur-xl z-0 lg:hidden border-r border-bamboo/10"></div>

        {/* Sidebar Content */}
        <div className="relative z-10 flex flex-col h-full p-6 lg:p-10">
            {/* Brand */}
            <div className="flex items-center gap-4 mb-10 pl-1 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-ink flex items-center justify-center text-rice shadow-2xl shadow-ink/30 ring-4 ring-white/80 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-hanko/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <ToriiGate size={28} className="relative z-10" />
                </motion.div>
                <div>
                    <h1 className="font-black text-2xl lg:text-3xl tracking-tighter text-ink uppercase font-jp leading-none mb-1">
                      Quiz<span className="text-hanko">eon</span>
                    </h1>
                    <div className="flex items-center gap-2">
                      <div className="h-[1px] w-4 bg-hanko/40"></div>
                      <span className="text-[10px] font-black text-bamboo uppercase tracking-[0.2em]">Dojo Learning</span>
                    </div>
                </div>
                <HankoStamp className="ml-auto hidden xl:flex" />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2 lg:-mr-2 pt-4">
                
                <div className="mb-6">
                    <p className="px-4 text-[10px] font-black text-bamboo/40 uppercase tracking-[0.2em] mb-2">Main</p>
                    <NavItem to="/dashboard" icon={LayoutDashboard} label="Home" />
                    {!user.isGuest && <NavItem to="/checklist" icon={Map} label="Roadmap" />}
                    <NavItem to="/learning" icon={BookOpen} label="Library" />
                </div>

                {user.role === 'admin' && !user.isGuest && (
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
                    {!user.isGuest && <NavItem to="/srs-status" icon={Brain} label="SRS Stats" />}
                </div>

                {!user.isGuest && (
                  <div className="mb-6">
                      <p className="px-4 text-[10px] font-black text-bamboo/40 uppercase tracking-[0.2em] mb-2">Personal</p>
                      <NavItem to="/mistakes" icon={Bookmark} label="Mistakes" />
                      <NavItem to="/documents" icon={FolderOpen} label="Archives" />
                  </div>
                )}

                {user.isGuest && (
                  <div className="mb-6 px-4">
                    <Button 
                      onClick={() => {
                        localStorage.removeItem('quizeon_user');
                        window.location.href = '/#/login';
                        window.location.reload();
                      }}
                      className="w-full py-3 bg-hanko text-rice text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl"
                    >
                      <UserPlus size={14} />
                      Sign Up Now
                    </Button>
                  </div>
                )}

                {!user.isGuest && (
                  <div className="mt-4">
                      <NavItem to="/subscription" icon={Crown} label="Premium" special />
                  </div>
                )}
            </nav>

            {/* User Profile - Bottom Card */}
            <div className="mt-6 pt-6 border-t border-bamboo/10">
                <motion.div 
                    whileHover={{ y: -4 }}
                    className="flex items-center gap-4 p-4 rounded-[24px] bg-white/60 backdrop-blur-md border border-white shadow-sm hover:shadow-xl hover:bg-white transition-all cursor-pointer group relative overflow-hidden"
                    onClick={() => navigate('/profile')}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-hanko/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-white shadow-md">
                          <img src={user.avatar} alt="User" className="w-full h-full object-cover bg-rice" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0 relative z-10">
                        <p className="text-sm font-black text-ink truncate group-hover:text-hanko transition-colors tracking-tight">{user.username}</p>
                        <div className="flex items-center gap-1.5">
                          <div className="px-1.5 py-0.5 bg-hanko/10 rounded-md">
                            <span className="text-[9px] text-hanko font-black uppercase tracking-tighter">LVL {Math.floor((user.xp || 0)/1000) + 1}</span>
                          </div>
                          <div className="w-1 h-1 rounded-full bg-bamboo/30"></div>
                          <span className="text-[9px] text-bamboo font-bold uppercase tracking-wider">Sensei</span>
                        </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all text-hanko relative z-10">
                        <ChevronRight size={18} />
                    </div>
                </motion.div>
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
