const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('conected')
  } catch (error) {
    console.error('Error al conectar a la BBDD:', error.message)
    throw new Error('Error al conectar a la BBDD')
  }
}
module.exports = { connectDB }
