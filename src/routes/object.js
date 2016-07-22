'use strict'

/**
 * test with:
 * correct: http://localhost:8000/object/F59DA94B-FF9F-429E-9BAE-02334C2C98AF
 * error: http://localhost:8000/object/wrongId
 */

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
    },
    auth: false
  }
}
