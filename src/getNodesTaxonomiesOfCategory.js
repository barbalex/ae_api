'use strict'

const app = require('ampersand-app')

const sql = `
  SELECT
    id,
    name,
    category
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
      const nodesTaxonomies = data.map((n) => ({
        type: 'taxonomy',
        id: n.id,
        name: n.name,
        parent_id: n.category,
        path: [n.category, n.id]
      }))
      return nodesTaxonomies
    })
    .catch((error) => {
      throw error
    })
