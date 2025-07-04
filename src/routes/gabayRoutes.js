import express from 'express';
import { handleChat, getOpportunities, getDashboardData } from '../controllers/gabayController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', protect, handleChat);
router.post('/opportunities', protect, getOpportunities);
router.get('/dashboard', protect, getDashboardData);

export default router;