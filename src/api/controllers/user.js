const bcrypt = require('bcrypt')
const User = require('../models/user')
const { generateSign } = require('../../config/jwt')
const Message = require('../models/message')

const filterStrings = require('../../utils/Functions/filterStrings')
const { deleteFile } = require('../../utils/Functions/delete.file')

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('likes')
    // .populate('messages')
    return res.status(200).json(users)
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error fetching users', details: error.message })
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    userFound = await User.findById(id)
    // .populate('events')

    if (!userFound) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json(userFound)
  } catch (error) {
    return res
      .status(404)
      .json({ error: 'Error fetching user by ID', details: error.message })
  }
}

const register = async (req, res, next) => {
  try {
    const { email } = req.body
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      skillToLearn: req.body.skillToLearn,
      // role: req.body.role,
      profilePicture: req.body.profilePicture
    })
    if (req.files) {
      newUser.profilePicture = req.files.profilePicture[0].path
    }
    const emailDuplicated = await User.findOne({ email })
    if (emailDuplicated) {
      return res.status(400).json({
        error: `The email "${email}" is already registered. Please use a different email.`
      })
    }

    // if (skillrequests) {
    //   const filterdEvents = Array.from(
    //     new Set(events.map((eventId) => eventId.toString()))
    //   )
    //   newUser.events = filterdEvents
    // }
    const userSaved = await newUser.save()

    return res.status(201).json(userSaved)
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error in register function', details: error.message })
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Incorrect email or password' })
    }
    if (bcrypt.compareSync(password, user.password)) {
      const token = generateSign(user._id)
      const { password, ...userWithoutPassword } = user.toObject()

      return res.status(200).json({
        user: userWithoutPassword,
        token
      })
    } else {
      return res.status(400).json({ error: 'Incorrect username or password' })
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error in login function', details: error.message })
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const currentValuesUser = await User.findById(id).populate('likes')
    if (!currentValuesUser) {
      return res.status(404).json({ error: 'User not found' })
    }
    const updateReq = req.body
    const { likes: newLikeid = [], messages: newMessagesid = [] } = req.body

    currentValuesUser.likes = currentValuesUser.likes || []
    currentValuesUser.messages = currentValuesUser.messages || []

    newLikeid &&
      (updateReq.likes = filterStrings(newLikeid, currentValuesUser.likes))
    newMessagesid &&
      (updateReq.messages = filterStrings(
        newMessagesid,
        currentValuesUser.messages
      ))

    if (
      req.files &&
      req.files.profilePicture &&
      req.files.profilePicture.length > 0
    ) {
      // deleteFile(currentValuesUser.profilePicture)
      if (currentValuesUser.profilePicture) {
        deleteFile(currentValuesUser.profilePicture)
      }
      updateReq.profilePicture = req.files.profilePicture[0].path
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateReq, {
      new: true
    })

    return res.status(200).json({
      message: 'User successfully updated',
      user: updatedUser
    })
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error Updatting Profile', details: error.message })
  }
}

const addLikesMessages = async (req, res) => {
  try {
    const { id } = req.params
    const { likes = [], messages = [] } = req.body

    const updateFields = {}
    if (likes.length) {
      updateFields.likes = { $each: likes }
    }
    if (messages.length) {
      updateFields.messages = { $each: messages }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $addToSet: updateFields },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json({
      message: 'Fields successfully updated',
      user: updatedUser
    })
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error updating fields', details: error.message })
  }
}

const removeFavoriteFromUser = async (req, res) => {
  try {
    const userId = req.params.id

    const { likes } = req.body

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { likes } },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json('User not found')
    }

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error removing like from user')
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const userDeleted = await User.findByIdAndDelete(id)
    deleteFile(userDeleted.profilePicture)
    return res
      .status(200)
      .json({ mensaje: 'Deleted User', userdeleted: userDeleted })
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error Deleting Profile', details: error.message })
  }
}

module.exports = {
  getUsers,
  getUserById,
  register,
  login,
  updateUser,
  addLikesMessages,
  removeFavoriteFromUser,
  deleteUser
}
