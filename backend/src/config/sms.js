const axios = require('axios');
const env = require('./env');
const logger = require('./logger');
const constants = require('./constants');

class SMSService {
  constructor() {
    this.authKey = env.MSG91_AUTH_KEY;
    this.route = env.MSG91_ROUTE;
    this.baseURL = 'https://api.msg91.com/api';
    this.retryAttempts = constants.DEFAULTS.SMS_RETRY_ATTEMPTS;
    this.timeout = constants.DEFAULTS.SMS_TIMEOUT;
  }

  /**
   * Send SMS using MSG91 API
   * @param {string} phone - Recipient phone number
   * @param {string} message - SMS message content
   * @param {string} senderId - Sender ID (optional)
   * @returns {Promise} API response
   */
  async sendSMS(phone, message, senderId = 'GAURAVEDUGO') {
    if (!this.authKey) {
      logger.warn('MSG91_AUTH_KEY not configured');
      return {
        success: false,
        message: 'SMS service not configured',
      };
    }

    try {
      const params = {
        authkey: this.authKey,
        mobiles: phone,
        message: message,
        route: this.route,
        sender: senderId,
      };

      const response = await axios.get(`${this.baseURL}/sendhttp.php`, {
        params,
        timeout: this.timeout,
      });

      logger.info('SMS sent successfully', {
        phone,
        status: response.status,
        data: response.data,
      });

      return {
        success: true,
        message: 'SMS sent successfully',
        data: response.data,
      };
    } catch (error) {
      logger.error('Failed to send SMS', {
        phone,
        error: error.message,
      });

      return {
        success: false,
        message: 'Failed to send SMS',
        error: error.message,
      };
    }
  }

  /**
   * Send SMS to multiple recipients
   * @param {Array} phoneNumbers - Array of phone numbers
   * @param {string} message - SMS message content
   * @param {string} senderId - Sender ID (optional)
   * @returns {Promise} Array of results
   */
  async sendBulkSMS(phoneNumbers, message, senderId = 'GAURAVEDUGO') {
    try {
      const results = [];

      for (const phone of phoneNumbers) {
        const result = await this.sendSMS(phone, message, senderId);
        results.push({
          phone,
          ...result,
        });
      }

      logger.info('Bulk SMS sent', {
        totalCount: phoneNumbers.length,
        successCount: results.filter(r => r.success).length,
      });

      return results;
    } catch (error) {
      logger.error('Bulk SMS failed', {
        error: error.message,
      });

      return {
        success: false,
        message: 'Bulk SMS failed',
        error: error.message,
      };
    }
  }

  /**
   * Check SMS balance
   * @returns {Promise} Balance details
   */
  async checkBalance() {
    if (!this.authKey) {
      logger.warn('MSG91_AUTH_KEY not configured');
      return {
        success: false,
        message: 'SMS service not configured',
      };
    }

    try {
      const params = {
        authkey: this.authKey,
        route: this.route,
      };

      const response = await axios.get(`${this.baseURL}/balance.php`, {
        params,
        timeout: this.timeout,
      });

      logger.info('SMS balance checked', {
        data: response.data,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Failed to check SMS balance', {
        error: error.message,
      });

      return {
        success: false,
        message: 'Failed to check SMS balance',
        error: error.message,
      };
    }
  }

  /**
   * Format phone number for MSG91
   * @param {string} phone - Phone number
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phone) {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // Add country code if not present (India: 91)
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }

    return cleaned;
  }

  /**
   * Validate phone number
   * @param {string} phone - Phone number
   * @returns {boolean} Is valid
   */
  isValidPhoneNumber(phone) {
    const cleaned = this.formatPhoneNumber(phone);
    return cleaned.length === 12; // 91 (country code) + 10 digits
  }

  /**
   * Send fee reminder SMS
   * @param {string} phone - Parent phone number
   * @param {string} studentName - Student name
   * @param {number} amount - Due amount
   * @returns {Promise} SMS response
   */
  async sendFeeReminder(phone, studentName, amount) {
    const message = `Hi, Fee reminder for ${studentName}. Due amount: ₹${amount}. Please pay at your earliest convenience. Thank you!`;
    return this.sendSMS(phone, message);
  }

  /**
   * Send notice SMS
   * @param {string} phone - Recipient phone number
   * @param {string} noticeTitle - Notice title
   * @param {string} noticeMessage - Notice message
   * @returns {Promise} SMS response
   */
  async sendNoticeSMS(phone, noticeTitle, noticeMessage) {
    const message = `${noticeTitle}: ${noticeMessage}`;
    return this.sendSMS(phone, message);
  }

  /**
   * Send verification OTP
   * @param {string} phone - Phone number
   * @param {string} otp - OTP code
   * @returns {Promise} SMS response
   */
  async sendOTP(phone, otp) {
    const message = `Your GauraVEdugo OTP is: ${otp}. Valid for 10 minutes.`;
    return this.sendSMS(phone, message);
  }
}

module.exports = new SMSService();
