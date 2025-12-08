const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { authMiddleware, optionalAuth } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');

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

// Routes
router.post('/', authMiddleware, postValidation, validate, postController.createPost);
router.get('/', optionalAuth, postController.getPosts);
router.get('/search', optionalAuth, postController.searchPosts);
router.get('/:id', optionalAuth, postController.getPost);
router.put('/:id', authMiddleware, postValidation, validate, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;