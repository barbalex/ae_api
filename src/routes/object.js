'use strict'

const Joi = require('joi')
const object = require('../handlers/object.js')

module.exports = {
  method: `GET`,
  path: `/object/{id}`,
  handler: object,
  config: {
    validate: {
      params: {
        id: Joi.string().guid()
      }
    },
    auth: false
  }
}
