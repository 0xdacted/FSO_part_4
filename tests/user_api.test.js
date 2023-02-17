const helper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const mongoose = require('mongoose')



afterAll(async () => {
  await mongoose.connection.close
})