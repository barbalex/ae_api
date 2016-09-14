'use strict'

const app = require('ampersand-app')

const sql = `
  SELECT
    *
  FROM
    ae.user
`

module.exports = () =>
  app.db.many(sql)
    .then((data) => {
      if (data) return data
      throw new Error(`no users received from db`)
    })
    .catch((error) => {
      throw error
    })
