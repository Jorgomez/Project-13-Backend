const { isAuth } = require('../../middlewares/auth')
const {
  getMessages,
  createMessage,
  deleteMessage,
  getMessageById
} = require('../controllers/message')

const messagesRouter = require('express').Router()

messagesRouter.get('/', getMessages)
messagesRouter.get('/:id', getMessageById)
messagesRouter.post('/', isAuth, createMessage)
messagesRouter.delete('/:id', deleteMessage)

module.exports = messagesRouter
