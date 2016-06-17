'use strict'

const app = require(`ampersand-app`)

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
      .then((data) => {
        if (!data) return reject(`no user received from db`)

        resolve(data)
      })
      .catch((error) => reject(error))
  })

