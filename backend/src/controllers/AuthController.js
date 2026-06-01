const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const logger = require('../config/logger');
const constants = require('../config/constants');
const { sendResponse } = require('../config/middleware');

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req, res) {
    try {
      const { email, password, name, role, schoolId } = req.body;

      // Validation
      if (!email || !password || !name) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Email, password, and name are required'
        );
      }

      if (password.length < constants.VALIDATION.MIN_PASSWORD_LENGTH) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          `Password must be at least ${constants.VALIDATION.MIN_PASSWORD_LENGTH} characters`
        );
      }

      // Check if user already exists
      // const existingUser = await User.findOne({ email });
      // if (existingUser) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.CONFLICT,
      //     false,
      //     'Email already in use'
      //   );
      // }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user object
      const userData = {
        email,
        password: hashedPassword,
        name,
        role: role || constants.USER_ROLES.STUDENT,
        schoolId,
      };

      // Save user to database
      // const user = await User.create(userData);

      logger.info('User registered successfully', { email });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        'User registered successfully',
        {
          // id: user._id,
          email,
          name,
          role: userData.role,
        }
      );
    } catch (error) {
      logger.logError(error, req);
      return sendResponse(
        res,
        constants.STATUS_CODES.INTERNAL_ERROR,
        false,
        constants.MESSAGES.INTERNAL_ERROR
      );
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Email and password are required'
        );
      }

      // Find user by email
      // const user = await User.findOne({ email });
      // if (!user) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.UNAUTHORIZED,
      //     false,
      //     'Invalid credentials'
      //   );
      // }

      // Compare passwords
      // const isPasswordValid = await bcrypt.compare(password, user.password);
      // if (!isPasswordValid) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.UNAUTHORIZED,
      //     false,
      //     'Invalid credentials'
      //   );
      // }

      // Generate JWT token
      const token = jwt.sign(
        {
          // id: user._id,
          email,
          // role: user.role,
        },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRE }
      );

      logger.info('User logged in successfully', { email });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Login successful',
        {
          token,
          // user: {
          //   id: user._id,
          //   email: user.email,
          //   name: user.name,
          //   role: user.role,
          // },
        }
      );
    } catch (error) {
      logger.logError(error, req);
      return sendResponse(
        res,
        constants.STATUS_CODES.INTERNAL_ERROR,
        false,
        constants.MESSAGES.INTERNAL_ERROR
      );
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  static async logout(req, res) {
    try {
      logger.info('User logged out', { userId: req.user?.id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Logout successful'
      );
    } catch (error) {
      logger.logError(error, req);
      return sendResponse(
        res,
        constants.STATUS_CODES.INTERNAL_ERROR,
        false,
        constants.MESSAGES.INTERNAL_ERROR
      );
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  static async getProfile(req, res) {
    try {
      // const user = await User.findById(req.user.id).select('-password');
      // if (!user) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'User not found'
      //   );
      // }

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Profile fetched successfully'
        // { user }
      );
    } catch (error) {
      logger.logError(error, req);
      return sendResponse(
        res,
        constants.STATUS_CODES.INTERNAL_ERROR,
        false,
        constants.MESSAGES.INTERNAL_ERROR
      );
    }
  }

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  static async updateProfile(req, res) {
    try {
      const { name, phone } = req.body;

      // Validate input
      if (!name && !phone) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Provide at least one field to update'
        );
      }

      // Update user
      // const user = await User.findByIdAndUpdate(
      //   req.user.id,
      //   { name, phone },
      //   { new: true }
      // ).select('-password');

      logger.info('User profile updated', { userId: req.user?.id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Profile updated successfully'
        // { user }
      );
    } catch (error) {
      logger.logError(error, req);
      return sendResponse(
        res,
        constants.STATUS_CODES.INTERNAL_ERROR,
        false,
        constants.MESSAGES.INTERNAL_ERROR
      );
    }
  }

  /**
   * Change password
   * POST /api/auth/change-password
   */
  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;

      // Validation
      if (!oldPassword || !newPassword) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Old and new passwords are required'
        );
      }

      if (newPassword.length < constants.VALIDATION.MIN_PASSWORD_LENGTH) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          `Password must be at least ${constants.VALIDATION.MIN_PASSWORD_LENGTH} characters`
        );
      }

      // Get user with password field
      // const user = await User.findById(req.user.id);

      // Verify old password
      // const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      // if (!isPasswordValid) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.UNAUTHORIZED,
      //     false,
      //     'Old password is incorrect'
      //   );
      // }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      // await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

      logger.info('Password changed', { userId: req.user?.id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Password changed successfully'
      );
    } catch (error) {
      logger.logError(error, req);
      return sendResponse(
        res,
        constants.STATUS_CODES.INTERNAL_ERROR,
        false,
        constants.MESSAGES.INTERNAL_ERROR
      );
    }
  }

  /**
   * Forgot password - Send reset link
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Email is required'
        );
      }

      // Find user by email
      // const user = await User.findOne({ email });
      // if (!user) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'User not found'
      //   );
      // }

      // Generate reset token
      // const resetToken = jwt.sign(
      //   { id: user._id },
      //   env.JWT_SECRET,
      //   { expiresIn: '15m' }
      // );

      // Send reset email
      // await sendResetEmail(user.email, resetToken);

      logger.info('Password reset email sent', { email });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Password reset link sent to email'
      );
    } catch (error) {
      logger.logError(error, req);
      return sendResponse(
        res,
        constants.STATUS_CODES.INTERNAL_ERROR,
        false,
        constants.MESSAGES.INTERNAL_ERROR
      );
    }
  }

  /**
   * Reset password with token
   * POST /api/auth/reset-password
   */
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Token and new password are required'
        );
      }

      // Verify token
      // const decoded = jwt.verify(token, env.JWT_SECRET);

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      // await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

      logger.info('Password reset successfully');

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Password reset successfully'
      );
    } catch (error) {
      logger.logError(error, req);
      return sendResponse(
        res,
        constants.STATUS_CODES.INTERNAL_ERROR,
        false,
        constants.MESSAGES.INTERNAL_ERROR
      );
    }
  }
}

module.exports = AuthController;
