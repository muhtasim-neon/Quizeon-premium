
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Button, Input } from '../components/UI';
import { authService } from '../services/supabaseMock';
import { User } from '../types';
import { Lock, Loader2, ArrowRight, Globe, CheckCircle, Mail, RefreshCw, Landmark } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'password'>('email');
  
  const [loginInput, setLoginInput] = useState(''); 
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
        if (forgotStep === 'email') {
            if (!email || !email.includes('@')) {
                setError('Please enter a valid email address.');
                setLoading(false);
                return;
            }
            setForgotStep('password');
            setSuccessMsg(''); 
            setPassword('');
            setConfirmPassword('');
        } else {
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
            const result = await authService.updateUserPassword(password, email);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccessMsg('Password updated successfully! Please log in with your new password.');
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
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }
        sessionStorage.setItem('quizeon_signup_lock', 'true');
        try {
            const result = await authService.signUp(email, username, password);
            if (result.error) {
                setError(result.error);
            } else if (result.message) {
                setSuccessMsg(result.message);
                setIsSignUp(false);
                setLoginInput(username);
                setPassword('');
                setConfirmPassword('');
            } else if (result.user) {
                onLogin(result.user);
                navigate('/dashboard');
            }
        } finally {
            sessionStorage.removeItem('quizeon_signup_lock');
        }
      } else {
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
    <div className="min-h-screen flex bg-washi text-ink font-sans relative overflow-hidden">
      
      {/* Background Aesthetics */}
      <div className="absolute inset-0 washi-grain opacity-60 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo/5 rounded-full blur-[120px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px] pointer-events-none animate-float" style={{animationDelay: '2s'}}></div>

      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-20 border-r border-white/30 bg-white/20 backdrop-blur-sm">
        <div className="relative z-10 max-w-xl text-center">
             <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-indigo text-washi shadow-2xl shadow-indigo/20 mb-10 animate-fade-in">
                 <Landmark size={64} />
             </div>
             
             <h1 className="text-7xl font-serif font-black text-ink mb-6 tracking-tighter leading-tight animate-fade-in uppercase" style={{animationDelay: '0.1s'}}>
                 QUIZEON
             </h1>
             
             <p className="text-xl text-ink/70 leading-relaxed mb-12 font-serif animate-fade-in border-l-4 border-vermilion pl-6 text-left mx-auto max-w-lg italic" style={{animationDelay: '0.2s'}}>
                 "The roots of education are bitter, but the fruit is sweet."
             </p>

             <div className="grid grid-cols-3 gap-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
                 {[
                    { val: 'N5', label: 'Mastery' },
                    { val: '2k+', label: 'Vocab' },
                    { val: 'AI', label: 'Sensei' }
                 ].map((stat, i) => (
                     <div key={i} className="p-6 bg-white/40 rounded-2xl border border-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                        <span className="block text-3xl font-serif font-bold text-indigo mb-1">{stat.val}</span>
                        <span className="text-[10px] text-ink/50 uppercase tracking-widest font-bold">{stat.label}</span>
                     </div>
                 ))}
             </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <GlassCard className="w-full max-w-md space-y-8 animate-fade-in shadow-[0_20px_60px_-15px_rgba(31,58,95,0.1)] bg-white/60 p-10 border-white/60">
             <div className="text-center">
                 <h2 className="text-3xl font-serif font-bold text-ink mb-2">
                     {isForgot ? 'Reset Password' : (isSignUp ? 'Start Journey' : 'Welcome Back')}
                 </h2>
                 <p className="text-ink/50 text-sm">
                     {isForgot 
                        ? (forgotStep === 'email' ? 'Enter your email to continue.' : 'Create a new secure password.') 
                        : (isSignUp ? 'Create your profile to start learning.' : 'Enter your credentials to continue.')
                     }
                 </p>
             </div>

             <div className="space-y-6">
                {/* Success Message Banner */}
                {successMsg && (
                    <div className="bg-matcha/10 border border-matcha/20 rounded-xl p-4 flex items-start gap-3 animate-pop">
                        <CheckCircle size={20} className="text-matcha mt-0.5 shrink-0" />
                        <div>
                            <h3 className="text-sm font-bold text-matcha">Success</h3>
                            <p className="text-xs text-matcha/80">{successMsg}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
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
                                        <div className="p-3 bg-rice/50 rounded-lg text-sm text-ink/60 mb-2 border border-linen flex items-center gap-2">
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
                                        placeholder="e.g. TanakaSan"
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
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {!isSignUp && !isForgot && (
                            <div className="text-right">
                                <button type="button" onClick={handleForgotToggle} className="text-xs text-vermilion font-bold hover:underline opacity-80">Forgot password?</button>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-4 bg-vermilion/5 border border-vermilion/20 rounded-xl flex items-start gap-3 animate-shake">
                            <Lock size={16} className="text-vermilion mt-0.5 shrink-0" />
                            <p className="text-sm text-vermilion font-medium">{error}</p>
                        </div>
                    )}

                    <Button type="submit" className="w-full py-3.5 text-sm shadow-lg shadow-indigo/20 mt-2 group" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : (
                        <span className="flex items-center gap-2">
                            {isForgot 
                                ? (forgotStep === 'email' ? 'Next Step' : 'Update Password') 
                                : (isSignUp ? 'Create Account' : 'Enter Dojo')
                            } 
                            {!isForgot && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            {isForgot && forgotStep === 'password' && <RefreshCw size={16} />}
                        </span>
                        )}
                    </Button>
                </form>
             </div>

             <div className="text-center pt-6 border-t border-linen">
                <p className="text-ink/50 text-sm">
                    {isForgot ? (
                        <button 
                            onClick={() => { setIsForgot(false); setForgotStep('email'); setError(''); setSuccessMsg(''); }}
                            type="button"
                            className="text-indigo font-bold hover:underline focus:outline-none tracking-wide text-xs uppercase"
                        >
                            Back to Login
                        </button>
                    ) : (
                        <>
                            {isSignUp ? 'Already a member?' : "New here?"}
                            <button 
                                onClick={toggleMode}
                                type="button"
                                className="ml-2 text-indigo font-bold hover:underline focus:outline-none tracking-wide text-xs uppercase"
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
            <span className="text-[10px] text-ink/30 flex items-center justify-center gap-1 font-bold tracking-widest uppercase">
                <Globe size={10} /> English (US)
            </span>
        </div>
      </div>
    </div>
  );
};
