const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');

/**
 * Validation rules
 */
const commentValidation = [
  body('content')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment must be between 1 and 2000 characters')
    .trim(),
  body('parent_comment_id')
    .optional()
    .isUUID()
    .withMessage('Parent comment ID must be a valid UUID')
];

/**
 * Comment Routes
 * Note: Routes for creating/getting comments by post are in post.routes.js
 * These routes handle comment-specific operations
 */

// Get replies for a comment
router.get('/:id/replies', commentController.getReplies);

// Update comment
router.put('/:id', authMiddleware, commentValidation, validate, commentController.updateComment);

// Delete comment
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;
