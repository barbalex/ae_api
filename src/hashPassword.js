'use strict'

const bcrypt = require('bcrypt')

module.exports = (password, cb) => {
  bcrypt.genSalt(10, (error, salt) => {
    if (error) return cb(error, null)
    bcrypt.hash(password, salt, (err, hash) =>
      cb(err, hash)
    )
  })
}
