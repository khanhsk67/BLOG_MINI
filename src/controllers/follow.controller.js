const followService = require('../services/follow.service');
const { successResponse } = require('../utils/response');

/**
 * Follow Controller
 * Handles follow/unfollow operations
 */

/**
 * Follow a user
 */
const followUser = async (req, res, next) => {
  try {
    const followerId = req.user.id; // Current user
    const followingId = req.params.userId; // User to follow

    const result = await followService.followUser(followerId, followingId);

    return res.status(201).json(
      successResponse(result, 'User followed successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Unfollow a user
 */
const unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id; // Current user
    const followingId = req.params.userId; // User to unfollow

    await followService.unfollowUser(followerId, followingId);

    return res.json(
      successResponse(null, 'User unfollowed successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's followers
 */
const getFollowers = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 20 } = req.query;

    const result = await followService.getFollowers(userId, { page, limit });

    return res.json(
      successResponse(result, 'Followers retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get users that a user is following
 */
const getFollowing = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 20 } = req.query;

    const result = await followService.getFollowing(userId, { page, limit });

    return res.json(
      successResponse(result, 'Following retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Check if current user follows a specific user
 */
const checkFollowStatus = async (req, res, next) => {
  try {
    const followerId = req.user?.id; // Current user (optional auth)
    const followingId = req.params.userId;

    if (!followerId) {
      return res.json(
        successResponse({ isFollowing: false }, 'Not authenticated')
      );
    }

    const isFollowing = await followService.isFollowing(followerId, followingId);

    return res.json(
      successResponse({ isFollowing }, 'Follow status retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get follow statistics for a user
 */
const getFollowStats = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const stats = await followService.getFollowStats(userId);

    return res.json(
      successResponse(stats, 'Follow stats retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
  getFollowStats
};
