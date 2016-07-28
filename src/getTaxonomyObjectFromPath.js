'use strict'

const app = require('ampersand-app')
const _ = require('lodash')

module.exports = (path) =>
  new Promise((resolve, reject) => {
    // remove category and taxonomy from path
    const arrayPath = _.clone(path)
    const category = arrayPath.shift()
    const taxonomyName = arrayPath.shift()
    const sql = `
      WITH RECURSIVE tree AS (
        SELECT
          *,
          ARRAY[ae.taxonomy_object.name]::text[] AS path
        FROM
          ae.taxonomy_object
        WHERE
          parent_id IS NULL

        UNION ALL

        SELECT
          ae.taxonomy_object.*,
          tree.path || ae.taxonomy_object.name
        FROM
          ae.taxonomy_object,
          tree
        WHERE
          ae.taxonomy_object.parent_id = tree.id
      )
      SELECT
        tree.*
      FROM
        tree
        INNER JOIN ae.taxonomy
        ON ae.taxonomy.id = tree.taxonomy_id
      WHERE
        tree.path = ARRAY['${arrayPath.join("','")}'] AND
        ae.taxonomy.category = '${category}' AND
        ae.taxonomy.name = '${taxonomyName}'
    `
    app.db.one(sql)
      .then((data) =>
        resolve(data)
      )
      .catch((error) =>
        reject(error)
      )
  })
