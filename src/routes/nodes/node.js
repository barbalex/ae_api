'use strict'

const Joi = require('joi')
const node = require('../../handlers/nodes/node.js')

module.exports = {
  method: `GET`,
  path: `/node/{path}/{id?}`,
  handler: node,
  config: {
    validate: {
      params: {
        path: Joi
          .array()
          .min(0)
          .max(10)
          .items(Joi.string())
          .required(),
        id: Joi
          .string()
          .guid(),
      }
    },
    auth: false
  }
}
