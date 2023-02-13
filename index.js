const config = require('./utils/config')
const app = require('./app')
const logger = require('./utils/logger')

const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())



app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})