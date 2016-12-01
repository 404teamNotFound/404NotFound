const mongoose = require('mongoose')

let articleSchema = mongoose.Schema(
  {
    name: {type: String, required: true, unique: true}
  }
)

const Extra = mongoose.model('Extra', articleSchema)

module.exports = Extra