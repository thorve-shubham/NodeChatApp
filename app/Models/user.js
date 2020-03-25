const mongoose = require('mongoose');


let userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required : true,
    index: true,
    unique: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required : true
  },
  email: {
    type: String,
    required : true
  },
  mobileNumber: {
    type: Number,
    default: 0
  },
  createdOn :{
    type:Date,
    required :true
  }


})


const User = mongoose.model('User', userSchema);

module.exports = User;