import FreelanceProject from '../models/FreelanceProject.js';
import Proposal from '../models/Proposal.js';
import { createNotification } from '../services/notificationService.js';

export const getProjects = async (req, res, next) => {
  try {
    const { category, search, minBudget, maxBudget, sort = '-createdAt', page = 1, limit = 12 } = req.query;
    const filter = { status: 'open' };

    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };
    if (minBudget || maxBudget) {
      filter.budgetMin = {};
      if (minBudget) filter.budgetMin.$gte = Number(minBudget);
      if (maxBudget) filter.budgetMin.$lte = Number(maxBudget);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [projects, total] = await Promise.all([
      FreelanceProject.find(filter)
        .populate('client', 'name username')
        .sort(sort).skip(skip).limit(Number(limit)),
      FreelanceProject.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: { projects, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await FreelanceProject.findById(req.params.id).populate('client', 'name username avatar');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    await FreelanceProject.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    let userProposal = null;
    if (req.user && req.user.role === 'student') {
      userProposal = await Proposal.findOne({ project: project._id, student: req.user._id });
    }

    res.json({ success: true, data: { project, userProposal } });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await FreelanceProject.create({ ...req.body, client: req.user._id });
    res.status(201).json({ success: true, data: { project } });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await FreelanceProject.findOne({ _id: req.params.id, client: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });

    const allowedStatusTransitions = { open: ['paused', 'cancelled'], paused: ['open', 'cancelled'], in_progress: ['completed', 'cancelled'] };
    if (req.body.status && req.body.status !== project.status) {
      const allowed = allowedStatusTransitions[project.status] || [];
      if (!allowed.includes(req.body.status)) {
        return res.status(400).json({ success: false, message: `Cannot transition from ${project.status} to ${req.body.status}` });
      }
    }

    Object.assign(project, req.body);
    await project.save();

    res.json({ success: true, data: { project } });
  } catch (error) {
    next(error);
  }
};

export const getClientProjects = async (req, res, next) => {
  try {
    const projects = await FreelanceProject.find({ client: req.user._id }).sort('-createdAt');
    res.json({ success: true, data: { projects } });
  } catch (error) {
    next(error);
  }
};

export const submitProposal = async (req, res, next) => {
  try {
    const project = await FreelanceProject.findById(req.params.id);
    if (!project || project.status !== 'open') {
      return res.status(404).json({ success: false, message: 'Project not found or not accepting proposals' });
    }

    const existing = await Proposal.findOne({ project: project._id, student: req.user._id, status: { $ne: 'withdrawn' } });
    if (existing) return res.status(409).json({ success: false, message: 'You already have an active proposal for this project' });

    const proposal = await Proposal.create({ ...req.body, project: project._id, student: req.user._id });
    await FreelanceProject.findByIdAndUpdate(project._id, { $inc: { proposalCount: 1 } });

    // Notify client
    await createNotification({
      userId: project.client,
      type: 'proposal_received',
      title: 'New Proposal Received',
      message: `${req.user.name} submitted a proposal for "${project.title}"`,
      link: `/client/proposals`,
    });

    res.status(201).json({ success: true, data: { proposal } });
  } catch (error) {
    next(error);
  }
};

export const getMyProposals = async (req, res, next) => {
  try {
    const proposals = await Proposal.find({ student: req.user._id })
      .populate('project', 'title category status client budgetMin budgetMax')
      .sort('-createdAt');
    res.json({ success: true, data: { proposals } });
  } catch (error) {
    next(error);
  }
};

export const withdrawProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findOne({ _id: req.params.id, student: req.user._id });
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });
    if (proposal.status !== 'pending') return res.status(400).json({ success: false, message: 'Cannot withdraw this proposal' });

    proposal.status = 'withdrawn';
    await proposal.save();
    res.json({ success: true, message: 'Proposal withdrawn' });
  } catch (error) {
    next(error);
  }
};

export const getProjectProposals = async (req, res, next) => {
  try {
    const project = await FreelanceProject.findOne({ _id: req.params.id, client: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });

    const proposals = await Proposal.find({ project: project._id })
      .populate('student', 'name username avatar')
      .sort('-createdAt');

    res.json({ success: true, data: { proposals, project } });
  } catch (error) {
    next(error);
  }
};

export const decideProposal = async (req, res, next) => {
  try {
    const { decision, clientNote } = req.body; // 'accepted' or 'rejected'
    if (!['accepted', 'rejected'].includes(decision)) {
      return res.status(400).json({ success: false, message: 'Decision must be accepted or rejected' });
    }

    const proposal = await Proposal.findById(req.params.id).populate('project');
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });
    if (String(proposal.project.client) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    if (proposal.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Proposal already decided' });
    }

    proposal.status = decision;
    proposal.clientNote = clientNote || '';
    proposal.decidedAt = new Date();
    await proposal.save();

    if (decision === 'accepted') {
      await FreelanceProject.findByIdAndUpdate(proposal.project._id, { status: 'in_progress' });
    }

    await createNotification({
      userId: proposal.student,
      type: decision === 'accepted' ? 'proposal_accepted' : 'proposal_rejected',
      title: decision === 'accepted' ? 'Proposal Accepted! 🎉' : 'Proposal Update',
      message: decision === 'accepted'
        ? `Your proposal for "${proposal.project.title}" has been accepted!`
        : `Your proposal for "${proposal.project.title}" was not selected this time.`,
      link: `/student/proposals`,
    });

    res.json({ success: true, data: { proposal } });
  } catch (error) {
    next(error);
  }
};

export const getClientProposals = async (req, res, next) => {
  try {
    const clientProjects = await FreelanceProject.find({ client: req.user._id }).select('_id');
    const projectIds = clientProjects.map(p => p._id);
    const proposals = await Proposal.find({ project: { $in: projectIds } })
      .populate('student', 'name username avatar')
      .populate('project', 'title status')
      .sort('-createdAt');
    res.json({ success: true, data: { proposals } });
  } catch (error) {
    next(error);
  }
};
