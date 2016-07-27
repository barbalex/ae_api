'use strict'

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
