import express from 'express';
import { body } from 'express-validator';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  getClientProjects,
  submitProposal,
  getMyProposals,
  withdrawProposal,
  getProjectProposals,
  decideProposal,
  getClientProposals,
} from '../controllers/projectController.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Public browse
router.get('/', getProjects);
router.get('/my/proposals', requireAuth, requireRole('student'), getMyProposals);
router.get('/client/my', requireAuth, requireRole('client'), getClientProjects);
router.get('/client/all-proposals', requireAuth, requireRole('client'), getClientProposals);
router.get('/:id', optionalAuth, getProjectById);

// Student proposals
router.post(
  '/:id/proposals',
  requireAuth,
  requireRole('student'),
  [
    body('coverMessage').trim().isLength({ min: 20 }).withMessage('Cover message must be at least 20 characters'),
    body('proposedBudget').isNumeric().withMessage('Valid proposed budget required'),
    body('estimatedDays').isInt({ min: 1 }).withMessage('Estimated delivery timeline required in days'),
    validate,
  ],
  submitProposal
);
router.put('/proposals/:id/withdraw', requireAuth, requireRole('student'), withdrawProposal);

// Client project management
router.post(
  '/',
  requireAuth,
  requireRole('client'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().isLength({ min: 30 }).withMessage('Description must be at least 30 characters'),
    body('category').notEmpty().withMessage('Category is required'),
    body('budgetMin').isNumeric().withMessage('Minimum budget is required'),
    body('budgetMax').isNumeric().withMessage('Maximum budget is required'),
    validate,
  ],
  createProject
);
router.put('/:id', requireAuth, requireRole('client'), updateProject);
router.get('/:id/proposals', requireAuth, requireRole('client'), getProjectProposals);
router.put(
  '/proposals/:id/decide',
  requireAuth,
  requireRole('client'),
  [
    body('decision').isIn(['accepted', 'rejected']).withMessage('Decision must be accepted or rejected'),
    validate,
  ],
  decideProposal
);

export default router;
