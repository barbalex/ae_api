'use strict'

/**
 * builds an object of the form:
 * {
 *   "Objekt: id": xxx,
 *   "Objekt: <<object.fieldName>>": xxx,
 *   "Taxonomie: <<taxonomy.name>>: <<taxonomy.fieldName>>": xxx,
 *   "Taxonomie: <<taxonomy.name>>: Eigenschaft: <<properties.fieldName>>": xxx,
 *   "Eigenschaftensammlung: <<property_collection.name>>: <<property_collection.fieldName>>": xxx,
 *   "Eigenschaftensammlung: <<property_collection.name>>: Eigenschaft: <<properties.fieldName>>": xxx,
 *   "Beziehungssammlung: <<relation_collection.name>>: <<relation_collection.fieldName>>": xxx,
 *   "Beziehungssammlung: <<relation_collection.name>>: Eigenschaft: <<properties.fieldName>>": xxx,
 * }
 */

const Boom = require('boom')
const getObjectById = require('../../getObjectById.js')
const getRelationCollectionsByObject = require('../../getRelationCollectionsByObject.js')
const getPropertyCollectionsByObject = require('../../getPropertyCollectionsByObject.js')
const getTaxonomiesByObject = require('../../getTaxonomiesByObject.js')
const escapeStringForSql = require('../../escapeStringForSql.js')

module.exports = (request, reply) => {
  const combineTaxonomies = escapeStringForSql(request.payload.combineTaxonomies) || false
  const oneRowPerRelation = escapeStringForSql(request.payload.oneRowPerRelation) || true
  const includeDataFromSynonyms = escapeStringForSql(request.payload.includeDataFromSynonyms) || true
  const onlyObjectsWithCollectionData = escapeStringForSql(request.payload.onlyObjectsWithCollectionData) || true
  const objectFields = escapeStringForSql(request.payload.objectFields) || []
  const taxonomyFields = escapeStringForSql(request.payload.taxonomyFields) || []
  const taxonomyObjectFields = escapeStringForSql(request.payload.taxonomyObjectFields) || []
  const propertyCollectionFields = escapeStringForSql(request.payload.propertyCollectionFields) || []
  const propertyCollectionObjectFields = escapeStringForSql(request.payload.propertyCollectionObjectFields) || []
  const relationCollectionFields = escapeStringForSql(request.payload.relationCollectionFields) || []
  const relationCollectionObjectFields = escapeStringForSql(request.payload.relationCollectionObjectFields) || []

  // make sure objectId is always included
  if (!objectFields.includes('id')) objectFields.unshift('id')
  // make sure all fields are valid db fields

  getObjectById(id)
    .then((data) => {
      object = data
      return getRelationCollectionsByObject(id)
    })
    .then((relationCollections) => {
      object.relationCollections = relationCollections
      return getPropertyCollectionsByObject(id)
    })
    .then((propertyCollections) => {
      object.propertyCollections = propertyCollections
      return getTaxonomiesByObject(id)
    })
    .then((taxonomies) => {
      object.taxonomies = taxonomies
      return
    })
    .then(() => reply(null, object))
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
