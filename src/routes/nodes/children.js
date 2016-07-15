'use strict'

/**
 * test with:
 * http://localhost:8000/nodes/category/Fauna/children
 * http://localhost:8000/nodes/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391e0/children
 */

const Joi = require('joi')
const children = require('../../handlers/nodes/children.js')

module.exports = {
  method: `GET`,
  path: `/nodes/{type}/{id}/children`,
  handler: children,
  config: {
    validate: {
      params: {
        type: Joi
          .string()
          .valid(['category', 'taxonomy', 'taxonomy_object'])
          .required(),
        id: Joi
          .string()
          .required(),
      }
    },
    auth: false,
  }
}
