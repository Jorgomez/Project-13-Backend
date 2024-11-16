const { deleteFile } = require('../../utils/Functions/delete.file')
const SkillRequest = require('../models/skillRequest')

const getSkillRequests = async (req, res, next) => {
  try {
    const skillRequests = await SkillRequest.find()
      .populate('user')
      .populate('likes')
    return res.status(200).json(skillRequests)
  } catch (error) {
    return res.status(400).json('error getEvents Function')
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

// verificar al momento de tener el fron, como ingesare los campos  skillToLearn, skillToTeach, alternativeOffer ======>
const createSkillRequest = async (req, res, next) => {
  try {
    // const { skillToLearn, skillToTeach, alternativeOffer } = req.body

    // console.log(skillToLearn, skillToTeach, alternativeOffer)

    const newSkillRequest = new SkillRequest({
      ...req.body,
      user: req.user._id
    })

    if (req.files && req.files.picture && req.files.picture[0]) {
      newSkillRequest.picture = req.files.picture[0].path
    }

    // Filtrar valores únicos solo si están presentes

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

    return res.status(201).json(SkillRequestSaved)
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
const addLike = async (req, res) => {
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

    console.log(updatedSkillRequest.likes)
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
  getSkillRequests,
  getSkillRequestsById,
  createSkillRequest,
  updateSkillRequest,
  addLike,
  removeLikeFromReq,
  deleteSkillRequest
}
