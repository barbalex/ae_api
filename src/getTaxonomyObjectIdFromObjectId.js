'use strict'

const app = require('ampersand-app')

module.exports = (objectId) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        id
      FROM
        ae.taxonomy_object
      WHERE
        object_id = $1
    `
    app.db.one(sql, objectId)
      .then((data) => resolve(data.id))
      .catch((error) => reject(error))
  })
