'use strict'

const Joi = require('joi')
const objectById = require('../handlers/objectById.js')

module.exports = {
  method: `GET`,
  path: `/object/{id}`,
  handler: objectById,
  config: {
    validate: {
      params: {
        id: Joi.string().guid()
      }
    }
  }
}
