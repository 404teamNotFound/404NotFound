const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Comment = require('mongoose').model('Comment')

let articleSchema = mongoose.Schema(
  {
    title: {type: String, required: true},
    price: {type: Number, required: true},
    location: {type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
    description: {type: String, required: true},
    images: [{type: String}],
    extras: [{type: mongoose.Schema.Types.ObjectId, ref: 'Extra'}],
    contactEmail: {type: String, required: true},
    contactPhone: {type: String, required: true},
    contactURL: {type: String},
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    date: {type: Date, default: Date.now()},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
  }
)

articleSchema.method({
  prepareInsert: function (locationName) {
    let Location = mongoose.model('Location')
    Location.findOne({name: locationName}).then(location => {
      if (location) {
        this.location = location._id
        this.save()
      } else {
        Location.create({name: locationName}).then(location => {
          this.location = location._id
          this.save()
        })
      }
    })
  },
  insertComment: function (comment) {
    if (!this.comments) {
      this.comments = []
    }
    this.comments.push(comment._id)
    this.save()
  },
  prepareDelete: function () {
    Comment.remove({articleId: this.id}, (err, removed) => {
      //removed - count of the deleted Comments
      if (err) {
        //TODO error handle
        console.log(err)
      }
    })
  }
})

articleSchema.statics.validatePrice = (price) => {
  if (!isNaN(parseFloat(price))) {
    if (price > 0) {
      return true
    }
  }
  return false
}

articleSchema.statics.validateImage = (image) => {
  if (image.size !== 0) {
    if (!image.headers['content-type'].startsWith('image')) {
      return false
    }
  }
  return true
}

articleSchema.statics.validateEmail = (email) => {
  if (email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  } else  {
    return false
  }
}

articleSchema.statics.validatePhone = (phone) => {
  if (phone) {
    phone = phone.replace(/\s/g, '')
    let re = /^(\+|[0-9])[0-9]{5,15}$/
    return re.test(phone)
  } else {
    return false
  }
}

articleSchema.statics.validateURL = (url) => {
  if (url) {
    let re = /^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}.?([a-z]+)?$/
    return re.test(url)
  }
  return true
}

articleSchema.plugin(mongoosePaginate)
const Article = mongoose.model('Article', articleSchema)

module.exports = Article