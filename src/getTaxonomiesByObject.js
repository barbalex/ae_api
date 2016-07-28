'use strict'

const app = require('ampersand-app')

module.exports = (object_id) =>
  new Promise((resolve) => {
    const sql = `
      SELECT
        ae.taxonomy.id,
        ae.taxonomy.name AS taxonomy_name,
        ae.taxonomy.description,
        ae.taxonomy.links,
        ae.taxonomy.last_updated,
        ae.taxonomy.organization_id,
        ae.taxonomy.category,
        ae.taxonomy.is_category_standard,
        ae.taxonomy_object.parent_id,
        ae.taxonomy_object.name AS object_name,
        ae.taxonomy_object.properties
      FROM
        ae.taxonomy_object
        INNER JOIN ae.taxonomy
        ON taxonomy.id = ae.taxonomy_object.taxonomy_id
      WHERE
        object_id = $1
    `
    app.db.many(sql, [object_id])
      .then((data) => {
        if (data) return resolve(data)
        resolve([])
      })
      .catch(() => resolve([]))
  })
