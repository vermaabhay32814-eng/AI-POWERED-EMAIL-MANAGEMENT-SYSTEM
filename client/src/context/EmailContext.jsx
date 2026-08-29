import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { emailAPI, aiAPI } from '../services/api';

const EmailContext = createContext(null);

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  
  // Navigation and Filter States
  const [activeFolder, setActiveFolder] = useState('inbox'); // 'inbox' | 'starred' | 'sent' | 'drafts' | 'trash' | 'archive'
  const [activeCategory, setActiveCategory] = useState('All'); // 'All' | 'Work' | 'Finance' | 'Personal' | 'Education' | 'Promotions'
  const [activePriority, setActivePriority] = useState('All'); // 'All' | 'High' | 'Medium' | 'Low'
  const [searchQuery, setSearchQuery] = useState('');
  
  // View Switcher: 'inbox' or 'analytics'
  const [currentView, setCurrentView] = useState('inbox');

  // Modals
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isAIReplyOpen, setIsAIReplyOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [replyTargetEmail, setReplyTargetEmail] = useState(null);

  // Fetch emails according to active filters
  const fetchEmails = useCallback(async () => {
    setIsLoadingEmails(true);
    try {
      const res = await emailAPI.getEmails({
        folder: activeFolder,
        category: activeCategory !== 'All' ? activeCategory : undefined,
        priority: activePriority !== 'All' ? activePriority : undefined,
        search: searchQuery || undefined,
      });

      if (res.data?.success) {
        setEmails(res.data.data);
        // Automatically select the first email if none is selected or current selected is not in results
        if (res.data.data.length > 0) {
          setSelectedEmail(prev => {
            if (!prev) return res.data.data[0];
            const found = res.data.data.find(e => e._id === prev._id);
            return found || res.data.data[0];
          });
        } else {
          setSelectedEmail(null);
        }
      }
    } catch (err) {
      console.error('Fetch emails error:', err);
    } finally {
      setIsLoadingEmails(false);
    }
  }, [activeFolder, activeCategory, activePriority, searchQuery]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // Toggle Star
  const toggleStar = async (emailId, e) => {
    if (e) e.stopPropagation();
    try {
      // Optimistic update
      setEmails(prev => prev.map(em => em._id === emailId ? { ...em, isStarred: !em.isStarred } : em));
      if (selectedEmail?._id === emailId) {
        setSelectedEmail(prev => ({ ...prev, isStarred: !prev.isStarred }));
      }
      await emailAPI.toggleStar(emailId);
    } catch (err) {
      console.error('Toggle star error:', err);
      fetchEmails();
    }
  };

  // Toggle Read
  const toggleRead = async (emailId, e) => {
    if (e) e.stopPropagation();
    try {
      setEmails(prev => prev.map(em => em._id === emailId ? { ...em, isRead: !em.isRead } : em));
      if (selectedEmail?._id === emailId) {
        setSelectedEmail(prev => ({ ...prev, isRead: !prev.isRead }));
      }
      await emailAPI.toggleRead(emailId);
    } catch (err) {
      console.error('Toggle read error:', err);
      fetchEmails();
    }
  };

  // Archive Email
  const archiveEmail = async (emailId) => {
    try {
      setEmails(prev => prev.filter(em => em._id !== emailId));
      if (selectedEmail?._id === emailId) {
        setSelectedEmail(null);
      }
      await emailAPI.archiveEmail(emailId);
    } catch (err) {
      console.error('Archive error:', err);
      fetchEmails();
    }
  };

  // Delete Email
  const deleteEmail = async (emailId) => {
    try {
      setEmails(prev => prev.filter(em => em._id !== emailId));
      if (selectedEmail?._id === emailId) {
        setSelectedEmail(null);
      }
      await emailAPI.deleteEmail(emailId);
    } catch (err) {
      console.error('Delete error:', err);
      fetchEmails();
    }
  };

  // Open Reply Modal for a specific email
  const triggerAIReply = (email) => {
    setReplyTargetEmail(email || selectedEmail);
    setIsAIReplyOpen(true);
  };

  // Select an email and mark as read
  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      toggleRead(email._id);
    }
  };

  return (
    <EmailContext.Provider
      value={{
        emails,
        selectedEmail,
        setSelectedEmail: handleSelectEmail,
        isLoadingEmails,
        activeFolder,
        setActiveFolder,
        activeCategory,
        setActiveCategory,
        activePriority,
        setActivePriority,
        searchQuery,
        setSearchQuery,
        currentView,
        setCurrentView,
        refreshEmails: fetchEmails,
        toggleStar,
        toggleRead,
        archiveEmail,
        deleteEmail,
        isComposeOpen,
        setIsComposeOpen,
        isAIReplyOpen,
        setIsAIReplyOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        replyTargetEmail,
        triggerAIReply,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) throw new Error('useEmail must be used within an EmailProvider');
  return context;
};
