const mongoose = require('mongoose');

const BreakSchema = new mongoose.Schema({
  attendance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendance',
    required: true,
  },
  break_start: {
    type: String, 
    required: true,
  },
  break_end: {
    type: String,
  },
  break_duration: {
    type: Number,
    default: 0,
  },
  break_type: {
    type: String,
    required: true,
    enum: ['Lunch', 'Medical', 'Personal' ,'Rest'],
  },
  notes: {
    type: String, 
    default: '',
  },
  is_break_in: {
    type: Boolean,
    default: false,
  },
});

const Break = mongoose.models.Break || mongoose.model('Break', BreakSchema);

module.exports = Break;
