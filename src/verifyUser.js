'use strict'

const app = require(`ampersand-app`)
const bcrypt = require(`bcrypt`)

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
        if (!user) return resolve()
        bcrypt.compare(password, user.password, (err, isValid) => {
        if (isValid) {
          res(user);
        }
        else {
          res(Boom.badRequest('Incorrect password!'));
        }
        resolve(data)
      })
      .catch((error) => reject(error))
  })

