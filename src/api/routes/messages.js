const { isAuth } = require('../../middlewares/auth')
const {
  getMessages,
  createMessage,
  deleteMessage,
  getMessageById,
  getConversation,
  addReplytoMessage
} = require('../controllers/message')

const messagesRouter = require('express').Router()

messagesRouter.get('/', getMessages)

// messagesRouter.get(
//   '/conversation/:user1/:user2/:skillRequestId',
//   isAuth,
//   getConversation
// )
messagesRouter.get('/:id', getMessageById)
messagesRouter.put('/:id', addReplytoMessage)
messagesRouter.post('/', isAuth, createMessage)
messagesRouter.delete('/:id', deleteMessage)

module.exports = messagesRouter
