const Location = require('mongoose').model('Location')
const Article = require('mongoose').model('Article')
const Comment = require('mongoose').model('Comment')

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
    Article.findById(id).populate({
      path: 'comments',
      populate: {
        path: 'authorId',
        model: 'User'
      }
    }).populate('author location').then(article => {
      if (article) {
        res.render('article/single', {article : article})
      } else {
        //TODO 404 page
        console.log('Article with id: ' + id + ' Not Found')
        res.redirect('/')
       }
    })
  },
  postUploadComment: (req, res) => {
    let commentArgs = req.body
    if (req.user.id === commentArgs.authorId)
    {
      let commentObj = {
        articleId: commentArgs.articleId,
        authorId: commentArgs.authorId,
        content: commentArgs.content
      }
      Comment.create(commentObj).then(comment => {
        if (comment) {
          Article.findById(comment.articleId).then(article => {
            article.insertComment(comment)
          })
          Comment.populate(comment, 'authorId', (err, comment) => {
            if (err) {
              //TODO send result with error code to AJAX function
            } else {
              res.type('json')
              res.status(200)
              res.send(comment)
            }
          })
        } else {
          //TODO send result with error code to AJAX function
        }
      })
    }
  }
}
