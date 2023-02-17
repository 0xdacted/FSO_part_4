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
      password: 'testpassword123',
      name: 'Test User',
    }
    const response = await api.post('/api/users').send(user).expect(200)
    expect(response.body.username).toBe(user.username)
  })

})


afterAll(async () => {
  await mongoose.connection.close
})