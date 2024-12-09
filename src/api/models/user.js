const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skillToLearn: { type: String, required: true },
    profilePicture: { type: String, required: false },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['admin', 'user']
    },
    additionalInfo: {
      origin: { type: String },
      location: { type: String },
      age: { type: Number },
      expertiseToTeach: { type: String },
      expertiseToLearn: { type: String },
      contactInfo: {
        whatsapp: { type: String },
        instagram: { type: String }
      }
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'skillRequests'
      }
    ],
    // messages: [{ type: String }],

    messages: [{ type: mongoose.Types.ObjectId, ref: 'messages', default: [] }],
    skillRequests: [
      { type: mongoose.Types.ObjectId, ref: 'skillRequests', default: [] }
    ],
    hasNewMessage: { type: Boolean, default: false },
    registrationDate: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10)
})

const User = mongoose.model('users', userSchema, 'users')

module.exports = User
