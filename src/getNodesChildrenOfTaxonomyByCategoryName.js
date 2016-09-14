'use strict'

const app = require('ampersand-app')

const sql = `
  SELECT
    'taxonomy_object' as type,
    ae.taxonomy_object.id,
    ae.taxonomy_object.name,
    taxonomy_id AS parent_id,
    ae.taxonomy.category
  FROM
    ae.taxonomy_object
    INNER JOIN ae.taxonomy
    ON ae.taxonomy.id = ae.taxonomy_object.taxonomy_id
  WHERE
    ae.taxonomy.name = $1 AND
    ae.taxonomy.category = $2 AND
    ae.taxonomy_object.parent_id IS NULL
  ORDER BY
    name
`

module.exports = (category, name) =>
  app.db.any(sql, [name, category])
    .then((data) => {
      data.forEach((d) => {
        d.path = [d.category, d.parent_id, d.id]
        delete d.category
      })
      if (data) return data
      throw new Error(`no data received from db`)
    })
    .catch((error) => {
      throw error
    })
