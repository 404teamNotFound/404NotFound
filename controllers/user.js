const User = require('mongoose').model('User')
const Role = require('mongoose').model('Role')
const encryption = require('./../utilities/encryption')

module.exports = {
  registerGet: (req, res) => {
    res.render('user/register')
  },

  registerPost:(req, res) => {
    let registerArgs = req.body

    User.findOne({email: registerArgs.email}).then(user => {
      let errorMsg = ''
      if (user) {
        errorMsg = 'User with the same Email exists!'
      } else if (!User.validateEmail(registerArgs.email)) {
        errorMsg = 'Please enter valid Email address!'
      } else if(!User.validateFullName(registerArgs.fullName)) {
        errorMsg = 'Please enter valid Full Name'
      } else if (registerArgs.password !== registerArgs.repeatedPassword) {
        errorMsg = 'Passwords do not match!'
      } else if (!User.validatePassword(registerArgs.password)) {
        errorMsg = 'Please enter valid password - (at least 4 chars)!'
      }

      if (errorMsg) {
        registerArgs.error = errorMsg
        res.render('user/register', registerArgs)
      } else {
        let salt = encryption.generateSalt()
        let passwordHash = encryption.hashPassword(registerArgs.password, salt)

        let userObject = {
          email: registerArgs.email,
          passwordHash: passwordHash,
          fullName: registerArgs.fullName,
          salt: salt
        }

        let roles = []
        Role.findOne({name: 'User'}).then(role => {
          roles.push(role.id)

          userObject.roles = roles
          User.create(userObject).then(user => {
            user.prepareInsert()
            req.logIn(user, (err) => {
              if (err) {
                registerArgs.error = err.message
                res.render('user/register', registerArgs)
                return
              }

              res.redirect('/')
            })
          })
        })
      }
    })
  },

  loginGet: (req, res) => {
    res.render('user/login')
  },

  loginPost: (req, res) => {
    let loginArgs = req.body
    User.findOne({email: loginArgs.email}).then(user => {
      if (!user || !user.authenticate(loginArgs.password)) {
        let errorMsg = 'Either username or password is invalid!'
        loginArgs.error = errorMsg
        res.render('user/login', loginArgs)
        return
      }

      req.logIn(user, (err) => {
        if (err) {
          console.log(err)
          res.redirect('/user/login', {error: err.message})
          return
        }

        user.isInRole('Editor').then(isEditor => {
          let returnUrl = '/'
          if (isEditor) returnUrl = '/editor/article/all'
          if (req.session.returnUrl) {
            returnUrl = req.session.returnUrl
            delete req.session.returnUrl
          }
          res.redirect(returnUrl)
        })
      })
    })
  },

  logout: (req, res) => {
    req.logOut()
    res.redirect('/')
  }
}