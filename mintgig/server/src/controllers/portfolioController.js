import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Certificate from '../models/Certificate.js';
import Enrollment from '../models/Enrollment.js';

export const getPublicPortfolio = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username, role: 'student', isActive: true });
    if (!user) return res.status(404).json({ success: false, message: 'Portfolio not found' });

    const profile = await StudentProfile.findOne({ user: user._id });
    if (!profile || !profile.isPortfolioPublic) {
      return res.status(404).json({ success: false, message: 'Portfolio not found or is private' });
    }

    const [completedEnrollments, certificates] = await Promise.all([
      Enrollment.find({ student: user._id, status: 'completed' })
        .populate('course', 'title category level thumbnail instructor skillTags'),
      Certificate.find({ student: user._id, status: 'active' })
        .populate('course', 'title category level instructor'),
    ]);

    res.json({
      success: true,
      data: {
        user: { name: user.name, username: user.username, avatar: user.avatar },
        profile,
        completedCourses: completedEnrollments.map(e => e.course),
        certificates,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPortfolio = async (req, res, next) => {
  try {
    const [profile, completedEnrollments, certificates] = await Promise.all([
      StudentProfile.findOne({ user: req.user._id }),
      Enrollment.find({ student: req.user._id, status: 'completed' })
        .populate('course', 'title category level thumbnail instructor skillTags'),
      Certificate.find({ student: req.user._id, status: 'active' })
        .populate('course', 'title category level instructor'),
    ]);

    res.json({
      success: true,
      data: {
        user: req.user,
        profile,
        completedCourses: completedEnrollments.map(e => e.course),
        certificates,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addPortfolioProject = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.portfolioProjects.push(req.body);
    await profile.save();

    res.status(201).json({ success: true, data: { profile } });
  } catch (error) {
    next(error);
  }
};

export const updatePortfolioProject = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    const project = profile.portfolioProjects.id(req.params.projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    Object.assign(project, req.body);
    await profile.save();

    res.json({ success: true, data: { profile } });
  } catch (error) {
    next(error);
  }
};

export const deletePortfolioProject = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.portfolioProjects.pull({ _id: req.params.projectId });
    await profile.save();

    res.json({ success: true, message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};
