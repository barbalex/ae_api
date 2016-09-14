'use strict'

const app = require('ampersand-app')

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
    ae.taxonomy_object.object_id,
    ae.taxonomy.category,
    tree.ancestors as path
  FROM
    ae.taxonomy_object
      INNER JOIN tree
      ON tree.id = ae.taxonomy_object.id
      INNER JOIN ae.taxonomy
      ON ae.taxonomy.id = ae.taxonomy_object.taxonomy_id
  WHERE
    ae.taxonomy_object.parent_id = $1
  ORDER BY
    ae.taxonomy_object.name
`

module.exports = (parentId) =>
  app.db.any(sql, parentId)
    .then((data) => {
      const nodesChildren = data.map((n) => ({
        type: 'taxonomy_object',
        id: n.id,
        name: n.name,
        parent_id: parentId,
        object_id: n.object_id,
        path: [n.category, n.taxonomy_id].concat(n.path).concat(n.id)
      }))
      return nodesChildren
    })
    .catch((error) => {
      throw error
    })
