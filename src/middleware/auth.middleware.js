const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('../utils/errors');
const { User } = require('../models');

/**
 * Authentication middleware - Verify JWT token
 * Requires valid JWT token in Authorization header
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided. Please log in.');
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('No token provided. Please log in.');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new AuthenticationError('User not found. Please log in again.');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new ForbiddenError('Your account has been deactivated.');
    }

    // Attach user to request object
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AuthenticationError('Invalid token. Please log in again.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Token expired. Please log in again.'));
    }
    next(error);
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided - continue without user
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    // Try to verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (user && user.is_active) {
      req.user = user;
      req.userId = user.id;
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};

/**
 * Admin-only middleware
 * Must be used after authMiddleware
 */
const adminOnly = (req, res, next) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required.');
  }

  if (req.user.role !== 'admin') {
    throw new ForbiddenError('Admin access required.');
  }

  next();
};

/**
 * Check if user owns the resource
 * Used for update/delete operations
 */
const checkOwnership = (resourceUserIdField = 'user_id') => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required.');
    }

    // Admin can bypass ownership check
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req[resourceUserIdField] || req.resource?.[resourceUserIdField];

    if (!resourceUserId) {
      throw new ForbiddenError('Unable to verify resource ownership.');
    }

    if (resourceUserId !== req.user.id) {
      throw new ForbiddenError('You do not have permission to modify this resource.');
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  optionalAuth,
  adminOnly,
  checkOwnership
};
