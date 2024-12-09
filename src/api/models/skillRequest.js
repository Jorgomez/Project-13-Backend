const mongoose = require('mongoose')

const skillRequestShema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
      required: true
    },
    picture: { type: String },
    skillToLearn: { type: String, required: true },
    skillToTeach: { type: String },
    alternativeOffer: { type: String },
    mode: {
      type: String,
      enum: ['online', 'in-person', 'both'],
      required: true
    },
    location: {
      city: { type: String, required: true },
      country: { type: String, required: true }
    },
    additionalInfo: { type: String },
    availability: { type: String, required: true },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'users'
      }
    ],
    creationDate: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    collection: 'skillRequests'
  }
)

const SkillRequest = mongoose.model(
  'skillRequests',
  skillRequestShema,
  'skillRequests'
)

module.exports = SkillRequest
