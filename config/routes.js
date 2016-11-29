const homeController = require('./../controllers/home')
const userController = require('./../controllers/user')
const editorController = require('./../controllers/editor')

module.exports = (app) => {
  app.get('/', homeController.index)
  app.post('/', homeController.indexPost)

  app.get('/user/register', userController.registerGet)
  app.post('/user/register', userController.registerPost)
  //
  app.get('/user/login', userController.loginGet)
  app.post('/user/login', userController.loginPost)
  //
  app.get('/user/logout', userController.logout)

  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
      req.user.isInRole('Editor').then(isEditor => {
        if (isEditor) {
          next()
        } else {
          res.redirect('/')
        }
      })
    } else {
      res.redirect('/user/login')
    }
  })
  //EDITOR AUTHENTICATED
  app.get('/editor/articles/all', editorController.getAllArticles)

  app.get('/editor/articles/create', editorController.getCreateArticle)

  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
      req.user.isInRole('Admin').then(isAdmin => {
        if (isAdmin) {
          next()
        } else {
          res.redirect('/')
        }
      })
    } else {
      res.redirect('/user/login')
    }
  })

  //Admin Modules Here
  //app.get('/admin/user/all', adminController.user.all)


}

