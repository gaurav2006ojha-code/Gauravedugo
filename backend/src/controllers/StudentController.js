const logger = require('../config/logger');
const constants = require('../config/constants');
const { sendResponse } = require('../config/middleware');

class StudentController {
  /**
   * Create a new student
   * POST /api/students
   */
  static async createStudent(req, res) {
    try {
      const { name, email, phone, rollNumber, class: studentClass, schoolId, dateOfBirth, parentPhone } = req.body;

      // Validation
      if (!name || !rollNumber || !studentClass || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Name, roll number, class, and school ID are required'
        );
      }

      // Create student object
      const studentData = {
        name,
        email,
        phone,
        rollNumber,
        class: studentClass,
        schoolId,
        dateOfBirth,
        parentPhone,
      };

      // Save student to database
      // const student = await Student.create(studentData);

      logger.info('Student created successfully', { rollNumber, name });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        'Student created successfully',
        {
          // id: student._id,
          ...studentData,
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
   * Get all students
   * GET /api/students
   */
  static async getAllStudents(req, res) {
    try {
      const { page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT, schoolId, class: studentClass, search } = req.query;

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
      if (studentClass) filter.class = studentClass;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      // Fetch students
      // const students = await Student.find(filter)
      //   .skip(skip)
      //   .limit(limitNum)
      //   .lean();

      // Get total count
      // const total = await Student.countDocuments(filter);

      logger.info('Students fetched', { schoolId, count: 0 });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Students fetched successfully',
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
   * Get student by ID
   * GET /api/students/:id
   */
  static async getStudentById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Student ID is required'
        );
      }

      // Fetch student
      // const student = await Student.findById(id)
      //   .populate('schoolId', 'name')
      //   .lean();

      // if (!student) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Student not found'
      //   );
      // }

      logger.info('Student fetched', { studentId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Student fetched successfully'
        // { student }
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
   * Update student
   * PUT /api/students/:id
   */
  static async updateStudent(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone, class: studentClass, dateOfBirth, parentPhone } = req.body;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Student ID is required'
        );
      }

      // Validate at least one field to update
      if (!name && !email && !phone && !studentClass && !dateOfBirth && !parentPhone) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Provide at least one field to update'
        );
      }

      // Build update object
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      if (studentClass) updateData.class = studentClass;
      if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
      if (parentPhone) updateData.parentPhone = parentPhone;

      // Update student
      // const student = await Student.findByIdAndUpdate(id, updateData, { new: true });

      // if (!student) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Student not found'
      //   );
      // }

      logger.info('Student updated successfully', { studentId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Student updated successfully'
        // { student }
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
   * Delete student
   * DELETE /api/students/:id
   */
  static async deleteStudent(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Student ID is required'
        );
      }

      // Delete student
      // const student = await Student.findByIdAndDelete(id);

      // if (!student) {
      //   return sendResponse(
      //     res,
      //     constants.STATUS_CODES.NOT_FOUND,
      //     false,
      //     'Student not found'
      //   );
      // }

      logger.info('Student deleted successfully', { studentId: id });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Student deleted successfully'
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
   * Get students by class
   * GET /api/students/class/:class
   */
  static async getStudentsByClass(req, res) {
    try {
      const { class: studentClass } = req.params;
      const { schoolId, page = constants.PAGINATION.DEFAULT_PAGE, limit = constants.PAGINATION.DEFAULT_LIMIT } = req.query;

      if (!studentClass || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Class and school ID are required'
        );
      }

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(parseInt(limit) || constants.PAGINATION.DEFAULT_LIMIT, constants.PAGINATION.MAX_LIMIT);
      const skip = (pageNum - 1) * limitNum;

      // Fetch students by class
      // const students = await Student.find({ class: studentClass, schoolId })
      //   .skip(skip)
      //   .limit(limitNum)
      //   .lean();

      // const total = await Student.countDocuments({ class: studentClass, schoolId });

      logger.info('Students by class fetched', { class: studentClass, schoolId });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Students fetched successfully',
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
   * Bulk import students
   * POST /api/students/bulk-import
   */
  static async bulkImportStudents(req, res) {
    try {
      const { students, schoolId } = req.body;

      if (!students || !Array.isArray(students) || students.length === 0 || !schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'Students array and school ID are required'
        );
      }

      // Validate each student
      const validatedStudents = students.map(student => ({
        ...student,
        schoolId,
      }));

      // Bulk insert
      // const result = await Student.insertMany(validatedStudents);

      logger.info('Students bulk imported', { schoolId, count: students.length });

      return sendResponse(
        res,
        constants.STATUS_CODES.CREATED,
        true,
        `${students.length} students imported successfully`,
        {
          imported: students.length,
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
   * Export students
   * GET /api/students/export/:schoolId
   */
  static async exportStudents(req, res) {
    try {
      const { schoolId } = req.params;
      const { class: studentClass } = req.query;

      if (!schoolId) {
        return sendResponse(
          res,
          constants.STATUS_CODES.BAD_REQUEST,
          false,
          'School ID is required'
        );
      }

      // Build filter
      const filter = { schoolId };
      if (studentClass) filter.class = studentClass;

      // Fetch students
      // const students = await Student.find(filter).lean();

      // Format for export (CSV, JSON, etc.)
      const exportData = [];

      logger.info('Students exported', { schoolId, count: exportData.length });

      res.json({
        success: true,
        message: 'Students exported successfully',
        data: exportData,
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
   * Get student statistics
   * GET /api/students/stats/:schoolId
   */
  static async getStudentStats(req, res) {
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
      // const totalStudents = await Student.countDocuments({ schoolId });
      // const studentsByClass = await Student.aggregate([
      //   { $match: { schoolId: ObjectId(schoolId) } },
      //   { $group: { _id: '$class', count: { $sum: 1 } } },
      // ]);

      const stats = {
        totalStudents: 0,
        byClass: [],
      };

      logger.info('Student stats fetched', { schoolId });

      return sendResponse(
        res,
        constants.STATUS_CODES.OK,
        true,
        'Student stats fetched successfully',
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
}

module.exports = StudentController;
