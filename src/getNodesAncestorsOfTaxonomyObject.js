'use strict'

const app = require('ampersand-app')

module.exports = (taxId) =>
  new Promise((resolve, reject) => {
    const sql = `
    WITH RECURSIVE tree AS (
      SELECT id, ARRAY[]::uuid[] AS ancestors
      FROM ae.taxonomy_object WHERE parent_id IS NULL

      UNION ALL

      SELECT ae.taxonomy_object.id, tree.ancestors || ae.taxonomy_object.parent_id
      FROM ae.taxonomy_object, tree
      WHERE ae.taxonomy_object.parent_id = tree.id
    )
    SELECT unnest(ancestors) FROM tree WHERE id = '${taxId}'
    `
    app.db.many(sql)
      .then((data) => {
        if (data) return resolve(data)
        reject(`no data received from db`)
      })
      .catch((error) => reject(error))
  })
