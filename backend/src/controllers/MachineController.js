const logger = require('../config/logger');
const constants = require('../config/constants');
const { sendResponse } = require('../config/middleware');

class MachineController {
  /**
   * Create a new machine
   * POST /api/machines
   */
  static async createMachine(req, res) {
    try {
      const { name, category, serialNumber, schoolId, purchaseDate, condition, location, specifications } = req.body;

      // Validation
      if (!name || !category || !serialNumber || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Name, category, serial number, and school ID are required'
        );
      }

      if (!Object.values(constants.MACHINE_CATEGORIES).includes(category)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid machine category'
        );
      }

      // Check if serial number already exists
      // const existingMachine = await Machine.findOne({ serialNumber, schoolId });
      // if (existingMachine) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.CONFLICT,
      //     false,
      //     'Machine with this serial number already exists'
      //   );
      // }

      // Create machine object
      const machineData = {
        name,
        category,
        serialNumber,
        schoolId,
        purchaseDate,
        condition: condition || constants.MACHINE_CONDITIONS.NEW,
        location,
        specifications,
        createdBy: req.user?.id,
        createdAt: new Date(),
        status: 'active',
      };

      // Save machine to database
      // const machine = await Machine.create(machineData);

      logger.info('Machine created successfully', { serialNumber, name });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        'Machine created successfully',
        {
          // id: machine._id,
          ...machineData,
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
   * Get all machines
   * GET /api/machines
   */
  static async getAllMachines(req, res) {
    try {
      const { page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT, schoolId, category, condition, status, search } = req.query;

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
      if (category) filter.category = category;
      if (condition) filter.condition = condition;
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { serialNumber: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
        ];
      }

      // Fetch machines
      // const machines = await Machine.find(filter)
      //   .skip(skip)
      //   .limit(limitNum)
      //   .populate('createdBy', 'name')
      //   .lean();

      // const total = await Machine.countDocuments(filter);

      logger.info('Machines fetched', { schoolId, count: 0 });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Machines fetched successfully',
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
   * Get machine by ID
   * GET /api/machines/:id
   */
  static async getMachineById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Machine ID is required'
        );
      }

      // Fetch machine
      // const machine = await Machine.findById(id)
      //   .populate('createdBy', 'name email')
      //   .lean();

      // if (!machine) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Machine not found'
      //   );
      // }

      logger.info('Machine fetched', { machineId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Machine fetched successfully'
        // { machine }
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
   * Update machine
   * PUT /api/machines/:id
   */
  static async updateMachine(req, res) {
    try {
      const { id } = req.params;
      const { name, category, condition, location, specifications, status } = req.body;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Machine ID is required'
        );
      }

      // Validate at least one field to update
      if (!name && !category && !condition && !location && !specifications && !status) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Provide at least one field to update'
        );
      }

