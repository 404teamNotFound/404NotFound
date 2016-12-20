const Article = require('mongoose').model('Article')
const Extra = require('mongoose').model('Extra')
const Location = require('mongoose').model('Location')


function createArrayForSingleString(articleArgs, inputType) {
  if (articleArgs[inputType]) {
    if (typeof articleArgs[inputType] === 'string')
      articleArgs[inputType] = [articleArgs[inputType]]
  }
  return articleArgs
}

module.exports = {
  getArticlesAll: (req, res) => {
    let currPage = req.params.page || 1
    req.user.isInRole('Admin').then(isAdmin => {
      if (isAdmin) {
        Article.paginate({}, {populate: 'author location', page: currPage, limit: 5}).then(result => {
          //TODO create a function for this array creation
          let pages = []
          for (let i = 1; i <= result.pages; i++) {
            pages.push(i)
          }
          res.render('editor/article/all', {articles: result.docs, pages: pages, lastPage: result.pages})
        })
      } else {
        Article.paginate({author: req.user.id}, {populate: 'author location', page: currPage, limit: 2}).then(result => {
          //TODO create a function for this array creation
          let pages = []
          for (let i = 1; i <= result.pages; i++) {
            pages.push(i)
          }
          res.render('editor/article/all', {articles: result.docs, pages: pages, lastPage: result.pages})
        })
      }
    })

  },
  getArticleCreate: (req, res) => {
    let step = req.params.step
    //check if editing
    let id = req.params.id
    if (id) {
      //Edit Article
      Article.findById(id).populate('location').then(article => {
        req.user.isAuthorized(req, article).then(isAuthorized => {
          if (!isAuthorized) {
            console.log('UNAUTHORIZED ACCESS ATTEMPT!')
            res.redirect('/')
            return
          } else {
            let articleArgs = {
              id: article.id,
              inputTitle: article.title,
              inputAddress: article.address,
              inputPrice: article.price,
              inputLocation: article.location.name,
              inputDescription: article.description,
              inputImages: article.images,
              inputExtras: article.extras,
              inputContactEmail: article.contactEmail,
              inputContactPhone: article.contactPhone,
              inputContactWebSite: article.contactURL
            }
            res.render('editor/article/create-step1', {articleArgs: articleArgs})
          }
        })
      })
    } else {
      //Create Article
      res.render('editor/article/create-step1')
    }

  },
  postArticleCreate: (req, res) => {
    let step = req.params.step
    let errorMsg = ''

    let articleArgs = req.body
    articleArgs = createArrayForSingleString(articleArgs, 'inputImages')
    articleArgs = createArrayForSingleString(articleArgs, 'inputExtras')

    if (step === '1') {

      //TODO check if errors
      if(!articleArgs.inputTitle) {
        errorMsg = 'Please enter valid Title!'
      } else if (!Article.validatePrice(articleArgs.inputPrice)) {
        errorMsg = 'Please enter valid Price!'
      } else if (!articleArgs.inputLocation) {
        errorMsg = 'Please enter valid Location!'
      } else if (!articleArgs.inputDescription) {
        errorMsg = 'Please enter valid Description'
      }

      if (errorMsg) {
        res.render('editor/article/create-step1', {error: errorMsg, articleArgs: articleArgs})
        return
      } else {
        res.render('editor/article/create-step2', {articleArgs: articleArgs})
        return
      }

    } else if (step === '2') {

      //check if back button is pressed
      if (articleArgs.back) {
        res.render('editor/article/create-step1', {articleArgs: articleArgs})
        return
      } else {
        if (errorMsg) {
          res.render('editor/article/create-step2', {error: errorMsg, articleArgs: articleArgs})
          return
        } else {
          Extra.find({}).then(extras => {
            let populatedIsChecked = Extra.populateChecked(extras, articleArgs.inputExtras)
            res.render('editor/article/create-step3', {articleArgs: articleArgs, extras: populatedIsChecked})
            return
          })
        }
      }

    } else if (step === '3') {

      //check if back button is pressed
      if (articleArgs.back) {
        //Display images?

        res.render('editor/article/create-step2', {articleArgs: articleArgs})
        return
      } else {
        articleArgs.inputContactEmail = req.user.email
        res.render('editor/article/create-step4', {articleArgs: articleArgs})
        return
      }

    } else if (step === '4') {

      //check if back button is pressed
      if (articleArgs.back) {
        Extra.find({}).then(extras => {
          let populatedIsChecked = Extra.populateChecked(extras, articleArgs.inputExtras)
          res.render('editor/article/create-step3', {articleArgs: articleArgs, extras: populatedIsChecked})
          return
        })
      } else {
        //TODO check for errors
        if (!Article.validateEmail(articleArgs.inputContactEmail)) {
          errorMsg = 'Please enter valid Email Address!'
        } else if (!Article.validatePhone(articleArgs.inputContactPhone)) {
          errorMsg = 'Please enter valid Phone Number!'
        } else if (!Article.validateURL(articleArgs.inputContactWebSite)) {
          errorMsg = 'Please enter valid Web Site Address!'
        } else if(!articleArgs.inputTitle) {
          errorMsg = 'Please enter valid Title! (STEP 1)'
        } else if (!Article.validatePrice(articleArgs.inputPrice)) {
          errorMsg = 'Please enter valid Price! (STEP 1)'
        } else if (!articleArgs.inputLocation) {
          errorMsg = 'Please enter valid Location! (STEP 1)'
        } else if (!articleArgs.inputDescription) {
          errorMsg = 'Please enter valid Description (STEP 1)'
        }

        if (errorMsg) {
          res.render('editor/article/create-step4', {error: errorMsg, articleArgs: articleArgs})
        } else {
          //TODO VALIDATE ALL FIELDS AND CREATE ARTICLE
          let articleObj = {
            title: articleArgs.inputTitle,
            address: articleArgs.inputAddress,
            price: articleArgs.inputPrice,
            description: articleArgs.inputDescription,
            contactEmail: articleArgs.inputContactEmail,
            contactPhone: articleArgs.inputContactPhone,
            contactURL: articleArgs.inputContactWebSite
          }
          let images = []
          if (articleArgs.inputImages) {
            for (let image of articleArgs.inputImages) {
              images.push(image)
            }
          }
          articleObj.images = images

          let extras = []
          if (articleArgs.inputExtras) {
            for (let extra of articleArgs.inputExtras) {
              extras.push(extra)
            }
          }
          articleObj.extras = extras

          //Check if in create or edit mode
          if (!articleArgs.id) {
            //create
            articleObj.author = req.user.id
            Article.create(articleObj).then(article => {
              article.prepareInsert(articleArgs.inputLocation)
              res.redirect('/editor/article/all')
            }).catch(error => {
              //TODO display error message (404 - template)
              console.log(error)
            })
          } else {
            //edit

            //check if user is AUTHORIZED
            Article.findById(articleArgs.id).then(article => {
              req.user.isAuthorized(req, article).then(isAuthorized => {
                if (!isAuthorized) {
                  console.log('UNAUTHORIZED ACCESS ATTEMPT!')
                  res.redirect('/')
                  return
                } else {
                  //user is AUTHORIZED
                  Article.findOneAndUpdate({_id: articleArgs.id}, articleObj, {new: true}, (error, article) => {
                    if (error) {
                      //TODO display error message (404 - template)
                      console.log(error)
                    } else {
                      article.prepareInsert(articleArgs.inputLocation)
                      res.redirect('/editor/article/all')
                    }
                  })
                }
              })
            })
          }
        }
      }
    }
  },
  getArticleDelete: (req, res) => {
    let id = req.params.id
    Article.findById(id).then(article => {
      if (article) {
        res.render('editor/article/delete', {article: article})
      }
    })
  },
  postArticleDelete: (req, res) => {
    let id = req.params.id
    Article.findById(id).then(article => {
      req.user.isAuthorized(req, article).then(isAuthorized => {
        if (!isAuthorized) {
          console.log('UNAUTHORIZED ACCESS ATTEMPT!')
          res.redirect('/')
          return
        } else {
          Article.findOneAndRemove({_id: id}).then((article, error) => {
            if (error) {
              //TODO display error
              console.log(error)
            } else {
              article.prepareDelete()
              res.redirect('/editor/article/all')
            }
          })
        }
      })
    })
  }
}
