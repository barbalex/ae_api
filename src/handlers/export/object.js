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

  // escape passed values
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

  // TODO: make sure all json-fields are valid db fields
  // if not: BOOM
  // it is not yet possible to do this with standard validation
  // because of the async request
  // but may become with Joi 9.0
  // app.db.many('SELECT * FROM ae.object')
  // example: select jsonb_object_keys(properties) as fields from ae.taxonomy_object group by fields

  // TODO: make sure all criteria have values and valid comparators
  // if not: BOOM

  const joinType = onlyObjectsWithCollectionData ? 'INNER' : 'LEFT'

  let taxonomyProperties
  let propertyCollectionProperties
  let relationCollectionProperties
  app.db.many(`
    SELECT
      fieldslist.taxonomy_id, array_agg(fieldslist.field) AS fields
    FROM (
      SELECT
        taxonomy_id, jsonb_object_keys(properties) AS field
      FROM
        ae.taxonomy_object
      GROUP BY taxonomy_id, field)
      AS fieldslist
    GROUP BY fieldslist.taxonomy_id
  `)
    .then((data) => {
      console.log('data:', data)
      taxonomyProperties = data
      console.log('taxonomyProperties:', taxonomyProperties)
      return app.db.many(`
        SELECT
          fieldslist.property_collection_id, array_agg(fieldslist.field) AS fields
        FROM (
          SELECT
              property_collection_id, jsonb_object_keys(properties) AS field
            FROM
              ae.property_collection_object
          GROUP BY property_collection_id, field)
          AS fieldslist
        GROUP BY fieldslist.property_collection_id
      `)
    })
    .then((data) => {
      propertyCollectionProperties = data
      console.log('propertyCollectionProperties:', propertyCollectionProperties)
      return app.db.many(`
        SELECT
          fieldslist.relation_collection_id, array_agg(fieldslist.field) AS fields
        FROM (
          SELECT
            relation_collection_id, jsonb_object_keys(properties) AS field
          FROM
            ae.relation
          GROUP BY relation_collection_id, field)
          AS fieldslist
      GROUP BY fieldslist.relation_collection_id
      `)
    })
    .then((data) => {
      relationCollectionProperties = data
      console.log('relationCollectionProperties:', relationCollectionProperties)
      // select
      const sql = `
        SELECT
          ${objectFields}
        FROM
          ae.object
        ${criteriaArrayToSqlString(objectCriteria)}
      `
      console.log('object.js, sql:', sql)
      return app.db.many(sql)
    })
    .then((data) => reply(null, data))
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
