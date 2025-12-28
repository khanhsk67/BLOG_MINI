const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { upload } = require('../config/upload');

/**
 * Upload Routes
 * All routes require authentication
 */

/**
 * POST /api/upload/avatar
 * Upload user avatar
 * @body {file} avatar - Image file (max 5MB)
 */
router.post(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  uploadController.uploadAvatar
);

/**
 * POST /api/upload/post-cover
 * Upload post cover image
 * @body {file} cover - Image file (max 5MB)
 */
router.post(
  '/post-cover',
  authMiddleware,
  upload.single('cover'),
  uploadController.uploadPostCover
);

/**
 * POST /api/upload/post-images
 * Upload multiple images for post content
 * @body {file[]} images - Multiple image files (max 5 files, 5MB each)
 */
router.post(
  '/post-images',
  authMiddleware,
  upload.array('images', 5),
  uploadController.uploadPostImages
);

/**
 * DELETE /api/upload/file
 * Delete uploaded file
 * @body {string} file_url - URL of file to delete
 */
router.delete(
  '/file',
  authMiddleware,
  uploadController.deleteFile
);

module.exports = router;
