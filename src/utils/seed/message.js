const mongoose = require('mongoose')
const fs = require('fs')
const Message = require('../../api/models/message')

const bombMessages = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://jorgomez:root@cluster0.stznx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )
    await Message.collection.drop()
    console.log('Messages deleted')

    const messageData = fs.readFileSync('src/data/json/messages.json', 'utf-8')
    const message = JSON.parse(messageData)

    await Message.insertMany(message)
    console.log('Messages introduced')

    await mongoose.disconnect()
    console.log('server desconected')
  } catch (error) {
    console.log('error connecting', error)
  }
}

bombMessages()
