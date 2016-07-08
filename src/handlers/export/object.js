/* eslint no-unused-vars:0, no-console:0, max-len:0 */

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
 * passed fields have the form:
 * {
 *   table: xxx,
 *   property: bool,
 *   field: xxx
 * }
 *
 * passed criteria have the form:
 * {
 *   table: xxx,
 *   property: bool,
 *   field: xxx,
 *   value: xxx,
 *   comparator: xxx
 * }
 *
 * test with:
 * http://localhost:8000/export/object?categories=["Flora"]&objectFields=["id"]
 * http://localhost:8000/export/object?objectCriteria=[{"field":"id","value":"15544EBD-51D0-470B-9C34-B6F822EACABF"}]
 * http://localhost:8000/export/object?objectFields=["id"]&objectCriteria=[{"field":"id","value":"15544EBD-51D0-470B-9C34-B6F822EACABF"}]
 * http://localhost:8000/export/object?objectFields=["id"]&objectCriteria=[{"field":"id","value":"15544EBD-51D0-470B-9C34-B6F822EACABF"}]&taxonomyFields=["name"]
 *  http://localhost:8000/export/object?objectFields=["id"]&objectCriteria=[{"field":"category","value":"Moose"}]
 *  http://localhost:8000/export/object?categories=["Flora"]&taxonomyObjectCriteria=[{"field":"Gattung","value":"Rosa"}]
 */

const app = require('ampersand-app')
const Boom = require('boom')
const _ = require('lodash')
const escapeStringForSql = require('../../escapeStringForSql.js')
const prefixCriteriaFieldWithTable = require('../../prefixCriteriaFieldWithTable.js')
const criteriaArrayToSqlString = require('../../criteriaArrayToSqlString.js')
const objectFieldsList = require('../../objectFields.js')
const taxonomyObjectFieldsList = require('../../taxonomyObjectFields.js')
const propertyCollectionObjectFieldsList = require('../../propertyCollectionObjectFields.js')
const relationFieldsList = require('../../relationFields.js')
const objectFieldsList = require('../../objectFields.js')
const taxonomyFieldsList = require('../../taxonomyFields.js')
const taxonomyObjectFieldsList = require('../../taxonomyObjectFields.js')
const propertyCollectionFieldsList = require('../../propertyCollectionFields.js')
const propertyCollectionObjectFieldsList = require('../../propertyCollectionObjectFields.js')
const relationCollectionFieldsList = require('../../relationCollectionFields.js')
const relationFieldsList = require('../../relationFields.js')

module.exports = (request, reply) => {
  const categories = escapeStringForSql(request.query.categories)
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

  // prefix all field names
  objectFields = objectFields.map((of) => `ae.object.${of}`)
  objectCriteria = prefixCriteriaFieldWithTable(
    objectCriteria,
    'object'
  )
  taxonomyFields = taxonomyFields.map((of) => `ae.taxonomy.${of}`)
  taxonomyCriteria = prefixCriteriaFieldWithTable(
    taxonomyCriteria,
    'taxonomy'
  )
  taxonomyObjectFields = taxonomyObjectFields.map((of) => `ae.taxonomy_object.${of}`)
  taxonomyObjectCriteria = prefixCriteriaFieldWithTable(
    taxonomyObjectCriteria,
    'taxonomy_object'
  )
  propertyCollectionFields = propertyCollectionFields.map((of) => `ae.property_collection.${of}`)
  propertyCollectionCriteria = prefixCriteriaFieldWithTable(
    propertyCollectionCriteria,
    'property_collection'
  )
  propertyCollectionObjectFields = propertyCollectionObjectFields.map((of) => `ae.property_collection_object.${of}`)
  propertyCollectionObjectCriteria = prefixCriteriaFieldWithTable(
    propertyCollectionObjectCriteria,
    'property_collection_object'
  )
  relationCollectionFields = relationCollectionFields.map((of) => `ae.relation_collection.${of}`)
  relationCollectionCriteria = prefixCriteriaFieldWithTable(
    relationCollectionCriteria,
    'relation_collection'
  )
  relationCollectionObjectFields = relationCollectionObjectFields.map((of) => `ae.relation_collection_object.${of}`)
  relationCollectionObjectCriteria = prefixCriteriaFieldWithTable(
    relationCollectionObjectCriteria,
    'relation_collection_object'
  )
  const allFields = _.concat(
    objectFields,
    taxonomyFields,
    taxonomyObjectFields,
    propertyCollectionFields,
    propertyCollectionObjectFields,
    relationCollectionFields,
    relationCollectionObjectFields
  )
  const allCriteria = _.concat(
    objectCriteria,
    taxonomyCriteria,
    taxonomyObjectCriteria,
    propertyCollectionCriteria,
    propertyCollectionObjectCriteria,
    relationCollectionCriteria,
    relationCollectionObjectCriteria
  )

  let taxonomyObjectProperties
  let propertyCollectionProperties
  let relationProperties
  console.log('categories:', categories)
  app.db.many(`
    SELECT
      jsonb_object_keys(properties) AS field
    FROM
      ae.taxonomy_object
      INNER JOIN ae.taxonomy
      ON ae.taxonomy_object.taxonomy_id = ae.taxonomy.id
    WHERE
      ae.taxonomy.category IN (${categories})
    GROUP BY field
  `)
    .then((data) => {
      console.log('data:', data)
      taxonomyObjectProperties = data
      console.log('taxonomyObjectProperties:', taxonomyObjectProperties)
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
      // console.log('propertyCollectionProperties:', propertyCollectionProperties)
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
      relationProperties = data
      console.log('relationProperties:', relationProperties)

      /**
       * make sure all json-fields are valid db fields
       * it is not yet possible to do this with standard validation
       * because of the async request
       * but may become with Joi 9.0
       */
      taxonomyObjectFields.forEach((tOF) => {
        if (
          !taxonomyObjectFieldsList.includes(tOF) &&
          !taxonomyObjectProperties.includes(tOF)
        ) {
          return reply(Boom.badRequest(`Die Eigenschaft ${tOF} existiert nicht`))
        }
      })
      // TODO: propertyCollectionObject
      relationCollectionFields.forEach((rCF) => {
        if (
          !relationFieldsList.includes(rCF) &&
          !relationProperties.includes(rCF)
        ) {
          return reply(Boom.badRequest(`Die Eigenschaft ${rCF} existiert nicht`))
        }
      })
      const joinType = onlyObjectsWithCollectionData ? 'INNER' : 'LEFT'

      // select all objects that comply to criteria
      const sql = `
        SELECT
          ae.object.id
        FROM
          ae.object
          INNER JOIN (ae.taxonomy_object
            INNER JOIN ae.taxonomy
            ON ae.taxonomy_object.taxonomy_id = ae.taxonomy.id)
          ON ae.object.id = ae.taxonomy_object.object_id
          INNER JOIN (ae.property_collection_object
            INNER JOIN ae.property_collection
            ON ae.property_collection_object.property_collection_id = ae.property_collection.id)
          ON ae.object.id = ae.property_collection_object.object_id
        ${criteriaArrayToSqlString(allCriteria)}
        GROUP BY
          ae.object.id
      `

      console.log('object.js, sql:', sql)
      return app.db.many(sql)
    })
    .then((data) => reply(null, data))
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
