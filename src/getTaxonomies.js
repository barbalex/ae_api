'use strict'

const app = require('ampersand-app')

const sql = `
  SELECT
    *
  FROM
    ae.taxonomy
`

module.exports = () =>
  app.db.many(sql)
    .then((data) => {
      if (data) return data
      throw new Error(`no taxonomies received from db`)
    })
    .catch((error) => {
      throw error
    })
