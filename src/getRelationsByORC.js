'use strict'

const app = require(`ampersand-app`)
const getRelationPartnersByRelation = require(`./getRelationPartnersByRelation.js`)

module.exports = (object_id, relation_collection_id) =>
  new Promise((resolve, reject) => {
    let relations
    const sql = `
      SELECT
        id,
        properties
      FROM
        ae.relation
      WHERE
        object_id = $1 AND
        relation_collection_id = $2
    `
    app.db.many(sql, [object_id, relation_collection_id])
      .then((data) => {
        if (data) {
          relations = data
        } else {
          return reject(`no relations received from db`)
        }
        return Promise.all(relations.map((relation) =>
          getRelationPartnersByRelation(relation.id))
        )
      })
      .then((relationPartnersArray) => {
        relations = relations.map((relation, index) => {
          relation.relationPartners = relationPartnersArray[index]
          return relation
        })
        resolve(relations)
      })
      .catch((error) => reject(error))
  })
