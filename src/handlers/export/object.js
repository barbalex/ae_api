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
 * http://localhost:8000/export/object?objectCriteria=[{"field":"id","value":"15544EBD-51D0-470B-9C34-B6F822EACABF"}]
 * http://localhost:8000/export/object?objectFields=["id"]&objectCriteria=[{"field":"id","value":"15544EBD-51D0-470B-9C34-B6F822EACABF"}]
 *
 */

const app = require('ampersand-app')
const Boom = require('boom')
const escapeStringForSql = require('../../escapeStringForSql.js')
const criteriaArrayToSqlString = require('../../criteriaArrayToSqlString.js')

module.exports = (request, reply) => {
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

  // parse passed values
  if (objectCriteria) objectCriteria = escapeStringForSql(objectCriteria)
  if (objectFields) objectFields = escapeStringForSql(objectFields)
  if (taxonomyCriteria) taxonomyCriteria = escapeStringForSql(taxonomyCriteria)
  if (taxonomyFields) taxonomyFields = escapeStringForSql(taxonomyFields)
  if (taxonomyObjectCriteria) taxonomyObjectCriteria = escapeStringForSql(taxonomyObjectCriteria)
  if (taxonomyObjectFields) taxonomyObjectFields = escapeStringForSql(taxonomyObjectFields)
  if (propertyCollectionCriteria) propertyCollectionCriteria = escapeStringForSql(propertyCollectionCriteria)
  if (propertyCollectionFields) propertyCollectionFields = escapeStringForSql(propertyCollectionFields)
  if (propertyCollectionObjectCriteria) propertyCollectionObjectCriteria = escapeStringForSql(propertyCollectionObjectCriteria)
  if (propertyCollectionObjectFields) propertyCollectionObjectFields = escapeStringForSql(propertyCollectionObjectFields)
  if (relationCollectionCriteria) relationCollectionCriteria = escapeStringForSql(relationCollectionCriteria)
  if (relationCollectionFields) relationCollectionFields = escapeStringForSql(relationCollectionFields)
  if (relationCollectionObjectCriteria) relationCollectionObjectCriteria = escapeStringForSql(relationCollectionObjectCriteria)
  if (relationCollectionObjectFields) relationCollectionObjectFields = escapeStringForSql(relationCollectionObjectFields)

  // give non values an empty array
  objectCriteria = objectCriteria || []
  objectFields = objectFields || []
  taxonomyCriteria = taxonomyCriteria || []
  taxonomyFields = taxonomyFields || []
  taxonomyObjectCriteria = taxonomyObjectCriteria || []
  taxonomyObjectFields = taxonomyObjectFields || []
  propertyCollectionCriteria = propertyCollectionCriteria || []
  propertyCollectionFields = propertyCollectionFields || []
  propertyCollectionObjectCriteria = propertyCollectionObjectCriteria || []
  propertyCollectionObjectFields = propertyCollectionObjectFields || []
  relationCollectionCriteria = relationCollectionCriteria || []
  relationCollectionFields = relationCollectionFields || []
  relationCollectionObjectCriteria = relationCollectionObjectCriteria || []
  relationCollectionObjectFields = relationCollectionObjectFields || []

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
  console.log('object.js, sql:', sql)

  app.db.many(sql)
    .then((data) => reply(null, data))
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
