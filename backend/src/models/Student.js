const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  section: {
    type: String,
  },
  fatherName: {
    type: String,
  },
  motherName: {
    type: String,
  },
  parentPhone: {
    type: String,
    required: true,
  },
  parentEmail: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  admissionNumber: {
    type: String,
    unique: true,
  },
  admissionDate: {
    type: Date,
    default: Date.now,
  },
  totalDues: {
    type: Number,
    default: 0,
  },
  assignedMachines: [{
    machineId: mongoose.Schema.Types.ObjectId,
    machineName: String,
    assignedDate: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Student', studentSchema);
