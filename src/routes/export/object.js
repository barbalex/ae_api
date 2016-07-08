'use strict'

const Joi = require('joi')
const object = require('../../handlers/export/object.js')
const objectFields = require('../../objectFields.js')
const taxonomyFields = require('../../taxonomyFields.js')
const taxonomyObjectFields = require('../../taxonomyObjectFields.js')
const propertyCollectionFields = require('../../propertyCollectionFields.js')
const propertyCollectionObjectFields = require('../../propertyCollectionObjectFields.js')
const relationCollectionFields = require('../../relationCollectionFields.js')
const relationFields = require('../../relationFields.js')

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
  .valid(objectFields)
const taxonomyFieldItems = Joi
  .string()
  .valid(taxonomyFields)
const taxonomyObjectFieldItems = Joi
  .string()
  .valid(taxonomyObjectFields)
const propertyCollectionFieldItems = Joi
  .string()
  .valid(propertyCollectionFields)
const propertyCollectionObjectFieldItems = Joi
  .string()
  .valid(propertyCollectionObjectFields)
const relationCollectionFieldItems = Joi
  .string()
  .valid(relationCollectionFields)
const relationFieldItems = Joi
  .string()
  .valid(relationFields)

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
