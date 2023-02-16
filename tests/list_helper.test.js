const helper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const mongoose = require('mongoose')

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
    const newBlog = {
      title: 'Test Blog Post',
      author: 'John Doe',
      url: 'http://testblog.com',
      likes: 10
    }
    
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const savedBlog = await Blog.findById(response.body.id)
    expect(savedBlog).toMatchObject(newBlog)

    const finalBlogs = await Blog.find({})
    expect(finalBlogs).toHaveLength(helper.initialBlogs.length + 1)

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

afterAll(async () => {
  await mongoose.connection.close
})