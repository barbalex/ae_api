'use strict'

/**
 * test with:
 * correct: http://localhost:8000/nodes/taxonomy_object/08bda0ac-e382-482a-b9da-e06e9a421540/children
 * error: http://localhost:8000/nodes/taxonomy_object/08bda0ac-e382-482a-b9da-e06e9a421540/children
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
