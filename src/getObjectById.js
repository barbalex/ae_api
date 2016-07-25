'use strict'

const app = require('ampersand-app')

module.exports = (id) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        *
      FROM
        ae.object
      WHERE
        id = $1
    `
    app.db.one(sql, [id])
      .then((data) =>
        resolve(data)
      )
      .catch((error) =>
        reject(error)
      )
  })
