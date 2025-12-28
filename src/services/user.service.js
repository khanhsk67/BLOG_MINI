const { User, Post, Follow, sequelize } = require('../models');
const { NotFoundError, ConflictError, ForbiddenError } = require('../utils/errors');
const { Op } = require('sequelize');
const notificationService = require('./notification.service');

class UserService {
  /**
   * Get user by ID with stats
   */
  async getUserById(userId, currentUserId = null) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    // Get statistics
    const stats = await this.getUserStats(userId);

    // Check if current user is following this user
    let isFollowing = false;
    if (currentUserId && currentUserId !== userId) {
      isFollowing = await Follow.findOne({
        where: {
          follower_id: currentUserId,
          following_id: userId
        }
      }) !== null;
    }

    return {
      ...user.toJSON(),
      stats,
      is_following: isFollowing
    };
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username, currentUserId = null) {
    const user = await User.findOne({
      where: { username: username.toLowerCase() },
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return await this.getUserById(user.id, currentUserId);
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId, updateData) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new NotFoundError('User');
    }

    const { display_name, bio, avatar_url } = updateData;

    // Only allow updating certain fields
    const allowedUpdates = {};
    if (display_name !== undefined) allowedUpdates.display_name = display_name;
    if (bio !== undefined) allowedUpdates.bio = bio;
    if (avatar_url !== undefined) allowedUpdates.avatar_url = avatar_url;

    await user.update(allowedUpdates);

    return user;
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId) {
    const [postsCount, followersCount, followingCount] = await Promise.all([
      Post.count({ where: { author_id: userId, status: 'published' } }),
      Follow.count({ where: { following_id: userId } }),
      Follow.count({ where: { follower_id: userId } })
    ]);

    return {
      posts_count: postsCount,
      followers_count: followersCount,
      following_count: followingCount
    };
  }

  /**
   * Get user's posts
   */
  async getUserPosts(userId, currentUserId = null, options = {}) {
    const {
      page = 1,
      limit = 20,
      status = 'published'
    } = options;

    const offset = (page - 1) * limit;

    // Build where clause
    const where = { author_id: userId };

    // Only show drafts to the owner
    if (userId === currentUserId) {
      if (status) {
        where.status = status;
      }
    } else {
      where.status = 'published';
    }

    const { count, rows: posts } = await Post.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'display_name', 'avatar_url']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      posts,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Follow a user
   */
  async followUser(followerId, followingId) {
    // Cannot follow yourself
    if (followerId === followingId) {
      throw new ForbiddenError('You cannot follow yourself');
    }

    // Check if target user exists
    const targetUser = await User.findByPk(followingId);
    if (!targetUser) {
      throw new NotFoundError('User');
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      where: { follower_id: followerId, following_id: followingId }
    });

    if (existingFollow) {
      throw new ConflictError('You are already following this user');
    }

    // Create follow relationship
    await Follow.create({
      follower_id: followerId,
      following_id: followingId
    });

    // Create notification for the followed user
    await notificationService.notifyFollow(followingId, followerId);

    return { message: 'Successfully followed user' };
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(followerId, followingId) {
    // Cannot unfollow yourself
    if (followerId === followingId) {
      throw new ForbiddenError('Invalid operation');
    }

    // Find and delete follow relationship
    const follow = await Follow.findOne({
      where: { follower_id: followerId, following_id: followingId }
    });

    if (!follow) {
      throw new NotFoundError('Follow relationship');
    }

    await follow.destroy();

    return { message: 'Successfully unfollowed user' };
  }

  /**
   * Get user's followers
   */
  async getFollowers(userId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const { count, rows: follows } = await Follow.findAndCountAll({
      where: { following_id: userId },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: ['id', 'username', 'display_name', 'avatar_url', 'bio']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const followers = follows.map(f => f.follower);

    return {
      followers,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Get users that this user is following
   */
  async getFollowing(userId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const { count, rows: follows } = await Follow.findAndCountAll({
      where: { follower_id: userId },
      include: [
        {
          model: User,
          as: 'following',
          attributes: ['id', 'username', 'display_name', 'avatar_url', 'bio']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const following = follows.map(f => f.following);

    return {
      following,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Search users
   */
  async searchUsers(query, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } },
          { display_name: { [Op.iLike]: `%${query}%` } }
        ],
        is_active: true
      },
      attributes: ['id', 'username', 'display_name', 'avatar_url', 'bio'],
      limit,
      offset
    });

    return {
      users,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }
}

module.exports = new UserService();
