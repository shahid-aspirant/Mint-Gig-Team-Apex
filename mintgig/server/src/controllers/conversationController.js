import Conversation from '../models/Conversation.js';
import FreelanceProject from '../models/FreelanceProject.js';
import { createNotification } from '../services/notificationService.js';

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name username avatar role')
      .populate('project', 'title status client')
      .sort('-lastMessageAt');
    res.json({ success: true, data: { conversations } });
  } catch (error) {
    next(error);
  }
};

export const getConversationById = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user._id,
    })
      .populate('participants', 'name username avatar role')
      .populate('project', 'title status client')
      .populate('messages.sender', 'name username avatar');

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found or unauthorized' });
    }

    // Mark unread messages sent by others as read
    let updated = false;
    conversation.messages.forEach(msg => {
      if (String(msg.sender._id || msg.sender) !== String(req.user._id) && !msg.readAt) {
        msg.readAt = new Date();
        updated = true;
      }
    });
    if (updated) {
      await conversation.save();
    }

    res.json({ success: true, data: { conversation } });
  } catch (error) {
    next(error);
  }
};

export const getOrCreateConversation = async (req, res, next) => {
  try {
    const { projectId, recipientId } = req.body;

    const project = await FreelanceProject.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check participants: one must be project client or proposal student
    const isClient = String(project.client) === String(req.user._id);
    const targetUserId = isClient ? recipientId : project.client;

    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'Recipient is required' });
    }

    let conversation = await Conversation.findOne({
      project: projectId,
      participants: { $all: [req.user._id, targetUserId] },
    }).populate('participants', 'name username avatar role');

    if (!conversation) {
      conversation = await Conversation.create({
        project: projectId,
        participants: [req.user._id, targetUserId],
        messages: [],
      });
      conversation = await conversation.populate('participants', 'name username avatar role');
    }

    res.json({ success: true, data: { conversation } });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found or unauthorized' });
    }

    const newMessage = {
      sender: req.user._id,
      content: content.trim(),
    };

    conversation.messages.push(newMessage);
    conversation.lastMessageAt = new Date();
    conversation.lastMessage = content.trim().slice(0, 100);
    await conversation.save();

    // Notify other participants
    const otherParticipants = conversation.participants.filter(
      p => String(p) !== String(req.user._id)
    );

    for (const recipientId of otherParticipants) {
      await createNotification({
        userId: recipientId,
        type: 'new_message',
        title: `New message from ${req.user.name}`,
        message: content.trim().length > 60 ? `${content.trim().slice(0, 60)}...` : content.trim(),
        link: req.user.role === 'student' ? '/student/messages' : '/client/messages',
      });
    }

    const updated = await Conversation.findById(conversation._id)
      .populate('participants', 'name username avatar role')
      .populate('messages.sender', 'name username avatar');

    res.status(201).json({ success: true, data: { conversation: updated } });
  } catch (error) {
    next(error);
  }
};
