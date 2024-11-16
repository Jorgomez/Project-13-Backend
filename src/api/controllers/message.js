const Message = require('../models/message')

const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find()
      .populate('sender')
      .populate('recipient')
      .populate('skillRequest')

    return res.status(200).json(messages)
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error fetching messages', details: error.message })
  }
}

const getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params
    const messageFound = await Message.findById(id)

    return res.status(200).json(messageFound)
  } catch (error) {
    return res.status(404).json('error in the getMessagestById function')
  }
}

const createMessage = async (req, res, next) => {
  try {
    const newMessage = new Message({
      ...req.body,
      sender: req.user._id
    })
    // .populate('sender')
    // .populate('recipient')
    // .populate('skillRequest')

    const messageSaved = await newMessage.save()

    return res.status(201).json(messageSaved)
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error creating message', details: error.message })
  }
}

const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params
    const MessagetDeleted = await Message.findByIdAndDelete(id)
    return res.status(200).json({
      mensaje: 'Message Deleted',
      MessagetDeleted: MessagetDeleted
    })
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error deleting element', details: error.message })
  }
}

module.exports = {
  getMessages,
  getMessageById,
  createMessage,
  deleteMessage
}
