const adminService = require('../services/admin.service');
const { successResponse, paginationResponse } = require('../utils/response');

class AdminController {
  /**
   * GET /api/admin/users
   * Get all users
   */
  async getAllUsers(req, res, next) {
    try {
      const { page, limit, search, role, isActive, sortBy, sortOrder } = req.query;

      const result = await adminService.getAllUsers({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        search,
        role,
        isActive: isActive !== undefined ? isActive === 'true' : null,
        sortBy: sortBy || 'created_at',
        sortOrder: sortOrder || 'DESC'
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
   * GET /api/admin/users/:id
   * Get user detail
   */
  async getUserDetail(req, res, next) {
    try {
      const userId = req.params.id;

      const user = await adminService.getUserDetail(userId);

      return successResponse(res, { user }, 'User detail retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/users/:id/ban
   * Ban a user
   */
  async banUser(req, res, next) {
    try {
      const userId = req.params.id;
      const { reason } = req.body;

      const result = await adminService.banUser(userId, reason);

      return successResponse(res, result, 'User banned successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/users/:id/unban
   * Unban a user
   */
  async unbanUser(req, res, next) {
    try {
      const userId = req.params.id;

      const result = await adminService.unbanUser(userId);

      return successResponse(res, result, 'User unbanned successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/users/:id
   * Delete a user
   */
  async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;

      const result = await adminService.deleteUser(userId);

      return successResponse(res, result, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/posts
   * Get all posts
   */
  async getAllPosts(req, res, next) {
    try {
      const { page, limit, status, search, sortBy, sortOrder } = req.query;

      const result = await adminService.getAllPosts({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status,
        search,
        sortBy: sortBy || 'created_at',
        sortOrder: sortOrder || 'DESC'
      });

      return paginationResponse(
        res,
        { posts: result.posts },
        result.pagination,
        'Posts retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/posts/:id
   * Delete a post
   */
  async deletePost(req, res, next) {
    try {
      const postId = req.params.id;

      const result = await adminService.deletePost(postId);

      return successResponse(res, result, 'Post deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/posts/:id/featured
   * Set/Unset featured post
   */
  async setFeaturedPost(req, res, next) {
    try {
      const postId = req.params.id;
      const { is_featured } = req.body;

      const result = await adminService.setFeaturedPost(
        postId,
        is_featured !== undefined ? is_featured : true
      );

      return successResponse(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/stats
   * Get system statistics
   */
  async getSystemStats(req, res, next) {
    try {
      const stats = await adminService.getSystemStats();

      return successResponse(res, { stats }, 'System statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/featured-posts
   * Get featured posts
   */
  async getFeaturedPosts(req, res, next) {
    try {
      const result = await adminService.getFeaturedPosts();

      return successResponse(res, result, 'Featured posts retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/search
   * Global search
   */
  async globalSearch(req, res, next) {
    try {
      const { q, limit } = req.query;

      if (!q || q.trim().length === 0) {
        return successResponse(res, { users: [], posts: [], comments: [] }, 'No search query provided');
      }

      const result = await adminService.globalSearch(q, {
        limit: parseInt(limit) || 10
      });

      return successResponse(res, result, 'Search results retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
