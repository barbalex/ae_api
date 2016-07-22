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
        'taxonomy_object' as type,
        ae.taxonomy_object.id,
        ae.taxonomy_object.parent_id,
        ae.taxonomy_object.name,
        tree.ancestors as path
      FROM
        ae.taxonomy_object
          INNER JOIN tree
          on tree.id = ae.taxonomy_object.id
      WHERE
        ae.taxonomy_object.id IN (
          SELECT
            id
          FROM
            ae.taxonomy_object
          WHERE
            parent_id = '${parentId}'
        )
      ORDER BY
        ae.taxonomy_object.name
    `
    app.db.many(sql)
      .then((data) => {
        if (data) return resolve(data)
        reject(`no data received from db`)
      })
      .catch((error) => reject(error))
  })
