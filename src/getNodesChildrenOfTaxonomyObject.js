'use strict'

const app = require('ampersand-app')

module.exports = (parentId) =>
  new Promise((resolve, reject) => {
    const sql = `
      WITH RECURSIVE tree AS (
        SELECT
          id,
          ARRAY[]::uuid[] AS ancestors
        FROM
          ae.taxonomy_object
        WHERE
          parent_id IS NULL

        UNION ALL

        SELECT
          ae.taxonomy_object.id,
          tree.ancestors || ae.taxonomy_object.parent_id
        FROM
          ae.taxonomy_object,
          tree
        WHERE
          ae.taxonomy_object.parent_id = tree.id
      )
      SELECT
        ae.taxonomy_object.id,
        ae.taxonomy_object.name,
        ae.taxonomy_object.taxonomy_id,
        ae.taxonomy.category,
        tree.ancestors as path
      FROM
        ae.taxonomy_object
          INNER JOIN tree
          ON tree.id = ae.taxonomy_object.id
          INNER JOIN ae.taxonomy
          ON ae.taxonomy.id = ae.taxonomy_object.taxonomy_id
      WHERE
        ae.taxonomy_object.parent_id = '${parentId}'
      ORDER BY
        ae.taxonomy_object.name
    `
    app.db.any(sql)
      .then((data) => {
        const nodesChildren = data.map((n) => ({
          type: 'taxonomy_object',
          id: n.id,
          name: n.name,
          parent_id: parentId,
          path: [n.category, n.taxonomy_id].concat(n.path).concat(n.id)
        }))
        resolve(nodesChildren)
      })
      .catch((error) => reject(error))
  })
