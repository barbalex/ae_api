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
 * http://localhost:8000/export/object?categories=["Flora"]&fields=[{"table":"object","field":"id"}]
 * http://localhost:8000/export/object?categories=["Flora"]&fields=[{"table":"object","field":"id"}]&criteria=[{"table":"object","field":"id","value":"15544EBD-51D0-470B-9C34-B6F822EACABF"}]
 *  http://localhost:8000/export/object?categories=["Flora"]&fields=[{"table":"object","field":"id"},{"table":"taxonomy","field":"name"}]&criteria=[{"table":"object","field":"id","value":"15544EBD-51D0-470B-9C34-B6F822EACABF"}]
 * http://localhost:8000/export/object?fields=[{"table":"object","field":"id"}]&criteria=[{"field":"id","value":"15544EBD-51D0-470B-9C34-B6F822EACABF"}]&taxonomyFields=["name"]
 *  http://localhost:8000/export/object?fields=[{"table":"object","field":"id"}]&criteria=[{"field":"category","value":"Moose"}]
 *  http://localhost:8000/export/object?categories=["Flora"]&taxonomyObjectCriteria=[{"field":"Gattung","value":"Rosa"}]
 */

const app = require('ampersand-app')
const Boom = require('boom')
const _ = require('lodash')
const escapeStringForSql = require('../../escapeStringForSql.js')
const prefixCriteriaFieldWithTable = require('../../prefixCriteriaFieldWithTable.js')
const criteriaToSqlString = require('../../criteriaToSqlString.js')
const fieldsToSqlString = require('../../fieldsToSqlString.js')
const fieldsByTable = require('../../fieldsByTable.js')

module.exports = (request, reply) => {
  const {
    categories,
    fields,
    criteria = [],
    combineTaxonomies = false,
    oneRowPerRelation = true,
    includeDataFromSynonyms = true,
    onlyObjectsWithCollectionData = true,
  } = request.query

  // make sure objectId is always included
  const idField = fields.find((f) => f.table === 'object' && f.field === 'id')
  if (!idField) {
    fields.unshift({
      table: 'object',
      field: 'id'
    })
  }

  const propertyFields = {
    taxonomy_object: [],
    property_collection_object: [],
    relation: []
  }
  console.log('categories:', categories)
  const categoriesList = categories.map((c) => `'${c}'`)
  const sql = `
    SELECT
      jsonb_object_keys(properties) AS field
    FROM
      ae.taxonomy_object
      INNER JOIN ae.taxonomy
      ON ae.taxonomy_object.taxonomy_id = ae.taxonomy.id
    WHERE
      ae.taxonomy.category IN (${categoriesList.join(',')})
    GROUP BY field
  `
  app.db.many(sql)
    .then((data) => {
      console.log('taxonomy_object property fields:', data)
      propertyFields.taxonomy_object = data
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
      propertyFields.property_collection_object = data
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
      propertyFields.relation = data
      console.log('propertyFields:', propertyFields)

      /**
       * make sure all property-fields are valid db fields
       * it is not yet possible to do this with standard validation
       * because of the async request
       * but may become with Joi 9.0
       */
      fields.forEach((f) => {
        if (!Object.keys(fieldsByTable).includes(f.table)) {
          return reply(Boom.badRequest(`Die Tabelle '${f.table}' existiert nicht`))
        }
        if (
          (
            f.property &&
            !propertyFields[f.table].includes(f.field)
          ) ||
          !fieldsByTable[f.table].includes(f.field)
        ) {
          return reply(Boom.badRequest(`Das Feld '${f.field}' existiert nicht`))
        }
      })
      const joinType = onlyObjectsWithCollectionData ? 'INNER' : 'LEFT'

      // select all objects that comply to criteria
      // TODO: list fields form fields array
      const sql = `
        SELECT
          ${fieldsToSqlString(fields)}
        FROM
          ae.object
          ${joinType} JOIN (ae.taxonomy_object
            INNER JOIN ae.taxonomy
            ON ae.taxonomy_object.taxonomy_id = ae.taxonomy.id)
          ON ae.object.id = ae.taxonomy_object.object_id
          ${joinType} JOIN (ae.property_collection_object
            INNER JOIN ae.property_collection
            ON ae.property_collection_object.property_collection_id = ae.property_collection.id)
          ON ae.object.id = ae.property_collection_object.object_id
          ${joinType} JOIN ((ae.relation_collection_object
            INNER JOIN ae.relation_collection
            ON ae.relation_collection_object.relation_collection_id = ae.relation_collection.id)
            INNER JOIN (ae.relation
              INNER JOIN ae.relation_partner
              ON ae.relation_partner.relation_id = ae.relation.id)
            ON ae.relation.object_id = ae.relation_collection_object.object_id
            AND ae.relation.relation_collection_id = ae.relation_collection_object.relation_collection_id)
          ON ae.object.id = ae.relation_collection_object.object_id
        ${criteriaToSqlString(criteria)}
        GROUP BY
          ${fieldsToSqlString(fields)}
      `

      console.log('object.js, sql:', sql)
      return app.db.many(sql)
    })
    .then((data) => reply(null, data))
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
