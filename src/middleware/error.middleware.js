const { ApiError } = require('../utils/errors');
const { errorResponse } = require('../utils/response');

/**
 * Handle Sequelize validation errors
 */
const handleSequelizeValidationError = (err) => {
  const errors = err.errors.map(error => ({
    field: error.path,
    message: error.message
  }));

  return {
    statusCode: 400,
    message: 'Validation error',
    errors
  };
};

/**
 * Handle Sequelize unique constraint errors
 */
const handleSequelizeUniqueConstraintError = (err) => {
  const field = err.errors[0]?.path || 'field';
  const message = `${field} already exists`;

  return {
    statusCode: 409,
    message,
    errors: [{ field, message }]
  };
};

/**
 * Handle Sequelize foreign key constraint errors
 */
const handleSequelizeForeignKeyConstraintError = (err) => {
  return {
    statusCode: 400,
    message: 'Invalid reference to related resource',
    errors: [{ message: err.message }]
  };
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => ({
  statusCode: 401,
  message: 'Invalid token. Please log in again.'
});

const handleJWTExpiredError = () => ({
  statusCode: 401,
  message: 'Your token has expired. Please log in again.'
});

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error for debugging (in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const customError = handleSequelizeValidationError(err);
    error.message = customError.message;
    error.statusCode = customError.statusCode;
    error.errors = customError.errors;
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const customError = handleSequelizeUniqueConstraintError(err);
    error.message = customError.message;
    error.statusCode = customError.statusCode;
    error.errors = customError.errors;
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const customError = handleSequelizeForeignKeyConstraintError(err);
    error.message = customError.message;
    error.statusCode = customError.statusCode;
    error.errors = customError.errors;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const customError = handleJWTError();
    error.message = customError.message;
    error.statusCode = customError.statusCode;
  }

  if (err.name === 'TokenExpiredError') {
    const customError = handleJWTExpiredError();
    error.message = customError.message;
    error.statusCode = customError.statusCode;
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    error.message = 'File upload error: ' + err.message;
    error.statusCode = 400;
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Send error response
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      error: err
    })
  });
};

/**
 * Handle 404 - Not Found
 */
const notFound = (req, res, next) => {
  const error = new ApiError(
    `Route not found - ${req.originalUrl}`,
    404
  );
  next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};
