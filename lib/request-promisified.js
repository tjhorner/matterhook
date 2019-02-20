const requestOld = require('request')

module.exports = function(url, options) {
  return new Promise((resolve, reject) => {
    requestOld(url, options, (err, res, body) => {
      if(err) reject(err)
      if(!err) resolve({ res, body })
    })
  })
}