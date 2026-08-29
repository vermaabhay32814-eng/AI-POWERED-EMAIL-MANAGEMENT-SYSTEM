import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  PenSquare,
  BarChart3,
  Mail,
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  X
} from 'lucide-react';
import { useEmail } from '../context/EmailContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const {
    searchQuery,
    setSearchQuery,
    setIsComposeOpen,
    setIsSettingsOpen,
    currentView,
    setCurrentView,
  } = useEmail();
  
  const { user, logout, gmailStatus, toggleSimulatedGmail } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-dark-900/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Brand & View Switcher */}
      <div className="flex items-center gap-6">
        <div 
          onClick={() => setCurrentView('inbox')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              Intelligent<span className="ai-gradient-text">Mail</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-medium px-1.5 py-0.2 bg-emerald-500/10 rounded-full border border-emerald-500/20 -mt-1 block w-max">
              AI Powered
            </span>
          </div>
        </div>

        {/* View Toggle (Inbox / Analytics) */}
        <div className="hidden md:flex items-center bg-dark-850 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentView('inbox')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentView === 'inbox'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Inbox
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentView === 'analytics'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            AI Analytics
          </button>
        </div>
      </div>

      {/* Center: Smart Natural Language Search */}
      <div className="flex-1 max-w-xl hidden sm:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-purple-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Smart search: 'unpaid invoices', 'urgent reviews', 'Sarah'..."
            className="w-full pl-10 pr-10 py-2 bg-dark-850 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Compose Button */}
        <button
          onClick={() => setIsComposeOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl ai-btn-glow"
        >
          <PenSquare className="w-4 h-4" />
          <span>Compose</span>
        </button>

        {/* Gmail OAuth Live Status Pill */}
        <div 
          onClick={() => toggleSimulatedGmail(!gmailStatus.isConnected)}
          title="Click to toggle Gmail sync simulator"
          className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
            gmailStatus.isConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
          }`}
        >
          {gmailStatus.isConnected ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gmail Synced</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Connect Gmail</span>
            </>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-dark-850 rounded-xl border border-transparent hover:border-slate-800 transition-colors"
          title="Settings & AI Keys"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-dark-850 transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl p-2 z-50 border border-slate-700/60 shadow-2xl animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white">{user?.name || 'Abhay Verma'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'abhay.verma.dev@gmail.com'}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsSettingsOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-purple-600/20 rounded-xl transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-purple-400" />
                  Settings & Keys
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
