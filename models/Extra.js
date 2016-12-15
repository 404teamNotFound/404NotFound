const mongoose = require('mongoose')
const Article = require('mongoose').model('Article')

let extraSchema = mongoose.Schema(
  {
    name: {type: String, required: true, unique: true}
  }
)

extraSchema.statics.populateChecked = (extras, arrayIds) => {
  if (!arrayIds) {
    return extras
  } else {
    for (let extra of extras) {
      if (arrayIds.indexOf(extra.id) !== -1) {
        extra.checked = true
      }
    }
    return extras
  }
}

extraSchema.method ({
  prepareDelete: function () {
    Article.find({extras: this.id}).then(articles => {
      for (let article of articles) {
        let index = article.extras.indexOf(this.id)
        if (index !== -1) {
          article.extras.splice(index, 1)
          article.save((err) => {
            if (err) {
              //TODO display error message (404 - template)
              console.log(error)
            }
          })
        }
      }
    })
  }
})

const Extra = mongoose.model('Extra', extraSchema)

module.exports = Extra