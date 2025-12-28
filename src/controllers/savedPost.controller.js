const savedPostService = require('../services/savedPost.service');
const { successResponse, paginationResponse } = require('../utils/response');

class SavedPostController {
  /**
   * POST /api/posts/:postId/save
   * Save a post
   */
  async savePost(req, res, next) {
    try {
      const userId = req.user.id;
      const postId = req.params.postId;

      const result = await savedPostService.savePost(userId, postId);

      return successResponse(res, result, 'Post saved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/posts/:postId/save
   * Unsave a post
   */
  async unsavePost(req, res, next) {
    try {
      const userId = req.user.id;
      const postId = req.params.postId;

      const result = await savedPostService.unsavePost(userId, postId);

      return successResponse(res, result, 'Post unsaved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/me/saved-posts
   * Get current user's saved posts
   */
  async getSavedPosts(req, res, next) {
    try {
      const userId = req.user.id;
      const { page, limit } = req.query;

      const result = await savedPostService.getUserSavedPosts(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      });

      return paginationResponse(
        res,
        { posts: result.posts },
        result.pagination,
        'Saved posts retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SavedPostController();
