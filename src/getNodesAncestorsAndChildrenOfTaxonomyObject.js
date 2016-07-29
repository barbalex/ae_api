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
      ae.taxonomy_object.object_id,
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
      -- list of parents of taxonomy object
      ae.taxonomy_object.parent_id IN (
        WITH RECURSIVE tree AS (
          SELECT
            ae.taxonomy_object.id,
            ARRAY[]::uuid[] AS path
          FROM
            ae.taxonomy_object
          WHERE
            parent_id IS NULL

          UNION ALL

          SELECT
            ae.taxonomy_object.id,
            tree.path || ae.taxonomy_object.parent_id
          FROM
            ae.taxonomy_object,
            tree
          WHERE
            ae.taxonomy_object.parent_id = tree.id
        )
        SELECT
          unnest(path)
        FROM
          tree
        WHERE
          id = '${id}'
        -- add taxonomy
        UNION SELECT
          ae.taxonomy_object.taxonomy_id
        FROM
          ae.taxonomy_object
        WHERE
          ae.taxonomy_object.id = '${id}'
      )
      -- add the taxonomy object queried
      OR ae.taxonomy_object.id = '${id}'
      -- add top level of taxonomy objects for the active taxonomy
      OR (
        ae.taxonomy_object.parent_id IS NULL AND
        ae.taxonomy_object.taxonomy_id IN (
          SELECT taxonomy_id
          FROM ae.taxonomy_object
          WHERE id = '${id}'
        )
      )
      -- add all children
      OR ae.taxonomy_object.parent_id = '${id}'
    `
    app.db.any(sql)
      .then((data) => {
        const nodesAncestors = data.map((n) => {
          const path = [n.category, n.taxonomy_id].concat(n.path)
          path.push(id)
          return {
            type: 'taxonomy_object',
            id: n.id,
            name: n.name,
            parent_id: n.parent_id,
            object_id: n.object_id,
            path
          }
        })
        resolve(nodesAncestors)
      })
      .catch((error) => reject(error))
  })
