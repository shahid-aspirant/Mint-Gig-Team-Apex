import Certificate from '../models/Certificate.js';
import Enrollment from '../models/Enrollment.js';
import { createNotification } from './notificationService.js';

export const issueCertificate = async ({ userId, courseId, enrollmentId, score }) => {
  try {
    const existing = await Certificate.findOne({ student: userId, course: courseId });
    if (existing) return existing;

    const cert = await Certificate.create({
      student: userId,
      course: courseId,
      enrollment: enrollmentId,
      quizScore: score,
    });

    await createNotification({
      userId,
      type: 'certificate_issued',
      title: 'Certificate Earned! 🎓',
      message: 'Your certificate has been issued. View it in your portfolio.',
      link: `/student/certificates`,
    });

    return cert;
  } catch (err) {
    console.error('Certificate issuance error:', err.message);
    return null;
  }
};
