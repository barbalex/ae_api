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
const categories = require('../../categories.js')

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
const propertyCollectionFieldItems = Joi
  .string()
  .valid(propertyCollectionFields)
const relationCollectionFieldItems = Joi
  .string()
  .valid(relationCollectionFields)

module.exports = {
  method: 'GET',
  path: '/export/object',
  handler: object,
  config: {
    validate: {
      query: {
        categories: Joi.array().min(1).max(5).items(Joi.string().valid(categories)).required(),
        objectCriteria: criteriaSchema(objectFieldItems),
        objectFields: fieldsSchema(objectFieldItems),
        taxonomyCriteria: criteriaSchema(taxonomyFieldItems),
        taxonomyFields: fieldsSchema(taxonomyFieldItems),
        taxonomyObjectCriteria: criteriaSchema(Joi.string()),
        taxonomyObjectFields: fieldsSchema(Joi.string()),
        propertyCollectionCriteria: criteriaSchema(propertyCollectionFieldItems),
        propertyCollectionFields: fieldsSchema(propertyCollectionFieldItems),
        propertyCollectionObjectCriteria: criteriaSchema(Joi.string()),
        propertyCollectionObjectFields: fieldsSchema(Joi.string()),
        relationCollectionCriteria: criteriaSchema(relationCollectionFieldItems),
        relationCollectionFields: fieldsSchema(relationCollectionFieldItems),
        relationCriteria: criteriaSchema(Joi.string()),
        relationFields: fieldsSchema(Joi.string())
      }
    },
    auth: false
  }
}
