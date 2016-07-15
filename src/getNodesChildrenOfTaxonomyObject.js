'use strict'

// TODO

const app = require('ampersand-app')

module.exports = () =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        *
      FROM
        ae.user
    `
    app.db.many(sql)
      .then((data) => {
        if (data) return resolve(data)
        reject(`no users received from db`)
      })
      .catch((error) => reject(error))
  })
