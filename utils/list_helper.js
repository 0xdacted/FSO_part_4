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
    author: mostBlogsAuthor
    blogs: mostBlogsCount
  }
}

module.exports = {
  totalLikes,
  favoriteBlog
}