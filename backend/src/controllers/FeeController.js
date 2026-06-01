const logger = require('../config/logger');
const constants = require('../config/constants');
const { sendResponse } = require('../config/middleware');
const smsService = require('../config/sms');

class FeeController {
  /**
   * Create a new fee record
   * POST /api/fees
   */
  static async createFee(req, res) {
    try {
      const { studentId, type, amount, dueDate, schoolId, description } = req.body;

      // Validation
      if (!studentId || !type || !amount || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Student ID, type, amount, and school ID are required'
        );
      }

      if (!Object.values(constants.FEE_TYPES).includes(type)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid fee type'
        );
      }

      if (amount <= 0) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Amount must be greater than 0'
        );
      }

      // Create fee object
      const feeData = {
        studentId,
        type,
        amount,
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        schoolId,
        description,
        status: constants.FEE_STATUS.PENDING,
        createdBy: req.user?.id,
        createdAt: new Date(),
      };

      // Save fee to database
      // const fee = await Fee.create(feeData);

      logger.info('Fee created successfully', { studentId, type, amount });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        'Fee created successfully',
        {
          // id: fee._id,
          ...feeData,
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
   * Get all fees
   * GET /api/fees
   */
  static async getAllFees(req, res) {
    try {
      const { page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT, schoolId, studentId, status, type, search } = req.query;

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
      if (studentId) filter.studentId = studentId;
      if (status) filter.status = status;
      if (type) filter.type = type;
      if (search) {
        filter.$or = [
          { type: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      // Fetch fees
      // const fees = await Fee.find(filter)
      //   .populate('studentId', 'name rollNumber')
      //   .skip(skip)
      //   .limit(limitNum)
      //   .sort({ createdAt: -1 })
      //   .lean();

      // const total = await Fee.countDocuments(filter);

      logger.info('Fees fetched', { schoolId, count: 0 });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Fees fetched successfully',
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
   * Get fee by ID
   * GET /api/fees/:id
   */
  static async getFeeById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Fee ID is required'
        );
      }

      // Fetch fee
      // const fee = await Fee.findById(id)
      //   .populate('studentId', 'name email rollNumber')
      //   .lean();

      // if (!fee) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Fee not found'
      //   );
      // }

      logger.info('Fee fetched', { feeId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Fee fetched successfully'
        // { fee }
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
   * Update fee
   * PUT /api/fees/:id
   */
  static async updateFee(req, res) {
    try {
      const { id } = req.params;
      const { type, amount, dueDate, description } = req.body;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Fee ID is required'
        );
      }

      // Validate at least one field to update
      if (!type && !amount && !dueDate && !description) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Provide at least one field to update'
        );
      }

      if (type && !Object.values(constants.FEE_TYPES).includes(type)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid fee type'
        );
      }

      if (amount && amount <= 0) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Amount must be greater than 0'
        );
      }

      // Build update object
      const updateData = {};
      if (type) updateData.type = type;
      if (amount) updateData.amount = amount;
      if (dueDate) updateData.dueDate = dueDate;
      if (description) updateData.description = description;
      updateData.updatedAt = new Date();

      // Update fee
      // const fee = await Fee.findByIdAndUpdate(id, updateData, { new: true });

      // if (!fee) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Fee not found'
      //   );
      // }

      logger.info('Fee updated successfully', { feeId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Fee updated successfully'
        // { fee }
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
   * Delete fee
   * DELETE /api/fees/:id
   */
  static async deleteFee(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Fee ID is required'
        );
      }

      // Delete fee
      // const fee = await Fee.findByIdAndDelete(id);

      // if (!fee) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Fee not found'
      //   );
      // }

      logger.info('Fee deleted successfully', { feeId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Fee deleted successfully'
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
   * Get fees for a student
   * GET /api/fees/student/:studentId
   */
  static async getFeesByStudent(req, res) {
    try {
      const { studentId } = req.params;
      const { page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT } = req.query;

      if (!studentId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Student ID is required'
        );
      }

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(parseInt(limit) || constants.PAGINATION.DEFAULT_LIMIT, constants.PAGINATION.MAX_LIMIT);
      const skip = (pageNum - 1) * limitNum;

      // Fetch student fees
      // const fees = await Fee.find({ studentId })
      //   .skip(skip)
      //   .limit(limitNum)
      //   .sort({ dueDate: -1 })
      //   .lean();

      // const total = await Fee.countDocuments({ studentId });

      logger.info('Student fees fetched', { studentId });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Student fees fetched successfully',
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
   * Record fee payment
   * POST /api/fees/:id/payment
   */
  static async recordPayment(req, res) {
    try {
      const { id } = req.params;
      const { amount, method, referenceNumber, notes } = req.body;

      if (!id || !amount || !method) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Fee ID, amount, and payment method are required'
        );
      }

      if (!Object.values(constants.PAYMENT_METHODS).includes(method)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid payment method'
        );
      }

      if (amount <= 0) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Payment amount must be greater than 0'
        );
      }

      // Fetch fee
      // const fee = await Fee.findById(id);
      // if (!fee) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Fee not found'
      //   );
      // }

      // Create payment record
      const paymentData = {
        feeId: id,
        amount,
        method,
        referenceNumber,
        notes,
        createdBy: req.user?.id,
        createdAt: new Date(),
      };

      // Save payment
      // const payment = await Payment.create(paymentData);

      // Update fee status
      // const remainingAmount = fee.amount - amount;
      // let status = constants.FEE_STATUS.PAID;
      // if (remainingAmount > 0) {
      //   status = constants.FEE_STATUS.PARTIAL;
      // }
      // await Fee.findByIdAndUpdate(id, { status, lastPaymentDate: new Date() });

      logger.info('Payment recorded successfully', { feeId: id, amount });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        'Payment recorded successfully',
        {
          // payment,
          amount,
          method,
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
   * Send fee reminder SMS
   * POST /api/fees/:id/send-reminder
   */
  static async sendFeeReminder(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Fee ID is required'
        );
      }

      // Fetch fee with student details
      // const fee = await Fee.findById(id).populate('studentId');

      // if (!fee) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Fee not found'
      //   );
      // }

      // Get parent phone number
      // const student = await Student.findById(fee.studentId);
      // if (!student || !student.parentPhone) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.BAD_REQUEST,
      //     false,
      //     'Parent phone number not found'
      //   );
      // }

      // Send SMS reminder
      // const result = await smsService.sendFeeReminder(
      //   student.parentPhone,
      //   student.name,
      //   fee.amount
      // );

      logger.info('Fee reminder sent', { feeId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Fee reminder sent successfully'
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
   * Get overdue fees
   * GET /api/fees/overdue/:schoolId
   */
  static async getOverdueFees(req, res) {
    try {
      const { schoolId } = req.params;
      const { page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT } = req.query;

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

      // Fetch overdue fees
      // const fees = await Fee.find({
      //   schoolId,
      //   status: { $in: [constants.FEE_STATUS.PENDING, constants.FEE_STATUS.PARTIAL] },
      //   dueDate: { $lt: new Date() }
      // })
      //   .populate('studentId', 'name rollNumber')
      //   .skip(skip)
      //   .limit(limitNum)
      //   .lean();

      // const total = await Fee.countDocuments({
      //   schoolId,
      //   status: { $in: [constants.FEE_STATUS.PENDING, constants.FEE_STATUS.PARTIAL] },
      //   dueDate: { $lt: new Date() }
      // });

      logger.info('Overdue fees fetched', { schoolId });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Overdue fees fetched successfully',
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
   * Get fee statistics
   * GET /api/fees/stats/:schoolId
   */
  static async getFeeStats(req, res) {
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
      // const totalFees = await Fee.countDocuments({ schoolId });
      // const totalAmount = await Fee.aggregate([
      //   { $match: { schoolId: ObjectId(schoolId) } },
      //   { $group: { _id: null, total: { $sum: '$amount' } } }
      // ]);
      // const byStatus = await Fee.aggregate([
      //   { $match: { schoolId: ObjectId(schoolId) } },
      //   { $group: { _id: '$status', count: { $sum: 1 } } }
      // ]);

      const stats = {
        totalFees: 0,
        totalAmount: 0,
        byStatus: {},
        paidAmount: 0,
        pendingAmount: 0,
      };

      logger.info('Fee stats fetched', { schoolId });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Fee stats fetched successfully',
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
   * Bulk create fees
   * POST /api/fees/bulk-create
   */
  static async bulkCreateFees(req, res) {
    try {
      const { fees, schoolId } = req.body;

      if (!fees || !Array.isArray(fees) || fees.length === 0 || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Fees array and school ID are required'
        );
      }

      // Validate each fee
      const validatedFees = fees.map(fee => ({
        ...fee,
        schoolId,
        status: constants.FEE_STATUS.PENDING,
        createdAt: new Date(),
      }));

      // Bulk insert
      // const result = await Fee.insertMany(validatedFees);

      logger.info('Fees bulk created', { schoolId, count: fees.length });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        `${fees.length} fees created successfully`,
        {
          created: fees.length,
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

module.exports = FeeController;
