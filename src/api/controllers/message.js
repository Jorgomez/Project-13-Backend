const Message = require('../models/message')
const User = require('../models/user')

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
      .populate('sender', 'name profilePicture')
      .populate('recipient', 'name')
      .populate('reply', 'messageContent sentAt')
      .populate('originalMessage', 'messageContent sentAt reply')

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
    const { recipient } = req.body

    console.log(recipient)

    console.log('body', req.body)
    console.log(newMessage)

    const messageSaved = await newMessage.save()
    const messagePopulated = await messageSaved.populate('sender', 'name')

    await User.findByIdAndUpdate(recipient, { hasNewMessage: true })
    return res.status(201).json(messagePopulated)
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error creating message', details: error.message })
  }
}

const addReplytoMessage = async (req, res, next) => {
  try {
    const { id } = req.params
    const { reply } = req.body

    if (!reply) {
      return res.status(400).json({ error: 'Reply ID is required' })
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { $set: { reply } },
      { new: true }
    )
      .populate('sender', 'name')
      .populate('recipient', 'name')
      .populate('reply', 'messageContent')

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' })
    }

    return res.status(200).json(updatedMessage)
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error updating message reply', details: error.message })
  }
}

// const getConversation = async (req, res, next) => {
//   try {
//     const { user1, user2, skillRequestId } = req.params

//     console.log(user1, user2, skillRequestId)
//     const conversation = await Message.find({
//       $or: [
//         { sender: user1, recipient: user2, skillRequest: skillRequestId },
//         { sender: user2, recipient: user1, skillRequest: skillRequestId }
//       ]
//     }).sort({ sentAt: 1 }) // Ordenados cronológicamente

//     res.status(200).json(conversation)
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: 'Error fetching conversation', details: error.message })
//   }
// }

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
  deleteMessage,
  addReplytoMessage

  // getConversation
}
