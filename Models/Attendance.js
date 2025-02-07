const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  in_time: {
    type: String,
  },
  out_time: {
    type: String,
  },
  session_duration: {
    type: Number,
    default: 0,
  },
  is_logged_in: {
    type: Boolean,
    default: false,
  },
  breaks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Break',
  }],
});

// Check if the model already exists to avoid OverwriteModelError
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;
