const logger = require('../config/logger');
const constants = require('../config/constants');
const { sendResponse } = require('../config/middleware');

class SchoolController {
  /**
   * Create a new school
   * POST /api/schools
   */
  static async createSchool(req, res) {
    try {
      const { name, address, city, state, zipCode, phone, email, contactPerson } = req.body;

      if (!name || !address) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'School name and address are required'
        );
      }

      const schoolData = {
        name,
        address,
        city,
        state,
        zipCode,
        phone,
        email,
        contactPerson,
        createdBy: req.user?.id,
        createdAt: new Date(),
        status: 'active',
      };

      // Save to DB
      // const school = await School.create(schoolData);

      logger.info('School created', { name });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        'School created successfully',
        {
          // id: school._id,
          ...schoolData,
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
   * Get list of schools
   * GET /api/schools
   */
  static async getAllSchools(req, res) {
    try {
      const { page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT, search, status, city } = req.query;

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(parseInt(limit) || constants.PAGINATION.DEFAULT_LIMIT, constants.PAGINATION.MAX_LIMIT);
      const skip = (pageNum - 1) * limitNum;

      const filter = {};
      if (status) filter.status = status;
      if (city) filter.city = city;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
        ];
      }

      // const schools = await School.find(filter).skip(skip).limit(limitNum).lean();
      // const total = await School.countDocuments(filter);

      logger.info('Schools fetched', { count: 0 });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Schools fetched successfully',
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
   * Get school by ID
   * GET /api/schools/:id
   */
  static async getSchoolById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'School ID is required'
        );
      }

      // const school = await School.findById(id).lean();
      // if (!school) return sendResponse(res, constants.STATUS_CODES.NOT_FOUND, false, 'School not found');

      logger.info('School fetched', { schoolId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'School fetched successfully'
        // { school }
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
   * Update school information
   * PUT /api/schools/:id
   */
  static async updateSchool(req, res) {
    try {
      const { id } = req.params;
      const { name, address, city, state, zipCode, phone, email, contactPerson, status } = req.body;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'School ID is required'
        );
      }

      if (!name && !address && !city && !state && !zipCode && !phone && !email && !contactPerson && !status) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Provide at least one field to update'
        );
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (address) updateData.address = address;
      if (city) updateData.city = city;
      if (state) updateData.state = state;
      if (zipCode) updateData.zipCode = zipCode;
      if (phone) updateData.phone = phone;
      if (email) updateData.email = email;
      if (contactPerson) updateData.contactPerson = contactPerson;
      if (status) updateData.status = status;
      updateData.updatedAt = new Date();

      // const school = await School.findByIdAndUpdate(id, updateData, { new: true }).lean();
      // if (!school) return sendResponse(res, constants.STATUS_CODES.NOT_FOUND, false, 'School not found');

      logger.info('School updated', { schoolId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'School updated successfully'
        // { school }
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
   * Delete school
   * DELETE /api/schools/:id
   */
  static async deleteSchool(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'School ID is required'
        );
      }

      // const school = await School.findByIdAndDelete(id);
      // if (!school) return sendResponse(res, constants.STATUS_CODES.NOT_FOUND, false, 'School not found');

      logger.info('School deleted', { schoolId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'School deleted successfully'
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
   * Update school settings
   * PATCH /api/schools/:id/settings
   */
  static async updateSettings(req, res) {
    try {
      const { id } = req.params;
      const { settings } = req.body; // settings is an object

      if (!id || !settings || typeof settings !== 'object') {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'School ID and settings object are required'
        );
      }

      // const school = await School.findByIdAndUpdate(id, { $set: { settings: { ...school.settings, ...settings } } }, { new: true }).lean();
      // if (!school) return sendResponse(res, constants.STATUS_CODES.NOT_FOUND, false, 'School not found');

      logger.info('School settings updated', { schoolId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'School settings updated successfully'
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
   * Manage subscription (stub)
   * POST /api/schools/:id/subscription
   */
  static async manageSubscription(req, res) {
    try {
      const { id } = req.params;
      const { planId, action } = req.body; // action: subscribe|cancel|upgrade

      if (!id || !planId || !action) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'School ID, plan ID, and action are required'
        );
      }

      // Integrate with billing system
      logger.info('Subscription action', { schoolId: id, planId, action });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        `Subscription ${action} executed successfully`
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
   * Get school statistics
   * GET /api/schools/:id/stats
   */
  static async getSchoolStats(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'School ID is required'
        );
      }

      // Gather statistics: students, users, fees, machines
      const stats = {
        students: 0,
        users: 0,
        totalFees: 0,
        collectedFees: 0,
        machines: 0,
      };

      logger.info('School stats fetched', { schoolId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'School stats fetched successfully',
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
   * Bulk import schools
   * POST /api/schools/bulk-import
   */
  static async bulkImportSchools(req, res) {
    try {
      const { schools } = req.body;

      if (!schools || !Array.isArray(schools) || schools.length === 0) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Schools array is required'
        );
      }

      // Validate and prepare schools
      const prepared = schools.map(s => ({ ...s, createdAt: new Date(), status: s.status || 'active' }));

      // const result = await School.insertMany(prepared);

      logger.info('Schools bulk imported', { count: schools.length });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        `${schools.length} schools imported successfully`,
        { imported: schools.length }
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

module.exports = SchoolController;
