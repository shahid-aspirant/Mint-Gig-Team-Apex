import express from 'express';
import {
  getMyCertificates,
  verifyCertificate,
  adminRevokeCertificate,
  adminGetCertificates,
} from '../controllers/certificateController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public verification
router.get('/verify/:certificateId', verifyCertificate);

// Student
router.get('/my', requireAuth, requireRole('student'), getMyCertificates);

// Admin
router.get('/admin/all', requireAuth, requireRole('admin'), adminGetCertificates);
router.put('/admin/:id/revoke', requireAuth, requireRole('admin'), adminRevokeCertificate);

export default router;
