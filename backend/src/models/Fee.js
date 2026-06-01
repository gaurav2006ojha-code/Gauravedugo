const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  feeType: {
    type: String,
    enum: ['tuition', 'activity', 'transport', 'examination', 'uniform', 'other'],
    required: true,
  },
  month: {
    type: String,
  },
  year: {
    type: Number,
  },
  dueDate: {
    type: Date,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  remainingAmount: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue'],
    default: 'pending',
  },
  paymentDate: {
    type: Date,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online', 'cheque', 'pending'],
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Fee', feeSchema);
