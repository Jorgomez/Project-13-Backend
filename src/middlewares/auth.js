const SkillRequest = require('../api/models/skillRequest')
const User = require('../api/models/user')
const { verifyJwt } = require('../config/jwt')

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization

    if (!token) {
      // return res.status(400).json('you are not authorized') respuesta anterior
      return res.status(400).json({ error: `you are not authorized` })
    }
    const parsedToken = token.replace('Bearer ', '')
    const { id } = verifyJwt(parsedToken)
    const user = await User.findById(id)
    user.password = null
    req.user = user
    next()
  } catch (error) {
    // return res.status(400).json({ error: `you are not authorized` })
    return res
      .status(400)
      .json({ error: `you are not authorized`, details: error.message })
  }
}
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(400).json('you are not authorized')
    }
    const parsedToken = token.replace('Bearer ', '')
    const { id } = verifyJwt(parsedToken)

    const user = await User.findById(id)
    if (user.role === 'admin') {
      user.password = null
      req.user = user
      next()
    } else {
      return res.status(400).json('You role is not Admin')
    }
  } catch (error) {
    return res.status(400).json('you are not authorized')
  }
}
const isUserOrAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const { id: idToUpdate } = req.params
    // const { role } = req.body // <-----this is in case that you want to update de role on the users

    if (!token) {
      return res.status(400).json({ error: `you are not authorized` })
    }
    const parsedToken = token.replace('Bearer ', '')
    const { id: tokenId } = verifyJwt(parsedToken)

    const user = await User.findById(tokenId)

    // if (role && user.role !== 'admin') {
    //   return res.status(403).json({
    //     error: 'you are not admin',
    //     message: 'Only admins can update roles'
    //   })
    // }  <---------// this is in case that you want to update de role on the users

    if (user.id === idToUpdate || user.role === 'admin') {
      user.password = null
      req.user = user
      next()
    } else {
      return res.status(400).json({
        message: 'you are not authorized'
      })
    }
  } catch (error) {
    return (
      res.status(400).json({
        message: 'you are not authorized'
      }),
      console.log(error)
    )
  }
}

const isCreator = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const { id } = req.params
    const skillRequest = await SkillRequest.findById(id)
    if (!token) {
      return res.status(400).json('you are not authorized')
    }
    const parsedToken = token.replace('Bearer ', '')

    const { id: tokenId } = verifyJwt(parsedToken)
    const user = await User.findById(tokenId)
    console.log(user.id, skillRequest.user.toString())
    if (user.id === skillRequest.user.toString()) {
      user.password = null
      req.user = user
      next()
    } else {
      return res.status(400).json('You are not the user creator')
    }
  } catch (error) {
    return res.status(400).json('you are not authorized'), console.log(error)
  }
}

const isCreatorOrAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const { id } = req.params
    const skillRequest = await SkillRequest.findById(id)
    if (!token) {
      return res.status(400).json('you are not authorized')
    }
    const parsedToken = token.replace('Bearer ', '')
    const { id: tokenId } = verifyJwt(parsedToken)
    const user = await User.findById(tokenId)
    console.log(
      'storage user:',
      user.id,
      'SkillRequestcreator:',
      skillRequest.user.toString(),
      user.role
    )
    if (user.id === skillRequest.user.toString() || user.role === 'admin') {
      user.password = null
      req.user = user
      next()
    } else {
      return res.status(400).json('Your are not the Admin/Creator')
    }
  } catch (error) {
    return res.status(400).json('you are not authorized'), console.log(error)
  }
}

module.exports = {
  isAuth,
  isUserOrAdmin,
  isCreator,
  isAdmin,
  isCreatorOrAdmin
}
