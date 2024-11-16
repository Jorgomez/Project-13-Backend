const mongoose = require('mongoose')
const fs = require('fs')
const User = require('../../api/models/user')

const bombUsers = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://jorgomez:root@cluster0.stznx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )
    await User.collection.drop()
    console.log('Users deleted')
    const usersData = fs.readFileSync('src/data/json/users.json', 'utf-8')
    const users = JSON.parse(usersData)

    await User.insertMany(users)
    console.log('Users introduced')

    await mongoose.disconnect()
    console.log('server desconected')
  } catch (error) {
    console.log('error connecting')
  }
}

bombUsers()
