const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  noticeType: {
    type: String,
    enum: ['general', 'fee', 'holiday', 'event', 'announcement'],
    default: 'general',
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'parents', 'teachers'],
    required: true,
  },
  sendViaSMS: {
    type: Boolean,
    default: false,
  },
  smsMessage: {
    type: String,
  },
  recipientCount: {
    type: Number,
    default: 0,
  },
  sentCount: {
    type: Number,
    default: 0,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notice', noticeSchema);
