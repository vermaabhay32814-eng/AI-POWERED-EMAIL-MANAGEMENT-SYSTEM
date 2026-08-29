import React from 'react';
import {
  Inbox,
  Star,
  Send,
  FileText,
  Archive,
  Trash2,
  Tag,
  Briefcase,
  DollarSign,
  GraduationCap,
  User,
  Sparkles,
  Zap,
  Flame,
  AlertCircle
} from 'lucide-react';
import { useEmail } from '../context/EmailContext';

export const Sidebar = () => {
  const {
    activeFolder,
    setActiveFolder,
    activeCategory,
    setActiveCategory,
    activePriority,
    setActivePriority,
    emails,
    setCurrentView,
  } = useEmail();

  const unreadCount = emails.filter(e => !e.isRead && !e.isTrash).length;
  const starredCount = emails.filter(e => e.isStarred && !e.isTrash).length;

  const folders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: unreadCount },
    { id: 'starred', label: 'Starred', icon: Star, badge: starredCount },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  const categories = [
    { id: 'All', label: 'All Categories', color: 'text-slate-400' },
    { id: 'Work', label: 'Work', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'Finance', label: 'Finance', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'Education', label: 'Education', icon: GraduationCap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'Personal', label: 'Personal', icon: User, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'Promotions', label: 'Promotions', icon: Sparkles, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  const priorities = [
    { id: 'All', label: 'All Priorities' },
    { id: 'High', label: 'High Priority', dot: 'bg-rose-500' },
    { id: 'Medium', label: 'Medium', dot: 'bg-amber-500' },
    { id: 'Low', label: 'Low', dot: 'bg-emerald-500' },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-dark-900 flex flex-col justify-between p-4 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="space-y-6">
        {/* Main Navigation Folders */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Folders
          </p>
          <nav className="space-y-1">
            {folders.map((f) => {
              const Icon = f.icon;
              const isActive = activeFolder === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFolder(f.id);
                    setCurrentView('inbox');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                    <span>{f.label}</span>
                  </div>
                  {f.badge !== undefined && f.badge > 0 ? (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-purple-500 text-white' : 'bg-dark-800 text-slate-300'
                    }`}>
                      {f.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Smart Categories */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              AI Categories
            </p>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <nav className="space-y-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const Icon = cat.icon || Tag;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Priority Filter */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Priority Filter
          </p>
          <div className="flex flex-wrap gap-1 px-2">
            {priorities.map((p) => {
              const isActive = activePriority === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePriority(p.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white font-semibold'
                      : 'bg-dark-850 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {p.dot && <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />}
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom AI Productivity Card */}
      <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-b from-purple-950/40 to-indigo-950/20 border border-purple-500/20 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1.5">
          <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-xs font-bold text-purple-200">AI Assistant Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
          Gemini LLM pipeline is ready to summarize incoming threads and generate tone-matched replies.
        </p>
        <button
          onClick={() => setCurrentView('analytics')}
          className="w-full py-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-200 rounded-xl text-[11px] font-semibold transition-all text-center"
        >
          View Productivity Stats
        </button>
      </div>
    </aside>
  );
};
