import React from 'react';
import {
  Star,
  Sparkles,
  CornerUpLeft,
  Trash2,
  Clock,
  CheckCircle2,
  MailCheck,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { useEmail } from '../context/EmailContext';

export const EmailList = () => {
  const {
    emails,
    selectedEmail,
    setSelectedEmail,
    isLoadingEmails,
    toggleStar,
    deleteEmail,
    triggerAIReply,
    activeFolder,
    activeCategory,
    activePriority,
    searchQuery,
  } = useEmail();

  const formatTimestamp = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMin = Math.floor(diffMs / (1000 * 60));
      const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHour < 24) return `${diffHour}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Med
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
            Low
          </span>
        );
    }
  };

  const getCategoryBadge = (cat) => {
    const colors = {
      Work: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      Finance: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      Education: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      Personal: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      Promotions: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    };
    const style = colors[cat] || 'bg-slate-800 text-slate-300 border-slate-700';

    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${style}`}>
        {cat}
      </span>
    );
  };

  return (
    <section className="w-full md:w-96 lg:w-[420px] border-r border-slate-800/80 bg-dark-950 flex flex-col h-[calc(100vh-4rem)] flex-shrink-0">
      {/* Header Info Bar */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-dark-900/50">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-white capitalize">{activeFolder}</h2>
          <span className="text-xs text-slate-400 font-medium">
            ({emails.length} {emails.length === 1 ? 'message' : 'messages'})
          </span>
        </div>
        {(activeCategory !== 'All' || activePriority !== 'All' || searchQuery) && (
          <span className="text-[11px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            Filtered
          </span>
        )}
      </div>

      {/* Email List Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {isLoadingEmails ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading intelligent inbox...</p>
          </div>
        ) : emails.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-dark-850 flex items-center justify-center mx-auto text-slate-500">
              <MailCheck className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-300">No emails found</p>
            <p className="text-xs text-slate-500">
              {searchQuery ? `No messages match "${searchQuery}"` : 'All caught up in this folder!'}
            </p>
          </div>
        ) : (
          emails.map((email) => {
            const isSelected = selectedEmail?._id === email._id;
            const senderInitial = (email.from?.name || email.from?.email || 'U')[0].toUpperCase();

            return (
              <div
                key={email._id}
                onClick={() => setSelectedEmail(email)}
                className={`p-3.5 cursor-pointer transition-all relative group ${
                  isSelected
                    ? 'bg-purple-950/30 border-l-4 border-l-purple-500'
                    : email.isRead
                    ? 'bg-dark-950/40 hover:bg-dark-900'
                    : 'bg-dark-900/90 hover:bg-dark-850 border-l-2 border-l-purple-400/50 font-medium'
                }`}
              >
                {/* Top Row: Sender & Timestamp & Star */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                      {senderInitial}
                    </div>
                    <span className={`text-xs truncate ${email.isRead ? 'text-slate-300' : 'text-white font-bold'}`}>
                      {email.from?.name || email.from?.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-[11px] text-slate-500">
                      {formatTimestamp(email.date)}
                    </span>
                    <button
                      onClick={(e) => toggleStar(email._id, e)}
                      className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                    >
                      <Star className={`w-3.5 h-3.5 ${email.isStarred ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Subject */}
                <h3 className={`text-xs leading-snug mb-1 line-clamp-1 ${email.isRead ? 'text-slate-300 font-normal' : 'text-white font-semibold'}`}>
                  {email.subject}
                </h3>

                {/* Snippet Preview */}
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                  {email.snippet || email.body?.slice(0, 120)}
                </p>

                {/* Bottom Tags: Category & Priority & Quick Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    {getCategoryBadge(email.category || 'General')}
                    {getPriorityBadge(email.priority || 'Medium')}
                  </div>

                  {/* Hover Quick Actions */}
                  <div className="hidden group-hover:flex items-center gap-1 bg-dark-900/90 px-1.5 py-0.5 rounded-lg border border-slate-700/60 shadow-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmail(email);
                      }}
                      title="AI Summarize"
                      className="p-1 hover:text-purple-400 text-slate-400 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerAIReply(email);
                      }}
                      title="AI Reply"
                      className="p-1 hover:text-emerald-400 text-slate-400 transition-colors"
                    >
                      <CornerUpLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEmail(email._id);
                      }}
                      title="Delete"
                      className="p-1 hover:text-rose-400 text-slate-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
