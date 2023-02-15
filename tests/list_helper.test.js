const listHelper = require('../utils/list_helper')


describe('total likes', () => {
  
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog)
    expect(result).toBe(5)
  })


  test('when list has multiple blogs, equals the likes of all blogs', () => {
    const result = listHelper.totalLikes(listHelper.initialBlogs)
    expect(result).toBe(36)

  })
})

describe('favorite blog', () => {
  test('when list only has one blog, equals that blog', () => {
    const result = listHelper.favoriteBlog(listHelper.listWithOneBlog)
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

    const result = listHelper.favoriteBlog(listHelper.emptyList)
    expect(result).toBe(null)
  })

  test('when list has multiple blogs, equals blog with highest likes', () => {
    const result = listHelper.favoriteBlog(listHelper.initialBlogs)
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
    const result = listHelper.mostBlogs(listHelper.listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('when list has no blogs, equals null', () => {

    const result = listHelper.mostBlogs(listHelper.emptyList)
    expect(result).toBe(null)
  })

  test('when list has multiple blogs, equals author with most blogs', () => {
    const result = listHelper.mostBlogs(listHelper.initialBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
},
)

describe('most likes', () => {
  test('when list only has one blog, equals that author', () => {
    const result = listHelper.mostLikes(listHelper.listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list has no blogs, equals null', () => {

    const result = listHelper.mostLikes(listHelper.emptyList)
    expect(result).toBe(null)
  })

  test('when list has multiple blogs, equals blog with highest likes', () => {
    const result = listHelper.mostLikes(listHelper.initialBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
},
)
