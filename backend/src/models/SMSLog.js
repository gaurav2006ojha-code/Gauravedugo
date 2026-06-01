const mongoose = require('mongoose');

const smsLogSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  recipientPhone: {
    type: String,
    required: true,
  },
  recipientName: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  smsType: {
    type: String,
    enum: ['fee_reminder', 'notice', 'bulk_message', 'other'],
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'pending', 'delivered'],
    default: 'pending',
  },
  msg91Response: {
    type: Object,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SMSLog', smsLogSchema);
