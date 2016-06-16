'use strict'

const app = require(`ampersand-app`)
const getRelationsByORC = require(`./getRelationsByORC.js`)

module.exports = (object_id) =>
  new Promise((resolve, reject) => {
    let relationCollections
    const sql = `
      SELECT
        ae.relation_collection_object.relation_collection_id,
        ae.relation_collection.*
      FROM
        ae.relation_collection_object
        INNER JOIN ae.relation_collection
        ON relation_collection.id = ae.relation_collection_object.relation_collection_id
      WHERE
        object_id = $1
    `
    app.db.many(sql, [object_id])
      .then((data) => {
        if (data) {
          relationCollections = data
        } else {
          return reject(`no object_relation_collections received from db`)
        }
        return Promise.all(relationCollections.map((oRC) =>
          getRelationsByORC(object_id, oRC.relation_collection_id))
        )
      })
      .then((relationsArray) => {
        relationCollections = relationCollections.map((oRC, index) => {
          delete oRC.relation_collection_id
          oRC.relations = relationsArray[index]
          return oRC
        })
        resolve(relationCollections)
      })
      .catch((error) => reject(error))
  })
