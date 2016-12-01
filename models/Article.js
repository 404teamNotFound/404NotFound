const mongoose = require('mongoose')

let articleSchema = mongoose.Schema(
  {
    title: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    date: {type: Date, default: Date.now()}
  }
)

articleSchema.statics.validatePrice = (price) => {
  if (!isNaN(parseFloat(price))) {
    if (price > 0) {
      return true
    }
  }
  return false
}

articleSchema.statics.validateImage = (image) => {
  if (image) {
    if (image.headers['content-type'].startsWith('image')) {
      return true
    }
  }
  return false
}

const Article = mongoose.model('Article', articleSchema)

module.exports = Article