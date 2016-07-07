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
 *
 * passed criteria have the form:
 * {
 *   field: xxx,
 *   value: xxx,
 *   comparator: xxx
 * }
 *
 * test with:
 * http://localhost:8000/export/object?objectFields=["id"]
 *
 */

const app = require('ampersand-app')
const Boom = require('boom')
const getObjectById = require('../../getObjectById.js')
const getRelationCollectionsByObject = require('../../getRelationCollectionsByObject.js')
const getPropertyCollectionsByObject = require('../../getPropertyCollectionsByObject.js')
const getTaxonomiesByObject = require('../../getTaxonomiesByObject.js')
const escapeStringForSql = require('../../escapeStringForSql.js')
const criteriaArrayToSqlString = require('../../criteriaArrayToSqlString.js')

module.exports = (request, reply) => {
  console.log('request.query:', request.query)
  console.log('request.query.objectFields:', request.query.objectFields)
  console.log('request.query.objectFields parsed:', JSON.parse(request.query.objectFields))
  const combineTaxonomies = escapeStringForSql(request.query.combineTaxonomies) || false
  const oneRowPerRelation = escapeStringForSql(request.query.oneRowPerRelation) || true
  const includeDataFromSynonyms = escapeStringForSql(request.query.includeDataFromSynonyms) || true
  const onlyObjectsWithCollectionData = escapeStringForSql(request.query.onlyObjectsWithCollectionData) || true
  let {
    objectCriteria,
    objectFields,
    taxonomyCriteria,
    taxonomyFields,
    taxonomyObjectCriteria,
    taxonomyObjectFields,
    propertyCollectionCriteria,
    propertyCollectionFields,
    propertyCollectionObjectCriteria,
    propertyCollectionObjectFields,
    relationCollectionCriteria,
    relationCollectionFields,
    relationCollectionObjectCriteria,
    relationCollectionObjectFields,
  } = request.query

  if (objectCriteria) objectCriteria = JSON.parse(objectCriteria)
  if (objectFields) objectFields = JSON.parse(objectFields)
  if (taxonomyCriteria) taxonomyCriteria = JSON.parse(taxonomyCriteria)
  if (taxonomyFields) taxonomyFields = JSON.parse(taxonomyFields)
  if (taxonomyObjectCriteria) taxonomyObjectCriteria = JSON.parse(taxonomyObjectCriteria)
  if (taxonomyObjectFields) taxonomyObjectFields = JSON.parse(taxonomyObjectFields)
  if (propertyCollectionCriteria) propertyCollectionCriteria = JSON.parse(propertyCollectionCriteria)
  if (propertyCollectionFields) propertyCollectionFields = JSON.parse(propertyCollectionFields)
  if (propertyCollectionObjectCriteria) propertyCollectionObjectCriteria = JSON.parse(propertyCollectionObjectCriteria)
  if (propertyCollectionObjectFields) propertyCollectionObjectFields = JSON.parse(propertyCollectionObjectFields)
  if (relationCollectionCriteria) relationCollectionCriteria = JSON.parse(relationCollectionCriteria)
  if (relationCollectionFields) relationCollectionFields = JSON.parse(relationCollectionFields)
  if (relationCollectionObjectCriteria) relationCollectionObjectCriteria = JSON.parse(relationCollectionObjectCriteria)
  if (relationCollectionObjectFields) relationCollectionObjectFields = JSON.parse(relationCollectionObjectFields)

  // make sure objectId is always included
  if (!objectFields.includes('id')) objectFields.unshift('id')

  // TODO: make sure all fields are valid db fields
  // if not: BOOM

  // TODO: make sure all criteria have values and valid comparators
  // if not: BOOM

  const joinType = onlyObjectsWithCollectionData ? 'INNER' : 'LEFT'

  // select
  const sql = `
  SELECT
    ${objectFields}
  FROM
    ae.object
  ${criteriaArrayToSqlString(objectCriteria)}
  `

  app.db.many(sql)
    .then((data) => reply(null, data))
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
