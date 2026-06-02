const logger = require('../config/logger');
const constants = require('../config/constants');
const { sendResponse } = require('../config/middleware');

class AttendanceController {
  /**
   * Record attendance for a class/date or single student
   * POST /api/attendance
   * body: { schoolId, date, class, records: [{ studentId, status, remarks }] }
   */
  static async recordAttendance(req, res) {
    try {
      const { schoolId, date, class: studentClass, records } = req.body;

      if (!schoolId || !date || !studentClass || !Array.isArray(records) || records.length === 0) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'schoolId, date, class and non-empty records array are required'
        );
      }

      // Normalize date
      const attendanceDate = new Date(date);

      // Validate records
      for (const r of records) {
        if (!r.studentId || !r.status) {
          return sendResponse(
            res,
            constants.STATUS_CODES.BAD_REQUEST,
            false,
            'Each record must include studentId and status'
          );
        }
        if (!Object.values(constants.ATTENDANCE_STATUS).includes(r.status)) {
          return sendResponse(
            res,
            constants.STATUS_CODES.BAD_REQUEST,
            false,
            `Invalid attendance status: ${r.status}`
          );
        }
      }

      // Prepare attendance documents
      const attendanceDocs = records.map(r => ({
        schoolId,
        date: attendanceDate,
        class: studentClass,
        studentId: r.studentId,
        status: r.status,
        remarks: r.remarks || '',
        recordedBy: req.user?.id,
        recordedAt: new Date(),
      }));

      // Upsert attendance records in DB (stubbed)
      // await Promise.all(attendanceDocs.map(doc => Attendance.findOneAndUpdate({ schoolId: doc.schoolId, date: doc.date, studentId: doc.studentId }, doc, { upsert: true })));

