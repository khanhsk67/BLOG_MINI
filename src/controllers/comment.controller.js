const commentService = require('../services/comment.service');
const { successResponse, createdResponse, paginationResponse } = require('../utils/response');

class CommentController {
  /**
   * POST /api/posts/:postId/comments
   * Create a comment on a post
   */
  async createComment(req, res, next) {
    try {
      const userId = req.user.id;
      const postId = req.params.postId;
      const { content, parent_comment_id } = req.body;

      const comment = await commentService.createComment(
        userId,
        postId,
        content,
        parent_comment_id
      );

      return createdResponse(res, { comment }, 'Comment created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/posts/:postId/comments
   * Get all comments for a post
   */
  async getCommentsByPost(req, res, next) {
    try {
      const postId = req.params.postId;
      const { page, limit, sortBy, sortOrder } = req.query;

      const result = await commentService.getCommentsByPost(postId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        sortBy: sortBy || 'created_at',
        sortOrder: sortOrder || 'DESC'
      });

      return paginationResponse(
        res,
        { comments: result.comments },
        result.pagination,
        'Comments retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/comments/:id/replies
   * Get replies for a comment
   */
  async getReplies(req, res, next) {
    try {
      const commentId = req.params.id;
      const { page, limit } = req.query;

      const result = await commentService.getRepliesByComment(commentId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      });

      return paginationResponse(
        res,
        { replies: result.replies },
        result.pagination,
        'Replies retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/comments/:id
   * Update a comment
   */
  async updateComment(req, res, next) {
    try {
      const commentId = req.params.id;
      const userId = req.user.id;
      const { content } = req.body;

      const comment = await commentService.updateComment(commentId, userId, content);

      return successResponse(res, { comment }, 'Comment updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/comments/:id
   * Delete a comment
   */
  async deleteComment(req, res, next) {
    try {
      const commentId = req.params.id;
      const userId = req.user.id;
      const isAdmin = req.user.role === 'admin';

      const result = await commentService.deleteComment(commentId, userId, isAdmin);

      return successResponse(res, result, 'Comment deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();
