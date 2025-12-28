const express = require('express');
const router = express.Router();

// Import route modules
const postRoutes = require('./post.routes');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const commentRoutes = require('./comment.routes');
const notificationRoutes = require('./notification.routes');
const adminRoutes = require('./admin.routes');
const uploadRoutes = require('./upload.routes');

/**
 * API Routes
 */

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

// API documentation (placeholder)
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MiniBlog API',
    version: process.env.API_VERSION || 'v1',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      posts: '/api/posts',
      comments: '/api/comments',
      notifications: '/api/notifications',
      admin: '/api/admin',
      upload: '/api/upload',
      health: '/api/health'
    }
  });
});

module.exports = router;
