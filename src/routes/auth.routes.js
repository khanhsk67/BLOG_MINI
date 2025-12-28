const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');

/**
 * Validation rules
 */
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('display_name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Display name must be between 1 and 100 characters')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];

const verifyEmailValidation = [
  body('token')
    .notEmpty()
    .withMessage('Verification token is required')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail()
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('New password must contain at least one letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
];

/**
 * Auth Routes
 */

// Register new user
router.post('/register', registerValidation, validate, authController.register);

// Login user
router.post('/login', loginValidation, validate, authController.login);

// Logout user
router.post('/logout', authController.logout);

// Refresh access token
router.post('/refresh-token', refreshTokenValidation, validate, authController.refreshToken);

// Verify email
router.post('/verify-email', verifyEmailValidation, validate, authController.verifyEmail);

// Forgot password
router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);

// Reset password
router.post('/reset-password', resetPasswordValidation, validate, authController.resetPassword);

// Change password (authenticated)
router.post('/change-password', authMiddleware, changePasswordValidation, validate, authController.changePassword);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
