const { deleteFile } = require('../../utils/Functions/delete.file')
const SkillRequest = require('../models/skillRequest')

const getAllSkillRequests = async (req, res, next) => {
  try {
    const skillRequests = await SkillRequest.find()
      .populate('user')
      .populate('likes')
    return res.status(200).json(skillRequests)
  } catch (error) {
    return res.status(400).json('error getEvents Function')
  }
}

const getSkillRequestsProgressive = async (req, res, next) => {
  try {
    const { offset = 0, limit = 20 } = req.query

    const skillRequests = await SkillRequest.find()
      .populate('user')
      .populate('likes')
      .skip(parseInt(offset))
      .limit(parseInt(limit))

    const total = await SkillRequest.countDocuments()

    return res.status(200).json({
      skillRequests,
      hasMore: parseInt(offset) + parseInt(limit) < total
    })
  } catch (error) {
    return res.status(400).json({
      error: 'Error fetchigin skill requests  ',
      details: error.message
    })
  }
}

const getSkillRequestsByWord = async (req, res, next) => {
  try {
    const { field, value } = req.query // Obtener el campo y valor de la consulta

    if (!field || !value) {
      return res.status(400).json({
        error: 'Missing field or value in query parameters'
      })
    }

    console.log(`Filtering by ${field}: ${value}`)
    const filter = { [field]: { $regex: value, $options: 'i' } }

    const skillRequests = await SkillRequest.find(filter)
      .populate('user')
      .populate('likes')

    return res.status(200).json(skillRequests)
  } catch (error) {
    return res.status(400).json({
      error: 'Error filtering skill requests',
      details: error.message
    })
  }
}

const getSkillRequestsByLocation = async (req, res, next) => {
  try {
    const { location } = req.query
    const regex = new RegExp(location, 'i')

    const skillRequests = await SkillRequest.find({
      $or: [
        { 'location.city': { $regex: regex } },
        { 'location.country': { $regex: regex } }
      ]
    })
      .populate('user')
      .populate('likes')

    return res.status(200).json(skillRequests)
  } catch (error) {
    return res.status(400).json({
      error: 'Error filtering skill requests by location',
      details: error.message
    })
  }
}

const getSkillRequestsById = async (req, res, next) => {
  try {
    const { id } = req.params
    const SkillRequestFound = await SkillRequest.findById(id)
      .populate('user')
      .populate('likes')
    return res.status(200).json(SkillRequestFound)
  } catch (error) {
    return res.status(404).json('error in the getEventById function')
  }
}

const createSkillRequest = async (req, res, next) => {
  try {
    const newSkillRequest = new SkillRequest({
      ...req.body,
      user: req.user._id
    })

    if (req.files && req.files.picture && req.files.picture[0]) {
      newSkillRequest.picture = req.files.picture[0].path
    }

    // const filterdskillToLearn = Array.from(
    //   new Set(skillToLearn.map((skill) => skill))
    // )
    // newSkillRequest.skillToLearn = filterdskillToLearn

    // if (skillToTeach) {
    //   const filterdskillToTeach = Array.from(
    //     new Set(skillToTeach.map((skill) => skill))
    //   )
    //   newSkillRequest.skillToTeach = filterdskillToTeach
    // }

    // if (alternativeOffer) {
    //   const filterdsalternativeOffer = Array.from(
    //     new Set(alternativeOffer.map((offer) => offer))
    //   )
    //   newSkillRequest.alternativeOffer = filterdsalternativeOffer
    // }

    const SkillRequestSaved = await newSkillRequest.save()

    const populatedSkillRequest = await SkillRequestSaved.populate({
      path: 'user',
      select: 'name'
    })

    console.log(populatedSkillRequest)

    return res.status(201).json(populatedSkillRequest)
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error in Creating Event', details: error.message })
  }
}

const updateSkillRequest = async (req, res, next) => {
  try {
    const { id } = req.params
    const currentValuesSkillRequest = await SkillRequest.findById(id)

    if (!currentValuesSkillRequest) {
      return res.status(404).json('Skill Request not found')
    }
    const updateReq = req.body

    if (req.files && req.files.picture && req.files.picture[0]) {
      deleteFile(currentValuesSkillRequest.picture)
      updateReq.picture = req.files.picture[0].path
    }

    // const { likes: newlikes = [] } = req.body

    const updatedSkillRequest = await SkillRequest.findByIdAndUpdate(
      id,
      updateReq,
      {
        new: true
      }
    )

    return res.status(200).json(updatedSkillRequest)
  } catch (error) {
    return res.status(400).json('error to update'), console.log(error)
  }
}
const addUserId = async (req, res) => {
  try {
    const { id } = req.params
    const { likes } = req.body
    if (!likes) {
      return res.status(400).json({ error: 'No likes provided to add' })
    }

    const updatedSkillRequest = await SkillRequest.findByIdAndUpdate(
      id,
      { $addToSet: { likes: { $each: likes } } },
      { new: true }
    )

    if (!updatedSkillRequest) {
      return res.status(404).json({ error: 'SkillRequest not found' })
    }

    return res.status(200).json({
      message: 'Fields successfully updated',
      skillRequest: updatedSkillRequest
    })
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error updating fields', details: error.message })
  }
}

const removeLikeFromReq = async (req, res) => {
  try {
    const id = req.params.id
    const { likes } = req.body

    const updatedSkillRequest = await SkillRequest.findByIdAndUpdate(
      id,
      { $pull: { likes } },
      { new: true }
    )

    if (!updatedSkillRequest) {
      return res.status(404).json('Event not found')
    }

    return res.status(200).json(updatedSkillRequest)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error removing like from SkillRequest')
  }
}

const deleteSkillRequest = async (req, res, next) => {
  try {
    const { id } = req.params

    const skillRequestDeleted = await SkillRequest.findByIdAndDelete(id)
    deleteFile(skillRequestDeleted.picture)
    return res.status(200).json({
      mensaje: 'Skill Request Deleted',
      skillRequestDeleted: skillRequestDeleted
    })
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error deleting element', details: error.message })
  }
}
module.exports = {
  getAllSkillRequests,
  getSkillRequestsProgressive,
  getSkillRequestsById,
  createSkillRequest,
  updateSkillRequest,
  addUserId,
  removeLikeFromReq,
  deleteSkillRequest,
  getSkillRequestsByWord,
  getSkillRequestsByLocation
}
