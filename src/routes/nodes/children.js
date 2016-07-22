'use strict'

/**
 * test with:
 * correct: http://localhost:8000/nodes/taxonomy_object/ff56b132-ecdf-4301-8c62-b24b3e258b93/children
 * error: http://localhost:8000/nodes/taxonomy_object/ff56b132-ecdf-4301-8c62-b24b3e258b33/children
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
