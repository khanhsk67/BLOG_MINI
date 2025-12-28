const userService = require('../services/user.service');
const { successResponse, paginationResponse } = require('../utils/response');

class UserController {
  /**
   * GET /api/users/:id
   * Get user profile by ID
   */
  async getUserProfile(req, res, next) {
    try {
      const userId = req.params.id;
      const currentUserId = req.user?.id;

      const user = await userService.getUserById(userId, currentUserId);

      return successResponse(res, { user }, 'User profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/username/:username
   * Get user profile by username
   */
  async getUserByUsername(req, res, next) {
    try {
      const { username } = req.params;
      const currentUserId = req.user?.id;

      const user = await userService.getUserByUsername(username, currentUserId);

      return successResponse(res, { user }, 'User profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/profile
   * Update current user's profile
   */
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const { display_name, bio, avatar_url } = req.body;

      const user = await userService.updateUserProfile(userId, {
        display_name,
        bio,
        avatar_url
      });

      return successResponse(res, { user }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id/posts
   * Get user's posts
   */
  async getUserPosts(req, res, next) {
    try {
      const userId = req.params.id;
      const currentUserId = req.user?.id;
      const { page, limit, status } = req.query;

      const result = await userService.getUserPosts(userId, currentUserId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status
      });

      return paginationResponse(
        res,
        { posts: result.posts },
        result.pagination,
        'User posts retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users/:id/follow
   * Follow a user
   */
  async followUser(req, res, next) {
    try {
      const followerId = req.user.id;
      const followingId = req.params.id;

      const result = await userService.followUser(followerId, followingId);

      return successResponse(res, result, 'Successfully followed user');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id/follow
   * Unfollow a user
   */
  async unfollowUser(req, res, next) {
    try {
      const followerId = req.user.id;
      const followingId = req.params.id;

      const result = await userService.unfollowUser(followerId, followingId);

      return successResponse(res, result, 'Successfully unfollowed user');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id/followers
   * Get user's followers
   */
  async getFollowers(req, res, next) {
    try {
      const userId = req.params.id;
      const { page, limit } = req.query;

      const result = await userService.getFollowers(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      });

      return paginationResponse(
        res,
        { followers: result.followers },
        result.pagination,
        'Followers retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id/following
   * Get users that this user is following
   */
  async getFollowing(req, res, next) {
    try {
      const userId = req.params.id;
      const { page, limit } = req.query;

      const result = await userService.getFollowing(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      });

      return paginationResponse(
        res,
        { following: result.following },
        result.pagination,
        'Following retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/search
   * Search users
   */
  async searchUsers(req, res, next) {
    try {
      const { q, page, limit } = req.query;

      if (!q || q.trim().length === 0) {
        return successResponse(res, { users: [], pagination: {} }, 'No search query provided');
      }

      const result = await userService.searchUsers(q, {
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
}

module.exports = new UserController();
