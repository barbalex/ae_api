'use strict'

/**
 * test with:
 * correct: http://localhost:8000/path/F59DA94B-FF9F-429E-9BAE-02334C2C98AF/5444e7eb-177f-4faf-ba44-0e3da1b391e0
 * correct: http://localhost:8000/path/F59DA94B-FF9F-429E-9BAE-02334C2C98AF
 */

const Joi = require('joi')
const path = require('../handlers/path.js')

module.exports = {
  method: `GET`,
  path: `/path/{objectId}/{taxonomyId?}`,
  handler: path,
  config: {
    validate: {
      params: {
        taxonomyId: Joi.string().guid(),
        objectId: Joi.string().guid().required(),
      }
    },
    auth: false
  }
}
