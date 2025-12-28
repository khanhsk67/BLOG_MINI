const authService = require('../services/auth.service');
const { successResponse, createdResponse } = require('../utils/response');

class AuthController {
  /**
   * POST /api/auth/register
   * Register new user
   */
  async register(req, res, next) {
    try {
      const { email, password, username, display_name } = req.body;

      const result = await authService.registerUser({
        email,
        password,
        username,
        display_name
      });

      return createdResponse(res, result, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Login user
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.loginUser(email, password);

      return successResponse(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Logout user (client-side token removal)
   */
  async logout(req, res, next) {
    try {
      // In JWT, logout is handled client-side by removing the token
      // Optionally, you can implement token blacklisting with Redis

      return successResponse(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh-token
   * Refresh access token
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      const result = await authService.refreshAccessToken(refreshToken);

      return successResponse(res, result, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/verify-email
   * Verify email with token
   */
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.body;

      const result = await authService.verifyEmail(token);

      return successResponse(res, result, 'Email verified successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/forgot-password
   * Request password reset
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const result = await authService.forgotPassword(email);

      return successResponse(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/reset-password
   * Reset password with token
   */
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      const result = await authService.resetPassword(token, newPassword);

      return successResponse(res, result, 'Password reset successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/change-password
   * Change password (authenticated)
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const result = await authService.changePassword(userId, currentPassword, newPassword);

      return successResponse(res, result, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Get current user info
   */
  async getCurrentUser(req, res, next) {
    try {
      return successResponse(res, { user: req.user }, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
