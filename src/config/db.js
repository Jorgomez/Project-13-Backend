const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('conected')
  } catch (error) {
    return error.status(404).json('error al conectar a la BBDD')
  }
}
module.exports = { connectDB }
