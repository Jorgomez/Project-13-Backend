const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skillToLearn: { type: String, required: true }, // carefully with the update
    profilePicture: { type: String },
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
    likes: [{ type: String }],
    messages: [{ type: String }],
    // likes: [
    //   { type: mongoose.Types.ObjectId, ref: 'skillRequests', default: [] }
    // ],
    // messages: [{ type: mongoose.Types.ObjectId, ref: 'messages', default: [] }],
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
