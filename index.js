require('dotenv').config()
const express = require('express')
const { connectDB } = require('./src/config/db')
const cors = require('cors')
const usersRouter = require('./src/api/routes/user')
const skillRequestsRouter = require('./src/api/routes/skillRequest')
const messagesRouter = require('./src/api/routes/messages')

const cloudinary = require('cloudinary').v2
const app = express()

app.use(express.json())
connectDB()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

app.use(cors())

app.use('/users', usersRouter)
app.use('/skillRequests', skillRequestsRouter)
app.use('/messages', messagesRouter)
app.use('*', (req, res, next) => {
  return res.status(404).json('route not found')
})

app.listen(3000, () => {
  console.log('Server deployed at http://localhost:3000')
})
