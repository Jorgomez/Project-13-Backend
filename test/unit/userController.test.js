const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../src/api/models/user')
const { register } = require('../../src/api/controllers/user')

jest.mock('../../src/api/models/user') // Mockear el modelo User

describe('User Controller - Register', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a new user and return status 201', async () => {
    // Mock del request y response
    const req = {
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '12345',
        skillToLearn: 'Node.js'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    // Mock del método save
    const mockUserSave = jest.fn().mockResolvedValue({
      _id: 'mockUserId',
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10) // Contraseña encriptada
    })
    User.mockImplementation(() => ({
      save: mockUserSave
    }))

    // Llamar al controlador
    await register(req, res)

    // Verificar que se ejecutaron las funciones correctas
    expect(User).toHaveBeenCalledTimes(1) // El modelo User fue llamado una vez
    expect(mockUserSave).toHaveBeenCalledTimes(1) // El método save fue llamado
    expect(res.status).toHaveBeenCalledWith(201) // Respuesta 201
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john.doe@example.com',
        skillToLearn: 'Node.js'
      })
    )
  })

  it('should return 400 if the email already exists', async () => {
    // Mock del request y response
    const req = {
      body: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: '12345',
        skillToLearn: 'React'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    // Mock del método findOne para simular un correo duplicado
    User.findOne = jest.fn().mockResolvedValue({
      email: 'jane.doe@example.com'
    })

    // Llamar al controlador
    await register(req, res)

    // Verificar que no se creó un usuario nuevo
    expect(User.findOne).toHaveBeenCalledWith({ email: 'jane.doe@example.com' })
    expect(res.status).toHaveBeenCalledWith(400) // Respuesta 400
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('already registered')
      })
    )
  })
})
