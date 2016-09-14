'use strict'

const app = require('ampersand-app')
const getRelationPartnersByRelation = require('./getRelationPartnersByRelation.js')

module.exports = (object_id, relation_collection_id) => {
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
  return app.db.many(sql, [object_id, relation_collection_id])
    .then((data) => {
      if (data) {
        relations = data
      } else {
        throw new Error(`no relations received from db`)
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
      return relations
    })
    .catch((error) => {
      throw error
    })
}
