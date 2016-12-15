const Location = require('mongoose').model('Location')
const Article = require('mongoose').model('Article')

module.exports = {
  getIndex: (req, res) => {
    res.render('home/index', {title: "404 Not Found"})
  },
  postArticlesByLocation: (req, res) => {
    let searchArgs = req.body

    Location.findOne({name: { $regex: new RegExp("^" + searchArgs.location.toLowerCase(), "i") }}).then(location => {
      if (location) {
        Article.find({location: location._id}).populate('author location').then(articles => {
          if (articles) {
            res.render('article/all', {articles: articles, searched: searchArgs, isMatches: true})
          } else {
            res.render('article/all', {searched: searchArgs, isMatches: false})
          }
        })
      } else {
        res.render('article/all', {searched: searchArgs, isMatches: false})
      }
    })
  },
  getArticle: (req, res) => {
    let id = req.params.id
    Article.findById(id).populate('author location').then(article => {
      if (article) {
        res.render('article/single', {article : article})
      } else {
        //TODO 404 page
        console.log('Article with id: ' + id + ' Not Found')
        res.redirect('/')
      }
    })
  }
}