import express from 'express';
import { body } from 'express-validator';
import {
  getPublicPortfolio,
  getMyPortfolio,
  addPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
} from '../controllers/portfolioController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Public portfolio route
router.get('/user/:username', getPublicPortfolio);

// Student personal portfolio routes
router.get('/me', requireAuth, requireRole('student'), getMyPortfolio);
router.post(
  '/projects',
  requireAuth,
  requireRole('student'),
  [
    body('title').trim().notEmpty().withMessage('Project title is required'),
    validate,
  ],
  addPortfolioProject
);
router.put('/projects/:projectId', requireAuth, requireRole('student'), updatePortfolioProject);
router.delete('/projects/:projectId', requireAuth, requireRole('student'), deletePortfolioProject);

export default router;
