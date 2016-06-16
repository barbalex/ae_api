'use strict'

const app = require(`ampersand-app`)
const getRelationsByORC = require(`./getRelationsByORC.js`)

module.exports = (object_id) =>
  new Promise((resolve, reject) => {
    let oRCs
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
    app.db.many(sql, [object_id])
      .then((data) => {
        if (data) {
          oRCs = data
        } else {
          return reject(`no object_relation_collections received from db`)
        }
        return Promise.all(oRCs.map((oRC) =>
          getRelationsByORC(object_id, oRC.relation_collection_id))
        )
      })
      .then((relationsArray) => {
        oRCs = oRCs.map((oRC, index) => {
          oRC.relations = relationsArray[index]
          return oRC
        })
        resolve(oRCs)
      })
      .catch((error) => reject(error))
  })
