'use strict'

const app = require('ampersand-app')
const bcrypt = require('bcrypt')

module.exports = (name, password) =>
  new Promise((resolve, reject) => {
    /**
     * find a user in the db with this name
     */
    const sql = `
      SELECT
        *
      FROM
        ae.user
      WHERE
        name = $1
    `
    app.db.one(sql, [name])
      .then((user) => {
        if (!Object.keys(user)) {
          return resolve()
        }
        bcrypt.compare(
          password,
          user.password,
          (err, isValid) => {
            console.log('isValid', isValid)
            if (isValid) {
              return resolve(user)
            }
            resolve(null)
          }
        )
      })
      .catch((error) => reject(error))
  })
