const express = require('express');
const router = express.Router();
const followController = require('../controllers/follow.controller');
const { authMiddleware, optionalAuth } = require('../middleware/auth.middleware');

/**
 * Follow Routes
 * All routes related to following/unfollowing users
 */

// Follow a user
router.post('/:userId/follow', authMiddleware, followController.followUser);

// Unfollow a user
router.delete('/:userId/follow', authMiddleware, followController.unfollowUser);

// Get user's followers
router.get('/:userId/followers', followController.getFollowers);

// Get users that user is following
router.get('/:userId/following', followController.getFollowing);

// Check if current user follows a specific user
router.get('/:userId/follow-status', optionalAuth, followController.checkFollowStatus);

// Get follow statistics
router.get('/:userId/follow-stats', followController.getFollowStats);

module.exports = router;
