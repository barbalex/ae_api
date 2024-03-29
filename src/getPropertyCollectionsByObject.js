'use strict'

const app = require('ampersand-app')

const sql = `
  SELECT
    ae.property_collection.*,
    ae.property_collection_object.properties
  FROM
    ae.property_collection_object
    INNER JOIN ae.property_collection
    ON property_collection.id = ae.property_collection_object.property_collection_id
  WHERE
    object_id = $1
`

module.exports = (id) =>
  app.db.many(sql, [id])
    .then((data) =>
      data || []
    )
    .catch(() => [])
