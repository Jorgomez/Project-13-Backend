const mongoose = require('mongoose')
const fs = require('fs')
const SkillRequest = require('../../api/models/skillRequest')

const bombSkillRequest = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://jorgomez:root@cluster0.stznx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )
    await SkillRequest.collection.drop()
    console.log('Skill Request deleted')

    const skillRequestData = fs.readFileSync(
      'src/data/json/skillRequest.json',
      'utf-8'
    )
    // const skillsRequest = JSON.parse(skillRequestData)

    const skillsRequest = JSON.parse(skillRequestData).map((skillRequest) => ({
      ...skillRequest,
      location: {
        city: skillRequest.city,
        country: skillRequest.country
      }
    }))

    await SkillRequest.insertMany(skillsRequest)
    console.log('Skill Request introduced')

    await mongoose.disconnect()
    console.log('server desconected')
  } catch (error) {
    console.log('error connecting', error)
  }
}

bombSkillRequest()
