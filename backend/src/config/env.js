require('dotenv').config();

module.exports = {
  // Server Config
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database Config
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/gauravedugo',
  
  // JWT Config
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // SMS Config (MSG91)
  MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY || '',
  MSG91_ROUTE: process.env.MSG91_ROUTE || '4',
  
  // Email Config
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@gauravedugo.com',
  
  // File Upload
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5242880, // 5MB
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads/',
  
  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001',
  
  // API Keys
  API_KEY: process.env.API_KEY || 'your_api_key_here',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || 'logs/app.log',
};
