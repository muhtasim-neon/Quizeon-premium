import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Button, Input } from '../components/UI';
import { authService } from '../services/supabaseMock';
import { supabase } from '../services/supabaseClient';
import { User } from '../types';
import { Lock, Loader2, UserPlus, LogIn, Sparkles, Chrome, ArrowRight, Globe } from 'lucide-react';

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
      // Fallback to Mock Auth for Demo/Admin
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
    <div className="min-h-screen flex bg-slate-50 dark:bg-dark-bg transition-colors duration-500">
      
      {/* Left Panel - Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center p-12">
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-lg">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-blue-600 shadow-2xl shadow-primary/40 mb-8 animate-slide-up">
                 <span className="text-4xl font-serif font-bold text-white">Q</span>
             </div>
             <h1 className="text-5xl font-bold text-white mb-6 font-jp tracking-tight animate-slide-up" style={{animationDelay: '0.1s'}}>
                 Learn Japanese<br/>The Modern Way
             </h1>
             <p className="text-xl text-slate-300 leading-relaxed mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                 "A journey of a thousand miles begins with a single step." <br/>
                 <span className="text-primary font-serif italic">Senri no michi mo ippo kara</span>
             </p>
             <div className="flex gap-4 justify-center animate-slide-up" style={{animationDelay: '0.3s'}}>
                 <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/10 backdrop-blur-md">
                    <span className="block text-2xl font-bold text-white">N5</span>
                    <span className="text-xs text-slate-400 uppercase">Level</span>
                 </div>
                 <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/10 backdrop-blur-md">
                    <span className="block text-2xl font-bold text-white">2k+</span>
                    <span className="text-xs text-slate-400 uppercase">Words</span>
                 </div>
                 <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/10 backdrop-blur-md">
                    <span className="block text-2xl font-bold text-white">AI</span>
                    <span className="text-xs text-slate-400 uppercase">Tutor</span>
                 </div>
             </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
             <div className="text-center lg:text-left">
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                     {isSignUp ? 'Create an account' : 'Welcome back'}
                 </h2>
                 <p className="text-slate-500 dark:text-slate-400">
                     {isSignUp ? 'Start your learning adventure today.' : 'Please enter your details to sign in.'}
                 </p>
             </div>

             <div className="space-y-4">
                <Button 
                    variant="secondary"
                    onClick={handleGoogleLogin}
                    className="w-full py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" /> : <><Chrome size={20} className="text-red-500" /> Sign in with Google</>}
                </Button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase font-bold tracking-wider">Or continue with</span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input 
                        id="username"
                        label="Username"
                        placeholder="e.g. TanakaSan"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={3}
                        className="bg-slate-50 dark:bg-slate-800/50"
                    />
                    
                    <div className="space-y-1">
                        <Input 
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={4}
                            className="bg-slate-50 dark:bg-slate-800/50"
                        />
                        {!isSignUp && (
                            <div className="text-right">
                                <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</a>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3">
                            <div className="p-1 bg-red-100 dark:bg-red-500/20 rounded-full text-red-600 dark:text-red-400">
                                <Lock size={14} />
                            </div>
                            <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">{error}</p>
                        </div>
                    )}

                    <Button type="submit" className="w-full py-4 text-base shadow-lg shadow-primary/25" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : (
                        <span className="flex items-center gap-2">
                            {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
                        </span>
                        )}
                    </Button>
                </form>
             </div>

             <div className="text-center pt-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button 
                        onClick={toggleMode}
                        className="ml-2 text-primary font-bold hover:underline focus:outline-none"
                    >
                        {isSignUp ? 'Log in' : 'Sign up for free'}
                    </button>
                </p>
             </div>
        </div>
        
        {/* Footer info for mobile */}
        <div className="absolute bottom-6 text-center lg:hidden w-full">
            <span className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Globe size={12} /> English (US)
            </span>
        </div>
      </div>
    </div>
  );
};