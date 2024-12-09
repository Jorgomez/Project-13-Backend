const {
  isAuth,
  isCreator,
  isCreatorOrAdmin
} = require('../../middlewares/auth')
const { upload } = require('../../middlewares/file')
const {
  getSkillRequests,
  createSkillRequest,
  updateSkillRequest,
  getSkillRequestsById,

  removeLikeFromReq,
  deleteSkillRequest,
  addUserId,
  getAllSkillRequests,
  getSkillRequestsProgressive,
  getSkillRequestsByWord,
  getSkillRequestsByLocation
} = require('../controllers/skillRequest')
const skillRequestsRouter = require('express').Router()

skillRequestsRouter.get('/', getAllSkillRequests)
skillRequestsRouter.get(
  '/progressive',

  getSkillRequestsProgressive
)
skillRequestsRouter.get('/skill', getSkillRequestsByWord)

skillRequestsRouter.get('/location', getSkillRequestsByLocation)

skillRequestsRouter.get('/:id', isAuth, getSkillRequestsById)

skillRequestsRouter.post(
  '/',
  isAuth,
  upload('project13/pictures').fields([{ name: 'picture' }]),
  createSkillRequest
)

skillRequestsRouter.put(
  '/:id',
  upload('project13/pictures').fields([{ name: 'picture' }]),
  updateSkillRequest
)
skillRequestsRouter.put('/like/:id', addUserId)
skillRequestsRouter.put('/disLike/:id', removeLikeFromReq)
skillRequestsRouter.delete('/:id', isCreatorOrAdmin, deleteSkillRequest)

module.exports = skillRequestsRouter
