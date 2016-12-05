const multiparty = require('multiparty')
const Article = require('mongoose').model('Article')
const Extra = require('mongoose').model('Extra')
const Location = require('mongoose').model('Location')

// function getFirstElementsFromMulty(fields) {
//   let newArgs = {}
//   for(let arg in fields) {
//     newArgs[arg] = fields[arg][0]
//   }
//   return newArgs
// }

function createArrayForSingleString(articleArgs, inputType) {
  if (articleArgs[inputType]) {
    if (typeof articleArgs[inputType] === 'string')
      articleArgs[inputType] = [articleArgs[inputType]]
  }
  return articleArgs
}

module.exports = {
  getArticlesAll: (req, res) => {
    res.render('editor/article/all')
  },
  getArticleCreate: (req, res) => {
    let step = req.params.step
    if (step === '1') {
      res.render('editor/article/create-step1')
    } else if (step === '2') {
      res.render('editor/article/create-step2')
    } else if (step === '3') {
      res.render('editor/article/create-step3')
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
        res.render('editor/article/create-step1', {articleArgs: articleArgs, articleFiles: articleArgs.inputImages})
        return
      } else {
        if (errorMsg) {
          res.render('editor/article/create-step2', {error: errorMsg, articleArgs: articleArgs})
          return
        } else {
          Extra.find({}).then(extras => {
            let populatedIsChecked = Extra.populateChecked(extras, articleArgs.inputExtras)
            res.render('editor/article/create-step3', {articleArgs: articleArgs, extras: populatedIsChecked,
              articleFiles: articleArgs.inputImages})
            return
          })
        }
      }

    } else if (step === '3') {

      //check if back button is pressed
      if (articleArgs.back) {
        //Display images?

        res.render('editor/article/create-step2', {articleArgs: articleArgs, articleFiles: articleArgs.inputImages})
        return
      } else {
        res.render('editor/article/create-step4', {articleArgs: articleArgs, articleFiles: articleArgs.inputImages})
        return
      }

    } else if (step === '4') {

      //check if back button is pressed
      if (articleArgs.back) {
        Extra.find({}).then(extras => {
          let populatedIsChecked = Extra.populateChecked(extras, articleArgs.inputExtras)
          res.render('editor/article/create-step3', {articleArgs: articleArgs, extras: populatedIsChecked,
            articleFiles: articleArgs.inputImages})
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
        }

        if (errorMsg) {
          res.render('editor/article/create-step4', {error: errorMsg, articleArgs: articleArgs,
            articleFiles: articleArgs.inputImages})
        } else {
          //TODO VALIDATE ALL FIELDS AND CREATE ARTICLE
          res.redirect('/editor/article/all')
          return
        }
      }
    }
  }
}
