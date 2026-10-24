import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Certificate from '../models/Certificate.js';
import FreelanceProject from '../models/FreelanceProject.js';
import Proposal from '../models/Proposal.js';

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalClients,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      completedEnrollments,
      totalCertificates,
      totalProjects,
      openProjects,
      totalProposals,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'client' }),
      Course.countDocuments(),
      Course.countDocuments({ status: 'published' }),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: 'completed' }),
      Certificate.countDocuments({ status: 'active' }),
      FreelanceProject.countDocuments(),
      FreelanceProject.countDocuments({ status: 'open' }),
      Proposal.countDocuments(),
    ]);

    // Recent activity
    const [recentUsers, recentEnrollments, recentProjects] = await Promise.all([
      User.find().sort('-createdAt').limit(5).select('name email role createdAt isActive'),
      Enrollment.find()
        .populate('student', 'name email username')
        .populate('course', 'title')
        .sort('-createdAt')
        .limit(5),
      FreelanceProject.find()
        .populate('client', 'name username')
        .sort('-createdAt')
        .limit(5),
    ]);

    res.json({
      success: true,
      data: {
        metrics: {
          totalUsers,
          totalStudents,
          totalClients,
          totalCourses,
          publishedCourses,
          totalEnrollments,
          completedEnrollments,
          totalCertificates,
          totalProjects,
          openProjects,
          totalProposals,
        },
        recentUsers,
        recentEnrollments,
        recentProjects,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).select('-password'),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: { users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive, role } = req.body;
    const updates = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (role && ['student', 'client', 'admin'].includes(role)) updates.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const getModerationProjects = async (req, res, next) => {
  try {
    const projects = await FreelanceProject.find()
      .populate('client', 'name email username')
      .sort('-createdAt');
    res.json({ success: true, data: { projects } });
  } catch (error) {
    next(error);
  }
};

export const updateProjectStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['open', 'in_progress', 'completed', 'cancelled', 'paused'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const project = await FreelanceProject.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('client', 'name email username');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: { project } });
  } catch (error) {
    next(error);
  }
};

export const getAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email username')
      .populate('course', 'title category level')
      .sort('-createdAt');
    res.json({ success: true, data: { enrollments } });
  } catch (error) {
    next(error);
  }
};
