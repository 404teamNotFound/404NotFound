/**
 * Created by Dante on 24.11.2016 г..
 */
/**
 * Created by Dante on 10.11.2016 г..
 */
const path = require('path')

module.exports = {
  development: {
    rootFolder: path.normalize(path.join(__dirname, '/../')),
    connectionString: 'mongodb://localhost:27017/404'
  },
  production: {}
}