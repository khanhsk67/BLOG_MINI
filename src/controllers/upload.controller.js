const uploadService = require('../services/upload.service');
const { successResponse } = require('../utils/response');
const { ValidationError } = require('../utils/errors');

/**
 * Upload Controller
 * Handles file upload endpoints
 */

class UploadController {
  /**
   * POST /api/upload/avatar
   * Upload user avatar
   */
  async uploadAvatar(req, res, next) {
    try {
      if (!req.file) {
        throw new ValidationError('No file uploaded');
      }

      const avatarUrl = await uploadService.uploadAvatar(req.file);

      // Update user avatar in database
      const { User } = require('../models');
      const user = await User.findByPk(req.user.id);

      // Delete old avatar if exists
      if (user.avatar_url) {
        await uploadService.deleteFile(user.avatar_url).catch(() => {
          // Ignore errors when deleting old avatar
        });
      }

      await user.update({ avatar_url: avatarUrl });

      return successResponse(
        res,
        {
          avatar_url: avatarUrl,
          user: {
            id: user.id,
            username: user.username,
            avatar_url: user.avatar_url
          }
        },
        'Avatar uploaded successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/upload/post-cover
   * Upload post cover image
   */
  async uploadPostCover(req, res, next) {
    try {
      if (!req.file) {
        throw new ValidationError('No file uploaded');
      }

      const coverUrl = await uploadService.uploadPostCover(req.file);

      return successResponse(
        res,
        {
          cover_url: coverUrl,
          file_info: {
            original_name: req.file.originalname,
            size: uploadService.formatFileSize(req.file.size),
            mime_type: req.file.mimetype
          }
        },
        'Cover image uploaded successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/upload/post-images
   * Upload multiple images for post content
   */
  async uploadPostImages(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        throw new ValidationError('No files uploaded');
      }

      const imageUrls = await uploadService.uploadPostImages(req.files);

      return successResponse(
        res,
        {
          image_urls: imageUrls,
          count: imageUrls.length,
          files_info: req.files.map(file => ({
            original_name: file.originalname,
            size: uploadService.formatFileSize(file.size),
            mime_type: file.mimetype
          }))
        },
        `${imageUrls.length} image(s) uploaded successfully`
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/upload/file
   * Delete uploaded file
   */
  async deleteFile(req, res, next) {
    try {
      const { file_url } = req.body;

      if (!file_url) {
        throw new ValidationError('File URL is required');
      }

      const result = await uploadService.deleteFile(file_url);

      return successResponse(res, result, 'File deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadController();
