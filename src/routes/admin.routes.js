const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');

/**
 * All admin routes require authentication + admin role
 * Apply authMiddleware and adminOnly to all routes
 */
router.use(authMiddleware, adminOnly);

/**
 * Validation rules
 */
const banUserValidation = [
  body('reason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters')
    .trim()
];

const setFeaturedValidation = [
  body('is_featured')
    .optional()
    .isBoolean()
    .withMessage('is_featured must be a boolean value')
];

/**
 * Admin Routes
 */

// System statistics
router.get('/stats', adminController.getSystemStats);

// Global search
router.get('/search', adminController.globalSearch);

// Featured posts
router.get('/featured-posts', adminController.getFeaturedPosts);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetail);
router.put('/users/:id/ban', banUserValidation, validate, adminController.banUser);
router.put('/users/:id/unban', adminController.unbanUser);
router.delete('/users/:id', adminController.deleteUser);

// Post management
router.get('/posts', adminController.getAllPosts);
router.delete('/posts/:id', adminController.deletePost);
router.put('/posts/:id/featured', setFeaturedValidation, validate, adminController.setFeaturedPost);

module.exports = router;
