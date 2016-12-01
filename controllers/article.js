const multiparty = require('multiparty')
const Article = require('mongoose').model('Article')
const Extra = require('mongoose').model('Extra')
const os = require('os')
const util = require('util')


module.exports = {
  getArticlesAll: (req, res) => {
    res.render('editor/article/all')
  },
  getArticleCreate: (req, res) => {
    Extra.find({}).then(extras => {
      res.render('editor/article/create', {extras: extras})
    })
  },
  postArticleCreate: (req, res) => {
    let form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
      //Multiparty Form Submit
      console.log(fields)
      console.log(files)

      let articleArgs = fields
      let errorMsg = ''

      if(!articleArgs.inputTitle[0]) {
        errorMsg = 'Invalid Title!'
      } else if (!Article.validatePrice(articleArgs.inputPrice[0])) {
        errorMsg = 'Invalid Price!'
      } else if (!articleArgs.inputLocation[0]) {
        errorMsg = 'Invalid Location!'
      } else if (!articleArgs.inputDescription[0]) {
        errorMsg = 'Invalid Description'
      } else if (!Article.validateImage(files.image[0])) {
        errorMsg = 'Invalid File! Please try to upload image!'
      } else if (!articleArgs.inputContacts[0]) {
        errorMsg = 'Invalid Contacts'
      }


      if(errorMsg) {
        res.render('editor/article/create', {error: errorMsg})
        return
      }

    })
  }
}
