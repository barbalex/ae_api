'use strict'

const Joi = require(`joi`)
const login = require(`../handlers/login.js`)

module.exports = {
  method: `POST`,
  path: `/login`,
  handler: login,
  config: {
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().min(2).max(200).required()
      }
    }
  }
}
