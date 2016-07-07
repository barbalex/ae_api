'use strict'

const Joi = require('joi')
const object = require('../../handlers/export/object.js')
const criteriaSchema = Joi
  .array()
  .items(
    Joi
      .object()
      .keys({
        field: Joi.string(),
        value: [Joi.number(), Joi.string()],
        comparator: Joi.any().valid(['=', '<', '<=', '>', '>=', '<>'])
      })
  )
  .allow(null)
const fieldsSchema = Joi
  .array()
  .allow(null)

module.exports = {
  method: 'GET',
  path: '/export/object',
  handler: object,
  config: {
    validate: {
      query: {
        objectCriteria: criteriaSchema,
        objectFields: fieldsSchema,
        taxonomyCriteria: criteriaSchema,
        taxonomyFields: fieldsSchema,
        taxonomyObjectCriteria: criteriaSchema,
        taxonomyObjectFields: fieldsSchema,
        propertyCollectionCriteria: criteriaSchema,
        propertyCollectionFields: fieldsSchema,
        propertyCollectionObjectCriteria: criteriaSchema,
        propertyCollectionObjectFields: fieldsSchema,
        relationCollectionCriteria: criteriaSchema,
        relationCollectionFields: fieldsSchema,
        relationCollectionObjectCriteria: criteriaSchema,
        relationCollectionObjectFields: fieldsSchema
      }
    },
    auth: false
  }
}
