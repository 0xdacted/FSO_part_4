const helper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const logger = require('../utils/logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

describe('database return values', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
  test('blogs are returned as json', async () => {
    await api 
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs should have a string "id" property as their unique identifier', async () => {
    const post = await new Blog({
      title: 'To be Deleted'
    })
    expect(post.id).toBeDefined()
    expect(typeof post.id).toBe('string')
  })
})

describe('creating a new blog post', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
  test('succeeds with valid data', async () => {
    const existingUser = {
      username: 'testuser',
      password: 'password123',
      name: 'Test User',
    }
    await api.post('/api/users').send(existingUser)

    const loginResponse = await api
      .post('/api/login')
      .send({
        username: existingUser.username,
        password: existingUser.password
    })


    const user = await User.findOne({ username: existingUser.username })

    const newBlog = {
      title: 'Test Blog Post',
      author: 'John Doe',
      url: 'http://testblog.com',
      likes: 10,
      user: user._id
    }

  
    const token = loginResponse.body.token

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)


    const savedBlog = await Blog.findById(response.body.id)
    expect(savedBlog).toMatchObject(newBlog)

    const finalBlogs = await Blog.find({})
    expect(finalBlogs).toHaveLength(helper.initialBlogs.length + 1)

  })
  test('default value for likes is 0', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'Test author',
      url: 'http://www.testblog.com'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
  })
  test('fails with status code 400 if title is missing', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
  test('fails with status code 400 if url is missing', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})


describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = helper.totalLikes(helper.listWithOneBlog)
    expect(result).toBe(5)
  })


  test('when list has multiple blogs, equals the likes of all blogs', () => {
    const result = helper.totalLikes(helper.initialBlogs)
    expect(result).toBe(36)

  })
})

describe('favorite blog', () => {
  test('when list only has one blog, equals that blog', () => {
    const result = helper.favoriteBlog(helper.listWithOneBlog)
    expect(result).toEqual({
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    })
  })

  test('when list has no blogs, equals null', () => {

    const result = helper.favoriteBlog(helper.emptyList)
    expect(result).toBe(null)
  })

  test('when list has multiple blogs, equals blog with highest likes', () => {
    const result = helper.favoriteBlog(helper.initialBlogs)
    expect(result).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    })
  })
}),

describe('most blogs', () => {
  test('when list only has one blog, equals that author', () => {
    const result = helper.mostBlogs(helper.listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('when list has no blogs, equals null', () => {

    const result = helper.mostBlogs(helper.emptyList)
    expect(result).toBe(null)
  })

  test('when list has multiple blogs, equals author with most blogs', () => {
    const result = helper.mostBlogs(helper.initialBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
},
)

describe('most likes', () => {
  test('when list only has one blog, equals that author', () => {
    const result = helper.mostLikes(helper.listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list has no blogs, equals null', () => {

    const result = helper.mostLikes(helper.emptyList)
    expect(result).toBe(null)
  })

  test('when list has multiple blogs, equals blog with highest likes', () => {
    const result = helper.mostLikes(helper.initialBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
},
)

describe('delete blog post routing', () => {
  test('deletes a single blog post', async () => {
    const newBlog = new Blog({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5,
    })
    await newBlog.save()
    await api.delete(`/api/blogs/${newBlog.id}`).expect(204)
    const blogsInDb = await Blog.find({})
    expect(blogsInDb).toHaveLength(helper.initialBlogs.length)
  })

  test('returns a 404 error if blog post not found', async () => {
    const invalidId = '123445787281'
    await api.delete(`/api/blogs${invalidId}`).expect(404)
  })
})

describe('update blog post routing', () => {
  test('updates the number of likes for a blog post', async () => {
    const newBlog = new Blog({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5,
    })
    await newBlog.save()

    const updatedBlog = { likes: 10 }
    const response = await api
      .put(`/api/blogs/${newBlog.id}`)
      .send(updatedBlog)
      .expect(200)

    expect(response.body.likes).toBe(10)
  })

  test('returns a 404 error if blog post not found', async () => {
    const invalidId = '123448784833'
    const updatedBlog = { likes: 10 }

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updatedBlog)
      .expect(404)
  })
})



afterAll(async () => {
  await mongoose.connection.close
})