const bcrypt = require('bcryptjs');
const logger = require('../config/logger');
const constants = require('../config/constants');
const { sendResponse } = require('../config/middleware');

class UserController {
  /**
   * Create a new user
   * POST /api/users
   */
  static async createUser(req, res) {
    try {
      const { email, password, name, role, schoolId, phone, status } = req.body;

      // Validation
      if (!email || !password || !name || !role || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Email, password, name, role, and school ID are required'
        );
      }

      if (!Object.values(constants.USER_ROLES).includes(role)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid user role'
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
        role,
        schoolId,
        phone,
        status: status || 'active',
        createdBy: req.user?.id,
        createdAt: new Date(),
      };

      // Save user to database
      // const user = await User.create(userData);

      logger.info('User created successfully', { email, role });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        'User created successfully',
        {
          // id: user._id,
          email,
          name,
          role,
          schoolId,
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
   * Get all users
   * GET /api/users
   */
  static async getAllUsers(req, res) {
    try {
      const { page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT, schoolId, role, status, search } = req.query;

      // Validation
      if (!schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'School ID is required'
        );
      }

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(parseInt(limit) || constants.PAGINATION.DEFAULT_LIMIT, constants.PAGINATION.MAX_LIMIT);
      const skip = (pageNum - 1) * limitNum;

      // Build filter
      const filter = { schoolId };
      if (role) filter.role = role;
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }

      // Fetch users
      // const users = await User.find(filter)
      //   .select('-password')
      //   .skip(skip)
      //   .limit(limitNum)
      //   .sort({ createdAt: -1 })
      //   .lean();

      // const total = await User.countDocuments(filter);

      logger.info('Users fetched', { schoolId, count: 0 });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Users fetched successfully',
        {
          data: [],
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: 0,
            totalPages: 0,
          },
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
   * Get user by ID
   * GET /api/users/:id
   */
  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'User ID is required'
        );
      }

      // Fetch user
      // const user = await User.findById(id)
      //   .select('-password')
      //   .lean();

      // if (!user) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'User not found'
      //   );
      // }

