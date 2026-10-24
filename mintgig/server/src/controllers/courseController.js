import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

export const getCourses = async (req, res, next) => {
  try {
    const { category, level, search, minPrice, maxPrice, sort = '-createdAt', page = 1, limit = 12 } = req.query;
    const filter = { status: 'published' };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.$text = { $search: search };
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [courses, total] = await Promise.all([
      Course.find(filter).sort(sort).skip(skip).limit(Number(limit)).select('-lessons.content -quiz'),
      Course.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: { courses, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, status: 'published' }).select('-quiz.questions.correctIndex');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    let enrolled = false;
    let enrollment = null;
    if (req.user && req.user.role === 'student') {
      enrollment = await Enrollment.findOne({ student: req.user._id, course: course._id });
      enrolled = !!enrollment;
    }

    res.json({ success: true, data: { course, enrolled, enrollment } });
  } catch (error) {
    next(error);
  }
};

export const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || course.status !== 'published') {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    if (course.price > 0) {
      return res.status(402).json({ success: false, message: 'Payment processing is not implemented in MVP. This course requires payment.' });
    }

    const existing = await Enrollment.findOne({ student: req.user._id, course: course._id });
    if (existing) return res.status(409).json({ success: false, message: 'Already enrolled in this course' });

    const enrollment = await Enrollment.create({ student: req.user._id, course: course._id });
    await Course.findByIdAndUpdate(course._id, { $inc: { enrollmentCount: 1 } });

    const { createNotification } = await import('../services/notificationService.js');
    await createNotification({
      userId: req.user._id,
      type: 'enrollment',
      title: 'Course Enrolled!',
      message: `You have successfully enrolled in "${course.title}"`,
      link: `/student/learn/${course._id}`,
    });

    res.status(201).json({ success: true, message: 'Enrolled successfully', data: { enrollment } });
  } catch (error) {
    next(error);
  }
};

export const getLearnCourse = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.id });
    if (!enrollment) return res.status(403).json({ success: false, message: 'Not enrolled in this course' });

    const course = await Course.findById(req.params.id).select('-quiz.questions.correctIndex');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    res.json({ success: true, data: { course, enrollment } });
  } catch (error) {
    next(error);
  }
};

export const markLessonComplete = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) return res.status(403).json({ success: false, message: 'Not enrolled' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const lessonExists = course.lessons.id(lessonId);
    if (!lessonExists) return res.status(404).json({ success: false, message: 'Lesson not found' });

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const totalLessons = course.lessons.length;
    enrollment.progressPercent = totalLessons > 0
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100) : 0;
    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    res.json({ success: true, data: { enrollment } });
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { answers } = req.body; // array of selected option indices

    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) return res.status(403).json({ success: false, message: 'Not enrolled' });

    const course = await Course.findById(courseId);
    if (!course || !course.quiz || !course.quiz.questions.length) {
      return res.status(404).json({ success: false, message: 'Quiz not found for this course' });
    }

    // Check completion threshold
    const thresholdMet = enrollment.progressPercent >= (course.completionThreshold || 80);
    if (!thresholdMet) {
      return res.status(400).json({ success: false, message: `You need to complete at least ${course.completionThreshold}% of lessons before taking the quiz` });
    }

    const questions = course.quiz.questions;
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= (course.quiz.passingScore || 70);

    enrollment.quizScore = score;
    enrollment.quizPassed = passed;
    enrollment.quizAttempts += 1;

    if (passed && enrollment.status !== 'completed') {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date();
      enrollment.progressPercent = 100;

      const { createNotification } = await import('../services/notificationService.js');
      await createNotification({
        userId: req.user._id,
        type: 'course_complete',
        title: 'Course Completed!',
        message: `Congratulations! You completed "${course.title}" with ${score}%`,
        link: `/student/certificates`,
      });

      // Issue certificate if eligible
      if (course.certificateEligible && !enrollment.certificateIssued) {
        const { issueCertificate } = await import('../services/certificateService.js');
        await issueCertificate({ userId: req.user._id, courseId, enrollmentId: enrollment._id, score });
        enrollment.certificateIssued = true;
      }
    }

    await enrollment.save();

    res.json({
      success: true,
      data: { score, passed, correct, total: questions.length, quizAttempts: enrollment.quizAttempts },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title slug thumbnail category level duration instructor')
      .sort('-lastAccessedAt');
    res.json({ success: true, data: { enrollments } });
  } catch (error) {
    next(error);
  }
};

// Admin controllers
export const adminCreateCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: { course } });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: { course } });
  } catch (error) {
    next(error);
  }
};

export const adminGetCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort('-createdAt');
    res.json({ success: true, data: { courses } });
  } catch (error) {
    next(error);
  }
};
