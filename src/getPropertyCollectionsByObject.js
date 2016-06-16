'use strict'

const app = require(`ampersand-app`)

module.exports = (id) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        ae.property_collection.*,
        ae.object_property_collection.properties
      FROM
        ae.object_property_collection
        INNER JOIN ae.property_collection
        ON property_collection.id = ae.object_property_collection.property_collection_id
      WHERE
        object_id = $1
    `
    app.db.many(sql, [id])
      .then((data) => {
        if (data) return resolve(data)
        reject(`no object_property_collections received from db`)
      })
      .catch((error) => reject(error))
  })
