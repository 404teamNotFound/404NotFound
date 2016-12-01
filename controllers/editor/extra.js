const Extra = require('mongoose').model('Extra')

module.exports = {
  getExtrasAll: (req, res) => {
    Extra.find({}).then(extras => {
      res.render('editor/extra/all', {extras: extras})
    })
  },
  getExtraCreate: (req, res) => {
    res.render('editor/extra/create')
  },
  postExtraCreate: (req, res) => {
    let extraArgs = req.body
    let errorMsg = ''

    //check if extra already exists
    Extra.findOne({name: extraArgs.inputName}).then(extra => {
      if (extra) {
        errorMsg = 'Extra already exists!'
      } else if (!extraArgs.inputName) {
        errorMsg = 'Invalid Name!'
      }

      if (errorMsg) {
        res.render('editor/extra/create', {error: errorMsg})
        return
      }

      let extraObject = {
        name: extraArgs.inputName
      }
      Extra.create(extraObject).then(extra => {
        res.redirect('/editor/extra/all')
      })
    })


  }
}