'use strict'

const Joi = require('joi')
const node = require('../../handlers/nodes/node.js')

module.exports = {
  method: `GET`,
  path: `/node/{type}/{id}`,
  handler: node,
  config: {
    validate: {
      params: {
        type: Joi
          .string()
          .valid(['category', 'taxonomy', 'taxonomy_object', 'object'])
          .required(),
        id: Joi.string().required(),
      }
    },
    auth: false
  }
}
