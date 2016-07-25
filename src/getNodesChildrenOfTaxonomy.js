'use strict'

const app = require('ampersand-app')

module.exports = (taxId) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        'taxonomy_object' as type,
        ae.taxonomy_object.id,
        ae.taxonomy_object.name,
        taxonomy_id AS parent_id,
        ae.taxonomy.category
      FROM
        ae.taxonomy_object
        INNER JOIN ae.taxonomy
        ON ae.taxonomy.id = ae.taxonomy_object.taxonomy_id
      WHERE
        taxonomy_id = '${taxId}' AND
        ae.taxonomy_object.parent_id IS NULL
      ORDER BY
        name
    `
    app.db.any(sql)
      .then((data) => {
        data.forEach((d) => {
          d.path = [d.category, d.parent_id, d.id]
          delete d.category
        })
        if (data) return resolve(data)
        reject(`no data received from db`)
      })
      .catch((error) => reject(error))
  })
