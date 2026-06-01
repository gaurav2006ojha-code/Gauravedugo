module.exports = {
  // User Roles
  USER_ROLES: {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
    PARENT: 'parent',
  },

  // Fee Types
  FEE_TYPES: {
    TUITION: 'tuition',
    ACTIVITY: 'activity',
    TRANSPORT: 'transport',
    EXAMINATION: 'examination',
    UNIFORM: 'uniform',
    OTHER: 'other',
  },

  // Fee Status
  FEE_STATUS: {
    PENDING: 'pending',
    PARTIAL: 'partial',
    PAID: 'paid',
    OVERDUE: 'overdue',
  },

  // Payment Methods
  PAYMENT_METHODS: {
    CASH: 'cash',
    ONLINE: 'online',
    CHEQUE: 'cheque',
    PENDING: 'pending',
  },

  // Notice Types
  NOTICE_TYPES: {
    GENERAL: 'general',
    FEE: 'fee',
    HOLIDAY: 'holiday',
    EVENT: 'event',
    ANNOUNCEMENT: 'announcement',
  },

  // Notice Target Audience
  NOTICE_AUDIENCE: {
    ALL: 'all',
    STUDENTS: 'students',
    PARENTS: 'parents',
    TEACHERS: 'teachers',
  },

  // Machine Categories
  MACHINE_CATEGORIES: {
    COMPUTER: 'computer',
    LAB: 'lab',
    SPORTS: 'sports',
    OTHER: 'other',
  },

  // Machine Conditions
  MACHINE_CONDITIONS: {
    NEW: 'new',
    GOOD: 'good',
    DAMAGED: 'damaged',
    REPAIR: 'repair',
  },

  // SMS Types
  SMS_TYPES: {
    FEE_REMINDER: 'fee_reminder',
    NOTICE: 'notice',
    BULK_MESSAGE: 'bulk_message',
    OTHER: 'other',
  },

  // SMS Status
  SMS_STATUS: {
    SENT: 'sent',
    FAILED: 'failed',
    PENDING: 'pending',
    DELIVERED: 'delivered',
  },

  // API Response Messages
  MESSAGES: {
    SUCCESS: 'Operation successful',
    ERROR: 'An error occurred',
    VALIDATION_ERROR: 'Validation error',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    CONFLICT: 'Resource already exists',
    INTERNAL_ERROR: 'Internal server error',
  },

  // API Status Codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // Validation Rules
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 50,
    MAX_FILE_SIZE: 5242880, // 5MB in bytes
    ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
  },

  // Time Constants (in milliseconds)
  TIME: {
    ONE_MINUTE: 60 * 1000,
    ONE_HOUR: 60 * 60 * 1000,
    ONE_DAY: 24 * 60 * 60 * 1000,
    ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
  },

  // Default Values
  DEFAULTS: {
    ITEMS_PER_PAGE: 10,
    SMS_RETRY_ATTEMPTS: 3,
    SMS_TIMEOUT: 10000,
  },
};
