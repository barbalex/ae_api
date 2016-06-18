'use strict'

const Joi = require('joi')
const login = require('../handlers/login.js')

module.exports = {
  method: `POST`,
  path: `/login`,
  handler: login,
  config: {
    validate: {
      payload: {
        name: Joi.string().min(2).max(200).required(),
        password: Joi.string().min(2).max(200).required()
      }
    }
  }
}
