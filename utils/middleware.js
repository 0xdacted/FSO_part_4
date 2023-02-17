const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  request.token = null
  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (decodedToken) {
      request.user = await User.findById(decodedToken.d)
    }
  }
  next()
}

module.exports = { tokenExtractor, userExtractor }