      logger.info('Attendance recorded', { schoolId, date: attendanceDate, count: attendanceDocs.length });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        'Attendance recorded successfully',
        { recorded: attendanceDocs.length }
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
   * Get attendance for a student
   * GET /api/attendance/student/:studentId
   */
  static async getAttendanceByStudent(req, res) {
    try {
      const { studentId } = req.params;
      const { startDate, endDate, page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT } = req.query;

      if (!studentId) {
        return sendResponse(res, constants.STATUS_CODES.BAD_REQUEST, false, 'Student ID is required');
      }

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(parseInt(limit) || constants.PAGINATION.DEFAULT_LIMIT, constants.PAGINATION.MAX_LIMIT);
      const skip = (pageNum - 1) * limitNum;

      // Build filter
      const filter = { studentId };
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      // Fetch attendance records (stubbed)
      // const records = await Attendance.find(filter).skip(skip).limit(limitNum).sort({ date: -1 }).lean();
      // const total = await Attendance.countDocuments(filter);

      logger.info('Attendance by student fetched', { studentId });

      return sendResponse(res, constants.STATUS_CODES.OK, true, 'Attendance fetched successfully', {
        data: [],
        pagination: { page: pageNum, limit: limitNum, total: 0, totalPages: 0 },
      });
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
   * Get attendance for a class on a date or date range
   * GET /api/attendance/class/:class
   */
  static async getAttendanceByClass(req, res) {
    try {
      const { class: studentClass } = req.params;
      const { schoolId, date, startDate, endDate, page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT } = req.query;

      if (!studentClass || !schoolId) {
        return sendResponse(res, constants.STATUS_CODES.BAD_REQUEST, false, 'Class and schoolId are required');
      }

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(parseInt(limit) || constants.PAGINATION.DEFAULT_LIMIT, constants.PAGINATION.MAX_LIMIT);
      const skip = (pageNum - 1) * limitNum;

      // Build filter
      const filter = { class: studentClass, schoolId };
      if (date) filter.date = new Date(date);
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      // Fetch attendance (stubbed)
      // const records = await Attendance.find(filter).skip(skip).limit(limitNum).sort({ date: -1 }).lean();
      // const total = await Attendance.countDocuments(filter);

      logger.info('Attendance by class fetched', { class: studentClass, schoolId });

      return sendResponse(res, constants.STATUS_CODES.OK, true, 'Attendance fetched successfully', {
        data: [],
        pagination: { page: pageNum, limit: limitNum, total: 0, totalPages: 0 },
      });
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
   * Update single attendance record
   * PUT /api/attendance/:id
   */
  static async updateAttendance(req, res) {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;

      if (!id) {
        return sendResponse(res, constants.STATUS_CODES.BAD_REQUEST, false, 'Attendance ID is required');
      }

      if (status && !Object.values(constants.ATTENDANCE_STATUS).includes(status)) {
        return sendResponse(res, constants.STATUS_CODES.BAD_REQUEST, false, 'Invalid attendance status');
      }

      const updateData = {};
      if (status) updateData.status = status;
      if (remarks) updateData.remarks = remarks;
      updateData.updatedAt = new Date();

      // Update attendance (stubbed)
      // const attendance = await Attendance.findByIdAndUpdate(id, updateData, { new: true }).lean();
      // if (!attendance) return sendResponse(res, constants.STATUS_CODES.NOT_FOUND, false, 'Attendance record not found');

      logger.info('Attendance updated', { attendanceId: id });

      return sendResponse(res, constants.STATUS_CODES.OK, true, 'Attendance updated successfully');
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
   * Delete attendance record
   * DELETE /api/attendance/:id
   */
  static async deleteAttendance(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(res, constants.STATUS_CODES.BAD_REQUEST, false, 'Attendance ID is required');
      }

      // Delete attendance (stubbed)
      // const attendance = await Attendance.findByIdAndDelete(id);
      // if (!attendance) return sendResponse(res, constants.STATUS_CODES.NOT_FOUND, false, 'Attendance record not found');

      logger.info('Attendance deleted', { attendanceId: id });

      return sendResponse(res, constants.STATUS_CODES.OK, true, 'Attendance deleted successfully');
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
   * Get attendance statistics for a class or school
   * GET /api/attendance/stats/:schoolId
   */
  static async getAttendanceStats(req, res) {
    try {
      const { schoolId } = req.params;
      const { startDate, endDate, class: studentClass } = req.query;

      if (!schoolId) {
        return sendResponse(res, constants.STATUS_CODES.BAD_REQUEST, false, 'School ID is required');
      }

      // Build filter and aggregate stats (stubbed)
      const filter = { schoolId };
      if (studentClass) filter.class = studentClass;
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      // Example stats
      const stats = {
        totalDays: 0,
        totalRecords: 0,
        present: 0,
        absent: 0,
        leave: 0,
        presentPercentage: 0,
      };

      logger.info('Attendance stats fetched', { schoolId });

      return sendResponse(res, constants.STATUS_CODES.OK, true, 'Attendance stats fetched successfully', stats);
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
   * Bulk import attendance (CSV or array)
   * POST /api/attendance/bulk-import
   */
  static async bulkImportAttendance(req, res) {
    try {
      const { schoolId, records } = req.body;

      if (!schoolId || !Array.isArray(records) || records.length === 0) {
        return sendResponse(res, constants.STATUS_CODES.BAD_REQUEST, false, 'schoolId and non-empty records array are required');
      }

      // Validate & transform records
      const transformed = records.map(r => ({
        schoolId,
        date: new Date(r.date),
        class: r.class,
        studentId: r.studentId,
        status: r.status,
        remarks: r.remarks || '',
        recordedBy: req.user?.id,
        recordedAt: new Date(),
      }));

      // Bulk upsert (stubbed)
      // await Attendance.bulkWrite(transformed.map(doc => ({
      //   updateOne: {
      //     filter: { schoolId: doc.schoolId, date: doc.date, studentId: doc.studentId },
      //     update: { $set: doc },
      //     upsert: true
      //   }
      // })));

      logger.info('Attendance bulk imported', { schoolId, count: transformed.length });

      return sendResponse(res, constants.STATUS_CODES.CREATED, true, `${transformed.length} attendance records imported successfully`, { imported: transformed.length });
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

module.exports = AttendanceController;
