const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    recipient: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    // sender: { type: String, required: true },
    // recipient: { type: String, required: true },
    // skillRequest: {
    //   type: String,
    //   required: true
    // },
    skillRequest: {
      type: mongoose.Types.ObjectId,
      ref: 'skillRequests',
      required: true
    },
    messageContent: { type: String, required: true },
    contactInfo: {
      whatsapp: { type: String },
      instagram: { type: String },
      email: { type: String }
    },
    reply: { type: mongoose.Types.ObjectId, ref: 'messages' },
    originalMessage: { type: mongoose.Types.ObjectId, ref: 'messages' },
    sentAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    collection: 'messages'
  }
)

const Message = mongoose.model('messages', messageSchema, 'messages')

module.exports = Message
