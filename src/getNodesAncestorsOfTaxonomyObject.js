'use strict'

const app = require('ampersand-app')

module.exports = (taxId) =>
  new Promise((resolve, reject) => {
    const sql = `
    SELECT
      'taxonomy_object' AS type,
      id,
      CASE
        WHEN parent_id IS NULL THEN taxonomy_id
        ELSE parent_id
      END
      AS parent_id,
      name
    FROM
      ae.taxonomy_object
    WHERE
      id IN (
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
        WHERE id = '${taxId}'
        UNION
        SELECT '${taxId}' as id
      )
    `
    app.db.many(sql)
      .then((data) => {
        if (data) return resolve(data)
        reject(`no data received from db`)
      })
      .catch((error) => reject(error))
  })
