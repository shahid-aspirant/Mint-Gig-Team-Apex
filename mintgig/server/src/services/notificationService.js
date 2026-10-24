import Notification from '../models/Notification.js';

export const createNotification = async ({ userId, type, title, message, link = '', metadata = {} }) => {
  try {
    await Notification.create({ user: userId, type, title, message, link, metadata });
  } catch (err) {
    console.error('Notification creation error:', err.message);
  }
};

export const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ user: userId, isRead: false });
};
