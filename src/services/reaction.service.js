const { Reaction, Post, User } = require('../models');
const { NotFoundError, ConflictError } = require('../utils/errors');
const notificationService = require('./notification.service');

class ReactionService {
  /**
   * Like a post
   */
  async likePost(userId, postId) {
    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new NotFoundError('Post');
    }

    // Check if already liked
    const existingReaction = await Reaction.findOne({
      where: { user_id: userId, post_id: postId }
    });

    if (existingReaction) {
      throw new ConflictError('You have already liked this post');
    }

    // Create reaction
    await Reaction.create({
      user_id: userId,
      post_id: postId
    });

    // Create notification for post author
    if (post.author_id !== userId) {
      await notificationService.notifyLike(post.author_id, userId, postId);
    }

    // Get updated like count
    const likeCount = await this.getPostLikeCount(postId);

    return {
      message: 'Post liked successfully',
      like_count: likeCount
    };
  }

  /**
   * Unlike a post
   */
  async unlikePost(userId, postId) {
    // Find and delete reaction
    const reaction = await Reaction.findOne({
      where: { user_id: userId, post_id: postId }
    });

    if (!reaction) {
      throw new NotFoundError('Like', 'You have not liked this post');
    }

    await reaction.destroy();

    // Get updated like count
    const likeCount = await this.getPostLikeCount(postId);

    return {
      message: 'Post unliked successfully',
      like_count: likeCount
    };
  }

  /**
   * Check if user liked a post
   */
  async checkUserLiked(userId, postId) {
    const reaction = await Reaction.findOne({
      where: { user_id: userId, post_id: postId }
    });

    return reaction !== null;
  }

  /**
   * Get like count for a post
   */
  async getPostLikeCount(postId) {
    return await Reaction.count({ where: { post_id: postId } });
  }

  /**
   * Get users who liked a post
   */
  async getUsersWhoLiked(postId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new NotFoundError('Post');
    }

    const { count, rows: reactions } = await Reaction.findAndCountAll({
      where: { post_id: postId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'display_name', 'avatar_url']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const users = reactions.map(r => r.user);

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

  /**
   * Get posts liked by a user
   */
  async getPostsLikedByUser(userId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const { count, rows: reactions } = await Reaction.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Post,
          as: 'post',
          where: { status: 'published' },
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'display_name', 'avatar_url']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const posts = reactions.map(r => r.post);

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
}

module.exports = new ReactionService();
