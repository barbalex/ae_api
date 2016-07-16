'use strict'

/**
 * test with:
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
    auth: false,
  }
}
