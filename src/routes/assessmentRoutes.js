import express from 'express';
import { createAssessmentAndRoadmap } from '../controllers/assessmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This single endpoint handles creating the assessment and generating the roadmap
router.post('/', protect, createAssessmentAndRoadmap);

export default router;