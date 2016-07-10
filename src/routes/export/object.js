'use strict'

const Joi = require('joi')
const object = require('../../handlers/export/object.js')
const categories = require('../../categories.js')

module.exports = {
  method: 'GET',
  path: '/export/object',
  handler: object,
  config: {
    validate: {
      query: {
        categories: Joi
          .array()
          .min(1)
          .max(5)
          .items(
            Joi
              .string()
              .valid(categories)
          )
          .required(),
        fields: Joi
          .array()
          .items(
            Joi
              .object()
              .keys({
                table: Joi
                  .string()
                  .required(),
                property: Joi
                  .boolean(),
                field: Joi
                  .string()
                  .required(),
              })
          )
          .required(),
        criteria: Joi
          .array()
          .items(
            Joi
              .object()
              .keys({
                table: Joi
                  .string()
                  .required(),
                property: Joi
                  .boolean(),
                field: Joi
                  .string()
                  .required(),
                value: [
                  Joi.number(),
                  Joi.string()
                ]
                .required(),
                comparator: Joi
                  .string()
                  .valid(['=', '<', '<=', '>', '>=', '<>']),
              })
          )
          .allow(null),
        combineTaxonomies: Joi.boolean(),
        oneRowPerRelation: Joi.boolean(),
        includeDataFromSynonyms: Joi.boolean(),
        onlyObjectsWithCollectionData: Joi.boolean()
      }
    },
    auth: false
  }
}
