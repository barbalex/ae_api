'use strict'

const app = require('ampersand-app')

const sql = `
  SELECT
    id
  FROM
    ae.taxonomy_object
  WHERE
    object_id = $1
`

module.exports = (objectId) =>
  app.db.one(sql, objectId)
    .then((data) => data.id)
    .catch((error) => {
      throw error
    })
