const { Follow, User } = require('../models');
const { NotFoundError, ValidationError, ConflictError } = require('../utils/errors');
const { validatePagination } = require('../utils/validators');

/**
 * Follow Service
 * Business logic for follow/unfollow operations
 */

/**
 * Follow a user
 */
const followUser = async (followerId, followingId) => {
  // Validate input
  if (!followerId || !followingId) {
    throw new ValidationError('Follower ID and Following ID are required');
  }

  // Cannot follow yourself
  if (followerId === followingId) {
    throw new ValidationError('You cannot follow yourself');
  }

  // Check if user to follow exists
  const userToFollow = await User.findByPk(followingId);
  if (!userToFollow) {
    throw new NotFoundError('User not found');
  }

  // Check if already following
  const existingFollow = await Follow.findOne({
    where: {
      follower_id: followerId,
      following_id: followingId
    }
  });

  if (existingFollow) {
    throw new ConflictError('You are already following this user');
  }

  // Create follow relationship
  const follow = await Follow.create({
    follower_id: followerId,
    following_id: followingId
  });

  return {
    id: follow.id,
    follower_id: follow.follower_id,
    following_id: follow.following_id,
    created_at: follow.created_at
  };
};

/**
 * Unfollow a user
 */
const unfollowUser = async (followerId, followingId) => {
  // Validate input
  if (!followerId || !followingId) {
    throw new ValidationError('Follower ID and Following ID are required');
  }

  // Find and delete follow relationship
  const follow = await Follow.findOne({
    where: {
      follower_id: followerId,
      following_id: followingId
    }
  });

  if (!follow) {
    throw new NotFoundError('Follow relationship not found');
  }

  await follow.destroy();
};

/**
 * Get followers of a user
 */
const getFollowers = async (userId, options = {}) => {
  const { page, limit, offset } = validatePagination(options.page, options.limit);

  // Check if user exists
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const { count, rows } = await Follow.findAndCountAll({
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

  const followers = rows.map(follow => ({
    ...follow.follower.toJSON(),
    followed_at: follow.created_at
  }));

  return {
    followers,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

/**
 * Get users that a user is following
 */
const getFollowing = async (userId, options = {}) => {
  const { page, limit, offset } = validatePagination(options.page, options.limit);

  // Check if user exists
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const { count, rows } = await Follow.findAndCountAll({
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

  const following = rows.map(follow => ({
    ...follow.following.toJSON(),
    followed_at: follow.created_at
  }));

  return {
    following,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

/**
 * Check if a user is following another user
 */
const isFollowing = async (followerId, followingId) => {
  const follow = await Follow.findOne({
    where: {
      follower_id: followerId,
      following_id: followingId
    }
  });

  return !!follow;
};

/**
 * Get follow statistics for a user
 */
const getFollowStats = async (userId) => {
  // Check if user exists
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const followersCount = await Follow.count({
    where: { following_id: userId }
  });

  const followingCount = await Follow.count({
    where: { follower_id: userId }
  });

  return {
    user_id: userId,
    followers_count: followersCount,
    following_count: followingCount
  };
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  isFollowing,
  getFollowStats
};
