const messageService = require('../services/message.service');
const { successResponse } = require('../utils/response');

/**
 * Message Controller
 * Handles chat/messaging operations
 */

/**
 * Send a message
 */
const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { recipient_id, content } = req.body;

    const message = await messageService.sendMessage(senderId, recipient_id, content);

    return res.status(201).json(
      successResponse(message, 'Message sent successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get conversation with a specific user
 */
const getConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;
    const { page = 1, limit = 50 } = req.query;

    const result = await messageService.getConversation(userId, otherUserId, { page, limit });

    return res.json(
      successResponse(result, 'Conversation retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all conversations
 */
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const result = await messageService.getConversations(userId, { page, limit });

    return res.json(
      successResponse(result, 'Conversations retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread message count
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await messageService.getUnreadCount(userId);

    return res.json(
      successResponse(result, 'Unread count retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Mark messages as read
 */
const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const senderId = req.params.senderId;

    await messageService.markAsRead(userId, senderId);

    return res.json(
      successResponse(null, 'Messages marked as read')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a message
 */
const deleteMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const messageId = req.params.messageId;

    await messageService.deleteMessage(messageId, userId);

    return res.json(
      successResponse(null, 'Message deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  getUnreadCount,
  markAsRead,
  deleteMessage
};
