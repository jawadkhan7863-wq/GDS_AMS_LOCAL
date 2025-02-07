const mongoose = require('mongoose');

const AuthenticationSchema = new mongoose.Schema({
  Secretkey: {
    type: String,
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Link to the employee
    required: true,
  },
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Designation',
    required: true,
  },
});

module.exports = mongoose.model('Authentication', AuthenticationSchema);
