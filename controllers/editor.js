module.exports = {
  getAllArticles: (req, res) => {
    res.render('editor/articles/all')
  },
  getCreateArticle: (req, res) => {
    res.render('editor/articles/create')
  }
}
