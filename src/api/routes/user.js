const {
  getUsers,
  register,
  getUserById,
  login,
  deleteUser,
  updateUser,
  removeFavoriteFromUser,
  addSkillRequestsId,
  addElementId
} = require('../controllers/user')
const { upload } = require('../../middlewares/file')
const { isAuth, isAdmin, isUserOrAdmin } = require('../../middlewares/auth')
const usersRouter = require('express').Router()

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUserById)
usersRouter.post(
  '/register',
  upload('project13/profilePicture').fields([{ name: 'profilePicture' }]),
  register
)
usersRouter.post('/login', login)
usersRouter.put(
  '/:id',
  isUserOrAdmin,
  upload('project13/profilePicture').fields([{ name: 'profilePicture' }]),
  updateUser
)
usersRouter.put('/addElementId/:id', addElementId)
usersRouter.put('/disLike/:id', removeFavoriteFromUser)
usersRouter.delete('/:id', isUserOrAdmin, deleteUser)

// usersRouter.post(
//   '/register',
//   upload('project10/profileUsers').fields([{ name: 'profileImg' }]),
//   register
// )

// usersRouter.put(
//   '/:id',
//   upload('project10/profileUsers').fields([{ name: 'profileImg' }]),
//   isUserOrAdmin,
//   updateUser
// )

// usersRouter.put('/removeEvent/:id', isUserOrAdmin, removeEventFromUser)

// usersRouter.delete(
//   '/:id',
//   isUserOrAdmin,
//   upload('project10/profileUsers').fields([{ name: 'profileImg' }]),
//   deleteUser
// )

module.exports = usersRouter
