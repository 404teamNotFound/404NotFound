const mongoose = require('mongoose')
mongoose.Promise = global.Promise

let roleSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
})

const Role = mongoose.model('Role', roleSchema)
module.exports = Role

module.exports.initialize = () => {
  Role.findOne({name: 'User'}).then(role => {
    if (!role) {
      Role.create({name: 'User'})
    }
  })
  Role.findOne({name: 'Admin'}).then(role => {
    if (!role) {
      Role.create({name: 'Admin'})
    }
  })
  Role.findOne({name: 'Booker'}).then(role => {
    if (!role) {
      Role.create({name: 'Booker'})
    }
  })
}