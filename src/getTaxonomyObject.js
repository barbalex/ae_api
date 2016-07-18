'use strict'

const app = require('ampersand-app')

module.exports = (id) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        *
      FROM
        ae.taxonomy_object
      WHERE
        id = '${id}'
    `
    app.db.one(sql)
      .then((data) => {
        if (data) return resolve(data)
        reject(`no data received from db`)
      })
      .catch((error) => reject(error))
  })
