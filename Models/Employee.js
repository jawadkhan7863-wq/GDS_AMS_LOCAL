const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    CNIC_No: {
      type: String,  
      required: [true, 'CNIC-No is required'],
      trim: true,
    },
    in_time: {
      type: String,
      default: '09:00',
    },
    out_time: {
      type: String,
      default: '18:00',
    },
    joining_date: {
      type: Date,
      required: [true, 'Joining date is required'],
      default: Date.now,
    },
    role_company: {
      type: String,
      required: [true, 'role is required'],
      trim: true,
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Designation',
      required: [true, 'Designation is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Employee', EmployeeSchema);
