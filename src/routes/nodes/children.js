'use strict'

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
