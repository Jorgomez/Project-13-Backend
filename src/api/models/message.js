const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    recipient: { type: mongoose.Types.ObjectId, ref: 'users', required: true },

    skillRequest: {
      type: mongoose.Types.ObjectId,
      ref: 'skillRequests',
      required: true
    },
    messageContent: { type: String, required: true },
    contactInfoIncluded: {
      whatsapp: { type: String },
      instagram: { type: String },
      email: { type: String }
    },
    sentAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    collection: 'messages'
  }
)

const Message = mongoose.model('messages', messageSchema, 'messages')

module.exports = Message
