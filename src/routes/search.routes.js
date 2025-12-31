const express = require('express');
const searchController = require('../controllers/search.controller');

const router = express.Router();

/**
 * @route   GET /api/search
 * @desc    Global search (posts + users)
 * @access  Public
 */
router.get('/', searchController.globalSearch);

/**
 * @route   GET /api/search/posts
 * @desc    Search posts by content
 * @access  Public
 */
router.get('/posts', searchController.searchPosts);

/**
 * @route   GET /api/search/users
 * @desc    Search users by username/email/name
 * @access  Public
 */
router.get('/users', searchController.searchUsers);

/**
 * @route   GET /api/search/suggestions
 * @desc    Get search suggestions (autocomplete)
 * @access  Public
 */
router.get('/suggestions', searchController.getSearchSuggestions);

module.exports = router;
