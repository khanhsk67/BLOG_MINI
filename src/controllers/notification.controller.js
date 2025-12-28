const notificationService = require('../services/notification.service');
const { successResponse, paginationResponse } = require('../utils/response');

class NotificationController {
  /**
   * GET /api/notifications
   * Get current user's notifications
   */
  async getNotifications(req, res, next) {
    try {
      const userId = req.user.id;
      const { page, limit, isRead } = req.query;

      const result = await notificationService.getUserNotifications(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        isRead: isRead !== undefined ? isRead === 'true' : undefined
      });

      return paginationResponse(
        res,
        { notifications: result.notifications },
        result.pagination,
        'Notifications retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/notifications/:id/read
   * Mark a notification as read
   */
  async markAsRead(req, res, next) {
    try {
      const userId = req.user.id;
      const notificationId = req.params.id;

      const notification = await notificationService.markAsRead(notificationId, userId);

      return successResponse(res, { notification }, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/notifications/mark-all-read
   * Mark all notifications as read
   */
  async markAllAsRead(req, res, next) {
    try {
      const userId = req.user.id;

      const result = await notificationService.markAllAsRead(userId);

      return successResponse(res, result, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/notifications/:id
   * Delete a notification
   */
  async deleteNotification(req, res, next) {
    try {
      const userId = req.user.id;
      const notificationId = req.params.id;

      const result = await notificationService.deleteNotification(notificationId, userId);

      return successResponse(res, result, 'Notification deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/notifications
   * Delete all notifications
   */
  async deleteAllNotifications(req, res, next) {
    try {
      const userId = req.user.id;

      const result = await notificationService.deleteAllNotifications(userId);

      return successResponse(res, result, 'All notifications deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/notifications/unread-count
   * Get unread notification count
   */
  async getUnreadCount(req, res, next) {
    try {
      const userId = req.user.id;

      const result = await notificationService.getUnreadCount(userId);

      return successResponse(res, result, 'Unread count retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
