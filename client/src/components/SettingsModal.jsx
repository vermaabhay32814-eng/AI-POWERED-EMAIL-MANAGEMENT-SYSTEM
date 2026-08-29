import React, { useState } from 'react';
import {
  X,
  Settings,
  Key,
  Shield,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useEmail } from '../context/EmailContext';
import { useAuth } from '../context/AuthContext';

export const SettingsModal = () => {
  const { isSettingsOpen, setIsSettingsOpen } = useEmail();
  const { gmailStatus, toggleSimulatedGmail } = useAuth();

  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('user_gemini_key') || '');
  const [defaultTone, setDefaultTone] = useState(localStorage.getItem('user_default_tone') || 'Professional');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('user_gemini_key', geminiKey);
    localStorage.setItem('user_default_tone', defaultTone);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-dark-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-dark-850">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">System & AI Settings</h3>
              <p className="text-[11px] text-slate-400">Manage LLM models, API keys, and simulation modes</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Gemini AI Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                <span>Google Gemini API Key</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy... (Leave empty to use backend or smart heuristics)"
              className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              If left blank, the app seamlessly runs on our built-in intelligent NLP heuristic engine.
            </p>
          </div>

          {/* Default Tone Preference */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Default Reply Tone
            </label>
            <select
              value={defaultTone}
              onChange={(e) => setDefaultTone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="Professional">Professional (Corporate, clear, balanced)</option>
              <option value="Friendly">Friendly (Warm, collaborative, enthusiastic)</option>
              <option value="Formal">Formal (Executive, structured)</option>
              <option value="Concise">Concise (Direct, 2-3 sentences max)</option>
              <option value="Urgent">Urgent (Immediate action focused)</option>
            </select>
          </div>

          {/* Gmail Simulator & Sandbox Toggle */}
          <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Gmail Integration Mode</p>
                <p className="text-[11px] text-slate-400">
                  {gmailStatus.isConnected
                    ? 'Connected with active synchronized inbox data.'
                    : 'Disconnected. Toggle to simulate connection.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleSimulatedGmail(!gmailStatus.isConnected)}
                className="text-purple-400 hover:text-purple-300 transition-transform"
              >
                {gmailStatus.isConnected ? (
                  <ToggleRight className="w-8 h-8 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-600" />
                )}
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings saved successfully!</span>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-dark-850 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
