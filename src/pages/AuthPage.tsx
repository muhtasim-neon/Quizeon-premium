import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserType } from '../types';

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
    <path d="M2 7C2 7 5 5 12 5C19 5 22 7 22 7" />
    <path d="M4 11H20" />
    <path d="M7 7V21" />
    <path d="M17 7V21" />
    <path d="M12 7V11" />
    <path d="M6 21H8" />
    <path d="M16 21H18" />
  </svg>
);

export const AuthPage = ({ onLogin }: { onLogin: (user: UserType) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleGuest = () => {
    const defaultUser: UserType = {
      id: 'guest-' + Date.now(),
      username: 'Guest Student',
      role: 'student',
      subscription: 'free',
      xp: 0,
      streak: 0,
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Guest',
      joinedDate: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    onLogin(defaultUser);
    navigate('/dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const newUser: UserType = {
      id: 'user-' + Date.now(),
      username: username || 'Student',
      role: username.toLowerCase() === 'admin' ? 'admin' : 'student',
      subscription: 'free',
      xp: 0,
      streak: 1,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${username || 'Student'}`,
      joinedDate: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    onLogin(newUser);
    navigate(newUser.role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="washi-panel p-8 md:p-10 shadow-2xl">
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-washi-ink flex items-center justify-center text-washi-bg shadow-lg shadow-washi-ink/20 ring-4 ring-white/50 mb-6">
              <ToriiGate size={32} />
            </div>
            <h1 className="font-black text-3xl tracking-tighter text-washi-ink uppercase font-serif leading-none mb-2">Quizeon</h1>
            <p className="text-xs font-bold text-washi-ink/40 uppercase tracking-widest">
              {isLogin ? 'Welcome Back' : 'Start Your Journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-washi-ink/30" size={20} />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required={!isLogin}
                      className="w-full bg-white/40 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-washi-ink font-bold placeholder-washi-ink/20 focus:outline-none focus:ring-2 focus:ring-washi-hanko/50 focus:border-washi-hanko transition-all backdrop-blur-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-washi-ink/30" size={20} />
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-white/40 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-washi-ink font-bold placeholder-washi-ink/20 focus:outline-none focus:ring-2 focus:ring-washi-hanko/50 focus:border-washi-hanko transition-all backdrop-blur-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-washi-ink/30" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/40 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-washi-ink font-bold placeholder-washi-ink/20 focus:outline-none focus:ring-2 focus:ring-washi-hanko/50 focus:border-washi-hanko transition-all backdrop-blur-sm"
              />
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative mt-4">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-washi-ink/30" size={20} />
                    <input 
                      type="password" 
                      placeholder="Confirm Password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={!isLogin}
                      className="w-full bg-white/40 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-washi-ink font-bold placeholder-washi-ink/20 focus:outline-none focus:ring-2 focus:ring-washi-hanko/50 focus:border-washi-hanko transition-all backdrop-blur-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              className="w-full bg-washi-ink text-washi-bg rounded-xl py-4 font-black text-sm uppercase tracking-widest hover:bg-washi-ink/90 transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-washi-ink/20"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
            <button 
              onClick={handleGuest}
              className="w-full bg-washi-hanko/10 text-washi-hanko border border-washi-hanko/20 rounded-xl py-3.5 font-black text-sm uppercase tracking-widest hover:bg-washi-hanko hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              Use as a Guest
            </button>

            <div className="text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-bold text-washi-ink/40 hover:text-washi-hanko uppercase tracking-widest transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
