'use strict'

const app = require('ampersand-app')

module.exports = (category) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        id,
        name,
        category
      FROM
        ae.taxonomy
      WHERE
        category = '${category}'
      ORDER BY
        name
    `
    app.db.many(sql)
      .then((data) => {
        const nodesTaxonomies = data.map((n) => ({
          type: 'taxonomy',
          id: n.id,
          name: n.name,
          parent_id: n.category,
          path: [n.category, n.id]
        }))
        resolve(nodesTaxonomies)
      })
      .catch((error) => reject(error))
  })
