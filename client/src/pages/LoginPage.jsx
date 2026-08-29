import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('abhay.demo@emailassistant.ai');
  const [password, setPassword] = useState('demo12345');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('abhay.demo@emailassistant.ai');
    setPassword('demo12345');
    setIsLoading(true);
    const res = await login('abhay.demo@emailassistant.ai', 'demo12345');
    setIsLoading(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-4 selection:bg-purple-600 selection:text-white">
      <div className="w-full max-w-md bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 mx-auto">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to access your Intelligent Email command center</p>
        </div>

        {/* One-Click Instant Demo Button */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-emerald-600/20 hover:from-purple-600/30 hover:to-emerald-600/30 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-2 group shadow-md"
        >
          <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          <span>Quick Demo Sign-In (1-Click Instant Access)</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="h-[1px] bg-slate-800 flex-1" />
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Or credentials</span>
          <div className="h-[1px] bg-slate-800 flex-1" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>Sign In</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-400 hover:underline font-semibold">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
