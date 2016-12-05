const mongoose = require('mongoose')

let locationSchema = mongoose.Schema(
  {
    name: {type: String, required: true, unique: true}
  }
)

const Location = mongoose.model('Location', locationSchema)

module.exports = Location