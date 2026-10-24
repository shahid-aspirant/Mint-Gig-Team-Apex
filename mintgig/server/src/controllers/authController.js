import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import ClientProfile from '../models/ClientProfile.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

const sendTokenCookie = (res, token) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  res.cookie('token', token, options);
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, username, adminSetupKey } = req.body;

    // Prevent self-promotion to admin
    let assignedRole = role;
    if (role === 'admin') {
      if (!adminSetupKey || adminSetupKey !== process.env.ADMIN_SETUP_KEY) {
        return res.status(403).json({ success: false, message: 'Admin registration requires a valid setup key' });
      }
      assignedRole = 'admin';
    } else if (!['student', 'client'].includes(role)) {
      assignedRole = 'student';
    }

    // Check username uniqueness
    if (username) {
      const usernameExists = await User.findOne({ username: username.toLowerCase() });
      if (usernameExists) {
        return res.status(409).json({ success: false, message: 'Username already taken' });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      username: username ? username.toLowerCase() : undefined,
    });

    // Create role-specific profile
    if (assignedRole === 'student') {
      await StudentProfile.create({ user: user._id });
    } else if (assignedRole === 'client') {
      await ClientProfile.create({ user: user._id });
    }

    const token = signToken(user._id);
    sendTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user: user.toPublicJSON(), token },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);
    sendTokenCookie(res, token);

    res.json({
      success: true,
      message: 'Login successful',
      data: { user: user.toPublicJSON(), token },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0), sameSite: 'strict' });
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    let profile = null;

    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id });
    } else if (user.role === 'client') {
      profile = await ClientProfile.findOne({ user: user._id });
    }

    res.json({ success: true, data: { user, profile } });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    // Update user basic info
    const allowedUserFields = ['name', 'avatar'];
    const userUpdates = {};
    allowedUserFields.forEach(f => { if (req.body[f] !== undefined) userUpdates[f] = req.body[f]; });

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(userId, userUpdates);
    }

    let profile;
    if (role === 'student') {
      const allowed = ['headline', 'bio', 'skills', 'location', 'website', 'github', 'linkedin', 'isPortfolioPublic', 'availableForHire'];
      const updates = {};
      allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
      profile = await StudentProfile.findOneAndUpdate({ user: userId }, updates, { new: true, runValidators: true });
    } else if (role === 'client') {
      const allowed = ['companyName', 'companySize', 'industry', 'bio', 'website', 'location'];
      const updates = {};
      allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
      profile = await ClientProfile.findOneAndUpdate({ user: userId }, updates, { new: true, runValidators: true });
    }

    const updatedUser = await User.findById(userId);
    res.json({ success: true, message: 'Profile updated', data: { user: updatedUser, profile } });
  } catch (error) {
    next(error);
  }
};
