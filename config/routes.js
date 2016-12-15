const userController = require('./../controllers/user')
const articleController = require('./../controllers/article')
const photoController = require('./../controllers/photo')
const editorController = require('./../controllers/editor/editor')
const adminController = require('./../controllers/admin/admin')

module.exports = (app) => {
  app.get('/', articleController.getIndex)
  app.post('/', articleController.postArticlesByLocation)

  app.get('/article/view/:id', articleController.getArticle)

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
  app.get('/editor/article/all', editorController.article.getArticlesAll)

  app.get('/editor/article/create/step/:step', editorController.article.getArticleCreate)
  app.post('/editor/article/create/step/:step', editorController.article.postArticleCreate)
  app.get('/editor/article/edit/:id/step/:step', editorController.article.getArticleCreate)
  app.post('/editor/article/edit/:id/step/:step', editorController.article.postArticleCreate)
  app.get('/editor/article/delete/:id', editorController.article.getArticleDelete)


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

  app.get('/admin/extra/all', adminController.extra.getExtrasAll)

  app.get('/admin/extra/create', adminController.extra.getExtraCreate)
  app.post('/admin/extra/create', adminController.extra.postExtraCreate)
  app.get('/admin/extra/edit/:id', adminController.extra.getExtraEdit)
  app.post('/admin/extra/edit/:id', adminController.extra.postExtraEdit)
  app.get('/admin/extra/delete/:id', adminController.extra.getExtraDelete)
  app.post('/admin/extra/delete/:id', adminController.extra.postExtraDelete)
}

