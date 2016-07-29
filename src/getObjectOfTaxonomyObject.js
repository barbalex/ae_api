'use strict'

const app = require('ampersand-app')

module.exports = (id) =>
  new Promise((resolve) => {
    if (id) {
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
      app.db.one(sql, id)
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
