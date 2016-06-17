'use strict'

const app = require('ampersand-app')

module.exports = () =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        *
      FROM
        ae.taxonomy
    `
    app.db.many(sql)
      .then((data) => {
        if (data) return resolve(data)
        reject(`no taxonomies received from db`)
      })
      .catch((error) => reject(error))
  })
