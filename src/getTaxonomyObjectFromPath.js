'use strict'

const app = require('ampersand-app')

module.exports = (path) =>
  new Promise((resolve, reject) => {
    const sql = `
      WITH RECURSIVE tree AS (
        SELECT
          id,
          ARRAY[]::text[] AS ancestors
        FROM
          ae.taxonomy_object
        WHERE
          parent_id IS NULL

        UNION ALL

        SELECT
          ae.taxonomy_object.id,
          tree.ancestors || ae.taxonomy_object.name
        FROM
          ae.taxonomy_object,
          tree
        WHERE
          ae.taxonomy_object.parent_id = tree.id
      )
      SELECT
        id
      FROM
        tree
      WHERE ancestors = ARRAY['${path.join("','")}']
    `
    app.db.one(sql)
      .then((data) => {
        if (data) return resolve(data.id)
        reject(`no data received from db`)
      })
      .catch((error) => reject(error))
  })
