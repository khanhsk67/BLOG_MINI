const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const authConfig = require('../config/auth');
const {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError
} = require('../utils/errors');

class AuthService {
  /**
   * Register new user
   */
  async registerUser(userData) {
    const { email, password, username, display_name } = userData;

    // Check if email already exists
    const existingEmail = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingEmail) {
      throw new ConflictError('Email already registered');
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ where: { username: username.toLowerCase() } });
    if (existingUsername) {
      throw new ConflictError('Username already taken');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Generate email verification token
    const verificationToken = this.generateVerificationToken();
    const verificationExpires = new Date(Date.now() + authConfig.email.verificationTokenExpires);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      username: username.toLowerCase(),
      display_name: display_name || username,
      email_verification_token: verificationToken,
      email_verification_expires: verificationExpires,
      role: 'user'
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    // TODO: Send verification email
    // await emailService.sendVerificationEmail(user.email, verificationToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
      message: 'Registration successful. Please check your email to verify your account.'
    };
  }

  /**
   * Login user
   */
  async loginUser(email, password) {
    // Find user by email
    const user = await User.findOne({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if account is active
    if (!user.is_active) {
      throw new AuthenticationError('Your account has been deactivated. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Update last login
    await user.update({ last_login_at: new Date() });

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    return {
      user: this.sanitizeUser(user),
      tokens,
      message: 'Login successful'
    };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, authConfig.jwt.refreshSecret);

      // Get user
      const user = await User.findByPk(decoded.userId);
      if (!user || !user.is_active) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Generate new access token
      const accessToken = this.generateAccessToken(user.id);

      return {
        accessToken,
        message: 'Token refreshed successfully'
      };
    } catch (error) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token) {
    const user = await User.findOne({
      where: {
        email_verification_token: token,
        email_verification_expires: { [require('sequelize').Op.gt]: new Date() }
      }
    });

    if (!user) {
      throw new NotFoundError('User', 'Invalid or expired verification token');
    }

    await user.update({
      email_verified: true,
      email_verification_token: null,
      email_verification_expires: null
    });

    return {
      message: 'Email verified successfully'
    };
  }

  /**
   * Request password reset
   */
  async forgotPassword(email) {
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      // Don't reveal if email exists or not
      return {
        message: 'If the email exists, a password reset link has been sent.'
      };
    }

    // Generate reset token
    const resetToken = this.generateVerificationToken();
    const resetExpires = new Date(Date.now() + authConfig.email.resetPasswordTokenExpires);

    await user.update({
      password_reset_token: resetToken,
      password_reset_expires: resetExpires
    });

    // TODO: Send password reset email
    // await emailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message: 'If the email exists, a password reset link has been sent.'
    };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      where: {
        password_reset_token: token,
        password_reset_expires: { [require('sequelize').Op.gt]: new Date() }
      }
    });

    if (!user) {
      throw new NotFoundError('User', 'Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    await user.update({
      password: hashedPassword,
      password_reset_token: null,
      password_reset_expires: null
    });

    return {
      message: 'Password reset successfully'
    };
  }

  /**
   * Change password (for authenticated users)
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new NotFoundError('User');
    }

    // Verify current password
    const isPasswordValid = await this.comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    await user.update({ password: hashedPassword });

    return {
      message: 'Password changed successfully'
    };
  }

  /**
   * Hash password
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, authConfig.bcrypt.saltRounds);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate access and refresh tokens
   */
  generateTokens(userId) {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);

    return {
      accessToken,
      refreshToken,
      expiresIn: authConfig.jwt.expiresIn
    };
  }

  /**
   * Generate access token
   */
  generateAccessToken(userId) {
    return jwt.sign(
      { userId },
      authConfig.jwt.secret,
      { expiresIn: authConfig.jwt.expiresIn }
    );
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(userId) {
    return jwt.sign(
      { userId },
      authConfig.jwt.refreshSecret,
      { expiresIn: authConfig.jwt.refreshExpiresIn }
    );
  }

  /**
   * Generate verification token
   */
  generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Remove sensitive data from user object
   */
  sanitizeUser(user) {
    const userObj = user.toJSON();
    delete userObj.password;
    delete userObj.password_reset_token;
    delete userObj.password_reset_expires;
    delete userObj.email_verification_token;
    delete userObj.email_verification_expires;
    return userObj;
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, authConfig.jwt.secret);
    } catch (error) {
      throw new AuthenticationError('Invalid token');
    }
  }
}

module.exports = new AuthService();
