import express from 'express';
import { body } from 'express-validator';
import {
  getCourses,
  getCourseById,
  enrollCourse,
  getLearnCourse,
  markLessonComplete,
  submitQuiz,
  getStudentEnrollments,
  adminCreateCourse,
  adminUpdateCourse,
  adminGetCourses,
} from '../controllers/courseController.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/my/enrollments', requireAuth, requireRole('student'), getStudentEnrollments);
router.get('/:id', optionalAuth, getCourseById);

// Student learning routes
router.post('/:id/enroll', requireAuth, requireRole('student'), enrollCourse);
router.get('/:id/learn', requireAuth, requireRole('student'), getLearnCourse);
router.post('/:courseId/lessons/:lessonId/complete', requireAuth, requireRole('student'), markLessonComplete);
router.post(
  '/:courseId/quiz/submit',
  requireAuth,
  requireRole('student'),
  [
    body('answers').isArray().withMessage('Answers array is required'),
    validate,
  ],
  submitQuiz
);

// Admin course management
router.get('/admin/all', requireAuth, requireRole('admin'), adminGetCourses);
router.post('/admin', requireAuth, requireRole('admin'), adminCreateCourse);
router.put('/admin/:id', requireAuth, requireRole('admin'), adminUpdateCourse);

export default router;
