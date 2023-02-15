

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let maxLikes = 0
  let favorite = {}

  for (const blog of blogs) {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes
      favorite = blog
    }
  }

  return favorite
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) return null
  const authors = {}

  for (const blog of blogs) {
    if (!authors[blog.author]) {
      authors[blog.author] = 1
    }
    else {
      authors[blog.author] += 1
    }
  }
  let mostBlogsAuthor = ""
  let mostBlogsCount = 0

  for (const author in authors) {
    if (authors[author] > mostBlogsCount) {
      mostBlogsAuthor = author
      mostBlogsCount = authors[author]
    }
  }
  return {
    author: mostBlogsAuthor,
    blogs: mostBlogsCount
  }
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return null
  const authors = {}

  for (const blog of blogs) {
    if (!authors[blog.author]) {
      authors[blog.author] = blog.likes
    }
    else {
      authors[blog.author] += blog.likes
    }
  }
  let mostLikesAuthor = ""
  let mostLikesCount = 0

  for (const author in authors) {
    if (authors[author] > mostLikesCount) {
      mostLikesAuthor = author
      mostLikesCount = authors[author]
    }
  }
  return {
    author: mostLikesAuthor,
    likes: mostLikesCount
  }
}

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const emptyList = []

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  listWithOneBlog,
  emptyList,
  initialBlogs,
}