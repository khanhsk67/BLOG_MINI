const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');

/**
 * Message Routes
 * All routes related to chat/messaging
 */

// Validation
const sendMessageValidation = [
  body('recipient_id')
    .notEmpty()
    .withMessage('Recipient ID is required')
    .isUUID()
    .withMessage('Recipient ID must be a valid UUID'),
  body('content')
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message must be between 1 and 5000 characters')
    .trim()
];

// Send a message
router.post('/', authMiddleware, sendMessageValidation, validate, messageController.sendMessage);

// Get all conversations
router.get('/conversations', authMiddleware, messageController.getConversations);

// Get unread count
router.get('/unread-count', authMiddleware, messageController.getUnreadCount);

// Get conversation with specific user
router.get('/conversation/:userId', authMiddleware, messageController.getConversation);

// Mark messages as read
router.put('/read/:senderId', authMiddleware, messageController.markAsRead);

// Delete a message
router.delete('/:messageId', authMiddleware, messageController.deleteMessage);

module.exports = router;
