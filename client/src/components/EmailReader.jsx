import React, { useState } from 'react';
import {
  Sparkles,
  CornerUpLeft,
  Star,
  Archive,
  Trash2,
  HelpCircle,
  ListTodo,
  CheckSquare,
  Square,
  Clock,
  Send,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import { useEmail } from '../context/EmailContext';
import { aiAPI } from '../services/api';

export const EmailReader = () => {
  const {
    selectedEmail,
    toggleStar,
    archiveEmail,
    deleteEmail,
    triggerAIReply,
    refreshEmails
  } = useEmail();

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isExtractingTasks, setIsExtractingTasks] = useState(false);

  const [summaryText, setSummaryText] = useState('');
  const [explanationText, setExplanationText] = useState('');
  const [actionItems, setActionItems] = useState([]);
  const [completedTasks, setCompletedTasks] = useState({});
  const [copiedSection, setCopiedSection] = useState('');

  if (!selectedEmail) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-dark-950 text-slate-500">
        <div className="w-16 h-16 rounded-3xl bg-dark-900 border border-slate-800 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-purple-400/50" />
        </div>
        <h3 className="text-base font-bold text-slate-300 mb-1">Select an email to inspect</h3>
        <p className="text-xs text-slate-500 text-center max-w-sm">
          Choose a conversation from the list to trigger Gemini AI summarization, extract action items, or generate instant replies.
        </p>
      </main>
    );
  }

  // Handle AI Summarization
  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const res = await aiAPI.summarize({
        emailId: selectedEmail._id,
        subject: selectedEmail.subject,
        body: selectedEmail.body,
      });
      if (res.data?.success) {
        setSummaryText(res.data.data.summary);
      }
    } catch (err) {
      console.error('Summarize error:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Handle AI Plain-English Explanation
  const handleExplain = async () => {
    setIsExplaining(true);
    try {
      const res = await aiAPI.explain({
        emailId: selectedEmail._id,
        subject: selectedEmail.subject,
        body: selectedEmail.body,
      });
      if (res.data?.success) {
        setExplanationText(res.data.data.explanation);
      }
    } catch (err) {
      console.error('Explain error:', err);
    } finally {
      setIsExplaining(false);
    }
  };

  // Handle AI Action Items Extraction
  const handleExtractTasks = async () => {
    setIsExtractingTasks(true);
    try {
      const res = await aiAPI.extractActionItems({
        emailId: selectedEmail._id,
        subject: selectedEmail.subject,
        body: selectedEmail.body,
      });
      if (res.data?.success) {
        setActionItems(res.data.data.actionItems || []);
      }
    } catch (err) {
      console.error('Extract tasks error:', err);
    } finally {
      setIsExtractingTasks(false);
    }
  };

  const copyToClipboard = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(''), 2000);
  };

  const toggleTask = (idx) => {
    setCompletedTasks(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'Recently';
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-[#0A0E1A]">
      {/* Top Header Toolbar */}
      <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-dark-900/60 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {selectedEmail.category || 'Work'}
              </span>
              <span className="text-xs text-slate-400">
                Priority: <strong className="text-slate-200">{selectedEmail.priority || 'Medium'}</strong>
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white leading-snug tracking-tight">
              {selectedEmail.subject}
            </h1>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleStar(selectedEmail._id)}
              className="p-2 rounded-xl border border-slate-800 bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-amber-400 transition-colors"
              title="Star email"
            >
              <Star className={`w-4 h-4 ${selectedEmail.isStarred ? 'text-amber-400 fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => archiveEmail(selectedEmail._id)}
              className="p-2 rounded-xl border border-slate-800 bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Archive email"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteEmail(selectedEmail._id)}
              className="p-2 rounded-xl border border-slate-800 bg-dark-850 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              title="Delete email"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Action Command Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all hover:scale-102"
          >
            {isSummarizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
            <span>✨ Summarize</span>
          </button>

          <button
            onClick={handleExplain}
            disabled={isExplaining}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
          >
            {isExplaining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />}
            <span>💡 Explain Email</span>
          </button>

          <button
            onClick={handleExtractTasks}
            disabled={isExtractingTasks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all"
          >
            {isExtractingTasks ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ListTodo className="w-3.5 h-3.5 text-blue-400" />}
            <span>📋 Action Items</span>
          </button>

          <button
            onClick={() => triggerAIReply(selectedEmail)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 ml-auto"
          >
            <CornerUpLeft className="w-3.5 h-3.5" />
            <span>Generate AI Reply</span>
          </button>
        </div>
      </div>

      {/* Main Email Content & AI Panels Container */}
      <div className="p-4 sm:p-6 space-y-6 max-w-4xl">
        {/* Sender Meta Info */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900/60 border border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
              {(selectedEmail.from?.name || selectedEmail.from?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{selectedEmail.from?.name || 'Unknown Sender'}</p>
              <p className="text-xs text-slate-400">{selectedEmail.from?.email}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">
              {formatDate(selectedEmail.date)}
            </span>
          </div>
        </div>

        {/* AI Summary Card (If active or pre-calculated) */}
        {(summaryText || selectedEmail.summary) && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-dark-900 to-indigo-950/30 border border-purple-500/30 shadow-lg shadow-purple-950/20 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-purple-200 tracking-wide uppercase">AI Executive Summary</h4>
              </div>
              <button
                onClick={() => copyToClipboard(summaryText || selectedEmail.summary, 'summary')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'summary' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'summary' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              {summaryText || selectedEmail.summary}
            </p>
          </div>
        )}

        {/* AI Action Items Card (If active or preloaded) */}
        {(actionItems.length > 0 || (selectedEmail.actionItems && selectedEmail.actionItems.length > 0)) && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/30 via-dark-900 to-cyan-950/20 border border-blue-500/30 shadow-lg animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <ListTodo className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs font-bold text-blue-200 tracking-wide uppercase">Extracted Action Items & Deadlines</h4>
            </div>
            <div className="space-y-2">
              {(actionItems.length > 0 ? actionItems : selectedEmail.actionItems).map((item, idx) => {
                const isDone = !!completedTasks[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleTask(idx)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through'
                        : 'bg-dark-850/80 border-slate-700/60 text-slate-200 hover:border-blue-500/40'
                    }`}
                  >
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 text-xs leading-relaxed">
                      <span>{item.task}</span>
                      {item.deadline && item.deadline !== 'Not specified' && (
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-300">
                          <Clock className="w-3 h-3" />
                          <span>Deadline: {item.deadline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Plain English Explanation (ELI5) */}
        {explanationText && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-dark-900 to-slate-900 border border-indigo-500/30 shadow-lg animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-indigo-200 tracking-wide uppercase">Plain English Explanation</h4>
              </div>
              <button
                onClick={() => copyToClipboard(explanationText, 'explain')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'explain' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'explain' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-xs sm:text-sm text-indigo-100/90 whitespace-pre-line leading-relaxed">
              {explanationText}
            </div>
          </div>
        )}

        {/* Full Email Message Body */}
        <article className="p-6 rounded-2xl bg-dark-900/40 border border-slate-800/80 text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
          {selectedEmail.body}
        </article>

        {/* Bottom Fast Action Prompt */}
        <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-white">Need to reply to {selectedEmail.from?.name || 'sender'}?</p>
            <p className="text-[11px] text-slate-400">Choose a tone and let the AI draft a context-aware response in seconds.</p>
          </div>
          <button
            onClick={() => triggerAIReply(selectedEmail)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex-shrink-0"
          >
            <CornerUpLeft className="w-3.5 h-3.5" />
            <span>Open AI Reply Suite</span>
          </button>
        </div>
      </div>
    </main>
  );
};
