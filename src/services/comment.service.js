const { Comment, User, Post } = require('../models');
const { NotFoundError, ForbiddenError } = require('../utils/errors');

class CommentService {
  /**
   * Create new comment
   */
  async createComment(userId, postId, content, parentCommentId = null) {
    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new NotFoundError('Post');
    }

    // If it's a reply, check if parent comment exists
    if (parentCommentId) {
      const parentComment = await Comment.findByPk(parentCommentId);
      if (!parentComment) {
        throw new NotFoundError('Parent comment');
      }
      // Ensure parent comment belongs to the same post
      if (parentComment.post_id !== postId) {
        throw new ForbiddenError('Parent comment does not belong to this post');
      }
    }

    // Create comment
    const comment = await Comment.create({
      user_id: userId,
      post_id: postId,
      parent_comment_id: parentCommentId,
      content
    });

    // TODO: Create notification for post author (and parent comment author if reply)
    // await notificationService.createCommentNotification(...)

    // Return comment with user info
    return await this.getCommentById(comment.id);
  }

  /**
   * Get comment by ID
   */
  async getCommentById(commentId) {
    const comment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'display_name', 'avatar_url']
        }
      ]
    });

    if (!comment) {
      throw new NotFoundError('Comment');
    }

    return comment;
  }

  /**
   * Get comments for a post
   */
  async getCommentsByPost(postId, options = {}) {
    const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'DESC' } = options;
    const offset = (page - 1) * limit;

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new NotFoundError('Post');
    }

    // Get top-level comments (parent_comment_id is null)
    const { count, rows: comments } = await Comment.findAndCountAll({
      where: {
        post_id: postId,
        parent_comment_id: null
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'display_name', 'avatar_url']
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'display_name', 'avatar_url']
            }
          ],
          order: [['created_at', 'ASC']]
        }
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset
    });

    return {
      comments,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Get replies for a comment
   */
  async getRepliesByComment(commentId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    // Check if comment exists
    const parentComment = await Comment.findByPk(commentId);
    if (!parentComment) {
      throw new NotFoundError('Comment');
    }

    const { count, rows: replies } = await Comment.findAndCountAll({
      where: { parent_comment_id: commentId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'display_name', 'avatar_url']
        }
      ],
      order: [['created_at', 'ASC']],
      limit,
      offset
    });

    return {
      replies,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Update comment
   */
  async updateComment(commentId, userId, content) {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      throw new NotFoundError('Comment');
    }

    // Check ownership
    if (comment.user_id !== userId) {
      throw new ForbiddenError('You can only edit your own comments');
    }

    await comment.update({ content });

    return await this.getCommentById(commentId);
  }

  /**
   * Delete comment
   */
  async deleteComment(commentId, userId, isAdmin = false) {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      throw new NotFoundError('Comment');
    }

    // Check ownership or admin
    if (comment.user_id !== userId && !isAdmin) {
      throw new ForbiddenError('You can only delete your own comments');
    }

    await comment.destroy();

    return { message: 'Comment deleted successfully' };
  }

  /**
   * Get comment count for a post
   */
  async getCommentCount(postId) {
    return await Comment.count({ where: { post_id: postId } });
  }
}

module.exports = new CommentService();
