const mongoose = require('mongoose');

const DesignationSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: [ 'Sales', 'Developer', 'IT', 'Designer' , 'GDS Agency' ,'Lead' ,'Data Mining' , 'MindHive' , 'GDS'], 
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',  
  }],
});

module.exports = mongoose.model('Designation', DesignationSchema);
