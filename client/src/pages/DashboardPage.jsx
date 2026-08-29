import React from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { EmailList } from '../components/EmailList';
import { EmailReader } from '../components/EmailReader';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { AIReplyModal } from '../components/AIReplyModal';
import { ComposeModal } from '../components/ComposeModal';
import { SettingsModal } from '../components/SettingsModal';
import { useEmail } from '../context/EmailContext';

export const DashboardPage = () => {
  const { currentView } = useEmail();

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Folders & Categories Navigation */}
        <Sidebar />

        {/* Dynamic Center/Right Views */}
        {currentView === 'analytics' ? (
          <AnalyticsDashboard />
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Middle Email Cards List */}
            <EmailList />

            {/* Right Detailed Email Reader & AI Assistant Suite */}
            <EmailReader />
          </div>
        )}
      </div>

      {/* Interactive Modals */}
      <AIReplyModal />
      <ComposeModal />
      <SettingsModal />
    </div>
  );
};
