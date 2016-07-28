'use strict'

const app = require('ampersand-app')

module.exports = (taxId) =>
  new Promise((resolve) => {
    if (taxId) {
      const sql = `
        SELECT
          ae.object.*
        FROM
          ae.taxonomy_object
          INNER JOIN ae.object
          ON ae.object.id = ae.taxonomy_object.object_id
        WHERE
          ae.taxonomy_object.id = $1
      `
      app.db.one(sql, [taxId])
        .then((data) =>
          resolve(data)
        )
        .catch(() =>
          resolve(null)
        )
    } else {
      resolve(null)
    }
  })
