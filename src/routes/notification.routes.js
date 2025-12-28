const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

/**
 * All notification routes require authentication
 */

// Get unread count (must be before /:id routes)
router.get('/unread-count', authMiddleware, notificationController.getUnreadCount);

// Mark all as read
router.put('/mark-all-read', authMiddleware, notificationController.markAllAsRead);

// Get all notifications
router.get('/', authMiddleware, notificationController.getNotifications);

// Delete all notifications
router.delete('/', authMiddleware, notificationController.deleteAllNotifications);

// Mark notification as read
router.put('/:id/read', authMiddleware, notificationController.markAsRead);

// Delete a notification
router.delete('/:id', authMiddleware, notificationController.deleteNotification);

module.exports = router;
