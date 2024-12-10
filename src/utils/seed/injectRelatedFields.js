const mongoose = require('mongoose')
const SkillRequest = require('../../api/models/skillRequest')
const User = require('../../api/models/user')
const Message = require('../../api/models/message')

// const addIdtoSkillRequest = async () => {
//   await mongoose.connect(
//     'mongodb+srv://jorgomez:root@cluster0.stznx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
//   )
//   const users = await User.find()
//   console.log('Usuarios obtenidos:', users.length)
//   const skillRequests = await SkillRequest.find()
//   console.log('SkillRequests obtenidos:', skillRequests.length)
//   if (users.length < skillRequests.length) {
//     console.error('numbers of id doest not match')
//   } else {
//     for (let i = 0; i < skillRequests.length; i++) {
//       const skillRequestId = skillRequests[i]._id
//       const userId = users[i]._id
//       await SkillRequest.findByIdAndUpdate(skillRequestId, { user: userId })
//     }
//     console.log('SkillRequests updated sucefully whit findByIdAndUpdate.')
//   }
// }
// addIdtoSkillRequest()

const injectRandomFields = async () => {
  await mongoose.connect(
    'mongodb+srv://jorgomez:root@cluster0.stznx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )

  try {
    const skillRequests = await SkillRequest.find()
    const skillRequestIds = skillRequests.map((req) => req._id)
    const users = skillRequests.map((req) => req.user)
    if (skillRequestIds.length === 0 || users.length === 0) {
      console.error('No hay datos suficientes en skillRequests o users.')
      return
    }

    const messages = await Message.find()

    for (const message of messages) {
      const randomSkillRequestIndex = Math.floor(
        Math.random() * skillRequestIds.length
      )
      const randomSkillRequestId = skillRequestIds[randomSkillRequestIndex]
      const sender = users[randomSkillRequestIndex]

      let recipient
      do {
        recipient = users[Math.floor(Math.random() * users.length)]
      } while (recipient === sender)

      await Message.findByIdAndUpdate(message._id, {
        sender,
        skillRequest: randomSkillRequestId,
        recipient
      })

      console.log(`Mensaje con ID ${message._id} actualizado correctamente.`)
    }

    console.log('Todos los mensajes fueron actualizados correctamente.')
  } catch (error) {
    console.error('Error actualizando mensajes:', error)
  } finally {
    await mongoose.disconnect()
  }
}

injectRandomFields()
