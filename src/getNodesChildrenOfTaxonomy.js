'use strict'

const app = require('ampersand-app')

module.exports = (taxId) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        'taxonomy_object' as type,
        id,
        name,
        taxonomy_id AS parent_id
      FROM
        ae.taxonomy_object
      WHERE
        taxonomy_id = '${taxId}' AND
        ae.taxonomy_object.parent_id IS NULL
      ORDER BY
        name
    `
    app.db.many(sql)
      .then((data) => {
        if (data) return resolve(data)
        reject(`no data received from db`)
      })
      .catch((error) => reject(error))
  })
