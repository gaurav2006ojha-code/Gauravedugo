const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  machineCode: {
    type: String,
    unique: true,
  },
  category: {
    type: String,
    enum: ['computer', 'lab', 'sports', 'other'],
  },
  assignedTo: [{
    studentId: mongoose.Schema.Types.ObjectId,
    assignedDate: Date,
    returnDate: Date,
  }],
  totalCost: {
    type: Number,
  },
  condition: {
    type: String,
    enum: ['new', 'good', 'damaged', 'repair'],
    default: 'good',
  },
  location: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Machine', machineSchema);
