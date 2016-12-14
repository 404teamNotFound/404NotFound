const homeController = require('./../controllers/home')
const userController = require('./../controllers/user')
const articleController = require('./../controllers/article')
const extraController = require('./../controllers/editor/extra')
const photoController = require('./../controllers/photo')
const adminController = require('./../controllers/admin/admin')

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

  //TODO Security check for authenticated user
  app.post('/upload_photos', photoController.uploadPhotos)

  //TODO ADMIN OR EDITOR AUTHORISATION
  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
      req.user.isInRole('Editor').then(isEditor => {
        req.user.isInRole('Admin').then(isAdmin => {
          if (isEditor || isAdmin) {
            next()
          } else {
            res.redirect('/')
          }
        })
      })
    } else {
      res.redirect('/user/login')
    }
  })
  //EDITOR AUTHENTICATED
  app.get('/editor/article/all', articleController.getArticlesAll)

  app.get('/editor/article/create/step/:step', articleController.getArticleCreate)
  app.post('/editor/article/create/step/:step', articleController.postArticleCreate)
  app.get('/editor/article/edit/:id/step/:step', articleController.getArticleCreate)
  app.post('/editor/article/edit/:id/step/:step', articleController.postArticleCreate)
  app.get('/editor/article/delete/:id', articleController.getArticleDelete)


  app.get('/editor/extra/all', extraController.getExtrasAll)

  app.get('/editor/extra/create', extraController.getExtraCreate)
  app.post('/editor/extra/create', extraController.postExtraCreate)

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
  app.get('/admin/user/all', adminController.user.all)
  app.get('/admin/user/edit/:id', adminController.user.getEdit)
  app.post('/admin/user/edit/:id', adminController.user.postEdit)
  app.get('/admin/user/delete/:id', adminController.user.getDelete)
  app.post('/admin/user/delete/:id', adminController.user.postDelete)
}

