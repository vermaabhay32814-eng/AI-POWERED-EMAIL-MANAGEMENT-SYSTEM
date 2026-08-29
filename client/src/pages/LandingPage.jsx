import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Brain,
  CheckCircle2,
  ArrowRight,
  Mail,
  Lock,
  BarChart3,
  Layers,
  Inbox
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Navigation */}
      <nav className="h-20 border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-lg sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-display font-black text-xl tracking-tight text-white">
              Intelligent<span className="ai-gradient-text">Mail</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-102"
          >
            <span>Launch Inbox</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 lg:py-28 relative overflow-hidden text-center max-w-6xl mx-auto">
        {/* Glow background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-8 animate-fade-in shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
          <span>Next-Generation AI Email Management Suite</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
          Your Inbox, Powered by <br className="hidden sm:inline" />
          <span className="ai-gradient-text">Autonomous AI Intelligence</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Connect your Gmail seamlessly with OAuth 2.0. Distill multi-page email threads into executive summaries, generate tone-matched responses, and triage deadlines in milliseconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-16">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-600/30 transition-all hover:scale-105 flex items-center justify-center gap-3 text-sm sm:text-base ai-btn-glow"
          >
            <Zap className="w-5 h-5" />
            <span>Open AI Dashboard (Demo Ready)</span>
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-7 py-4 bg-dark-850 hover:bg-dark-800 border border-slate-800 text-slate-300 hover:text-white font-semibold rounded-2xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <span>Sign In / Create Account</span>
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-8">
          <div className="p-6 rounded-3xl bg-dark-900/60 border border-slate-800/80 shadow-xl hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Executive Summarization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Condense 1000-word updates and lengthy corporate threads into 2-3 actionable bullets with Gemini 1.5.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-900/60 border border-slate-800/80 shadow-xl hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Tone-Adaptive Smart Reply</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Switch effortlessly between Professional, Friendly, Formal, Concise, and Urgent tones. Full user review before sending.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-900/60 border border-slate-800/80 shadow-xl hover:border-blue-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">OAuth 2.0 & Privacy First</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero passwords stored. Token encryption at rest. Never exposes OAuth credentials or API keys to the browser.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-dark-950 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 Intelligent Email Assistant. Built with React, Node.js, Google OAuth 2.0 & Gemini AI.</p>
      </footer>
    </div>
  );
};
