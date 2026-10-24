import express from 'express';
import { body } from 'express-validator';
import {
  getConversations,
  getConversationById,
  getOrCreateConversation,
  sendMessage,
} from '../controllers/conversationController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getConversations);
router.post(
  '/',
  [
    body('projectId').notEmpty().withMessage('Project ID is required'),
    validate,
  ],
  getOrCreateConversation
);
router.get('/:id', getConversationById);
router.post(
  '/:id/messages',
  [
    body('content').trim().notEmpty().withMessage('Message content cannot be empty'),
    validate,
  ],
  sendMessage
);

export default router;
