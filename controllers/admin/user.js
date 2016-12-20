const User = require('mongoose').model('User')
const Role = require('mongoose').model('Role')
const encryption = require('./../../utilities/encryption')

module.exports = {
  all: (req, res) => {
    let currPage = req.params.page || 1
    User.paginate({}, {page: currPage, limit: 5}).then(result => {
      for (let user of result.docs) {
        user.isInRole('Admin').then(isAdmin => {
          user.isAdmin = isAdmin
        })
      }
      //TODO create a function for this array creation
      let pages = []
      for (let i = 1; i <= result.pages; i++) {
        pages.push(i)
      }
      res.render('admin/user/all', {users: result.docs, pages: pages, lastPage: result.pages})
    })
  },
  getEdit: (req, res) => {
    let id = req.params.id

    User.findById(id).then(user => {
      Role.find({}).then(roles => {
        for (let role of roles) {
          if (user.roles.indexOf(role.id) !== -1) {
            role.isChecked = true
          }
        }
        res.render('admin/user/edit', {user: user, roles: roles})
      })
    })
  },
  postEdit: (req, res) => {
    let id = req.params.id
    let userArgs = req.body

    User.findOne({email: userArgs.email, _id: {$ne: id}}).then(user => {
      let errorMsg = ''
      if (user) {
        errorMsg = 'User with the same username exists!'
      } else if (!userArgs.email) {
        errorMsg = 'Email cannot be empty!'
      } else if (!userArgs.fullName) {
        errorMsg = 'Name cannot be empty!'
      } else if (userArgs.password !== userArgs.confirmedPassword) {
        errorMsg = 'Passwords do not match!'
      }

      if (errorMsg) {
        userArgs.error = errorMsg
        res.render('admin/user/edit', userArgs)
      } else {
        Role.find({}).then(roles => {
          let newRoles = roles.filter(role => {
            return userArgs.roles.indexOf(role.name) !== -1
          }).map(role => {
            return role.id
          })

          User.findOne({_id: id}).then(user => {
            user.email = userArgs.email
            user.fullName = userArgs.fullName

            let passwordHash = user.passwordHash
            if (userArgs.password) {
              passwordHash = encryption.hashPassword(userArgs.password, user.salt)
            }

            user.passwordHash = passwordHash
            user.roles = newRoles

            user.save((err) => {
              if (err) {
                res.redirect('/')
              } else {
                res.redirect('/admin/user/all')
              }
            })
          })
        })
      }
    })
  },
  getDelete: (req, res) => {
    let id = req.params.id
    User.findById(id).then(user => {
      res.render('admin/user/delete', {userToDelete: user})
    })
  },
  postDelete: (req, res) => {
    let id = req.params.id

    User.findOneAndRemove({_id: id}).then(user => {
      user.prepareDelete()
      res.redirect('/admin/user/all')
    })
  }
}