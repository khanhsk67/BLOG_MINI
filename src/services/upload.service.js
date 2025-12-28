const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs').promises;
const { InternalServerError } = require('../utils/errors');

/**
 * Upload Service
 * Handles file uploads to AWS S3 or local storage
 */

class UploadService {
  constructor() {
    // Initialize AWS S3
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });

    this.bucket = process.env.AWS_S3_BUCKET;
    this.useS3 = this.bucket && process.env.NODE_ENV === 'production';
  }

  /**
   * Upload file to S3
   * @param {Buffer} fileBuffer - File buffer from multer
   * @param {string} fileName - Desired file name
   * @param {string} mimeType - File MIME type
   * @param {string} folder - S3 folder (avatars, posts, etc.)
   * @returns {Promise<string>} - URL of uploaded file
   */
  async uploadToS3(fileBuffer, fileName, mimeType, folder = 'uploads') {
    try {
      const key = `${folder}/${Date.now()}-${fileName}`;

      const params = {
        Bucket: this.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: 'public-read'
      };

      const result = await this.s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new InternalServerError('Failed to upload file to S3');
    }
  }

  /**
   * Delete file from S3
   * @param {string} fileUrl - Full URL of file to delete
   */
  async deleteFromS3(fileUrl) {
    try {
      // Extract key from URL
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1); // Remove leading slash

      const params = {
        Bucket: this.bucket,
        Key: key
      };

      await this.s3.deleteObject(params).promise();
      return { message: 'File deleted successfully' };
    } catch (error) {
      console.error('S3 Delete Error:', error);
      throw new InternalServerError('Failed to delete file from S3');
    }
  }

  /**
   * Upload file (chooses between S3 and local)
   * @param {Object} file - Multer file object
   * @param {string} folder - Upload folder
   * @returns {Promise<string>} - URL of uploaded file
   */
  async uploadFile(file, folder = 'uploads') {
    if (this.useS3) {
      // Upload to S3
      return await this.uploadToS3(
        file.buffer,
        file.originalname,
        file.mimetype,
        folder
      );
    } else {
      // Local storage - file already saved by multer
      // Return relative path
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      return `${baseUrl}/uploads/${file.filename}`;
    }
  }

  /**
   * Upload avatar image
   * @param {Object} file - Multer file object
   * @returns {Promise<string>} - Avatar URL
   */
  async uploadAvatar(file) {
    return await this.uploadFile(file, 'avatars');
  }

  /**
   * Upload post cover image
   * @param {Object} file - Multer file object
   * @returns {Promise<string>} - Cover image URL
   */
  async uploadPostCover(file) {
    return await this.uploadFile(file, 'posts');
  }

  /**
   * Upload multiple images for post content
   * @param {Array<Object>} files - Array of multer file objects
   * @returns {Promise<Array<string>>} - Array of image URLs
   */
  async uploadPostImages(files) {
    return await Promise.all(
      files.map(file => this.uploadFile(file, 'posts/content'))
    );
  }

  /**
   * Delete file (local or S3)
   * @param {string} fileUrl - URL of file to delete
   */
  async deleteFile(fileUrl) {
    if (this.useS3) {
      return await this.deleteFromS3(fileUrl);
    } else {
      // Delete from local storage
      try {
        const fileName = path.basename(fileUrl);
        const filePath = path.join(__dirname, '../../uploads', fileName);
        await fs.unlink(filePath);
        return { message: 'File deleted successfully' };
      } catch (error) {
        console.error('Local Delete Error:', error);
        // Don't throw error if file doesn't exist
        return { message: 'File not found or already deleted' };
      }
    }
  }

  /**
   * Get file size in human-readable format
   * @param {number} bytes
   * @returns {string}
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Validate image dimensions (if needed)
   * @param {Buffer} buffer - Image buffer
   * @returns {Promise<Object>} - Image dimensions
   */
  async getImageDimensions(buffer) {
    // This would require a library like 'sharp' or 'jimp'
    // For now, return placeholder
    return { width: 0, height: 0 };
  }
}

module.exports = new UploadService();
