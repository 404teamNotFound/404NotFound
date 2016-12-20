const Extra = require('mongoose').model('Extra')

module.exports = {
  getExtrasAll: (req, res) => {
    let currPage = req.params.page || 1
    Extra.paginate({}, {page: currPage, limit: 5}).then(result => {
      //TODO create a function for this array creation
      let pages = []
      for (let i = 1; i <= result.pages; i++) {
        pages.push(i)
      }
      res.render('admin/extra/all', {extras: result.docs, pages: pages, lastPage: result.pages})
    })
  },
  getExtraCreate: (req, res) => {
    res.render('admin/extra/create')
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
        res.render('admin/extra/create', {error: errorMsg})
        return
      }

      let extraObject = {
        name: extraArgs.inputName
      }
      Extra.create(extraObject).then(extra => {
        res.redirect('/admin/extra/all')
      })
    })
  },
  getExtraEdit: (req, res) => {
    let id = req.params.id

    Extra.findById(id).then(extra => {
      res.render('admin/extra/edit', {extra: extra})
    })
  },
  postExtraEdit: (req, res) => {
    let id = req.params.id
    let extraArgs = req.body

    Extra.findById(id).then(extra => {
      let errorMsg = ''
      if (!extraArgs.inputName) errorMsg = 'Please enter valid name!'
      if (errorMsg) {
        res.render('admin/extra/edit', {error: errorMsg})
      } else {
        let extraObj = {name: extraArgs.inputName}
        Extra.findOneAndUpdate({_id: id}, extraObj, {new: true}, (error, extra) => {
          if (error) {
            //TODO display error message (404 - template)
            console.log(error)
          } else {
            res.redirect('/admin/extra/all')
          }
        })
      }
    })
  },
  getExtraDelete: (req, res) => {
    let id = req.params.id

    Extra.findById(id).then(extra => {
      res.render('admin/extra/delete', {extra: extra})
    })
  },
  postExtraDelete: (req, res) => {
    let id = req.params.id

    Extra.findOneAndRemove({_id: id}).then(extra => {
      extra.prepareDelete()
      res.redirect('/admin/extra/all')
    })
  }
}