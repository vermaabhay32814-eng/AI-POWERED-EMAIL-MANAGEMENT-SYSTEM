import express from 'express';
import { connectGmail, googleCallback, getStatus, simulateConnect, disconnect } from '../controllers/gmail.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/connect', protect, connectGmail);
router.get('/callback', googleCallback);
router.get('/status', protect, getStatus);
router.post('/simulate-connect', protect, simulateConnect);
router.post('/disconnect', protect, disconnect);

export default router;
