'use strict'

/**
 * test with:
 * correct: http://localhost:8000/nodes/category/Fauna
 * error: http://localhost:8000/nodes/wrongCategoryName/Fauna
 * error: http://localhost:8000/nodes/category/wrongId
 * correct: http://localhost:8000/nodes/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391e0
 * error: http://localhost:8000/nodes/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391ee
 * correct: http://localhost:8000/nodes/taxonomy_object/ff56b132-ecdf-4301-8c62-b24b3e258b93
 * error: http://localhost:8000/nodes/taxonomy_object/ff56b132-ecdf-4301-8c62-b24b3e258b33
 *
 */

const Joi = require('joi')
const node = require('../../handlers/nodes/node.js')

module.exports = {
  method: `GET`,
  path: `/nodes/{type}/{id}`,
  handler: node,
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
    auth: false
  }
}
