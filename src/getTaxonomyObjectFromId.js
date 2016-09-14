'use strict'

const app = require('ampersand-app')

const sql = `
  SELECT
    *
  FROM
    ae.taxonomy_object
  WHERE
    id = $1
`

module.exports = (id) =>
  app.db.one(sql, id)
    .then((data) => {
      if (data) return data
      throw new Error(`no data received from db`)
    })
    .catch((error) => {
      throw error
    })
