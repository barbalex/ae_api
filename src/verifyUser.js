'use strict'

const app = require('ampersand-app')
const bcrypt = require('bcrypt')

const sql = `
  SELECT
    *
  FROM
    ae.user
  WHERE
    name = $1
`

module.exports = (name, password) =>
  app.db.one(sql, [name])
    .then((user) => {
      if (!Object.keys(user)) {
        return null
      }
      bcrypt.compare(
        password,
        user.password,
        (err, isValid) => {
          console.log('isValid', isValid)
          if (isValid) {
            return user
          }
          return null
        }
      )
    })
    .catch((error) => {
      throw error
    })
