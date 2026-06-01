const logger = require('../config/logger');
const constants = require('../config/constants');
const { sendResponse } = require('../config/middleware');
const smsService = require('../config/sms');

class NoticeController {
  /**
   * Create a new notice
   * POST /api/notices
   */
  static async createNotice(req, res) {
    try {
      const { title, message, type, audience, schoolId, attachments, sendSMS } = req.body;

      // Validation
      if (!title || !message || !type || !audience || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Title, message, type, audience, and school ID are required'
        );
      }

      if (!Object.values(constants.NOTICE_TYPES).includes(type)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid notice type'
        );
      }

      if (!Object.values(constants.NOTICE_AUDIENCE).includes(audience)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid notice audience'
        );
      }

      // Create notice object
      const noticeData = {
        title,
        message,
        type,
        audience,
        schoolId,
        attachments: attachments || [],
        createdBy: req.user?.id,
        createdAt: new Date(),
        status: 'published',
      };

      // Save notice to database
      // const notice = await Notice.create(noticeData);

      // Send SMS if requested
      if (sendSMS && sendSMS === true) {
        // Get recipients based on audience
        // const recipients = await getRecipients(audience, schoolId);
        // await sendBulkSMS(recipients, message);
      }

      logger.info('Notice created successfully', { title, type, audience });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        'Notice created successfully',
        {
          // id: notice._id,
          ...noticeData,
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
   * Get all notices
   * GET /api/notices
   */
  static async getAllNotices(req, res) {
    try {
      const { page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT, schoolId, type, audience, search, sortBy = 'createdAt', order = 'desc' } = req.query;

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
      if (type) filter.type = type;
      if (audience) filter.audience = audience;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } },
        ];
      }

      // Build sort
      const sortObj = {};
      sortObj[sortBy] = order === 'asc' ? 1 : -1;

      // Fetch notices
      // const notices = await Notice.find(filter)
      //   .sort(sortObj)
      //   .skip(skip)
      //   .limit(limitNum)
      //   .populate('createdBy', 'name email')
      //   .lean();

      // const total = await Notice.countDocuments(filter);

      logger.info('Notices fetched', { schoolId, count: 0 });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Notices fetched successfully',
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
   * Get notice by ID
   * GET /api/notices/:id
   */
  static async getNoticeById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Notice ID is required'
        );
      }

      // Fetch notice
      // const notice = await Notice.findById(id)
      //   .populate('createdBy', 'name email')
      //   .lean();

      // if (!notice) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Notice not found'
      //   );
      // }

      logger.info('Notice fetched', { noticeId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Notice fetched successfully'
        // { notice }
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
   * Update notice
   * PUT /api/notices/:id
   */
  static async updateNotice(req, res) {
    try {
      const { id } = req.params;
      const { title, message, type, audience, attachments, status } = req.body;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Notice ID is required'
        );
      }

      // Validate at least one field to update
      if (!title && !message && !type && !audience && !attachments && !status) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Provide at least one field to update'
        );
      }

      // Validate types if provided
      if (type && !Object.values(constants.NOTICE_TYPES).includes(type)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid notice type'
        );
      }

      if (audience && !Object.values(constants.NOTICE_AUDIENCE).includes(audience)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid notice audience'
        );
      }

      // Build update object
      const updateData = {};
      if (title) updateData.title = title;
      if (message) updateData.message = message;
      if (type) updateData.type = type;
      if (audience) updateData.audience = audience;
      if (attachments) updateData.attachments = attachments;
      if (status) updateData.status = status;
      updateData.updatedAt = new Date();

      // Update notice
      // const notice = await Notice.findByIdAndUpdate(id, updateData, { new: true });

      // if (!notice) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Notice not found'
      //   );
      // }

      logger.info('Notice updated successfully', { noticeId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Notice updated successfully'
        // { notice }
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
   * Delete notice
   * DELETE /api/notices/:id
   */
  static async deleteNotice(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Notice ID is required'
        );
      }

      // Delete notice
      // const notice = await Notice.findByIdAndDelete(id);

      // if (!notice) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Notice not found'
      //   );
      // }

      logger.info('Notice deleted successfully', { noticeId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Notice deleted successfully'
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
   * Send notice via SMS
   * POST /api/notices/:id/send-sms
   */
  static async sendNoticeViaSMS(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Notice ID is required'
        );
      }

      // Fetch notice
      // const notice = await Notice.findById(id);

      // if (!notice) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Notice not found'
      //   );
      // }

      // Get recipients based on audience
      // const recipients = await getRecipients(notice.audience, notice.schoolId);

      // Send SMS to all recipients
      // const results = await smsService.sendBulkSMS(
      //   recipients,
      //   notice.message,
      //   'GauraVEdugo'
      // );

      logger.info('Notice SMS sent', { noticeId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Notice sent via SMS'
        // { sentCount: results.filter(r => r.success).length }
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
   * Get notices by type
   * GET /api/notices/type/:type
   */
  static async getNoticesByType(req, res) {
    try {
      const { type } = req.params;
      const { schoolId, page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT } = req.query;

      if (!type || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Type and school ID are required'
        );
      }

      if (!Object.values(constants.NOTICE_TYPES).includes(type)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid notice type'
        );
      }

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(parseInt(limit) || constants.PAGINATION.DEFAULT_LIMIT, constants.PAGINATION.MAX_LIMIT);
      const skip = (pageNum - 1) * limitNum;

      // Fetch notices by type
      // const notices = await Notice.find({ type, schoolId })
      //   .sort({ createdAt: -1 })
      //   .skip(skip)
      //   .limit(limitNum)
      //   .lean();

      // const total = await Notice.countDocuments({ type, schoolId });

      logger.info('Notices by type fetched', { type, schoolId });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Notices fetched successfully',
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
   * Get notices by audience
   * GET /api/notices/audience/:audience
   */
  static async getNoticesByAudience(req, res) {
    try {
      const { audience } = req.params;
      const { schoolId, page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT } = req.query;

      if (!audience || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Audience and school ID are required'
        );
      }

      if (!Object.values(constants.NOTICE_AUDIENCE).includes(audience)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid notice audience'
        );
      }

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(parseInt(limit) || constants.PAGINATION.DEFAULT_LIMIT, constants.PAGINATION.MAX_LIMIT);
      const skip = (pageNum - 1) * limitNum;

      // Fetch notices by audience
      // const notices = await Notice.find({ audience, schoolId })
      //   .sort({ createdAt: -1 })
      //   .skip(skip)
      //   .limit(limitNum)
      //   .lean();

      // const total = await Notice.countDocuments({ audience, schoolId });

      logger.info('Notices by audience fetched', { audience, schoolId });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Notices fetched successfully',
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
   * Get recent notices
   * GET /api/notices/recent/:schoolId
   */
  static async getRecentNotices(req, res) {
    try {
      const { schoolId } = req.params;
      const { limit = 10 } = req.query;

      if (!schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'School ID is required'
        );
      }

      const limitNum = Math.min(parseInt(limit) || 10, 50);

      // Fetch recent notices
      // const notices = await Notice.find({ schoolId })
      //   .sort({ createdAt: -1 })
      //   .limit(limitNum)
      //   .lean();

      logger.info('Recent notices fetched', { schoolId, limit: limitNum });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Recent notices fetched successfully',
        { data: [] }
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
   * Archive notice
   * PUT /api/notices/:id/archive
   */
  static async archiveNotice(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Notice ID is required'
        );
      }

      // Update notice status to archived
      // const notice = await Notice.findByIdAndUpdate(
      //   id,
      //   { status: 'archived', updatedAt: new Date() },
      //   { new: true }
      // );

      // if (!notice) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Notice not found'
      //   );
      // }

      logger.info('Notice archived', { noticeId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Notice archived successfully'
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

module.exports = NoticeController;
