const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const env = require('./env');
const logger = require('./logger');
const constants = require('./constants');

// CORS Configuration
const corsOptions = {
  origin: env.ALLOWED_ORIGINS.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Setup Middleware
const setupMiddleware = (app) => {
  // Security Middleware
  app.use(helmet());
  
  // CORS Middleware
  app.use(cors(corsOptions));
  
  // Body Parser Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  
  // Data Sanitization Middleware
  app.use(mongoSanitize());
  
  // Request Logging Middleware
  app.use(logger.logRequest.bind(logger));
  
  // Request ID Middleware
  app.use((req, res, next) => {
    req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    res.setHeader('X-Request-ID', req.id);
    next();
  });
};

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || constants.MESSAGES.INTERNAL_ERROR;
  
  logger.logError(err, req);
  
  res.status(status).json({
    success: false,
    status,
    message,
    requestId: req.id,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 Handler Middleware
const notFoundHandler = (req, res) => {
  res.status(constants.STATUS_CODES.NOT_FOUND).json({
    success: false,
    status: constants.STATUS_CODES.NOT_FOUND,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    requestId: req.id,
  });
};

// Authentication Middleware
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(constants.STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: constants.MESSAGES.UNAUTHORIZED,
      });
    }
    
    // JWT verification would be done here
    // const decoded = jwt.verify(token, env.JWT_SECRET);
    // req.user = decoded;
    
    next();
  } catch (error) {
    res.status(constants.STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: constants.MESSAGES.UNAUTHORIZED,
    });
  }
};

// Authorization Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(constants.STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: constants.MESSAGES.UNAUTHORIZED,
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(constants.STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: constants.MESSAGES.FORBIDDEN,
      });
    }
    
    next();
  };
};

// Validation Error Handler
const validationErrorHandler = (errors) => {
  const formattedErrors = errors.array().reduce((acc, error) => {
    acc[error.param] = error.msg;
    return acc;
  }, {});
  
  return formattedErrors;
};

// API Response Wrapper
const sendResponse = (res, status, success, message, data = null) => {
  res.status(status).json({
    success,
    status,
    message,
    data,
  });
};

// Rate Limiting Middleware (placeholder)
const rateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    // Rate limiting logic can be implemented using express-rate-limit
    next();
  };
};

module.exports = {
  setupMiddleware,
  errorHandler,
  notFoundHandler,
  authenticate,
  authorize,
  validationErrorHandler,
  sendResponse,
  rateLimiter,
};
