const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')



blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
  }
  catch (error) {
    response.status(500).json({ error: error.message })
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'Title and url are required' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })
    const result = await blog.save()
    user.blogs = user.blogs.concat(blog._id)
    await user.save()
    response.status(201).json(result)
  }
  catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'Blog not found '})
    }
    if (blog.user.toString() !== decodedToken.id.toString()) {
      return response.status(401).json({ error: 'unauthorized' })
    }
    await blog.remove()

    response.status(204).end()
  }
  catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const blog = await Blog.findByIdAndUpdate(
      request.params.id, { likes: request.body.likes }, { new: true }
    )
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    if (blog.user.toString() !== decodedToken.id.toString()) {
      return response.status(401).json({ error: 'unauthorized' })
    }
    response.json(blog)
  }
  catch (error) {
    response.status(400).json({ error: error.message })
  }
})

module.exports = blogsRouter