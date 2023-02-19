const User = require('../models/user')

const loginAndFetchUser = async (api, existingUser) => {
  let token = await api.post('/api/users').send(existingUser)

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: existingUser.username,
      password: existingUser.password
    })

  const user = await User.findOne({ username: existingUser.username })

  token = loginResponse.body.token

  return { user, token }
}

module.exports = { loginAndFetchUser }