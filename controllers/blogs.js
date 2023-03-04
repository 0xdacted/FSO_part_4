const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const Comment = require('../models/comment')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
  }
  catch (error) {
    response.status(500).json({ error: error.message })
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' })
    }

    const comment = new Comment({
      text: request.body.text,
      blog: blog.id
    })

    const savedComment = await comment.save()
    blog.comments.push(savedComment.id)
    response.status(201).json(savedComment)
  }
  catch (error) {
    response.status(500).json({ error: 'Comment not saved' })
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'Title and url are required' })
    }
    if (!request.token) {
      return response.status(401).json({ error: 'token is invalid' })
    }
    const user = request.user
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id
    })
    const result = await blog.save()
    const returnedObject = result.toJSON()
    user.blogs = user.blogs.concat(blog._id)
    await user.save()
    response.status(201).json(returnedObject)
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
    if (decodedToken.id.toString() !== blog.user._id.toString()) {
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
    console.log(decodedToken)
    if (!decodedToken) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const blog = await Blog.findByIdAndUpdate(
      request.params.id, { likes: request.body.likes }, { new: true }
    )
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    // if (decodedToken.id.toString() !== blog.user._id.toString()) {
    //   return response.status(401).json({ error: 'unauthorized' })
    // }
    response.json(blog)
  }
  catch (error) {
    response.status(400).json({ error: error.message })
  }
})



module.exports = blogsRouter