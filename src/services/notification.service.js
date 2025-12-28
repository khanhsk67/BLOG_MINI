const { Notification, User, Post } = require('../models');
const { NotFoundError } = require('../utils/errors');

class NotificationService {
  /**
   * Create a notification
   */
  async createNotification(userId, type, content, relatedUserId = null, relatedPostId = null) {
    // Don't create notification if user is notifying themselves
    if (userId === relatedUserId) {
      return null;
    }

    const notification = await Notification.create({
      user_id: userId,
      type,
      content,
      related_user_id: relatedUserId,
      related_post_id: relatedPostId,
      is_read: false
    });

    return await this.getNotificationById(notification.id);
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(notificationId) {
    const notification = await Notification.findByPk(notificationId, {
      include: [
        {
          model: User,
          as: 'related_user',
          attributes: ['id', 'username', 'display_name', 'avatar_url']
        },
        {
          model: Post,
          as: 'related_post',
          attributes: ['id', 'title', 'slug']
        }
      ]
    });

    if (!notification) {
      throw new NotFoundError('Notification');
    }

    return notification;
  }

  /**
   * Get user's notifications
   */
  async getUserNotifications(userId, options = {}) {
    const { page = 1, limit = 20, isRead } = options;
    const offset = (page - 1) * limit;

    const where = { user_id: userId };
    if (isRead !== undefined) {
      where.is_read = isRead;
    }

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'related_user',
          attributes: ['id', 'username', 'display_name', 'avatar_url']
        },
        {
          model: Post,
          as: 'related_post',
          attributes: ['id', 'title', 'slug']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId }
    });

    if (!notification) {
      throw new NotFoundError('Notification');
    }

    await notification.update({ is_read: true });

    return notification;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    await Notification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );

    return { message: 'All notifications marked as read' };
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId, userId) {
    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId }
    });

    if (!notification) {
      throw new NotFoundError('Notification');
    }

    await notification.destroy();

    return { message: 'Notification deleted successfully' };
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId) {
    const count = await Notification.count({
      where: { user_id: userId, is_read: false }
    });

    return { count };
  }

  /**
   * Delete all notifications for a user
   */
  async deleteAllNotifications(userId) {
    await Notification.destroy({
      where: { user_id: userId }
    });

    return { message: 'All notifications deleted successfully' };
  }

  // ==================== TRIGGER METHODS ====================

  /**
   * Create notification when someone likes a post
   */
  async notifyLike(postAuthorId, likerUserId, postId) {
    if (postAuthorId === likerUserId) return null;

    const liker = await User.findByPk(likerUserId);
    const post = await Post.findByPk(postId);

    if (!liker || !post) return null;

    const content = `${liker.display_name || liker.username} liked your post "${post.title}"`;

    return await this.createNotification(
      postAuthorId,
      'like',
      content,
      likerUserId,
      postId
    );
  }

  /**
   * Create notification when someone comments on a post
   */
  async notifyComment(postAuthorId, commenterUserId, postId) {
    if (postAuthorId === commenterUserId) return null;

    const commenter = await User.findByPk(commenterUserId);
    const post = await Post.findByPk(postId);

    if (!commenter || !post) return null;

    const content = `${commenter.display_name || commenter.username} commented on your post "${post.title}"`;

    return await this.createNotification(
      postAuthorId,
      'comment',
      content,
      commenterUserId,
      postId
    );
  }

  /**
   * Create notification when someone replies to a comment
   */
  async notifyReply(commentAuthorId, replierUserId, postId) {
    if (commentAuthorId === replierUserId) return null;

    const replier = await User.findByPk(replierUserId);
    const post = await Post.findByPk(postId);

    if (!replier || !post) return null;

    const content = `${replier.display_name || replier.username} replied to your comment`;

    return await this.createNotification(
      commentAuthorId,
      'reply',
      content,
      replierUserId,
      postId
    );
  }

  /**
   * Create notification when someone follows a user
   */
  async notifyFollow(followedUserId, followerUserId) {
    if (followedUserId === followerUserId) return null;

    const follower = await User.findByPk(followerUserId);

    if (!follower) return null;

    const content = `${follower.display_name || follower.username} started following you`;

    return await this.createNotification(
      followedUserId,
      'follow',
      content,
      followerUserId,
      null
    );
  }
}

module.exports = new NotificationService();
