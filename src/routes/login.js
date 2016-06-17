'use strict'

const Joi = require(`joi`)
const login = require(`../handlers/login.js`)

module.exports = {
  method: `POST`,
  path: `/login/{name}/{password}`,
  handler: login,
  config: {
    validate: {
      params: {
        email: Joi.string().min(2).max(200).required(),
        password: Joi.string().min(2).max(200).required()
      }
    }
  }
}
