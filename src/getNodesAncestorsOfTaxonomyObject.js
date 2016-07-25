'use strict'

const app = require('ampersand-app')

module.exports = (id) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        ae.taxonomy_object.id,
        CASE
          WHEN parent_id IS NULL THEN taxonomy_id
          ELSE parent_id
        END
        AS parent_id,
        ae.taxonomy_object.name,
        ae.taxonomy_object.taxonomy_id,
        ae.taxonomy.category,
        tree.ancestors as path
      FROM
        ae.taxonomy_object
          INNER JOIN (
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
              id,
              ancestors
            FROM
              tree
          ) AS tree
          ON tree.id = ae.taxonomy_object.id
          INNER JOIN ae.taxonomy
          ON ae.taxonomy.id = ae.taxonomy_object.taxonomy_id
      WHERE
        ae.taxonomy_object.id IN (
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
            unnest(ancestors) AS id
          FROM tree
          WHERE id = '${id}'
          UNION
          SELECT '${id}' as id
        )
    `
    app.db.any(sql)
      .then((data) => {
        const nodesAncestors = data.map((n) => ({
          type: 'taxonomy_object',
          id: n.id,
          name: n.name,
          parent_id: n.parent_id,
          path: [n.category, n.taxonomy_id].concat(n.path)
        }))
        resolve(nodesAncestors)
      })
      .catch((error) => reject(error))
  })