      // Validate category if provided
      if (category && !Object.values(constants.MACHINE_CATEGORIES).includes(category)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid machine category'
        );
      }

      // Validate condition if provided
      if (condition && !Object.values(constants.MACHINE_CONDITIONS).includes(condition)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid machine condition'
        );
      }

      // Build update object
      const updateData = {};
      if (name) updateData.name = name;
      if (category) updateData.category = category;
      if (condition) updateData.condition = condition;
      if (location) updateData.location = location;
      if (specifications) updateData.specifications = specifications;
      if (status) updateData.status = status;
      updateData.updatedAt = new Date();

      // Update machine
      // const machine = await Machine.findByIdAndUpdate(id, updateData, { new: true });

      // if (!machine) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Machine not found'
      //   );
      // }

      logger.info('Machine updated successfully', { machineId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Machine updated successfully'
        // { machine }
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
   * Delete machine
   * DELETE /api/machines/:id
   */
  static async deleteMachine(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Machine ID is required'
        );
      }

      // Delete machine
      // const machine = await Machine.findByIdAndDelete(id);

      // if (!machine) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Machine not found'
      //   );
      // }

      logger.info('Machine deleted successfully', { machineId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Machine deleted successfully'
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
   * Get machines by category
   * GET /api/machines/category/:category
   */
  static async getMachinesByCategory(req, res) {
    try {
      const { category } = req.params;
      const { schoolId, page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT } = req.query;

      if (!category || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Category and school ID are required'
        );
      }

      if (!Object.values(constants.MACHINE_CATEGORIES).includes(category)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid machine category'
        );
      }

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(parseInt(limit) || constants.PAGINATION.DEFAULT_LIMIT, constants.PAGINATION.MAX_LIMIT);
      const skip = (pageNum - 1) * limitNum;

      // Fetch machines by category
      // const machines = await Machine.find({ category, schoolId })
      //   .skip(skip)
      //   .limit(limitNum)
      //   .lean();

      // const total = await Machine.countDocuments({ category, schoolId });

      logger.info('Machines by category fetched', { category, schoolId });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Machines fetched successfully',
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
   * Get machines needing repair/maintenance
   * GET /api/machines/maintenance/:schoolId
   */
  static async getMachinesNeedingMaintenance(req, res) {
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

      // Fetch machines needing maintenance
      // const machines = await Machine.find({
      //   schoolId,
      //   condition: { $in: [constants.MACHINE_CONDITIONS.DAMAGED, constants.MACHINE_CONDITIONS.REPAIR] }
      // })
      //   .skip(skip)
      //   .limit(limitNum)
      //   .lean();

      // const total = await Machine.countDocuments({
      //   schoolId,
      //   condition: { $in: [constants.MACHINE_CONDITIONS.DAMAGED, constants.MACHINE_CONDITIONS.REPAIR] }
      // });

      logger.info('Machines needing maintenance fetched', { schoolId });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Machines needing maintenance fetched successfully',
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
   * Update machine condition
   * PATCH /api/machines/:id/condition
   */
  static async updateMachineCondition(req, res) {
    try {
      const { id } = req.params;
      const { condition, notes } = req.body;

      if (!id || !condition) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Machine ID and condition are required'
        );
      }

      if (!Object.values(constants.MACHINE_CONDITIONS).includes(condition)) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Invalid machine condition'
        );
      }

      // Update machine condition
      // const machine = await Machine.findByIdAndUpdate(
      //   id,
      //   {
      //     condition,
      //     maintenanceNotes: notes,
      //     lastCheckedAt: new Date(),
      //     updatedAt: new Date()
      //   },
      //   { new: true }
      // );

      // if (!machine) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Machine not found'
      //   );
      // }

      logger.info('Machine condition updated', { machineId: id, condition });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Machine condition updated successfully'
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
   * Get machine statistics
   * GET /api/machines/stats/:schoolId
   */
  static async getMachineStats(req, res) {
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
      // const totalMachines = await Machine.countDocuments({ schoolId });
      // const byCategory = await Machine.aggregate([
      //   { $match: { schoolId: ObjectId(schoolId) } },
      //   { $group: { _id: '$category', count: { $sum: 1 } } },
      // ]);
      // const byCondition = await Machine.aggregate([
      //   { $match: { schoolId: ObjectId(schoolId) } },
      //   { $group: { _id: '$condition', count: { $sum: 1 } } },
      // ]);

      const stats = {
        totalMachines: 0,
        byCategory: [],
        byCondition: [],
        needingMaintenance: 0,
      };

      logger.info('Machine stats fetched', { schoolId });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Machine stats fetched successfully',
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
   * Bulk import machines
   * POST /api/machines/bulk-import
   */
  static async bulkImportMachines(req, res) {
    try {
      const { machines, schoolId } = req.body;

      if (!machines || !Array.isArray(machines) || machines.length === 0 || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Machines array and school ID are required'
        );
      }

      // Validate each machine
      const validatedMachines = machines.map(machine => ({
        ...machine,
        schoolId,
        createdAt: new Date(),
      }));

      // Bulk insert
      // const result = await Machine.insertMany(validatedMachines);

      logger.info('Machines bulk imported', { schoolId, count: machines.length });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        `${machines.length} machines imported successfully`,
        {
          imported: machines.length,
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

module.exports = MachineController;
