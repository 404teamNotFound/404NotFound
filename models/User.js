const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const Role = require('mongoose').model('Role')
const encryption = require('./../utilities/encryption');

let userSchema = mongoose.Schema(
  {
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    fullName: {type: String, required: true},
    roles: [{type: mongoose.Schema.Types.ObjectId, ref:'Role'}],
    salt: {type: String, required: true}
  }
)

userSchema.method ({
  authenticate: function (password) {
    let inputPasswordHash = encryption.hashPassword(password, this.salt);
    let isSamePasswordHash = inputPasswordHash === this.passwordHash;

    return isSamePasswordHash;
  },
  isInRole: function (roleName) {
    return Role.findOne({name: roleName}).then(role => {
      if(!role) {
        return false
      }
      let inRoles = this.roles.indexOf(role._id) !== -1
      return inRoles
    })
  },
  prepareInsert: function () {
    for (let role of this.roles) {
      Role.findById(role).then(role => {
        role.users.push(this.id)
        role.save()
      })
    }
  }
});


const User = mongoose.model('User', userSchema)
module.exports = User


module.exports.seedAdmin = () => {
  /*
  let email = 'admin@admin.com'
  User.findOne({email: email}).then(admin => {
    if(!admin) {
      Role.findOne({name: 'Admin'}).then(role => {
        let salt = encryption.generateSalt()
        let passwordHash = encryption.hashPassword('root', salt)

        let roles = []
        roles.push(role.id)
        let user = {
          email: email,
          passwordHash: passwordHash,
          fullName: 'Administrator',
          articles: [],
          salt: salt,
          roles: roles
        }
        User.create(user).then(user => {
          role.users.push(user.id)
          role.save(err => {
            if (err) {
              console.log(err.message)
            } else {
              console.log('Admin created successfully!')
            }
          })
        })
      })
    } else {
      console.log('Admin already created!')
    }
  })*/
}