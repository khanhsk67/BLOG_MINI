const { Message, User } = require('../models');
const { Op } = require('sequelize');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { validatePagination } = require('../utils/validators');

/**
 * Message Service
 * Business logic for chat/messaging operations
 */

/**
 * Send a message to another user
 */
const sendMessage = async (senderId, recipientId, content) => {
  // Validate input
  if (!senderId || !recipientId || !content) {
    throw new ValidationError('Sender ID, Recipient ID, and content are required');
  }

  // Cannot message yourself
  if (senderId === recipientId) {
    throw new ValidationError('You cannot send messages to yourself');
  }

  // Check if recipient exists
  const recipient = await User.findByPk(recipientId);
  if (!recipient) {
    throw new NotFoundError('Recipient not found');
  }

  // Create message
  const message = await Message.create({
    sender_id: senderId,
    recipient_id: recipientId,
    content: content.trim()
  });

  // Return message with user details
  const fullMessage = await Message.findByPk(message.id, {
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'display_name', 'avatar_url']
      },
      {
        model: User,
        as: 'recipient',
        attributes: ['id', 'username', 'display_name', 'avatar_url']
      }
    ]
  });

  return fullMessage;
};

/**
 * Get conversation between two users
 */
const getConversation = async (userId, otherUserId, options = {}) => {
  const { page, limit, offset } = validatePagination(options.page, options.limit);

  // Validate users exist
  const otherUser = await User.findByPk(otherUserId);
  if (!otherUser) {
    throw new NotFoundError('User not found');
  }

  // Get messages between these two users
  const { count, rows: messages } = await Message.findAndCountAll({
    where: {
      [Op.or]: [
        { sender_id: userId, recipient_id: otherUserId },
        { sender_id: otherUserId, recipient_id: userId }
      ]
    },
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'display_name', 'avatar_url']
      },
      {
        model: User,
        as: 'recipient',
        attributes: ['id', 'username', 'display_name', 'avatar_url']
      }
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset
  });

  // Mark messages as read (messages sent TO current user FROM other user)
  await Message.update(
    {
      is_read: true,
      read_at: new Date()
    },
    {
      where: {
        sender_id: otherUserId,
        recipient_id: userId,
        is_read: false
      }
    }
  );

  return {
    messages: messages.reverse(), // Show oldest first
    other_user: {
      id: otherUser.id,
      username: otherUser.username,
      display_name: otherUser.display_name,
      avatar_url: otherUser.avatar_url,
      bio: otherUser.bio
    },
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

/**
 * Get list of conversations (users you've chatted with)
 */
const getConversations = async (userId, options = {}) => {
  const { page = 1, limit = 20 } = options;

  // Get all unique users current user has chatted with
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        { sender_id: userId },
        { recipient_id: userId }
      ]
    },
    attributes: [
      'sender_id',
      'recipient_id',
      'content',
      'created_at',
      'is_read'
    ],
    order: [['created_at', 'DESC']]
  });

  // Group by conversation partner
  const conversationsMap = new Map();

  for (const message of messages) {
    const partnerId = message.sender_id === userId
      ? message.recipient_id
      : message.sender_id;

    if (!conversationsMap.has(partnerId)) {
      conversationsMap.set(partnerId, {
        partner_id: partnerId,
        last_message: message.content,
        last_message_time: message.created_at,
        unread_count: 0
      });
    }

    // Count unread messages (messages sent TO current user)
    if (message.recipient_id === userId && !message.is_read) {
      conversationsMap.get(partnerId).unread_count++;
    }
  }

  // Get user details for each conversation partner
  const partnerIds = Array.from(conversationsMap.keys());
  const users = await User.findAll({
    where: { id: { [Op.in]: partnerIds } },
    attributes: ['id', 'username', 'display_name', 'avatar_url', 'bio']
  });

  const conversations = users.map(user => {
    const conv = conversationsMap.get(user.id);
    return {
      user: user.toJSON(),
      last_message: conv.last_message,
      last_message_time: conv.last_message_time,
      unread_count: conv.unread_count
    };
  });

  // Sort by last message time
  conversations.sort((a, b) =>
    new Date(b.last_message_time) - new Date(a.last_message_time)
  );

  // Paginate
  const start = (page - 1) * limit;
  const paginatedConversations = conversations.slice(start, start + limit);

  return {
    conversations: paginatedConversations,
    pagination: {
      page,
      limit,
      total: conversations.length,
      totalPages: Math.ceil(conversations.length / limit)
    }
  };
};

/**
 * Get unread message count
 */
const getUnreadCount = async (userId) => {
  const count = await Message.count({
    where: {
      recipient_id: userId,
      is_read: false
    }
  });

  return { unread_count: count };
};

/**
 * Mark messages as read
 */
const markAsRead = async (userId, senderId) => {
  await Message.update(
    {
      is_read: true,
      read_at: new Date()
    },
    {
      where: {
        sender_id: senderId,
        recipient_id: userId,
        is_read: false
      }
    }
  );
};

/**
 * Delete a message
 */
const deleteMessage = async (messageId, userId) => {
  const message = await Message.findByPk(messageId);

  if (!message) {
    throw new NotFoundError('Message not found');
  }

  // Only sender can delete
  if (message.sender_id !== userId) {
    throw new ValidationError('You can only delete your own messages');
  }

  await message.destroy();
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  getUnreadCount,
  markAsRead,
  deleteMessage
};
