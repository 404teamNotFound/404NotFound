const mongoose = require('mongoose')

let commentSchema = mongoose.Schema(
  {
    articleId: {type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true},
    authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true}
  }
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment