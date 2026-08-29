import express from 'express';
import {
  getEmails,
  getEmailById,
  toggleRead,
  toggleStar,
  archiveEmail,
  deleteEmail,
  sendEmail,
  saveDraft
} from '../controllers/email.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getEmails);
router.get('/:id', protect, getEmailById);
router.patch('/:id/read', protect, toggleRead);
router.patch('/:id/star', protect, toggleStar);
router.patch('/:id/archive', protect, archiveEmail);
router.delete('/:id', protect, deleteEmail);
router.post('/send', protect, sendEmail);
router.post('/draft', protect, saveDraft);

export default router;
