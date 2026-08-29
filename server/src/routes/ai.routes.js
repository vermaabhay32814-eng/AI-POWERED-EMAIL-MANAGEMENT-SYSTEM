import express from 'express';
import {
  handleSummarize,
  handleGenerateReply,
  handleClassify,
  handleActionItems,
  handleExplain,
  handleRewrite
} from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/summarize', protect, handleSummarize);
router.post('/reply', protect, handleGenerateReply);
router.post('/classify', protect, handleClassify);
router.post('/action-items', protect, handleActionItems);
router.post('/explain', protect, handleExplain);
router.post('/rewrite', protect, handleRewrite);

export default router;
