const fs = require('fs');
const path = require('path');
const env = require('./env');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const LOG_COLORS = {
  ERROR: '\x1b[31m', // Red
  WARN: '\x1b[33m',  // Yellow
  INFO: '\x1b[36m',  // Cyan
  DEBUG: '\x1b[35m', // Magenta
  RESET: '\x1b[0m',  // Reset
};

class Logger {
  constructor() {
    this.logFile = env.LOG_FILE;
    this.logLevel = env.LOG_LEVEL || 'info';
  }

  formatTimestamp() {
    const now = new Date();
    return now.toISOString();
  }

  formatMessage(level, message, meta = null) {
    const timestamp = this.formatTimestamp();
    let formattedMsg = `[${timestamp}] [${level}] ${message}`;
    
    if (meta) {
      formattedMsg += ` ${JSON.stringify(meta)}`;
    }
    
    return formattedMsg;
  }

  writeToFile(message) {
    try {
      const logPath = path.join(__dirname, '../../', this.logFile);
      const dir = path.dirname(logPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.appendFileSync(logPath, message + '\n');
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  log(level, message, meta = null) {
    const formattedMsg = this.formatMessage(level, message, meta);
    
    // Console output with color
    const color = LOG_COLORS[level] || LOG_COLORS.RESET;
    console.log(`${color}${formattedMsg}${LOG_COLORS.RESET}`);
    
    // File output
    this.writeToFile(formattedMsg);
  }

  error(message, meta = null) {
    this.log(LOG_LEVELS.ERROR, message, meta);
  }

  warn(message, meta = null) {
    this.log(LOG_LEVELS.WARN, message, meta);
  }

  info(message, meta = null) {
    this.log(LOG_LEVELS.INFO, message, meta);
  }

  debug(message, meta = null) {
    if (env.NODE_ENV === 'development') {
      this.log(LOG_LEVELS.DEBUG, message, meta);
    }
  }

  // Log API requests
  logRequest(req, res, next) {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const meta = {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      };
      this.info(`API Request`, meta);
    });
    
    next();
  }

  // Log errors with stack trace
  logError(error, req = null) {
    const meta = {
      message: error.message,
      stack: error.stack,
    };
    
    if (req) {
      meta.method = req.method;
      meta.url = req.url;
      meta.ip = req.ip;
    }
    
    this.error('Application Error', meta);
  }
}

module.exports = new Logger();
