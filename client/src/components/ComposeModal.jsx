import React, { useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  Loader2,
  FileText,
  Wand2,
  CheckCircle2
} from 'lucide-react';
import { useEmail } from '../context/EmailContext';
import { emailAPI, aiAPI } from '../services/api';

export const ComposeModal = () => {
  const { isComposeOpen, setIsComposeOpen, refreshEmails } = useEmail();

  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isComposeOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!to.trim() || !body.trim()) {
      setStatusMessage('Please provide recipient email and body text.');
      return;
    }

    setIsSending(true);
    try {
      await emailAPI.sendEmail({
        to,
        subject: subject.trim() || '(No Subject)',
        body,
      });

      setStatusMessage('Email dispatched successfully!');
      refreshEmails();
      setTimeout(() => {
        setIsComposeOpen(false);
        setTo('');
        setSubject('');
        setBody('');
        setStatusMessage('');
      }, 1000);
    } catch (err) {
      console.error('Compose send error:', err);
      setStatusMessage('Failed to send email.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await emailAPI.saveDraft({ to, subject, body });
      setStatusMessage('Draft saved to Drafts folder.');
      refreshEmails();
      setTimeout(() => setStatusMessage(''), 2000);
    } catch (err) {
      console.error('Draft save error:', err);
    }
  };

  const handlePolish = async (tone = 'Professional', instruction = '') => {
    if (!body.trim()) return;
    setIsPolishing(true);
    try {
      const res = await aiAPI.rewrite({
        draftText: body,
        tone,
        instruction,
      });
      if (res.data?.success) {
        setBody(res.data.data.polished);
      }
    } catch (err) {
      console.error('Polish error:', err);
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-dark-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-dark-850">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white">
              <Wand2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">New Message</h3>
          </div>
          <button
            onClick={() => setIsComposeOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <form onSubmit={handleSend} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="To: recipient@example.com"
              required
              className="w-full px-4 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full px-4 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>

          {/* AI Enhancement Toolbar */}
          <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Writing Suite:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => handlePolish('Professional', 'Improve grammar, structure and clarity')}
                disabled={isPolishing}
                className="px-2.5 py-1 bg-dark-850 hover:bg-purple-600/30 text-slate-300 hover:text-purple-200 border border-slate-700/60 rounded-lg text-[11px] font-medium transition-all"
              >
                ✨ Polish Grammar
              </button>
              <button
                type="button"
                onClick={() => handlePolish('Concise')}
                disabled={isPolishing}
                className="px-2.5 py-1 bg-dark-850 hover:bg-purple-600/30 text-slate-300 hover:text-purple-200 border border-slate-700/60 rounded-lg text-[11px] font-medium transition-all"
              >
                ⚡ Make Concise
              </button>
              <button
                type="button"
                onClick={() => handlePolish('Formal')}
                disabled={isPolishing}
                className="px-2.5 py-1 bg-dark-850 hover:bg-purple-600/30 text-slate-300 hover:text-purple-200 border border-slate-700/60 rounded-lg text-[11px] font-medium transition-all"
              >
                👔 Make Formal
              </button>
              <button
                type="button"
                onClick={() => handlePolish('Friendly')}
                disabled={isPolishing}
                className="px-2.5 py-1 bg-dark-850 hover:bg-purple-600/30 text-slate-300 hover:text-purple-200 border border-slate-700/60 rounded-lg text-[11px] font-medium transition-all"
              >
                😊 Make Friendly
              </button>
            </div>
          </div>

          <div className="relative">
            {isPolishing && (
              <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-xs rounded-2xl flex items-center justify-center z-10">
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin mr-2" />
                <span className="text-xs text-purple-200">Refining text with Gemini...</span>
              </div>
            )}
            <textarea
              rows={9}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email here... Type your points and click 'Polish Grammar' to elevate your message."
              required
              className="w-full p-4 bg-dark-950 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
            />
          </div>

          {statusMessage && (
            <div className={`p-2.5 rounded-xl text-xs text-center font-medium ${
              statusMessage.includes('successfully') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
            }`}>
              {statusMessage}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-dark-850 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-2 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsComposeOpen(false)}
              className="px-4 py-2 text-slate-400 hover:text-slate-200 text-xs font-medium"
            >
              Discard
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Send Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
