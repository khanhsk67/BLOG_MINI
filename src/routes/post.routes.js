const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const commentController = require('../controllers/comment.controller');
const reactionController = require('../controllers/reaction.controller');
const savedPostController = require('../controllers/savedPost.controller');
const { authMiddleware, optionalAuth } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { upload } = require('../config/upload');

// Validation
const postValidation = [
    body('title').isLength({ min: 1, max: 200 }).trim(),
    body('content').isLength({ min: 1, max: 50000 }),
    body('excerpt').optional().isLength({ max: 300 }).trim(),
    body('featured_image_url').optional().isURL(),
    body('tags').optional().isArray({ min: 1, max: 5 }),
    body('tags.*').isString().trim(),
    body('status').optional().isIn(['draft', 'published'])
];

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

// Post Routes
router.post('/', authMiddleware, upload.single('cover_image'), postValidation, validate, postController.createPost);
router.get('/', optionalAuth, postController.getPosts);
router.get('/search', optionalAuth, postController.searchPosts);
router.get('/:id', optionalAuth, postController.getPost);
router.put('/:id', authMiddleware, upload.single('cover_image'), postValidation, validate, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

// Comment Routes (nested under posts)
router.post('/:postId/comments', authMiddleware, commentValidation, validate, commentController.createComment);
router.get('/:postId/comments', commentController.getCommentsByPost);

// Reaction/Like Routes (nested under posts)
router.post('/:postId/like', authMiddleware, reactionController.likePost);
router.delete('/:postId/like', authMiddleware, reactionController.unlikePost);
router.get('/:postId/likes', reactionController.getPostLikes);

// Saved Post Routes (nested under posts)
router.post('/:postId/save', authMiddleware, savedPostController.savePost);
router.delete('/:postId/save', authMiddleware, savedPostController.unsavePost);

module.exports = router;