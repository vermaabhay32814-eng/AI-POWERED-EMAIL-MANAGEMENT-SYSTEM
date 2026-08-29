import { getAuthUrl, getTokensFromCode } from '../services/gmail.service.js';
import { mockStore } from '../config/mockStore.js';
import { GmailAccount } from '../models/GmailAccount.js';
import { EmailActivity } from '../models/EmailActivity.js';
import { getDBStatus } from '../config/db.js';

/**
 * Get Google OAuth URL
 * GET /api/gmail/connect
 */
export const connectGmail = async (req, res) => {
  try {
    const authUrl = getAuthUrl();
    if (!authUrl) {
      return res.json({
        success: true,
        isConfigured: false,
        message: 'Google OAuth Client ID/Secret not set. Interactive Simulator mode active.',
        simulationAvailable: true
      });
    }

    res.json({
      success: true,
      isConfigured: true,
      authUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Google OAuth Callback
 * GET /api/gmail/callback
 */
export const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  try {
    const { tokens, userInfo } = await getTokensFromCode(code);
    const userId = req.user?._id || 'user_demo_123';
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      await GmailAccount.findOneAndUpdate(
        { userId },
        {
          userId,
          googleId: userInfo.id,
          email: userInfo.email,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
          isConnected: true,
          lastSyncedAt: new Date()
        },
        { upsert: true, new: true }
      );

      await EmailActivity.create({
        userId,
        action: 'GMAIL_CONNECTED',
        metadata: { email: userInfo.email }
      });
    }

    // Redirect to frontend dashboard with success flag
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}?gmail_connected=true`);
  } catch (error) {
    console.error('Google Callback Error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}?gmail_error=${encodeURIComponent(error.message)}`);
  }
};

/**
 * Get Gmail Connection Status
 * GET /api/gmail/status
 */
export const getStatus = async (req, res) => {
  const userId = req.user?._id || 'user_demo_123';
  const dbStatus = getDBStatus();

  try {
    if (dbStatus.connected) {
      const account = await GmailAccount.findOne({ userId });
      if (account) {
        return res.json({
          success: true,
          data: {
            isConnected: account.isConnected,
            email: account.email,
            lastSyncedAt: account.lastSyncedAt,
            isLiveOAuth: true
          }
        });
      }
    }

    // Return mock store connection status
    const mockAcc = mockStore.gmailAccounts[0];
    res.json({
      success: true,
      data: {
        isConnected: mockAcc.isConnected,
        email: mockAcc.email,
        lastSyncedAt: mockAcc.lastSyncedAt,
        isLiveOAuth: false,
        isDemoAccount: true
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Toggle Simulator / Connect Demo Account
 * POST /api/gmail/simulate-connect
 */
export const simulateConnect = async (req, res) => {
  const { connected = true } = req.body;
  mockStore.gmailAccounts[0].isConnected = connected;
  mockStore.gmailAccounts[0].lastSyncedAt = new Date().toISOString();

  res.json({
    success: true,
    data: mockStore.gmailAccounts[0]
  });
};

/**
 * Disconnect Gmail
 * POST /api/gmail/disconnect
 */
export const disconnect = async (req, res) => {
  const userId = req.user?._id || 'user_demo_123';
  const dbStatus = getDBStatus();

  if (dbStatus.connected) {
    await GmailAccount.findOneAndUpdate({ userId }, { isConnected: false });
  }

  mockStore.gmailAccounts[0].isConnected = false;
  res.json({ success: true, message: 'Gmail disconnected successfully' });
};
