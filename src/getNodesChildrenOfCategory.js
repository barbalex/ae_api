'use strict'

const app = require('ampersand-app')

const sql = `
  SELECT
    'taxonomy' as type,
    id,
    name,
    category AS parent_id
  FROM
    ae.taxonomy
  WHERE
    category = $1
  ORDER BY
    name
`

module.exports = (category) =>
  app.db.any(sql, category)
    .then((data) => {
      data.forEach((d) => {
        d.path = [d.parent_id, d.id]
      })
      if (data) return data
      throw new Error(`no data received from db`)
    })
    .catch((error) => {
      throw error
    })
