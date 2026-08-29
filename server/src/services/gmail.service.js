import { google } from 'googleapis';
import { mockStore } from '../config/mockStore.js';
import { Email } from '../models/Email.js';
import { GmailAccount } from '../models/GmailAccount.js';
import { getDBStatus } from '../config/db.js';

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

export const getOAuth2Client = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/gmail/callback';

  if (!clientId || !clientSecret || clientId === 'your_google_client_id_here') {
    return null;
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

/**
 * Generate Google OAuth Consent URL
 */
export const getAuthUrl = () => {
  const oauth2Client = getOAuth2Client();
  if (!oauth2Client) {
    return null;
  }

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES
  });
};

/**
 * Exchange Authorization Code for Tokens
 */
export const getTokensFromCode = async (code) => {
  const oauth2Client = getOAuth2Client();
  if (!oauth2Client) {
    throw new Error('Google OAuth credentials not configured');
  }

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();

  return {
    tokens,
    userInfo: userInfo.data
  };
};

/**
 * Fetch messages from real Gmail API or Fallback
 */
export const fetchUserEmails = async (userId) => {
  const dbStatus = getDBStatus();

  // If using MongoDB, try fetching from database
  if (dbStatus.connected) {
    try {
      const emails = await Email.find({ userId }).sort({ date: -1 });
      if (emails.length > 0) return emails;
    } catch (err) {
      console.warn(`[GmailService] DB fetch failed: ${err.message}`);
    }
  }

  // Return mockStore emails filtered by userId or all mock emails
  return mockStore.emails;
};

/**
 * Send an email via Gmail API or Mock Dispatcher
 */
export const sendEmailMessage = async ({ userId, to, subject, body }) => {
  const newEmail = {
    _id: `em_${Date.now()}`,
    userId: userId || 'user_demo_123',
    messageId: `msg_sent_${Date.now()}`,
    from: { name: 'Abhay Verma', email: 'abhay.verma.dev@gmail.com' },
    to: Array.isArray(to) ? to : [{ name: to, email: to }],
    subject: subject || '(No Subject)',
    snippet: body ? body.slice(0, 100) : '',
    body: body || '',
    date: new Date().toISOString(),
    isRead: true,
    isStarred: false,
    isArchived: false,
    isTrash: false,
    folder: 'sent',
    category: 'Work',
    priority: 'Medium',
    summary: 'Sent email: ' + (subject || ''),
    actionItems: []
  };

  const dbStatus = getDBStatus();
  if (dbStatus.connected) {
    try {
      const created = await Email.create(newEmail);
      return created;
    } catch (err) {
      console.warn(`[GmailService] Mongo write failed: ${err.message}`);
    }
  }

  // Prepend to mockStore
  mockStore.emails.unshift(newEmail);
  return newEmail;
};
