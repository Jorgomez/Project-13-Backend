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
  addLike,
  removeLikeFromReq,
  deleteSkillRequest
} = require('../controllers/skillRequest')
const skillRequestsRouter = require('express').Router()

skillRequestsRouter.get('/', getSkillRequests)
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
skillRequestsRouter.put('/like/:id', addLike)

skillRequestsRouter.put('/removeLike/:id', removeLikeFromReq)

skillRequestsRouter.delete('/:id', isCreatorOrAdmin, deleteSkillRequest)

module.exports = skillRequestsRouter
