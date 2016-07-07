'use strict'

const Joi = require('joi')
const object = require('../../handlers/export/object.js')

const criteriaSchema = (fieldItems) => Joi
  .array()
  .items(
    Joi
      .object()
      .keys({
        field: fieldItems,
        value: [Joi.number(), Joi.string()],
        comparator: Joi.any().valid(['=', '<', '<=', '>', '>=', '<>'])
      })
  )
  .allow(null)

const fieldsSchema = (items) => Joi
  .array()
  .items(items)
  .allow(null)

const objectFieldItems = Joi
  .string()
  .valid([
    'id',
    'category',
    'organization_id',
  ])
const taxonomyFieldItems = Joi
  .string()
  .valid([
    'id',
    'name',
    'description',
    'links',
    'last_updated',
    'organization_id',
    'category',
    'is_category_standard',
  ])
const taxonomyObjectFieldItems = Joi
  .string()
  .valid([
    'id',
    'taxonomy_id',
    'parent_id',
    'object_id',
    'name',
    'properties',
  ])
const propertyCollectionFieldItems = Joi
  .string()
  .valid([
    'id',
    'name',
    'description',
    'links',
    'combining',
    'last_updated',
    'organization_id',
    'terms_of_use',
    'imported_by',
  ])
const propertyCollectionObjectFieldItems = Joi
  .string()
  .valid([
    'object_id',
    'property_collection_id',
    'properties',
  ])
const relationCollectionFieldItems = Joi
  .string()
  .valid([
    'id',
    'name',
    'description',
    'links',
    'nature_of_relation',
    'combining',
    'last_updated',
    'organization_id',
    'terms_of_use',
    'imported_by',
  ])
const relationFieldItems = Joi
  .string()
  .valid([
    'id',
    'object_id',
    'relation_collection_id',
    'properties',
  ])

module.exports = {
  method: 'GET',
  path: '/export/object',
  handler: object,
  config: {
    validate: {
      query: {
        objectCriteria: criteriaSchema(objectFieldItems),
        objectFields: fieldsSchema(objectFieldItems),
        taxonomyCriteria: criteriaSchema(taxonomyFieldItems),
        taxonomyFields: fieldsSchema(taxonomyFieldItems),
        taxonomyObjectCriteria: criteriaSchema(taxonomyObjectFieldItems),
        taxonomyObjectFields: fieldsSchema(taxonomyObjectFieldItems),
        propertyCollectionCriteria: criteriaSchema(propertyCollectionFieldItems),
        propertyCollectionFields: fieldsSchema(propertyCollectionFieldItems),
        propertyCollectionObjectCriteria: criteriaSchema(propertyCollectionObjectFieldItems),
        propertyCollectionObjectFields: fieldsSchema(propertyCollectionObjectFieldItems),
        relationCollectionCriteria: criteriaSchema(relationCollectionFieldItems),
        relationCollectionFields: fieldsSchema(relationCollectionFieldItems),
        relationCriteria: criteriaSchema(relationFieldItems),
        relationFields: fieldsSchema(relationFieldItems)
      }
    },
    auth: false
  }
}
