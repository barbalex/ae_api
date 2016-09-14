'use strict'

const app = require('ampersand-app')

const sql = `
  SELECT
    ae.taxonomy.category
  FROM
    ae.taxonomy_object
    INNER JOIN
      ae.taxonomy
      ON ae.taxonomy.id = ae.taxonomy_object.taxonomy_id
  WHERE
    ae.taxonomy_object.id = $1
`

module.exports = (id) =>
  app.db.oneOrNone(sql, id)
    .then((data) => {
      if (data && data.category) return data.category
      throw new Error(`no data received from db`)
    })
    .catch((error) => {
      throw error
    })
