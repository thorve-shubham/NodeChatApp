const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment');

const Auth = new Schema({
  userId: {
    type: String
  },
  authToken: {
    type: String
  },
  tokenSecret: {
    type: String
  },
  tokenGenerationTime: {
    type: Date,
    default: moment().format()
  }
})

module.exports = mongoose.model('Auth', Auth)