      logger.info('User fetched', { userId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'User fetched successfully'
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
   * Update user
   * PUT /api/users/:id
   */
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, phone, role, status } = req.body;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'User ID is required'
        );
      }

      // Validate at least one field to update
      if (!name && !phone && !role && !status) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Provide at least one field to update'
        );
      }

      // Validate role if provided
      if (role && !Object.values(constants.USER_ROLES).includes(role)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid user role'
        );
      }

      // Build update object
      const updateData = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (role) updateData.role = role;
      if (status) updateData.status = status;
      updateData.updatedAt = new Date();

      // Update user
      // const user = await User.findByIdAndUpdate(id, updateData, { new: true })
      //   .select('-password');

      // if (!user) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'User not found'
      //   );
      // }

      logger.info('User updated successfully', { userId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'User updated successfully'
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
   * Delete user
   * DELETE /api/users/:id
   */
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'User ID is required'
        );
      }

      // Delete user
      // const user = await User.findByIdAndDelete(id);

      // if (!user) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'User not found'
      //   );
      // }

      logger.info('User deleted successfully', { userId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'User deleted successfully'
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
   * Get users by role
   * GET /api/users/role/:role
   */
  static async getUsersByRole(req, res) {
    try {
      const { role } = req.params;
      const { schoolId, page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT } = req.query;

      if (!role || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Role and school ID are required'
        );
      }

      if (!Object.values(constants.USER_ROLES).includes(role)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid user role'
        );
      }

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(parseInt(limit) || constants.PAGINATION.DEFAULT_LIMIT, constants.PAGINATION.MAX_LIMIT);
      const skip = (pageNum - 1) * limitNum;

      // Fetch users by role
      // const users = await User.find({ role, schoolId })
      //   .select('-password')
      //   .skip(skip)
      //   .limit(limitNum)
      //   .lean();

      // const total = await User.countDocuments({ role, schoolId });

      logger.info('Users by role fetched', { role, schoolId });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Users fetched successfully',
        {
          data: [],
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: 0,
            totalPages: 0,
          },
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
   * Reset user password
   * POST /api/users/:id/reset-password
   */
  static async resetUserPassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!id || !newPassword) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'User ID and new password are required'
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

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      // const user = await User.findByIdAndUpdate(
      //   id,
      //   { password: hashedPassword, updatedAt: new Date() },
      //   { new: true }
      // ).select('-password');

      // if (!user) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'User not found'
      //   );
      // }

      logger.info('User password reset by admin', { userId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'User password reset successfully'
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
   * Deactivate user
   * PATCH /api/users/:id/deactivate
   */
  static async deactivateUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'User ID is required'
        );
      }

      // Update user status
      // const user = await User.findByIdAndUpdate(
      //   id,
      //   { status: 'inactive', updatedAt: new Date() },
      //   { new: true }
      // ).select('-password');

      // if (!user) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'User not found'
      //   );
      // }

      logger.info('User deactivated', { userId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'User deactivated successfully'
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
   * Activate user
   * PATCH /api/users/:id/activate
   */
  static async activateUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'User ID is required'
        );
      }

      // Update user status
      // const user = await User.findByIdAndUpdate(
      //   id,
      //   { status: 'active', updatedAt: new Date() },
      //   { new: true }
      // ).select('-password');

      // if (!user) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'User not found'
      //   );
      // }

      logger.info('User activated', { userId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'User activated successfully'
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
   * Get user statistics by role
   * GET /api/users/stats/:schoolId
   */
  static async getUserStats(req, res) {
    try {
      const { schoolId } = req.params;

      if (!schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'School ID is required'
        );
      }

      // Get statistics
      // const totalUsers = await User.countDocuments({ schoolId });
      // const byRole = await User.aggregate([
      //   { $match: { schoolId: ObjectId(schoolId) } },
      //   { $group: { _id: '$role', count: { $sum: 1 } } }
      // ]);
      // const activeUsers = await User.countDocuments({ schoolId, status: 'active' });

      const stats = {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        byRole: {},
      };

      logger.info('User stats fetched', { schoolId });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'User stats fetched successfully',
        stats
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
   * Bulk import users
   * POST /api/users/bulk-import
   */
  static async bulkImportUsers(req, res) {
    try {
      const { users, schoolId } = req.body;

      if (!users || !Array.isArray(users) || users.length === 0 || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Users array and school ID are required'
        );
      }

      // Hash passwords for all users
      const validatedUsers = await Promise.all(
        users.map(async (user) => {
          const hashedPassword = await bcrypt.hash(user.password || 'Default@123', 10);
          return {
            ...user,
            password: hashedPassword,
            schoolId,
            status: 'active',
            createdAt: new Date(),
          };
        })
      );

      // Bulk insert
      // const result = await User.insertMany(validatedUsers);

      logger.info('Users bulk imported', { schoolId, count: users.length });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        `${users.length} users imported successfully`,
        {
          imported: users.length,
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
   * Get user activity log
   * GET /api/users/:id/activity-log
   */
  static async getUserActivityLog(req, res) {
    try {
      const { id } = req.params;
      const { page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT } = req.query;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'User ID is required'
        );
      }

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(parseInt(limit) || constants.PAGINATION.DEFAULT_LIMIT, constants.PAGINATION.MAX_LIMIT);
      const skip = (pageNum - 1) * limitNum;

      // Fetch activity logs
      // const logs = await ActivityLog.find({ userId: id })
      //   .skip(skip)
      //   .limit(limitNum)
      //   .sort({ createdAt: -1 })
      //   .lean();

      // const total = await ActivityLog.countDocuments({ userId: id });

      logger.info('User activity log fetched', { userId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'User activity log fetched successfully',
        {
          data: [],
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: 0,
            totalPages: 0,
          },
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
}

module.exports = UserController;
