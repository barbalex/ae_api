'use strict'

const app = require('ampersand-app')

module.exports = (taxId) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        id, name
      FROM
        ae.taxonomy_object
      WHERE
        taxonomy_id = '${taxId}' AND
        (
          parent_id IS NULL OR
          parent_id = id
        )
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
