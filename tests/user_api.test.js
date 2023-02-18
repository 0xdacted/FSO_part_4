const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const mongoose = require('mongoose')


describe('AddUser', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('creates a new user with valid input', async () => {
    const user = {
      username: 'testuser',
      password: 'password123',
      name: 'Test User',
    }
    const response = await api.post('/api/users').send(user).expect(201)
    expect(response.body.username).toBe(user.username)
  })

  test('does not create a new user with invalid input', async () => {
    const user = {
      username: 'te',
      password: 'pa',
      name: 'Test User'
    }
    const response = await api.post('/api/users').send(user).expect(400)
    expect(response.body.error).toBeDefined()
  })

  test('does not create a new user with existing username', async () => {
    const existingUser = {
      username: 'testuser',
      password: 'password123',
      name: 'Test User',
    }
    await api.post('/api/users').send(existingUser)

    const newUser = {
      username: 'testuser',
      password: 'password456',
      name: 'Test User 2'
    }
    const response = await api.post('/api/users').send(newUser).expect(400)
    expect(response.body.error).toBeDefined
  })
})


afterAll(async () => {
  await mongoose.connection.close
})