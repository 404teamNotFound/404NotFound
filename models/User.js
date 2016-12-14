const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const Role = require('mongoose').model('Role')
const Article = require('mongoose').model('Article')
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
  isAuthor: function (article) {
    if(!article) {
      return false
    }
    let isAuthor = article.author.equals(this.id)
    return isAuthor
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
  isAuthorized: function (req, article) {
    return req.user.isInRole('Admin').then(isAdmin => {
      if (!isAdmin && !req.user.isAuthor(article)) {
        return false
      }
      return true
    })
  },
  prepareInsert: function () {
    for (let role of this.roles) {
      Role.findById(role).then(role => {
        role.users.push(this.id)
        role.save()
      })
    }
  },
  prepareDelete: function () {
    Articles.findOneAndRemove({author: this.id}).then((articles, error) => {
      if (error) {
        //TODO display error
        console.log(error)
      }
    })
  }
});


const User = mongoose.model('User', userSchema)
module.exports = User


module.exports.seedAdmin = () => {
  let email = 'admin@admin.com'
  User.findOne({email: email}).then(admin => {
    if(!admin) {
      Role.findOne({name: 'Admin'}).then(adminRole => {
        Role.findOne({name: 'Editor'}).then(editorRole => {
          let salt = encryption.generateSalt()
          let passwordHash = encryption.hashPassword('root', salt)

          let roles = []
          roles.push(adminRole.id)
          roles.push(editorRole.id)
          let user = {
            email: email,
            passwordHash: passwordHash,
            fullName: 'Administrator',
            salt: salt,
            roles: roles
          }
          User.create(user).then(user => {
            adminRole.users.push(user.id)
            adminRole.save(err => {
              if (err) {
                console.log(err.message)
              } else {
                console.log('Admin created successfully!')
              }
            })
            editorRole.users.push(user.id)
            editorRole.save(err => {
              if (err) {
                console.log(err.message)
              } else {
                console.log('Editor created successfully!')
              }
            })
          })
        })
      })
    } else {
      console.log('Admin/Editor already created!')
    }
  })
}
