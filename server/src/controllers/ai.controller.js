import {
  summarizeEmail,
  generateReply,
  classifyEmail,
  extractActionItems,
  explainEmail,
  rewriteEmailDraft
} from '../services/ai.service.js';
import { mockStore } from '../config/mockStore.js';
import { AIHistory } from '../models/AIHistory.js';
import { EmailActivity } from '../models/EmailActivity.js';
import { getDBStatus } from '../config/db.js';

/**
 * Summarize Email
 * POST /api/ai/summarize
 */
export const handleSummarize = async (req, res) => {
  try {
    const { emailId, subject = '', body = '' } = req.body;
    if (!body && !subject) {
      return res.status(400).json({ success: false, message: 'Subject or body required' });
    }

    const summary = await summarizeEmail(subject, body);
    const userId = req.user?._id || 'user_demo_123';

    // Log Activity
    mockStore.activities.unshift({
      _id: `act_${Date.now()}`,
      userId,
      action: 'SUMMARY_GENERATED',
      emailId,
      metadata: { subject },
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: {
        emailId,
        summary
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Generate AI Reply
 * POST /api/ai/reply
 */
export const handleGenerateReply = async (req, res) => {
  try {
    const { emailId, subject = '', body = '', sender, tone = 'Professional', userNotes = '' } = req.body;

    const reply = await generateReply({
      subject,
      body,
      sender,
      tone,
      userNotes
    });

    const userId = req.user?._id || 'user_demo_123';
    mockStore.activities.unshift({
      _id: `act_${Date.now()}`,
      userId,
      action: 'REPLY_GENERATED',
      emailId,
      metadata: { tone, subject },
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: {
        emailId,
        reply,
        tone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Classify Email Category & Priority
 * POST /api/ai/classify
 */
export const handleClassify = async (req, res) => {
  try {
    const { emailId, subject = '', body = '' } = req.body;
    const classification = await classifyEmail(subject, body);

    res.json({
      success: true,
      data: {
        emailId,
        ...classification
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Extract Action Items & Deadlines
 * POST /api/ai/action-items
 */
export const handleActionItems = async (req, res) => {
  try {
    const { emailId, subject = '', body = '' } = req.body;
    const actionItems = await extractActionItems(subject, body);

    res.json({
      success: true,
      data: {
        emailId,
        actionItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Explain Email in Plain English (ELI5)
 * POST /api/ai/explain
 */
export const handleExplain = async (req, res) => {
  try {
    const { emailId, subject = '', body = '' } = req.body;
    const explanation = await explainEmail(subject, body);

    res.json({
      success: true,
      data: {
        emailId,
        explanation
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Rewrite / Polish Draft
 * POST /api/ai/rewrite
 */
export const handleRewrite = async (req, res) => {
  try {
    const { draftText = '', tone = 'Professional', instruction = '' } = req.body;
    const polished = await rewriteEmailDraft(draftText, tone, instruction);

    res.json({
      success: true,
      data: {
        polished
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
