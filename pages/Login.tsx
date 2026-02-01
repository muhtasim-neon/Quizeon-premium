import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Button, Input } from '../components/UI';
import { authService } from '../services/supabaseMock';
import { supabase } from '../services/supabaseClient';
import { User } from '../types';
import { Lock, Loader2, Chrome, ArrowRight, Globe, PenTool, User as UserIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await authService.signUp(username, password);
      } else {
        result = await authService.signIn(username, password);
      }
      
      const { user, error: authError } = result;
      
      if (authError || !user) {
        setError(authError || 'Authentication failed');
      } else {
        onLogin(user);
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
        setError("Supabase not configured. Check .env keys.");
        return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
    });
    if (error) {
        setError(error.message);
        setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex bg-rice text-ink font-jp relative overflow-hidden">
      
      {/* Background Aesthetics */}
      <div className="absolute inset-0 washi-texture opacity-80 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-bamboo/5 rounded-full blur-[120px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-hanko/5 rounded-full blur-[100px] pointer-events-none animate-float"></div>

      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-20 border-r border-bamboo/10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/japanese-asanoha-grey.png')] opacity-10"></div>
        <div className="relative z-10 max-w-xl">
             <div className="inline-flex items-center justify-center w-36 h-36 rounded-3xl bg-ink text-rice shadow-2xl shadow-ink/30 mb-12 animate-ink-bleed">
                 {/* Large Torii Gate SVG */}
                 <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6c0 0 5-4 10-4s10 4 10 4" />
                    <path d="M4 10h16" />
                    <path d="M7 6v14" />
                    <path d="M17 6v14" />
                 </svg>
             </div>
             
             <h1 className="text-7xl font-extrabold text-ink mb-8 font-sans tracking-tighter leading-tight animate-fade-in uppercase" style={{animationDelay: '0.1s'}}>
                 QUIZEON
             </h1>
             
             <p className="text-2xl text-bamboo/90 leading-relaxed mb-12 font-serif animate-fade-in border-l-4 border-hanko pl-6" style={{animationDelay: '0.2s'}}>
                 "Senri no michi mo ippo kara" <br/>
                 <span className="text-ink/60 text-base font-sans mt-2 block">A journey of a thousand miles begins with a single step.</span>
             </p>

             <div className="grid grid-cols-3 gap-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
                 {[
                    { val: 'N5', label: 'Mastery' },
                    { val: '2k+', label: 'Vocab' },
                    { val: '50+', label: 'Stories' }
                 ].map((stat, i) => (
                     <div key={i} className="p-6 bg-white/40 rounded-2xl border border-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                        <span className="block text-3xl font-serif font-bold text-ink mb-1">{stat.val}</span>
                        <span className="text-xs text-bamboo uppercase tracking-widest font-bold">{stat.label}</span>
                     </div>
                 ))}
             </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10 bg-white/30 backdrop-blur-[2px]">
        <GlassCard className="w-full max-w-md space-y-10 animate-fade-in shadow-2xl shadow-ink/5 bg-white/80 border-white/80 p-10">
             <div className="text-center">
                 <h2 className="text-4xl font-serif font-bold text-ink mb-3">
                     {isSignUp ? 'Begin Journey' : 'Welcome Back'}
                 </h2>
                 <p className="text-bamboo text-base">
                     {isSignUp ? 'Create your profile to start learning.' : 'Enter your credentials to continue.'}
                 </p>
             </div>

             <div className="space-y-6">
                <Button 
                    variant="secondary"
                    onClick={handleGoogleLogin}
                    className="w-full py-4 bg-white text-ink border-bamboo/20 hover:bg-rice/50 font-bold"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" /> : <><Chrome size={20} className="text-hanko" /> Continue with Google</>}
                </Button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-bamboo/10"></div>
                    <span className="flex-shrink mx-4 text-bamboo/60 text-xs uppercase font-bold tracking-widest bg-white/0 px-2">Or</span>
                    <div className="flex-grow border-t border-bamboo/10"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <Input 
                            id="username"
                            label="Username"
                            placeholder="e.g. TanakaSan"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={3}
                        />
                        
                        <div>
                            <Input 
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={4}
                            />
                            {!isSignUp && (
                                <div className="text-right mt-2">
                                    <a href="#" className="text-xs text-hanko font-bold hover:underline opacity-80">Forgot password?</a>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-hanko/20 rounded-xl flex items-start gap-3 animate-shake">
                            <Lock size={16} className="text-hanko mt-0.5 shrink-0" />
                            <p className="text-sm text-hanko font-medium">{error}</p>
                        </div>
                    )}

                    <Button type="submit" className="w-full py-4 text-base shadow-xl shadow-hanko/30 mt-4 group" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : (
                        <span className="flex items-center gap-2">
                            {isSignUp ? 'Join Dojo' : 'Enter Dojo'} 
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        )}
                    </Button>
                </form>
             </div>

             <div className="text-center pt-6 border-t border-bamboo/10">
                <p className="text-bamboo text-sm">
                    {isSignUp ? 'Already a member?' : "New here?"}
                    <button 
                        onClick={toggleMode}
                        className="ml-2 text-hanko font-bold hover:underline focus:outline-none tracking-wide uppercase text-xs"
                    >
                        {isSignUp ? 'Log In' : 'Sign Up'}
                    </button>
                </p>
             </div>
        </GlassCard>
        
        {/* Footer info for mobile */}
        <div className="absolute bottom-6 text-center lg:hidden w-full">
            <span className="text-xs text-bamboo/50 flex items-center justify-center gap-1 font-bold tracking-widest uppercase">
                <Globe size={12} /> English (US)
            </span>
        </div>
      </div>
    </div>
  );
};