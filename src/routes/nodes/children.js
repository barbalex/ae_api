'use strict'

/**
 * test with:
 * correct: http://localhost:8000/nodes/category/Fauna/children
 * error: http://localhost:8000/nodes/wrongCategory/Fauna/children
 * error: http://localhost:8000/nodes/category/wrongId/children
 * correct: http://localhost:8000/nodes/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391e0/children
 * error: http://localhost:8000/nodes/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391ee/children
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