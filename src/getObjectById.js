'use strict'

const app = require('ampersand-app')

const sql = `
  SELECT
    *
  FROM
    ae.object
  WHERE
    id = $1
`

module.exports = (id) =>
  app.db.one(sql, id)
    .then((data) =>
      data
    )
    .catch((error) => {
      throw error
    })
