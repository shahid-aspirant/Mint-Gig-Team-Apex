import express from 'express';
import {
  getDashboardMetrics,
  getUsers,
  updateUserStatus,
  getModerationProjects,
  updateProjectStatus,
  getAllEnrollments,
} from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

router.get('/metrics', getDashboardMetrics);
router.get('/users', getUsers);
router.put('/users/:id', updateUserStatus);
router.get('/projects', getModerationProjects);
router.put('/projects/:id/status', updateProjectStatus);
router.get('/enrollments', getAllEnrollments);

export default router;
