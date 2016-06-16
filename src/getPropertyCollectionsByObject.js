'use strict'

const app = require(`ampersand-app`)

module.exports = (id) =>
  new Promise((resolve, reject) => {
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
    app.db.many(sql, [id])
      .then((data) => {
        if (data) return resolve(data)
        reject(`no object_property_collections received from db`)
      })
      .catch((error) => reject(error))
  })
