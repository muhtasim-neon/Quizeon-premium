
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Button, Input } from '../components/UI';
import { authService } from '../services/supabaseMock';
import { supabase } from '../services/supabaseClient';
import { User } from '../types';
import { Lock, Loader2, ArrowRight, Globe, CheckCircle, Mail, RefreshCw } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'password'>('email');
  
  // Login Fields
  const [loginInput, setLoginInput] = useState(''); // Email or Username

  // Signup Fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isForgot) {
        // --- FORGOT PASSWORD FLOW ---
        if (forgotStep === 'email') {
            // Step 1: Input Email -> Proceed directly to Password
            if (!email || !email.includes('@')) {
                setError('Please enter a valid email address.');
                setLoading(false);
                return;
            }
            
            // Bypass email sending logic. Just move to next step.
            setForgotStep('password');
            setSuccessMsg(''); 
            setPassword('');
            setConfirmPassword('');
        } else {
            // Step 2: Update Password
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                setLoading(false);
                return;
            }
            if (password.length < 6) {
                setError("Password must be at least 6 characters.");
                setLoading(false);
                return;
            }

            // Pass the email so we know which account to update (important for mock admin)
            const result = await authService.updateUserPassword(password, email);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccessMsg('Password updated successfully! Please log in with your new password.');
                // Return to login after brief delay
                setTimeout(() => {
                    setIsForgot(false);
                    setForgotStep('email');
                    setLoginInput(email);
                    setPassword('');
                    setSuccessMsg('');
                }, 2000);
            }
        }
      } else if (isSignUp) {
        // --- SIGNUP FLOW ---
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        // Lock auth listener in App.tsx to prevent auto-login flash
        sessionStorage.setItem('quizeon_signup_lock', 'true');

        try {
            const result = await authService.signUp(email, username, password);
            
            if (result.error) {
                setError(result.error);
            } else if (result.message) {
                // Successful signup!
                setSuccessMsg(result.message);
                // Switch to LOGIN mode automatically
                setIsSignUp(false);
                // Pre-fill login input for convenience
                setLoginInput(username);
                // Clear passwords
                setPassword('');
                setConfirmPassword('');
            } else if (result.user) {
                // This fallback handles cases where auto-login might still happen (though we disabled it in service)
                onLogin(result.user);
                navigate('/dashboard');
            }
        } finally {
            // Remove lock
            sessionStorage.removeItem('quizeon_signup_lock');
        }
      } else {
        // --- LOGIN FLOW ---
        const result = await authService.signIn(loginInput, password);
        const { user, error: authError } = result;
        
        if (authError || !user) {
          setError(authError || 'Authentication failed');
        } else {
          onLogin(user);
          navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setIsForgot(false);
    setForgotStep('email');
    setError('');
    setSuccessMsg('');
    // Reset inputs
    setLoginInput('');
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleForgotToggle = () => {
      setIsForgot(true);
      setForgotStep('email');
      setError('');
      setSuccessMsg('');
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
                     {isForgot ? 'Reset Password' : (isSignUp ? 'Begin Journey' : 'Welcome Back')}
                 </h2>
                 <p className="text-bamboo text-base">
                     {isForgot 
                        ? (forgotStep === 'email' ? 'Enter your email to continue.' : 'Create a new secure password.') 
                        : (isSignUp ? 'Create your profile to start learning.' : 'Enter your credentials to continue.')
                     }
                 </p>
             </div>

             <div className="space-y-6">
                {/* Success Message Banner */}
                {successMsg && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 animate-pop mb-4">
                        <CheckCircle size={24} className="text-green-600 mt-1 shrink-0" />
                        <div>
                            <h3 className="text-sm font-bold text-green-800">{isForgot && forgotStep === 'password' ? 'Verified' : 'Success!'}</h3>
                            <p className="text-sm text-green-700">{successMsg}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        
                        {isForgot ? (
                             <>
                                {forgotStep === 'email' ? (
                                    <Input 
                                        id="forgot-email"
                                        label="Email Address"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                ) : (
                                    <>
                                        <div className="p-3 bg-rice/50 rounded-lg text-sm text-bamboo mb-2 border border-bamboo/10 flex items-center gap-2">
                                            <Mail size={14} /> {email}
                                        </div>
                                        <Input 
                                            id="new-password"
                                            label="New Password"
                                            type="password"
                                            placeholder="Min. 6 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            autoFocus
                                        />
                                        <Input 
                                            id="confirm-new-password"
                                            label="Confirm New Password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            className={confirmPassword && password !== confirmPassword ? "border-hanko" : ""}
                                        />
                                    </>
                                )}
                             </>
                        ) : (
                            <>
                                {isSignUp ? (
                                    <>
                                        <Input 
                                            id="signup-email"
                                            label="Email Address"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <Input 
                                            id="signup-username"
                                            label="Username"
                                            placeholder="Choose a unique username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            minLength={3}
                                        />
                                    </>
                                ) : (
                                    <Input 
                                        id="login-input"
                                        label="Username or Email"
                                        placeholder="e.g. TanakaSan or user@mail.com"
                                        value={loginInput}
                                        onChange={(e) => setLoginInput(e.target.value)}
                                        required
                                    />
                                )}
                                
                                <div>
                                    <Input 
                                        id="password"
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                {isSignUp && (
                                    <div>
                                        <Input 
                                            id="confirm-password"
                                            label="Confirm Password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            className={confirmPassword && password !== confirmPassword ? "border-hanko" : ""}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {!isSignUp && !isForgot && (
                            <div className="text-right mt-2">
                                <button type="button" onClick={handleForgotToggle} className="text-xs text-hanko font-bold hover:underline opacity-80">Forgot password?</button>
                            </div>
                        )}
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
                            {isForgot 
                                ? (forgotStep === 'email' ? 'Next' : 'Update Password') 
                                : (isSignUp ? 'Create Account' : 'Enter Dojo')
                            } 
                            {!isForgot && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            {isForgot && forgotStep === 'password' && <RefreshCw size={18} />}
                        </span>
                        )}
                    </Button>
                </form>
             </div>

             <div className="text-center pt-6 border-t border-bamboo/10">
                <p className="text-bamboo text-sm">
                    {isForgot ? (
                        <button 
                            onClick={() => { setIsForgot(false); setForgotStep('email'); setError(''); setSuccessMsg(''); }}
                            type="button"
                            className="text-hanko font-bold hover:underline focus:outline-none tracking-wide uppercase text-xs"
                        >
                            Back to Login
                        </button>
                    ) : (
                        <>
                            {isSignUp ? 'Already a member?' : "New here?"}
                            <button 
                                onClick={toggleMode}
                                type="button"
                                className="ml-2 text-hanko font-bold hover:underline focus:outline-none tracking-wide uppercase text-xs"
                            >
                                {isSignUp ? 'Log In' : 'Sign Up'}
                            </button>
                        </>
                    )}
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
