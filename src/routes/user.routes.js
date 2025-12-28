const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const reactionController = require('../controllers/reaction.controller');
const savedPostController = require('../controllers/savedPost.controller');
const { authMiddleware, optionalAuth } = require('../middleware/auth.middleware');
const { body, query } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');

/**
 * Validation rules
 */
const updateProfileValidation = [
  body('display_name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Display name must be between 1 and 100 characters')
    .trim(),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters')
    .trim(),
  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL')
];

const searchUsersValidation = [
  query('q')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters')
    .trim()
];

/**
 * User Routes
 */

// Search users (must be before /:id routes)
router.get('/search', searchUsersValidation, validate, userController.searchUsers);

// Get user profile by username
router.get('/username/:username', optionalAuth, userController.getUserByUsername);

// Update current user's profile
router.put('/profile', authMiddleware, updateProfileValidation, validate, userController.updateProfile);

// Get user profile by ID
router.get('/:id', optionalAuth, userController.getUserProfile);

// Get user's posts
router.get('/:id/posts', optionalAuth, userController.getUserPosts);

// Follow user
router.post('/:id/follow', authMiddleware, userController.followUser);

// Unfollow user
router.delete('/:id/follow', authMiddleware, userController.unfollowUser);

// Get user's followers
router.get('/:id/followers', userController.getFollowers);

// Get user's following
router.get('/:id/following', userController.getFollowing);

// Get user's liked posts
router.get('/:userId/liked-posts', reactionController.getUserLikedPosts);

// Get current user's saved posts
router.get('/me/saved-posts', authMiddleware, savedPostController.getSavedPosts);

module.exports = router;
