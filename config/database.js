const mongoose = require('mongoose')

module.exports = (config) => {
  mongoose.connect(config.connectionString)


  let database = mongoose.connection
  database.once('open', (error) => {
    if (error) {
      console.log(error)
      return
    }
    console.log('DB Opened on address: ' + config.connectionString)
  })

  //REQUIRE MODULES HERE!
  require('./../models/Comment')
  require('./../models/Role').initialize()
  require('./../models/Article')
  require('./../models/User').seedAdmin()
  require('./../models/Extra')
  require('./../models/Location')
}
