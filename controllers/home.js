module.exports = {
  index: (req, res) => {
    res.render('home/index', {title: "404 Not Found"})
  },
  indexPost: (req, res) => {
    let searchArgs = req.body
    res.render('article/all', {searched: searchArgs})
  }
}