'use strict'

const app = require(`ampersand-app`)

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
      .then((result) => {
        if (result) return resolve(result)
        reject(`no object received from db`)
      })
      .catch((error) => reject(error))
  })
