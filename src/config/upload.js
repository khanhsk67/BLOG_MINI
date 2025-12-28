const multer = require('multer');
const path = require('path');
const { ValidationError } = require('../utils/errors');

/**
 * Upload Configuration
 * Supports both local storage and memory storage (for AWS S3)
 */

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * File filter to validate uploads
 */
const imageFileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ValidationError(
        `Invalid file type. Only ${ALLOWED_IMAGE_TYPES.join(', ')} are allowed`
      ),
      false
    );
  }
};

/**
 * Memory storage for AWS S3 upload
 * Stores files in memory as Buffer
 */
const memoryStorage = multer.memoryStorage();

/**
 * Disk storage for local development
 * Saves files to uploads directory
 */
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

/**
 * Multer configuration for AWS S3 (memory storage)
 */
const uploadToMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: imageFileFilter
});

/**
 * Multer configuration for local storage
 */
const uploadToDisk = multer({
  storage: diskStorage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: imageFileFilter
});

/**
 * Choose storage based on environment
 * Use S3 in production, local storage in development
 */
const useS3 = process.env.AWS_S3_BUCKET && process.env.NODE_ENV === 'production';

module.exports = {
  // Main upload middleware (chooses between S3 and local)
  upload: useS3 ? uploadToMemory : uploadToDisk,

  // Specific upload methods
  uploadToMemory,
  uploadToDisk,

  // Configuration
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  useS3
};
