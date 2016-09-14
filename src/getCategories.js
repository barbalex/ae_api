'use strict'

const app = require('ampersand-app')

const sql = `
  SELECT
    *
  FROM
    ae.category
`

module.exports = () =>
  app.db.any(sql)
    .then((data) => {
      const categories = data.map((d) =>
        d.name
      )
      return categories
    })
    .catch((error) => {
      throw error
    })
