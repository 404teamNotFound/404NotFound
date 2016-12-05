const mongoose = require('mongoose')

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

const Extra = mongoose.model('Extra', extraSchema)

module.exports = Extra