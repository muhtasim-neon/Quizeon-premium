
import React, { useState } from 'react';
import { auth, db } from '@/services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { GlassCard, Button, Input, Badge, Modal, cn } from '@/components/UI';
import { LogIn, UserPlus, Globe, Mail, Lock, Loader2, CheckCircle, AlertCircle, Info, RefreshCw, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/types';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  React.useEffect(() => {
    if (lockoutTime) {
      const timer = setInterval(() => {
        if (Date.now() >= lockoutTime) {
          setLockoutTime(null);
          setAttempts(0);
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
      setError(`Too many failed attempts. Please wait ${remaining} seconds before trying again.`);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    setIsAlreadyRegistered(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address format (e.g., name@example.com).");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const userData: User = {
          id: user.uid,
          username: username || email.split('@')[0],
          email: email,
          role: 'student',
          subscription: 'free',
          xp: 0,
          streak: 0,
          avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${username || email}`,
          joinedDate: new Date().toISOString(),
          lastActive: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', user.uid), userData);
      }
    } catch (err: any) {
      console.error("Auth Error:", err.code, err.message);
      
      if (isLogin) {
        setAttempts(prev => {
          const newAttempts = prev + 1;
          if (newAttempts >= 5) {
            setLockoutTime(Date.now() + 60000); // 1 minute lockout
            setError("Too many failed attempts. Your account is temporarily locked for 60 seconds.");
          }
          return newAttempts;
        });
      }

      switch (err.code) {
        case 'auth/email-already-in-use':
          setError("This email is already part of our Dojo. Would you like to log in instead?");
          setIsAlreadyRegistered(true);
          break;
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError("The credentials provided don't match our records. Please double-check your email and password.");
          break;
        case 'auth/weak-password':
          setError("Your password is too simple for a Sensei. Please use at least 6 characters.");
          break;
        case 'auth/invalid-email':
          setError("That doesn't look like a valid email address. Please check for typos.");
          break;
        case 'auth/too-many-requests':
          setError("Too many failed attempts. For your security, please try again in a few minutes or reset your password.");
          break;
        case 'auth/network-request-failed':
          setError("Connection lost. Please check your internet and try again.");
          break;
        case 'auth/popup-closed-by-user':
          setError("The sign-in window was closed before completion.");
          break;
        case 'permission-denied':
          setError("Dojo Access Denied: Your Firebase Firestore Security Rules are blocking this request. Please set your rules to allow read/write for authenticated users in the Firebase Console.");
          break;
        default:
          if (err.message && err.message.includes('permission-denied')) {
            setError("Dojo Access Denied: Your Firebase Firestore Security Rules are blocking this request. Please set your rules to allow read/write for authenticated users in the Firebase Console.");
          } else {
            setError("Something went wrong in the Dojo. Please try again or contact support if the issue persists.");
          }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    const guestUser: User = {
      id: `guest_${Math.random().toString(36).substr(2, 9)}`,
      username: 'Guest Sensei',
      role: 'student',
      subscription: 'free',
      xp: 0,
      streak: 0,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=guest`,
      joinedDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      isGuest: true
    };
    
    localStorage.setItem('quizeon_user', JSON.stringify(guestUser));
    window.dispatchEvent(new Event('user-update'));
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first to reset your password.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset link has been sent to your email!");
    } catch (err: any) {
      setError("Could not send reset email. Please check if the email is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-rice overflow-hidden">
      {/* Decorative Side - Desktop Only */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 washi-texture opacity-10"></div>
        
        {/* Decorative Elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-hanko rounded-full blur-[120px]"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-wood rounded-full blur-[120px]"
        />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block p-6 bg-hanko/10 rounded-[40px] mb-8 border-2 border-hanko/20 backdrop-blur-xl">
              <Globe size={80} className="text-hanko" />
            </div>
            <h1 className="text-[80px] xl:text-[120px] font-black text-rice leading-none tracking-tighter font-jp mb-4">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                QUIZ
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-hanko"
              >
                EON
              </motion.span>
            </h1>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-bamboo/30"></div>
              <p className="text-bamboo font-bold uppercase tracking-[0.3em] text-sm">マスターへの道</p>
              <div className="h-[1px] w-12 bg-bamboo/30"></div>
            </div>
            <p className="text-rice/60 text-xl font-medium max-w-md mx-auto leading-relaxed">
              Master the Japanese language with the power of AI. Your journey to fluency starts in the Dojo.
            </p>
          </motion.div>

          {/* Floating Stats/Badges */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-10 top-1/4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle size={20} className="text-emerald-500" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Active Learners</p>
                <p className="text-white font-black">12,402+</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vertical Rail Text */}
        <div className="absolute left-8 bottom-8 flex flex-col items-center gap-4">
          <div className="h-24 w-[1px] bg-bamboo/20"></div>
          <p className="writing-vertical text-[10px] text-bamboo font-bold uppercase tracking-[0.5em] opacity-50">
            ESTABLISHED 2024
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 relative overflow-hidden">
        <div className="absolute inset-0 washi-texture opacity-20 pointer-events-none"></div>
        
        {/* Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-hanko/5 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gold/5 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-bamboo/5 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-block p-4 bg-hanko/10 rounded-3xl mb-4">
              <Globe size={48} className="text-hanko" />
            </div>
            <h1 className="text-4xl font-black text-ink uppercase tracking-tighter font-jp">Quizeon 3.0</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-ink mb-2 font-jp uppercase tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join the Dojo'}
            </h2>
            <p className="text-bamboo font-medium">
              {isLogin ? 'Enter your credentials to continue your training.' : 'Create your account to start master Japanese.'}
            </p>
          </div>

          <GlassCard className="washi-theme shadow-washi border-b-8">
            <div className="flex gap-2 mb-8 bg-rice p-1.5 rounded-2xl border-2 border-bamboo/10">
              <button 
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                }}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isLogin ? 'bg-ink text-rice shadow-lg scale-[1.02]' : 'text-bamboo hover:bg-white/50'}`}
              >
                Login
              </button>
              <button 
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                }}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${!isLogin ? 'bg-ink text-rice shadow-lg scale-[1.02]' : 'text-bamboo hover:bg-white/50'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Input 
                      label="Username" 
                      placeholder="Sensei" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      required={!isLogin}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Input 
                label="Email Address" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <div className="space-y-2">
                <Input 
                  label="Password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
                {!isLogin && password.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level}
                          className={cn(
                            "flex-1 rounded-full transition-all duration-500",
                            passwordStrength >= level 
                              ? (passwordStrength <= 1 ? "bg-red-500" : passwordStrength <= 2 ? "bg-orange-500" : passwordStrength <= 3 ? "bg-yellow-500" : "bg-emerald-500")
                              : "bg-bamboo/10"
                          )}
                        />
                      ))}
                    </div>
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      passwordStrength <= 1 ? "text-red-500" : passwordStrength <= 2 ? "text-orange-500" : passwordStrength <= 3 ? "text-yellow-600" : "text-emerald-600"
                    )}>
                      {passwordStrength <= 1 ? "Weak" : passwordStrength <= 2 ? "Fair" : passwordStrength <= 3 ? "Good" : "Strong"} Dojo Password
                    </p>
                  </div>
                )}

                {isLogin && (
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[10px] font-black text-hanko hover:underline uppercase tracking-widest"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {(error || success) && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      "p-4 rounded-2xl text-xs font-bold flex flex-col gap-2 border-2",
                      error ? "bg-red-50 border-red-100 text-red-600" : "bg-green-50 border-green-100 text-green-700"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {error ? <AlertCircle size={16} className="shrink-0" /> : <Info size={16} className="shrink-0" />}
                      <span>{error || success}</span>
                    </div>
                    {error && isAlreadyRegistered && (
                      <button 
                        type="button"
                        onClick={() => {
                          setIsLogin(true);
                          setError(null);
                          setIsAlreadyRegistered(false);
                        }}
                        className="text-[10px] text-ink hover:underline uppercase tracking-widest font-black self-end flex items-center gap-1"
                      >
                        <LogIn size={10} />
                        Switch to Login
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" className="w-full py-5 text-base uppercase tracking-widest" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : (isLogin ? <LogIn size={20} /> : <UserPlus size={20} />)}
                {isLogin ? 'Enter Dojo' : 'Begin Journey'}
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-bamboo/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                  <span className="bg-white px-4 text-bamboo">Or</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGuestLogin}
                disabled={loading}
                className="w-full py-4 rounded-2xl border-2 border-bamboo/10 text-ink font-black text-xs uppercase tracking-widest hover:bg-rice transition-all flex items-center justify-center gap-2"
              >
                <UserIcon size={16} />
                Use as a Guest
              </button>
            </form>
          </GlassCard>

          <p className="text-center mt-10 text-[10px] text-bamboo font-bold uppercase tracking-widest leading-loose">
            By continuing, you agree to our <br />
            <span className="text-ink hover:underline cursor-pointer">Terms of Service</span> & <span className="text-ink hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
