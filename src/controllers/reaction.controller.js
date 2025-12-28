const reactionService = require('../services/reaction.service');
const { successResponse, paginationResponse } = require('../utils/response');

class ReactionController {
  /**
   * POST /api/posts/:postId/like
   * Like a post
   */
  async likePost(req, res, next) {
    try {
      const userId = req.user.id;
      const postId = req.params.postId;

      const result = await reactionService.likePost(userId, postId);

      return successResponse(res, result, 'Post liked successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/posts/:postId/like
   * Unlike a post
   */
  async unlikePost(req, res, next) {
    try {
      const userId = req.user.id;
      const postId = req.params.postId;

      const result = await reactionService.unlikePost(userId, postId);

      return successResponse(res, result, 'Post unliked successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/posts/:postId/likes
   * Get users who liked a post
   */
  async getPostLikes(req, res, next) {
    try {
      const postId = req.params.postId;
      const { page, limit } = req.query;

      const result = await reactionService.getUsersWhoLiked(postId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      });

      return paginationResponse(
        res,
        { users: result.users },
        result.pagination,
        'Users retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:userId/liked-posts
   * Get posts liked by a user
   */
  async getUserLikedPosts(req, res, next) {
    try {
      const userId = req.params.userId;
      const { page, limit } = req.query;

      const result = await reactionService.getPostsLikedByUser(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      });

      return paginationResponse(
        res,
        { posts: result.posts },
        result.pagination,
        'Liked posts retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReactionController();
