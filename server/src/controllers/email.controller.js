import { mockStore } from '../config/mockStore.js';
import { Email } from '../models/Email.js';
import { EmailActivity } from '../models/EmailActivity.js';
import { sendEmailMessage } from '../services/gmail.service.js';
import { getDBStatus } from '../config/db.js';

/**
 * Get emails with filtering
 * GET /api/emails
 */
export const getEmails = async (req, res) => {
  try {
    const { folder = 'inbox', category, priority, search } = req.query;
    const userId = req.user?._id || 'user_demo_123';
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const query = { userId };

      if (folder === 'starred') {
        query.isStarred = true;
        query.isTrash = false;
      } else if (folder === 'trash') {
        query.isTrash = true;
      } else if (folder === 'archive') {
        query.isArchived = true;
        query.isTrash = false;
      } else {
        query.folder = folder;
        query.isTrash = false;
        query.isArchived = false;
      }

      if (category && category !== 'All') {
        query.category = category;
      }
      if (priority && priority !== 'All') {
        query.priority = priority;
      }
      if (search) {
        query.$or = [
          { subject: { $regex: search, $options: 'i' } },
          { snippet: { $regex: search, $options: 'i' } },
          { 'from.name': { $regex: search, $options: 'i' } },
          { 'from.email': { $regex: search, $options: 'i' } }
        ];
      }

      const emails = await Email.find(query).sort({ date: -1 });
      if (emails.length > 0) {
        return res.json({ success: true, count: emails.length, data: emails });
      }
    }

    // In-memory mock filter
    let results = [...mockStore.emails];

    if (folder === 'starred') {
      results = results.filter(e => e.isStarred && !e.isTrash);
    } else if (folder === 'trash') {
      results = results.filter(e => e.isTrash);
    } else if (folder === 'archive') {
      results = results.filter(e => e.isArchived && !e.isTrash);
    } else {
      results = results.filter(e => e.folder === folder && !e.isTrash && !e.isArchived);
    }

    if (category && category !== 'All') {
      results = results.filter(e => e.category?.toLowerCase() === category.toLowerCase());
    }

    if (priority && priority !== 'All') {
      results = results.filter(e => e.priority?.toLowerCase() === priority.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(e => 
        e.subject?.toLowerCase().includes(q) ||
        e.snippet?.toLowerCase().includes(q) ||
        e.body?.toLowerCase().includes(q) ||
        e.from?.name?.toLowerCase().includes(q) ||
        e.from?.email?.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get email by ID
 * GET /api/emails/:id
 */
export const getEmailById = async (req, res) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const email = await Email.findById(id);
      if (email) {
        email.isRead = true;
        await email.save();
        return res.json({ success: true, data: email });
      }
    }

    const mockEmail = mockStore.emails.find(e => e._id === id || e.messageId === id);
    if (!mockEmail) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    mockEmail.isRead = true;
    res.json({ success: true, data: mockEmail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Toggle Read Status
 * PATCH /api/emails/:id/read
 */
export const toggleRead = async (req, res) => {
  const { id } = req.params;
  const dbStatus = getDBStatus();

  if (dbStatus.connected) {
    const email = await Email.findById(id);
    if (email) {
      email.isRead = !email.isRead;
      await email.save();
      return res.json({ success: true, data: email });
    }
  }

  const mock = mockStore.emails.find(e => e._id === id);
  if (mock) {
    mock.isRead = !mock.isRead;
    return res.json({ success: true, data: mock });
  }

  res.status(404).json({ success: false, message: 'Email not found' });
};

/**
 * Toggle Star Status
 * PATCH /api/emails/:id/star
 */
export const toggleStar = async (req, res) => {
  const { id } = req.params;
  const dbStatus = getDBStatus();

  if (dbStatus.connected) {
    const email = await Email.findById(id);
    if (email) {
      email.isStarred = !email.isStarred;
      await email.save();
      return res.json({ success: true, data: email });
    }
  }

  const mock = mockStore.emails.find(e => e._id === id);
  if (mock) {
    mock.isStarred = !mock.isStarred;
    return res.json({ success: true, data: mock });
  }

  res.status(404).json({ success: false, message: 'Email not found' });
};

/**
 * Archive Email
 * PATCH /api/emails/:id/archive
 */
export const archiveEmail = async (req, res) => {
  const { id } = req.params;
  const dbStatus = getDBStatus();

  if (dbStatus.connected) {
    const email = await Email.findByIdAndUpdate(id, { isArchived: true }, { new: true });
    if (email) return res.json({ success: true, data: email });
  }

  const mock = mockStore.emails.find(e => e._id === id);
  if (mock) {
    mock.isArchived = true;
    return res.json({ success: true, data: mock });
  }

  res.status(404).json({ success: false, message: 'Email not found' });
};

/**
 * Move to Trash / Delete
 * DELETE /api/emails/:id
 */
export const deleteEmail = async (req, res) => {
  const { id } = req.params;
  const dbStatus = getDBStatus();

  if (dbStatus.connected) {
    const email = await Email.findById(id);
    if (email) {
      if (email.isTrash) {
        await Email.findByIdAndDelete(id);
      } else {
        email.isTrash = true;
        await email.save();
      }
      return res.json({ success: true, message: 'Email deleted/moved to trash' });
    }
  }

  const mockIndex = mockStore.emails.findIndex(e => e._id === id);
  if (mockIndex !== -1) {
    if (mockStore.emails[mockIndex].isTrash) {
      mockStore.emails.splice(mockIndex, 1);
    } else {
      mockStore.emails[mockIndex].isTrash = true;
    }
    return res.json({ success: true, message: 'Email deleted/moved to trash' });
  }

  res.status(404).json({ success: false, message: 'Email not found' });
};

/**
 * Send Email
 * POST /api/emails/send
 */
export const sendEmail = async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    if (!to || !body) {
      return res.status(400).json({ success: false, message: 'Recipient and body are required' });
    }

    const email = await sendEmailMessage({
      userId: req.user?._id,
      to,
      subject,
      body
    });

    mockStore.activities.unshift({
      _id: `act_${Date.now()}`,
      userId: req.user?._id || 'user_demo_123',
      action: 'EMAIL_SENT',
      emailId: email._id,
      metadata: { to, subject },
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Email sent successfully',
      data: email
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Save Draft
 * POST /api/emails/draft
 */
export const saveDraft = async (req, res) => {
  const { to, subject, body } = req.body;
  const draft = {
    _id: `em_draft_${Date.now()}`,
    userId: req.user?._id || 'user_demo_123',
    messageId: `msg_draft_${Date.now()}`,
    from: { name: 'Abhay Verma', email: 'abhay.verma.dev@gmail.com' },
    to: to ? [{ name: to, email: to }] : [],
    subject: subject || '(Draft - No Subject)',
    snippet: body ? body.slice(0, 100) : '',
    body: body || '',
    date: new Date().toISOString(),
    isRead: true,
    isStarred: false,
    isArchived: false,
    isTrash: false,
    folder: 'drafts',
    category: 'Work',
    priority: 'Low',
    summary: 'Draft message'
  };

  mockStore.emails.unshift(draft);
  res.status(201).json({ success: true, data: draft });
};
