import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Loader2,
  RefreshCw,
  Copy,
  Check,
  Smile,
  Briefcase,
  Award,
  Zap,
  Flame,
  MessageSquare
} from 'lucide-react';
import { useEmail } from '../context/EmailContext';
import { aiAPI, emailAPI } from '../services/api';

export const AIReplyModal = () => {
  const {
    isAIReplyOpen,
    setIsAIReplyOpen,
    replyTargetEmail,
    refreshEmails
  } = useEmail();

  const [tone, setTone] = useState('Professional');
  const [userNotes, setUserNotes] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const tones = [
    { id: 'Professional', label: 'Professional', icon: Briefcase, color: 'text-blue-400' },
    { id: 'Friendly', label: 'Friendly', icon: Smile, color: 'text-amber-400' },
    { id: 'Formal', label: 'Formal', icon: Award, color: 'text-purple-400' },
    { id: 'Concise', label: 'Concise', icon: Zap, color: 'text-emerald-400' },
    { id: 'Urgent', label: 'Urgent', icon: Flame, color: 'text-rose-400' },
  ];

  // Auto-generate a draft when opened
  useEffect(() => {
    if (isAIReplyOpen && replyTargetEmail) {
      handleGenerate();
    }
  }, [isAIReplyOpen, replyTargetEmail]);

  if (!isAIReplyOpen || !replyTargetEmail) return null;

  const handleGenerate = async (customTone) => {
    const selectedTone = customTone || tone;
    setIsGenerating(true);
    setStatusMessage('');
    try {
      const res = await aiAPI.generateReply({
        emailId: replyTargetEmail._id,
        subject: replyTargetEmail.subject,
        body: replyTargetEmail.body,
        sender: replyTargetEmail.from,
        tone: selectedTone,
        userNotes: userNotes.trim() || undefined,
      });

      if (res.data?.success) {
        setGeneratedDraft(res.data.data.reply);
      }
    } catch (err) {
      console.error('Generate reply error:', err);
      setStatusMessage('Error contacting AI. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!generatedDraft.trim()) return;
    setIsSending(true);
    try {
      const recipient = replyTargetEmail.from?.email || 'recipient@example.com';
      const cleanSubj = replyTargetEmail.subject.startsWith('Re:')
        ? replyTargetEmail.subject
        : `Re: ${replyTargetEmail.subject}`;

      await emailAPI.sendEmail({
        to: recipient,
        subject: cleanSubj,
        body: generatedDraft,
      });

      setStatusMessage('Reply sent successfully!');
      refreshEmails();
      setTimeout(() => {
        setIsAIReplyOpen(false);
        setGeneratedDraft('');
        setUserNotes('');
        setStatusMessage('');
      }, 1200);
    } catch (err) {
      console.error('Send reply error:', err);
      setStatusMessage('Failed to send email.');
    } finally {
      setIsSending(false);
    }
  };

  const copyDraft = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-dark-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-dark-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                AI Reply Assistant
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Replying to: <strong className="text-slate-200">{replyTargetEmail.from?.name || replyTargetEmail.from?.email}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAIReplyOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Tone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {tones.map((t) => {
                const Icon = t.icon;
                const isActive = tone === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTone(t.id);
                      handleGenerate(t.id);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      isActive
                        ? 'bg-purple-600/30 border-purple-500 text-purple-200 shadow-md shadow-purple-900/30'
                        : 'bg-dark-800 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Prompt / Key Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>Key notes or instructions (Optional)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="e.g. Confirm Tuesday at 3 PM, agree on $4,800 pricing..."
                className="flex-1 px-3 py-2 bg-dark-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 flex-shrink-0"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          {/* Generated Reply Textarea & Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Generated Reply Draft (Review & Edit)
              </label>
              <button
                onClick={copyDraft}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="relative">
              {isGenerating && (
                <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center z-10 space-y-2">
                  <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                  <p className="text-xs font-medium text-purple-300">Drafting {tone} response with Gemini AI...</p>
                </div>
              )}
              <textarea
                rows={8}
                value={generatedDraft}
                onChange={(e) => setGeneratedDraft(e.target.value)}
                placeholder="AI reply will generate here..."
                className="w-full p-4 bg-dark-950 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs text-center font-medium ${
              statusMessage.includes('successfully') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
            }`}>
              {statusMessage}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-dark-850 flex items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Emails are never sent automatically without your explicit confirmation.
          </p>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={() => setIsAIReplyOpen(false)}
              className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending || !generatedDraft.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Send Reply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
