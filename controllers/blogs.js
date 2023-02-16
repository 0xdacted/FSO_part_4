const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
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
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    })
    const result = await blog.save()
    response.status(201).json(result)
  }
  catch (error) {
    response.status(400).json({error: error.message})
  }
})

module.exports = blogsRouter