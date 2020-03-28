
const mongoose = require('mongoose')

const Schema = mongoose.Schema

let chatSchema = new Schema({

  chatId: { type: String, unique: true, required: true },
  senderName: { type: String, default: '' },
  senderId: { type: String, default: '' },
  receiverName: { type: String, default: '' },
  receiverId: { type: String, default: '' },
  message: { type: String, default: '' },
  chatRoom: { type: String, default: '' },
  seen: { type: Boolean, default: false }

})

module.exports = mongoose.model('Chat', chatSchema)
