import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Button, Input } from '../components/UI';
import { authService } from '../services/supabaseMock';
import { User } from '../types';
import { Lock, Loader2, UserPlus, LogIn, Sparkles } from 'lucide-react';

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

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <GlassCard className="w-full max-w-md relative z-10 border-t-white/20 transition-all duration-500">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/20 transition-all duration-500 ${isSignUp ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-gradient-to-br from-primary to-blue-600'}`}>
            {isSignUp ? <Sparkles className="text-white w-8 h-8" /> : <Lock className="text-white w-8 h-8" />}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-400">
            {isSignUp 
              ? 'Join Quizeon and start your Japanese journey' 
              : 'Enter your credentials to access the system'
            }
          </p>
          {!isSignUp && <p className="text-xs text-slate-500 mt-2">(Try: admin / admin)</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            id="username"
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
          
          <Input 
            id="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
          />

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center animate-fade-in">
              {error}
            </div>
          )}

          <Button type="submit" className={`w-full ${isSignUp ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30' : ''}`} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : (
              <span className="flex items-center gap-2">
                {isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />}
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-slate-400 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button 
            onClick={toggleMode}
            className="mt-2 text-primary hover:text-primary-light font-bold text-sm transition-colors"
          >
            {isSignUp ? 'Sign In instead' : 'Create Student Account'}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
