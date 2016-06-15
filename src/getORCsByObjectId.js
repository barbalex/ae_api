'use strict'

const app = require(`ampersand-app`)

module.exports = (id) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        ae.object_relation_collection.*,
        ae.relation_collection.*
      FROM
        ae.object_relation_collection
        INNER JOIN ae.relation_collection
        ON relation_collection.id = ae.object_relation_collection.relation_collection_id
      WHERE
        object_id = $1
    `
    app.db.many(sql, [id])
      .then((data) => {
        if (data) return resolve(data)
        reject(`no object_relation_collections received from db`)
      })
      .catch((error) => reject(error))
  })
